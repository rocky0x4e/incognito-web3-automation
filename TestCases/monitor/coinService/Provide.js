const config = require('../../../constant/config');
const listAccount = require('../../../constant/listAccount.json');
const sdkCommonFunction = require('../../../constant/sdkCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const commonFunction = require('../../../constant/commonFunction');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const coinServiceApi_schemas = require("../../../schemas/coinServiceApi_schemas");
const addingContent = require("../../../lib/Utils/AddingContent");


//Require the dev-dependencies
let chai = require('chai');
const { IncAccount } = require('../../../lib/Incognito/Account/Account');
const { IncNode } = require('../../../lib/Incognito/IncNode');
const { CoinServiceApi } = require('../../../lib/Incognito/CoinService/CoinServiceApi');
const { ENV } = require('../../../global');

let node = new IncNode(ENV.urlFullNode)
let sender = new IncAccount(listAccount['x2c']).attachTo(node)
let receiver = new IncAccount(listAccount['cjn']).attachTo(node)
let account = {
    privateKey: null,
    otaKey: null,
}
let coinServiceApi = new CoinServiceApi()

describe.only('[Class] Provide', () => {

    describe('Before_Initdata', async() => {
        it('Initdata', async() => {
            // let privateKey = (await config.getAccount('zxv')).privateKey
            // console.log(privateKey)
            // let node = new IncNode(global.urlFullNode)
            // let accountNode = new IncAccount(privateKey).attachTo(node)
            console.group("account:")
            console.log(`ota: ${sender.otaPrivateK}`)
            console.log(`pkey: ${sender.privateK}`)
            console.log(`addr: ${sender.paymentK}`)
            console.groupEnd("account:")

            account.otaKey = sender.otaPrivateK
            account.privateKey = sender.privateK
        })
    })

    describe('TC001_GetKeyInfo', async() => {
        it('CallAPI', async() => {

            let response = await coinServiceApi.getKeyInfo({ otaKey: account.otaKey })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getGetKeyInfoSchemas, response.data)
        })
    })

    describe('TC006_SubmitOtaKey', async() => {
        it('CallAPI', async() => {

            let response = await coinServiceApi.submitOtaKey(account.otaKey)
        })
    })

    describe.only('Create Provide PRV transaction', async() => {

        let amountProvide = 0
        const PRV = '0000000000000000000000000000000000000000000000000000000000000004'


        it('STEP_InitData', async() => {
            amountProvide = await commonFunction.randomNumberInRange(1000000000, 10000000000)
            await sender.initSdkInstance()

        });

        it('STEP_CheckBalanceSenderFromCli', async() => {
            sender.balanceCLI = await sender.useCli.getBalanceAll()
            await addingContent.addContent('sender.getBalanceAll', sender.balanceCLI)
            sender.oldBalance = sender.balanceCLI


        }).timeout(360000)

        it('STEP_CreateRawTransactionFromRPC', async() => {
            sender.balanceSdk = await sender.useSdk.getBalanceAll()
            await addingContent.addContent('sender.balanceSdk', sender.balanceSdk)

            receiver.balanceSdk = await receiver.useSdk.getBalanceAll()
            await addingContent.addContent('receiver.balanceSdk', receiver.balanceSdk)
        }).timeout(360000)

        it('STEP_Send', async() => {

            let tx = await sender.useCli.send(receiver, amountTranfer)

            console.log(`Send PRV : ${tx}`);
            await addingContent.addContent('tx', tx)
            await chainCommonFunction.waitForTxInBlock(tx)
        }).timeout(50000)

        it('STEP_CompareBalance', async() => {
            await commonFunction.sleep(20000)

            sender.balanceCLI = await sender.useCli.getBalanceAll()
            await addingContent.addContent('sender.balanceCLI', sender.balanceCLI)
            sender.newBalance = sender.balanceCLI

            receiver.balanceCLI = await receiver.useCli.getBalanceAll()
            await addingContent.addContent('receiver.balanceCLI', receiver.balanceCLI)
            receiver.newBalance = receiver.balanceCLI

            sender.balanceSdk = await sender.useSdk.getBalanceAll()
            await addingContent.addContent('sender.balanceSdk', sender.balanceSdk)

            receiver.balanceSdk = await receiver.useSdk.getBalanceAll()
            await addingContent.addContent('receiver.balanceSdk', receiver.balanceSdk)

            chai.expect(sender.balanceCLI[PRV]).to.equal(sender.balanceSdk[PRV])
            chai.expect(receiver.balanceCLI[PRV]).to.equal(receiver.balanceSdk[PRV])

            chai.expect(sender.newBalance[PRV]).to.equal(sender.oldBalance[PRV] - amountTranfer - 100)
            chai.expect(receiver.newBalance[PRV]).to.equal(receiver.oldBalance[PRV] + amountTranfer)

        }).timeout(100000)
    })

    describe('TC007_CheckBalancePrvAfterSend', async() => {

        let amountTranfer = 0
        const PRV = '0000000000000000000000000000000000000000000000000000000000000004'


        it('STEP_InitData', async() => {
            amountTranfer = await commonFunction.randomNumber(1000)
            await sender.initSdkInstance()
            await receiver.initSdkInstance()
        });

        it('STEP_CheckBalanceCli', async() => {
            sender.balanceCLI = await sender.useCli.getBalanceAll()
            await addingContent.addContent('sender.getBalanceAll', sender.balanceCLI)
            sender.oldBalance = sender.balanceCLI

            receiver.balanceCLI = await receiver.useCli.getBalanceAll()
            await addingContent.addContent('receiver.getBalanceAll', receiver.balanceCLI)
            receiver.oldBalance = receiver.balanceCLI
        }).timeout(360000)

        it('STEP_CheckBalanceSdk', async() => {
            sender.balanceSdk = await sender.useSdk.getBalanceAll()
            await addingContent.addContent('sender.balanceSdk', sender.balanceSdk)

            receiver.balanceSdk = await receiver.useSdk.getBalanceAll()
            await addingContent.addContent('receiver.balanceSdk', receiver.balanceSdk)
        }).timeout(360000)

        it('STEP_Send', async() => {

            let tx = await sender.useCli.send(receiver, amountTranfer)

            console.log(`Send PRV : ${tx}`);
            await addingContent.addContent('tx', tx)
            await chainCommonFunction.waitForTxInBlock(tx)
        }).timeout(50000)

        it('STEP_CompareBalance', async() => {
            await commonFunction.sleep(20000)

            sender.balanceCLI = await sender.useCli.getBalanceAll()
            await addingContent.addContent('sender.balanceCLI', sender.balanceCLI)
            sender.newBalance = sender.balanceCLI

            receiver.balanceCLI = await receiver.useCli.getBalanceAll()
            await addingContent.addContent('receiver.balanceCLI', receiver.balanceCLI)
            receiver.newBalance = receiver.balanceCLI

            sender.balanceSdk = await sender.useSdk.getBalanceAll()
            await addingContent.addContent('sender.balanceSdk', sender.balanceSdk)

            receiver.balanceSdk = await receiver.useSdk.getBalanceAll()
            await addingContent.addContent('receiver.balanceSdk', receiver.balanceSdk)

            chai.expect(sender.balanceCLI[PRV]).to.equal(sender.balanceSdk[PRV])
            chai.expect(receiver.balanceCLI[PRV]).to.equal(receiver.balanceSdk[PRV])

            chai.expect(sender.newBalance[PRV]).to.equal(sender.oldBalance[PRV] - amountTranfer - 100)
            chai.expect(receiver.newBalance[PRV]).to.equal(receiver.oldBalance[PRV] + amountTranfer)

        }).timeout(100000)
    })

    describe.skip('TC008_CheckBalanceTokenAfterSend', async() => {

        let accountSend = {
            balanceCLI: 0,
            balanceSdk: 0,
            privateKey: 0,
            paymentAddress: 0,
            accoutSdk: 0,
            oldBalance: 0,
            newBalance: 0
        }
        let accountReceive = {
            balanceCLI: 0,
            balanceSdk: 0,
            privateKey: 0,
            paymentAddress: 0,
            oldBalance: 0,
            newBalance: 0
        }
        let amountTranfer = 0
        let USDT = '076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229'


        it('STEP_InitData', async() => {
            amountTranfer = await commonFunction.randomNumber(1000)

            account1 = await config.getAccount("3")
            accountSend.privateKey = account1.privateKey
            console.log('accountSend.privateKey', accountSend.privateKey);
            accountSend.accoutSdk = await sdkCommonFunction.initAccount(accountSend.privateKey)

            account2 = await config.getAccount("2")
            accountReceive.privateKey = account2.privateKey
            accountReceive.paymentAddress = (await cliCommonFunction.keyInfo(account2.privateKey)).PaymentAddress
            console.log('accountReceive.paymentAddress', accountReceive.paymentAddress);
            accountReceive.accoutSdk = await sdkCommonFunction.initAccount(accountReceive.privateKey)
        });

        it('STEP_CheckBalanceCli', async() => {
            accountSend.balanceCLI = await cliCommonFunction.loadBalance(accountSend.privateKey)
            await addingContent.addContent('accountSend.balanceCLI', accountSend.balanceCLI)
            accountSend.oldBalance = accountSend.balanceCLI

            accountReceive.balanceCLI = await cliCommonFunction.loadBalance(accountReceive.privateKey)
            await addingContent.addContent('accountReceive.balanceCLI', accountReceive.balanceCLI)
            accountReceive.oldBalance = accountReceive.balanceCLI
        }).timeout(1000000)

        it('STEP_CheckBalanceSdk', async() => {
            accountSend.balanceSdk = await sdkCommonFunction.checkBalance({ account: accountSend.accoutSdk })
            await addingContent.addContent('accountSend.balanceSdk', accountSend.balanceSdk)

            accountReceive.balanceSdk = await sdkCommonFunction.checkBalance({ account: accountReceive.accoutSdk })
            await addingContent.addContent('accountReceive.balanceSdk', accountReceive.balanceSdk)

        }).timeout(1000000)

        it('STEP_Send', async() => {

            let tx = await sdkCommonFunction.sendToken({
                account: accountSend.accoutSdk,
                tokenId: USDT,
                paymentAddress: accountReceive.paymentAddress,
                amountTransfer: amountTranfer
            })
            console.log(`Send Token : ${tx}`);
            await addingContent.addContent('tx', tx)
            await chainCommonFunction.waitForTxInBlock(tx)
        }).timeout(1000000)

        it('STEP_CompareBalance', async() => {
            await commonFunction.sleep(20000)

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

            chai.expect(accountSend.balanceCLI[USDT]).to.equal(accountSend.balanceSdk[USDT])
            chai.expect(accountReceive.balanceCLI[USDT]).to.equal(accountReceive.balanceSdk[USDT])

            chai.expect(accountSend.newBalance[USDT]).to.equal(accountSend.oldBalance[USDT] - amountTranfer)
            chai.expect(accountReceive.newBalance[USDT]).to.equal(accountReceive.oldBalance[USDT] + amountTranfer)

        }).timeout(1000000)
    })
})