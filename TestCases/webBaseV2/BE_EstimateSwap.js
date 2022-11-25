let chai = require("chai");
const GenAction = require("../../lib/Utils/GenAction");
const { WebServiceApi } = require("../../lib/Incognito/WebServiceApi");
const { CoinServiceApi } = require("../../lib/Incognito/CoinServiceApi");
const validateSchemaCommand = require("../../schemas/validateSchemaCommand");
const webServiceApi_schemas = require("../../schemas/webServiceApi_schemas");
const coinServiceApi_schemas = require("../../schemas/coinServiceApi_schemas");

const webServiceApi = new WebServiceApi();
const coinServiceApi = new CoinServiceApi();

//Our parent block
describe("[Class] EstimateTrade", async() => {
    //Testcase
    describe("TC001_EstimateTradePdexPTVToToken", async() => {
        it("STEP_webEstimateTradepDex", async() => {
            //call api
            let tokenSell = await selectToken("prv");
            let tokenBuy = await selectToken("zil", "zil");
            let isMax = false;
            let sellAmount = await GenAction.randomNumber(1e9);

            let response = await coinServiceApi.estimateTrade({
                tokenSell,
                tokenBuy,
                isMax,
                sellAmount
            });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getEstimatetradeSchemas, response.data);
            chai.assert.equal(response.data.Error, null);
        })
    })

    describe("TC002_EstimateTradePdexTokenToPRV", async() => {
        it("STEP_webEstimateTradepDex", async() => {
            //call api
            let tokenSell = await selectToken("zil", "zil");
            let tokenBuy = await selectToken("prv");
            let isMax = false;
            let sellAmount = await GenAction.randomNumber(1e9);

            let response = await coinServiceApi.estimateTrade({
                tokenSell,
                tokenBuy,
                isMax,
                sellAmount
            });

            await validateSchemaCommand.validateSchema(coinServiceApi_schemas.getEstimatetradeSchemas, response.data);
            chai.assert.equal(response.data.Error, null);
        });
    });

    describe("TC003_EstimateTradePdexOnly", async() => {
        it("STEP_webEstimateSwapFee", async() => {
            //call api
            let fromToken = await selectToken("zil", "zil");
            let decimalSellToken = await coinServiceApi.getTokenDecimalPow(fromToken);
            let toToken = await selectToken("prv");
            let decimalBuyToken = await coinServiceApi.getTokenDecimalPow(toToken);
            let amount = 1 / (await GenAction.randomNumber(100)) + "";
            let network = "inc";
            let slippage = "0.5";

            let response = await webServiceApi.estimateSwapFee({
                amount,
                fromToken,
                network,
                slippage,
                toToken
            });

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data);

            chai.assert.equal(response.data.Result.Networks.inc[0].AppName, "pdex");
            chai.assert.equal(response.data.Result.Networks.inc[0].CallContract, "");
            chai.assert.equal(response.data.Result.Networks.inc[0].AmountIn, amount);
            chai.assert.equal(Math.round(response.data.Result.Networks.inc[0].AmountInRaw / 10), Math.round(amount * decimalSellToken / 10));
            chai.assert.equal(response.data.Result.Networks.inc[0].Fee[0].tokenid, fromToken);

            let Paths = response.data.Result.Networks.inc[0].Paths;
            chai.assert.equal(Paths[0], fromToken);
            chai.assert.equal(Paths[Paths.length - 1], toToken);
            chai.assert.equal(response.Error, null);
        });
    });

    describe("TC004_EstimateTradePappOnly", async() => {
        it("STEP_webEstimateSwapFee", async() => {
            //call api
            let fromToken = await selectToken("usdt", "ut");
            let sellTokenContract = await coinServiceApi.getTokenContract(fromToken, "bsc");

            let toToken = await selectToken("dai", "ut");
            let buyTokenContract = await coinServiceApi.getTokenContract(toToken, "bsc");
            let amount = 1 / (await GenAction.randomNumber(100)) + "";
            let network = "inc";
            let slippage = "0.5";

            let response = await webServiceApi.estimateSwapFee({
                amount,
                fromToken,
                network,
                slippage,
                toToken
            });

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data);

            //verify
            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, "pancake");
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract, "0x95Cd8898917c7216Da0517aAB6A115d7A7b6CA90");
            chai.assert.equal(response.data.Result.Networks.bsc[0].AmountIn, amount);
            chai.assert.equal(response.data.Result.Networks.bsc[0].AmountInRaw, "");
            chai.assert.equal(response.data.Result.Networks.bsc[0].Fee[0].tokenid, fromToken);
            chai.assert.notEqual(response.data.Result.Networks.bsc[0].Calldata, "");
            chai.assert.equal(response.Error, null);
        });
    });

    describe("TC005_EstimateTradeCannotTrade", async() => {
        it("STEP_webEstimateSwapFee", async() => {
            //call api
            let fromToken = await selectToken("xmr", "xmr");
            let toToken = await selectToken("dcn", "eth");

            let amount = 1 / (await GenAction.randomNumber(100)) + "";
            let network = "inc";
            let slippage = "0.5";

            let response = await webServiceApi.estimateSwapFee({
                amount,
                fromToken,
                network,
                slippage,
                toToken
            });


            // await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data);
            chai.assert.equal(response.data.Error, "No tradeable network found");
        });
    });

    describe("TC006_EstimateTradeBscPancake", async() => {
        it("STEP_webEstimateSwapFee", async() => {
            //call api
            let fromToken = await selectToken("usdt", "ut");
            let sellTokenContract = await coinServiceApi.getTokenContract(fromToken, "bsc");

            let toToken = await selectToken("eth", "ut");
            let buyTokenContract = await coinServiceApi.getTokenContract(toToken, "bsc");

            let amount = 1 / (await GenAction.randomNumber(100)) + "";
            let network = "inc";
            let slippage = "0.5";

            let response = await webServiceApi.estimateSwapFee({
                amount,
                fromToken,
                network,
                slippage,
                toToken
            });

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data);
            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, "pancake");
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract, "0x95Cd8898917c7216Da0517aAB6A115d7A7b6CA90");
            chai.assert.equal(response.data.Result.Networks.bsc[0].AmountIn, amount);
            chai.assert.equal(response.data.Result.Networks.bsc[0].AmountInRaw, "");
            chai.assert.equal(response.data.Result.Networks.bsc[0].Fee[0].tokenid, fromToken);
            chai.assert.notEqual(response.data.Result.Networks.bsc[0].Calldata, "");
            chai.assert.equal(response.Error, null);
        });
    });

    describe("TC007_EstimateTradeIncPancake", async() => {
        it("STEP_webEstimateSwapFee", async() => {
            //call api
            let fromToken = await selectToken("usdt", "ut");
            let sellTokenContract = await coinServiceApi.getTokenContract(fromToken, "bsc");

            let toToken = await selectToken("dai", "ut");
            let buyTokenContract = await coinServiceApi.getTokenContract(toToken, "bsc");

            let amount = 1 / (await GenAction.randomNumber(100)) + "";
            let network = "inc";
            let slippage = "0.5";

            let response = await webServiceApi.estimateSwapFee({
                amount,
                fromToken,
                network,
                slippage,
                toToken
            });

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data);
            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, "pancake");
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract, "0x95Cd8898917c7216Da0517aAB6A115d7A7b6CA90");
            chai.assert.equal(response.data.Result.Networks.bsc[0].AmountIn, amount);
            chai.assert.equal(response.data.Result.Networks.bsc[0].AmountInRaw, "");
            chai.assert.equal(response.data.Result.Networks.bsc[0].Fee[0].tokenid, fromToken);
            chai.assert.notEqual(response.data.Result.Networks.bsc[0].Calldata, "");
            chai.assert.equal(response.Error, null);
        });
    });

    describe("TC008_EstimateTradeBscPancakeCannotTrade", async() => {
        it("STEP_webEstimateSwapFee", async() => {
            //call api
            let fromToken = await selectToken("ltc", "bsc");
            let toToken = await selectToken("usdc", "eth");

            let amount = 1 / (await GenAction.randomNumber(100)) + "";
            let network = "inc";
            let slippage = "0.5";

            let response = await webServiceApi.estimateSwapFee({
                amount,
                fromToken,
                network,
                slippage,
                toToken
            });

            chai.assert.equal(response.data.Error, "No tradeable network found");
        });
    });
});

const selectToken = async(symbol, network = null) => {
    symbol = symbol ? symbol.toLowerCase() : null;
    network = network ? network.toLowerCase() : null;
    let currencyType = await convertNetworkToCurrencyType(network, symbol);

    if (symbol == "prv") {
        return "0000000000000000000000000000000000000000000000000000000000000004";
    } else {
        let listToken = await coinServiceApi.getListToken();
        for (const token of listToken) {
            if (token.Symbol.toLowerCase() == symbol && token.CurrencyType == currencyType) {
                return token.TokenID;
            }
        }
    }
    return null;
};

const convertNetworkToCurrencyType = async(network, symbol = null) => {
    network = network ? network.toLowerCase() : null;
    let currencyType;

    switch (network) {
        case "eth":
            currencyType = symbol == "eth" ? 1 : 3;
            return currencyType;
        case "bsc":
            currencyType = symbol == "bnb" ? 7 : 8;
            return currencyType;
        case "tomo":
            return 9;
        case "zil":
            return 10;
        case "xmr":
            return 11;
        case "neo":
            return 12;
        case "dash":
            return 13;
        case "ltc":
            return 14;
        case "doge":
            return 15;
        case "zec":
            return 16;
        case "dot":
            return 17;
        case "plg":
            currencyType = symbol == "matic" ? 19 : 20;
            return currencyType;
        case "ftm":
            currencyType = symbol == "ftm" ? 12 : 22;
            return currencyType;
        case "sol":
            currencyType = symbol == "sol" ? 23 : 24;
            return currencyType;
        case "ut":
            return 25;
        default:
            return null;
    }
};