let chai = require('chai');
const { WebServiceApi } = require('../../lib/Incognito/WebServiceApi');
const { BackendApi } = require('../../lib/Incognito/BackendApi');
const { CoinServiceApi } = require('../../lib/Incognito/CoinServiceApi');
const { PortalServiceApi } = require('../../lib/Incognito/PortalServiceApi');
const GenAction = require('../../lib/Utils/GenAction')

let webServiceApi = new WebServiceApi()
let portalServiceApi = new PortalServiceApi()
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
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

            let response = await webServiceApi.genUnshieldAddress({
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
            appFeeAddress, appTokenFee, webFeeAddress, webTokenFee, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'ZEC'
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
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
            appTokenFee = response.data.Result.TokenFees
        });

        it('STEP_EstimateFeeOnWeb', async() => {

            let response = await webServiceApi.genUnshieldAddress({
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
            webTokenFee = response.data.Result.TokenFees
        });

        it('STEP_Compare', async() => {
            chai.assert.equal(appFeeAddress, webFeeAddress)
            chai.assert.equal(appTokenFee, webTokenFee)
                // chai.assert.equal(beShieldAddress, webShieldAddress)
        });
    });

    describe('[TC003]EstimateUnshieldFee_DASH', async() => {
        let tokenID, currencyType, beShieldAddress, webShieldAddress, outchainAddress,
            appFeeAddress, appLevel1, webFeeAddress, webLevel1, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'DASH'
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
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

            let response = await webServiceApi.genUnshieldAddress({
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
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

            let response = await webServiceApi.genUnshieldAddress({
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
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

            let response = await webServiceApi.genUnshieldAddress({
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

    describe('[TC007]EstimateUnshieldFee_BTC', async() => {
        let tokenID, outchainAddress
        let appUnshieldFee, webUnshieldFee

        before(async() => {
            let tokenName = 'BTC'
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.estimateUnshieldFeeBTC()

            webUnshieldFee = response.data.Result.Fee

            chai.expect(response.data).be.a('object');
            chai.expect(response.data).have.property('Result')
            chai.expect(response.data.Result).have.property('Fee')
            chai.expect(response.data.Result).have.property('MinUnshield')
        });

        //step 1 : gen ZIL shield address from BE
        it('EstimateFeeOnApp', async() => {
            let response = await portalServiceApi.getestimatedunshieldingfee()

            appUnshieldFee = response.data.Result

            chai.expect(response.data).be.a('object');
            chai.expect(response.data).have.property('Result')
            chai.expect(response.data).have.property('Error')
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response
            try {
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
            } catch (error) {
                chai.expect(response.data).have.property('Error')
                chai.expect(response.data.Error).have.property('Code')
                chai.expect(response.data.Error).have.property('Message')

                chai.assert.equal(response.data.Error.Code, '-2014')
                chai.assert.equal(response.data.Error.Message, 'Payment address invalid!')
            }
        });
    });

    describe('[TC009]EstimateUnshieldFeeWithInvalidOutchainAddress_ZEC', async() => {
        let tokenID, currencyType, outchainAddress, requestedAmount, incognitoAmount

        it('STEP_InitData', async() => {
            let tokenName = 'ZEC'
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)

            let tokenDeciamlPow = await coinServiceApi.getTokenDecimalPow(tokenID)
            incognitoAmount = await GenAction.randomNumber(1e8, 1e9)
            requestedAmount = incognitoAmount / tokenDeciamlPow
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });



        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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

    describe('[TC021]EstimateUnshieldFeeWithInvalidAmount_ZEC', async() => {
        let tokenID, currencyType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        it('STEP_InitData', async() => {
            let tokenName = 'ZEC'
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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

    describe('[TC022]EstimateUnshieldFeeWithInvalidAmount_DASH', async() => {
        let tokenID, currencyType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        it('STEP_InitData', async() => {
            let tokenName = 'DASH'
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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

    describe('[TC023]EstimateUnshieldFeeWithInvalidAmount_NEO', async() => {
        let tokenID, currencyType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        it('STEP_InitData', async() => {
            let tokenName = 'NEO'
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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

    describe('[TC024]EstimateUnshieldFeeWithInvalidAmount_LTC', async() => {
        let tokenID, currencyType, outchainAddress,
            requestedAmount = 'abc',
            incognitoAmount = 'abc'

        it('STEP_InitData', async() => {
            let tokenName = 'LTC'
            tokenID = await coinServiceApi.getTokenIdFromSymbol(tokenName)
            outchainAddress = "1" + await getOutchainAddress(tokenName)
            currencyType = await coinServiceApi.getTokenCurrencyType(tokenID)
        });

        //step 2 : gen ZIL shield address from lam service
        it('EstimateFeeOnWeb', async() => {
            let response = await webServiceApi.genUnshieldAddress({
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

});

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
        switch (tokenName) {
            case 'ZIL':
                return 'zil1g66m72q4xvwytpn5znqf0glxpv2z5l7qeqq7fy'
            case 'ZEC':
                return 'zs15anl73yd0f45sudsgfns46a2srzdcsmun929ea09tnvpktqsmm58msru79wwwwps08q2gm34kn6'
            case 'DASH':
                return 'XsyTY4rqFAU8zKxY8zgQ4j3WrRb47xs6QC'
            case 'NEO':
                return 'ARbpPWQLaLVyuzUesw3JpeLL8xPq1DLD1L'
            case 'LTC':
                return 'LSeCsLeqhCHMq3Mj1m8E4sJ2n4DhU917tp'
            case 'BTC':
                return 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
            default:
                break;
        }
    }
    return null
}