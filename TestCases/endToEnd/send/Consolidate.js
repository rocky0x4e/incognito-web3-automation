const { TOKEN } = require('../../../lib/Incognito/Constants')
const AddingContent = require('../../../lib/Utils/AddingContent')
let chai = require("chai");
const { ACCOUNTS, NODES } = require('../../TestBase');

let sender = ACCOUNTS.Incognito.get(3)

describe("[Class] Consolidate", () => {
    describe("TC001_ConsolidatePRV", async() => {

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]

            let getNumberUtxo = await sender.useSdk.getNumberUtxo({ tokenID: TOKEN.PRV })
        }).timeout(60000);

        it("STEP_Consolidate", async() => {
            listTx = await sender.useSdk.consolidate({ tokenID: TOKEN.PRV })

            AddingContent.addContent("listTx", listTx)

            for (const tx of listTx) {
                await NODES.Incognito.getTransactionByHashRpc(tx)
            }
            if (listTx.length > 0) {
                await sender.useSdk.waitForUtxoChange({
                    tokenID: TOKEN.PRV,
                    countNumber: 15,
                })
            }

        }).timeout(160000);

        it("STEP_VerifyNumberUtxo", async() => {
            let getNumberUtxo = await sender.useSdk.getNumberUtxo({ tokenID: TOKEN.PRV })

            chai.expect(getNumberUtxo).to.be.below(2);
        }).timeout(60000);
    });

    describe("TC002_ConsolidateToken", async() => {

        let tokenID = TOKEN.USDT_UT
        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balanceToken = balanceAll[tokenID]

            let getNumberUtxo = await sender.useSdk.getNumberUtxo({ tokenID: tokenID })
            console.log('hoanh  getNumberUtxo', getNumberUtxo);
        }).timeout(60000);

        it("STEP_Consolidate", async() => {
            listTx = await sender.useSdk.consolidate({ tokenID: tokenID })

            AddingContent.addContent("listTx", listTx)

            for (const tx of listTx) {
                await NODES.Incognito.getTransactionByHashRpc(tx)
            }

            if (listTx.length > 0) {
                await sender.useSdk.waitForUtxoChange({
                    tokenID: tokenID,
                    countNumber: 15,
                })
            }
        }).timeout(160000);

        it("STEP_VerifyNumberUtxo", async() => {
            let getNumberUtxo = await sender.useSdk.getNumberUtxo({ tokenID: tokenID })

            chai.expect(getNumberUtxo).to.be.below(2);
        }).timeout(60000);
    });
});