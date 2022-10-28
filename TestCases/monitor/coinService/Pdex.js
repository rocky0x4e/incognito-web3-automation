const config = require('../../../constant/config');
const commonFunction = require('../../../constant/commonFunction');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const coinServiceApi_schemas = require("../../../schemas/coinServiceApi_schemas");
let chai = require('chai');
const { IncNode } = require('../../../lib/Incognito/IncNode');
const { IncAccount } = require('../../../lib/Incognito/Account/Account');
const { CoinServiceApi } = require('../../../lib/Incognito/CoinService/CoinServiceApi');

describe('[Class] Pdex', () => {

    let account = {
        privateKey: null,
        otaKey: null,
    }
    let coinServiceApi = new CoinServiceApi()

    describe('Before_Initdata', async() => {

        let privateKey = (await config.getAccount('main7')).privateKey

        let node = new IncNode(global.urlFullNode)
        let accountNode = new IncAccount(privateKey).attachTo(node)

        account.otaKey = accountNode.otaPrivateK
        account.privateKey = accountNode.privateK
    })

    describe('TC001_SwapTradeHistory', async() => {
        it('CallAPI', async() => {
            let response = await coinServiceApi.tradeHistory({ otaKey: account.otaKey })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getTradeHistorySchemas, response.data)

            chai.expect(response.data.Result).to.have.lengthOf.above(1);
        })
    })

    describe('TC002_SwapEstimateTrade_PRV_USDT(UT)', async() => {
        it('CallAPI', async() => {
            const PRV = '0000000000000000000000000000000000000000000000000000000000000004'
            const USDT = '076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229'
            let sellAmount = await commonFunction.randomNumber(100000000)

            let response = await coinServiceApi.estimateTrade({
                tokenSell: PRV,
                tokenBuy: USDT,
                sellAmount: sellAmount
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getEstimatetradeSchemas, response.data)

        })
    })

    describe('TC003_SwapEstimateTrade_ETH_PRV', async() => {
        it('CallAPI', async() => {
            const PRV = '0000000000000000000000000000000000000000000000000000000000000004'
            const ETH = 'ffd8d42dc40a8d166ea4848baf8b5f6e912ad79875f4373070b59392b1756c8f'
            let sellAmount = await commonFunction.randomNumber(100000000)

            let response = await coinServiceApi.estimateTrade({
                tokenSell: ETH,
                tokenBuy: PRV,
                sellAmount: sellAmount
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getEstimatetradeSchemas, response.data)
        })
    })

    describe('TC004_SwapEstimateTrade_USDT(UT)_ETH(UT)', async() => {
        it('CallAPI', async() => {
            const USDT = '076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229'
            const ETH = '3ee31eba6376fc16cadb52c8765f20b6ebff92c0b1c5ab5fc78c8c25703bb19e'
            let sellAmount = await commonFunction.randomNumber(100000000)

            let response = await coinServiceApi.estimateTrade({
                tokenSell: USDT,
                tokenBuy: ETH,
                sellAmount: sellAmount
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getEstimatetradeSchemas, response.data)
        })
    })

    describe('TC005_SwapEstimateTradeNoRouteFound', async() => {
        it('CallAPI', async() => {
            const WBTC = '85bd957e7d89e6e1cc57b0b601af5bc710d7fc479112ed15cfab3ac74b4d1372'
            const DVI = '915ee926aec56046bc57f43156a3ba047c7910ca17caef154a3bd26d2cabdbb6'
            let sellAmount = await commonFunction.randomNumber(100000000)

            let response = await coinServiceApi.estimateTrade({
                tokenSell: WBTC,
                tokenBuy: DVI,
                sellAmount: sellAmount
            })

            chai.expect(response.data.Result.FeePRV.MaxGet).to.equal(0)
            chai.expect(response.data.Result.FeeToken.MaxGet).to.equal(0)
            chai.expect(response.data.Error).to.equal('no trade route found')
        })
    })

    describe('TC006_OrderPendingOrder', async() => {
        it('CallAPI', async() => {
            const poolID_PRV_BTC = '0000000000000000000000000000000000000000000000000000000000000004-b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696-b2769c3d130a565027f05f74345760653bfc71200c3df9829e0e931a34f76cb4'

            let response = await coinServiceApi.pendingOrder({
                poolid: poolID_PRV_BTC
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getPendingOrderSchemas, response.data)
        })
    })

    describe('TC007_OrderPendingLimit', async() => {
        it('CallAPI', async() => {
            const ID = [
                "5756fc0f1661b2b66bc670683ae0f1ef08441c62d91bd22720fa30093ceacaae",
                "7fa4fe70193c0ea9b6b218b7a530dcde2be0f5db1adee31a7589c7baf4625af1",
                "8dcfda3c49ebfdb57693b49e98016e132b8d3ca355a12ff5db52c287743277e9"
            ]

            let response = await coinServiceApi.pendingLimit({
                ID
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getPendingLimitSchemas, response.data)
        })
    })

    describe('TC008_OrderTradeHistory', async() => {
        it('CallAPI', async() => {
            const poolID = '0000000000000000000000000000000000000000000000000000000000000004-b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696-b2769c3d130a565027f05f74345760653bfc71200c3df9829e0e931a34f76cb4'
            const nftID = '7fa4fe70193c0ea9b6b218b7a530dcde2be0f5db1adee31a7589c7baf4625af1'

            let response = await coinServiceApi.orderTradeHistory({
                poolid: poolID,
                nftid: nftID,
            })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getOrderTradeHistorySchemas, response.data)
        })
    })
})
