const config = require("../../../constant/config");
const { TOKEN } = require('../../../lib/Incognito/Constants');
const listAccount = require("../../../constant/listAccount.json");
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const coinServiceApi_schemas = require("../../../schemas/coinServiceApi_schemas");
const addingContent = require("../../../lib/Utils/AddingContent");
let chai = require("chai");
const { IncAccount } = require("../../../lib/Incognito/Account/Account");
const { IncNode } = require("../../../lib/Incognito/IncNode");
const { CoinServiceApi } = require("../../../lib/Incognito/CoinServiceApi");
const GenAction = require("../../../lib/Utils/GenAction");

//init
let node = new IncNode();
let sender = new IncAccount(listAccount["2"]).attachTo(node);
let receiver = new IncAccount(listAccount["3"]).attachTo(node);
let account = {
    privateKey: null,
    otaKey: null
};
let coinServiceApi = new CoinServiceApi();

describe("[Class] Balance", () => {
    describe("Before_InitData", async() => {
        it("InitData", async() => {
            let privateKey = (await config.getAccount("main7")).privateKey;

            let node = new IncNode();
            let accountNode = new IncAccount(privateKey).attachTo(node);

            account.otaKey = accountNode.otaPrivateK;
            account.privateKey = accountNode.privateK;
        });
    });

    describe("TC001_GetKeyInfo", async() => {
        it("CallAPI", async() => {
            let response = await coinServiceApi.getKeyInfo({
                otaKey: account.otaKey
            });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getGetKeyInfoSchemas, response.data);
        });
    });

    describe("TC002_CheckKeyImage", async() => {
        it("CallAPI", async() => {
            let keyImages = ["7w0f383GlwJli1+7+5ocpLimo5iD6hZzmpL52Yh3EKM=", "XifUy+NcW/MU+zOTofbfCepu07iWPevoaXkextz9i8w="];

            let response = await coinServiceApi.getKeyImage({
                KeyImages: keyImages
            });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getCheckKeyImageSchemas, response.data);
        });
    });

    describe("TC003_TokenInfo", async() => {
        it("CallAPI", async() => {
            let TokenIDs = [
                "0000000000000000000000000000000000000000000000000000000000000004",
                "076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229",
                "0cd19c9cc3f95f8ae9960df14fa5e2a7e7796b3a28058abdc9a8235d8726667d"
            ];

            let response = await coinServiceApi.tokenInfo({
                TokenIDs: TokenIDs
            });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getTokenInfoSchemas, response.data);
        });
    });

    describe("TC004_GetTxsBySender", async() => {
        it("CallAPI", async() => {
            let keyImages = ["Wgff+rv59epyKHIjko4mkpiS5BFpopejqD7dkLFExGA=", "Alyc63FVuOpiTgk16o8BDAaQfL5hxMFv28H/djaoZPU="];

            let response = await coinServiceApi.getTxsBySender({
                shardID: 3,
                keyImages
            });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getTxBySenderSchemas, response.data);
        });
    });

    describe("TC005_GetTxsByPubKey", async() => {
        it("CallAPI", async() => {
            let pubkeys = ["/14cdQwaARSCnYPwI2GRw5NnnwPKF3Kp5qQ9SDrzNZs=", "aN6XseTePHYUf5j/myolNTr6okGvaBSqe2stlMKLZRs="];

            let response = await coinServiceApi.getTxsByPubkey({ pubkeys });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getTxByPubKeySchemas, response.data);
        });
    });

    describe("TC006_SubmitOtaKey", async() => {
        it("CallAPI", async() => {
            let response = await coinServiceApi.submitOtaKey(account.otaKey);
        });
    });

    describe.skip("TC007_CheckBalancePrvAfterSend", async() => {
        let amountTransfer = 0;

        it("STEP_InitData", async() => {
            amountTransfer = await GenAction.randomNumber(1000);
            await sender.initSdkInstance();
            await receiver.initSdkInstance();
        });

        it("STEP_CheckBalanceCli", async() => {
            sender.balanceCLI = await sender.useCli.getBalanceAll();
            await addingContent.addContent("sender.getBalanceAll", sender.balanceCLI);
            sender.oldBalance = sender.balanceCLI;

            receiver.balanceCLI = await receiver.useCli.getBalanceAll();
            await addingContent.addContent("receiver.getBalanceAll", receiver.balanceCLI);
            receiver.oldBalance = receiver.balanceCLI;
        }).timeout(50000);

        it("STEP_CheckBalanceSdk", async() => {
            sender.balanceSdk = await sender.useSdk.getBalanceAll();
            await addingContent.addContent("sender.balanceSdk", sender.balanceSdk);

            receiver.balanceSdk = await receiver.useSdk.getBalanceAll();
            await addingContent.addContent("receiver.balanceSdk", receiver.balanceSdk);
        }).timeout(100000);

        it("STEP_Send", async() => {
            let tx = await sender.useCli.send(receiver, amountTransfer);
            await addingContent.addContent("tx", tx);
            await node.getTransactionByHashRpc(tx);
        }).timeout(50000);

        it("STEP_CompareBalance", async() => {
            await GenAction.sleep(20000);

            sender.balanceCLI = await sender.useCli.getBalanceAll();
            await addingContent.addContent("sender.balanceCLI", sender.balanceCLI);
            sender.newBalance = sender.balanceCLI;

            receiver.balanceCLI = await receiver.useCli.getBalanceAll();
            await addingContent.addContent("receiver.balanceCLI", receiver.balanceCLI);
            receiver.newBalance = receiver.balanceCLI;

            sender.balanceSdk = await sender.useSdk.getBalanceAll();
            await addingContent.addContent("sender.balanceSdk", sender.balanceSdk);

            receiver.balanceSdk = await receiver.useSdk.getBalanceAll();
            await addingContent.addContent("receiver.balanceSdk", receiver.balanceSdk);

            chai.expect(sender.balanceCLI[TOKEN.PRV]).to.equal(sender.balanceSdk[TOKEN.PRV]);
            chai.expect(receiver.balanceCLI[TOKEN.PRV]).to.equal(receiver.balanceSdk[TOKEN.PRV]);

            chai.expect(sender.newBalance[TOKEN.PRV]).to.equal(sender.oldBalance[TOKEN.PRV] - amountTransfer - 100);
            chai.expect(receiver.newBalance[TOKEN.PRV]).to.equal(receiver.oldBalance[TOKEN.PRV] + amountTransfer);
        }).timeout(100000);
    });

    describe.skip("TC008_CheckBalanceTokenAfterSend", async() => {
        let amountTransfer = 0;
        let USDT = "076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229";

        it("STEP_InitData", async() => {
            amountTransfer = await GenAction.randomNumber(1000);
            await sender.initSdkInstance();
            await receiver.initSdkInstance();
        });

        it("STEP_CheckBalanceCli", async() => {
            sender.balanceCLI = await sender.useCli.getBalance(USDT);
            await addingContent.addContent("sender.balanceCLI", sender.balanceCLI);
            sender.oldBalance = sender.balanceCLI;

            receiver.balanceCLI = await receiver.useCli.getBalance(USDT);
            await addingContent.addContent("receiver.balanceCLI", receiver.balanceCLI);
            receiver.oldBalance = receiver.balanceCLI;
        }).timeout(1000000);

        it("STEP_CheckBalanceSdk", async() => {
            sender.balanceSdk = await sender.useSdk.getBalance(USDT);
            await addingContent.addContent("sender.balanceSdk", sender.balanceSdk);

            receiver.balanceSdk = await receiver.useSdk.getBalance(USDT);
            await addingContent.addContent("receiver.balanceSdk", receiver.balanceSdk);
        }).timeout(1000000);

        it("STEP_Send", async() => {
            let tx = await sender.useCli.send(receiver, amountTransfer, USDT);
            await addingContent.addContent("tx", tx);
            await node.getTransactionByHashRpc(tx);
        }).timeout(1000000);

        it("STEP_CompareBalance", async() => {
            await GenAction.sleep(20000);

            sender.balanceCLI = sender.useCli.getBalanceAll();
            await addingContent.addContent("sender.balanceCLI ", sender.balanceCLI);
            sender.newBalance = sender.balanceCLI;

            receiver.balanceCLI = receiver.useCli.getBalanceAll();
            await addingContent.addContent("receiver.balanceCLI ", receiver.balanceCLI);
            receiver.newBalance = receiver.balanceCLI;

            sender.balanceSdk = sender.useCli.getBalanceAll();
            await addingContent.addContent("sender.balanceSdk", sender.balanceSdk);

            receiver.balanceSdk = receiver.useCli.getBalanceAll();
            await addingContent.addContent("receiver.balanceSdk", receiver.balanceSdk);

            chai.expect(sender.balanceCLI[USDT]).to.equal(sender.balanceSdk[USDT]);
            chai.expect(receiver.balanceCLI[USDT]).to.equal(receiver.balanceSdk[USDT]);

            chai.expect(sender.newBalance[USDT]).to.equal(sender.oldBalance[USDT] - amountTransfer);
            chai.expect(receiver.newBalance[USDT]).to.equal(receiver.oldBalance[USDT] + amountTransfer);
        }).timeout(1000000);
    });
});