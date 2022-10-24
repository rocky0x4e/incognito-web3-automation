const { TOKEN } = require("../Constants")
const { Wallet, Account: AccountWallet, PDexV3, } = require('incognito-chain-web-js');
const { CoinServiceApi } = require("../CoinService/CoinServiceApi");
const { wait } = require("../../Utils/Timer");
const { ENV } = require("../../../global");
const { IncAccount } = require("./Account");
class BaseAction {
    constructor(account) {
        IncAccount.isValid(account)
        this.account = account
    }
}

class CliAction extends BaseAction {
    async getBalanceAll() {
        return await this.account.node.cli.getBalanceAll(this.account.privateK)
    }

    async getBalance(token = TOKEN.PRV) {
        return await this.account.node.cli.getBalance(this.account.privateK, token)
    }

    async send(receiver, amount, token = TOKEN.PRV) {
        IncAccount.isValid(receiver)
        return await this.account.node.cli.send(this.account.privateK, receiver.paymentK, amount, token)
    }

    async addOrder(pairID, nftId, sellToken, sellAmount, minAcceptAmount) {
        return await this.account.node.cli.addOrder(this.account.privateK, pairID, nftId, sellToken, sellAmount, minAcceptAmount)
    }

    async trade(selToken, buyToken, sellAmount, tradingFee, minAcceptAmount, tradingPath, prvFee) {
        return await this.account.node.cli.trade(this.account.privateK, selToken, buyToken, sellAmount, tradingFee,
            minAcceptAmount, tradingPath, prvFee)
    }

    async withdrawLpFee(pairId, nftId) {
        return await this.account.node.cli.withdrawLpFee(this.account.privateK, pairId, nftId)
    }

    async consolidate() {
        return await this.account.node.cli.consolidate(this.account.privateK, tokenId)
    }

    async printUTXO(tokenId) {
        return await this.account.node.cli.printUTXO(this.account.privateK, tokenId)
    }

    async withrawOrder(orderId, pairId, nftId, tokenId) {
        return await this.account.node.cli.withrawOrder(this.account.privateK, orderId, pairId, nftId, tokenId)
    }

    async stake(validator, rewarReceiver) {
        IncAccount.isValid(validator, rewarReceiver)
        return await this.account.node.cli.stake(this.account.privateK, validator.miningK, validator.paymentK, rewarReceiver.paymentK)
    }

    async unstake(validator) {
        IncAccount.isValid(validator)
        return await this.account.node.cli.unstake(this.account.privateK, validator.miningK, validator.paymentK)
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
}

class RpcAction extends BaseAction {
    // todo
}

class SdkAction extends BaseAction {
    constructor({
        incAccount = account,
        coinService = ENV.urlCoinService,
        fullNode = ENV.urlFullNode,
        pubsubService = ENV.urlPubsubService,
        requestService = ENV.urlWebService,
        apiService = ENV.urlBackend
    }) {
        super(incAccount)
        const LocalStorage = require('node-localstorage').LocalStorage;
        let localStorage = new LocalStorage('./scratch', 2000000000);
        let authToken = new Date().getTime();
        authToken = String(authToken)
        this.sdkWallet = new AccountWallet(Wallet);
        this.sdkWallet.setRPCCoinServices(coinService);
        this.sdkWallet.setRPCClient(fullNode);
        this.sdkWallet.setRPCTxServices(pubsubService);
        this.sdkWallet.setRPCRequestServices(requestService);
        this.sdkWallet.setAuthToken(authToken);
        this.sdkWallet.setRPCApiServices(apiService, authToken);
        this.sdkWallet.setStorageServices(localStorage)

        this.pDexV3Instance = new PDexV3();
        this.pDexV3Instance.setAccount(this.sdkWallet);
        this.pDexV3Instance.setAuthToken(authToken);
        this.pDexV3Instance.setRPCTradeService(coinService);
        this.pDexV3Instance.setRPCClient(fullNode);
        this.pDexV3Instance.setStorageServices(localStorage);
        this.pDexV3Instance.setRPCApiServices(apiService);
    }

    async init() {
        if (this.account.keyInfo != null) {
            await this.sdkWallet.setKey(this.account.privateK)
                // callback.bind(this)
        }
    }

    async setKey() {
        await this.sdkWallet.setKey(this.account.privateK)
    }

    async getBalance(tokenId, version = 2) {
        return parseInt(await this.sdkWallet.getBalance({ tokenID: tokenId, version: version }))
    }

    async getBalanceAll() {
        let cs = new CoinServiceApi()
        let coinIndex = await cs.getCoinIndex(this.account.otaPrivateK)
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
        IncAccount.isValid(receiver)
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
            extra: { isEncryptMessage: true, txType: 0, version: 2 },
        });
        return res.txId;

    }

    async sendToken(token, receiver, amount, fee = 100, memo = "") {
        IncAccount.isValid(receiver)
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