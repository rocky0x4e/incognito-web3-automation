//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
const cliCommonFunction = require('../../../constant/cliCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const csCommonFunction = require('../../../constant/csCommonFunction');
const coinServiceApi = require('../../../models/coinServiceApi');
const webServiceApi = require('../../../models/webServiceApi');
const beCommonFunction = require('../../../constant/beCommonFunction');
const common = require('../../../constant/commonFunction');
const addingContent = require('../../../testbase/addingContent');


//Our parent block
describe('[Class] EvmShield', async() => {

    let paymentAddress = '12sjGWHkv1otCQkQ7se1Zr8yjdMQtVCJcvY5tJD5Ea6PjnDrShhuNTK5WZsbnK6ABAAUPUwtcWpbcpgkC3JGYd7QhFME4eSjEAr5Ff75ZikmevabbtsnAE13oq5iNZS627iZVgKuZE3PgTwjhxAi'

    describe('TC001_ETH_Request_Shield_ETH', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'eth'
            let privacyTokenAddress = await selectToken('eth', 'eth')

            let response = await webServiceApi.Api_GenShieldAddress(
                addressType,
                network,
                privacyTokenAddress,
                paymentAddress)

            //verify
            chai.expect(response).be.a('object');

            chai.expect(response.Result).have.property('Address')
            chai.assert.notEqual(response.Result.Address, '')

            chai.expect(response.Result).have.property('Decentralized')
            chai.assert.equal(response.Result.Decentralized, 2)

            chai.expect(response.Result).have.property('EstimateFee')
            chai.assert.notEqual(response.Result.EstimateFee, 0)

            chai.expect(response.Result).have.property('ExpiredAt')
            chai.assert.equal(response.Result.ExpiredAt, '0001-01-01T00:00:00Z')

            chai.expect(response.Result).have.property('ID')
            chai.assert.notEqual(response.Result.ID, 0)

            chai.expect(response.Result).have.property('TokenFee1')
            chai.assert.equal(response.Result.TokenFee, 0)
        });
    });

    describe('TC002_ETH_Request_Shield_USDT', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'eth'
            let privacyTokenAddress = await selectToken('usdt', 'eth')

            let response = await webServiceApi.Api_GenShieldAddress(
                addressType,
                network,
                privacyTokenAddress,
                paymentAddress)

            //verify
            chai.expect(response).be.a('object');

            chai.expect(response.Result).have.property('Address')
            chai.assert.notEqual(response.Result.Address, '')

            chai.expect(response.Result).have.property('Decentralized')
            chai.assert.equal(response.Result.Decentralized, 2)

            chai.expect(response.Result).have.property('EstimateFee')
            chai.assert.notEqual(response.Result.EstimateFee, 0)

            chai.expect(response.Result).have.property('ExpiredAt')
            chai.assert.equal(response.Result.ExpiredAt, '0001-01-01T00:00:00Z')

            chai.expect(response.Result).have.property('ID')
            chai.assert.notEqual(response.Result.ID, 0)

            chai.expect(response.Result).have.property('TokenFee')
            chai.assert.notEqual(response.Result.TokenFee, 0)
        });
    });

    describe('TC003_ETH_Request_Shield_ZUM', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'eth'
            let privacyTokenAddress = await selectToken('zum', 'eth')

            let response = await webServiceApi.Api_GenShieldAddress(
                addressType,
                network,
                privacyTokenAddress,
                paymentAddress)

            //verify
            chai.expect(response).be.a('object');

            chai.expect(response.Result).have.property('Address')
            chai.assert.notEqual(response.Result.Address, '')

            chai.expect(response.Result).have.property('Decentralized')
            chai.assert.equal(response.Result.Decentralized, 2)

            chai.expect(response.Result).have.property('EstimateFee')
            chai.assert.notEqual(response.Result.EstimateFee, 0)

            chai.expect(response.Result).have.property('ExpiredAt')
            chai.assert.equal(response.Result.ExpiredAt, '0001-01-01T00:00:00Z')

            chai.expect(response.Result).have.property('ID')
            chai.assert.notEqual(response.Result.ID, 0)

            chai.expect(response.Result).have.property('TokenFee')
            chai.assert.notEqual(response.Result.TokenFee, 0)
        });
    });

    describe('TC004_BSC_Request_Shield_BNB', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'bsc'
            let privacyTokenAddress = await selectToken('bnb', 'bsc')

            let response = await webServiceApi.Api_GenShieldAddress(
                addressType,
                network,
                privacyTokenAddress,
                paymentAddress)

            //verify
            chai.expect(response).be.a('object');

            chai.expect(response.Result).have.property('Address')
            chai.assert.notEqual(response.Result.Address, '')

            chai.expect(response.Result).have.property('Decentralized')
            chai.assert.equal(response.Result.Decentralized, 3)

            chai.expect(response.Result).have.property('ExpiredAt')
            chai.assert.equal(response.Result.ExpiredAt, '0001-01-01T00:00:00Z')

            chai.expect(response.Result).have.property('ID')
            chai.assert.notEqual(response.Result.ID, 0)

            chai.expect(response.Result).have.property('EstimateFee')
            chai.assert.notEqual(response.Result.EstimateFee, 0)

            chai.expect(response.Result).have.property('TokenFee')
            chai.assert.equal(response.Result.TokenFee, 0)
        });
    });

    describe('TC005_BSC_Request_Shield_USDC', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'bsc'
            let privacyTokenAddress = await selectToken('usdc', 'bsc')

            let response = await webServiceApi.Api_GenShieldAddress(
                addressType,
                network,
                privacyTokenAddress,
                paymentAddress)

            //verify
            chai.expect(response).be.a('object');

            chai.expect(response.Result).have.property('Address')
            chai.assert.notEqual(response.Result.Address, '')

            chai.expect(response.Result).have.property('Decentralized')
            chai.assert.equal(response.Result.Decentralized, 3)

            chai.expect(response.Result).have.property('ExpiredAt')
            chai.assert.equal(response.Result.ExpiredAt, '0001-01-01T00:00:00Z')

            chai.expect(response.Result).have.property('ID')
            chai.assert.notEqual(response.Result.ID, 0)

            chai.expect(response.Result).have.property('EstimateFee')
            chai.assert.notEqual(response.Result.EstimateFee, 0)

            chai.expect(response.Result).have.property('TokenFee')
            chai.assert.notEqual(response.Result.TokenFee, 0)
        });
    });

    describe('TC006_BSC_Request_Shield_ALICE', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'bsc'
            let privacyTokenAddress = await selectToken('alice', 'bsc')

            let response = await webServiceApi.Api_GenShieldAddress(
                addressType,
                network,
                privacyTokenAddress,
                paymentAddress)

            //verify
            chai.expect(response).be.a('object');

            chai.expect(response.Result).have.property('Address')
            chai.assert.notEqual(response.Result.Address, '')

            chai.expect(response.Result).have.property('Decentralized')
            chai.assert.equal(response.Result.Decentralized, 3)

            chai.expect(response.Result).have.property('ExpiredAt')
            chai.assert.equal(response.Result.ExpiredAt, '0001-01-01T00:00:00Z')

            chai.expect(response.Result).have.property('ID')
            chai.assert.notEqual(response.Result.ID, 0)

            chai.expect(response.Result).have.property('EstimateFee')
            chai.assert.notEqual(response.Result.EstimateFee, 0)

            chai.expect(response.Result).have.property('TokenFee')
            chai.assert.notEqual(response.Result.TokenFee, 0)
        });
    });

    after('TC007_PLG_Request_Shield_MATIC', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'plg'
            let privacyTokenAddress = await selectToken('matic', 'plg')

            let response = await webServiceApi.Api_GenShieldAddress(
                addressType,
                network,
                privacyTokenAddress,
                paymentAddress)

            //verify
            chai.expect(response).be.a('object');

            chai.expect(response.Result).have.property('Address')
            chai.assert.notEqual(response.Result.Address, '')

            chai.expect(response.Result).have.property('Decentralized')
            chai.assert.equal(response.Result.Decentralized, 4)

            chai.expect(response.Result).have.property('ExpiredAt')
            chai.assert.equal(response.Result.ExpiredAt, '0001-01-01T00:00:00Z')

            chai.expect(response.Result).have.property('ID')
            chai.assert.notEqual(response.Result.ID, 0)

            chai.expect(response.Result).have.property('EstimateFee')
            chai.assert.notEqual(response.Result.EstimateFee, 0)

            chai.expect(response.Result).have.property('TokenFee')
            chai.assert.equal(response.Result.TokenFee, 0)
        });
    });

    after('TC008_PLG_Request_Shield_DAI', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'plg'
            let privacyTokenAddress = await selectToken('dai', 'plg')

            let response = await webServiceApi.Api_GenShieldAddress(
                addressType,
                network,
                privacyTokenAddress,
                paymentAddress)

            //verify
            chai.expect(response).be.a('object');

            chai.expect(response.Result).have.property('Address')
            chai.assert.notEqual(response.Result.Address, '')

            chai.expect(response.Result).have.property('Decentralized')
            chai.assert.equal(response.Result.Decentralized, 4)

            chai.expect(response.Result).have.property('ExpiredAt')
            chai.assert.equal(response.Result.ExpiredAt, '0001-01-01T00:00:00Z')

            chai.expect(response.Result).have.property('ID')
            chai.assert.notEqual(response.Result.ID, 0)

            chai.expect(response.Result).have.property('EstimateFee')
            chai.assert.notEqual(response.Result.EstimateFee, 0)

            chai.expect(response.Result).have.property('TokenFee')
            chai.assert.notEqual(response.Result.TokenFee, 0)
        });
    });

    after('TC009_PLG_Request_Shield_MANA', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'plg'
            let privacyTokenAddress = await selectToken('mana', 'plg')

            let response = await webServiceApi.Api_GenShieldAddress(
                addressType,
                network,
                privacyTokenAddress,
                paymentAddress)

            //verify
            chai.expect(response).be.a('object');

            chai.expect(response.Result).have.property('Address')
            chai.assert.notEqual(response.Result.Address, '')

            chai.expect(response.Result).have.property('Decentralized')
            chai.assert.equal(response.Result.Decentralized, 4)

            chai.expect(response.Result).have.property('ExpiredAt')
            chai.assert.equal(response.Result.ExpiredAt, '0001-01-01T00:00:00Z')

            chai.expect(response.Result).have.property('ID')
            chai.assert.notEqual(response.Result.ID, 0)

            chai.expect(response.Result).have.property('EstimateFee')
            chai.assert.notEqual(response.Result.EstimateFee, 0)

            chai.expect(response.Result).have.property('TokenFee')
            chai.assert.notEqual(response.Result.TokenFee, 0)
        });
    });

    after('TC007_FTM_Request_Shield_FTM', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'ftm'
            let privacyTokenAddress = await selectToken('ftm', 'ftm')

            let response = await webServiceApi.Api_GenShieldAddress(
                addressType,
                network,
                privacyTokenAddress,
                paymentAddress)

            //verify
            chai.expect(response).be.a('object');

            chai.expect(response.Result).have.property('Address')
            chai.assert.notEqual(response.Result.Address, '')

            chai.expect(response.Result).have.property('Decentralized')
            chai.assert.equal(response.Result.Decentralized, 5)

            chai.expect(response.Result).have.property('ExpiredAt')
            chai.assert.equal(response.Result.ExpiredAt, '0001-01-01T00:00:00Z')

            chai.expect(response.Result).have.property('ID')
            chai.assert.notEqual(response.Result.ID, 0)

            chai.expect(response.Result).have.property('EstimateFee')
            chai.assert.notEqual(response.Result.EstimateFee, 0)

            chai.expect(response.Result).have.property('TokenFee')
            chai.assert.equal(response.Result.TokenFee, 0)
        });
    });

    after('TC008_FTM_Request_Shield_USDC', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'ftm'
            let privacyTokenAddress = await selectToken('usdc', 'ftm')

            let response = await webServiceApi.Api_GenShieldAddress(
                addressType,
                network,
                privacyTokenAddress,
                paymentAddress)

            //verify
            chai.expect(response).be.a('object');

            chai.expect(response.Result).have.property('Address')
            chai.assert.notEqual(response.Result.Address, '')

            chai.expect(response.Result).have.property('Decentralized')
            chai.assert.equal(response.Result.Decentralized, 5)

            chai.expect(response.Result).have.property('ExpiredAt')
            chai.assert.equal(response.Result.ExpiredAt, '0001-01-01T00:00:00Z')

            chai.expect(response.Result).have.property('ID')
            chai.assert.notEqual(response.Result.ID, 0)

            chai.expect(response.Result).have.property('EstimateFee')
            chai.assert.notEqual(response.Result.EstimateFee, 0)

            chai.expect(response.Result).have.property('TokenFee')
            chai.assert.notEqual(response.Result.TokenFee, 0)
        });
    });

    after('TC009_PLG_Request_Shield_AVAX', async() => {
        it('STEP_Call_Api_Gen_Shield_Address', async() => {

            let addressType = 1
            let network = 'ftm'
            let privacyTokenAddress = await selectToken('avax', 'ftm')

            let response = await webServiceApi.Api_GenShieldAddress(
                addressType,
                network,
                privacyTokenAddress,
                paymentAddress)

            //verify
            chai.expect(response).be.a('object');

            chai.expect(response.Result).have.property('Address')
            chai.assert.notEqual(response.Result.Address, '')

            chai.expect(response.Result).have.property('Decentralized')
            chai.assert.equal(response.Result.Decentralized, 5)

            chai.expect(response.Result).have.property('ExpiredAt')
            chai.assert.equal(response.Result.ExpiredAt, '0001-01-01T00:00:00Z')

            chai.expect(response.Result).have.property('ID')
            chai.assert.notEqual(response.Result.ID, 0)

            chai.expect(response.Result).have.property('EstimateFee')
            chai.assert.notEqual(response.Result.EstimateFee, 0)

            chai.expect(response.Result).have.property('TokenFee')
            chai.assert.notEqual(response.Result.TokenFee, 0)
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
        let listToken = await csCommonFunction.getListToken()
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