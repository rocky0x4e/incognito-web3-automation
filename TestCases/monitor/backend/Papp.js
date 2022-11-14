const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const backendApi_schemas = require("../../../schemas/backendApi_schemas");
const { BackendApi } = require('../../../lib/Incognito/BackendApi');
const { IncAccount } = require("../../../lib/Incognito/Account/Account");
const listAccount = require('../../../constant/listAccount.json');


// let privateKey = (await config.getAccount('main7')).privateKey
let privateKey = listAccount.main7
var backendApi = new BackendApi()
var account = new IncAccount(privateKey)

describe('[CLASS] Papp', async () => {

    describe('TC001_PancakeTradeToken', async () => {
        it('CallAPI', async () => {
            let response = await backendApi.tradeToken()

            await validateSchemaCommand.validateSchema(backendApi_schemas.tradeTokenSchemas, response.data)
        })

        it('CallAPI_2', async () => {
            let response = await backendApi.uniswapToken()

            await validateSchemaCommand.validateSchema(backendApi_schemas.uniSwapTokenSchemas, response.data)
        })
    })

    describe('TC002_UniswapToken', async () => {
        it('CallAPI', async () => {
            let response = await backendApi.uniswapToken()

            await validateSchemaCommand.validateSchema(backendApi_schemas.uniSwapTokenSchemas, response.data)
        })
    })

    describe('TC003_CurveToken', async () => {
        it('CallAPI', async () => {
            let response = await backendApi.curveToken()

            await validateSchemaCommand.validateSchema(backendApi_schemas.curveTokenSchemas, response.data)
        })
    })

    describe('TC004_TradeHistory', async () => {
        it('CallAPI', async () => {
            let response = await backendApi.tradeHistory(account.paymentK)

            await validateSchemaCommand.validateSchema(backendApi_schemas.tradeHistorySchemas, response.data)
        })
    })

    describe('TC005_UniswapHistory', async () => {
        it('CallAPI', async () => {
            let response = await backendApi.uniswapHistory(account.paymentK)

            await validateSchemaCommand.validateSchema(backendApi_schemas.uniswapHistorySchemas, response.data)
        })
    })

    describe('TC006_CurveHistory', async () => {
        it('CallAPI', async () => {
            let response = await backendApi.curveHistory(account.paymentK)

            await validateSchemaCommand.validateSchema(backendApi_schemas.curveHistorySchemas, response.data)
        })
    })

    describe('TC007_TradeRewardHistory', async () => {
        it('CallAPI', async () => {
            let response = await backendApi.tradeRewardHistory(account.paymentK)

            await validateSchemaCommand.validateSchema(backendApi_schemas.tradeRewardHistorySchemas, response.data)
        })
    })

    describe('TC008_UniswapRewardHistory', async () => {
        it('CallAPI', async () => {
            let response = await backendApi.uniswapRewardHistory(account.paymentK)

            await validateSchemaCommand.validateSchema(backendApi_schemas.uniswapRewardHistorySchemas, response.data)
        })
    })

    describe('TC009_CurveRewardHistory', async () => {
        it('CallAPI', async () => {
            let response = await backendApi.curveRewardHistory(account.paymentK)

            await validateSchemaCommand.validateSchema(backendApi_schemas.curveRewardHistorySchemas, response.data)
        })
    })

})