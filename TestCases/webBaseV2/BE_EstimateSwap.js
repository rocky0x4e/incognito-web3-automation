//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let server = require('../../../server');
let config = require('../../../constant/config.js');
const cliCommonFunction = require('../../../constant/cliCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const csCommonFunction = require('../../../constant/csCommonFunction');
const coinServiceApi = require('../../../models/coinServiceApi');
const webServiceApi = require('../../../models/webServiceApi');
const beCommonFunction = require('../../../constant/beCommonFunction');
const common = require('../../../constant/commonFunction');
const addingContent = require('../../../testbase/addingContent');
const api = require('../../../constant/api');
const _ = require('lodash');
const addContext = require('mochawesome/addContext');
const { after } = require('lodash');


//Our parent block
describe('[Class] EstimateTrade', async() => {

    //Testcase
    describe('TC001_EstimateTradePdexPTVToToken', async() => {
        it('STEP_webEstimateTradepDex', async() => {

            //call api
            let sellToken = await selectToken('prv')
            let buyToken = await selectToken('zil', 'zil')
            let isMax = false
            let sellAmount = 150000000

            let response = await coinServiceApi.estimateTrade({
                tokenSell: sellToken,
                tokenBuy: buyToken,
                isMax,
                sellAmount
            })


            chai.expect(response).be.a('object');
            chai.expect(response).have.property('Result')
            chai.assert.equal(response.Error, null)

            //log
            await addingContent.addContent({
                FeePRV: response.Result.FeePRV.SellAmount,
                FeeToken: response.Result.FeeToken.SellAmount
            })

            //verify
            if (response.Result.FeePRV) {
                chai.expect(response.Result.FeePRV).to.have.property('SellAmount')
                chai.expect(response.Result.FeePRV).to.have.property('MaxGet')
                chai.expect(response.Result.FeePRV).to.have.property('Fee')
                chai.expect(response.Result.FeePRV).to.have.property('Route')
                chai.expect(response.Result.FeePRV).to.have.property('IsSignificant')
                chai.expect(response.Result.FeePRV).to.have.property('ImpactAmount')
            }
            if (response.Result.FeeToken) {
                chai.expect(response.Result.FeeToken).to.have.property('SellAmount')
                chai.expect(response.Result.FeeToken).to.have.property('MaxGet')
                chai.expect(response.Result.FeeToken).to.have.property('Fee')
                chai.expect(response.Result.FeeToken).to.have.property('Route')
                chai.expect(response.Result.FeeToken).to.have.property('IsSignificant')
                chai.expect(response.Result.FeeToken).to.have.property('ImpactAmount')
            }
        });
    });

    describe('TC002_EstimateTradePdexTokenToPRV', async() => {
        it('STEP_webEstimateTradepDex', async() => {

            //call api
            let sellToken = await selectToken('zil', 'zil')
            let buyToken = await selectToken('prv')
            let isMax = false
            let sellAmount = 150000000

            let response = await coinServiceApi.estimateTrade({
                tokenSell: sellToken,
                tokenBuy: buyToken,
                isMax,
                sellAmount
            })

            chai.expect(response).be.a('object');
            chai.expect(response).have.property('Result')
            chai.assert.equal(response.Error, null)

            //log
            await addingContent.addContent({
                FeePRV: response.Result.FeePRV.SellAmount,
                FeeToken: response.Result.FeeToken.SellAmount
            })

            //verify
            if (response.Result.FeePRV) {
                chai.expect(response.Result.FeePRV).to.have.property('SellAmount')
                chai.expect(response.Result.FeePRV).to.have.property('MaxGet')
                chai.expect(response.Result.FeePRV).to.have.property('Fee')
                chai.expect(response.Result.FeePRV).to.have.property('Route')
                chai.expect(response.Result.FeePRV).to.have.property('IsSignificant')
                chai.expect(response.Result.FeePRV).to.have.property('ImpactAmount')
            }
            if (response.Result.FeeToken) {
                chai.expect(response.Result.FeeToken).to.have.property('SellAmount')
                chai.expect(response.Result.FeeToken).to.have.property('MaxGet')
                chai.expect(response.Result.FeeToken).to.have.property('Fee')
                chai.expect(response.Result.FeeToken).to.have.property('Route')
                chai.expect(response.Result.FeeToken).to.have.property('IsSignificant')
                chai.expect(response.Result.FeeToken).to.have.property('ImpactAmount')
            }
        });
    });

    describe('TC003_EstimateTradePdexOnly', async() => {
        it('STEP_webEstimateSwapFee', async() => {

            //call api
            let sellToken = await selectToken('zil', 'zil')
            let decimalSellToken = await csCommonFunction.getTokenDecimalPow(sellToken)
            let buyToken = await selectToken('prv')
            let decimalBuyToken = await csCommonFunction.getTokenDecimalPow(buyToken)
            let amount = '0.1'
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.Api_EstimateSwapFee(amount, sellToken, network, slippage, buyToken)

            //verify
            chai.expect(response).be.a('object');
            chai.expect(response.Result.Networks).have.property('inc')

            chai.expect(response.Result.Networks.inc[0]).to.have.property('AppName')
            chai.assert.equal(response.Result.Networks.inc[0].AppName, 'pdex')
            chai.expect(response.Result.Networks.inc[0]).to.have.property('CallContract')
            chai.assert.equal(response.Result.Networks.inc[0].CallContract, '')
            chai.expect(response.Result.Networks.inc[0]).to.have.property('AmountIn')
            chai.assert.equal(response.Result.Networks.inc[0].AmountIn, amount)
            chai.expect(response.Result.Networks.inc[0]).to.have.property('AmountInRaw')
            chai.assert.equal(response.Result.Networks.inc[0].AmountInRaw, amount * decimalSellToken)
            chai.expect(response.Result.Networks.inc[0]).to.have.property('AmountOut')
            chai.expect(response.Result.Networks.inc[0]).to.have.property('AmountOutRaw')

            chai.expect(response.Result.Networks.inc[0]).to.have.property('Fee')
            chai.expect(response.Result.Networks.inc[0].Fee[0]).to.have.property('tokenid')
            chai.expect(response.Result.Networks.inc[0].Fee[0]).to.have.property('amount')
            chai.assert.equal(response.Result.Networks.inc[0].Fee[0].tokenid, sellToken)

            chai.expect(response.Result.Networks.inc[0]).to.have.property('FeeAddress')
            chai.expect(response.Result.Networks.inc[0]).to.have.property('FeeAddressShardID')
            chai.expect(response.Result.Networks.inc[0]).to.have.property('Paths')
            let Paths = response.Result.Networks.inc[0].Paths
            chai.assert.equal(Paths[0], sellToken)
            chai.assert.equal(Paths[Paths.length - 1], buyToken)

            chai.expect(response.Result.Networks.inc[0]).to.have.property('Calldata')
            chai.expect(response.Result.Networks.inc[0]).to.have.property('ImpactAmount')
            chai.expect(response.Result.Networks.inc[0]).to.have.property('RouteDebug')

            chai.assert.equal(response.Error, null)

        });
    });

    describe('TC004_EstimateTradePappOnly', async() => {
        it('STEP_webEstimateSwapFee', async() => {

            //call api
            let sellToken = await selectToken('link', 'ut')
            let sellTokenContract = await csCommonFunction.getTokenContract(sellToken, 'bsc')

            let buyToken = await selectToken('busd', 'ut')
            let buyTokenContract = await csCommonFunction.getTokenContract(buyToken, 'bsc')

            let amount = '0.1'
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.Api_EstimateSwapFee(amount, sellToken, network, slippage, buyToken)

            //verify
            chai.expect(response).be.a('object');
            chai.expect(response.Result.Networks).have.property('bsc')

            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AppName')
            chai.assert.equal(response.Result.Networks.bsc[0].AppName, 'pancake')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('CallContract')
            chai.assert.equal(response.Result.Networks.bsc[0].CallContract, '0x0e2923c21E2C5A2BDD18aa460B3FdDDDaDb0aE18')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AmountIn')
            chai.assert.equal(response.Result.Networks.bsc[0].AmountIn, amount)
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AmountInRaw')
            chai.assert.equal(response.Result.Networks.bsc[0].AmountInRaw, "")
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AmountOut')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AmountOutRaw')

            chai.expect(response.Result.Networks.bsc[0]).to.have.property('Fee')
            chai.expect(response.Result.Networks.bsc[0].Fee[0]).to.have.property('tokenid')
            chai.expect(response.Result.Networks.bsc[0].Fee[0]).to.have.property('amount')
            chai.assert.equal(response.Result.Networks.bsc[0].Fee[0].tokenid, sellToken)

            chai.expect(response.Result.Networks.bsc[0]).to.have.property('FeeAddress')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('FeeAddressShardID')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('Paths')
            let Paths = response.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

            chai.expect(response.Result.Networks.bsc[0]).to.have.property('Calldata')
            chai.assert.notEqual(response.Result.Networks.bsc[0].Calldata, '')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('ImpactAmount')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('RouteDebug')

            chai.assert.equal(response.Error, null)
        });
    });

    describe('TC005_EstimateTradeCannotTrade', async() => {
        it('STEP_webEstimateSwapFee', async() => {

            //call api
            let sellToken = await selectToken('xmr', 'xmr')
            let buyToken = await selectToken('busd', 'ut')

            let amount = '0.1'
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.Api_EstimateSwapFee(amount, sellToken, network, slippage, buyToken)

            //verify
            chai.expect(response).be.a('object');
            chai.expect(response).have.property('Error')
            chai.assert.equal(response.Error, 'No tradeable network found')
        });
    });

    describe('TC006_EstimateTradeBscPancake', async() => {
        it('STEP_webEstimateSwapFee', async() => {

            //call api
            let sellToken = await selectToken('link', 'ut')
            let sellTokenContract = await csCommonFunction.getTokenContract(sellToken, 'bsc')

            let buyToken = await selectToken('busd', 'ut')
            let buyTokenContract = await csCommonFunction.getTokenContract(buyToken, 'bsc')

            let amount = '0.25'
            let network = 'bsc'
            let slippage = '0.5'

            let response = await webServiceApi.Api_EstimateSwapFee(amount, sellToken, network, slippage, buyToken)

            //verify
            chai.expect(response).be.a('object');
            chai.expect(response.Result.Networks).have.property('bsc')

            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AppName')
            chai.assert.equal(response.Result.Networks.bsc[0].AppName, 'pancake')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('CallContract')
            chai.assert.equal(response.Result.Networks.bsc[0].CallContract, '0x0e2923c21E2C5A2BDD18aa460B3FdDDDaDb0aE18')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AmountIn')
            chai.assert.equal(response.Result.Networks.bsc[0].AmountIn, amount)
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AmountInRaw')
            chai.assert.equal(response.Result.Networks.bsc[0].AmountInRaw, "")
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AmountOut')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AmountOutRaw')

            chai.expect(response.Result.Networks.bsc[0]).to.have.property('Fee')
            chai.expect(response.Result.Networks.bsc[0].Fee[0]).to.have.property('tokenid')
            chai.expect(response.Result.Networks.bsc[0].Fee[0]).to.have.property('amount')
            chai.assert.equal(response.Result.Networks.bsc[0].Fee[0].tokenid, sellToken)

            chai.expect(response.Result.Networks.bsc[0]).to.have.property('FeeAddress')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('FeeAddressShardID')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('Paths')
            let Paths = response.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

            chai.expect(response.Result.Networks.bsc[0]).to.have.property('Calldata')
            chai.assert.notEqual(response.Result.Networks.bsc[0].Calldata, '')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('ImpactAmount')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('RouteDebug')

            chai.assert.equal(response.Error, null)
        });
    });

    describe('TC007_EstimateTradeIncPancake', async() => {
        it('STEP_webEstimateSwapFee', async() => {

            //call api
            let sellToken = await selectToken('link', 'ut')
            let sellTokenContract = await csCommonFunction.getTokenContract(sellToken, 'bsc')

            let buyToken = await selectToken('busd', 'ut')
            let buyTokenContract = await csCommonFunction.getTokenContract(buyToken, 'bsc')

            let amount = '0.25'
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.Api_EstimateSwapFee(amount, sellToken, network, slippage, buyToken)

            //verify
            chai.expect(response).be.a('object');
            chai.expect(response.Result.Networks).have.property('bsc')

            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AppName')
            chai.assert.equal(response.Result.Networks.bsc[0].AppName, 'pancake')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('CallContract')
            chai.assert.equal(response.Result.Networks.bsc[0].CallContract, '0x0e2923c21E2C5A2BDD18aa460B3FdDDDaDb0aE18')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AmountIn')
            chai.assert.equal(response.Result.Networks.bsc[0].AmountIn, amount)
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AmountInRaw')
            chai.assert.equal(response.Result.Networks.bsc[0].AmountInRaw, "")
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AmountOut')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('AmountOutRaw')

            chai.expect(response.Result.Networks.bsc[0]).to.have.property('Fee')
            chai.expect(response.Result.Networks.bsc[0].Fee[0]).to.have.property('tokenid')
            chai.expect(response.Result.Networks.bsc[0].Fee[0]).to.have.property('amount')
            chai.assert.equal(response.Result.Networks.bsc[0].Fee[0].tokenid, sellToken)

            chai.expect(response.Result.Networks.bsc[0]).to.have.property('FeeAddress')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('FeeAddressShardID')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('Paths')
            let Paths = response.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

            chai.expect(response.Result.Networks.bsc[0]).to.have.property('Calldata')
            chai.assert.notEqual(response.Result.Networks.bsc[0].Calldata, '')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('ImpactAmount')
            chai.expect(response.Result.Networks.bsc[0]).to.have.property('RouteDebug')

            chai.assert.equal(response.Error, null)
        });
    });

    describe('TC008_EstimateTradeBscPancakeCannotTrade', async() => {
        it('STEP_webEstimateSwapFee', async() => {

            //call api
            let sellToken = await selectToken('link', 'ut')
            let buyToken = await selectToken('dai', 'ut')

            let amount = '0.25'
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.Api_EstimateSwapFee(amount, sellToken, network, slippage, buyToken)

            //verify
            chai.expect(response).be.a('object');
            chai.expect(response).have.property('Error')
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