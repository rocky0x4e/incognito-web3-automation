const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const backendApi_schemas = require("../../../schemas/backendApi_schemas");

//Require the dev-dependencies
const { ENV } = require('../../../global');
const { BackendApi } = require('../../../lib/Incognito/BackendApi');

describe('[Class] Login', () => {

    let backendApi = new BackendApi(ENV.Backend)

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


})