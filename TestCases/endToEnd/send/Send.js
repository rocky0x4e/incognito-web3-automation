const { TOKEN } = require('../../../lib/Incognito/Constants')
const listAccount = require("../../../constant/listAccount.json");
const { IncNode } = require("../../../lib/Incognito/IncNode");
const { IncAccount } = require("../../../lib/Incognito/Account/Account");
const { IncRpc } = require("../../../lib/Incognito/RPC/Rpc");
const GenAction = require("../../../lib/Utils/GenAction");
let chai = require("chai");
const { getLogger } = require("../../../lib/Utils/LoggingManager");
const logger = getLogger("Send")
const { ACCOUNTS } = require('../../TestBase');

let rpc = new IncRpc();
let node = new IncNode()
let sender = ACCOUNTS.Incognito.get(2)
let receiver = ACCOUNTS.Incognito.get(3)


describe("[Class] Send", () => {
    describe("TC001_SendPRV", async() => {
        let amountSend = 0
        let tx

        it("STEP_InitData", async() => {
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

        it("STEP_Send", async() => {
            tx = await sender.useSdk.sendPRV({
                receiver,
                amount: amountSend
            })
            logger.info({ tx })
            await node.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.PRV,
                countNumber: 20,
            })
        }).timeout(120000);

        it("STEP_VerifyBalance", async() => {
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
})

describe("TC001_SendToken", async() => {
let amountSend = 0
let tx

it("STEP_InitData", async() => {
    await sender.initSdkInstance();
    await receiver.initSdkInstance();

    let balanceAll = await sender.useCli.getBalanceAll()
    sender.balanceTokenBefore = balanceAll[TOKEN.DAI_UT]
    logger.info({ balanceTokenBefore: sender.balanceTokenBefore })

    balanceAll = await receiver.useCli.getBalanceAll()
    receiver.balanceTokenBefore = balanceAll[TOKEN.DAI_UT]
    logger.info({ balanceTokenBefore: receiver.balanceTokenBefore })

    amountSend = await GenAction.randomNumber(100000)
}).timeout(60000);

it("STEP_Send", async() => {
    tx = await sender.useSdk.sendToken({
        token: TOKEN.DAI_UT,
        receiver,
        amount: amountSend,
    })

    logger.info({ tx })
    await NODES.Incognito.getTransactionByHashRpc(tx)
    await sender.useSdk.waitForUtxoChange({
        tokenID: TOKEN.DAI_UT,
        countNumber: 20,
    })
}).timeout(120000);

it("STEP_VerifyBalance", async() => {
    let balanceAll = await sender.useCli.getBalanceAll()
    sender.balanceTokenAfter = balanceAll[TOKEN.DAI_UT]
    logger.info({ balancePRVAfter: sender.balancePRVAfter })

    balanceAll = await receiver.useCli.getBalanceAll()
    receiver.balanceTokenAfter = balanceAll[TOKEN.DAI_UT]
    logger.info({ balancePRVAfter: receiver.balancePRVAfter })

    chai.expect(sender.balanceTokenAfter).to.equal(sender.balanceTokenBefore - amountSend);
    chai.expect(receiver.balanceTokenAfter).to.equal(receiver.balanceTokenBefore + amountSend);

}).timeout(60000);
});

});