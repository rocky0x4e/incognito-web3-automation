const { TOKEN } = require('../../../lib/Incognito/Constants')
const GenAction = require("../../../lib/Utils/GenAction");
const config = require("../../../config.json");
let chai = require("chai");
const AddingContent = require("../../../lib/Utils/AddingContent");
const { ACCOUNTS, NODES } = require('../../TestBase');

let sender = ACCOUNTS.Incognito.get(2)
let receiver = ACCOUNTS.Incognito.get(3)


describe("[Class] Send", () => {
    describe("TC001_SendPRV", async () => {
        let amountSend = 0
        let tx

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();
            await receiver.initSdkInstance();

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllBefore = balanceAll
            AddingContent.addContent("sender.balanceAllBefore", sender.balanceAllBefore)

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceAllBefore = balanceAll
            AddingContent.addContent("receiver.balanceAllBefore", receiver.balanceAllBefore)

            amountSend = await GenAction.randomNumber(10000)
            AddingContent.addContent("amountSend", amountSend)
        }).timeout(config.timeoutApi);

        it("STEP_Send", async () => {
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
        }).timeout(config.timeoutTx);

        it("STEP_VerifyBalance", async () => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllAfter = balanceAll
            AddingContent.addContent("sender.balanceAllAfter", sender.balanceAllAfter)

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceAllAfter = balanceAll
            AddingContent.addContent("receiver.balanceAllAfter", receiver.balanceAllAfter)

            chai.expect(sender.balanceAllAfter[TOKEN.PRV]).to.equal(sender.balanceAllBefore[TOKEN.PRV] - amountSend - 100);
            chai.expect(receiver.balanceAllAfter[TOKEN.PRV]).to.equal(receiver.balanceAllBefore[TOKEN.PRV] + amountSend);

        }).timeout(config.timeoutTx);
    });

    describe("TC002_SendToken", async () => {
        let amountSend = 0
        let tx
        let tokenID = TOKEN.WBNB

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();
            await receiver.initSdkInstance();

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllBefore = balanceAll
            AddingContent.addContent("sender.balanceAllBefore", sender.balanceAllBefore)

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceAllBefore = balanceAll
            AddingContent.addContent("receiver.balanceAllBefore", receiver.balanceAllBefore)

            amountSend = await GenAction.randomNumber(10000)
            AddingContent.addContent("amountSend", amountSend)
        }).timeout(config.timeoutApi);

        it("STEP_Send", async () => {
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
        }).timeout(config.timeoutTx);

        it("STEP_VerifyBalance", async () => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllAfter = balanceAll
            AddingContent.addContent("sender.balanceAllAfter", sender.balanceAllAfter)

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceAllAfter = balanceAll
            AddingContent.addContent("receiver.balanceAllAfter", receiver.balanceAllAfter)

            chai.expect(sender.balanceAllAfter[tokenID]).to.equal(sender.balanceAllBefore[tokenID] - amountSend);
            chai.expect(receiver.balanceAllAfter[tokenID]).to.equal(receiver.balanceAllBefore[tokenID] + amountSend);

        }).timeout(config.timeoutTx);
    });
})