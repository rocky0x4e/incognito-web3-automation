//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let server = require('../server');
let config = require('../constant/config.js');
const cliCommonFunction = require('../constant/cliCommonFunction');
const chainCommonFunction = require('../constant/chainCommonFunction');
const csCommonFunction = require('../constant/csCommonFunction');
const coinServiceApi = require('../../models/coinServiceApi');
const beCommonFunction = require('../constant/beCommonFunction');
const common = require('../constant/commonFunction');
const api = require('../constant/api');
const _ = require('lodash');
const addContext = require('mochawesome/addContext');
const { after } = require('lodash');


let beTokenAuthen
let paymentAddress = '12sfV7Vo27Rz3aT4c2kyiTpvziwXjviQMMrp5gsFfupAvoDveHhQLunAWvqTao46DSEYpnbMpGYxuc4a9KGU7BppPM9uZtfVCqPAQ18WtPEijsLmYxVL1MWWDggDZHfRmhtxmVijadCjXyr7iC9X'

//Our parent block
describe('[Class] EstimateTrade', async() => {

    const apiTraking = async() => {
        let api

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    api
                }
            });
        });
        return api
    }

    //Testcase
    describe('TC001_EstimateTradePdexPTVToToken', async() => {

        let api = await apiTraking()

        it('webEstimateTradepDex', async() => {

            let sellToken = '0000000000000000000000000000000000000000000000000000000000000004'
            let buyToken = '880ea0787f6c1555e59e3958a595086b7802fc7a38276bcd80d4525606557fbc'
            let isMax = false
            let sellAmount = 150000000

            api = await coinServiceApi.estimateTrade({
                tokenSell: sellToken,
                tokenBuy: buyToken,
                isMax,
                sellAmount
            })

            let response = api.response

            chai.expect(response).be.a('object');
            chai.expect(response).have.property('Result') chai.assert.equal(response.Error, null)

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

    describe('TC001_EstimateTradePdexTokenToPRV', async() => {

        let api

        afterEach(function() {
            addContext(this, {
                title: 'API ',
                value: {
                    api
                }
            });
        });

        it('webEstimateTradepDex', async() => {

            let sellToken = '880ea0787f6c1555e59e3958a595086b7802fc7a38276bcd80d4525606557fbc'
            let buyToken = '0000000000000000000000000000000000000000000000000000000000000004'
            let isMax = false
            let sellAmount = 150000000

            api = await coinServiceApi.estimateTrade({
                tokenSell: sellToken,
                tokenBuy: buyToken,
                isMax,
                sellAmount
            })

            let response = api.response

            chai.expect(response).be.a('object');
            chai.expect(response).have.property('Result')
            chai.assert.equal(response.Error, null)

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