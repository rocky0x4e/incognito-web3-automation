//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const addContext = require('mochawesome/addContext');
let chai = require('chai');
let server = require('../../../server');
let config = require('../../../constant/config.js');
const cliCommonFunction = require('../../../constant/cliCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const csCommonFunction = require('../../../constant/csCommonFunction');
const beCommonFunction = require('../../../constant/beCommonFunction');
const common = require('../../../constant/commonFunction');
const api = require('../../../constant/api');
const _ = require('lodash');


let beTokenAuthen
let paymentAddress = '12sfV7Vo27Rz3aT4c2kyiTpvziwXjviQMMrp5gsFfupAvoDveHhQLunAWvqTao46DSEYpnbMpGYxuc4a9KGU7BppPM9uZtfVCqPAQ18WtPEijsLmYxVL1MWWDggDZHfRmhtxmVijadCjXyr7iC9X'

//Our parent block
describe('[Class]Unshield', async() => {

    //Before
    before(async() => {
        console.log("[Before]InitData");
        beTokenAuthen = await beCommonFunction.newToken()
        console.log({ beTokenAuthen });
    });


    describe('[TC001]EstimateUnshieldFee_ZIL', async() => {
        let url, body, response
        let tokenID, currenctType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appLevel1, webFeeAddress, webLevel1,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'ZIL'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 1 : gen ZIL shield address from BE
        it('EstimateFeeOnApp', async() => {
            url = global.urlBackend + '/ota/generate'
            body = `{
                "CurrencyType": ${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}",
                "SignPublicKeyEncode": "355600a447f0438b40905c8f91984948ecac53e3551f08a930903f2d1f36ef64"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });

            beShieldAddress = response.Result.Address

            appFeeAddress = response.Result.FeeAddress
            appLevel1 = response.Result.TokenFees.Level1

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });

            webShieldAddress = response.Result.Address
            webFeeAddress = response.Result.FeeAddress
            webLevel1 = response.Result.TokenFees.Level1

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).have.property('Decentralized')
            chai.expect(response.Result).have.property('EstimateFee')
            chai.expect(response.Result).have.property('ExpiredAt')
            chai.expect(response.Result).have.property('FeeAddress')
            chai.expect(response.Result).have.property('ID')
            chai.expect(response.Result).have.property('TokenFee')
            chai.expect(response.Result).have.property('TokenFees')
            chai.expect(response.Result.TokenFees).have.property('Level1')
        });

        //step 3 : compare 2 body
        it('Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
            chai.assert.equal(appLevel1, webLevel1)
                // chai.assert.equal(beShieldAddress, webShieldAddress)
        });
    });

    describe('[TC002]EstimateUnshieldFee_ZEC', async() => {
        let url, body, response
        let tokenID, currenctType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appLevel1, webFeeAddress, webLevel1,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'ZEC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 1 : gen ZIL shield address from BE
        it('EstimateFeeOnApp', async() => {
            url = global.urlBackend + '/ota/generate'
            body = `{
                "CurrencyType": ${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}",
                "SignPublicKeyEncode": "355600a447f0438b40905c8f91984948ecac53e3551f08a930903f2d1f36ef64"
            }`
                // console.log({ url });
                // console.log(body);
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))

            // console.log({ response });

            beShieldAddress = response.Result.Address
            appFeeAddress = response.Result.FeeAddress
            appLevel1 = response.Result.TokenFees.Level1

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
                // console.log({ url });
                // console.log(body);
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))

            // console.log({ response });

            webShieldAddress = response.Result.Address
            webFeeAddress = response.Result.FeeAddress
            webLevel1 = response.Result.TokenFees.Level1

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).have.property('Decentralized')
            chai.expect(response.Result).have.property('EstimateFee')
            chai.expect(response.Result).have.property('ExpiredAt')
            chai.expect(response.Result).have.property('FeeAddress')
            chai.expect(response.Result).have.property('ID')
            chai.expect(response.Result).have.property('TokenFee')
            chai.expect(response.Result).have.property('TokenFees')
            chai.expect(response.Result.TokenFees).have.property('Level1')
        });

        //step 3 : compare 2 body
        it('Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
            chai.assert.equal(appLevel1, webLevel1)
                // chai.assert.equal(beShieldAddress, webShieldAddress)
        });
    });

    describe('[TC003]EstimateUnshieldFee_DASH', async() => {
        let url, body, response
        let tokenID, currenctType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appLevel1, webFeeAddress, webLevel1,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'DASH'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 1 : gen ZIL shield address from BE
        it('EstimateFeeOnApp', async() => {
            url = global.urlBackend + '/ota/generate'
            body = `{
                "CurrencyType": ${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}",
                "SignPublicKeyEncode": "355600a447f0438b40905c8f91984948ecac53e3551f08a930903f2d1f36ef64"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });

            beShieldAddress = response.Result.Address

            appFeeAddress = response.Result.FeeAddress
            appLevel1 = response.Result.TokenFees.Level1

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });

            webShieldAddress = response.Result.Address
            webFeeAddress = response.Result.FeeAddress
            webLevel1 = response.Result.TokenFees.Level1

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).have.property('Decentralized')
            chai.expect(response.Result).have.property('EstimateFee')
            chai.expect(response.Result).have.property('ExpiredAt')
            chai.expect(response.Result).have.property('FeeAddress')
            chai.expect(response.Result).have.property('ID')
            chai.expect(response.Result).have.property('TokenFee')
            chai.expect(response.Result).have.property('TokenFees')
            chai.expect(response.Result.TokenFees).have.property('Level1')
        });

        //step 3 : compare 2 body
        it('Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
            chai.assert.equal(appLevel1, webLevel1)
                // chai.assert.equal(beShieldAddress, webShieldAddress)
        });
    });

    describe('[TC004]EstimateUnshieldFee_NEO', async() => {
        let url, body, response
        let tokenID, currenctType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appTokenFee, webFeeAddress, webTokenFee,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'NEO'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 1 : gen ZIL shield address from BE
        it('EstimateFeeOnApp', async() => {
            url = global.urlBackend + '/ota/generate'
            body = `{
                "CurrencyType": ${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}",
                "SignPublicKeyEncode": "355600a447f0438b40905c8f91984948ecac53e3551f08a930903f2d1f36ef64"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            beShieldAddress = response.Result.Address
            appFeeAddress = response.Result.FeeAddress
            appTokenFee = response.Result.TokenFee

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });

            webShieldAddress = response.Result.Address
            webFeeAddress = response.Result.FeeAddress
            webTokenFee = response.Result.TokenFee

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).have.property('Decentralized')
            chai.expect(response.Result).have.property('EstimateFee')
            chai.expect(response.Result).have.property('ExpiredAt')
            chai.expect(response.Result).have.property('FeeAddress')
            chai.expect(response.Result).have.property('ID')
            chai.expect(response.Result).have.property('TokenFee')
        });

        //step 3 : compare 2 body
        it('Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
            chai.assert.equal(appTokenFee, webTokenFee)
                // chai.assert.equal(beShieldAddress, webShieldAddress)
        });
    });

    describe('[TC005]EstimateUnshieldFee_LTC', async() => {
        let url, body, response
        let tokenID, currenctType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appLevel1, webFeeAddress, webLevel1,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'LTC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 1 : gen ZIL shield address from BE
        it('EstimateFeeOnApp', async() => {
            url = global.urlBackend + '/ota/generate'
            body = `{
                "CurrencyType": ${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}",
                "SignPublicKeyEncode": "355600a447f0438b40905c8f91984948ecac53e3551f08a930903f2d1f36ef64"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });

            beShieldAddress = response.Result.Address

            appFeeAddress = response.Result.FeeAddress
            appLevel1 = response.Result.TokenFees.Level1

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });

            webShieldAddress = response.Result.Address
            webFeeAddress = response.Result.FeeAddress
            webLevel1 = response.Result.TokenFees.Level1

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).have.property('Decentralized')
            chai.expect(response.Result).have.property('EstimateFee')
            chai.expect(response.Result).have.property('ExpiredAt')
            chai.expect(response.Result).have.property('FeeAddress')
            chai.expect(response.Result).have.property('ID')
            chai.expect(response.Result).have.property('TokenFee')
            chai.expect(response.Result).have.property('TokenFees')
            chai.expect(response.Result.TokenFees).have.property('Level1')
        });

        //step 3 : compare 2 body
        it('Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
            chai.assert.equal(appLevel1, webLevel1)
                // chai.assert.equal(beShieldAddress, webShieldAddress)
        });
    });

    describe('[TC006]EstimateUnshieldFee_DOT', async() => {
        let url, body, response
        let tokenID, currenctType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appTokenFee, webFeeAddress, webTokenFee,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'DOT'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 1 : gen ZIL shield address from BE
        it('EstimateFeeOnApp', async() => {
            url = global.urlBackend + '/ota/generate'
            body = `{
                "CurrencyType": ${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}",
                "SignPublicKeyEncode": "355600a447f0438b40905c8f91984948ecac53e3551f08a930903f2d1f36ef64"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });

            beShieldAddress = response.Result.Address

            appFeeAddress = response.Result.FeeAddress
            appTokenFee = response.Result.TokenFee

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).to.have.property('EstimateFee')
            chai.expect(response.Result).to.have.property('ExpiredAt')
            chai.expect(response.Result).to.have.property('Decentralized')
            chai.expect(response.Result).to.have.property('TokenFee')

        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });

            webShieldAddress = response.Result.Address
            webFeeAddress = response.Result.FeeAddress
            webTokenFee = response.Result.TokenFee

            chai.expect(response.Result).have.property('Address')
            chai.expect(response.Result).have.property('Decentralized')
            chai.expect(response.Result).have.property('EstimateFee')
            chai.expect(response.Result).have.property('ExpiredAt')
            chai.expect(response.Result).have.property('FeeAddress')
            chai.expect(response.Result).have.property('ID')
            chai.expect(response.Result).have.property('TokenFee')
        });

        //step 3 : compare 2 body
        it('Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
            chai.assert.equal(appTokenFee, webTokenFee)
                // chai.assert.equal(beShieldAddress, webShieldAddress)
        });
    });

    describe('[TC007]EstimateUnshieldFee_BTC', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            appUnshieldFee, webUnshieldFee

        before(async() => {
            let tokenName = 'BTC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/estimateunshieldfee'
            body = {
                "Network": "btc"
            }
            response = await api.post(url, body)
                // console.log({ url });
                // console.log({ body });
                // console.log({ response });

            webUnshieldFee = response.Result

            chai.expect(response).be.a('object');
            chai.expect(response).have.property('Result')
            chai.expect(response).have.property('Error')
        });

        //step 1 : gen ZIL shield address from BE
        it('EstimateFeeOnApp', async() => {
            url = 'http://51.161.119.66:8020/getestimatedunshieldingfee'

            response = await api.get(url)
                // console.log({ url });
                // console.log(body);
                // console.log({ response });

            appUnshieldFee = response.Result

            chai.expect(response).be.a('object');
            chai.expect(response).have.property('Result')
            chai.expect(response).have.property('Error')

        });

        //step 3 : compare 2 body
        it('Compare', async() => {
            chai.assert.equal(appUnshieldFee, webUnshieldFee)
        });
    });

    describe('[TC008]EstimateUnshieldFeeWithInvalidOutchainAddress_ZIL', async() => {
        let url, body, response
        let tokenID, currenctType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appLevel1, webFeeAddress, webLevel1,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'ZIL'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-2014')
            chai.assert.equal(response.Error.Message, 'Payment address invalid!')
        });


    });

    describe('[TC009]EstimateUnshieldFeeWithInvalidOutchainAddress_ZEC', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'ZEC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-2014')
            chai.assert.equal(response.Error.Message, 'Payment address invalid!')
        });


    });

    describe('[TC010]EstimateUnshieldFeeWithInvalidOutchainAddress_DASH', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress
        requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'DASH'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-2014')
            chai.assert.equal(response.Error.Message, 'Payment address invalid!')
        });


    });

    describe('[TC011]EstimateUnshieldFeeWithInvalidOutchainAddress_NEO', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'NEO'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-2014')
            chai.assert.equal(response.Error.Message, 'Payment address invalid!')
        });


    });

    describe('[TC012]EstimateUnshieldFeeWithInvalidOutchainAddress_LTC', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'LTC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-2014')
            chai.assert.equal(response.Error.Message, 'Payment address invalid!')
        });


    });

    describe('[TC013]EstimateUnshieldFeeWithInvalidOutchainAddress_DOT', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'DOT'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-2014')
            chai.assert.equal(response.Error.Message, 'Payment address invalid!')
        });


    });

    describe('[TC014]EstimateUnshieldFeeWithInvalidInchainAddress_ZIL', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'ZIL'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${1+paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-9001')
            chai.assert.equal(response.Error.Message, 'internal server error')
        });
    });

    describe('[TC015]EstimateUnshieldFeeWithInvalidInchainAddress_ZEC', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'ZEC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${1+paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-9001')
            chai.assert.equal(response.Error.Message, 'internal server error')
        });
    });

    describe('[TC016]EstimateUnshieldFeeWithInvalidInchainAddress_DASH', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'DASH'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${1+paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-9001')
            chai.assert.equal(response.Error.Message, 'internal server error')
        });
    });

    describe('[TC017]EstimateUnshieldFeeWithInvalidInchainAddress_NEO', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'NEO'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${1+paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-9001')
            chai.assert.equal(response.Error.Message, 'internal server error')
        });
    });

    describe('[TC018]EstimateUnshieldFeeWithInvalidInchainAddress_LTC', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'LTC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${1+paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-9001')
            chai.assert.equal(response.Error.Message, 'internal server error')
        });
    });

    describe('[TC019]EstimateUnshieldFeeWithInvalidInchainAddress_DOT', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 1,
            incognitoAmount = 10 ** 9

        before(async() => {
            let tokenName = 'DOT'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${1+paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-9001')
            chai.assert.equal(response.Error.Message, 'internal server error')
        });
    });

    describe('[TC020]EstimateUnshieldFeeWithInvalidAmount_ZIL', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        before(async() => {
            let tokenName = 'ZIL'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-9001')
            chai.assert.equal(response.Error.Message, 'internal server error')
        });
    });

    describe('[TC021]EstimateUnshieldFeeWithInvalidAmount_ZEC', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        before(async() => {
            let tokenName = 'ZEC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-9001')
            chai.assert.equal(response.Error.Message, 'internal server error')
        });
    });

    describe('[TC022]EstimateUnshieldFeeWithInvalidAmount_DASH', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        before(async() => {
            let tokenName = 'DASH'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-9001')
            chai.assert.equal(response.Error.Message, 'internal server error')
        });
    });

    describe('[TC023]EstimateUnshieldFeeWithInvalidAmount_NEO', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        before(async() => {
            let tokenName = 'NEO'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-9001')
            chai.assert.equal(response.Error.Message, 'internal server error')
        });
    });

    describe('[TC024]EstimateUnshieldFeeWithInvalidAmount_LTC', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        before(async() => {
            let tokenName = 'LTC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-9001')
            chai.assert.equal(response.Error.Message, 'internal server error')
        });
    });

    describe('[TC025]EstimateUnshieldFeeWithInvalidAmount_DOT', async() => {
        let url, body, response
        let tokenID, currenctType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        before(async() => {
            let tokenName = 'DOT'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currenctType = await csCommonFunction.getTokenCurrencyType(tokenID)
        });

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    url,
                    beTokenAuthen,
                    body: typeof body == "object" ? body : JSON.parse(body),
                    response,
                }
            });
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/genunshieldaddress'
            body = `{
                "Network": "centralized",
                "CurrencyType":${currenctType},
                "AddressType": 2,
                "RequestedAmount": "${requestedAmount}",
                "IncognitoAmount": "${incognitoAmount}",
                "PaymentAddress": "${outchainAddress}",
                "WalletAddress": "${paymentAddress}",
                "PrivacyTokenAddress": "${tokenID}"
            }`
            response = await api.postWithToken(url, beTokenAuthen, JSON.parse(body))
                // console.log({ url });
                // console.log(body);
                // console.log({ response });


            chai.expect(response).have.property('Error')
            chai.expect(response.Error).have.property('Code')
            chai.expect(response.Error).have.property('Message')
            chai.assert.equal(response.Error.Code, '-9001')
            chai.assert.equal(response.Error.Message, 'internal server error')
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
    } else {
        //TODO for mainnet
    }
    return null
}

const getOutchainAddress = async(tokenName) => {
    if (global.ENV == 'testnet2') {
        switch (tokenName) {
            case 'ZIL':
                return 'zil13cl8p2vtpvud5kt7phhvpqwupzy96kupyw3npu'
            case 'ZEC':
                return 'ztestsapling14l5tkzxvvg8u89hj96ptvj8ct6el80y4e72prrz7hex8tqsefax9qfwrlv694mq2cndksgzqeh2'
            case 'DASH':
                return 'C7YBQCmnZuNVTmuoSHCsUXbBJrCFDYdkFF'
            case 'NEO':
                return 'AUgjbekZfhiqBSpDn5panNrgScW5fdHKUk'
            case 'LTC':
                return 'C5szNNoGYg65L5rVrpQwra9FzEn3QEpdn1'
            case 'DOT':
                return '142pZXgVTYHcVnhY1PFzC8HfbSrQjmBAQPMSV76jTv7m8LoC'
            case 'BTC':
                return 'tb1qljk9x6m9qj2f5luwjh42ez83wl8jtscwsh58v7t064azt9p3y6lq4weqwc'
            default:
                break;
        }
    } else {
        //TODO for mainnet
    }
    return null
}