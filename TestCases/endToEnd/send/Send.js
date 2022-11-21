const { TOKEN } = require('../../../lib/Incognito/Constants')
const GenAction = require("../../../lib/Utils/GenAction");
let chai = require("chai");
const AddingContent = require("../../../lib/Utils/AddingContent");
const { ACCOUNTS, NODES } = require('../../TestBase');

let sender = ACCOUNTS.Incognito.get(2)
let receiver = ACCOUNTS.Incognito.get(3)


describe("[Class] Send", () => {
    describe("TC001_SendPRV", async() => {
        let amountSend = 0
        let tx

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            await receiver.initSdkInstance();

            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]
            AddingContent.addContent({ balancePRVBefore: sender.balancePRVBefore })

            balanceAll = await receiver.useSdk.getBalanceAll()
            receiver.balancePRVBefore = balanceAll[TOKEN.PRV]
            AddingContent.addContent({ balancePRVBefore: receiver.balancePRVBefore })

            amountSend = await GenAction.randomNumber(1000)
        }).timeout(60000);

        it("STEP_Send", async() => {
            tx = await sender.useSdk.sendPRV({
                receiver,
                amount: amountSend
            })
            AddingContent.addContent({ tx })
            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.PRV,
                countNumber: 15,
            })
        }).timeout(160000);

        it("STEP_VerifyBalance", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.PRV]
            AddingContent.addContent({ balancePRVAfter: sender.balancePRVAfter })

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balancePRVAfter = balanceAll[TOKEN.PRV]
            AddingContent.addContent({ balancePRVAfter: receiver.balancePRVAfter })

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - amountSend - 100);
            chai.expect(receiver.balancePRVAfter).to.equal(receiver.balancePRVBefore + amountSend);

        }).timeout(60000);
    });

    describe("TC002_SendToken", async() => {
        let amountSend = 0
        let tx
        let tokenID = TOKEN.WBNB

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            await receiver.initSdkInstance();

            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balanceTokenBefore = balanceAll[tokenID]
            AddingContent.addContent({ balanceTokenBefore: sender.balanceTokenBefore })

            balanceAll = await receiver.useSdk.getBalanceAll()
            receiver.balanceTokenBefore = balanceAll[tokenID]
            AddingContent.addContent({ balanceTokenBefore: receiver.balanceTokenBefore })

            amountSend = await GenAction.randomNumber(1000)
        }).timeout(60000);

        it("STEP_Send", async() => {
            tx = await sender.useSdk.sendToken({
                token: tokenID,
                receiver,
                amount: amountSend,
            })

            AddingContent.addContent({ tx })
            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: tokenID,
                countNumber: 15,
            })
        }).timeout(160000);

        it("STEP_VerifyBalance", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceTokenAfter = balanceAll[tokenID]
            AddingContent.addContent({ balancePRVAfter: sender.balancePRVAfter })

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceTokenAfter = balanceAll[tokenID]
            AddingContent.addContent({ balancePRVAfter: receiver.balancePRVAfter })

            chai.expect(sender.balanceTokenAfter).to.equal(sender.balanceTokenBefore - amountSend);
            chai.expect(receiver.balanceTokenAfter).to.equal(receiver.balanceTokenBefore + amountSend);

        }).timeout(60000);
    });
})