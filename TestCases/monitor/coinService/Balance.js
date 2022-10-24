const config = require('../../../constant/config');
const sdkCommonFunction = require('../../../constant/sdkCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const commonFunction = require('../../../constant/commonFunction');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const coinServiceApi_schemas = require("../../../schemas/coinServiceApi_schemas");
const addingContent = require('../../../testbase/addingContent');

//Require the dev-dependencies
let chai = require('chai');
const { IncAccount } = require('../../../lib/Incognito/Account/Account');
const { IncNode } = require('../../../lib/Incognito/IncNode');
const { CoinServiceApi } = require('../../../lib/Incognito/CoinService/CoinServiceApi');
const { ENV } = require('../../../global');

describe('[Class] Balance', () => {

    let account = {
        privateKey: null,
        otaKey: null,
    }
    let coinServiceApi = new CoinServiceApi()

    describe('Before_Initdata', async() => {
        it('Initdata', async() => {
            let privateKey = (await config.getAccount('main7')).privateKey

            let node = new IncNode(global.urlFullNode)
            let accountNode = new IncAccount(privateKey).attachTo(node)

            account.otaKey = accountNode.otaPrivateK
            account.privateKey = accountNode.privateK
        })
    })

    describe('TC001_GetKeyInfo', async() => {
        it('CallAPI', async() => {

            console.log("hoanh", account);
            let response = await coinServiceApi.getKeyInfo({ otaKey: account.otaKey })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getGetKeyInfoSchemas, response.data)
        })
    })

    describe('TC002_CheckKeyImage', async() => {
        it('CallAPI', async() => {
            let keyImages = [
                "7w0f383GlwJli1+7+5ocpLimo5iD6hZzmpL52Yh3EKM=",
                "XifUy+NcW/MU+zOTofbfCepu07iWPevoaXkextz9i8w="
            ]

            let response = await coinServiceApi.getKeyImage({ KeyImages: keyImages })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getCheckKeyImageSchemas, response.data)
        })
    })

    describe('TC003_TokenInfo', async() => {
        it('CallAPI', async() => {
            let
                TokenIDs = [
                    "0000000000000000000000000000000000000000000000000000000000000004",
                    "076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229",
                    "0cd19c9cc3f95f8ae9960df14fa5e2a7e7796b3a28058abdc9a8235d8726667d",
                ]

            let response = await coinServiceApi.tokenInfo({ TokenIDs: TokenIDs })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getTokenInfoSchemas, response.data)
        })
    })

    describe('TC004_GetTxsBySender', async() => {
        it('CallAPI', async() => {
            let keyImages = [
                "Wgff+rv59epyKHIjko4mkpiS5BFpopejqD7dkLFExGA=",
                "Alyc63FVuOpiTgk16o8BDAaQfL5hxMFv28H/djaoZPU="
            ]

            let response = await coinServiceApi.getTxsBySender({ shardID: 3, keyImages })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getTxBySenderSchemas, response.data)
        })
    })

    describe('TC005_GetTxsByPubKey', async() => {
        it('CallAPI', async() => {
            let pubkeys = [
                "/14cdQwaARSCnYPwI2GRw5NnnwPKF3Kp5qQ9SDrzNZs=",
                "aN6XseTePHYUf5j/myolNTr6okGvaBSqe2stlMKLZRs="
            ]

            let response = await coinServiceApi.getTxsByPubkey({ pubkeys })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getTxByPubKeySchemas, response.data)
        })
    })

    describe.skip('TC006_CheckBalancePrvAfterSend', async() => {

        let node
        let sender
        let receiver
        let amountTranfer = 0
        const PRV = '0000000000000000000000000000000000000000000000000000000000000004'


        it('STEP_InitData', async() => {
            amountTranfer = await commonFunction.randomNumber(1000)
            node = new IncNode(ENV.urlFullNode)

            sender = new IncAccount((await config.getAccount('2')).privateKey).attachTo(node)
            await sender.initSdkInstance()

            receiver = new IncAccount((await config.getAccount('3')).privateKey).attachTo(node)
            await receiver.initSdkInstance()
        });

        it('STEP_CheckBalanceCli', async() => {
            sender.balanceCLI = await sender.useCli.getBalanceAll()
            await addingContent.addContent('sender.getBalanceAll', sender.balanceCLI)
            sender.oldBalance = sender.balanceCLI

            receiver.balanceCLI = await receiver.useCli.getBalanceAll()
            await addingContent.addContent('receiver.getBalanceAll', receiver.balanceCLI)
            receiver.oldBalance = receiver.balanceCLI
        }).timeout(50000)

        it('STEP_CheckBalanceSdk', async() => {
            sender.balanceSdk = await sender.useSdk.getBalanceAll()
            await addingContent.addContent('sender.balanceSdk', sender.balanceSdk)

            receiver.balanceSdk = await receiver.useSdk.getBalanceAll()
            await addingContent.addContent('receiver.balanceSdk', receiver.balanceSdk)
        }).timeout(100000)

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

    describe.skip('TC007_CheckBalanceTokenAfterSend', async() => {

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