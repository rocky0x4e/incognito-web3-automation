const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const backendApi_schemas = require("../../../schemas/backendApi_schemas");
const { BackendApi } = require('../../../lib/Incognito/BackendApi');
const { IncAccount } = require("../../../lib/Incognito/Account/Account");
const { ENV } = require('../../../global');
const config = require('../../../constant/config');

describe('[Class] Papp', async() => {

    let privateKey = (await config.getAccount('main7')).privateKey
    let backendApi = new BackendApi(ENV.Backend)
    let account = new IncAccount(privateKey)

    describe('TC001_PancakeTradeToken', async() => {
        it('CallAPI', async() => {
            let response = await backendApi.tradeToken()

            await validateSchemaCommand.validateSchema(backendApi_schemas.tradeTokenSchemas, response.data)
        })
    })

    describe('TC002_UniswapToken', async() => {
        it('CallAPI', async() => {
            let response = await backendApi.uniswapToken()

            await validateSchemaCommand.validateSchema(backendApi_schemas.uniSwapTokenSchemas, response.data)
        })
    })

    describe('TC003_CurveToken', async() => {
        it('CallAPI', async() => {
            let response = await backendApi.curveToken()

            await validateSchemaCommand.validateSchema(backendApi_schemas.curveTokenSchemas, response.data)
        })
    })

    describe('TC004_TradeHistory', async() => {
        it('CallAPI', async() => {
            let response = await backendApi.tradeHistory(account.paymentK)

            await validateSchemaCommand.validateSchema(backendApi_schemas.tradeHistorySchemas, response.data)
        })
    })

    describe('TC005_UniswapHistory', async() => {
        it('CallAPI', async() => {
            let response = await backendApi.uniswapHistory(account.paymentK)

            await validateSchemaCommand.validateSchema(backendApi_schemas.uniswapHistorySchemas, response.data)
        })
    })

    describe('TC006_CurveHistory', async() => {
        it('CallAPI', async() => {
            let response = await backendApi.curveHistory(account.paymentK)

            await validateSchemaCommand.validateSchema(backendApi_schemas.curveHistorySchemas, response.data)
        })
    })


})