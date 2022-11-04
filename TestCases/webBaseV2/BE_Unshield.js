let chai = require('chai');
const { WebServiceApi } = require('../../lib/Incognito/WebServiceApi');
const { BackendApi } = require('../../lib/Incognito/BackendApi');
const { CoinServiceApi } = require('../../lib/Incognito/CoinServiceApi');
const { IncRpc } = require('../../lib/Incognito/RPC/Rpc');
const GenAction = require('../../lib/Utils/GenAction')

let webServiceApi = new WebServiceApi()
let coinServiceApi = new CoinServiceApi()
let backendApi = new BackendApi()
let paymentAddress = '12sveuNGdToMM98xz5Q8EKbkAtNoi6qsFdA4yei2wBe73X3Fwt5qDY6PHGvwxLVqDT8MMmGy7yuU4GzeJ6mCc7MJNYepC54jaWKxLW2kyWPhzQUuFm4FnK4QDr9fuj4cpvXqkm5PB9XXwXUyUniy'

//Our parent block
describe('[Class]Unshield', async() => {

    describe('[TC001]EstimateUnshieldFee_ZIL', async() => {
        let tokenID, currencyType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appLevel1, webFeeAddress, webLevel1, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'ZIL'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow

        });

        it('STEP_EstimateFeeOnApp', async() => {
            let response = await backendApi.otaGenerateUnShield({
                currencyType,
                requestedAmount: requestedAmount + "", //"0,025"
                incognitoAmount: incognitoAmount + "", //25000000
                paymentAddress: outchainAddress, //"zil1u2umu2kjpmlp48mu5akq2y82x98qcaz4my2yr5"
                walletAddress: paymentAddress, //"12sveuNGdToMM98xz5Q8EKbkAtNoi6qsFdA4yei2wBe73X3Fwt5qDY6PHGvwxLVqDT8MMmGy7yuU4GzeJ6mCc7MJNYepC54jaWKxLW2kyWPhzQUuFm4FnK4QDr9fuj4cpvXqkm5PB9XXwXUyUniy"
                privacyTokenAddress: tokenID,
            })

            beShieldAddress = response.data.Result.Address
            appFeeAddress = response.data.Result.FeeAddress
            appLevel1 = response.data.Result.TokenFees.Level1
        });

        it('STEP_EstimateFeeOnWeb', async() => {

            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            webShieldAddress = response.data.Result.Address
            webFeeAddress = response.data.Result.FeeAddress
            webLevel1 = response.data.Result.TokenFees.Level1
        });

        it('STEP_Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
            chai.assert.equal(appLevel1, webLevel1)
                // chai.assert.equal(beShieldAddress, webShieldAddress)
        });
    });

    describe('[TC002]EstimateUnshieldFee_ZEC', async() => {
        let tokenID, currencyType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appLevel1, webFeeAddress, webLevel1, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'ZEC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow

        });

        it('STEP_EstimateFeeOnApp', async() => {
            let response = await backendApi.otaGenerateUnShield({
                currencyType,
                requestedAmount: requestedAmount + "", //"0,025"
                incognitoAmount: incognitoAmount + "", //25000000
                paymentAddress: outchainAddress, //"zil1u2umu2kjpmlp48mu5akq2y82x98qcaz4my2yr5"
                walletAddress: paymentAddress, //"12sveuNGdToMM98xz5Q8EKbkAtNoi6qsFdA4yei2wBe73X3Fwt5qDY6PHGvwxLVqDT8MMmGy7yuU4GzeJ6mCc7MJNYepC54jaWKxLW2kyWPhzQUuFm4FnK4QDr9fuj4cpvXqkm5PB9XXwXUyUniy"
                privacyTokenAddress: tokenID,
            })

            beShieldAddress = response.data.Result.Address
            appFeeAddress = response.data.Result.FeeAddress
            appLevel1 = response.data.Result.TokenFees.Level1
        });

        it('STEP_EstimateFeeOnWeb', async() => {

            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            webShieldAddress = response.data.Result.Address
            webFeeAddress = response.data.Result.FeeAddress
            webLevel1 = response.data.Result.TokenFees.Level1
        });

        it('STEP_Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
            chai.assert.equal(appLevel1, webLevel1)
                // chai.assert.equal(beShieldAddress, webShieldAddress)
        });
    });

    describe('[TC003]EstimateUnshieldFee_DASH', async() => {
        let tokenID, currencyType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appLevel1, webFeeAddress, webLevel1, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'DASH'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow

        });

        it('STEP_EstimateFeeOnApp', async() => {
            let response = await backendApi.otaGenerateUnShield({
                currencyType,
                requestedAmount: requestedAmount + "", //"0,025"
                incognitoAmount: incognitoAmount + "", //25000000
                paymentAddress: outchainAddress, //"zil1u2umu2kjpmlp48mu5akq2y82x98qcaz4my2yr5"
                walletAddress: paymentAddress, //"12sveuNGdToMM98xz5Q8EKbkAtNoi6qsFdA4yei2wBe73X3Fwt5qDY6PHGvwxLVqDT8MMmGy7yuU4GzeJ6mCc7MJNYepC54jaWKxLW2kyWPhzQUuFm4FnK4QDr9fuj4cpvXqkm5PB9XXwXUyUniy"
                privacyTokenAddress: tokenID,
            })

            beShieldAddress = response.data.Result.Address
            appFeeAddress = response.data.Result.FeeAddress
            appLevel1 = response.data.Result.TokenFees.Level1
        });

        it('STEP_EstimateFeeOnWeb', async() => {

            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            webShieldAddress = response.data.Result.Address
            webFeeAddress = response.data.Result.FeeAddress
            webLevel1 = response.data.Result.TokenFees.Level1
        });

        it('STEP_Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
            chai.assert.equal(appLevel1, webLevel1)
                // chai.assert.equal(beShieldAddress, webShieldAddress)
        });
    });

    describe('[TC004]EstimateUnshieldFee_NEO', async() => {
        let tokenID, currencyType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appLevel1, webFeeAddress, webLevel1, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'NEO'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow

        });

        it('STEP_EstimateFeeOnApp', async() => {
            let response = await backendApi.otaGenerateUnShield({
                currencyType,
                requestedAmount: requestedAmount + "", //"0,025"
                incognitoAmount: incognitoAmount + "", //25000000
                paymentAddress: outchainAddress, //"zil1u2umu2kjpmlp48mu5akq2y82x98qcaz4my2yr5"
                walletAddress: paymentAddress, //"12sveuNGdToMM98xz5Q8EKbkAtNoi6qsFdA4yei2wBe73X3Fwt5qDY6PHGvwxLVqDT8MMmGy7yuU4GzeJ6mCc7MJNYepC54jaWKxLW2kyWPhzQUuFm4FnK4QDr9fuj4cpvXqkm5PB9XXwXUyUniy"
                privacyTokenAddress: tokenID,
            })

            appFeeAddress = response.data.Result.FeeAddress
        });

        it('STEP_EstimateFeeOnWeb', async() => {

            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            webShieldAddress = response.data.Result.Address
            webFeeAddress = response.data.Result.FeeAddress
        });

        it('STEP_Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
        });
    });

    describe('[TC005]EstimateUnshieldFee_LTC', async() => {
        let tokenID, currencyType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appLevel1, webFeeAddress, webLevel1, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'LTC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow

        });

        it('STEP_EstimateFeeOnApp', async() => {
            let response = await backendApi.otaGenerateUnShield({
                currencyType,
                requestedAmount: requestedAmount + "", //"0,025"
                incognitoAmount: incognitoAmount + "", //25000000
                paymentAddress: outchainAddress, //"zil1u2umu2kjpmlp48mu5akq2y82x98qcaz4my2yr5"
                walletAddress: paymentAddress, //"12sveuNGdToMM98xz5Q8EKbkAtNoi6qsFdA4yei2wBe73X3Fwt5qDY6PHGvwxLVqDT8MMmGy7yuU4GzeJ6mCc7MJNYepC54jaWKxLW2kyWPhzQUuFm4FnK4QDr9fuj4cpvXqkm5PB9XXwXUyUniy"
                privacyTokenAddress: tokenID,
            })

            beShieldAddress = response.data.Result.Address
            appFeeAddress = response.data.Result.FeeAddress
            appLevel1 = response.data.Result.TokenFees.Level1
        });

        it('STEP_EstimateFeeOnWeb', async() => {

            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            webShieldAddress = response.data.Result.Address
            webFeeAddress = response.data.Result.FeeAddress
            webLevel1 = response.data.Result.TokenFees.Level1
        });

        it('STEP_Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
            chai.assert.equal(appLevel1, webLevel1)
                // chai.assert.equal(beShieldAddress, webShieldAddress)
        });
    });

    describe('[TC006]EstimateUnshieldFee_DOT', async() => {
        let tokenID, currencyType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appLevel1, webFeeAddress, webLevel1, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'DOT'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow

        });

        it('STEP_EstimateFeeOnApp', async() => {
            let response = await backendApi.otaGenerateUnShield({
                currencyType,
                requestedAmount: requestedAmount + "", //"0,025"
                incognitoAmount: incognitoAmount + "", //25000000
                paymentAddress: outchainAddress, //"zil1u2umu2kjpmlp48mu5akq2y82x98qcaz4my2yr5"
                walletAddress: paymentAddress, //"12sveuNGdToMM98xz5Q8EKbkAtNoi6qsFdA4yei2wBe73X3Fwt5qDY6PHGvwxLVqDT8MMmGy7yuU4GzeJ6mCc7MJNYepC54jaWKxLW2kyWPhzQUuFm4FnK4QDr9fuj4cpvXqkm5PB9XXwXUyUniy"
                privacyTokenAddress: tokenID,
            })

            beShieldAddress = response.data.Result.Address
            appFeeAddress = response.data.Result.FeeAddress
        });

        it('STEP_EstimateFeeOnWeb', async() => {

            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            webShieldAddress = response.data.Result.Address
            webFeeAddress = response.data.Result.FeeAddress
        });

        it('STEP_Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
        });
    });

    describe('[TC007]EstimateUnshieldFee_BTC', async() => {
        let url, body, response
        let tokenID, currencyType, outchainAddress,
            appUnshieldFee, webUnshieldFee

        before(async() => {
            let tokenName = 'BTC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });



        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            url = 'https://api-webapp-staging.incognito.org/estimateunshieldfee'
            body = {
                "Network": "btc"
            }
            response = await api.post(url, body)

            webUnshieldFee = response.Result

            chai.expect(response).be.a('object');
            chai.expect(response).have.property('Result')
            chai.expect(response).have.property('Error')
        });

        //step 1 : gen ZIL shield address from BE
        it('EstimateFeeOnApp', async() => {
            url = 'http://51.161.119.66:8020/getestimatedunshieldingfee'

            response = await api.get(url)

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
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'ZIL'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')

            chai.assert.equal(response.data.Error.Code, '-2014')
            chai.assert.equal(response.data.Error.Message, 'Payment address invalid!')
        });
    });

    describe('[TC009]EstimateUnshieldFeeWithInvalidOutchainAddress_ZEC', async() => {
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'ZEC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')

            chai.assert.equal(response.data.Error.Code, '-2014')
            chai.assert.equal(response.data.Error.Message, 'Payment address invalid!')
        });
    });

    describe('[TC010]EstimateUnshieldFeeWithInvalidOutchainAddress_DASH', async() => {
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'DASH'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')

            chai.assert.equal(response.data.Error.Code, '-2014')
            chai.assert.equal(response.data.Error.Message, 'Payment address invalid!')
        });
    });

    describe('[TC011]EstimateUnshieldFeeWithInvalidOutchainAddress_NEO', async() => {
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'NEO'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')

            chai.assert.equal(response.data.Error.Code, '-2014')
            chai.assert.equal(response.data.Error.Message, 'Payment address invalid!')
        });
    });

    describe('[TC012]EstimateUnshieldFeeWithInvalidOutchainAddress_LTC', async() => {
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'LTC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')

            chai.assert.equal(response.data.Error.Code, '-2014')
            chai.assert.equal(response.data.Error.Message, 'Payment address invalid!')
        });
    });

    describe('[TC013]EstimateUnshieldFeeWithInvalidOutchainAddress_DOT', async() => {
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'DOT'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')

            chai.assert.equal(response.data.Error.Code, '-2014')
            chai.assert.equal(response.data.Error.Message, 'Payment address invalid!')
        });
    });

    describe('[TC014]EstimateUnshieldFeeWithInvalidInchainAddress_ZIL', async() => {
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'ZIL'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: 1 + paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')
            chai.assert.equal(response.data.Error.Code, '-9001')
            chai.assert.equal(response.data.Error.Message, 'internal server error')
        });
    });

    describe('[TC015]EstimateUnshieldFeeWithInvalidInchainAddress_ZEC', async() => {
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'ZEC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: 1 + paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')
            chai.assert.equal(response.data.Error.Code, '-9001')
            chai.assert.equal(response.data.Error.Message, 'internal server error')
        });
    });

    describe('[TC016]EstimateUnshieldFeeWithInvalidInchainAddress_DASH', async() => {
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'DASH'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: 1 + paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')
            chai.assert.equal(response.data.Error.Code, '-9001')
            chai.assert.equal(response.data.Error.Message, 'internal server error')
        });
    });

    describe('[TC017]EstimateUnshieldFeeWithInvalidInchainAddress_NEO', async() => {
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'NEO'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: 1 + paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')
            chai.assert.equal(response.data.Error.Code, '-9001')
            chai.assert.equal(response.data.Error.Message, 'internal server error')
        });
    });

    describe('[TC018]EstimateUnshieldFeeWithInvalidInchainAddress_LTC', async() => {
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'LTC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: 1 + paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')
            chai.assert.equal(response.data.Error.Code, '-9001')
            chai.assert.equal(response.data.Error.Message, 'internal server error')
        });
    });

    describe('[TC019]EstimateUnshieldFeeWithInvalidInchainAddress_DOT', async() => {
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'DOT'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: 1 + paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')
            chai.assert.equal(response.data.Error.Code, '-9001')
            chai.assert.equal(response.data.Error.Message, 'internal server error')
        });
    });

    describe('[TC020]EstimateUnshieldFeeWithInvalidAmount_ZIL', async() => {
        let tokenID, currencyType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        it('STEP_InitData', async() => {
            let tokenName = 'ZIL'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });



        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')
            chai.assert.equal(response.data.Error.Code, '-9001')
            chai.assert.equal(response.data.Error.Message, 'internal server error')
        });
    });

    describe('[TC021]EstimateUnshieldFeeWithInvalidAmount_ZEC', async() => {
        let tokenID, currencyType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        it('STEP_InitData', async() => {
            let tokenName = 'ZEC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });



        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')
            chai.assert.equal(response.data.Error.Code, '-9001')
            chai.assert.equal(response.data.Error.Message, 'internal server error')
        });
    });

    describe('[TC022]EstimateUnshieldFeeWithInvalidAmount_DASH', async() => {
        let tokenID, currencyType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        it('STEP_InitData', async() => {
            let tokenName = 'DASH'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });



        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')
            chai.assert.equal(response.data.Error.Code, '-9001')
            chai.assert.equal(response.data.Error.Message, 'internal server error')
        });
    });

    describe('[TC023]EstimateUnshieldFeeWithInvalidAmount_NEO', async() => {
        let tokenID, currencyType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        it('STEP_InitData', async() => {
            let tokenName = 'NEO'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });



        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')
            chai.assert.equal(response.data.Error.Code, '-9001')
            chai.assert.equal(response.data.Error.Message, 'internal server error')
        });
    });

    describe('[TC024]EstimateUnshieldFeeWithInvalidAmount_LTC', async() => {
        let tokenID, currencyType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        it('STEP_InitData', async() => {
            let tokenName = 'LTC'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });



        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')
            chai.assert.equal(response.data.Error.Code, '-9001')
            chai.assert.equal(response.data.Error.Message, 'internal server error')
        });
    });

    describe('[TC025]EstimateUnshieldFeeWithInvalidAmount_DOT', async() => {
        let tokenID, currencyType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        it('STEP_InitData', async() => {
            let tokenName = 'DOT'
            tokenID = await getTokenID(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });



        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            response = await webServiceApi.genUnshieldAddress({
                network: "centralized",
                requestedAmount: requestedAmount + "",
                addressType: 2,
                incognitoAmount: incognitoAmount + "",
                paymentAddress: outchainAddress,
                privacyTokenAddress: tokenID,
                walletAddress: paymentAddress,
                unifiedTokenID: "",
                currencyType
            })

            chai.expect(response.data).have.property('Error')
            chai.expect(response.data.Error).have.property('Code')
            chai.expect(response.data.Error).have.property('Message')
            chai.assert.equal(response.data.Error.Code, '-9001')
            chai.assert.equal(response.data.Error.Message, 'internal server error')
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