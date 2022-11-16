const { TOKEN } = require('../../../lib/Incognito/Constants')
let chai = require("chai");
const { ACCOUNTS, NODES } = require('../../TestBase');

let sender = ACCOUNTS.Incognito.get(2)

describe("[Class] Consolidate", () => {
    describe("TC001_ConsolidatePRV", async() => {

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]

            let getNumberUtxo = await sender.useSdk.getNumberUtxo({ tokenID: TOKEN.PRV })
        }).timeout(60000);

        it("STEP_Consolidate", async() => {
            listTx = await sender.useSdk.consolidate({ tokenID: TOKEN.PRV })

            for (const tx of listTx) {
                await NODES.Incognito.getTransactionByHashRpc(tx)
            }
            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.PRV,
                countNumber: 20,
            })
        }).timeout(120000);

        it("STEP_VerifyNumberUtxo", async() => {
            let getNumberUtxo = await sender.useSdk.getNumberUtxo({ tokenID: TOKEN.PRV })

            chai.expect(getNumberUtxo).to.be.below(2);
        }).timeout(60000);
    });

    describe("TC001_ConsolidateToken", async() => {

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceToken = balanceAll[TOKEN.ZIL]

            let getNumberUtxo = await sender.useSdk.getNumberUtxo({ tokenID: TOKEN.ZIL })
        }).timeout(60000);

        it("STEP_Consolidate", async() => {
            listTx = await sender.useSdk.consolidate({ tokenID: TOKEN.ZIL })

            for (const tx of listTx) {
                await NODES.Incognito.getTransactionByHashRpc(tx)
            }

            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.ZIL,
                countNumber: 20,
            })
        }).timeout(120000);

        it("STEP_VerifyNumberUtxo", async() => {
            let getNumberUtxo = await sender.useSdk.getNumberUtxo({ tokenID: TOKEN.ZIL })

            chai.expect(getNumberUtxo).to.be.below(2);
        }).timeout(60000);
    });
});