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

describe("[Class] pNode", () => {
    describe("TC006_SubmitOtaKey", async () => {
        it("CallAPI", async () => {
            let response = await coinServiceApi.submitOtaKey(sender.otaPrivateK);
        });
        it.skip("Call RPC Authorize Submit Key", async () => {
            await sender.useRpc.submitKeyEnhanced();
        });
    });

    describe("TC007_ pNode", async () => {
        it (" STEP get current reward and balance", async () =>{
            let pNodeReward = await backendApi.getpNodeInfo({});
            logger.info(pNodeReward)
        });

        it.skip("STEP Withdraw pNode Reward", async () => {
            try {
                let withdrawRewardResponse = await backendApi.pNodeRequestWithdrawReward({});
                chai.assert.equal(withdrawRewardResponse.status, 200, "Response Status Code is not 200");
                chai.assert.equal(
                    JSON.stringify(withdrawRewardResponse.data),
                    '{"Result":true,"Error":null}',
                    "Error unable to withdraw reward"
                );
                logger.info(
                    `STEP Withdraw Provide Reward\nResponse Status Code is ${withdrawRewardResponse.status}\nReject invalid g-captcha: 
                    ${JSON.stringify(withdrawRewardResponse.data)}\n --- PASSED --- `
                );
            } catch (err) {
                chai.assert.equal(err.response.status, 200, "Response Status Code is not 200");
                chai.assert.equal(
                    JSON.stringify(err.response.data),
                    '{"Result":true,"Error":null}',
                    "Error unable to withdraw reward"
                );

            }
        });


    });
});
