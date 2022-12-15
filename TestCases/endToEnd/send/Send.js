const { TOKEN } = require('../../../lib/Incognito/Constants')
const GenAction = require("../../../lib/Utils/GenAction");
const config = require("../../../config.json");
let chai = require("chai");
const addDebug = require('../../../lib/Utils/AddingContent').addDebug;
const { ACCOUNTS, NODES } = require('../../TestBase');
const { IncAccount } = require('../../../lib/Incognito/Account/Account');
let assert = require("chai").assert

let sender = ACCOUNTS.Incognito.get(1)
let receiver = ACCOUNTS.Incognito.get(2)


describe("[Class] Send", () => {
    describe("TC001_SendPRV", async () => {
        let amountSend = 0
        let tx

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();
            await sender.useSdk.clearCacheBalance()

            await receiver.initSdkInstance();
            await receiver.useSdk.clearCacheBalance()

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllBefore = balanceAll
            addDebug("sender.balanceAllBefore", sender.balanceAllBefore)

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceAllBefore = balanceAll
            addDebug("receiver.balanceAllBefore", receiver.balanceAllBefore)

            amountSend = await GenAction.randomNumber(10000)
            addDebug("amountSend", amountSend)
        }).timeout(config.timeoutApi);

        it("STEP_Send", async () => {
            tx = await sender.useSdk.sendPRV({
                receiver,
                amount: amountSend
            })
            addDebug({ tx })
            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.PRV,
                countNumber: 15,
            })
        }).timeout(config.timeoutTx);

        it("STEP_VerifyBalance", async () => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllAfter = balanceAll
            addDebug("sender.balanceAllAfter", sender.balanceAllAfter)

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceAllAfter = balanceAll
            addDebug("receiver.balanceAllAfter", receiver.balanceAllAfter)

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
            await sender.useSdk.clearCacheBalance()

            await receiver.initSdkInstance();
            await receiver.useSdk.clearCacheBalance()

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllBefore = balanceAll
            addDebug("sender.balanceAllBefore", sender.balanceAllBefore)

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceAllBefore = balanceAll
            addDebug("receiver.balanceAllBefore", receiver.balanceAllBefore)

            amountSend = await GenAction.randomNumber(10000)
            addDebug("amountSend", amountSend)
        }).timeout(config.timeoutApi);

        it("STEP_Send", async () => {
            tx = await sender.useSdk.sendToken({
                token: tokenID,
                receiver,
                amount: amountSend,
            })

            addDebug({ tx })
            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: tokenID,
                countNumber: 15,
            })
        }).timeout(config.timeoutTx);

        it("STEP_VerifyBalance", async () => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllAfter = balanceAll
            addDebug("sender.balanceAllAfter", sender.balanceAllAfter)

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceAllAfter = balanceAll
            addDebug("receiver.balanceAllAfter", receiver.balanceAllAfter)

            chai.expect(sender.balanceAllAfter[tokenID]).to.equal(sender.balanceAllBefore[tokenID] - amountSend);
            chai.expect(receiver.balanceAllAfter[tokenID]).to.equal(receiver.balanceAllBefore[tokenID] + amountSend);

        }).timeout(config.timeoutTx);
    });

    describe("TC003_SendPRVInvalidAmount", async () => {
        let amountSend = 0
        let tx

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();

            await receiver.initSdkInstance();

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllBefore = balanceAll
            addDebug("sender.balanceAllBefore", sender.balanceAllBefore)

        }).timeout(config.timeoutApi);

        it("STEP_Send", async () => {
            tx = await sender.useSdk.sendPRV({
                receiver,
                amount: sender.balanceAllBefore[TOKEN.PRV] + 10000000000000
            })
            addDebug({ tx })

            assert.equal(tx, "WEB_JS_ERROR: Error while preparing inputs")
        }).timeout(config.timeoutApi);
    });

    describe("TC004_SendPRVInvalidAddress", async () => {
        let amountSend = 0
        let tx

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();
            await receiver.initSdkInstance();

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllBefore = balanceAll
            addDebug("sender.balanceAllBefore", sender.balanceAllBefore)

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceAllBefore = balanceAll
            addDebug("receiver.balanceAllBefore", receiver.balanceAllBefore)

            amountSend = await GenAction.randomNumber(10000)
            addDebug("amountSend", amountSend)
        }).timeout(config.timeoutApi);

        it("STEP_Send", async () => {
            receiver = IncAccount({ PaymentAddress: "123" })
            tx = await sender.useSdk.sendPRV({
                address: receiver,
                amount: amountSend
            })
            addDebug({ tx })

            assert.equal(tx, "Error: Validating \"Payment info paymentAddressStr\" failed: Invalid payment address. Found 123 (type of string)")
        }).timeout(config.timeoutApi);
    });

    describe("TC005_SendTokenInvalidAmount", async () => {
        let amountSend = 0
        let tx
        let tokenID = TOKEN.WBNB

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();

            await receiver.initSdkInstance();

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllBefore = balanceAll
            addDebug("sender.balanceAllBefore", sender.balanceAllBefore)

        }).timeout(config.timeoutApi);

        it("STEP_Send", async () => {

            tx = await sender.useSdk.sendToken({
                token: tokenID,
                receiver,
                amount: sender.balanceAllBefore[tokenID] + 10000000000000
            })
            addDebug({ tx })

            assert.include(tx, "WEB_JS_ERROR: Error while preparing inputs Not enough coin to spend")
        }).timeout(config.timeoutApi);
    });

    describe("TC006_SendPRVInvalidAddress", async () => {
        let amountSend = 0
        let tx
        let tokenID = TOKEN.WBNB

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();

            await receiver.initSdkInstance();

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllBefore = balanceAll
            addDebug("sender.balanceAllBefore", sender.balanceAllBefore)

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceAllBefore = balanceAll
            addDebug("receiver.balanceAllBefore", receiver.balanceAllBefore)

            amountSend = await GenAction.randomNumber(10000)
            addDebug("amountSend", amountSend)

        }).timeout(config.timeoutApi);

        it("STEP_Send", async () => {
            tx = await sender.useSdk.sendTokenToPaymentAddress({
                token: tokenID,
                address: "123",
                amount: amountSend
            })
            addDebug({ tx })

            assert.equal(tx, "Error: Validating \"Payment info paymentAddressStr\" failed: Invalid payment address. Found 123 (type of string)")
        }).timeout(config.timeoutApi);
    });

    describe("TC007_SendPRVInvalidToken", async () => {
        let amountSend = 0
        let tx
        let tokenID = "abc"

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();

            await receiver.initSdkInstance();

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllBefore = balanceAll
            addDebug("sender.balanceAllBefore", sender.balanceAllBefore)

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceAllBefore = balanceAll
            addDebug("receiver.balanceAllBefore", receiver.balanceAllBefore)

            amountSend = await GenAction.randomNumber(10000)
            addDebug("amountSend", amountSend)

        }).timeout(config.timeoutApi);

        it("STEP_Send", async () => {
            tx = await sender.useSdk.sendToken({
                token: tokenID,
                receiver,
                amount: amountSend,
            })
            addDebug({ tx })

            assert.include(tx, "WEB_JS_ERROR: Error while preparing inputs Not enough coin to spend")
        }).timeout(config.timeoutApi);
    });



})