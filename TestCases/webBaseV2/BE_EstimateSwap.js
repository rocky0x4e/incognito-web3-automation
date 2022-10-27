//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
const csCommonFunction = require('../../constant/csCommonFunction');
const commonFunction = require('../../constant/commonFunction');
const { WebServiceApi } = require('../../lib/Incognito/WebServiceApi');
const { ENV } = require('../../global');
const { CoinServiceApi } = require('../../lib/Incognito/CoinService/CoinServiceApi');
const validateSchemaCommand = require("../../schemas/validateSchemaCommand");
const webServiceApi_schemas = require("../../schemas/webServiceApi_schemas");
const coinServiceApi_schemas = require("../../schemas/coinServiceApi_schemas");


const webServiceApi = new WebServiceApi(ENV.WebService)
const coinServiceApi = new CoinServiceApi(ENV.CoinService)

//Our parent block
describe('[Class] EstimateTrade', async() => {

    //Testcase
    describe('TC001_EstimateTradePdexPTVToToken', async() => {
        it('STEP_webEstimateTradepDex', async() => {

            //call api
            let tokenSell = await selectToken('prv')
            let tokenBuy = await selectToken('zil', 'zil')
            let isMax = false
            let sellAmount = await commonFunction.randomNumber(1e9)

            let response = await coinServiceApi.estimateTrade({
                tokenSell,
                tokenBuy,
                isMax,
                sellAmount
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getEstimatetradeSchemas, response.data)
            chai.assert.equal(response.data.Error, null)
        });
    });

    describe('TC002_EstimateTradePdexTokenToPRV', async() => {
        it('STEP_webEstimateTradepDex', async() => {

            //call api
            let tokenSell = await selectToken('zil', 'zil')
            let tokenBuy = await selectToken('prv')
            let isMax = false
            let sellAmount = await commonFunction.randomNumber(1e9)

            let response = await coinServiceApi.estimateTrade({
                tokenSell,
                tokenBuy,
                isMax,
                sellAmount
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getEstimatetradeSchemas, response.data)
            chai.assert.equal(response.data.Error, null)
        });
    });

    describe('TC003_EstimateTradePdexOnly', async() => {
        it('STEP_webEstimateSwapFee', async() => {

            //call api
            let fromToken = await selectToken('zil', 'zil')
            let decimalSellToken = await csCommonFunction.getTokenDecimalPow(fromToken)
            let toToken = await selectToken('prv')
            let decimalBuyToken = await csCommonFunction.getTokenDecimalPow(toToken)
            let amount = (1 / await commonFunction.randomNumber(100)) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount,
                fromToken,
                network,
                slippage,
                toToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)

            chai.assert.equal(response.data.Result.Networks.inc[0].AppName, 'pdex')
            chai.assert.equal(response.data.Result.Networks.inc[0].CallContract, '')
            chai.assert.equal(response.data.Result.Networks.inc[0].AmountIn, amount)
            chai.assert.equal(response.data.Result.Networks.inc[0].AmountInRaw, amount * decimalSellToken)
            chai.assert.equal(response.data.Result.Networks.inc[0].Fee[0].tokenid, fromToken)

            let Paths = response.data.Result.Networks.inc[0].Paths
            chai.assert.equal(Paths[0], fromToken)
            chai.assert.equal(Paths[Paths.length - 1], buyToken)
            chai.assert.equal(response.Error, null)
        });
    });

    describe('TC004_EstimateTradePappOnly', async() => {
        it('STEP_webEstimateSwapFee', async() => {

            //call api
            let fromToken = await selectToken('link', 'ut')
            let sellTokenContract = await csCommonFunction.getTokenContract(fromToken, 'bsc')

            let toToken = await selectToken('busd', 'ut')
            let buyTokenContract = await csCommonFunction.getTokenContract(toToken, 'bsc')
            let amount = (1 / await commonFunction.randomNumber(100)) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount,
                fromToken,
                network,
                slippage,
                toToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)

            //verify
            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, 'pancake')
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract, '0x0e2923c21E2C5A2BDD18aa460B3FdDDDaDb0aE18')
            chai.assert.equal(response.data.Result.Networks.bsc[0].AmountIn, amount)
            chai.assert.equal(response.data.Result.Networks.bsc[0].AmountInRaw, "")
            chai.assert.equal(response.data.Result.Networks.bsc[0].Fee[0].tokenid, fromToken)
            let Paths = response.data.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            chai.assert.notEqual(response.data.Result.Networks.bsc[0].Calldata, '')
            chai.assert.equal(response.Error, null)
        });
    });

    describe('TC005_EstimateTradeCannotTrade', async() => {
        it('STEP_webEstimateSwapFee', async() => {

            //call api
            let fromToken = await selectToken('xmr', 'xmr')
            let toToken = await selectToken('busd', 'ut')

            let amount = (1 / await commonFunction.randomNumber(100)) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount,
                fromToken,
                network,
                slippage,
                toToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            chai.assert.equal(response.Error, 'No tradeable network found')
        });
    });

    describe('TC006_EstimateTradeBscPancake', async() => {
        it('STEP_webEstimateSwapFee', async() => {

            //call api
            let fromToken = await selectToken('link', 'ut')
            let sellTokenContract = await csCommonFunction.getTokenContract(fromToken, 'bsc')

            let toToken = await selectToken('busd', 'ut')
            let buyTokenContract = await csCommonFunction.getTokenContract(toToken, 'bsc')

            let amount = (1 / await commonFunction.randomNumber(100)) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount,
                fromToken,
                network,
                slippage,
                toToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, 'pancake')
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract, '0x0e2923c21E2C5A2BDD18aa460B3FdDDDaDb0aE18')
            chai.assert.equal(response.data.Result.Networks.bsc[0].AmountIn, amount)
            chai.assert.equal(response.data.Result.Networks.bsc[0].AmountInRaw, "")
            chai.assert.equal(response.data.Result.Networks.bsc[0].Fee[0].tokenid, fromToken)

            let Paths = response.data.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            chai.assert.notEqual(response.data.Result.Networks.bsc[0].Calldata, '')
            chai.assert.equal(response.Error, null)
        });
    });

    describe('TC007_EstimateTradeIncPancake', async() => {
        it('STEP_webEstimateSwapFee', async() => {

            //call api
            let fromToken = await selectToken('link', 'ut')
            let sellTokenContract = await csCommonFunction.getTokenContract(fromToken, 'bsc')

            let toToken = await selectToken('busd', 'ut')
            let buyTokenContract = await csCommonFunction.getTokenContract(toToken, 'bsc')

            let amount = (1 / await commonFunction.randomNumber(100)) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount,
                fromToken,
                network,
                slippage,
                toToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, 'pancake')
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract, '0x0e2923c21E2C5A2BDD18aa460B3FdDDDaDb0aE18')
            chai.assert.equal(response.data.Result.Networks.bsc[0].AmountIn, amount)
            chai.assert.equal(response.data.Result.Networks.bsc[0].AmountInRaw, "")
            chai.assert.equal(response.data.Result.Networks.bsc[0].Fee[0].tokenid, fromToken)

            let Paths = response.data.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            chai.assert.notEqual(response.data.Result.Networks.bsc[0].Calldata, '')
            chai.assert.equal(response.Error, null)
        });
    });

    describe('TC008_EstimateTradeBscPancakeCannotTrade', async() => {
        it('STEP_webEstimateSwapFee', async() => {

            //call api
            let fromToken = await selectToken('link', 'ut')
            let toToken = await selectToken('dai', 'ut')

            let amount = (1 / await commonFunction.randomNumber(100)) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount,
                fromToken,
                network,
                slippage,
                toToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            chai.assert.equal(response.Error, 'No tradeable network found')
        });
    });
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
            currencyType = symbol == 'ftm' ? 12 : 22
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