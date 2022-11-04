let chai = require('chai');
const { WebServiceApi } = require('../../lib/Incognito/WebServiceApi');
const { CoinServiceApi } = require('../../lib/Incognito/CoinServiceApi');
const webServiceApi_schemas = require("../../schemas/webServiceApi_schemas");
const validateSchemaCommand = require("../../schemas/validateSchemaCommand");
const _ = require('lodash');

let webServiceApi = new WebServiceApi()
let coinServiceApi = new CoinServiceApi()

describe('[Class] EvmUnshield', async() => {

    let paymentAddress = '12sjGWHkv1otCQkQ7se1Zr8yjdMQtVCJcvY5tJD5Ea6PjnDrShhuNTK5WZsbnK6ABAAUPUwtcWpbcpgkC3JGYd7QhFME4eSjEAr5Ff75ZikmevabbtsnAE13oq5iNZS627iZVgKuZE3PgTwjhxAi'
    let addressOutchain = '0xDA0e0aDa73F37744803cb481b41C6d48265C06C8'

    describe('TC001_ETH_Request_Unshield_ETH_UT', async() => {
        it('STEP_CallApi', async() => {

            let addressType = 1
            let incognitoAmount = '1200000'
            let network = 'eth'
            let unifiedTokenID = ""
            let privacyTokenAddress = await selectToken('eth', 'ut')

            let pDecimal = await coinServiceApi.getTokenDecimal(privacyTokenAddress)
            let requestedAmount = incognitoAmount / (10 ** pDecimal) + ""

            let childTokenAddress = await findTokenChildByNetwork(privacyTokenAddress, network)
            if (childTokenAddress) {
                unifiedTokenID = privacyTokenAddress
                privacyTokenAddress = childTokenAddress
            }

            let response = await webServiceApi.genUnshieldAddress({
                network,
                requestedAmount,
                addressType,
                incognitoAmount,
                paymentAddress,
                privacyTokenAddress,
                walletAddress: paymentAddress,
                unifiedTokenID
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genUnshieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.FeeAddress, '')
            chai.assert.notEqual(response.data.Result.ID, '')
            chai.assert.notEqual(response.data.Result.TokenFees.Level1, '')
            chai.assert.equal(response.data.Error, null)
        });
    });

    describe('TC002_ETH_Request_Unshield_ETH_ETH', async() => {
        it('STEP_CallApi', async() => {

            let addressType = 1
            let incognitoAmount = '1200000'
            let network = 'eth'
            let unifiedTokenID = ""
            let privacyTokenAddress = await selectToken('eth', 'eth')

            let pDecimal = await coinServiceApi.getTokenDecimal(privacyTokenAddress)
            let requestedAmount = incognitoAmount / (10 ** pDecimal) + ""

            let childTokenAddress = await findTokenChildByNetwork(privacyTokenAddress, network)
            if (childTokenAddress) {
                unifiedTokenID = privacyTokenAddress
                privacyTokenAddress = childTokenAddress
            }

            let response = await webServiceApi.genUnshieldAddress({
                network,
                requestedAmount,
                addressType,
                incognitoAmount,
                paymentAddress,
                privacyTokenAddress,
                walletAddress: paymentAddress,
                unifiedTokenID
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genUnshieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.FeeAddress, '')
            chai.assert.notEqual(response.data.Result.ID, '')
            chai.assert.notEqual(response.data.Result.TokenFees.Level1, '')
            chai.assert.equal(response.data.Error, null)
        });
    });

    describe('TC003_ETH_Request_Unshield_USDT_UT', async() => {
        it('STEP_CallApi', async() => {

            let addressType = 1
            let incognitoAmount = '1200000'
            let network = 'eth'
            let unifiedTokenID = ""
            let privacyTokenAddress = await selectToken('usdt', 'ut')

            let pDecimal = await coinServiceApi.getTokenDecimal(privacyTokenAddress)
            let requestedAmount = incognitoAmount / (10 ** pDecimal) + ""

            let childTokenAddress = await findTokenChildByNetwork(privacyTokenAddress, network)
            if (childTokenAddress) {
                unifiedTokenID = privacyTokenAddress
                privacyTokenAddress = childTokenAddress
            }

            let response = await webServiceApi.genUnshieldAddress({
                network,
                requestedAmount,
                addressType,
                incognitoAmount,
                paymentAddress,
                privacyTokenAddress,
                walletAddress: paymentAddress,
                unifiedTokenID
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genUnshieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.FeeAddress, '')
            chai.assert.notEqual(response.data.Result.ID, '')
            chai.assert.notEqual(response.data.Result.TokenFees.Level1, '')
            chai.assert.equal(response.data.Error, null)
        });
    });

    describe('TC004_ETH_Request_Unshield_USDT_ETH', async() => {
        it('STEP_CallApi', async() => {

            let addressType = 1
            let incognitoAmount = '1200000'
            let network = 'eth'
            let unifiedTokenID = ""
            let privacyTokenAddress = await selectToken('usdt', 'eth')

            let pDecimal = await coinServiceApi.getTokenDecimal(privacyTokenAddress)
            let requestedAmount = incognitoAmount / (10 ** pDecimal) + ""

            let childTokenAddress = await findTokenChildByNetwork(privacyTokenAddress, network)
            if (childTokenAddress) {
                unifiedTokenID = privacyTokenAddress
                privacyTokenAddress = childTokenAddress
            }

            let response = await webServiceApi.genUnshieldAddress({
                network,
                requestedAmount,
                addressType,
                incognitoAmount,
                paymentAddress,
                privacyTokenAddress,
                walletAddress: paymentAddress,
                unifiedTokenID
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genUnshieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.FeeAddress, '')
            chai.assert.notEqual(response.data.Result.ID, '')
            chai.assert.notEqual(response.data.Result.TokenFees.Level1, '')
            chai.assert.equal(response.data.Error, null)
        });
    });

    describe('TC005_ETH_Request_Unshield_AAVE_ETH', async() => {
        it('STEP_CallApi', async() => {

            let addressType = 1
            let incognitoAmount = '1200000'
            let network = 'eth'
            let unifiedTokenID = ""
            let privacyTokenAddress = await selectToken('aave', 'eth')

            let pDecimal = await coinServiceApi.getTokenDecimal(privacyTokenAddress)
            let requestedAmount = incognitoAmount / (10 ** pDecimal) + ""

            let childTokenAddress = await findTokenChildByNetwork(privacyTokenAddress, network)
            if (childTokenAddress) {
                unifiedTokenID = privacyTokenAddress
                privacyTokenAddress = childTokenAddress
            }

            let response = await webServiceApi.genUnshieldAddress({
                network,
                requestedAmount,
                addressType,
                incognitoAmount,
                paymentAddress,
                privacyTokenAddress,
                walletAddress: paymentAddress,
                unifiedTokenID
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genUnshieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.FeeAddress, '')
            chai.assert.notEqual(response.data.Result.ID, '')
            chai.assert.notEqual(response.data.Result.PrivacyFees.Level1, '')
            chai.assert.equal(response.data.Error, null)
        });
    });

    describe('TC006_ETH_Request_Unshield_BNB_BSC', async() => {
        it('STEP_CallApi', async() => {

            let addressType = 2
            let incognitoAmount = '1200000'
            let network = 'bsc'
            let unifiedTokenID = ""
            let privacyTokenAddress = await selectToken('bnb', 'bsc')

            let pDecimal = await coinServiceApi.getTokenDecimal(privacyTokenAddress)
            let requestedAmount = incognitoAmount / (10 ** pDecimal) + ""

            let childTokenAddress = await findTokenChildByNetwork(privacyTokenAddress, network)
            if (childTokenAddress) {
                unifiedTokenID = privacyTokenAddress
                privacyTokenAddress = childTokenAddress
            }

            let response = await webServiceApi.genUnshieldAddress({
                network,
                requestedAmount,
                addressType,
                incognitoAmount,
                paymentAddress,
                privacyTokenAddress,
                walletAddress: paymentAddress,
                unifiedTokenID
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genUnshieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.FeeAddress, '')
            chai.assert.notEqual(response.data.Result.ID, '')
            chai.assert.notEqual(response.data.Result.TokenFees.Level1, '')
            chai.assert.equal(response.data.Error, null)
        });
    });

    describe('TC007_ETH_Request_Unshield_USDC_UT', async() => {
        it('STEP_CallApi', async() => {

            let addressType = 2
            let incognitoAmount = '1200000'
            let network = 'bsc'
            let unifiedTokenID = ""
            let privacyTokenAddress = await selectToken('usdc', 'ut')

            let pDecimal = await coinServiceApi.getTokenDecimal(privacyTokenAddress)
            let requestedAmount = incognitoAmount / (10 ** pDecimal) + ""

            let childTokenAddress = await findTokenChildByNetwork(privacyTokenAddress, network)
            if (childTokenAddress) {
                unifiedTokenID = privacyTokenAddress
                privacyTokenAddress = childTokenAddress
            }

            let response = await webServiceApi.genUnshieldAddress({
                network,
                requestedAmount,
                addressType,
                incognitoAmount,
                paymentAddress,
                privacyTokenAddress,
                walletAddress: paymentAddress,
                unifiedTokenID
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genUnshieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.FeeAddress, '')
            chai.assert.notEqual(response.data.Result.ID, '')
            chai.assert.notEqual(response.data.Result.TokenFees.Level1, '')
            chai.assert.equal(response.data.Error, null)
        });
    });

    describe('TC008_ETH_Request_Unshield_USDC_BSC', async() => {
        it('STEP_CallApi', async() => {

            let addressType = 2
            let incognitoAmount = '1200000'
            let network = 'bsc'
            let unifiedTokenID = ""
            let privacyTokenAddress = await selectToken('usdc', 'bsc')

            let pDecimal = await coinServiceApi.getTokenDecimal(privacyTokenAddress)
            let requestedAmount = incognitoAmount / (10 ** pDecimal) + ""

            let childTokenAddress = await findTokenChildByNetwork(privacyTokenAddress, network)
            if (childTokenAddress) {
                unifiedTokenID = privacyTokenAddress
                privacyTokenAddress = childTokenAddress
            }

            let response = await webServiceApi.genUnshieldAddress({
                network,
                requestedAmount,
                addressType,
                incognitoAmount,
                paymentAddress,
                privacyTokenAddress,
                walletAddress: paymentAddress,
                unifiedTokenID
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genUnshieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.FeeAddress, '')
            chai.assert.notEqual(response.data.Result.ID, '')
            chai.assert.notEqual(response.data.Result.TokenFees.Level1, '')
            chai.assert.equal(response.data.Error, null)
        });
    });

    describe('TC009_ETH_Request_Unshield_BUSD_BSC', async() => {
        it('STEP_CallApi', async() => {

            let addressType = 2
            let incognitoAmount = '1200000'
            let network = 'bsc'
            let unifiedTokenID = ""
            let privacyTokenAddress = await selectToken('BUSD', 'bsc')

            let pDecimal = await coinServiceApi.getTokenDecimal(privacyTokenAddress)
            let requestedAmount = incognitoAmount / (10 ** pDecimal) + ""

            let childTokenAddress = await findTokenChildByNetwork(privacyTokenAddress, network)
            if (childTokenAddress) {
                unifiedTokenID = privacyTokenAddress
                privacyTokenAddress = childTokenAddress
            }

            let response = await webServiceApi.genUnshieldAddress({
                network,
                requestedAmount,
                addressType,
                incognitoAmount,
                paymentAddress,
                privacyTokenAddress,
                walletAddress: paymentAddress,
                unifiedTokenID
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genUnshieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.FeeAddress, '')
            chai.assert.notEqual(response.data.Result.ID, '')
            chai.assert.notEqual(response.data.Result.PrivacyFees.Level1, '')
            chai.assert.equal(response.data.Error, null)
        });
    });
});



const convertNetworkToCurrencyType = async(network, symbol = null) => {
    network = network.toLowerCase()
    let currencyType

    switch (network) {
        case 'eth':
            currencyType = symbol == 'eth' ? 1 : 3
            return currencyType
        case 'bsc':
            currencyType = symbol == 'bnb' ? 7 : 8
            return currencyType
        case 'tomo':
            return 9
        case 'zil':
            return 10
        case 'xmr':
            return 11
        case 'neo':
            return 12
        case 'dash':
            return 13
        case 'ltc':
            return 14
        case 'doge':
            return 15
        case 'zec':
            return 16
        case 'dot':
            return 17
        case 'plg':
            currencyType = symbol == 'matic' ? 19 : 20
            return currencyType
        case 'ftm':
            currencyType = symbol == 'ftm' ? 21 : 22
            return currencyType
        case 'sol':
            currencyType = symbol == 'sol' ? 23 : 24
            return currencyType
        case 'ut':
            return 25
        default:
            return null;
    }
}

const selectToken = async(symbol, network = null) => {
    symbol = symbol ? symbol.toLowerCase() : null
    network = network ? network.toLowerCase() : null
    let currencyType = await convertNetworkToCurrencyType(network, symbol)

    if (symbol == 'prv') {
        return '0000000000000000000000000000000000000000000000000000000000000004'
    } else {
        let listToken = await coinServiceApi.getListToken()
        for (const token of listToken) {
            if (token.Symbol.toLowerCase() == symbol && token.CurrencyType == currencyType) {
                return token.TokenID
            }
        }

    }
    return null
}

const findTokenChildByNetwork = async(tokenParentID, network = 'eth') => {
    let tokenInfo = await coinServiceApi.getTokenInfo([tokenParentID])
    let listUnifiedToken = tokenInfo[0].ListUnifiedToken
    if (listUnifiedToken && Object.keys(listUnifiedToken).length > 0) {
        let childToken
        switch (network) {
            case 'eth':
                childToken = _.find(listUnifiedToken, { "Network": 'Ethereum' })
                return childToken.TokenID
            case 'bsc':
                childToken = _.find(listUnifiedToken, { "Network": 'BSC' })
                return childToken.TokenID
            case 'plg':
                childToken = _.find(listUnifiedToken, { "Network": 'Polygon' })
                return childToken.TokenID
            case 'ftm':
                return null
        }
    }
}