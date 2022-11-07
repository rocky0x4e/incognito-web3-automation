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
            await GenAction.sleep(60000)
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
            await GenAction.sleep(60000)
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

    describe("TC003_AddOrderSellPRV", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })

            amountBuy = await GenAction.randomNumber(100000)
            amountSell = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_AddOrder", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_ZIL,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: TOKEN.ZIL,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })
            logger.info({ tx })

            await incNode.getTransactionByHashRpc(tx)
            await GenAction.sleep(60000)
        }).timeout(120000);

        it("STEP_CheckOrderStatus", async() => {
            let response = await incRpc.pdexv3_getAddOrderStatus(tx)

            chai.expect(response.data.Result.Status).to.equal(1);
            chai.expect(response.data.Result.OrderID).to.equal(tx);
        }).timeout(120000);

        it("STEP_CheckPdexState", async() => {
            let response = await incRpc.pdexv3_getState()
            let orders = response.data.Result.PoolPairs[POOL.PRV_ZIL].Orderbook.orders
            let isFind = false
            for (const order of orders) {
                if (order.Id == tx) {
                    isFind = true;
                    nftID = order.NftID
                    chai.expect(order.Id).to.equal(tx);
                    chai.expect(order.Token0Rate).to.equal(amountSell);
                    chai.expect(order.Token1Rate).to.equal(amountBuy);
                    chai.expect(order.Token0Balance).to.equal(amountSell);
                    chai.expect(order.Token1Balance).to.equal(0);
                }
            }
            if (!isFind) {
                chai.expect.fail('Cannot find order book');
            }

        }).timeout(120000);

        it("STEP_VerifyBalanceAfterAdd", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.PRV]

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - amountSell - 100);

        }).timeout(60000);

        it("STEP_CancelOrder", async() => {
            tx = await sender.useSdk.cancelOrder({
                token1ID: TOKEN.PRV,
                token2ID: TOKEN.ZIL,
                poolPairID: POOL.PRV_ZIL,
                orderID: tx,
                nftID: nftID,
            })
            logger.info({ tx })

            await incNode.getTransactionByHashRpc(tx)
            await GenAction.sleep(60000)

        }).timeout(120000);

        it("STEP_CheckCancelOrderStatus", async() => {
            let response = await incRpc.pdexv3_getWithdrawOrderStatus(tx)

            chai.expect(response.data.Result.Status).to.equal(1);
            chai.expect(response.data.Result.TokenID).to.equal(TOKEN.PRV);
            chai.expect(response.data.Result.Amount).to.equal(amountSell);

        }).timeout(60000);

        it("STEP_VerifyBalanceAfterCancel", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.PRV]

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - 100 - 100);

        }).timeout(60000);
    });

    describe("TC004_AddOrderBuyPRV", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.ZIL]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })

            amountBuy = await GenAction.randomNumber(100000)
            amountSell = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_AddOrder", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_ZIL,
                tokenIDToSell: TOKEN.ZIL,
                tokenIDToBuy: TOKEN.PRV,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })
            logger.info({ tx })

            await incNode.getTransactionByHashRpc(tx)
            await GenAction.sleep(60000)
        }).timeout(120000);

        it("STEP_CheckOrderStatus", async() => {
            let response = await incRpc.pdexv3_getAddOrderStatus(tx)

            chai.expect(response.data.Result.Status).to.equal(1);
            chai.expect(response.data.Result.OrderID).to.equal(tx);
        }).timeout(120000);

        it("STEP_CheckPdexState", async() => {
            let response = await incRpc.pdexv3_getState()
            let orders = response.data.Result.PoolPairs[POOL.PRV_ZIL].Orderbook.orders
            let isFind = false
            for (const order of orders) {
                if (order.Id == tx) {
                    isFind = true;
                    nftID = order.NftID
                    chai.expect(order.Id).to.equal(tx);
                    chai.expect(order.Token0Rate).to.equal(amountBuy);
                    chai.expect(order.Token1Rate).to.equal(amountSell);
                    chai.expect(order.Token1Balance).to.equal(amountSell);
                    chai.expect(order.Token0Balance).to.equal(0);
                }
            }
            if (!isFind) {
                chai.expect.fail('Cannot find order book');
            }

        }).timeout(120000);

        it("STEP_VerifyBalanceAfterAdd", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.ZIL]

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - amountSell);

        }).timeout(60000);

        it("STEP_CancelOrder", async() => {
            tx = await sender.useSdk.cancelOrder({
                token1ID: TOKEN.PRV,
                token2ID: TOKEN.ZIL,
                poolPairID: POOL.PRV_ZIL,
                orderID: tx,
                nftID: nftID,
            })
            logger.info({ tx })

            await incNode.getTransactionByHashRpc(tx)
            await GenAction.sleep(60000)

        }).timeout(120000);

        it("STEP_CheckCancelOrderStatus", async() => {
            let response = await incRpc.pdexv3_getWithdrawOrderStatus(tx)

            chai.expect(response.data.Result.Status).to.equal(1);
            chai.expect(response.data.Result.TokenID).to.equal(TOKEN.ZIL);
            chai.expect(response.data.Result.Amount).to.equal(amountSell);

        }).timeout(60000);

        it("STEP_VerifyBalanceAfterCancel", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.ZIL]

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore);

        }).timeout(60000);
    });
});