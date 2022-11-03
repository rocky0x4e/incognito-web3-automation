let chai = require('chai');
const { WebServiceApi } = require('../../lib/Incognito/WebServiceApi');
const { CoinServiceApi } = require('../../lib/Incognito/CoinServiceApi');
const { ENV } = require("../../global");
const webServiceApi_schemas = require("../../schemas/webServiceApi_schemas");
const validateSchemaCommand = require("../../schemas/validateSchemaCommand");


let webServiceApi = new WebServiceApi()
let coinServiceApi = new CoinServiceApi()
    //Our parent block
describe('[Class] EvmShield', async() => {

    let paymentAddress = '12sjGWHkv1otCQkQ7se1Zr8yjdMQtVCJcvY5tJD5Ea6PjnDrShhuNTK5WZsbnK6ABAAUPUwtcWpbcpgkC3JGYd7QhFME4eSjEAr5Ff75ZikmevabbtsnAE13oq5iNZS627iZVgKuZE3PgTwjhxAi'

    describe('TC001_ETH_Request_Shield_ETH', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'eth'
            let privacyTokenAddress = await selectToken('eth', 'eth')

            let response = await webServiceApi.genShieldAddress({
                addressType,
                network,
                privacyTokenAddress,
                walletAddress: paymentAddress
            })

            //verify
            validateSchemaCommand.validateSchema(webServiceApi_schemas.genShieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.Address, '')
            chai.assert.equal(response.data.Result.Decentralized, 2)
            chai.assert.notEqual(response.data.Result.EstimateFee, 0)
            chai.assert.equal(response.data.Result.ExpiredAt, '0001-01-01T00:00:00Z')
            chai.assert.notEqual(response.data.Result.ID, 0)
            chai.assert.equal(response.data.Result.TokenFee, 0)
        });
    });

    describe('TC002_ETH_Request_Shield_USDT', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'eth'
            let privacyTokenAddress = await selectToken('usdt', 'eth')

            let response = await webServiceApi.genShieldAddress({
                addressType,
                network,
                privacyTokenAddress,
                walletAddress: paymentAddress
            })

            //verify
            validateSchemaCommand.validateSchema(webServiceApi_schemas.genShieldAddressSchemas, response.data)

            //verify

            chai.assert.notEqual(response.data.Result.Address, '')
            chai.assert.equal(response.data.Result.Decentralized, 2)
            chai.assert.notEqual(response.data.Result.EstimateFee, 0)
            chai.assert.equal(response.data.Result.ExpiredAt, '0001-01-01T00:00:00Z')
            chai.assert.notEqual(response.data.Result.ID, 0)
            chai.assert.notEqual(response.data.Result.TokenFee, 0)
        });
    });

    describe('TC003_ETH_Request_Shield_ZUM', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'eth'
            let privacyTokenAddress = await selectToken('zum', 'eth')

            let response = await webServiceApi.genShieldAddress({
                addressType,
                network,
                privacyTokenAddress,
                walletAddress: paymentAddress
            })

            //verify
            validateSchemaCommand.validateSchema(webServiceApi_schemas.genShieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.Address, '')
            chai.assert.equal(response.data.Result.Decentralized, 2)
            chai.assert.notEqual(response.data.Result.EstimateFee, 0)
            chai.assert.equal(response.data.Result.ExpiredAt, '0001-01-01T00:00:00Z')
            chai.assert.notEqual(response.data.Result.ID, 0)
            chai.assert.notEqual(response.data.Result.TokenFee, 0)
        });
    });

    describe('TC004_BSC_Request_Shield_BNB', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'bsc'
            let privacyTokenAddress = await selectToken('bnb', 'bsc')

            let response = await webServiceApi.genShieldAddress({
                addressType,
                network,
                privacyTokenAddress,
                walletAddress: paymentAddress
            })

            //verify
            validateSchemaCommand.validateSchema(webServiceApi_schemas.genShieldAddressSchemas, response.data)


            chai.assert.notEqual(response.data.Result.Address, '')
            chai.assert.equal(response.data.Result.Decentralized, 3)
            chai.assert.equal(response.data.Result.ExpiredAt, '0001-01-01T00:00:00Z')
            chai.assert.notEqual(response.data.Result.ID, 0)
            chai.assert.notEqual(response.data.Result.EstimateFee, 0)
            chai.assert.equal(response.data.Result.TokenFee, 0)
        });
    });

    describe('TC005_BSC_Request_Shield_USDC', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'bsc'
            let privacyTokenAddress = await selectToken('usdc', 'bsc')

            let response = await webServiceApi.genShieldAddress({
                addressType,
                network,
                privacyTokenAddress,
                walletAddress: paymentAddress
            })

            //verify
            validateSchemaCommand.validateSchema(webServiceApi_schemas.genShieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.Address, '')
            chai.assert.equal(response.data.Result.Decentralized, 3)
            chai.assert.equal(response.data.Result.ExpiredAt, '0001-01-01T00:00:00Z')
            chai.assert.notEqual(response.data.Result.ID, 0)
            chai.assert.notEqual(response.data.Result.EstimateFee, 0)
            chai.assert.notEqual(response.data.Result.TokenFee, 0)
        });
    });

    describe('TC006_BSC_Request_Shield_ALICE', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'bsc'
            let privacyTokenAddress = await selectToken('alice', 'bsc')

            let response = await webServiceApi.genShieldAddress({
                addressType,
                network,
                privacyTokenAddress,
                walletAddress: paymentAddress
            })

            //verify
            validateSchemaCommand.validateSchema(webServiceApi_schemas.genShieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.Address, '')
            chai.assert.equal(response.data.Result.Decentralized, 3)
            chai.assert.equal(response.data.Result.ExpiredAt, '0001-01-01T00:00:00Z')
            chai.assert.notEqual(response.data.Result.ID, 0)
            chai.assert.notEqual(response.data.Result.EstimateFee, 0)
            chai.assert.notEqual(response.data.Result.TokenFee, 0)
        });
    });

    describe('TC007_PLG_Request_Shield_MATIC', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'plg'
            let privacyTokenAddress = await selectToken('matic', 'plg')

            let response = await webServiceApi.genShieldAddress({
                addressType,
                network,
                privacyTokenAddress,
                walletAddress: paymentAddress
            })

            //verify
            validateSchemaCommand.validateSchema(webServiceApi_schemas.genShieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.Address, '')
            chai.assert.equal(response.data.Result.Decentralized, 4)
            chai.assert.equal(response.data.Result.ExpiredAt, '0001-01-01T00:00:00Z')
            chai.assert.notEqual(response.data.Result.ID, 0)
            chai.assert.notEqual(response.data.Result.EstimateFee, 0)
            chai.assert.equal(response.data.Result.TokenFee, 0)
        });
    });

    describe('TC008_PLG_Request_Shield_DAI', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'plg'
            let privacyTokenAddress = await selectToken('dai', 'plg')

            let response = await webServiceApi.genShieldAddress({
                addressType,
                network,
                privacyTokenAddress,
                walletAddress: paymentAddress
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genShieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.Address, '')
            chai.assert.equal(response.data.Result.Decentralized, 4)
            chai.assert.equal(response.data.Result.ExpiredAt, '0001-01-01T00:00:00Z')
            chai.assert.notEqual(response.data.Result.ID, 0)
            chai.assert.notEqual(response.data.Result.EstimateFee, 0)
            chai.assert.notEqual(response.data.Result.TokenFee, 0)
        });
    });

    describe('TC009_PLG_Request_Shield_MANA', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'plg'
            let privacyTokenAddress = await selectToken('mana', 'plg')

            let response = await webServiceApi.genShieldAddress({
                addressType,
                network,
                privacyTokenAddress,
                walletAddress: paymentAddress
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genShieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.Address, '')
            chai.assert.equal(response.data.Result.Decentralized, 4)
            chai.assert.equal(response.data.Result.ExpiredAt, '0001-01-01T00:00:00Z')
            chai.assert.notEqual(response.data.Result.ID, 0)
            chai.assert.notEqual(response.data.Result.EstimateFee, 0)
            chai.assert.notEqual(response.data.Result.TokenFee, 0)
        });
    });

    describe('TC010_FTM_Request_Shield_FTM', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'ftm'
            let privacyTokenAddress = await selectToken('ftm', 'ftm')

            let response = await webServiceApi.genShieldAddress({
                addressType,
                network,
                privacyTokenAddress,
                walletAddress: paymentAddress
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genShieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.Address, '')
            chai.assert.equal(response.data.Result.Decentralized, 5)
            chai.assert.equal(response.data.Result.ExpiredAt, '0001-01-01T00:00:00Z')
            chai.assert.notEqual(response.data.Result.ID, 0)
            chai.assert.notEqual(response.data.Result.EstimateFee, 0)
            chai.assert.equal(response.data.Result.TokenFee, 0)
        });
    });

    describe('TC011_FTM_Request_Shield_USDC', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'ftm'
            let privacyTokenAddress = await selectToken('usdc', 'ftm')

            let response = await webServiceApi.genShieldAddress({
                addressType,
                network,
                privacyTokenAddress,
                walletAddress: paymentAddress
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genShieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.Address, '')
            chai.assert.equal(response.data.Result.Decentralized, 5)
            chai.assert.equal(response.data.Result.ExpiredAt, '0001-01-01T00:00:00Z')
            chai.assert.notEqual(response.data.Result.ID, 0)
            chai.assert.notEqual(response.data.Result.EstimateFee, 0)
            chai.assert.notEqual(response.data.Result.TokenFee, 0)
        });
    });

    describe('TC012_PLG_Request_Shield_AVAX', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'ftm'
            let privacyTokenAddress = await selectToken('avax', 'ftm')

            let response = await webServiceApi.genShieldAddress({
                addressType,
                network,
                privacyTokenAddress,
                walletAddress: paymentAddress
            })

            validateSchemaCommand.validateSchema(webServiceApi_schemas.genShieldAddressSchemas, response.data)

            chai.assert.notEqual(response.data.Result.Address, '')
            chai.assert.equal(response.data.Result.Decentralized, 5)
            chai.assert.equal(response.data.Result.ExpiredAt, '0001-01-01T00:00:00Z')
            chai.assert.notEqual(response.data.Result.ID, 0)
            chai.assert.notEqual(response.data.Result.EstimateFee, 0)
            chai.assert.notEqual(response.data.Result.TokenFee, 0)
        });
    });

    //negative case
});

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