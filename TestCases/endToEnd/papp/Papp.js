const { TOKEN, POOL } = require('../../../lib/Incognito/Constants')
const GenAction = require("../../../lib/Utils/GenAction");
const { getLogger } = require("../../../lib/Utils/LoggingManager");
const { CoinServiceApi } = require('../../../lib/Incognito/CoinServiceApi');
const { WebServiceApi } = require('../../../lib/Incognito/WebServiceApi');
const logger = getLogger("Pdex")
const { ACCOUNTS, NODES } = require('../../TestBase');
const AddingContent = require('../../../lib/Utils/AddingContent');
const config = require('../../../config.json');
const { send } = require('process');
const assert = require("chai").assert;


const INCOGNITO_NETWORK = 0;
const ETH_NETWORK = 1;
const BSC_NETWORK = 2;
const POLYGON_NETWORK = 3;
const FANTOM_NETWORK = 4;
const AURORA_NETWORK = 5;
const AVALANCHE_NETWORK = 6;
const NEAR_NETWORK = 7; // TO DO, change after

let coinServiceApi = new CoinServiceApi()
let webServiceApi = new WebServiceApi()
let sender = ACCOUNTS.Incognito.get(2)

describe("[Class] Papp", () => {
    describe("TC001_TradePancakeReDeposit", async () => {
        let ammountSell = 0
        let estimateFeeObject
        let tx
        let sellTokenID = TOKEN.USDT_UT
        let buyTokenID = TOKEN.DAI_UT
        let networks = 'bsc'

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();

            //getBalance
            let balanceAll = await sender.useSdk.getBalanceAll()
            AddingContent.addContent('balanceAllBefore', balanceAll)

            let randomNumber = await GenAction.randomNumber(10000)
            let sellTokenDecimal = await coinServiceApi.getTokenDecimalPow(sellTokenID)
            ammountSell = randomNumber / sellTokenDecimal + ""
        }).timeout(60000);

        it("STEP_EstimateTrade", async () => {
            let response = await webServiceApi.estimateSwapFee({
                amount: ammountSell,
                fromToken: sellTokenID,
                network: "inc",
                slippage: "0.5",
                toToken: buyTokenID
            })

            estimateFeeObject = response.data.Result.Networks[networks][0]
            AddingContent.addContent('estimateFeeObject', estimateFeeObject)
        }).timeout(120000);

        it("STEP_SwapTx", async () => {
            if (!estimateFeeObject) return true
            let param = {
                sellTokenID,
                senderFeeAddressShardID: estimateFeeObject.FeeAddressShardID,

                feeReceiverAddress: estimateFeeObject.FeeAddress,
                feeAmount: estimateFeeObject.Fee[0].amount + "",
                feeTokenID: estimateFeeObject.Fee[0].tokenid,

                // data metadata
                sellAmount: estimateFeeObject.AmountIn * await coinServiceApi.getTokenDecimalPow(sellTokenID),
                callContract: estimateFeeObject.CallContract,
                callData: estimateFeeObject.Calldata,
                exchangeNetworkID: BSC_NETWORK,
                sellChildTokenID: (await coinServiceApi.getChildTokenInfo(sellTokenID, 'bsc')).TokenID,
                buyContractID: await coinServiceApi.getTokenContract(buyTokenID, 'bsc'),
                // remoteAddress, case reDeposit = 0x0000000000000000000000000000000000000000
                // send out EVN use user address
                remoteAddress: "0x0000000000000000000000000000000000000000",
                buyTokenID,
                sellAmountText: "1",
                buyAmountText: "1"
            }

            AddingContent.addContent('param', param)


            let tx = await sender.useSdk.swapPapp({
                sellTokenID,
                senderFeeAddressShardID: estimateFeeObject.FeeAddressShardID,

                feeReceiverAddress: estimateFeeObject.FeeAddress,
                feeAmount: estimateFeeObject.Fee[0].amount + "",
                feeTokenID: estimateFeeObject.Fee[0].tokenid,
                sellAmount: estimateFeeObject.AmountIn * await coinServiceApi.getTokenDecimalPow(sellTokenID),
                callContract: estimateFeeObject.CallContract,
                callData: estimateFeeObject.Calldata,
                exchangeNetworkID: BSC_NETWORK,
                sellChildTokenID: (await coinServiceApi.getChildTokenInfo(sellTokenID, 'bsc')).TokenID,
                buyContractID: await coinServiceApi.getTokenContract(buyTokenID, 'bsc'),
                remoteAddress: "0x0000000000000000000000000000000000000000",
                buyTokenID,
                sellAmountText: "1",
                buyAmountText: "1"
            })
            AddingContent.addContent('tx', tx)
            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: sellTokenID,
            })

        }).timeout(160000);

        //webbase check status tx
        //EVM check tx swap
        //check tx bridge shield
        //check tx redeposit
        //check balance


    });

    describe.only("TC001_TradeUniswapReDeposit", async () => {
        let ammountSell = 0
        let estimateFeeObject
        let tx = '9130404f614c76d470523f348340977ad2ce08f7620e0ab2860f579d8bf0310a'
        let sellTokenID = TOKEN.USDT_UT
        let buyTokenID = TOKEN.USDC_UT
        let networks = 'plg'

        it("STEP_InitData", async () => {
            await sender.initSdkInstance();

            //getBalance
            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balanceAllBefore = balanceAll
            AddingContent.addContent('sender.balanceAllBefore', sender.balanceAllBefore)

            let randomNumber = await GenAction.randomNumber(1000000)
            let sellTokenDecimal = await coinServiceApi.getTokenDecimalPow(sellTokenID)
            ammountSell = randomNumber / sellTokenDecimal + ""
        }).timeout(config.timeoutApi);

        it("STEP_EstimateTrade", async () => {
            let response = await webServiceApi.estimateSwapFee({
                amount: ammountSell,
                fromToken: sellTokenID,
                network: "inc",
                slippage: "0.5",
                toToken: buyTokenID
            })
            estimateFeeObject = response.data.Result.Networks[networks][0]
            AddingContent.addContent('estimateFeeObject', estimateFeeObject)
        }).timeout(config.timeoutApi);

        it.skip("STEP_SwapTx", async () => {
            if (!estimateFeeObject) return true
            let param = {
                sellTokenID,
                senderFeeAddressShardID: estimateFeeObject.FeeAddressShardID,
                feeReceiverAddress: estimateFeeObject.FeeAddress,
                feeAmount: estimateFeeObject.Fee[0].amount + "",
                feeTokenID: estimateFeeObject.Fee[0].tokenid,
                sellAmount: Math.round(estimateFeeObject.AmountIn * await coinServiceApi.getTokenDecimalPow(sellTokenID)),
                callContract: estimateFeeObject.CallContract,
                callData: estimateFeeObject.Calldata,
                exchangeNetworkID: POLYGON_NETWORK,
                sellChildTokenID: (await coinServiceApi.getChildTokenInfo(sellTokenID, networks)).TokenID,
                buyContractID: await coinServiceApi.getTokenContract(buyTokenID, networks),
                remoteAddress: "0x0000000000000000000000000000000000000000",
                buyTokenID,
            }
            AddingContent.addContent('param', param)

            let tx = await sender.useSdk.swapPapp(param)

            AddingContent.addContent('tx', tx)
            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: sellTokenID,
            })

        }).timeout(config.timeoutTx);

        it("STEP_VerifyTxStatusApi", async () => {
            if (!estimateFeeObject) return true
            let response

            while (true) {
                response = await webServiceApi.swapStatus({ listTx: [tx] })
                if (response && response.data.Result && response.data.Result[tx].network_result[0].swap_tx_status) {
                    let network_result = response.data.Result[tx].network_result[0]
                    assert.equal(network_result.is_redeposit, true)
                    assert.equal(network_result.network, networks)
                    assert.equal(network_result.redeposit_status, "success")
                    assert.equal(network_result.swap_tx_status, "success")

                    let redeposit_inctx = network_result.redeposit_inctx
                    await NODES.Incognito.getTransactionByHashRpc(redeposit_inctx)

                    let swap_tx = network_result.swap_tx
                    //TODO : verify on EVM

                    let swap_detail = response.data.Result[tx].swap_detail
                    assert.equal(swap_detail.token_in, sellTokenID)
                    assert.equal(swap_detail.token_out, buyTokenID)
                    break
                }
            }

        }).timeout(720000);

        it("STEP_VerifyBalance", async () => {
            if (!estimateFeeObject) return true

            let actualSellAmount = Math.round(estimateFeeObject.AmountIn * await coinServiceApi.getTokenDecimalPow(sellTokenID))
            let fee = estimateFeeObject.Fee[0].amount

            let response = await webServiceApi.swapStatus({ listTx: [tx] })
            let actualBuyTokenReceive = (response.data.Result[tx].swap_detail.in_amount + response.data.Result[tx].swap_detail.reward) * await coinServiceApi.getTokenDecimalPow(buyTokenID)

            AddingContent.addContent('info', actualSellAmount, fee, actualBuyTokenReceive)

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllAfter = balanceAll
            AddingContent.addContent('sender.balanceAllAfter', sender.balanceAllAfter)

            assert.equal(sender.balanceAllAfter[TOKEN.PRV], sender.balanceAllBefore[TOKEN.PRV] - 100)
            assert.equal(sender.balanceAllAfter[sellTokenID], sender.balanceAllBefore[sellTokenID] - actualSellAmount - fee)
            assert.equal(sender.balanceAllAfter[buyTokenID], sender.balanceAllBefore[sellTokenID] + actualBuyTokenReceive)

        }).timeout(config.timeoutTx);
    });
});