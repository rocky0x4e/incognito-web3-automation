const { TOKEN } = require('../../../lib/Incognito/Constants')
const addDebug = require('../../../lib/Utils/AddingContent').addDebug
let chai = require("chai");
let assert = require("chai").assert;
const { ACCOUNTS, NODES } = require('../../TestBase');
const config = require("../../../config.json");

let sender = ACCOUNTS.Incognito.get(3)

describe("[Class] Consolidate", () => {
    describe("TC001_ConsolidatePRV", async () => {

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();

            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]

            let getNumberUtxo = await sender.useSdk.getNumberUtxo({ tokenID: TOKEN.PRV })
        }).timeout(config.timeoutApi);

        it("STEP_Consolidate", async () => {
            listTx = await sender.useSdk.consolidate({ tokenID: TOKEN.PRV })

            addDebug("listTx", listTx)

            for (const tx of listTx) {
                await NODES.Incognito.getTransactionByHashRpc(tx)
            }
            if (listTx.length > 0) {
                await sender.useSdk.waitForUtxoChange({
                    tokenID: TOKEN.PRV,
                    countNumber: 15,
                })
            }

        }).timeout(config.timeoutTx);

        it("STEP_VerifyNumberUtxo", async () => {
            let getNumberUtxo = await sender.useSdk.getNumberUtxo({ tokenID: TOKEN.PRV })

            chai.expect(getNumberUtxo).to.be.below(2);
        }).timeout(config.timeoutApi);
    });

    describe("TC002_ConsolidateToken", async () => {

        let tokenID = TOKEN.USDT_UT
        it("STEP_InitData", async () => {
            await sender.initSdkInstance();

            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balanceToken = balanceAll[tokenID]
        }).timeout(config.timeoutApi);

        it("STEP_Consolidate", async () => {
            listTx = await sender.useSdk.consolidate({ tokenID: tokenID })

            addDebug("listTx", listTx)

            for (const tx of listTx) {
                await NODES.Incognito.getTransactionByHashRpc(tx)
            }

            if (listTx.length > 0) {
                await sender.useSdk.waitForUtxoChange({
                    tokenID: tokenID,
                    countNumber: 15,
                })
            }
        }).timeout(config.timeoutTx);

        it("STEP_VerifyNumberUtxo", async () => {
            let getNumberUtxo = await sender.useSdk.getNumberUtxo({ tokenID: tokenID })

            chai.expect(getNumberUtxo).to.be.below(2);
        }).timeout(config.timeoutApi);
    });

    describe("TC003_ConsolidateInvalidToken", async () => {

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();

            let balanceAll = await sender.useSdk.getBalanceAll()
            console.log('hoanh balanceAll', balanceAll);
        }).timeout(config.timeoutApi);

        it("STEP_ConsolidateWithTokenInvalid", async () => {
            listTx = await sender.useSdk.consolidate({ tokenID: 'abc' })
            addDebug("listTx", listTx)

            assert.equal(listTx.length, 0)
        }).timeout(config.timeoutTx);

        it("STEP_ConsolidateWithTokenNotHaveBalance", async () => {
            listTx = await sender.useSdk.consolidate({ tokenID: TOKEN.USDC_UT })
            addDebug("listTx", listTx)

            assert.equal(listTx.length, 0)
        }).timeout(config.timeoutTx);

    });
});