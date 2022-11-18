const { TOKEN, POOL } = require('../../../lib/Incognito/Constants')
const { CoinServiceApi } = require("../../../lib/Incognito/CoinServiceApi");
const GenAction = require("../../../lib/Utils/GenAction");
let chai = require("chai");
let assert = require("chai").assert
const { getLogger } = require("../../../lib/Utils/LoggingManager");
const AddingContent = require("../../../lib/Utils/AddingContent");
const { ACCOUNTS, NODES } = require('../../TestBase');
const logger = getLogger("Pdex")

let coinServiceApi = new CoinServiceApi();
let sender = ACCOUNTS.Incognito.get(2)

describe("[Class] Order", () => {

    describe.skip("TC001_AddOrderSellPRV", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID
        let tokenSellID = TOKEN.PRV
        let tokenBuyID = TOKEN.USDT_UT
        let poolPairID = POOL.PRV_USDT

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })

            amountBuy = await GenAction.randomNumber(1000)
            amountSell = await GenAction.randomNumber(1000)
        }).timeout(60000);

        it("STEP_AddOrder", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: poolPairID,
                tokenIDToSell: tokenSellID,
                tokenIDToBuy: tokenBuyID,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })
            await AddingContent.addContent('tx', tx)

            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: tokenSellID,
                countNumber: 7,
            })
        }).timeout(120000);

        it("STEP_CheckOrderStatus", async() => {
            let response = await NODES.Incognito.rpc.pdexv3_getAddOrderStatus(tx)

            chai.expect(response.data.Result.Status).to.equal(1);
            chai.expect(response.data.Result.OrderID).to.equal(tx);
        }).timeout(120000);

        it("STEP_CheckPdexState", async() => {
            let response = await NODES.Incognito.rpc.pdexv3_getState()
            let orders = response.data.Result.PoolPairs[poolPairID].Orderbook.orders
            let isFind = false
            for (const order of orders) {
                if (order.Id == tx) {
                    isFind = true;
                    nftID = order.NftID
                    chai.expect(order.Id).to.equal(tx);
                    chai.expect(order.Token0Rate).to.equal(amountSell);
                    chai.expect(order.Token1Rate).to.equal(amountBuy);
                    chai.expect(order.Token0Balance).to.equal(amountSell);
                    chai.expect(order.Token1Balance).to.equal(0);
                }
            }
            if (!isFind) {
                chai.expect.fail('Cannot find order book');
            }

        }).timeout(120000);

        it("STEP_VerifyBalanceAfterAdd", async() => {
            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVAfter = balanceAll[tokenSellID]

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - amountSell - 100);

        }).timeout(60000);

        it("STEP_CancelOrder", async() => {
            tx = await sender.useSdk.cancelOrder({
                token1ID: tokenSellID,
                token2ID: tokenBuyID,
                poolPairID: poolPairID,
                orderID: tx,
                nftID: nftID,
            })
            logger.info({ tx })

            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.PRV,
                countNumber: 20,
            })

        }).timeout(120000);

        it("STEP_CheckCancelOrderStatus", async() => {
            let response = await NODES.Incognito.rpc.pdexv3_getWithdrawOrderStatus(tx)

            chai.expect(response.data.Result.Status).to.equal(1);
            chai.expect(response.data.Result.TokenID).to.equal(tokenSellID);
            chai.expect(response.data.Result.Amount).to.equal(amountSell);

        }).timeout(60000);

        it("STEP_VerifyBalanceAfterCancel", async() => {
            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVAfter = balanceAll[tokenSellID]

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - 100 - 100);

        }).timeout(60000);
    });

    describe.skip("TC002_AddOrderBuyPRV", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.ZIL]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })

            amountBuy = await GenAction.randomNumber(1000)
            amountSell = await GenAction.randomNumber(1000)
        }).timeout(60000);

        it("STEP_AddOrder", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: TOKEN.ZIL,
                tokenIDToBuy: TOKEN.PRV,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })
            logger.info({ tx })

            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.PRV,
                countNumber: 20,
            })
        }).timeout(120000);

        it("STEP_CheckOrderStatus", async() => {
            let response = await NODES.Incognito.rpc.pdexv3_getAddOrderStatus(tx)

            chai.expect(response.data.Result.Status).to.equal(1);
            chai.expect(response.data.Result.OrderID).to.equal(tx);
        }).timeout(120000);

        it("STEP_CheckPdexState", async() => {
            let response = await NODES.Incognito.rpc.pdexv3_getState()
            let orders = response.data.Result.PoolPairs[POOL.PRV_ZIL].Orderbook.orders
            let isFind = false
            for (const order of orders) {
                if (order.Id == tx) {
                    isFind = true;
                    nftID = order.NftID
                    chai.expect(order.Id).to.equal(tx);
                    chai.expect(order.Token0Rate).to.equal(amountBuy);
                    chai.expect(order.Token1Rate).to.equal(amountSell);
                    chai.expect(order.Token1Balance).to.equal(amountSell);
                    chai.expect(order.Token0Balance).to.equal(0);
                }
            }
            if (!isFind) {
                chai.expect.fail('Cannot find order book');
            }

        }).timeout(120000);

        it("STEP_VerifyBalanceAfterAdd", async() => {
            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.ZIL]

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - amountSell);

        }).timeout(60000);

        it("STEP_CancelOrder", async() => {
            tx = await sender.useSdk.cancelOrder({
                token1ID: TOKEN.PRV,
                token2ID: TOKEN.ZIL,
                poolPairID: POOL.PRV_USDT,
                orderID: tx,
                nftID: nftID,
            })
            logger.info({ tx })

            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.PRV,
                countNumber: 20,
            })

        }).timeout(120000);

        it("STEP_CheckCancelOrderStatus", async() => {
            let response = await NODES.Incognito.rpc.pdexv3_getWithdrawOrderStatus(tx)

            chai.expect(response.data.Result.Status).to.equal(1);
            chai.expect(response.data.Result.TokenID).to.equal(TOKEN.ZIL);
            chai.expect(response.data.Result.Amount).to.equal(amountSell);

        }).timeout(60000);

        it("STEP_VerifyBalanceAfterCancel", async() => {
            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.ZIL]

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore);

        }).timeout(60000);
    });

    describe("TC003_AddOrderWithIncorrectTokenBuy", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            amountBuy = await GenAction.randomNumber(1000)
            amountSell = await GenAction.randomNumber(1000)
        }).timeout(60000);

        it("STEP_AddOrderWithTokenBuyIsOtherToken", async() => {

            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: TOKEN.LINK_UT,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })

            chai.expect(tx).to.contain(`Validating "createAndSendOrderRequestTx-tokenIDToBuy" failed: Required. Found undefined (type of undefined)`)

        }).timeout(120000);

        it("STEP_AddOrderWithTokenBuyIsNull", async() => {

            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: null,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })

            chai.expect(tx).to.contain(`Error: Validating "createAndSendOrderRequestTx-tokenIDToBuy" failed: Required. Found null (type of object)`)

        }).timeout(120000);

        it("STEP_AddOrderWithTokenBuyIsNumber", async() => {

            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: 123,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })

            chai.expect(tx).to.contain(`Error: Validating "createAndSendOrderRequestTx-tokenIDToBuy" failed: Must be string. Found 123 (type of number)`)

        }).timeout(120000);

        it("STEP_AddOrderWithTokenBuyNotExist", async() => {

            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: "b35756452dc1fa1260513fa121c20c2b516a8645f8d496fa4235274dac011111",
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })

            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.PRV,
                countNumber: 20,
            })
            let response = await NODES.Incognito.rpc.pdexv3_getAddOrderStatus(tx)

            chai.expect(response.data.Result.Status).to.equal(0)
            chai.expect(response.data.Result.OrderID).to.equal("")

        }).timeout(120000);


    });

    describe("TC004_AddOrderWithIncorrectTokenSell", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            amountBuy = await GenAction.randomNumber(1000)
            amountSell = await GenAction.randomNumber(1000)
        }).timeout(60000);

        it("STEP_AddOrderWithTokenSellIsOtherToken", async() => {

            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: TOKEN.LINK_UT,
                tokenIDToBuy: TOKEN.ZIL,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })

            chai.expect(tx).to.contain(`Validating "createAndSendOrderRequestTx-tokenIDToSell" failed: Required. Found undefined (type of undefined)`)

        }).timeout(120000);

        it("STEP_AddOrderWithTokenSellIsNull", async() => {

            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: null,
                tokenIDToBuy: TOKEN.PRV,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })

            chai.expect(tx).to.contain(`Error: Validating "createAndSendOrderRequestTx-tokenIDToSell" failed: Required. Found null (type of object)`)

        }).timeout(120000);

        it("STEP_AddOrderWithTokenSellIsNumber", async() => {

            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: 123,
                tokenIDToBuy: TOKEN.ZIL,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })

            chai.expect(tx).to.contain(`Error: Validating "createAndSendOrderRequestTx-tokenIDToSell" failed: Must be string. Found 123 (type of number)`)

        }).timeout(120000);

        it("STEP_AddOrderWithTokenSellNotExist", async() => {

            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: 'b35756452dc1fa1260513fa121c20c2b516a8645f8d496fa4235274dac011111',
                tokenIDToBuy: TOKEN.USDT_UT,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })


            chai.expect(tx).to.contain(`Error while preparing inputs Not enough coin to spend`)

        }).timeout(120000);
    });

    describe("TC005_AddOrderWithInvalidSellAmount", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            amountBuy = await GenAction.randomNumber(1000)
            amountSell = await GenAction.randomNumber(1000)
        }).timeout(60000);

        it("STEP_AddOrderSellAmountNull", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: TOKEN.USDT_UT,
                sellAmount: null,
                buyAmount: amountBuy,
            })
            chai.expect(tx).to.contain(`strconv.ParseUint: parsing "null": invalid syntax`)

        }).timeout(120000);

        it("STEP_AddOrderSellAmountEqual0", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: TOKEN.USDT_UT,
                sellAmount: 0,
                buyAmount: amountBuy,
            })
            let response = await coinServiceApi.gettxstatus({ tx })
            chai.expect(response.data.ErrMsg).to.contain(`Reject not sansity tx transaction's sansity ${tx} is error`)
            chai.expect(response.data.ErrMsg).to.contain(`SellAmount cannot be 0`)
        }).timeout(120000);

        it("STEP_AddOrderSellAmountIsString", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: TOKEN.USDT_UT,
                sellAmount: 'abc',
                buyAmount: amountBuy,
            })
            chai.expect(tx).to.contain(`strconv.ParseUint: parsing "abc": invalid syntax`)

        }).timeout(120000);
    });

    describe("TC006_AddOrderWithInvalidBuyAmount", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            amountBuy = await GenAction.randomNumber(1000)
            amountSell = await GenAction.randomNumber(1000)
        }).timeout(60000);

        it("STEP_AddOrderBuyAmountNull", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: TOKEN.USDT_UT,
                sellAmount: amountSell,
                buyAmount: null,
            })
            chai.expect(tx).to.contain(`strconv.ParseUint: parsing "null": invalid syntax`)

        }).timeout(120000);

        it("STEP_AddOrderBuyAmountEqual0", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: TOKEN.USDT_UT,
                sellAmount: amountSell,
                buyAmount: 0,
            })
            let response = await coinServiceApi.gettxstatus({ tx })
            chai.expect(response.data.ErrMsg).to.contain(`Reject not sansity tx transaction's sansity ${tx} is error`)
            chai.expect(response.data.ErrMsg).to.contain(`MinAcceptableAmount cannot be 0`)


        }).timeout(120000);

        it("STEP_AddOrderBuyAmountIsString", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: TOKEN.USDT_UT,
                sellAmount: amountSell,
                buyAmount: 'abc',
            })
            chai.expect(tx).to.contain(`strconv.ParseUint: parsing "abc": invalid syntax`)

        }).timeout(120000);
    });

    describe("TC008_AddOrderThanMoreBalance", async() => {
        let amountBuy = 0
        let tx
        let tokenSellID = TOKEN.PRV
        let tokenBuyID = TOKEN.USDT_UT

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balanceTokenSell = balanceAll[tokenSellID]

            amountBuy = await GenAction.randomNumber(1000)
        }).timeout(60000);

        it("STEP_AddOrderThanMoreBalance", async() => {

            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_USDT,
                tokenIDToSell: tokenSellID,
                tokenIDToBuy: tokenBuyID,
                sellAmount: sender.balanceTokenSell + 10000,
                buyAmount: amountBuy,
            })
            chai.expect(tx).to.contain(`WEB_JS_ERROR: Error while preparing inputs`)
        }).timeout(120000);
    });

    describe("TC009_AddOrderNotExistPoolID", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let tokenSellID = TOKEN.PRV
        let tokenBuyID = TOKEN.USDT_UT

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balanceTokenSell = balanceAll[tokenSellID]

            amountBuy = await GenAction.randomNumber(1000)
            amountSell = await GenAction.randomNumber(1000)
        }).timeout(60000);

        it("STEP_AddOrderAndVerify", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: 'abc-def',
                tokenIDToSell: tokenSellID,
                tokenIDToBuy: tokenBuyID,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })
            let response = await coinServiceApi.gettxstatus({ tx })
            chai.expect(response.data.ErrMsg).to.contain(`Reject invalid metadata with blockchain validate metadata of tx ${tx}`)
            chai.expect(response.data.ErrMsg).to.contain(`error Not found poolPairID`)
        }).timeout(120000);
    });

    describe("TC010_CancelOrderWithNftInvalid", async() => {

        let pendingOrderObject

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let nftData = await sender.useSdk.getNftData()

            for (const nft of nftData) {
                if (nft.realAmount > 0 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit({ ID: [nft.nftToken] })
                    if (response.data.Result.length > 0) {
                        pendingOrderObject = response.data.Result[0]
                        break;
                    }
                }
            }
        }).timeout(60000);

        it("STEP_CancelOrderWithNftIdNull", async() => {
            if (!pendingOrderObject) return null
            tx = await sender.useSdk.cancelOrder({
                token1ID: pendingOrderObject.SellTokenID,
                token2ID: pendingOrderObject.BuyTokenID,
                poolPairID: pendingOrderObject.PoolID,
                orderID: pendingOrderObject.RequestTx,
                nftID: null
            })
            chai.expect(tx).to.contain(`Validating "createAndSendWithdrawOrderRequestTx-nftID" failed: Required. Found null (type of object)`)

        }).timeout(120000);
    });

    describe("TC011_CancelOrderIdNotExist", async() => {

        let pendingOrderObject

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let nftData = await sender.useSdk.getNftData()

            for (const nft of nftData) {
                if (nft.realAmount > 0 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit({ ID: [nft.nftToken] })
                    if (response.data.Result.length > 0) {
                        pendingOrderObject = response.data.Result[0]
                        break;
                    }
                }
            }
        }).timeout(60000);

        it("STEP_CancelOrderAndVerify", async() => {

            if (!pendingOrderObject) return null
            tx = await sender.useSdk.cancelOrder({
                token1ID: pendingOrderObject.SellTokenID,
                token2ID: pendingOrderObject.BuyTokenID,
                poolPairID: pendingOrderObject.PoolID,
                orderID: "abc-desf",
                nftID: pendingOrderObject.NFTID
            })

            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({ tokenID: TOKEN.PRV })
            await GenAction.sleep(20000)

            let response = await NODES.Incognito.rpc.pdexv3_getWithdrawOrderStatus(tx)
            chai.expect(response.data.Result.Status).to.equal(0)
            chai.expect(response.data.Result.TokenID).to.equal("0000000000000000000000000000000000000000000000000000000000000000")
            chai.expect(response.data.Result.Amount).to.equal(0)


        }).timeout(120000);
    });

    describe("TC012_CancelOrderWithPoolIDIncorrect", async() => {

        let pendingOrderObject

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let nftData = await sender.useSdk.getNftData()

            for (const nft of nftData) {
                if (nft.realAmount > 0 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit({ ID: [nft.nftToken] })
                    if (response.data.Result.length > 0) {
                        pendingOrderObject = response.data.Result[0]
                        break;
                    }
                }
            }
        }).timeout(60000);

        it("STEP_CancelOrderAndVerify", async() => {

            if (!pendingOrderObject) return null
            tx = await sender.useSdk.cancelOrder({
                token1ID: pendingOrderObject.SellTokenID,
                token2ID: pendingOrderObject.BuyTokenID,
                poolPairID: "abc-desf",
                orderID: pendingOrderObject.RequestTx,
                nftID: pendingOrderObject.NFTID
            })
            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({ tokenID: TOKEN.PRV })
            await GenAction.sleep(20000)

            let response = await NODES.Incognito.rpc.pdexv3_getWithdrawOrderStatus(tx)
            chai.expect(response.data.Result.Status).to.equal(0)
            chai.expect(response.data.Result.TokenID).to.equal("0000000000000000000000000000000000000000000000000000000000000000")
            chai.expect(response.data.Result.Amount).to.equal(0)
        }).timeout(120000);
    });

    describe("TC013_CancelOrderWithIncorrectToken1ID", async() => {

        let pendingOrderObject

        it("STEP_InitData", async() => {

            await sender.initSdkInstance();
            await sender.useSdk.clearCacheBalance(sender.otaPrivateK)

            let nftData = await sender.useSdk.getNftData()

            for (const nft of nftData) {
                if (nft.realAmount > 0 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit({ ID: [nft.nftToken] })
                    if (response.data.Result.length > 0) {
                        pendingOrderObject = response.data.Result[0]
                        break;
                    }
                }
            }
        }).timeout(60000);

        it("STEP_CancelOrderAndVerify", async() => {
            if (!pendingOrderObject) return null

            tx = await sender.useSdk.cancelOrder({
                token1ID: TOKEN.BTC,
                token2ID: pendingOrderObject.BuyTokenID,
                poolPairID: pendingOrderObject.PoolID,
                orderID: pendingOrderObject.RequestTx,
                nftID: pendingOrderObject.NFTID
            })
            await AddingContent.addContent("tx", tx)

            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({ tokenID: TOKEN.PRV })
            await GenAction.sleep(20000)

            let response = await NODES.Incognito.rpc.pdexv3_getWithdrawOrderStatus(tx)
            assert.equal(response.data.Result.Status, 0, await AddingContent.addContent(response.data))
            assert.equal(response.data.Result.TokenID, "0000000000000000000000000000000000000000000000000000000000000000")
            assert.equal(response.data.Result.Amount, 0)
        }).timeout(120000);
    });

    describe("TC014_CancelOrderWithIncorrectToken2ID", async() => {

        let pendingOrderObject

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            await sender.useSdk.clearCacheBalance()

            let nftData = await sender.useSdk.getNftData()
            console.log('hoanh nftData', nftData);

            for (const nft of nftData) {
                if (nft.realAmount > 0 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit({ ID: [nft.nftToken] })
                    if (response.data.Result.length > 0) {
                        pendingOrderObject = response.data.Result[0]
                        break;
                    }
                }
            }
        }).timeout(60000);

        it("STEP_CancelOrderAndVerify", async() => {
            if (!pendingOrderObject) return null

            tx = await sender.useSdk.cancelOrder({
                token1ID: pendingOrderObject.tokenSellID,
                token2ID: TOKEN.BTC,
                poolPairID: pendingOrderObject.PoolID,
                orderID: pendingOrderObject.RequestTx,
                nftID: pendingOrderObject.NFTID
            })
            await AddingContent.addContent("tx", tx)

            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({ tokenID: TOKEN.PRV })
            await GenAction.sleep(20000)

            let response = await NODES.Incognito.rpc.pdexv3_getWithdrawOrderStatus(tx)
            assert.equal(response.data.Result.Status, 0, await AddingContent.addContent(response.data))
            assert.equal(response.data.Result.TokenID, "0000000000000000000000000000000000000000000000000000000000000000")
            assert.equal(response.data.Result.Amount, 0)
        }).timeout(120000);
    });

    describe("TC015_CancelOrderIDNotBelongWithOrder", async() => {

        let pendingOrderObject1
        let pendingOrderObject2

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            await sender.useSdk.clearCacheBalance()

            let nftData = await sender.useSdk.getNftData()
            console.log('hoanh nftData', nftData);

            for (const nft of nftData) {
                if (nft.realAmount > 0 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit({ ID: [nft.nftToken] })
                    if (response.data.Result.length > 0) {
                        pendingOrderObject1 = response.data.Result[0]
                        pendingOrderObject2 = response.data.Result[1]
                        break;
                    }
                }
            }
        }).timeout(60000);

        it("STEP_CancelOrderAndVerify", async() => {
            if (!pendingOrderObject1 || !pendingOrderObject2) return null

            tx = await sender.useSdk.cancelOrder({
                token1ID: pendingOrderObject1.tokenSellID,
                token2ID: pendingOrderObject1.BuyTokenID,
                poolPairID: pendingOrderObject1.PoolID,
                orderID: pendingOrderObject2.RequestTx,
                nftID: pendingOrderObject1.NFTID
            })

            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({ tokenID: TOKEN.PRV })
            await GenAction.sleep(20000)

            let response = await NODES.Incognito.rpc.pdexv3_getWithdrawOrderStatus(tx)
            assert.equal(response.data.Result.Status, 0, await AddingContent.addContent(response.data))
            assert.equal(response.data.Result.TokenID, "0000000000000000000000000000000000000000000000000000000000000000")
            assert.equal(response.data.Result.Amount, 0)
        }).timeout(120000);
    });

    describe.skip("TC016_CancelPoolIDNotBelongWithOrder", async() => {

        let pendingOrderObject1
        let pendingOrderObject2

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let nftData = await sender.useSdk.getNftData()

            for (const nft of nftData) {
                if (nft.realAmount > 0 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit({ ID: [nft.nftToken] })
                    if (response.data.Result.length > 0) {
                        pendingOrderObject1 = response.data.Result[0]
                        pendingOrderObject2 = response.data.Result[1]
                        break;
                    }
                }
            }
        }).timeout(60000);

        it("STEP_CancelOrderAndVerify", async() => {

            let param = {
                token1ID: pendingOrderObject.tokenSellID,
                token2ID: TOKEN.BTC,
                poolPairID: pendingOrderObject.PoolID,
                orderID: pendingOrderObject.RequestTx,
                nftID: pendingOrderObject.NFTID
            }
            tx = await sender.useSdk.cancelOrder({
                token1ID: pendingOrderObject1.tokenSellID,
                token2ID: pendingOrderObject1.BuyTokenID,
                poolPairID: pendingOrderObject2.PoolID,
                orderID: pendingOrderObject1.RequestTx,
                nftID: pendingOrderObject1.NFTID
            })
            logger.info({ tx })
        }).timeout(120000);
    });


});