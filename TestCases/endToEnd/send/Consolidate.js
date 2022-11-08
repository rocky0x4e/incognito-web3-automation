const { TOKEN } = require('../../../lib/Incognito/Constants')
const listAccount = require("../../../constant/listAccount.json");
const { IncNode } = require("../../../lib/Incognito/IncNode");
const { IncAccount } = require("../../../lib/Incognito/Account/Account");
const GenAction = require("../../../lib/Utils/GenAction");
let chai = require("chai");

let node = new IncNode()
let sender = new IncAccount(listAccount[3], node)

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
                await node.getTransactionByHashRpc(tx)
            }

            await GenAction.sleep(60000)
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
                await node.getTransactionByHashRpc(tx)
            }

            await GenAction.sleep(60000)
        }).timeout(120000);

        it("STEP_VerifyNumberUtxo", async() => {
            let getNumberUtxo = await sender.useSdk.getNumberUtxo({ tokenID: TOKEN.ZIL })

            chai.expect(getNumberUtxo).to.be.below(2);
        }).timeout(60000);
    });
});