const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const coinServiceApi_schemas = require("../../../schemas/coinServiceApi_schemas");
let chai = require("chai");
const { CoinServiceApi } = require("../../../lib/Incognito/CoinServiceApi");

describe("[Class] Liquidity", () => {
    const NFT_ID = "5756fc0f1661b2b66bc670683ae0f1ef08441c62d91bd22720fa30093ceacaae";
    const pool_PRV_USDT =
        "0000000000000000000000000000000000000000000000000000000000000004-076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229-33a8ceae6db677d9860a6731de1a01de7e1ca7930404d7ec9ef5028f226f1633";
    const pool_PRV_ETH =
        "0000000000000000000000000000000000000000000000000000000000000004-3ee31eba6376fc16cadb52c8765f20b6ebff92c0b1c5ab5fc78c8c25703bb19e-407b251bb4a262391cad3fda612f9b0fd5c282ed0624815450a0cfa53410c6ec";

    let coinServiceApi = new CoinServiceApi();
    //Testcase
    describe("TC001_PoolShare", async () => {
        it("TC001_CallAPI", async () => {
            let response = await coinServiceApi.poolShare(NFT_ID);

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getPoolShareSchemas, response.data);

            chai.expect(response.data.Result).to.have.lengthOf.above(1);
        });
    });

    describe("TC002_PoolDetail", async () => {
        it("TC001_CallAPI", async () => {
            let poolIDs = [pool_PRV_USDT, pool_PRV_ETH];

            let response = await coinServiceApi.poolDetail({ poolIDs });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getPoolDetailSchemas, response.data);

            for (const pool of response.data.Result) {
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
        });
    });

    describe("TC003_ContributeHistory", async () => {
        it("TC001_CallAPI", async () => {
            let response = await coinServiceApi.contributeHistory({ nftID: NFT_ID });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getContributeHistorySchemas, response.data);

            chai.expect(response.data.Result).to.have.lengthOf.above(1);
        });
    });

    describe("TC004_WithdrawHistory", async () => {
        it("TC001_CallAPI", async () => {
            let response = await coinServiceApi.withdrawHistory({ nftID: NFT_ID });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getWithdrawHistorySchemas, response.data);

            chai.expect(response.data.Result).to.have.lengthOf.above(0);
        });
    });

    describe("TC005_WithdrawFeeHistory", async () => {
        it("TC001_CallAPI", async () => {
            let response = await coinServiceApi.withdrawFeeHistory({ nftID: NFT_ID });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getWithdrawFeeHistorySchemas, response.data);

            chai.expect(response.data.Result).to.have.lengthOf.above(0);
        });
    });
});
