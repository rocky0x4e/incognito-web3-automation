const config = require('../../../constant/config');
const cliCommonFunction = require('../../../constant/cliCommonFunction');
const sdkCommonFunction = require('../../../constant/sdkCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const commonFunction = require('../../../constant/commonFunction');
const coinServiceApi = require('../../../models/coinServiceApi');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const coinServiceApi_schemas = require("../../../schemas/coinServiceApi_schemas");
const addingContent = require('../../../testbase/addingContent');

//Require the dev-dependencies
let chai = require('chai');

describe('[Class] Pdex', () => {

    let account = {
        privateKey: null,
        otaKey: null,
    }

    describe('Before_Initdata', async() => {
        let accountTemp = await config.getAccount('main7')
        account.privateKey = accountTemp.privateKey
        account.otaKey = (await cliCommonFunction.keyInfo(accountTemp.privateKey)).OTAPrivateKey
    })

    describe('TC001_SwapTradeHistory', async() => {
        it('CallAPI', async() => {
            let response = await coinServiceApi.tradehistory(account.otaKey)

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getTradeHistorySchemas, response)

            chai.expect(response.Result).to.have.lengthOf.above(1);
        })
    })

    describe('TC002_SwapEstimateTrade_PRV_USDT(UT)', async() => {
        it('CallAPI', async() => {
            let PRV = '0000000000000000000000000000000000000000000000000000000000000004'
            let USDT = '076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229'
            let sellAmount = await commonFunction.randomNumber(100000000)

            let response = await coinServiceApi.estimateTrade({
                tokenSell: PRV,
                tokenBuy: USDT,
                sellAmount: sellAmount
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getEstimatetradeSchemas, response)

        })
    })

    describe('TC003_SwapEstimateTrade_ETH_PRV', async() => {
        it('CallAPI', async() => {
            let PRV = '0000000000000000000000000000000000000000000000000000000000000004'
            let ETH = 'ffd8d42dc40a8d166ea4848baf8b5f6e912ad79875f4373070b59392b1756c8f'
            let sellAmount = await commonFunction.randomNumber(100000000)

            let response = await coinServiceApi.estimateTrade({
                tokenSell: ETH,
                tokenBuy: PRV,
                sellAmount: sellAmount
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getEstimatetradeSchemas, response)

        })
    })

    describe('TC004_SwapEstimateTrade_USDT(UT)_ETH(UT)', async() => {
        it('CallAPI', async() => {
            let USDT = '076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229'
            let ETH = '3ee31eba6376fc16cadb52c8765f20b6ebff92c0b1c5ab5fc78c8c25703bb19e'
            let sellAmount = await commonFunction.randomNumber(100000000)

            let response = await coinServiceApi.estimateTrade({
                tokenSell: USDT,
                tokenBuy: ETH,
                sellAmount: sellAmount
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getEstimatetradeSchemas, response)

        })
    })

    describe('TC005_SwapEstimateTradeNoRouteFound', async() => {
        it('CallAPI', async() => {
            let WBTC = '85bd957e7d89e6e1cc57b0b601af5bc710d7fc479112ed15cfab3ac74b4d1372'
            let DVI = '915ee926aec56046bc57f43156a3ba047c7910ca17caef154a3bd26d2cabdbb6'
            let sellAmount = await commonFunction.randomNumber(100000000)

            let response = await coinServiceApi.estimateTrade({
                tokenSell: WBTC,
                tokenBuy: DVI,
                sellAmount: sellAmount
            })

            chai.expect(response.Result.FeePRV.MaxGet).to.equal(0)
            chai.expect(response.Result.FeeToken.MaxGet).to.equal(0)
            chai.expect(response.Error).to.equal('no trade route found')

        })
    })

    describe('TC006_OrderPendingOrder', async() => {
        it('CallAPI', async() => {
            let poolID_PRV_BTC = '0000000000000000000000000000000000000000000000000000000000000004-b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696-b2769c3d130a565027f05f74345760653bfc71200c3df9829e0e931a34f76cb4'

            let response = await coinServiceApi.pendingOrder({
                poolid: poolID_PRV_BTC
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getPendingOrderSchemas, response)


        })
    })

    describe('TC007_OrderPendingLimit', async() => {
        it('CallAPI', async() => {
            let ID = [
                "5756fc0f1661b2b66bc670683ae0f1ef08441c62d91bd22720fa30093ceacaae",
                "7fa4fe70193c0ea9b6b218b7a530dcde2be0f5db1adee31a7589c7baf4625af1",
                "8dcfda3c49ebfdb57693b49e98016e132b8d3ca355a12ff5db52c287743277e9"
            ]

            let response = await coinServiceApi.pendingLimit({
                ID
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getPendingLimitSchemas, response)
        })
    })

    describe('TC008_OrderTradeHistory', async() => {
        it('CallAPI', async() => {
            let poolID = '0000000000000000000000000000000000000000000000000000000000000004-b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696-b2769c3d130a565027f05f74345760653bfc71200c3df9829e0e931a34f76cb4'
            let nftID = '7fa4fe70193c0ea9b6b218b7a530dcde2be0f5db1adee31a7589c7baf4625af1'

            let response = await coinServiceApi.orderTradeHistory({
                poolid: poolID,
                nftid: nftID,
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getOrderTradeHistorySchemas, response)
        })
    })
})