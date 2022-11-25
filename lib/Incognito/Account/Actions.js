const { TOKEN } = require("../Constants")
const { Wallet, Account: AccountWallet, init, PDexV3, wasm } = require('incognito-chain-web-js');
const { CoinServiceApi } = require("../CoinServiceApi");
const GenAction = require("../../Utils/GenAction");
const { wait } = require("../../Utils/Timer");
const { ENV } = require("../../../global");
const { getLogger } = require("../../Utils/LoggingManager");
const logger = getLogger("IncAccAction")
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

    async getOutcoin(tokenID) {
        return await this.node.cli.getOutcoin(this.keyInfo.PaymentAddress, this.keyInfo.OTAPrivateKey, tokenID)
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
        return await this.node.cli.myNft(this.keyInfo.PrivateKey)
    }
}

class RpcAction extends BaseAction {
    async makeRawTx(receiver, amount, fee = 10, privacy = 1) {
        return await this.node.rpc.createRawTx(this.keyInfo.PrivateKey, receiver.paymentK, amount, fee, privacy)
    }

    async submitKey() {
        var result = await this.node.rpc.submitKey(this.keyInfo.OTAPrivateKey)
        result.expectNoError()
    }

    async submitKeyEnhanced(fromHeight = 0, reIndex = true) {
        var response = await this.node.rpc.submitKeyEnhanced({
            otaKey: this.keyInfo.OTAPrivateKey,
            accessToken: this.node.accessToken,
            fromHeight: fromHeight,
            reIndex: reIndex
        })
        response.expectNoError()
    }

    async getSubmitKeyInfo() {
        var response = await this.node.rpc.getSubmitKeyInfo(this.keyInfo.OTAPrivateKey)
        response.expectNoError()
        return response.result
    }

}

class SdkAction extends BaseAction {

    async init({
        coinService = ENV.Testbed.Incognito.CoinService.url,
        fullNode = ENV.Testbed.Incognito.FullNode.url,
        pubsubService = ENV.Testbed.Incognito.PubsubService.url,
        requestService = ENV.Testbed.Incognito.WebService.url,
        apiService = ENV.Testbed.Incognito.Backend.url,
        webService = ENV.Testbed.Incognito.WebService.url
    } = {}) {

        logger.info("Initialize a new sdk instance");
        await init();
        await wasm.setShardCount('', 8);

        // //local
        // const LocalStorage = require('node-localstorage').LocalStorage;
        // let localStorage = new LocalStorage('./.cache');

        //node-persist
        const storage = require('node-persist')
        await storage.init({
            dir: './.cache1',
            stringify: JSON.stringify,
            parse: JSON.parse,
            encoding: 'utf8',
            logging: false, // can also be custom logging function
            ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
            expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache
            // in some cases, you (or some other service) might add non-valid storage files to your
            // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
            forgiveParseErrors: false
        });


        let authToken = new Date().getTime();
        authToken = String(authToken)
        logger.info("Initialize a new sdk wallet");
        this.sdkWallet = new AccountWallet(Wallet);
        this.sdkWallet.setRPCCoinServices(coinService);
        this.sdkWallet.setRPCClient(fullNode);
        this.sdkWallet.setRPCTxServices(pubsubService);
        this.sdkWallet.setRPCRequestServices(requestService);
        this.sdkWallet.setAuthToken(authToken);
        this.sdkWallet.setRPCApiServices(apiService, authToken);
        this.sdkWallet.setStorageServices(storage)
        if (this.keyInfo != null) {
            logger.debug("Set private key");
            await this.sdkWallet.setKey(this.keyInfo.PrivateKey)
        }
        logger.info("Initialize a new pDEXv3 instance");
        this.pDexV3Instance = new PDexV3();
        this.pDexV3Instance.setAccount(this.sdkWallet);
        this.pDexV3Instance.setAuthToken(authToken);
        this.pDexV3Instance.setRPCTradeService(coinService);
        this.pDexV3Instance.setRPCClient(fullNode);
        this.pDexV3Instance.setStorageServices(storage);
        this.pDexV3Instance.setRPCApiServices(apiService);
        this.pDexV3Instance.setRPCWebAppService(webService);
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

    async sendPRV({
        receiver,
        amount,
        fee = 100,
        memo = "",
        version = 2
    }) {
        let paymentInfosParam = [{
            PaymentAddress: receiver.keyInfo.PaymentAddress,
            Amount: amount,
            Message: memo,
        }]

        let res = await this.sdkWallet.createAndSendNativeToken({
            transfer: {
                prvPayments: paymentInfosParam,
                fee: fee,
                memo
            },
            extra: { txType: 0, version },
        });
        return res.txId;

    }

    async sendToken({
        token,
        receiver,
        amount,
        fee = 100,
        memo = "",
        version = 2
    }) {
        let tokenPaymentInfo = [{
            PaymentAddress: receiver.keyInfo.PaymentAddress,
            Amount: amount,
            Message: memo,
        }, ];
        let res = await this.sdkWallet.createAndSendPrivacyToken({
            transfer: {
                tokenID: token,
                tokenPayments: tokenPaymentInfo,
                fee: fee,
                info: memo,
            },
            extra: { txType: 0, version },
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
        memo = "",
        sellAmountText = "1",
        buyAmountText = "1",
    }) {
        try {
            let res = await this.pDexV3Instance.createAndSendSwapRequestTx({
                transfer: {
                    fee: networkFee,
                    info: memo
                },
                extra: {
                    tokenIDToSell: tokenSell,
                    sellAmount: String(amount),
                    tokenIDToBuy: tokenBuy,
                    tradingFee,
                    tradePath,
                    feetoken: feeToken,
                    version,
                    minAcceptableAmount: String(minAcceptableAmount),
                    sellAmountText,
                    buyAmountText
                }
            });
            return res.txId;
        } catch (error) {
            return error + ""
        }

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
        try {
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
        } catch (error) {
            return error + ""
        }
    }

    async contributeLiquidity({
        tokenId1,
        tokenId2,
        amount1,
        amount2,
        poolPairID,
        amp,
        nftID,
        fee = 100,
    }) {
        let res = await this.pDexV3Instance.createContributeTxs({
            fee,
            tokenId1,
            tokenId2,
            amount1,
            amount2,
            poolPairID,
            amp,
            nftID,
        });
        return res;
    }

    async removeLiquidity({
        poolTokenIDs,
        poolPairID,
        shareAmount,
        nftID,
        amount1,
        amount2,
        info = "",
        version = 2,
        fee = 100,
    }) {
        let res = await this.pDexV3Instance.createAndSendWithdrawContributeRequestTx({
            fee,
            info,
            poolTokenIDs,
            poolPairID,
            shareAmount,
            version,
            nftID,
            amount1,
            amount2,
        });
        return res.txId;
    }

    async withdrawFeeLiquidity({
        withdrawTokenIDs, //array
        poolPairID,
        nftID,
        version = 2,
        info = '',
        amount1 = String(0),
        amount2 = String(0),
        fee = 100,
    }) {
        let res = await this.pDexV3Instance.createAndSendWithdrawLPFeeRequestTx({
            fee,
            withdrawTokenIDs,
            poolPairID,
            version,
            info,
            nftID,
            amount1,
            amount2,
        });
        return res.txId;
    }

    async getListShare() {
        let res = await this.pDexV3Instance.getListShare()
        return res;
    }

    async getListPoolsDetail(poolID) {
        let res = await this.pDexV3Instance.getListPoolsDetail([poolID])
        return res;
    }

    async cancelOrder({
        token1ID,
        token2ID,
        poolPairID,
        orderID,
        nftID,
        amount = '0',
        txType = 0,
        version = 2,
        networkFee = 100,
        info = ''
    }) {
        try {
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
        } catch (error) {
            return error + ""
        }
    }

    async consolidate({
        tokenID,
        version = 2
    }) {
        let res
        let listTx = []
        try {
            res = await this.sdkWallet.consolidate({
                transfer: { tokenID },
                extra: { version }
            })
            for (const tx of res) {
                listTx.push(tx.txId)
            }
        } catch (error) {
            console.log(error);
        }

        return listTx; //listTx
    }

    async getNumberUtxo({
        tokenID,
        version = 2
    }) {
        const unspentCoins = await this.sdkWallet.getUnspentCoinsExcludeSpendingCoins({
            version,
            tokenID,
        })
        return unspentCoins.length
    }

    async getUtxo({
        tokenID,
        version = 2
    }) {
        const unspentCoins = await this.sdkWallet.getUnspentCoinsExcludeSpendingCoins({
            tokenID,
            version
        })
        return unspentCoins
    }

    async waitForUtxoChange({
        tokenID,
        countNumber = 15,
        version = 2
    }) {
        const beforeUnspentCoins = await this.getNumberUtxo({
            tokenID,
            version
        })
        console.log('hoanh beforeUnspentCoins', beforeUnspentCoins);
        let count = 0
        while (count < countNumber) {
            let currentUnspentCoins = await this.getNumberUtxo({
                tokenID,
                version
            })
            console.log('hoanh currentUnspentCoins', currentUnspentCoins);
            if (currentUnspentCoins != beforeUnspentCoins) {
                return null
            }
            count++
            await GenAction.sleep(5000)
        }
        return null
    }

    async swapPapp({
        sellTokenID,
        senderFeeAddressShardID,

        feeReceiverAddress,
        feeAmount,
        feeTokenID,

        // data metadata
        sellAmount,
        callContract, // proxy route
        callData,
        exchangeNetworkID, // networkID exchange, exp: ETH = 1
        sellChildTokenID,
        buyContractID,
        // remoteAddress, case reDeposit = 0x0000000000000000000000000000000000000000
        // send out EVN use user address
        remoteAddress,
        buyTokenID,
        sellAmountText = "1",
        buyAmountText = "1",
    }) {
        let res = await this.pDexV3Instance.createTransactionPApps({
            transfer: { version: 2 },
            extra: {
                sellTokenID,
                senderFeeAddressShardID,

                feeReceiverAddress,
                feeAmount,
                feeTokenID,

                // data metadata
                sellAmount,
                callContract, // proxy route
                callData,
                exchangeNetworkID, // networkID exchange, exp: ETH = 1
                sellChildTokenID,
                buyContractID,
                // remoteAddress, case reDeposit = 0x0000000000000000000000000000000000000000
                // send out EVN use user address
                remoteAddress,
                buyTokenID,
                sellAmountText,
                buyAmountText
            }
        });
        return res.txId;
    }

    async clearCacheBalance() {
        const path = "./.cache1/"
        let listFileName = await GenAction.getListFileName(path)
        let totalFileCount = listFileName.length

        let listRemoveFile = []
        for (const fileName of listFileName) {
            let content = JSON.stringify(await GenAction.readFile(path + fileName))
            if (content && content.includes(this.keyInfo.OTAPrivateKey)) {
                listRemoveFile.push(fileName)
                await GenAction.removeFile(path + fileName)
            }

        }
        let totalFileRemove = listRemoveFile.length
        console.log(`Remove ${totalFileRemove}/${totalFileCount} file have otaKey : ${this.keyInfo.OTAPrivateKey}`);
    }

    async unshieldUnifiedEvm({
        unshieldBackendId,
        tokenId,
        unifiedTokenId,
        receiver,
        amount,
        amountFee,
        decimalPtoken,
        remoteAddress,
        fee = 100,
        version = 2
    }) {
        let tokenPaymentInfo = [{
            paymentAddress: receiver,
            amount: amountFee
        }];
        let buringInfo = [{
            incTokenID : tokenId,
            burningAmount :  (amount * Number('1e' + decimalPtoken)),
            expectedAmount : (amount * Number('1e' + decimalPtoken)),
            remoteAddress : remoteAddress
        }];
        // console.log( JSON.stringify(tokenPaymentInfo))
        let res = await this.sdkWallet.createAndSendBurnUnifiedTokenRequestTx({
            transfer: {
                tokenID: unifiedTokenId,
                prvPayments : [],
                tokenPayments: tokenPaymentInfo,
                fee: fee,
                info: unshieldBackendId + '',
            },
            extra: { 
                burningInfos : buringInfo, 
                version: version 
            },
        });
        console.log("data res :", res)
        return res.txId;
    }


    async unshieldEvm({
        unshieldBackendId,
        tokenId,
        receiver,
        amount,
        amountFee,
        decimalPtoken,
        remoteAddress,
        burningType,
        fee = 100,
        version = 2
    }) {
        let tokenPaymentInfo = [{
            paymentAddress: receiver,
            amount: amountFee
        }];
        let res = await this.sdkWallet.createAndSendBurningRequestTx({
            transfer: {
                tokenID: tokenId,
                prvPayments: [],
                tokenPayments: tokenPaymentInfo,
                fee: fee,
                info: unshieldBackendId + '',
            },
            extra: {
                remoteAddress: remoteAddress,
                burnAmount: amount +'',
                burningType: burningType,
                version: version
            },
        });
        
        return res.txId;
    }

}



module.exports = { CliAction, RpcAction, SdkAction }