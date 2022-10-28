const config = require('../../../constant/config');
const listAccount = require('../../../constant/listAccount.json');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const commonFunction = require('../../../constant/commonFunction');
const validateSchemaCommand = require('../../../schemas/validateSchemaCommand');
const coinServiceApi_schemas = require('../../../schemas/coinServiceApi_schemas');
const addingContent = require('../../../lib/Utils/AddingContent');
let chai = require('chai');
const { IncAccount } = require('../../../lib/Incognito/Account/Account');
const { IncNode } = require('../../../lib/Incognito/IncNode');
const { CoinServiceApi } = require('../../../lib/Incognito/CoinService/CoinServiceApi');

//init
let node = new IncNode(ENV.urlFullNode);
let sender = new IncAccount(listAccount['zxv']).attachTo(node);
let receiver = new IncAccount(listAccount['cjn']).attachTo(node);
let account = {
    privateKey: null,
    otaKey: null
};
let coinServiceApi = new CoinServiceApi();

describe('[Class] Balance', () => {
    describe('Before_InitData', async() => {
        it('InitData', async() => {

            account.otaKey = sender.otaPrivateK;
            account.privateKey = sender.privateK;
        });
    });

    describe('TC001_GetKeyInfo', async() => {
        it('CallAPI', async() => {
            let response = await coinServiceApi.getKeyInfo({
                otaKey: account.otaKey
            });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getGetKeyInfoSchemas, response.data);
        });
    });

    describe('TC006_SubmitOtaKey', async() => {
        it('CallAPI', async() => {
            let response = await coinServiceApi.submitOtaKey(account.otaKey);
        });
        it('Call RPC', async ()=>{
            // let responseRPC = await
        })
    });

    describe('TC007_CheckBalancePrvAfterSend', async() => {
        let amountTransfer = 0;
        const PRV = '0000000000000000000000000000000000000000000000000000000000000004';

        it('STEP_InitData', async() => {
            amountTransfer = await commonFunction.randomNumber(1000);
            await sender.initSdkInstance();
            await receiver.initSdkInstance();
        });

        it('STEP_CheckBalanceCli', async() => {
            sender.balanceCLI = await sender.useCli.getBalanceAll();
            await addingContent.addContent('sender.getBalanceAll', sender.balanceCLI);
            sender.oldBalance = sender.balanceCLI;

            receiver.balanceCLI = await receiver.useCli.getBalanceAll();
            await addingContent.addContent('receiver.getBalanceAll', receiver.balanceCLI);
            receiver.oldBalance = receiver.balanceCLI;
        }).timeout(180000);

        it('STEP_CheckBalanceSdk', async() => {
            sender.balanceSdk = await sender.useSdk.getBalanceAll();
            await addingContent.addContent('sender.balanceSdk', sender.balanceSdk);

            receiver.balanceSdk = await receiver.useSdk.getBalanceAll();
            await addingContent.addContent('receiver.balanceSdk', receiver.balanceSdk);
        }).timeout(100000);

        it('STEP_Send', async() => {
            let amountTransfer=10000
            var proof = await sender.useRpc.makeRawTx(receiver,amountTransfer)

            console.log(`Send PROOF: ${JSON.stringify(proof)}`);
            let tx = await sender.useCli.send(receiver, amountTransfer);
            console.log(`Send PRV : ${tx}`);

            await addingContent.addContent('tx', tx);
            await chainCommonFunction.waitForTxInBlock(tx);
        }).timeout(50000);

        it('STEP_CompareBalance', async() => {
            await commonFunction.sleep(20000);

            sender.balanceCLI = await sender.useCli.getBalanceAll();
            await addingContent.addContent('sender.balanceCLI', sender.balanceCLI);
            sender.newBalance = sender.balanceCLI;

            receiver.balanceCLI = await receiver.useCli.getBalanceAll();
            await addingContent.addContent('receiver.balanceCLI', receiver.balanceCLI);
            receiver.newBalance = receiver.balanceCLI;

            sender.balanceSdk = await sender.useSdk.getBalanceAll();
            await addingContent.addContent('sender.balanceSdk', sender.balanceSdk);

            receiver.balanceSdk = await receiver.useSdk.getBalanceAll();
            await addingContent.addContent('receiver.balanceSdk', receiver.balanceSdk);

            chai.expect(sender.balanceCLI[PRV]).to.equal(sender.balanceSdk[PRV]);
            chai.expect(receiver.balanceCLI[PRV]).to.equal(receiver.balanceSdk[PRV]);

            chai.expect(sender.newBalance[PRV]).to.equal(sender.oldBalance[PRV] - amountTransfer - 100);
            chai.expect(receiver.newBalance[PRV]).to.equal(receiver.oldBalance[PRV] + amountTransfer);
        }).timeout(100000);
    });

});