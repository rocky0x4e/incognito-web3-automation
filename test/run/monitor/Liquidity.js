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

describe('[Class] Liquidity', () => {

    let nftID = '5756fc0f1661b2b66bc670683ae0f1ef08441c62d91bd22720fa30093ceacaae'
    let pool_PRV_USDT = '0000000000000000000000000000000000000000000000000000000000000004-076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229-33a8ceae6db677d9860a6731de1a01de7e1ca7930404d7ec9ef5028f226f1633'
    let pool_PRV_ETH = '0000000000000000000000000000000000000000000000000000000000000004-3ee31eba6376fc16cadb52c8765f20b6ebff92c0b1c5ab5fc78c8c25703bb19e-407b251bb4a262391cad3fda612f9b0fd5c282ed0624815450a0cfa53410c6ec'


    //Testcase
    describe('TC001_PoolShare', async() => {
        it('TC001_CallAPI', async() => {

            let response = await coinServiceApi.poolShare({ nftID })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getPoolShareSchemas, response);

            chai.expect(response.Result).to.have.lengthOf.above(1);

        })
    })

    describe('TC002_PoolDetail', async() => {
        it('TC001_CallAPI', async() => {

            let poolIDs = [
                pool_PRV_USDT,
                pool_PRV_ETH
            ]

            let response = await coinServiceApi.poolDetail({ poolIDs })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getPoolDetailSchemas, response);

            for (const pool of response.Result) {
                chai.expect(pool.Token1Value).to.above(0);
                chai.expect(pool.Token2Value).to.above(0);
                chai.expect(pool.Virtual1Value).to.above(0);
                chai.expect(pool.Virtual2Value).to.above(0);
                chai.expect(pool.TotalShare).to.above(0);
                chai.expect(pool.AMP).to.above(0);
                chai.expect(pool.Price).to.above(0);
                chai.expect(pool.PriceChange24h).to.not.equal(0);
                chai.expect(pool.APY).to.above(0);
                chai.expect(pool.IsVerify).to.equal(true);
            }
        })
    })

    describe('TC003_ContributeHistory', async() => {
        it('TC001_CallAPI', async() => {

            let response = await coinServiceApi.contributeHistory({ nftID })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getContributeHistorySchemas, response);

            chai.expect(response.Result).to.have.lengthOf.above(1);
        })
    })

    describe('TC004_WithdrawHistory', async() => {
        it('TC001_CallAPI', async() => {

            let response = await coinServiceApi.withdrawHistory({ nftID })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getWithdrawHistorySchemas, response);

            chai.expect(response.Result).to.have.lengthOf.above(0);
        })
    })


    describe('TC005_WithdrawFeeHistory', async() => {
        it('TC001_CallAPI', async() => {

            let response = await coinServiceApi.withdrawFeeHistory({ nftID })

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getWithdrawFeeHistorySchemas, response);

            chai.expect(response.Result).to.have.lengthOf.above(0);
        })
    })



})