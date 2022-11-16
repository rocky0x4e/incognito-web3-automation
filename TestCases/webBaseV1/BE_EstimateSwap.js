//Require the dev-dependencies
const validateSchemaCommand = require("../../schemas/validateSchemaCommand");
const addingContent = require('../../lib/Utils/AddingContent');
const webServiceApi_schemas = require("../../schemas/webServiceApi_schemas");
let chai = require('chai');
const { WebServiceApi } = require('../../lib/Incognito/WebServiceApi');
const { CoinServiceApi } = require('../../lib/Incognito/CoinServiceApi');
const GenAction = require('../../lib/Utils/GenAction');


const webServiceApi = new WebServiceApi()
const coinServiceApi = new CoinServiceApi()

describe('[Class] EstimateTrade', async() => {

    //PANCAKE
    describe('TC001_PANCAKE_BNB(BSC)_DAI(UT)_BSC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'bsc'
            let appName = 'pancake'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('bnb', 'bsc')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('dai', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'bsc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, appName)
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract.toLowerCase(), contractApp.toLowerCase())

            let Paths = response.data.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

        });
    });

    describe('TC002_PANCAKE_USDT(UT)_DAI(UT)_BSC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'bsc'
            let appName = 'pancake'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('usdt', 'ut')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('dai', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'bsc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, appName)
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract.toLowerCase(), contractApp.toLowerCase())

            let Paths = response.data.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

        });
    });

    describe('TC003_PANCAKE_BUSD(BSC)_DAI(UT)_BSC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'bsc'
            let appName = 'pancake'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('busd', 'bsc')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('dai', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'bsc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, appName)
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract.toLowerCase(), contractApp.toLowerCase())

            let Paths = response.data.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

        });
    });

    describe('TC004_PANCAKE_ETH(UT)_BUSD(BSC)_BSC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'bsc'
            let appName = 'pancake'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('eth', 'ut')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('busd', 'bsc')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'bsc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, appName)
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract.toLowerCase(), contractApp.toLowerCase())

            let Paths = response.data.Result.Networks.bsc[0].Paths
                // chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

        });
    });

    describe('TC005_PANCAKE_CAKE(BSC)_BUSD(BSC)_BSC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'bsc'
            let appName = 'pancake'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('cake', 'bsc')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('busd', 'bsc')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, appName)
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract.toLowerCase(), contractApp.toLowerCase())

            let Paths = response.data.Result.Networks.bsc[0].Paths
                // chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

        });
    });

    describe('TC006_PANCAKE_BNB(BSC)_DAI(UT)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'bsc'
            let appName = 'pancake'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('bnb', 'bsc')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('dai', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, appName)
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract.toLowerCase(), contractApp.toLowerCase())

            let Paths = response.data.Result.Networks.bsc[0].Paths
                // chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

        });
    });

    describe('TC007_PANCAKE_USDT(UT)_DAI(UT)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'bsc'
            let appName = 'pancake'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('usdt', 'ut')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('dai', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, appName)
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract.toLowerCase(), contractApp.toLowerCase())

            let Paths = response.data.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

        });
    });

    describe('TC008_PANCAKE_BUSD(BSC)_DAI(UT)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'bsc'
            let appName = 'pancake'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('busd', 'bsc')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('dai', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, appName)
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract.toLowerCase(), contractApp.toLowerCase())

            let Paths = response.data.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

        });
    });

    describe('TC009_PANCAKE_ETH(UT)_BUSD(BSC)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'bsc'
            let appName = 'pancake'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('eth', 'ut')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('busd', 'bsc')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, appName)
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract.toLowerCase(), contractApp.toLowerCase())

            let Paths = response.data.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

        });
    });

    describe('TC010_PANCAKE_CAKE(BSC)_BUSD(BSC)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'bsc'
            let appName = 'pancake'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('cake', 'bsc')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('busd', 'bsc')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            chai.assert.equal(response.data.Result.Networks.bsc[0].AppName, appName)
            chai.assert.equal(response.data.Result.Networks.bsc[0].CallContract.toLowerCase(), contractApp.toLowerCase())

            let Paths = response.data.Result.Networks.bsc[0].Paths
            chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
            chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())

        });
    });

    //UNISWAP_PLG

    describe('TC011_UNI_MATIC(PLG)_USDT(UT)_PLG', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'uniswap'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('matic', 'plg')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('usdt', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'plg'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                    // chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                    // chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC012_UNI_MATIC(UT)_USDT(UT)_PLG', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'uniswap'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('matic', 'ut')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('usdt', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'plg'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                    // chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                    // chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC013_UNI_USDT(UT)_DAI(PLG)_PLG', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'uniswap'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('usdt', 'ut')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('dai', 'plg')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'plg'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC014_UNI_WETH(PLG)_USDT(UT)_PLG', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'uniswap'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('weth', 'plg')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('usdt', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'plg'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC015_UNI_UST(PLG)_AAVE(PLG)_PLG', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'uniswap'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('ust', 'plg')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('aave', 'plg')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'plg'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC016_UNI_MATIC(PLG)_USDT(UT)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'uniswap'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('matic', 'plg')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('usdt', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                    // chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                    // chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC017_UNI_MATIC(UT)_USDT(UT)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'uniswap'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('matic', 'ut')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('usdt', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                    // chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                    // chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC018_UNI_USDT(UT)_DAI(PLG)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'uniswap'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('usdt', 'ut')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('dai', 'plg')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC019_UNI_WETH(PLG)_USDT(UT)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'uniswap'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('weth', 'plg')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('usdt', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }
        });
    });

    describe('TC020_UNI_UST(PLG)_AAVE(PLG)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'uniswap'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('ust', 'plg')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('aave', 'plg')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    //CURVE_PLG

    describe('TC021_CURVE_WETH(PLG)_USDT(UT)_PLG', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'curve'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('weth', 'plg')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('usdt', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'plg'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC022_CURVE_DAI(PLG)_USDC(PLG)_PLG', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'curve'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('dai', 'plg')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('usdc', 'plg')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'plg'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC023_CURVE_USDT(UT)_WBTC(PLG)_PLG', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'curve'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('usdt', 'ut')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('wbtc', 'plg')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'plg'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC024_CURVE_USDT(UT)_USDC(UT)_PLG', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'curve'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('usdt', 'ut')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('usdc', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'plg'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC025_CURVE_WETH(PLG)_USDT(UT)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'curve'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('weth', 'plg')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('usdt', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC026_CURVE_DAI(PLG)_USDC(PLG)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'curve'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('dai', 'plg')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('usdc', 'plg')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });

    describe('TC027_CURVE_USDT(UT)_WBTC(PLG)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'curve'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('usdt', 'ut')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('wbtc', 'plg')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(100) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }
        });
    });

    describe('TC028_CURVE_USDT(UT)_USDC(UT)_INC', async() => {
        it('STEP_Estiamte_Swap_Fee', async() => {

            let networkTarget = 'plg'
            let appName = 'curve'
            let contractApp = await getContactAppByAppName(appName, networkTarget)
                //call api
            let sellToken = await selectToken('usdt', 'ut')
            let sellTokenContract = await coinServiceApi.getTokenContract(sellToken, networkTarget)

            let buyToken = await selectToken('usdc', 'ut')
            let buyTokenContract = await coinServiceApi.getTokenContract(buyToken, networkTarget)

            let sellAmount = 1 / await GenAction.randomNumber(10000) + ""
            let network = 'inc'
            let slippage = '0.5'

            let response = await webServiceApi.estimateSwapFee({
                amount: sellAmount,
                fromToken: sellToken,
                network,
                slippage,
                toToken: buyToken
            })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.estimateSwapFeeSchemas, response.data)
            await addingContent.addContent(
                'data',
                response.data
            )

            if (response.data.Result.Networks.plg[0].AppName == appName) {
                chai.assert.equal(response.data.Result.Networks.plg[0].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[0].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[0].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            } else {
                chai.assert.equal(response.data.Result.Networks.plg[1].AppName, appName)
                chai.assert.equal(response.data.Result.Networks.plg[1].CallContract.toLowerCase(), contractApp.toLowerCase())
                let Paths = response.data.Result.Networks.plg[1].Paths
                chai.assert.equal(Paths[0].toLowerCase(), sellTokenContract.toLowerCase())
                chai.assert.equal(Paths[Paths.length - 1].toLowerCase(), buyTokenContract.toLowerCase())
            }

        });
    });


    //negative case



});

const selectToken = async(symbol, network = null) => {
    symbol = symbol ? symbol.toLowerCase() : null
    network = network ? network.toLowerCase() : null


    let listToken = await coinServiceApi.getListToken()
    for (const token of listToken) {
        if (symbol == 'prv') {
            return '0000000000000000000000000000000000000000000000000000000000000004'
        } else {
            let currencyType = await convertNetworkToCurrencyType(symbol, network)
            for (const token of listToken) {
                if (token.Symbol.toLowerCase() == symbol &&
                    token.CurrencyType == currencyType &&
                    token.Verified == true) {
                    return token.TokenID
                }
            }
        }
    }
    return null
}

const convertNetworkToCurrencyType = async(symbol, network) => {
    network = network.toLowerCase()

    switch (network) {
        case 'eth':
            if (symbol == 'eth') {
                return 1
            } else {
                return 3
            }
        case 'bsc':
            if (symbol == 'bnb') {
                return 7
            } else {
                return 8
            }
        case 'tomo':
            return 9
        case 'zil':
            return 10
        case 'xmr':
            return 11
        case 'neo':
            return 12
        case 'dash':
            return 13
        case 'ltc':
            return 14
        case 'doge':
            return 15
        case 'zec':
            return 16
        case 'dot':
            return 17
        case 'plg':
            if (symbol == 'matic') {
                return 19
            } else {
                return 20
            }
        case 'ftm':
            if (symbol == 'ftm') {
                return 12
            } else {
                return 22
            }
        case 'sol':
            return 23, 24
        case 'ut':
            return 25
        default:
            return null;
    }
}

const getContactAppByAppName = async(appName, network) => {
    switch (appName) {
        case 'pancake':
            return '0x95Cd8898917c7216Da0517aAB6A115d7A7b6CA90'
        case 'uniswap':
            if (network == 'plg') {
                return '0xCC8c88e9Dae72fa07aC077933a2E73d146FECdf0'
            } else {
                return '0xe38e54B2d6B1FCdfaAe8B674bF36ca62429fdBDe'
            }
        case 'curve':
            return '0x55B08b7c1eCdc1931660b18Fe2d46Ce7B20613E2'
        default:
            return null;
    }
}