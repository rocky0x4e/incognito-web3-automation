const { TOKEN } = require("../Constants")
const { Wallet, Account: AccountWallet, PDexV3, } = require('incognito-chain-web-js');
const { CoinServiceApi } = require("../CoinService/CoinServiceApi");
const { IncAccount } = require("./Account");

class BaseAction {
    constructor(account) {
        this.account = account
    }
}

class CliAction extends BaseAction {
    getBalanceAll() {
        return this.node.cli.getBalanceAll(this.account.privateK)
    }

    getBalance(token = TOKEN.PRV) {
        return this.node.cli.getBalance(this.account.privateK, token)
    }

    send(receiver, amount, token = TOKEN.PRV) {
        this._validateArgs(receiver)
        return this.node.cli.send(this.account.privateK, receiver.paymentK, amount, token)
    }

    addOrder(pairID, nftId, sellToken, sellAmount, minAcceptAmount) {
        return this.node.cli.addOrder(this.account.privateK, pairID, nftId, sellToken, sellAmount, minAcceptAmount)
    }

    trade(selToken, buyToken, sellAmount, tradingFee, minAcceptAmount, tradingPath, prvFee) {
        return this.node.cli.trade(this.account.privateK, selToken, buyToken, sellAmount, tradingFee,
            minAcceptAmount, tradingPath, prvFee)
    }

    withdrawLpFee(pairId, nftId) {
        return this.node.cli.withdrawLpFee(this.account.privateK, pairId, nftId)
    }

    consolidate() {
        return this.node.cli.consolidate(this.account.privateK, tokenId)
    }

    printUTXO(tokenId) {
        return this.node.cli.printUTXO(this.account.privateK, tokenId)
    }

    withrawOrder(orderId, pairId, nftId, tokenId) {
        return this.node.cli.withrawOrder(this.account.privateK, orderId, pairId, nftId, tokenId)
    }

    stake(validator, rewarReceiver) {
        IncAccount.isValid(validator, rewarReceiver)
        return this.node.cli.stake(this.account.privateK, validator.miningK, validator.paymentK, rewarReceiver.paymentK)
    }

    unstake(validator) {
        IncAccount.isValid(validator)
        return this.node.cli.unstake(this.account.privateK, validator.miningK, validator.paymentK)
    }
}

class RpcAction extends BaseAction {

}

class SdkAction extends BaseAction {
    constructor(account, {
        coinService = ENV.urlCoinService,
        fullNode = ENV.urlFullNode,
        pubsubService = ENV.urlPubsubService,
        requestService = ENV.urlWebService,
        apiService = ENV.urlBackend }) {
        super(account)
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
        this.sdkWallet.setKey(this.account.privateK);

        this.pDexV3Instance = new PDexV3();
        this.pDexV3Instance.setAccount(this.sdkWallet);
        this.pDexV3Instance.setAuthToken(authToken);
        this.pDexV3Instance.setRPCTradeService(coinService);
        this.pDexV3Instance.setRPCClient(fullNode);
        this.pDexV3Instance.setStorageServices(localStorage);
        this.pDexV3Instance.setRPCApiServices(apiService);
    }

    async getBalance(tokenId, version = 2) {
        return parseInt(await this.sdkWallet.getBalance({ tokenID: tokenId, version: version }))
    }

    async getBalanceAll() {
        cs = new CoinServiceApi()
        coinIndex = cs.getCoinIndex()
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
            extra: { isEncryptMessage: true, txType: 0, version },
        });
        return res.txId;

    }

    async sendToken(token, receiver, amount, fee = 100, memo = "") {
        IncAccount.isValid(receiver)
        let tokenPaymentInfo = [{
            PaymentAddress: receiver.paymentK,
            Amount: amount,
            Message: memo,
        },];
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

    async swap({ tokenSell, tokenBuy, amount, tradePath, tradingFee, feeToken, minAcceptableAmount,
        version = 2, networkFee = 100, memo = "" }) {
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

    async addOrder({ poolPairID, tokenIDToSell, tokenIDToBuy, sellAmount, buyAmount,
        version = 2, networkFee = 100, info = '' }) {
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

    async cancelOrder({ token1ID, token2ID, poolPairID, orderID, amount = '0', txType = 0, nftID,
        version = 2, networkFee = 100, info = '' }) {
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
