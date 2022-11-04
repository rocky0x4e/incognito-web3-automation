const commonFunction = require("../../../constant/commonFunction");
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const coinServiceApi_schemas = require("../../../schemas/coinServiceApi_schemas");
const addingContent = require("../../../lib/Utils/AddingContent");
let chai = require("chai");
const { IncAccount } = require("../../../lib/Incognito/Account/Account");
const { IncNode } = require("../../../lib/Incognito/IncNode");
const { CoinServiceApi } = require("../../../lib/Incognito/CoinServiceApi");
const { BackendApi } = require("../../../lib/Incognito/BackendApi");
const { ENV } = require("../../../global");
const { getLogger } = require("../../../lib/Utils/LoggingManager");
const logger = getLogger("Provide");

let node = new IncNode(ENV.urlFullNode);
let sender = new IncAccount("112t8rnXVMJJZzfF1naXvfE9nkTKwUwFWFeh8cfEyViG1vpA8A9khJk3mhyB1hDuJ4RbreDTsZpgJK4YcSxdEpXJKMEd8Vmp5UqKWwBcYzxv").attachTo(
    node
);
let receiver = new IncAccount({
    PaymentAddress:
        "12suG5oV5KQspoUPseBAnLCmm8vBPQs3je7kbiLuBSyvhAG2dHbo3RP5zRsNoB9Y2m9fA342MyfbpoUJYNcS5zhB5pU89kUiU3YPGDCjh8Eg7Y5HdgAU33XrNQ3q77J5BwThnmcXZvyNekF6EnSr",
}).attachTo(node);
let coinServiceApi = new CoinServiceApi();
let backendApi = new BackendApi(ENV.Backend);

describe("[Class] Provide", () => {
    describe("TC006_SubmitOtaKey", async () => {
        it("CallAPI", async () => {
            let response = await coinServiceApi.submitOtaKey(sender.otaPrivateK);
        });
        it.skip("Call RPC Authorize Submit Key", async () => {
            await sender.useRpc.submitKeyEnhanced();
        });
    });

    describe("TC007_ProvidePRV", async () => {
        let amountProvide = 0;
        const PRV = "0000000000000000000000000000000000000000000000000000000000000004";

        it("STEP_InitData", async () => {
            amountProvide = await commonFunction.randomNumberInRange(1234000123, 10234000567);
        });

        it.skip("STEP_CheckBalanceCli", async () => {
            sender.balanceCLI = await sender.useCli.getBalanceAll();
            await addingContent.addContent("sender.getBalanceAll", sender.balanceCLI);
            sender.oldBalance = sender.balanceCLI;
        }).timeout(180000);

        it.skip("STEP_CheckBalanceSdk", async () => {
            sender.balanceSdk = await sender.useSdk.getBalanceAll();
            await addingContent.addContent("sender.balanceSdk", sender.balanceSdk);
        }).timeout(100000);

        it("STEP Send Provide", async () => {
            var proof = await sender.useRpc.makeRawTx(receiver, amountProvide);
            //"SignPublicKeyEncode": "8a59a648a9cf47168e72e348b98d7bb296c67f7dd2d50cc9e043d2feb40b9cc8", zxv
            logger.debug(`Send PROOF: ${proof.Base58CheckData}`);
            logger.info(`Send TxID: ${proof.TxID}`);
            logger.info(`Amount Provide: ${amountProvide}`);

            try {
                let provideResponse = await backendApi.provideSubmitRawData({
                    PStakeAddress: sender.paymentK,
                    transactionID: proof.TxID,
                    base58Proof: proof.Base58CheckData,
                    amount: amountProvide,
                });
            } catch (err) {
                chai.expect(err.response.status).to.equal(400);
                chai.expect(JSON.stringify(err.response.data)).to.equal('{"Result":null,"Error":"The data invalid!!!"}');
                logger.info(
                    `STEP_Send Provide\nResponse Status Code is ${err.response.status}\nReject invalid g-captcha: ${JSON.stringify(
                        err.response.data
                    )}\n --- PASSED --- `
                );
            }
        }).timeout(50000);

        it("STEP Withdraw Provide Reward", async () => {
            try {
                let withdrawRewardResponse = await backendApi.provideRequestWithdrawReward({
                    PStakeAddress: sender.paymentK,
                });
            } catch (err) {
                chai.assert.equal(err.response.status, 500, "Response Status Code is not 500");
                chai.assert.equal(
                    JSON.stringify(err.response.data),
                    '{"Result":null,"Error":{"Code":-80015,"Message":"The data invalid!!!"}}',
                    "Error g-captcha not valid"
                );
                logger.info(
                    `STEP Withdraw Provide Reward\nResponse Status Code is ${err.response.status}\nReject invalid g-captcha: ${JSON.stringify(
                        err.response.data
                    )}\n --- PASSED --- `
                );
            }
        });

        it("STEP Withdraw Provide Provision", async () => {
            try {
                let withdrawProvisionResponse = await backendApi.provideRequestWithdrawProvision({
                    PStakeAddress: sender.paymentK,
                    amount: 1000234000,
                });
            } catch (err) {
                logger.info(err.response.status);
                logger.info(err.response.data);
                chai.assert.equal(err.response.status, 400, "Response Status Code is not 400");
                chai.assert.equal(JSON.stringify(err.response.data), '{"Result":null,"Error":"The data invalid!!!"}', "Error g-captcha not valid");
                logger.info(
                    `STEP Withdraw Provide Provision\nResponse Status Code is ${err.response.status}\nReject invalid g-captcha: ${JSON.stringify(
                        err.response.data
                    )}\n --- PASSED --- `
                );
            }
        });
    });
});
