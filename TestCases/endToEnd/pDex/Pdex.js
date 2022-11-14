const { TOKEN, POOL } = require('../../../lib/Incognito/Constants')
const listAccount = require("../../../constant/listAccount.json");
const { IncNode } = require("../../../lib/Incognito/IncNode");
const { IncAccount } = require("../../../lib/Incognito/Account/Account");
const { CoinServiceApi } = require("../../../lib/Incognito/CoinServiceApi");
const { IncRpc } = require("../../../lib/Incognito/RPC/Rpc");
const GenAction = require("../../../lib/Utils/GenAction");
let chai = require("chai");
const { getLogger } = require("../../../lib/Utils/LoggingManager");
const logger = getLogger("Pdex")

let coinServiceApi = new CoinServiceApi();
let incRpc = new IncRpc();
let incNode = new IncNode()
let sender = new IncAccount(listAccount[3], incNode)

describe("[Class] Pdex", () => {
    describe("TC001_TradePRVToToken", async() => {
        let amountTrade = 0
        let estimateTradeObject
        let tx

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]
            sender.balanceZILBefore = balanceAll[TOKEN.ZIL]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })
            logger.info({ balanceZILBefore: sender.balanceZILBefore })

            amountTrade = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_CoinServiceEstimateTrade", async() => {
            let estimateTrade = await coinServiceApi.estimateTrade({
                tokenSell: TOKEN.PRV,
                tokenBuy: TOKEN.ZIL,
                sellAmount: amountTrade
            })
            estimateTradeObject = estimateTrade.data
            logger.info({ estimateTradeObject })
        });


        it("STEP_Trade", async() => {
            tx = await sender.useSdk.swap({
                tokenSell: TOKEN.PRV,
                tokenBuy: TOKEN.ZIL,
                amount: amountTrade,
                tradePath: estimateTradeObject.Result.FeePRV.Route,
                tradingFee: estimateTradeObject.Result.FeePRV.Fee,
                feeToken: TOKEN.PRV,
                minAcceptableAmount: estimateTradeObject.Result.FeePRV.MaxGet,
            })
            logger.info({ tx })

            await incNode.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.ZIL,
                countNumber: 20,
            })
        }).timeout(120000);

        it("STEP_CheckTradeSuccess", async() => {
            let response = await incRpc.pdexv3_getTradeStatus(tx)
            logger.info({ response })

            chai.expect(response.data.Result.Status).to.equal(1)
            chai.expect(response.data.Result.BuyAmount).to.above(1)
            chai.expect(response.data.Result.TokenToBuy).to.equal(TOKEN.ZIL)

        }).timeout(120000);

        it("STEP_VerifyBalance", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.PRV]
            sender.balanceZILAfter = balanceAll[TOKEN.ZIL]
            logger.info({ balancePRVAfter: sender.balancePRVAfter })
            logger.info({ balanceZILAfter: sender.balanceZILAfter })

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - amountTrade - 100 - estimateTradeObject.Result.FeePRV.Fee);
            chai.expect(sender.balanceZILAfter).to.be.least(sender.balanceZILBefore + estimateTradeObject.Result.FeePRV.MaxGet);

        }).timeout(60000);
    });

    describe("TC002_TradeTokenToPRV", async() => {
        let amountTrade = 0
        let estimateTradeObject
        let tx

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useCli.getBalanceAll()

            sender.balancePRVBefore = balanceAll[TOKEN.PRV]
            sender.balanceZILBefore = balanceAll[TOKEN.ZIL]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })
            logger.info({ balanceZILBefore: sender.balanceZILBefore })

            amountTrade = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_CoinServiceEstimateTrade", async() => {
            let estimateTrade = await coinServiceApi.estimateTrade({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                sellAmount: amountTrade
            })
            estimateTradeObject = estimateTrade.data
            logger.info({ estimateTradeObject })
        });

        it("STEP_Trade", async() => {

            tx = await sender.useSdk.swap({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                amount: amountTrade,
                tradePath: estimateTradeObject.Result.FeeToken.Route,
                tradingFee: estimateTradeObject.Result.FeeToken.Fee,
                feeToken: TOKEN.ZIL,
                minAcceptableAmount: estimateTradeObject.Result.FeeToken.MaxGet,
            })
            logger.info({ tx })

            await incNode.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.PRV,
                countNumber: 20,
            })
        }).timeout(120000);

        it("STEP_CheckTradeSuccess", async() => {
            let response = await incRpc.pdexv3_getTradeStatus(tx)
            logger.info({ response })

            chai.expect(response.data.Result.Status).to.equal(1)
            chai.expect(response.data.Result.BuyAmount).to.above(1)
            chai.expect(response.data.Result.TokenToBuy).to.equal(TOKEN.PRV)

        }).timeout(120000);

        it("STEP_VerifyBalance", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.PRV]
            sender.balanceZILAfter = balanceAll[TOKEN.ZIL]
            logger.info({ balancePRVAfter: sender.balancePRVAfter })
            logger.info({ balanceZILAfter: sender.balanceZILAfter })

            chai.expect(sender.balancePRVAfter).to.least(sender.balancePRVBefore - 100 + estimateTradeObject.Result.FeePRV.MaxGet);
            chai.expect(sender.balanceZILAfter).to.be.equal(sender.balanceZILBefore - amountTrade - estimateTradeObject.Result.FeeToken.Fee);

        }).timeout(60000);
    });

    describe("TC003_TradeWithInvalidRoute", async() => {
        let amountTrade = 0
        let estimateTradeObject
        let tx

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useCli.getBalanceAll()

            sender.balancePRVBefore = balanceAll[TOKEN.PRV]
            sender.balanceZILBefore = balanceAll[TOKEN.ZIL]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })
            logger.info({ balanceZILBefore: sender.balanceZILBefore })

            amountTrade = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_CoinServiceEstimateTrade", async() => {
            let estimateTrade = await coinServiceApi.estimateTrade({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                sellAmount: amountTrade
            })
            estimateTradeObject = estimateTrade.data
            logger.info({ estimateTradeObject })
        });

        it("STEP_Trade", async() => {

            tx = await sender.useSdk.swap({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                amount: amountTrade,
                tradePath: POOL.MATIC_USDT,
                tradingFee: estimateTradeObject.Result.FeeToken.Fee,
                feeToken: TOKEN.ZIL,
                minAcceptableAmount: estimateTradeObject.Result.FeeToken.MaxGet,
            })
            logger.info({ tx })

            //TODO
        }).timeout(120000);
    });

    describe("TC004_TradeWithInvalidSellAmount", async() => {
        let amountTrade = 0
        let estimateTradeObject
        let tx

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            amountTrade = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_CoinServiceEstimateTrade", async() => {
            let response = await coinServiceApi.estimateTrade({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                sellAmount: amountTrade
            })
            estimateTradeObject = response.data
            logger.info({ estimateTradeObject })
        });

        it("STEP_Trade", async() => {

            tx = await sender.useSdk.swap({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                amount: "abc",
                tradePath: estimateTradeObject.Result.FeeToken.Route,
                tradingFee: estimateTradeObject.Result.FeeToken.Fee,
                feeToken: TOKEN.ZIL,
                minAcceptableAmount: estimateTradeObject.Result.FeeToken.MaxGet,
            })
            logger.info({ tx })

            //TODO
        }).timeout(120000);
    });

    describe("TC005_TradeWithInvalidMinAcceptableAmount", async() => {
        let amountTrade = 0
        let estimateTradeObject
        let tx

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            amountTrade = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_CoinServiceEstimateTrade", async() => {
            let response = await coinServiceApi.estimateTrade({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                sellAmount: amountTrade
            })
            estimateTradeObject = response.data
            logger.info({ estimateTradeObject })
        });

        it("STEP_Trade", async() => {

            tx = await sender.useSdk.swap({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                amount: amountTrade,
                tradePath: estimateTradeObject.Result.FeeToken.Route,
                tradingFee: estimateTradeObject.Result.FeeToken.Fee,
                feeToken: TOKEN.ZIL,
                minAcceptableAmount: estimateTradeObject.Result.FeeToken.MaxGet + 100000,
            })
            logger.info({ tx })

            //TODO
        }).timeout(120000);
    });

    describe("TC006_TradeWithInvalidTradingFee", async() => {
        let amountTrade = 0
        let estimateTradeObject
        let tx

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            amountTrade = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_CoinServiceEstimateTrade", async() => {
            let response = await coinServiceApi.estimateTrade({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                sellAmount: amountTrade
            })
            estimateTradeObject = response.data
            logger.info({ estimateTradeObject })
        });

        it("STEP_Trade", async() => {

            tx = await sender.useSdk.swap({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                amount: amountTrade,
                tradePath: estimateTradeObject.Result.FeeToken.Route,
                tradingFee: "abc",
                feeToken: TOKEN.ZIL,
                minAcceptableAmount: estimateTradeObject.Result.FeeToken.MaxGet,
            })
            logger.info({ tx })

            //TODO
        }).timeout(120000);
    });

    describe("TC007_TradeWithInvalidTokenSell", async() => {
        let amountTrade = 0
        let estimateTradeObject
        let tx

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            amountTrade = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_CoinServiceEstimateTrade", async() => {
            let response = await coinServiceApi.estimateTrade({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                sellAmount: amountTrade
            })
            estimateTradeObject = response.data
            logger.info({ estimateTradeObject })
        });

        it("STEP_Trade", async() => {

            tx = await sender.useSdk.swap({
                tokenSell: "abc",
                tokenBuy: TOKEN.PRV,
                amount: amountTrade,
                tradePath: estimateTradeObject.Result.FeeToken.Route,
                tradingFee: estimateTradeObject.Result.FeeToken.Fee,
                feeToken: TOKEN.ZIL,
                minAcceptableAmount: estimateTradeObject.Result.FeeToken.MaxGet,
            })
            logger.info({ tx })

            //TODO
        }).timeout(120000);
    });

    describe("TC008_TradeWithInvalidTokenBuy", async() => {
        let amountTrade = 0
        let estimateTradeObject
        let tx

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            amountTrade = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_CoinServiceEstimateTrade", async() => {
            let response = await coinServiceApi.estimateTrade({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                sellAmount: amountTrade
            })
            estimateTradeObject = response.data
            logger.info({ estimateTradeObject })
        });

        it("STEP_Trade", async() => {

            tx = await sender.useSdk.swap({
                tokenSell: TOKEN.ZIL,
                tokenBuy: "abc",
                amount: amountTrade,
                tradePath: estimateTradeObject.Result.FeeToken.Route,
                tradingFee: estimateTradeObject.Result.FeeToken.Fee,
                feeToken: TOKEN.ZIL,
                minAcceptableAmount: estimateTradeObject.Result.FeeToken.MaxGet,
            })
            logger.info({ tx })

            //TODO
        }).timeout(120000);
    });

    describe("TC009_TradeWithInvalidTokenFee", async() => {
        let amountTrade = 0
        let estimateTradeObject
        let tx

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            amountTrade = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_CoinServiceEstimateTrade", async() => {
            let response = await coinServiceApi.estimateTrade({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                sellAmount: amountTrade
            })
            estimateTradeObject = response.data
            logger.info({ estimateTradeObject })
        });

        it("STEP_Trade", async() => {

            tx = await sender.useSdk.swap({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                amount: amountTrade,
                tradePath: estimateTradeObject.Result.FeeToken.Route,
                tradingFee: estimateTradeObject.Result.FeeToken.Fee,
                feeToken: TOKEN.BTC,
                minAcceptableAmount: estimateTradeObject.Result.FeeToken.MaxGet,
            })
            logger.info({ tx })

            //TODO
        }).timeout(120000);
    });


});