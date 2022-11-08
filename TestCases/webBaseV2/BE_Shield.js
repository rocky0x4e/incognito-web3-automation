let chai = require('chai');
const { WebServiceApi } = require('../../lib/Incognito/WebServiceApi');
const { BackendApi } = require('../../lib/Incognito/BackendApi');
const { CoinServiceApi } = require('../../lib/Incognito/CoinServiceApi');
const { IncRpc } = require('../../lib/Incognito/RPC/Rpc');

let paymentAddress = '12sfV7Vo27Rz3aT4c2kyiTpvziwXjviQMMrp5gsFfupAvoDveHhQLunAWvqTao46DSEYpnbMpGYxuc4a9KGU7BppPM9uZtfVCqPAQ18WtPEijsLmYxVL1MWWDggDZHfRmhtxmVijadCjXyr7iC9X'

let webServiceApi = new WebServiceApi()
let coinServiceApi = new CoinServiceApi()
let backendApi = new BackendApi()
let incRpc = new IncRpc()

//Our parent block
describe('[Class]BEShield', async() => {

    //Testcase
    describe('TC001_VerifyShieldZIL', async() => {

        let tokenID, currenctType, beShieldAddress, beWebShieldAddress

        before(async() => {
            tokenID = await coinServiceApi.getTokenIdFromSymbol('ZIL')
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol('ZEC')
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol('DASH')
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol('NEO')
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol('LTC')
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol('BTC')
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