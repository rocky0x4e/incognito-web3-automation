const { TOKEN } = require('../../../lib/Incognito/Constants');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const coinServiceApi_schemas = require("../../../schemas/coinServiceApi_schemas");
const addDebug = require('../../../lib/Utils/AddingContent').addDebug;
let chai = require("chai");
const { CoinServiceApi } = require("../../../lib/Incognito/CoinServiceApi");
const GenAction = require("../../../lib/Utils/GenAction");
const { ACCOUNTS, NODES } = require("../../TestBase");

let account = ACCOUNTS.Incognito.get(2)
let sender = ACCOUNTS.Incognito.get(2)
let receiver = ACCOUNTS.Incognito.get(3)

let coinServiceApi = new CoinServiceApi();

describe("[Class] Balance", () => {
    describe("TC001_GetKeyInfo", async () => {
        it("CallAPI", async () => {
            let response = await coinServiceApi.getKeyInfo({
                otaKey: account.otaPrivateK
            });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getGetKeyInfoSchemas, response.data);
        });
    });

    describe("TC002_CheckKeyImage", async () => {
        it("CallAPI", async () => {
            let keyImages = ["7w0f383GlwJli1+7+5ocpLimo5iD6hZzmpL52Yh3EKM=", "XifUy+NcW/MU+zOTofbfCepu07iWPevoaXkextz9i8w="];

            let response = await coinServiceApi.getKeyImage({
                KeyImages: keyImages
            });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getCheckKeyImageSchemas, response.data);
        });
    });

    describe("TC003_TokenInfo", async () => {
        it("CallAPI", async () => {
            let TokenIDs = [
                TOKEN.PRV,
                TOKEN.USDT_UT,
                TOKEN.ZIL
            ];

            let response = await coinServiceApi.tokenInfo({
                TokenIDs: TokenIDs
            });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getTokenInfoSchemas, response.data);
        });
    });

    describe("TC004_GetTxsBySender", async () => {
        it("CallAPI", async () => {
            let keyImages = ["Wgff+rv59epyKHIjko4mkpiS5BFpopejqD7dkLFExGA=", "Alyc63FVuOpiTgk16o8BDAaQfL5hxMFv28H/djaoZPU="];

            let response = await coinServiceApi.getTxsBySender({
                shardID: 3,
                keyImages
            });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getTxBySenderSchemas, response.data);
        });
    });

    describe("TC005_GetTxsByPubKey", async () => {
        it("CallAPI", async () => {
            let pubkeys = ["/14cdQwaARSCnYPwI2GRw5NnnwPKF3Kp5qQ9SDrzNZs=", "aN6XseTePHYUf5j/myolNTr6okGvaBSqe2stlMKLZRs="];

            let response = await coinServiceApi.getTxsByPubkey({ pubkeys });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getTxByPubKeySchemas, response.data);
        });
    });

    describe("TC006_SubmitOtaKey", async () => {
        it("CallAPI", async () => {
            let response = await coinServiceApi.submitOtaKey(account.otaKey);
        });
    });
});