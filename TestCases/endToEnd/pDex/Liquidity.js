const { TOKEN, POOL } = require('../../../lib/Incognito/Constants')
const GenAction = require("../../../lib/Utils/GenAction");
const addDebug = require('../../../lib/Utils/AddingContent').addDebug;
let chai = require("chai");
let assert = require("chai").assert;
const { ACCOUNTS, NODES } = require('../../TestBase');
const config = require("../../../config.json");


describe("[Class] Liquidity", () => {
    var sender = ACCOUNTS.Incognito.get(1)

    async function initSdkNGetBal() {
        await sender.initSdkInstance();
        await sender.useSdk.clearCacheBalance()

        //getBalance
        let balanceAll = await sender.useSdk.getBalanceAll()
        sender.balanceAllBefore = balanceAll
        addDebug('sender.balanceAllBefore ', sender.balanceAllBefore)
    }

    describe("TC001_AddExistLiquidity", async () => {

        let amount1 = 0
        let amount2 = 0
        let actualAmount0Add
        let actualAmount1Add
        let listTx = []
        let nftID
        let token1ID = TOKEN.PRV
        let token2ID = TOKEN.USDT_UT
        let poolPairID = POOL.PRV_USDT

        it("STEP_InitData", async () => {
            await initSdkNGetBal()
            sender.balancePRVBefore = balanceAll[token1ID]
            sender.balanceUSDTBefore = balanceAll[token2ID]

            //selectNFT
            let nftData = await sender.useSdk.getNftData()
            for (const nft of nftData) {
                if (nft.realAmount == 1) {
                    nftID = nft.nftToken
                }
                break
            }

            //randomNumber
            amount1 = await GenAction.randomNumber(10000)
            amount2 = await GenAction.randomNumber(10000)
        }).timeout(config.timeoutApi);

        it("STEP_CreateTxContributeLiquidity", async () => {
            //get AMP
            let poolInfo = await sender.useSdk.getListPoolsDetail(poolPairID)
            let amp = poolInfo[0].amp

            //create tx
            listTx = await sender.useSdk.contributeLiquidity({
                tokenId1: token1ID,
                tokenId2: token2ID,
                amount1,
                amount2,
                poolPairID: poolPairID,
                amp,
                nftID
            })
            addDebug('listTx', listTx)

            for (const tx of listTx) {
                await NODES.Incognito.getTransactionByHashRpc(tx)
            }
            await sender.useSdk.waitForUtxoChange({
                tokenID: token1ID,
                countNumber: 15,
            })
        }).timeout(config.timeoutTx);

        it("STEP_CheckTxStatus", async () => {
            for (const tx of listTx) {
                let response = await NODES.Incognito.rpc.pdexv3_getContributionStatus(tx)

                actualAmount0Add = response.data.Result.Token0ContributedAmount
                actualAmount1Add = response.data.Result.Token1ContributedAmount

                chai.expect(response.data.Result.Status).to.equal(4)
                chai.expect(response.data.Result.Token0ID).to.equal(token1ID)
                chai.expect(response.data.Result.Token1ID).to.equal(token2ID)
                chai.expect(response.data.Result.PoolPairID).to.equal(poolPairID)
            }
        }).timeout(config.timeoutApi);

        it("STEP_VerifyBalance", async () => {
            if (listTx.length == 0) return true
            await sender.useSdk.waitForUtxoChange({
                tokenID: token1ID,
                countNumber: 15,
            })

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllAfter = balanceAll
            addDebug('sender.balanceAllAfter ', sender.balanceAllAfter)

            chai.expect(sender.balanceAllAfter[TOKEN.PRV]).to.equal(sender.balanceAllBefore[TOKEN.PRV] - actualAmount0Add - 200);
            chai.expect(sender.balanceAllAfter[token2ID]).to.be.least(sender.balanceAllBefore[token2ID] - actualAmount1Add);

        }).timeout(config.timeoutTx);
    });

    describe("TC002_RemoveExistLiquidity", async () => {
        let poolShare
        let actualAmount0Remove
        let actualAmount1Remove
        let tx

        it("STEP_InitData", async () => {
            await initSdkNGetBal()
        }).timeout(config.timeoutApi);

        it("STEP_FindMyPoolShare", async () => {
            let nftData = await sender.useSdk.getNftData()
            addDebug('nftData', nftData)

            //find my poolShare
            let listPoolShare = await sender.useSdk.getListShare()
            for (const pool of listPoolShare) {
                if (pool.share > 0) {
                    for (const nft of nftData) {
                        if (pool.nftId == nft.nftToken && parseInt(nft.realAmount) > 0) {
                            poolShare = pool
                            return true
                        }
                    }
                }
            }

        }).timeout(config.timeoutApi);

        it("STEP_CreateTxRemoveLiquidity", async () => {
            addDebug('poolShare', poolShare)

            //create tx
            if (!poolShare) return true
            let shareRemove = await GenAction.randomNumber(Math.round(poolShare.share / 10))
            tx = await sender.useSdk.removeLiquidity({
                poolTokenIDs: [poolShare.tokenId1, poolShare.tokenId2],
                poolPairID: poolShare.poolId,
                shareAmount: shareRemove,
                nftID: poolShare.nftId,
                amount1: 1,
                amount2: 1,
            })
            addDebug('tx', tx)

            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: poolShare.tokenId1,
                countNumber: 15,
            })
        }).timeout(config.timeoutTx);

        it("STEP_CheckTxStatus", async () => {
            if (!poolShare) return true
            let response = await NODES.Incognito.rpc.pdexv3_getWithdrawLiquidityStatus(tx)

            actualAmount0Remove = response.data.Result.Token0Amount
            actualAmount1Remove = response.data.Result.Token1Amount

            chai.expect(response.data.Result.Status).to.equal(1)
            chai.expect(response.data.Result.Token0ID).to.equal(poolShare.tokenId1)
            chai.expect(response.data.Result.Token1ID).to.equal(poolShare.tokenId2)

            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.PRV,
                countNumber: 10,
            })

        }).timeout(config.timeoutTx);

        it("STEP_VerifyBalance", async () => {
            if (!poolShare) return true

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllAfter = balanceAll

            chai.expect(sender.balanceAllAfter[poolShare.tokenId1]).to.equal(sender.balanceAllBefore[poolShare.tokenId1] + actualAmount0Remove - 100);
            chai.expect(sender.balanceAllAfter[poolShare.tokenId2]).to.be.least(sender.balanceAllBefore[poolShare.tokenId2] + actualAmount1Remove);

        }).timeout(config.timeoutTx);
    });

    describe("TC003_WithdrawRewardLiquidity", async () => {
        let tx
        let poolHaveReward

        it("STEP_InitData", async () => {
            await initSdkNGetBal()
        }).timeout(config.timeoutApi);

        it("STEP_FindLiqudityHaveReward", async () => {

            let nftData = await sender.useSdk.getNftData()
            addDebug('nftData', nftData)

            //find my poolShare
            let listPoolShare = await sender.useSdk.getListShare()
            for (const pool of listPoolShare) {
                if (pool.rewards[TOKEN.PRV] > 0 || pool.orderRewards[TOKEN.PRV] > 0) {
                    for (const nft of nftData) {
                        if (pool.nftId == nft.nftToken && parseInt(nft.realAmount) > 0) {
                            poolHaveReward = pool
                            return true
                        }
                    }
                }
            }
        }).timeout(config.timeoutApi);

        it("STEP_CreateTxRemoveLiquidity", async () => {

            addDebug('poolHaveReward', poolHaveReward)
            if (!poolHaveReward) return true
            let withdrawTokenIDs = []
            if (poolHaveReward.rewards) {
                for (const tokenId of Object.keys(poolHaveReward.rewards)) {
                    withdrawTokenIDs.push(tokenId)
                }
            } else {
                for (const tokenId of Object.keys(poolHaveReward.orderRewards)) {
                    withdrawTokenIDs.push(tokenId)
                }
            }

            //create tx
            tx = await sender.useSdk.withdrawFeeLiquidity({
                withdrawTokenIDs,
                poolPairID: poolHaveReward.poolId,
                nftID: poolHaveReward.nftId,
            })

            addDebug('tx', tx)

            await NODES.Incognito.getTransactionByHashRpc(tx)
            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.PRV,
                countNumber: 15,
            })
        }).timeout(config.timeoutTx);

        it("STEP_CheckTxStatus", async () => {
            if (!poolHaveReward) return true
            let response

            while (true) {
                response = await NODES.Incognito.rpc.pdexv3_getWithdrawalLPFeeStatus(tx)

                if (response && response.data && response.data.Result) {
                    addDebug('response.data', response.data)
                    let receivers = response.data.Result.Receivers
                    for (const item of Object.keys(receivers)) {
                        for (const tokenID of Object.keys(poolHaveReward.rewards)) {
                            if (tokenID == item) {
                                let totalReward = 0
                                totalReward += poolHaveReward.rewards[tokenID] ? poolHaveReward.rewards[tokenID] : 0
                                totalReward += poolHaveReward.orderRewards[tokenID] ? poolHaveReward.orderRewards[tokenID] : 0

                                chai.expect(receivers[item].Amount).to.equal(totalReward)
                            }
                        }
                    }

                    await sender.useSdk.waitForUtxoChange({
                        tokenID: TOKEN.PRV,
                        countNumber: 10,
                    })
                    break;
                }
            }
        }).timeout(config.timeoutTx);

        it("STEP_VerifyBalance", async () => {
            if (!poolHaveReward) return true

            await sender.useSdk.waitForUtxoChange({
                tokenID: TOKEN.PRV,
                countNumber: 15,
            })

            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balanceAllAfter = balanceAll

            let totalReward = 0
            totalReward += poolHaveReward.rewards[TOKEN.PRV] ? poolHaveReward.rewards[TOKEN.PRV] : 0
            totalReward += poolHaveReward.orderRewards[TOKEN.PRV] ? poolHaveReward.orderRewards[TOKEN.PRV] : 0

            chai.expect(sender.balanceAllAfter[TOKEN.PRV]).to.equal(sender.balanceAllBefore[TOKEN.PRV] + totalReward - 100);

        }).timeout(config.timeoutTx);
    });

    describe("TC004_AddExistLiquidityWithInvalidToken1", async () => {
        let amount1 = 0
        let amount2 = 0
        let listTx = []
        let nftID
        let token1ID = TOKEN.PRV
        let token2ID = TOKEN.WBNB
        let poolPairID = POOL.PRV_USDT

        it("STEP_InitData", async () => {
            await initSdkNGetBal()

            //selectNFT
            let nftData = await sender.useSdk.getNftData()
            for (const nft of nftData) {
                if (nft.realAmount == 1) {
                    nftID = nft.nftToken
                }
                break
            }

            //randomNumber
            amount1 = await GenAction.randomNumber(10000)
            amount2 = await GenAction.randomNumber(10000)
        }).timeout(config.timeoutApi);

        it("STEP_CreateTxWithToken1Null", async () => {
            //get AMP
            let poolInfo = await sender.useSdk.getListPoolsDetail(poolPairID)
            let amp = poolInfo[0].amp

            //create tx
            listTx = await sender.useSdk.contributeLiquidity({
                tokenId1: null,
                tokenId2: token2ID,
                amount1,
                amount2,
                poolPairID: poolPairID,
                amp,
                nftID
            })
            addDebug('listTx', listTx)
            assert.equal(listTx, 'Error: Validating "createContributeTxs-tokenId1" failed: Required. Found null (type of object)')
        }).timeout(config.timeoutTx);

        it("STEP_CreateTxWithToken1Invalid", async () => {
            //get AMP
            let poolInfo = await sender.useSdk.getListPoolsDetail(poolPairID)
            let amp = poolInfo[0].amp

            //create tx
            listTx = await sender.useSdk.contributeLiquidity({
                tokenId1: '123',
                tokenId2: token2ID,
                amount1,
                amount2,
                poolPairID: poolPairID,
                amp,
                nftID
            })
            addDebug('listTx', listTx)
            assert.equal(listTx, `WEB_JS_ERROR: Error while preparing inputs Not enough coin to spend ${amount1}`)
        }).timeout(config.timeoutTx);

        it("STEP_CreateTxWithToken1NotMapWithPoolPairID", async () => {
            //get AMP
            let poolInfo = await sender.useSdk.getListPoolsDetail(poolPairID)
            let amp = poolInfo[0].amp

            //create tx
            listTx = await sender.useSdk.contributeLiquidity({
                tokenId1: token1ID,
                tokenId2: token2ID,
                amount1,
                amount2,
                poolPairID: poolPairID,
                amp,
                nftID
            })

            addDebug('listTx', listTx)
            for (const tx of listTx) {
                await NODES.Incognito.getTransactionByHashRpc(tx)
            }
            await sender.useSdk.waitForUtxoChange({
                tokenID: token1ID,
                countNumber: 15,
            })

            for (const tx of listTx) {
                let response = await NODES.Incognito.rpc.pdexv3_getContributionStatus(tx)

                chai.expect(response.data.Result.Status).to.equal(3)
                chai.expect(response.data.Result.Token0ID).to.equal("")
                chai.expect(response.data.Result.Token0ContributedAmount).to.equal(0)
                chai.expect(response.data.Result.Token0ReturnedAmount).to.equal(0)
                chai.expect(response.data.Result.Token1ID).to.equal("")
                chai.expect(response.data.Result.Token1ContributedAmount).to.equal(0)
                chai.expect(response.data.Result.Token1ReturnedAmount).to.equal(0)
                chai.expect(response.data.Result.PoolPairID).to.equal(poolPairID)
            }
        }).timeout(config.timeoutTx * 2);
    });

    describe("TC005_AddExistLiquidityWithInvalidAmount1", async () => {
        let amount1 = 0
        let amount2 = 0
        let listTx = []
        let nftID
        let token1ID = TOKEN.PRV
        let token2ID = TOKEN.USDT_UT
        let poolPairID = POOL.PRV_USDT

        it("STEP_InitData", async () => {
            await initSdkNGetBal()

            //selectNFT
            let nftData = await sender.useSdk.getNftData()
            for (const nft of nftData) {
                if (nft.realAmount == 1) {
                    nftID = nft.nftToken
                }
                break
            }

            //randomNumber
            amount1 = await GenAction.randomNumber(10000)
            amount2 = await GenAction.randomNumber(10000)
        }).timeout(config.timeoutApi);

        it("STEP_CreateTxWithAmount1Null", async () => {
            //get AMP
            let poolInfo = await sender.useSdk.getListPoolsDetail(poolPairID)
            let amp = poolInfo[0].amp

            //create tx
            listTx = await sender.useSdk.contributeLiquidity({
                tokenId1: token1ID,
                tokenId2: token2ID,
                amount1: null,
                amount2,
                poolPairID: poolPairID,
                amp,
                nftID
            })
            addDebug('listTx', listTx)
            assert.equal(listTx, 'Error: Validating "createContributeTxs-amount1" failed: Required. Found null (type of object)')
        }).timeout(config.timeoutTx);

        it("STEP_CreateTxWithAmount1InvalidFormat", async () => {
            //get AMP
            let poolInfo = await sender.useSdk.getListPoolsDetail(poolPairID)
            let amp = poolInfo[0].amp

            //create tx
            listTx = await sender.useSdk.contributeLiquidity({
                tokenId1: token1ID,
                tokenId2: token2ID,
                amount1: "abc",
                amount2,
                poolPairID: poolPairID,
                amp,
                nftID
            })
            addDebug('listTx', listTx)
            assert.include(listTx, 'create-tx error - cannot parse params <nil> - cannot parse metadata')
            assert.include(listTx, '- strconv.ParseUint: parsing "abc": invalid syntax')
        }).timeout(config.timeoutTx);

        it("STEP_CreateTxWithAmount1OverBalance", async () => {
            //get AMP
            let poolInfo = await sender.useSdk.getListPoolsDetail(poolPairID)
            let amp = poolInfo[0].amp

            //create tx
            listTx = await sender.useSdk.contributeLiquidity({
                tokenId1: token1ID,
                tokenId2: token2ID,
                amount1: sender.balanceAllBefore[token1ID] + 1000000 * 1e9,
                amount2,
                poolPairID: poolPairID,
                amp,
                nftID
            })
            addDebug('listTx', listTx)
            assert.include(listTx, 'WEB_JS_ERROR: Error while preparing inputs')
        }).timeout(config.timeoutTx);


    });
});