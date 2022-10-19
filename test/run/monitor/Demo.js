const config = require('../../../constant/config');
const cliCommonFunction = require('../../../constant/cliCommonFunction');
const sdkCommonFunction = require('../../../constant/sdkCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const commonFunction = require('../../../constant/commonFunction');
const coinServiceApi = require('../../../models/coinServiceApi');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const coinServiceApi_schemas = require("../../../schemas/coinServiceApi_schemas");
const addingContent = require('../../../testbase/addingContent');

const { IncAccount, IncAccountGroup } = require("../../../lib/Incognito/Account")
const { IncNode } = require("../../../lib/Incognito/IncNode")


//Require the dev-dependencies
let chai = require('chai');

describe('[Class] Demo', () => {

    let account = {
        privateKey: null,
        otaKey: null,
    }

    describe('TC004_CheckBalancePrvAfterSend', async() => {

        let node = new IncNode(global.urlFullNode)
        let sender = new IncAccount((await config.getAccount('3')).privateKey).attachTo(node)
        let receiver = new IncAccount((await config.getAccount('2')).privateKey).attachTo(node)
        let amountTranfer = 0
        let PRV = '0000000000000000000000000000000000000000000000000000000000000004'


        it('STEP_InitData', async() => {
            amountTranfer = await commonFunction.randomNumber(1000)

            console.log('sender.privateK', sender.privateK);
            sender.accoutSdk = await sdkCommonFunction.initAccount(sender.privateK)

            console.log('receiver.privateK', receiver.privateK);
            receiver.accoutSdk = await sdkCommonFunction.initAccount(receiver.privateK)
        });

        it('STEP_CheckBalanceCli', async() => {
            sender.balanceCLI = sender.getBalanceAll()
            await addingContent.addContent('sender.getBalanceAll', sender.balanceCLI)
            sender.oldBalance = sender.balanceCLI

            receiver.balanceCLI = receiver.getBalanceAll()
            await addingContent.addContent('receiver.getBalanceAll', receiver.balanceCLI)
            receiver.oldBalance = receiver.balanceCLI
        }).timeout(1000000)

        it.skip('STEP_CheckBalanceSdk', async() => {
            accountSend.balanceSdk = await sdkCommonFunction.checkBalance({ account: accountSend.accoutSdk })
            await addingContent.addContent('accountSend.balanceSdk', accountSend.balanceSdk)

            accountReceive.balanceSdk = await sdkCommonFunction.checkBalance({ account: accountReceive.accoutSdk })
            await addingContent.addContent('accountReceive.balanceSdk', accountReceive.balanceSdk)

        }).timeout(1000000)

        it.skip('STEP_Send', async() => {

            let tx = await sdkCommonFunction.send({
                account: accountSend.accoutSdk,
                paymentAddress: accountReceive.paymentAddress,
                amountTransfer: amountTranfer,
            })
            console.log(`Send PRV : ${tx}`);
            await addingContent.addContent('tx', tx)
            await chainCommonFunction.waitForTxInBlock(tx)
        }).timeout(1000000)

        it.skip('STEP_CompareBalance', async() => {
            await commonFunction.sleep(200000)

            accountSend.balanceCLI = await cliCommonFunction.loadBalance(accountSend.privateKey)
            await addingContent.addContent('accountSend.balanceCLI', accountSend.balanceCLI)
            accountSend.newBalance = accountSend.balanceCLI

            accountReceive.balanceCLI = await cliCommonFunction.loadBalance(accountReceive.privateKey)
            await addingContent.addContent('accountReceive.balanceCLI', accountReceive.balanceCLI)
            accountReceive.newBalance = accountReceive.balanceCLI

            accountSend.balanceSdk = await sdkCommonFunction.checkBalance({ account: accountSend.accoutSdk })
            await addingContent.addContent('accountSend.balanceSdk', accountSend.balanceSdk)

            accountReceive.balanceSdk = await sdkCommonFunction.checkBalance({ account: accountReceive.accoutSdk })
            await addingContent.addContent('accountReceive.balanceSdk', accountReceive.balanceSdk)

            chai.expect(accountSend.balanceCLI[PRV]).to.equal(accountSend.balanceSdk[PRV])
            chai.expect(accountReceive.balanceCLI[PRV]).to.equal(accountReceive.balanceSdk[PRV])

            chai.expect(accountSend.newBalance[PRV]).to.equal(accountSend.oldBalance[PRV] - amountTranfer - 100)
            chai.expect(accountReceive.newBalance[PRV]).to.equal(accountReceive.oldBalance[PRV] + amountTranfer)

        }).timeout(1000000)
    })


})