const { TOKEN, POOL } = require('../../../lib/Incognito/Constants')
const listAccount = require("../../../constant/listAccount.json");
const { IncNode } = require("../../../lib/Incognito/IncNode");
const { IncAccount } = require("../../../lib/Incognito/Account/Account");
const { IncRpc } = require("../../../lib/Incognito/RPC/Rpc");
const GenAction = require("../../../lib/Utils/GenAction");
let chai = require("chai");
const { getLogger } = require("../../../lib/Utils/LoggingManager");
const logger = getLogger("Pdex")

let incRpc = new IncRpc();
let incNode = new IncNode()
let sender = new IncAccount(listAccount[2], incNode)

describe("[Class] Pdex", () => {
    describe("TC001_AddExistLiquidity", async() => {
        let amount1 = 0
        let amount2 = 0
        let actualAmount0Add
        let actualAmount1Add
        let listTx = []
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            //getBalance
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]
            sender.balanceZILBefore = balanceAll[TOKEN.ZIL]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })
            logger.info({ balanceZILBefore: sender.balanceZILBefore })

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
        }).timeout(60000);

        it("STEP_CreateTxContributeLiquidity", async() => {
            //get AMP
            let poolInfo = await sender.useSdk.getListPoolsDetail(POOL.PRV_ZIL)
            let amp = poolInfo[0].amp

            //create tx
            listTx = await sender.useSdk.contributeLiquidity({
                tokenId1: TOKEN.PRV,
                tokenId2: TOKEN.ZIL,
                amount1,
                amount2,
                poolPairID: POOL.PRV_ZIL,
                amp,
                nftID
            })

            for (const tx of listTx) {
                await incNode.getTransactionByHashRpc(tx)
            }
            await GenAction.sleep(60000)
        }).timeout(120000);


        it("STEP_CheckTxStatus", async() => {
            for (const tx of listTx) {
                let response = await incRpc.pdexv3_getContributionStatus(tx)

                actualAmount0Add = response.data.Result.Token0ContributedAmount
                actualAmount1Add = response.data.Result.Token1ContributedAmount

                chai.expect(response.data.Result.Status).to.equal(4)
                chai.expect(response.data.Result.Token0ID).to.equal(TOKEN.PRV)
                chai.expect(response.data.Result.Token1ID).to.equal(TOKEN.ZIL)
                chai.expect(response.data.Result.PoolPairID).to.equal(POOL.PRV_ZIL)
            }
        }).timeout(60000);


        it("STEP_VerifyBalance", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.PRV]
            sender.balanceZILAfter = balanceAll[TOKEN.ZIL]
            logger.info({ balancePRVAfter: sender.balancePRVAfter })
            logger.info({ balanceZILAfter: sender.balanceZILAfter })

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore - actualAmount0Add - 200); //2 tx => fee = 200
            chai.expect(sender.balanceZILAfter).to.be.least(sender.balanceZILBefore - actualAmount1Add);

        }).timeout(60000);
    });

    describe("TC002_RemoveExistLiquidity", async() => {
        let shareRemove
        let actualAmount0Remove
        let actualAmount1Remove
        let tx
        let nftID

        it("STEP_InitData", async() => {
            await sender.initSdkInstance();

            //getBalance
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVBefore = balanceAll[TOKEN.PRV]
            sender.balanceZILBefore = balanceAll[TOKEN.ZIL]

            logger.info({ balancePRVBefore: sender.balancePRVBefore })
            logger.info({ balanceZILBefore: sender.balanceZILBefore })

            //selectNFT
            let nftData = await sender.useSdk.getNftData()
            for (const nft of nftData) {
                if (nft.realAmount == 1) {
                    nftID = nft.nftToken
                }
                break
            }
        }).timeout(60000);

        it("STEP_CreateTxRemoveLiquidity", async() => {
            //get AMP
            let listPoolShare = await sender.useSdk.getListShare()
            for (const pool of listPoolShare) {
                if (pool.poolId == POOL.PRV_ZIL) {
                    let share = pool.share
                    shareRemove = await GenAction.randomNumber(Math.round(share / 10))
                }
            }

            //create tx
            tx = await sender.useSdk.removeLiquidity({
                poolTokenIDs: [TOKEN.PRV, TOKEN.ZIL],
                poolPairID: POOL.PRV_ZIL,
                shareAmount: shareRemove,
                nftID,
                amount1: 1,
                amount2: 1,
            })

            await incNode.getTransactionByHashRpc(tx)
            await GenAction.sleep(60000)
        }).timeout(120000);


        it("STEP_CheckTxStatus", async() => {
            let response = await incRpc.pdexv3_getWithdrawLiquidityStatus(tx)

            actualAmount0Remove = response.data.Result.Token0Amount
            actualAmount1Remove = response.data.Result.Token1Amount

            chai.expect(response.data.Result.Status).to.equal(1)
            chai.expect(response.data.Result.Token0ID).to.equal(TOKEN.PRV)
            chai.expect(response.data.Result.Token1ID).to.equal(TOKEN.ZIL)
        }).timeout(60000);


        it("STEP_VerifyBalance", async() => {
            let balanceAll = await sender.useCli.getBalanceAll()
            sender.balancePRVAfter = balanceAll[TOKEN.PRV]
            sender.balanceZILAfter = balanceAll[TOKEN.ZIL]
            logger.info({ balancePRVAfter: sender.balancePRVAfter })
            logger.info({ balanceZILAfter: sender.balanceZILAfter })

            chai.expect(sender.balancePRVAfter).to.equal(sender.balancePRVBefore + actualAmount0Remove - 100);
            chai.expect(sender.balanceZILAfter).to.be.least(sender.balanceZILBefore + actualAmount1Remove);

        }).timeout(60000);
    });
});