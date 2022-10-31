let chai = require('chai');
const config = require('../../constant/config');
const { WebServiceApi } = require('../../lib/Incognito/WebServiceApi');
const { BackendApi } = require('../../lib/Incognito/BackendApi');
const { CoinServiceApi } = require('../../lib/Incognito/CoinServiceApi');
const { IncRpc } = require('../../lib/Incognito/RPC/Rpc');
const { ENV } = require('../../global');

let paymentAddress = '12sfV7Vo27Rz3aT4c2kyiTpvziwXjviQMMrp5gsFfupAvoDveHhQLunAWvqTao46DSEYpnbMpGYxuc4a9KGU7BppPM9uZtfVCqPAQ18WtPEijsLmYxVL1MWWDggDZHfRmhtxmVijadCjXyr7iC9X'

let webServiceApi = new WebServiceApi(ENV.WebService)
let coinServiceApi = new CoinServiceApi()
let backendApi = new BackendApi(ENV.Backend)
let incRpc = new IncRpc(ENV.FullNode.url)

//Our parent block
describe('[Class]BEShield', async() => {

    //Testcase
    describe('TC001_VerifyShieldZIL', async() => {

        let tokenID, currenctType, beShieldAddress, beWebShieldAddress

        before(async() => {
            tokenID = await getTokenID('ZIL')
            currenctType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });

        it('STEP_genShieldAddressFromBankend', async() => {

            let response = await backendApi.otaGenerateShield({
                CurrencyType: currenctType,
                PaymentAddress: paymentAddress,
                PrivacyTokenAddress: tokenID,
            })

            beShieldAddress = response.data.Result.Address

        });

        it('STEP_genShieldAddressFromWebService', async() => {

            let response = await webServiceApi.genShieldAddressV2({
                network: 'centralized',
                currencyType: currenctType,
                paymentAddress: paymentAddress,
                privacyTokenAddress: tokenID,
            })

            beWebShieldAddress = response.data.Result.Address
        });

        //step 3 : compare 2 body
        it('STEP_compare', async() => {
            chai.assert.equal(beShieldAddress, beWebShieldAddress)
        });
    });

    describe('TC002_VerifyShieldZEC', async() => {

        let tokenID, currenctType, beShieldAddress, beWebShieldAddress

        before(async() => {
            tokenID = await getTokenID('ZEC')
            currenctType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });

        it('STEP_genShieldAddressFromBankend', async() => {

            let response = await backendApi.otaGenerateShield({
                CurrencyType: currenctType,
                PaymentAddress: paymentAddress,
                PrivacyTokenAddress: tokenID,
            })

            beShieldAddress = response.data.Result.Address

        });

        it('STEP_genShieldAddressFromWebService', async() => {

            let response = await webServiceApi.genShieldAddressV2({
                network: 'centralized',
                currencyType: currenctType,
                paymentAddress: paymentAddress,
                privacyTokenAddress: tokenID,
            })

            beWebShieldAddress = response.data.Result.Address
        });

        //step 3 : compare 2 body
        it('STEP_compare', async() => {
            chai.assert.equal(beShieldAddress, beWebShieldAddress)
        });
    });

    describe('TC003_VerifyShieldDASH', async() => {

        let tokenID, currenctType, beShieldAddress, beWebShieldAddress

        before(async() => {
            tokenID = await getTokenID('DASH')
            currenctType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });

        it('STEP_genShieldAddressFromBankend', async() => {

            let response = await backendApi.otaGenerateShield({
                CurrencyType: currenctType,
                PaymentAddress: paymentAddress,
                PrivacyTokenAddress: tokenID,
            })

            beShieldAddress = response.data.Result.Address

        });

        it('STEP_genShieldAddressFromWebService', async() => {

            let response = await webServiceApi.genShieldAddressV2({
                network: 'centralized',
                currencyType: currenctType,
                paymentAddress: paymentAddress,
                privacyTokenAddress: tokenID,
            })

            beWebShieldAddress = response.data.Result.Address
        });

        //step 3 : compare 2 body
        it('STEP_compare', async() => {
            chai.assert.equal(beShieldAddress, beWebShieldAddress)
        });
    });

    describe('TC004_VerifyShieldNEO', async() => {

        let tokenID, currenctType, beShieldAddress, beWebShieldAddress

        before(async() => {
            tokenID = await getTokenID('NEO')
            currenctType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });

        it('STEP_genShieldAddressFromBankend', async() => {

            let response = await backendApi.otaGenerateShield({
                CurrencyType: currenctType,
                PaymentAddress: paymentAddress,
                PrivacyTokenAddress: tokenID,
            })

            beShieldAddress = response.data.Result.Address

        });

        it('STEP_genShieldAddressFromWebService', async() => {

            let response = await webServiceApi.genShieldAddressV2({
                network: 'centralized',
                currencyType: currenctType,
                paymentAddress: paymentAddress,
                privacyTokenAddress: tokenID,
            })

            beWebShieldAddress = response.data.Result.Address
        });

        //step 3 : compare 2 body
        it('STEP_compare', async() => {
            chai.assert.equal(beShieldAddress, beWebShieldAddress)
        });
    });

    describe('TC005_VerifyShieldLTC', async() => {

        let tokenID, currenctType, beShieldAddress, beWebShieldAddress

        before(async() => {
            tokenID = await getTokenID('LTC')
            currenctType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });

        it('STEP_genShieldAddressFromBankend', async() => {

            let response = await backendApi.otaGenerateShield({
                CurrencyType: currenctType,
                PaymentAddress: paymentAddress,
                PrivacyTokenAddress: tokenID,
            })

            beShieldAddress = response.data.Result.Address

        });

        it('STEP_genShieldAddressFromWebService', async() => {

            let response = await webServiceApi.genShieldAddressV2({
                network: 'centralized',
                currencyType: currenctType,
                paymentAddress: paymentAddress,
                privacyTokenAddress: tokenID,
            })

            beWebShieldAddress = response.data.Result.Address
        });

        //step 3 : compare 2 body
        it('STEP_compare', async() => {
            chai.assert.equal(beShieldAddress, beWebShieldAddress)
        });
    });

    describe('TC006_VerifyShieldDOT', async() => {

        let tokenID, currenctType, beShieldAddress, beWebShieldAddress

        before(async() => {
            tokenID = await getTokenID('DOT')
            currenctType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });

        it('STEP_genShieldAddressFromBankend', async() => {

            let response = await backendApi.otaGenerateShield({
                CurrencyType: currenctType,
                PaymentAddress: paymentAddress,
                PrivacyTokenAddress: tokenID,
            })

            beShieldAddress = response.data.Result.Address

        });

        it('STEP_genShieldAddressFromWebService', async() => {

            let response = await webServiceApi.genShieldAddressV2({
                network: 'centralized',
                currencyType: currenctType,
                paymentAddress: paymentAddress,
                privacyTokenAddress: tokenID,
            })

            beWebShieldAddress = response.data.Result.Address
        });

        //step 3 : compare 2 body
        it('STEP_compare', async() => {
            chai.assert.equal(beShieldAddress, beWebShieldAddress)
        });
    });

    describe('TC007_VerifyShieldBTC', async() => {

        let tokenID, currenctType, beShieldAddress, beWebShieldAddress

        before(async() => {
            tokenID = await getTokenID('BTC')
            currenctType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });

        it('STEP_genShieldAddressFromFullNode', async() => {

            let response = await incRpc.generateportalshieldmultisigaddress(paymentAddress, tokenID)

            beShieldAddress = response.data.Result
        });

        it('STEP_genShieldAddressFromWebService', async() => {

            let response = await webServiceApi.genShieldAddressV2({
                network: 'btc',
                currencyType: currenctType,
                paymentAddress: paymentAddress,
                privacyTokenAddress: tokenID,
            })

            beWebShieldAddress = response.data.Result.Address
        });

        //step 3 : compare 2 body
        it('STEP_compare', async() => {
            chai.assert.equal(beShieldAddress, beWebShieldAddress)
        });

    });

});

const getTokenID = async(tokenName) => {
    if (global.ENV == 'testnet2') {
        switch (tokenName) {
            case 'ZIL':
                return '880ea0787f6c1555e59e3958a595086b7802fc7a38276bcd80d4525606557fbc'
            case 'ZEC':
                return 'a609150120c0247407e6d7725f2a9701dcbb7bab5337a70b9cef801f34bc2b5c'
            case 'DASH':
                return '447b088f1c2a8e08bff622ef43a477e98af22b64ea34f99278f4b550d285fbff'
            case 'NEO':
                return '86c45a9fdddc5546e3b4f09dba211b836aefc5d08ed22e7d33cff7f9b8b39c10'
            case 'LTC':
                return '7450ad98cb8c967afb76503944ab30b4ce3560ed8f3acc3155f687641ae34135'
            case 'DOT':
                return '9442d607e3a18d553222f6e8fe7fcc93fc5a4961bf7ccd7f840196bc5383469a'
            case 'BTC':
                return '4584d5e9b2fc0337dfb17f4b5bb025e5b82c38cfa4f54e8a3d4fcdd03954ff82'
            default:
                break;
        }
    }
    return null
}