const { TOKEN, POOL } = require('../../../lib/Incognito/Constants')
const { CoinServiceApi } = require("../../../lib/Incognito/CoinServiceApi");
const GenAction = require("../../../lib/Utils/GenAction");
let chai = require("chai");
const { getLogger } = require("../../../lib/Utils/LoggingManager");
const { ACCOUNTS, NODES } = require('../../TestBase');
const logger = getLogger("Pdex")

let coinServiceApi = new CoinServiceApi();
let sender = ACCOUNTS.Incognito.get(2)

describe("[Class] Order", () => {

    describe("TC001_AddOrderSellPRV", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })

            amountBuy = await GenAction.randomNumber(100000)
            amountSell = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_AddOrder", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_ZIL,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: TOKEN.ZIL,
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
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.PRV]

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - amountSell - 100);

        }).timeout(60000);

        it("STEP_CancelOrder", async() => {
            tx = await sender.useSdk.cancelOrder({
                token1ID: TOKEN.PRV,
                token2ID: TOKEN.ZIL,
                poolPairID: POOL.PRV_ZIL,
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
            chai.expect(response.data.Result.TokenID).to.equal(TOKEN.PRV);
            chai.expect(response.data.Result.Amount).to.equal(amountSell);

        }).timeout(60000);

        it("STEP_VerifyBalanceAfterCancel", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.PRV]

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - 100 - 100);

        }).timeout(60000);
    });

    describe("TC002_AddOrderBuyPRV", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.ZIL]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })

            amountBuy = await GenAction.randomNumber(100000)
            amountSell = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_AddOrder", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_ZIL,
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
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.ZIL]

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - amountSell);

        }).timeout(60000);

        it("STEP_CancelOrder", async() => {
            tx = await sender.useSdk.cancelOrder({
                token1ID: TOKEN.PRV,
                token2ID: TOKEN.ZIL,
                poolPairID: POOL.PRV_ZIL,
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
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.ZIL]

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore);

        }).timeout(60000);
    });

    describe.only("TC003_AddOrderWithIncorrectTokenBuy", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            amountBuy = await GenAction.randomNumber(100000)
            amountSell = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_AddOrderWithTokenBuyIsOtherToken", async() => {

            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_ZIL,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: TOKEN.LINK_UT,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })

            chai.expect(tx).to.contain(`Validating "createAndSendOrderRequestTx-tokenIDToBuy" failed: Required. Found undefined (type of undefined)`)

        }).timeout(120000);

        it("STEP_AddOrderWithTokenBuyIsNull", async() => {

            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_ZIL,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: null,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })

            chai.expect(tx).to.contain(`Error: Validating "createAndSendOrderRequestTx-tokenIDToBuy" failed: Required. Found null (type of object)`)

        }).timeout(120000);

        it("STEP_AddOrderWithTokenBuyIsNumber", async() => {

            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_ZIL,
                tokenIDToSell: TOKEN.PRV,
                tokenIDToBuy: 123,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })

            chai.expect(tx).to.contain(`Error: Validating "createAndSendOrderRequestTx-tokenIDToBuy" failed: Must be string. Found 123 (type of number)`)

        }).timeout(120000);


    });

    describe("TC004_AddOrderWithIncorrectTokenSell", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })

            amountBuy = await GenAction.randomNumber(100000)
            amountSell = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_AddOrder", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_ZIL,
                tokenIDToSell: TOKEN.LINK_UT,
                tokenIDToBuy: TOKEN.ZIL,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })
            logger.info({ tx })
        }).timeout(120000);
    });

    describe("TC005_AddOrderWithInvalidSellAmount", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })

            amountBuy = await GenAction.randomNumber(100000)
            amountSell = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_AddOrder", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_ZIL,
                tokenIDToSell: TOKEN.LINK_UT,
                tokenIDToBuy: TOKEN.ZIL,
                sellAmount: null,
                buyAmount: amountBuy,
            })
            logger.info({ tx })
        }).timeout(120000);
    });

    describe("TC006_AddOrderWithInvalidBuyAmount", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })

            amountBuy = await GenAction.randomNumber(100000)
            amountSell = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_AddOrder", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_ZIL,
                tokenIDToSell: TOKEN.LINK_UT,
                tokenIDToBuy: TOKEN.ZIL,
                sellAmount: amountSell,
                buyAmount: null,
            })
            logger.info({ tx })
        }).timeout(120000);
    });

    describe("TC007_AddOrderWithTokenNotExit", async() => {
        let amountBuy = 0
        let amountSell = 0
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useSdk.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })

            amountBuy = await GenAction.randomNumber(100000)
            amountSell = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_AddOrder", async() => {
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.PRV_ZIL,
                tokenIDToSell: "b35756452dc1fa1260513fa121c20c2b516a8645f8d496fa4235274dac011111",
                tokenIDToBuy: TOKEN.ZIL,
                sellAmount: amountSell,
                buyAmount: amountBuy,
            })
            logger.info({ tx })
        }).timeout(120000);


    });

    describe("TC008_AddOrderThanMoreBalance", async() => {
        let amountBuy = 0
        let tx
        let nftID
        let tokenSellID = TOKEN.MATIC_UT
        let tokenBuyID = TOKEN.USDT_UT

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useSdk.getBalanceAll()
            let nftData = await sender.useSdk.getNftData()
            console.log('hoanh nftData', nftData);
            sender.balanceTokenSell = balanceAll[tokenSellID]

            console.log('hoanh, sender.balanceTokenSell', sender.balanceTokenSell);

            amountBuy = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_AddOrder", async() => {

            let param = {
                poolPairID: POOL.MATIC_USDT,
                tokenIDToSell: tokenSellID,
                tokenIDToBuy: tokenBuyID,
                sellAmount: sender.balanceTokenSell + 10000,
                buyAmount: amountBuy,
            }
            console.log('hoanh param', param);
            tx = await sender.useSdk.addOrder({
                poolPairID: POOL.MATIC_USDT,
                tokenIDToSell: tokenSellID,
                tokenIDToBuy: tokenBuyID,
                sellAmount: sender.balanceTokenSell + 10000,
                buyAmount: amountBuy,
            })
            logger.info({ tx })
        }).timeout(120000);


    });

    describe("TC009_AddOrderNotExistPoolID", async() => {
        let amountBuy = 0
        let tx
        let nftID
        let tokenSellID = TOKEN.MATIC_UT
        let tokenBuyID = TOKEN.USDT_UT

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let balanceAll = await sender.useSdk.getBalanceAll()
            let nftData = await sender.useSdk.getNftData()
            console.log('hoanh nftData', nftData);

            sender.balanceTokenSell = balanceAll[tokenSellID]
            console.log('hoanh, sender.balanceTokenSell', sender.balanceTokenSell);

            amountBuy = await GenAction.randomNumber(100000)
        }).timeout(60000);

        it("STEP_AddOrderAndVerify", async() => {

            let param = {
                poolPairID: 'abc-def',
                tokenIDToSell: tokenSellID,
                tokenIDToBuy: tokenBuyID,
                sellAmount: sender.balanceTokenSell + 10000,
                buyAmount: amountBuy,
            }
            console.log('hoanh param', param);
            tx = await sender.useSdk.addOrder({
                poolPairID: 'abc-def',
                tokenIDToSell: tokenSellID,
                tokenIDToBuy: tokenBuyID,
                sellAmount: sender.balanceTokenSell + 10000,
                buyAmount: amountBuy,
            })
            logger.info({ tx })
        }).timeout(120000);


    });

    describe("TC010_CancelOrderWithNftInvalid", async() => {

        let pendingOrderObject

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let nftData = await sender.useSdk.getNftData()
            console.log('hoanh nftData', nftData);

            for (const nft of nftData) {
                if (nft.realAmount == 1 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit()
                    if (response.data.Result.length > 0) {
                        pendingOrderObject = response.data.Result[0]
                        break;
                    }
                }
            }
        }).timeout(60000);

        it("STEP_CancelOrderAndVerify", async() => {

            let param = {
                token1ID: pendingOrderObject.SellTokenID,
                token2ID: pendingOrderObject.BuyTokenID,
                poolPairID: pendingOrderObject.PoolID,
                orderID: pendingOrderObject.RequestTx,
                nftID: null
            }
            console.log('hoanh param', param);
            tx = await sender.useSdk.cancelOrder({
                token1ID: pendingOrderObject.SellTokenID,
                token2ID: pendingOrderObject.BuyTokenID,
                poolPairID: pendingOrderObject.PoolID,
                orderID: pendingOrderObject.RequestTx,
                nftID: null
            })
            logger.info({ tx })
        }).timeout(120000);
    });

    describe("TC011_CancelOrderIdNotExist", async() => {

        let pendingOrderObject

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let nftData = await sender.useSdk.getNftData()
            console.log('hoanh nftData', nftData);

            for (const nft of nftData) {
                if (nft.realAmount == 1 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit()
                    if (response.data.Result.length > 0) {
                        pendingOrderObject = response.data.Result[0]
                        break;
                    }
                }
            }
        }).timeout(60000);

        it("STEP_CancelOrderAndVerify", async() => {

            let param = {
                token1ID: pendingOrderObject.SellTokenID,
                token2ID: pendingOrderObject.BuyTokenID,
                poolPairID: pendingOrderObject.PoolID,
                orderID: "abc-desf",
                nftID: pendingOrderObject.NFTID
            }
            console.log('hoanh param', param);
            tx = await sender.useSdk.cancelOrder({
                token1ID: pendingOrderObject.SellTokenID,
                token2ID: pendingOrderObject.BuyTokenID,
                poolPairID: pendingOrderObject.PoolID,
                orderID: "abc-desf",
                nftID: pendingOrderObject.NFTID
            })
            logger.info({ tx })
        }).timeout(120000);
    });

    describe("TC012_CancelOrderWithPoolIDIncorrect", async() => {

        let pendingOrderObject

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let nftData = await sender.useSdk.getNftData()
            console.log('hoanh nftData', nftData);

            for (const nft of nftData) {
                if (nft.realAmount == 1 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit()
                    if (response.data.Result.length > 0) {
                        pendingOrderObject = response.data.Result[0]
                        break;
                    }
                }
            }
        }).timeout(60000);

        it("STEP_CancelOrderAndVerify", async() => {

            let param = {
                token1ID: pendingOrderObject.SellTokenID,
                token2ID: pendingOrderObject.BuyTokenID,
                poolPairID: "abc-desf",
                orderID: pendingOrderObject.RequestTx,
                nftID: pendingOrderObject.NFTID
            }
            console.log('hoanh param', param);
            tx = await sender.useSdk.cancelOrder({
                token1ID: pendingOrderObject.SellTokenID,
                token2ID: pendingOrderObject.BuyTokenID,
                poolPairID: "abc-desf",
                orderID: pendingOrderObject.RequestTx,
                nftID: pendingOrderObject.NFTID
            })
            logger.info({ tx })
        }).timeout(120000);
    });

    describe("TC013_CancelOrderWithIncorrectToken1ID", async() => {

        let pendingOrderObject

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let nftData = await sender.useSdk.getNftData()
            console.log('hoanh nftData', nftData);

            for (const nft of nftData) {
                if (nft.realAmount == 1 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit()
                    if (response.data.Result.length > 0) {
                        pendingOrderObject = response.data.Result[0]
                        break;
                    }
                }
            }
        }).timeout(60000);

        it("STEP_CancelOrderAndVerify", async() => {

            let param = {
                token1ID: TOKEN.BTC,
                token2ID: pendingOrderObject.BuyTokenID,
                poolPairID: pendingOrderObject.PoolID,
                orderID: pendingOrderObject.RequestTx,
                nftID: pendingOrderObject.NFTID
            }
            console.log('hoanh param', param);
            tx = await sender.useSdk.cancelOrder({
                token1ID: TOKEN.BTC,
                token2ID: pendingOrderObject.BuyTokenID,
                poolPairID: pendingOrderObject.PoolID,
                orderID: pendingOrderObject.RequestTx,
                nftID: pendingOrderObject.NFTID
            })
            logger.info({ tx })
        }).timeout(120000);
    });

    describe("TC014_CancelOrderWithIncorrectToken2ID", async() => {

        let pendingOrderObject

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let nftData = await sender.useSdk.getNftData()
            console.log('hoanh nftData', nftData);

            for (const nft of nftData) {
                if (nft.realAmount == 1 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit()
                    if (response.data.Result.length > 0) {
                        pendingOrderObject = response.data.Result[0]
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
            console.log('hoanh param', param);
            tx = await sender.useSdk.cancelOrder({
                token1ID: pendingOrderObject.tokenSellID,
                token2ID: TOKEN.BTC,
                poolPairID: pendingOrderObject.PoolID,
                orderID: pendingOrderObject.RequestTx,
                nftID: pendingOrderObject.NFTID
            })
            logger.info({ tx })
        }).timeout(120000);
    });

    describe("TC015_CancelOrderIDNotBelongWithOrder", async() => {

        let pendingOrderObject1
        let pendingOrderObject2

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let nftData = await sender.useSdk.getNftData()
            console.log('hoanh nftData', nftData);

            for (const nft of nftData) {
                if (nft.realAmount == 1 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit()
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
            console.log('hoanh param', param);
            tx = await sender.useSdk.cancelOrder({
                token1ID: pendingOrderObject1.tokenSellID,
                token2ID: pendingOrderObject1.BuyTokenID,
                poolPairID: pendingOrderObject1.PoolID,
                orderID: pendingOrderObject2.RequestTx,
                nftID: pendingOrderObject1.NFTID
            })
            logger.info({ tx })
        }).timeout(120000);
    });

    describe("TC016_CancelPoolIDNotBelongWithOrder", async() => {

        let pendingOrderObject1
        let pendingOrderObject2

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();
            let nftData = await sender.useSdk.getNftData()
            console.log('hoanh nftData', nftData);

            for (const nft of nftData) {
                if (nft.realAmount == 1 && nft.nftToken) {
                    let response = await coinServiceApi.pendingLimit()
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
            console.log('hoanh param', param);
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