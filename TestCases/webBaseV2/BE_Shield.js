//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
const cliCommonFunction = require('../../../constant/cliCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const csCommonFunction = require('../../../constant/csCommonFunction');
const beCommonFunction = require('../../../constant/beCommonFunction');
const common = require('../../../constant/commonFunction');
const api = require('../../../constant/api');
const backendApi = require('../../../models/backendApi');
const webServiceApi = require('../../../models/webServiceApi');

let beTokenAuthen
let paymentAddress = '12sfV7Vo27Rz3aT4c2kyiTpvziwXjviQMMrp5gsFfupAvoDveHhQLunAWvqTao46DSEYpnbMpGYxuc4a9KGU7BppPM9uZtfVCqPAQ18WtPEijsLmYxVL1MWWDggDZHfRmhtxmVijadCjXyr7iC9X'

//Our parent block
describe('[Class]BEShield', async() => {

    //Before
    before(async() => {
        console.log("[Before]InitData");
        beTokenAuthen = await beCommonFunction.newToken()
        console.log({ beTokenAuthen });
    });

    //Testcase
    describe('TC001_VerifyShieldZIL', async() => {

        let tokenID, currenctType, beShieldAddress, beWebShieldAddress

        before(async() => {
            tokenID = await getTokenID('ZIL')
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        //step 1 : gen ZIL shield address from BE
        it('STEP_genShieldAddressFromBE', async() => {

            let response = await backendApi.Api_OTA_Generate(beTokenAuthen, currenctType, 1, paymentAddress, paymentAddress, tokenID, 1)

            beShieldAddress = response.Result.Address

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 2 : gen ZIL shield address from lam service
        it('STEP_genShieldAddressFromBEWeb', async() => {

            let response = await webServiceApi.Api_OTA_Shield('centralized', currenctType, 1, "0.00001", paymentAddress, paymentAddress, tokenID)

            beWebShieldAddress = response.Result.Address

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

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
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        //step 1 : gen ZIL shield address from BE
        it('STEP_genShieldAddressFromBE', async() => {

            let response = await backendApi.Api_OTA_Generate(beTokenAuthen, currenctType, 1, paymentAddress, paymentAddress, tokenID, 1)

            beShieldAddress = response.Result.Address

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 2 : gen ZIL shield address from lam service
        it('STEP_genShieldAddressFromBEWeb', async() => {

            let response = await webServiceApi.Api_OTA_Shield('centralized', currenctType, 1, "0.00001", paymentAddress, paymentAddress, tokenID)
            beWebShieldAddress = response.Result.Address

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

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
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        //step 1 : gen ZIL shield address from BE
        it('STEP_genShieldAddressFromBE', async() => {

            let response = await backendApi.Api_OTA_Generate(beTokenAuthen, currenctType, 1, paymentAddress, paymentAddress, tokenID, 1)


            beShieldAddress = response.Result.Address

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 2 : gen ZIL shield address from lam service
        it('STEP_genShieldAddressFromBEWeb', async() => {

            let response = await webServiceApi.Api_OTA_Shield('centralized', currenctType, 1, "0.00001", paymentAddress, paymentAddress, tokenID)


            beWebShieldAddress = response.Result.Address

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

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
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        //step 1 : gen ZIL shield address from BE
        it('STEP_genShieldAddressFromBE', async() => {

            let response = await backendApi.Api_OTA_Generate(beTokenAuthen, currenctType, 1, paymentAddress, paymentAddress, tokenID, 1)


            beShieldAddress = response.Result.Address

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 2 : gen ZIL shield address from lam service
        it('STEP_genShieldAddressFromBEWeb', async() => {

            let response = await webServiceApi.Api_OTA_Shield('centralized', currenctType, 1, "0.00001", paymentAddress, paymentAddress, tokenID)


            beWebShieldAddress = response.Result.Address

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

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
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        //step 1 : gen ZIL shield address from BE
        it('STEP_genShieldAddressFromBE', async() => {

            let response = await backendApi.Api_OTA_Generate(beTokenAuthen, currenctType, 1, paymentAddress, paymentAddress, tokenID, 1)


            beShieldAddress = response.Result.Address


            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 2 : gen ZIL shield address from lam service
        it('STEP_genShieldAddressFromBEWeb', async() => {

            let response = await webServiceApi.Api_OTA_Shield('centralized', currenctType, 1, "0.00001", paymentAddress, paymentAddress, tokenID)


            beWebShieldAddress = response.Result.Address

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

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
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        //step 1 : gen ZIL shield address from BE
        it('STEP_genShieldAddressFromBE', async() => {

            let response = await backendApi.Api_OTA_Generate(beTokenAuthen, currenctType, 1, paymentAddress, paymentAddress, tokenID, 1)


            beShieldAddress = response.Result.Address

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 2 : gen ZIL shield address from lam service
        it('STEP_genShieldAddressFromBEWeb', async() => {

            let response = await webServiceApi.Api_OTA_Shield('centralized', currenctType, 1, "0.00001", paymentAddress, paymentAddress, tokenID)


            beWebShieldAddress = response.Result.Address

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 3 : compare 2 body
        it('STEP_compare', async() => {
            chai.assert.equal(beShieldAddress, beWebShieldAddress)
        });
    });

    describe('TC007_VerifyShieldBTC', async() => {

        let tokenID, beShieldAddress, beWebShieldAddress

        before(async() => {
            tokenID = await getTokenID('BTC')
        });

        //step 1 : gen ZIL shield address from BE
        it('STEP_genShieldAddressFromBE', async() => {
            url = global.urlFullNode
            body = {
                "jsonrpc": "1.0",
                "method": "generateportalshieldmultisigaddress",
                "params": [{
                    "IncAddressStr": paymentAddress,
                    "TokenID": tokenID
                }],
                "id": 1
            }
            let response = await api.post(url, body)
            beShieldAddress = response.Result

            chai.expect(response).have.property('Result')
            chai.expect(response).have.property('Error')
            chai.expect(response).have.property('Params')
            chai.expect(response).have.property('Method')
            chai.expect(response).have.property('Jsonrpc')
            chai.expect(response.Params[0]).have.property('IncAddressStr')
            chai.expect(response.Params[0]).have.property('TokenID')

        });

        //step 2 : gen ZIL shield address from lam service
        it('STEP_genShieldAddressFromBEWeb', async() => {
            url = 'http://51.161.117.193:9898/genshieldaddress'
            body = {
                "Network": "btc",
                "BTCIncAddress": paymentAddress
            }
            response = await api.post(url, body)
            beWebShieldAddress = response.Result

            chai.expect(response).have.property('Result')

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
