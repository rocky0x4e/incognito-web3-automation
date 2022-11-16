const { TOKEN, POOL } = require('../../../lib/Incognito/Constants')
const GenAction = require("../../../lib/Utils/GenAction");
const { getLogger } = require("../../../lib/Utils/LoggingManager");
const { CoinServiceApi } = require('../../../lib/Incognito/CoinServiceApi');
const { WebServiceApi } = require('../../../lib/Incognito/WebServiceApi');
const logger = getLogger("Pdex")
const { ACCOUNTS, NODES } = require('../../TestBase');

let coinServiceApi = new CoinServiceApi()
let webServiceApi = new WebServiceApi()
let sender = ACCOUNTS.Incognito.get(2)

describe("[Class] Papp", () => {
    describe.skip("TC001_AddExistLiquidity", async() => {
        let ammountSell = 0
        let estimateFeeObject
        let tx
        let sellTokenID
        let buyTokenID
        let networks = 'bsc'

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            //getBalance
            let balanceAll = await sender.useCli.getBalanceAll()

            sellTokenID = TOKEN.USDT_UT
            buyTokenID = TOKEN.DAI_UT
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]
            sender.balanceUSDTBefore = balanceAll[sellTokenID]
            sender.balanceDAIBefore = balanceAll[buyTokenID]
            console.log("hoanh sender.balanceBefore", balancePRVBefore, sender.balanceUSDTBefore, sender.balanceDAIBefore);

            ammountSell = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_EstimateTrade", async() => {
            let response = (await webServiceApi.estimateSwapFee({
                amount: ammountSell,
                fromToken: sellTokenID,
                network: "inc",
                slippage: "0.5",
                toToken: buyTokenID
            }))

            estimateFeeObject = response.data.Result.Networks[networks][0]
        }).timeout(120000);


        it("STEP_CreateTx", async() => {
            let tx = sender.useSdk.swapPapp({
                sellTokenID: sellTokenID,
                senderFeeAddressShardID, // ???

                feeReceiverAddress, // ???
                feeAmount: estimateFeeObject.Fee.amount,
                feeTokenID: estimateFeeObject.Fee.tokenid,

                // data metadata
                sellAmount: ammountSell,
                callContract, // proxy route
                callData,
                exchangeNetworkID, // networkID exchange, exp: ETH = 1
                sellChildTokenID,
                buyContractID,
                // remoteAddress, case reDeposit = 0x0000000000000000000000000000000000000000
                // send out EVN use user address
                remoteAddress,
                buyTokenID,
                sellAmountText,
                buyAmountText
            })
        }).timeout(60000);


        it("STEP_VerifyOutchain", async() => {
            //TODO
        }).timeout(60000);

        it("STEP_VerifySwapTxStatus", async() => {
            //TODO
        }).timeout(60000);

        it("STEP_VerifyBalance", async() => {
            //TODO
        }).timeout(60000);
    });


});