const { TOKEN } = require("../Constants")
const { Wallet, Account: AccountWallet, init, PDexV3, wasm } = require('incognito-chain-web-js');
const { CoinServiceApi } = require("../CoinService/CoinServiceApi");
const { wait } = require("../../Utils/Timer");
const { ENV } = require("../../../global");

class BaseAction {
    constructor(keyInfo, node) {
        this.keyInfo = keyInfo
        this.node = node
    }
}

class CliAction extends BaseAction {
    async getBalanceAll() {
        return await this.node.cli.getBalanceAll(this.keyInfo.PrivateKey)
    }

    async getBalance(token = TOKEN.PRV) {
        return await this.node.cli.getBalance(this.keyInfo.PrivateKey, token)
    }

    async send(receiver, amount, token = TOKEN.PRV) {
        return await this.node.cli.send(this.keyInfo.PrivateKey, receiver.paymentK, amount, token)
    }

    async addOrder(pairID, nftId, sellToken, sellAmount, minAcceptAmount) {
        return await this.node.cli.addOrder(this.keyInfo.PrivateKey, pairID, nftId, sellToken, sellAmount, minAcceptAmount)
    }

    async trade(selToken, buyToken, sellAmount, tradingFee, minAcceptAmount, tradingPath, prvFee) {
        return await this.node.cli.trade(this.keyInfo.PrivateKey, selToken, buyToken, sellAmount, tradingFee,
            minAcceptAmount, tradingPath, prvFee)
    }

    async withdrawLpFee(pairId, nftId) {
        return await this.node.cli.withdrawLpFee(this.keyInfo.PrivateKey, pairId, nftId)
    }

    async consolidate() {
        return await this.node.cli.consolidate(this.keyInfo.PrivateKey, tokenId)
    }

    async printUTXO(tokenId) {
        return await this.node.cli.printUTXO(this.keyInfo.PrivateKey, tokenId)
    }

    async withrawOrder(orderId, pairId, nftId, tokenId) {
        return await this.node.cli.withrawOrder(this.keyInfo.PrivateKey, orderId, pairId, nftId, tokenId)
    }

    async stake(validator, rewarReceiver) {
        return await this.node.cli.stake(this.keyInfo.PrivateKey, validator.miningK, validator.paymentK, rewarReceiver.paymentK)
    }

    async unstake(validator) {
        return await this.node.cli.unstake(this.keyInfo.PrivateKey, validator.miningK, validator.paymentK)
    }

    async waitBalanceChange({ tokenId = TOKEN.PRV, from = 0, amountChange = 1, checkInterval = 10, timeout = 90 }) {
        var currentBal = await this.getBalance(tokenId)
        while (timeout > 0) {
            let diff = currentBal - from
            if (diff > amountChange) { break } else { await wait(checkInterval) }
            timeout = timeout - checkInterval
            currentBal = await this.getBalance(tokenId)
        }
        return currentBal
    }

    async getMyNtfIds() {
        //todo
    }
}

class RpcAction extends BaseAction {
    async makeRawTx(receiver, amount, fee = 10, privacy = 1) {
        return await this.node.rpc.createRawTx(this.keyInfo.PrivateKey, receiver.paymentK, amount, fee, privacy)
    }
}

class SdkAction extends BaseAction {

    async init({
        coinService = ENV.CoinService.url,
        fullNode = ENV.FullNode.url,
        pubsubService = ENV.PubsubService.url,
        requestService = ENV.WebService.url,
        apiService = ENV.Backend.url
    } = {}) {

        console.log("Initialize a new sdk instance");
        await init();
        await wasm.setShardCount('', 8);
        const LocalStorage = require('node-localstorage').LocalStorage;
        let localStorage = new LocalStorage('./.cache');
        let authToken = new Date().getTime();
        authToken = String(authToken)
        console.log("Initialize a new sdk wallet");
        this.sdkWallet = new AccountWallet(Wallet);
        this.sdkWallet.setRPCCoinServices(coinService);
        this.sdkWallet.setRPCClient(fullNode);
        this.sdkWallet.setRPCTxServices(pubsubService);
        this.sdkWallet.setRPCRequestServices(requestService);
        this.sdkWallet.setAuthToken(authToken);
        this.sdkWallet.setRPCApiServices(apiService, authToken);
        this.sdkWallet.setStorageServices(localStorage)
        if (this.keyInfo != null) {
            console.log("Set private key");
            await this.sdkWallet.setKey(this.keyInfo.PrivateKey)
        }
        console.log("Initialize a new pDEXv3 instance");
        this.pDexV3Instance = new PDexV3();
        this.pDexV3Instance.setAccount(this.sdkWallet);
        this.pDexV3Instance.setAuthToken(authToken);
        this.pDexV3Instance.setRPCTradeService(coinService);
        this.pDexV3Instance.setRPCClient(fullNode);
        this.pDexV3Instance.setStorageServices(localStorage);
        this.pDexV3Instance.setRPCApiServices(apiService);
    }

    async getBalance(tokenId = TOKEN.PRV, version = 2) {
        let bal = await this.sdkWallet.getBalance({ tokenID: tokenId, version: version })
        return parseInt(bal)
    }

    async getBalanceAll() {
        let cs = new CoinServiceApi()
        let coinIndex = await cs.getCoinIndex(this.keyInfo.OTAPrivateKey)
        let balanceResult = {}
        const tasks = Object.keys(coinIndex).map(async tokenID => {
            const balance = await this.getBalance(tokenID)
            if (balance > 0) {
                balanceResult[tokenID] = parseInt(balance)
            }
        })
        await Promise.all(tasks)
        return balanceResult;
    }

    async sendPRV(receiver, amount, fee = 100, memo = "") {
        let paymentInfosParam = []
        paymentInfosParam[0] = {
            PaymentAddress: receiver.paymentK,
            Amount: amount,
            Message: memo,
        };
        let res = await this.sdkWallet.createAndSendNativeToken({
            transfer: {
                prvPayments: paymentInfosParam,
                fee: fee,
                memo
            },
            extra: { isEncryptMessage: true, txType: 0, version },
        });
        return res.txId;

    }

    async sendToken(token, receiver, amount, fee = 100, memo = "") {
        let tokenPaymentInfo = [{
            PaymentAddress: receiver.paymentK,
            Amount: amount,
            Message: memo,
        }, ];
        await account.accountSender.resetProgressTx();
        let res = await account.accountSender.createAndSendPrivacyToken({
            transfer: {
                tokenID: token,
                tokenPayments: tokenPaymentInfo,
                fee: fee,
                info: memo,
            },
            extra: { txType: 0, version: version },
        });
        return res.txId;
    }

    async swap({
        tokenSell,
        tokenBuy,
        amount,
        tradePath,
        tradingFee,
        feeToken,
        minAcceptableAmount,
        version = 2,
        networkFee = 100,
        memo = ""
    }) {
        let res = await account.pDexV3Instance.createAndSendSwapRequestTx({
            transfer: {
                fee: networkFee,
                memo
            },
            extra: {
                tokenSell,
                sellAmount: String(amount),
                tokenBuy,
                tradingFee,
                tradePath,
                feeToken,
                version,
                minAcceptableAmount: String(minAcceptableAmount)
            }
        });
        return res.txId;
    }

    async getNftData(version = 2) {
        return (await this.pDexV3Instance.getNFTTokenData({ version })).list;
    }

    async addOrder({
        poolPairID,
        tokenIDToSell,
        tokenIDToBuy,
        sellAmount,
        buyAmount,
        version = 2,
        networkFee = 100,
        info = ''
    }) {
        let res = await this.pDexV3Instance.createAndSendOrderRequestTx({
            transfer: {
                fee: networkFee,
                info
            },
            extra: {
                tokenIDToSell,
                poolPairID,
                sellAmount: String(sellAmount),
                version,
                minAcceptableAmount: String(buyAmount),
                tokenIDToBuy,
            }
        });
        return res.txId;
    }

    async cancelOrder({
        token1ID,
        token2ID,
        poolPairID,
        orderID,
        amount = '0',
        txType = 0,
        nftID,
        version = 2,
        networkFee = 100,
        info = ''
    }) {
        let res = await this.pDexV3Instance.createAndSendWithdrawOrderRequestTx({
            transfer: {
                fee: networkFee,
                info
            },
            extra: {
                withdrawTokenIDs: [token1ID, token2ID],
                poolPairID,
                orderID,
                amount: amount,
                version,
                txType,
                nftID,
            }
        });
        return res.txId;

    }
}

module.exports = { CliAction, RpcAction, SdkAction }