const { TOKEN } = require('../../../lib/Incognito/Constants')
const config = require("../../../constant/config");
const listAccount = require("../../../constant/listAccount.json");
const { IncNode } = require("../../../lib/Incognito/IncNode");
const { IncAccount } = require("../../../lib/Incognito/Account/Account");
const { CoinServiceApi } = require("../../../lib/Incognito/CoinServiceApi");
const { IncRpc } = require("../../../lib/Incognito/RPC/Rpc");
const GenAction = require("../../../lib/Utils/GenAction");
let chai = require("chai");

let coinServiceApi = new CoinServiceApi();
let rpc = new IncRpc();
let node = new IncNode()
let sender = new IncAccount(listAccount[2], node)

describe("[Class] Pdex", () => {
    describe.skip("TC001_TradePRVToToken", async() => {
        let amountTrade = 0
        let estimateTradeObject
        let tx

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]
            sender.balanceZILBefore = balanceAll[TOKEN.ZIL]

            amountTrade = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_CoinServiceEstimateTrade", async() => {
            let estimateTrade = await coinServiceApi.estimateTrade({
                tokenSell: TOKEN.PRV,
                tokenBuy: TOKEN.ZIL,
                sellAmount: amountTrade
            })
            estimateTradeObject = estimateTrade.data
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

            await node.getTransactionByHashRpc(tx)
            await GenAction.sleep(60000)
        }).timeout(120000);

        it("STEP_CheckTradeSuccess", async() => {
            let response = await rpc.pdexv3_getTradeStatus(tx)

            chai.expect(response.data.Result.Status).to.equal(1)
            chai.expect(response.data.Result.BuyAmount).to.above(1)
            chai.expect(response.data.Result.TokenToBuy).to.equal(TOKEN.ZIL)

        }).timeout(120000);

        it("STEP_VerifyBalance", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.PRV]
            sender.balanceZILAfter = balanceAll[TOKEN.ZIL]

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

            amountTrade = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_CoinServiceEstimateTrade", async() => {
            let estimateTrade = await coinServiceApi.estimateTrade({
                tokenSell: TOKEN.ZIL,
                tokenBuy: TOKEN.PRV,
                sellAmount: amountTrade
            })
            estimateTradeObject = estimateTrade.data
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

            await node.getTransactionByHashRpc(tx)
            await GenAction.sleep(60000)
        }).timeout(120000);

        it("STEP_CheckTradeSuccess", async() => {
            let response = await rpc.pdexv3_getTradeStatus(tx)

            chai.expect(response.data.Result.Status).to.equal(1)
            chai.expect(response.data.Result.BuyAmount).to.above(1)
            chai.expect(response.data.Result.TokenToBuy).to.equal(PRV)

        }).timeout(120000);

        it("STEP_VerifyBalance", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.PRV]
            sender.balanceZILAfter = balanceAll[TOKEN.ZIL]

            chai.expect(sender.balancePRVAfter).to.least(sender.balancePRVBefore - 100 + estimateTradeObject.Result.FeePRV.MaxGet);
            chai.expect(sender.balanceZILAfter).to.be.equal(sender.balanceZILBefore - amountTrade - estimateTradeObject.Result.FeeToken.Fee);

        }).timeout(60000);
    });
});