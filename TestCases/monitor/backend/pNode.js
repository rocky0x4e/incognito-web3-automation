let chai = require("chai");
const { CoinServiceApi } = require("../../../lib/Incognito/CoinServiceApi");
const { BackendApi } = require("../../../lib/Incognito/BackendApi");
const { ENV } = require("../../../global");
const { getLogger } = require("../../../lib/Utils/LoggingManager");
const { ACCOUNTS } = require("../../TestBase");
const logger = getLogger("pNode");

let sender = ACCOUNTS.Incognito.get(3);
let coinServiceApi = new CoinServiceApi();
let backendApi = new BackendApi();

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
            console.log(`sender privatekey: ${sender.privateK}`);
            await sender.initSdkInstance();
            senderBalancePRVBefore = await sender.useSdk.getBalance();
            logger.info(`sender.balancePRVBefore: ${senderBalancePRVBefore}`);

            let pNodeReward = await backendApi.getpNodeInfo();
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
                logger.info("Withdraw pNode Reward: SKIPPED");
            }
        });

        it(" STEP get NEW reward and balance", async () => {
            if (execute_test) {
                let pNodeReward = await backendApi.getpNodeInfo();
                chai.expect(pNodeReward.Result[0].Rewards).to.equal(null);

                senderBalancePRVAfter = await sender.useCli.waitBalanceChange({
                    from: senderBalancePRVBefore,
                    amountChange: pNodeRewardAmount,
                    checkInterval: 30,
                    timeout: 300,
                });
                chai.expect(senderBalancePRVAfter - senderBalancePRVAfter).to.be.equal(pNodeRewardAmount);
                logger.info(`sender.balancePRVAfter: ${senderBalancePRVAfter}`);
            } else {
                logger.info("Checking balance after withdraw reward: SKIPPED");
            }
        }).timeout(400000);
    });
});
