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
const { TOKEN } = require("../../../lib/Incognito/Constants");
const logger = getLogger("pNode Testcase");

let node = new IncNode(ENV.urlFullNode);
let sender = new IncAccount("112t8rnbmCZEvEhhfhzZX3HkbqbRHApaJU1veRNMsXg3VWcuQw6P5vLQkeQYKFF8nYHhx4swt4afUDsAAZqFGqLbgTZXZagT84GuF7zoF5rD").attachTo(
    node
);
let receiver = new IncAccount({
    PaymentAddress:
        "12suG5oV5KQspoUPseBAnLCmm8vBPQs3je7kbiLuBSyvhAG2dHbo3RP5zRsNoB9Y2m9fA342MyfbpoUJYNcS5zhB5pU89kUiU3YPGDCjh8Eg7Y5HdgAU33XrNQ3q77J5BwThnmcXZvyNekF6EnSr",
}).attachTo(node);
let coinServiceApi = new CoinServiceApi();
let backendApi = new BackendApi(ENV.Backend);

describe("[Class] pNode", () => {
    var execute_test = true;
    var senderBalancePRVBefore = 0;
    var senderBalancePRVAfter = 0;
    var pNodeRewardAmount = 0;

    describe("TC006_SubmitOtaKey", async () => {
        it("CallAPI", async () => {
            let response = await coinServiceApi.submitOtaKey(sender.otaPrivateK);
        });
        it.skip("Call RPC Authorize Submit Key", async () => {
            await sender.useRpc.submitKeyEnhanced();
        });
    });

    describe("TC007_ pNode", async () => {
        it(" STEP get CURRENT reward and balance", async () => {
            await sender.initSdkInstance();
            senderBalancePRVBefore = await sender.useSdk.getBalance();
            // sender.balancePRVBefore = balanceAll[TOKEN.PRV]
            logger.info(`sender.balancePRVBefore: ${senderBalancePRVBefore}`);

            let pNodeReward = await backendApi.getpNodeInfo();
            // console.log(pNodeReward.Result[0])
            if (pNodeReward.Result[0].Rewards != null) {
                pNodeRewardAmount = pNodeReward.Result[0].Rewards[0].Amount;
                logger.info(`pNode Reward Amount = ${pNodeRewardAmount}`);
            } else {
                logger.info(`SKIP NEXT TESTCASE BECAUSE PNODE REWARD = 0`);
                execute_test = false;
            }
        });

        it("STEP Withdraw pNode Reward", async () => {
            if (execute_test) {
                try {
                    let withdrawRewardResponse = await backendApi.pNodeRequestWithdrawReward({});
                    chai.assert.equal(withdrawRewardResponse.status, 200, "Response Status Code is not 200");
                    chai.assert.equal(JSON.stringify(withdrawRewardResponse.data), '{"Result":true,"Error":null}', "Error unable to withdraw reward");
                    logger.info(
                        `STEP Withdraw Provide Reward\nResponse Status Code is ${withdrawRewardResponse.status}\n 
                    ${JSON.stringify(withdrawRewardResponse.data)}\n --- PASSED --- `
                    );
                } catch (err) {
                    logger.info(`ERROR: ${JSON.stringify(err.response.data)}`);
                    chai.assert.equal(err.response.status, 200, "Response Status Code is not 200");
                    chai.assert.equal(JSON.stringify(err.response.data), '{"Result":true,"Error":null}', "Error unable to withdraw reward");
                }
            } else {
                it.skip;
                logger.info("Withdraw pNode Reward: SKIPPED");
            }
        });

        it(" STEP get NEW reward and balance", async () => {
            let pNodeReward = await backendApi.getpNodeInfo();
            chai.expect(pNodeReward.Result[0].Rewards).to.equal(null);

            senderBalancePRVAfter = await sender.useCli.waitBalanceChange({
                from: senderBalancePRVBefore,
                amountChange: pNodeRewardAmount,
                checkInterval: 30,
                timeout: 300,
            });
            // sender.balancePRVBefore = balanceAll[TOKEN.PRV]
            logger.info(`sender.balancePRVAfter: ${senderBalancePRVAfter}`);
            // if (pNodeReward.Result[0].Rewards == null) {
            //     pNodeRewardAmount = pNodeReward.Result[0].Rewards[0].Amount
            //     logger.info(`pNode Reward Amount = ${pNodeRewardAmount}`)}
            // else {
            //
            // }
        }).timeout(400000);
    });
});
