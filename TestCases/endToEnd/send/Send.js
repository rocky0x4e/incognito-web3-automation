const { TOKEN, TOKEN_TESTNET } = require('../../../lib/Incognito/Constants')
const GenAction = require("../../../lib/Utils/GenAction");
let chai = require("chai");
const { getLogger } = require("../../../lib/Utils/LoggingManager");
const { ACCOUNTS, NODES } = require('../../TestBase');
const logger = getLogger("Send")

let sender = ACCOUNTS.Incognito.get(2)
let receiver = ACCOUNTS.Incognito.get(3)

describe("[Class] Pdex", () => {
    describe("TC001_SendPRV", async () => {
        let amountSend = 0
        let tx

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();
            await receiver.initSdkInstance();

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]
            logger.info({ balancePRVBefore: sender.balancePRVBefore })

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balancePRVBefore = balanceAll[TOKEN.PRV]
            logger.info({ balancePRVBefore: receiver.balancePRVBefore })

            amountSend = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_Send", async () => {
            tx = await sender.useSdk.sendPRV(
                receiver,
                amountSend
            )

            logger.info({ tx })
            await NODES.Incognito.getTransactionByHashRpc(tx)
            await GenAction.sleep(60000)
        }).timeout(120000);

        it("STEP_VerifyBalance", async () => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.PRV]
            logger.info({ balancePRVAfter: sender.balancePRVAfter })

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balancePRVAfter = balanceAll[TOKEN.PRV]
            logger.info({ balancePRVAfter: receiver.balancePRVAfter })

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - amountSend - 100);
            chai.expect(receiver.balancePRVAfter).to.equal(receiver.balancePRVBefore + amountSend);

        }).timeout(60000);
    });

    describe("TC001_SendToken", async () => {
        let amountSend = 0
        let tx

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();
            await receiver.initSdkInstance();

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceTokenBefore = balanceAll[TOKEN_TESTNET.DAI_UT]
            logger.info({ balanceTokenBefore: sender.balanceTokenBefore })

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceTokenBefore = balanceAll[TOKEN_TESTNET.DAI_UT]
            logger.info({ balanceTokenBefore: receiver.balanceTokenBefore })

            amountSend = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_Send", async () => {
            tx = await sender.useSdk.sendToken(
                TOKEN_TESTNET.DAI_UT,
                receiver,
                amountSend
            )

            logger.info({ tx })
            await NODES.Incognito.getTransactionByHashRpc(tx)
            await GenAction.sleep(60000)
        }).timeout(120000);

        it("STEP_VerifyBalance", async () => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceTokenAfter = balanceAll[TOKEN_TESTNET.DAI_UT]
            logger.info({ balancePRVAfter: sender.balancePRVAfter })

            balanceAll = await receiver.useCli.getBalanceAll()
            receiver.balanceTokenAfter = balanceAll[TOKEN_TESTNET.DAI_UT]
            logger.info({ balancePRVAfter: receiver.balancePRVAfter })

            chai.expect(sender.balanceTokenAfter).to.equal(sender.balanceTokenBefore - amountSend);
            chai.expect(receiver.balanceTokenAfter).to.equal(receiver.balanceTokenBefore + amountSend);

        }).timeout(60000);
    });


});