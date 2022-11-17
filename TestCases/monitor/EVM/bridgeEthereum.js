const Constants = require('../../../lib/Incognito/Constants');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const backendApischemas = require("../../../schemas/backendApi_schemas");
const { BackendApi } = require('../../../lib/Incognito/BackendApi')
const { ENV } = require('../../../global');
const { wait } = require('../../../lib/Utils/Timer');
// const web3CommonFuntion = require('../../../constant/web3CommonFuntion');


let chai = require('chai');
const { ACCOUNTS } = require('../../TestBase');
const { EvmAccount } = require('../../../lib/EVM/Account');


describe(`[Ethereum brigde]`, async () => {
    const tokenID = Constants.TOKEN.ETH
    const tokenUnifiedID = Constants.TOKEN.UnifiedETH
    const fullnodeEVM = ENV.EthereumFullnode[0].url

    let account = ACCOUNTS.Incognito.get(1)
    let backendApi = new BackendApi()
    let extAccount = ACCOUNTS.Evm.get(0).setProvider(ENV.Testbed.EthereumFullnode[0].url)

    let SignPublicKeyEncode = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a';
    const MIN_BAL_FEE_MASTER_WALLET = 0.05 * 1e18


    const accountInfoBefore = {
        incTokenBal: 0,
        extTokenBal: 0
    }
    const accountInfoAfter = {
        incTokenBal: 0,
        extTokenBal: 0
    }

    const shieldInfo = {
        shieldAmt: 0.01, // ETH
        shieldBackendId: null,
        shieldPrvFee: 0,
        shieldTokenFee: 0,
    }
    const tmpAccount = new EvmAccount().setProvider(ENV.Testbed.EthereumFullnode[0].url)

    describe('SHIELDING ETH', async () => {
        it('Init data', async () => {
            accountInfoBefore.incTokenBal = await account.useCli.getBalance(tokenUnifiedID)
            await console.log('accountInfoBefore: ', accountInfoBefore.incTokenBal)
        })
    })

    describe(`STEP_1 get shielding address and estimate shield fee`, async () => {
        it('Call API backend..', async () => {
            let res = await backendApi.ethGenerate(1, account.paymentK, tokenID, SignPublicKeyEncode)
            await validateSchemaCommand.validateSchema(backendApischemas.generateShieldAddressSchemas, res.data)
            tmpAccount.address = res.data.Result.Address
            shieldInfo.shieldTokenFee = res.data.Result.EstimateFee
            console.log('tmp wallet address : ' + tmpAccount.address)
            console.log('estimate shielding fee : ' + shieldInfo.shieldTokenFee)
        })
    })

    describe(`[WEB3] Deposit token`, async () => {
        it(`Get balance before deposit`, async () => {
            accountInfoBefore.extTokenBal = await extAccount.getBalance()
            await console.log('accountInfoBefore.extTokenBal: ', accountInfoBefore.extTokenBal)
        });
        it(`Deposit token`, async () => {
            await console.log('sender %s -- receiver %s ', extAccount.address, shieldInfo.tmpWalletAddress)
            extAccount.sendNativeToken({ to: tmpAccount, amount: (0.01 + shieldInfo.shieldTokenFee) * 1e18 })
            await wait(10)
            accountInfoAfter.extTokenBal = await extAccount.getBalance()
            await console.log('accountInfoBefore.extTokenBal: ', accountInfoBefore.extTokenBal)
        })
    })

    describe(`STEP_3 Verify record shield backend`, async () => {
        it('[3.1] Check balance Fee Master Wallet', async () => {
            let balFeeMaster = await web3.eth.getBalance(masterFeeWallet)
            if (balFeeMaster < MIN_BAL_FEE_MASTER_WALLET) {
                slack.send('Need send more fee to Mater Fee Wallet ' + masterFeeWallet)
            }
        })
        it('[3.2] Call API backend to get new shielding ', async () => {
            let resBefore = await backendApi.historyByTokenAccount(account.paymentK, tokenUnifiedID, SignPublicKeyEncode)
            await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountSchemas, resBefore.data)
            shieldID = await account.waitForNewShieldRecord({ tokenId: tokenUnifiedID })
            console.log('newShieldID : ', shieldID)
        })
        it('[3.3] Verify shielding detail', async () => {
            let resDetail = await backendApi.historyDetail(shieldInfo.shieldBackendId, 1, SignPublicKeyEncode, 2)
            await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountDetailSchemas, resDetail.data)

            let counter = 0
            while (resDetail.data.Result.Status != 12) {
                let tmp = await backendApi.historyDetail(shieldInfo.shieldBackendId, 1, SignPublicKeyEncode, 2)
                console.log('Shield status = ' + tmp.data.Result.Status + ' ---- ' + tmp.data.Result.StatusMessage + ' --- ' + tmp.data.Result.StatusDetail)
                resDetail.data.Result.Status = tmp.data.Result.Status
                if (resDetail.data.Result.Status === 12) {
                    console.log('Shielding successfull')
                    break
                }
                else if (counter === shieldInfo.countWating) {
                    await slack.send('Shielding over 10 minutes but not mint tokens yet -- shield Id = ' + shieldInfo.shieldBackendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    break
                }
                else if (resDetail.data.Result.Status === 16 || resDetail.data.Result.Status === 13 || resDetail.data.Result.Status === 14 || resDetail.data.Result.Status === 15 || resDetail.data.Result.Status === 5 || resDetail.data.Result.Status === 8) {
                    await slack.send('Shield seem to be stuck in the backend -- shield Id = ' + shieldInfo.shieldBackendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    break
                }
                // await slack.send('send slack for fun -- shield Id = ' + shieldInfo.shieldBackendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                await wait(120)
                await counter++
            }
        })
    })
    describe(`STEP_4 Verify balance in Incognito`, async () => {
        it('Verify balance affter shield', async () => {
            await wait(40)
            accountInfoAfter.incTokenBal = await account.useCli.getBalance(tokenUnifiedID)
            console.log('accountInfoAfter: ', accountInfoAfter.incTokenBal)
            chai.assert.isTrue(accountInfoAfter.incTokenBal - accountInfoBefore.incTokenBal > 0, 'mint token unsuceessfull')
        })
    })
});




describe(`[======  ETHEREUM BRIDGE -- UNSHIELDING ====== ]`, async () => {
    const extPrivateKey = 'xxxxxx'
    const privateKey = `xxxxxxx`
    const tokenID = Constants.TOKEN.ETH
    const tokenUnifiedID = Constants.TOKEN.UnifiedETH
    let SignPublicKeyEncode = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    const fullnodeEVM = ENV.EthereumFullnode[0].url

    let node = await new IncNode()
    let account = await new IncAccount(privateKey).attachTo(node)
    let backendApi = await new BackendApi(ENV.Backend)
    // let coinServiceApi = await new CoinServiceApi(ENV.CoinService)

    let slack = await slackNotify(MY_SLACK_WEBHOOK_URL)
    let web3 = await new Web3(new Web3.providers.HttpProvider(fullnodeEVM))
    let extAccount = await web3.eth.accounts.privateKeyToAccount(extPrivateKey)


    const accountInfoBefore = {
        incTokenBal: 0,
        extTokenBal: 0
    }
    const accountInfoAfter = {
        incTokenBal: 0,
        extTokenBal: 0
    }
    const unshieldInfo = {
        unshieldAmt: 0.01,
        unshieldPrvFee: 0,
        unshieldTokenFee: 0,
        backendId: null,
        feeAccount: null,
        unshieldExtTx: null,
        unshieldIncTx: null,
        rawData: null,
        countWating: 5
    }



    describe('UNSHIELDING ETH', async () => {
        it('Init data', async () => {
            accountInfoBefore.incTokenBal = await account.useCli.getBalance(tokenUnifiedID)
            await console.log('accountInfoBefore: ', accountInfoBefore.incTokenBal)
            accountInfoBefore.extTokenBal = await web3.eth.getBalance(extAccount.address)
            await console.log('accountInfoBefore.extTokenBal: ', accountInfoBefore.extTokenBal)
        })
    })

    describe('STEP_1 Estimate Unshield Fee', async () => {
        it('Call API get estimate Fee and backendUnshielId', async () => {
            resEst = await backendApi.ethUnshieldEstFee(
                unshieldInfo.unshieldAmt,
                2,
                extAccount.address,
                tokenID,
                tokenUnifiedID,
                account.paymentK,
                9,
                SignPublicKeyEncode
            )
            unshieldInfo.backendId = resEst.data.Result.ID
            unshieldInfo.unshieldTokenFee = resEst.data.Result.TokenFees.Level1
            unshieldInfo.feeAccount = resEst.data.Result.FeeAddress
            console.log('Response Estimate Unshield data :', resEst.data)
        })
    })

    describe(`STEP_2 Burn token`, async () => {
        it(`[2.1] Create unshield transaction by SDK `, async () => {
            await account.initSdkInstance();

            unshieldInfo.unshieldIncTx = await account.useSdk.unshieldUnifiedEvm(
                unshieldInfo.backendId,
                tokenID,
                tokenUnifiedID,
                unshieldInfo.feeAccount,
                unshieldInfo.unshieldAmt,
                unshieldInfo.unshieldTokenFee,
                9,
                extAccount.address,
                100,
                2
            )
            console.log('tx unshield : ' + unshieldInfo.unshieldIncTx)
            await wait(20)
            let resTxHashDetail = await account.useRpc.getTxByHash(unshieldInfo.unshieldIncTx)
            console.log('resTxHashDetail : ' + resTxHashDetail)

        })
        it(`[2.2] Submit unshield tx to backend`, async () => {
            let resSubmitTx = await backendApi.submutTxEthereumUnshield(
                1, //currencyType ETH
                2,
                unshieldInfo.unshieldAmt,
                9,
                extAccount.address,
                tokenID,
                unshieldInfo.unshieldIncTx,
                account.paymentK,
                unshieldInfo.backendId,
                1,
                1,
                SignPublicKeyEncode)
            console.log('Res submit tx to backend : ', resSubmitTx.data)
            await chai.assert.isTrue(resSubmitTx.data.Result, 'submit tx not success')
        })
    })

    describe(`STEP_3 Verify record unshield backend`, async () => {
        it('[3.1] Verify unshielding detail', async () => {
            let resDetail = await backendApi.historyDetail(unshieldInfo.backendId, 1, SignPublicKeyEncode, 2)
            console.log(resDetail.data)
            await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountDetailSchemas, resDetail.data)
            let counter = 0
            while (resDetail.data.Result.Status != 25) {
                let tmp = await backendApi.historyDetail(unshieldInfo.backendId, 1, SignPublicKeyEncode, 2)
                console.log('Unshield status = ' + tmp.data.Result.Status + ' ---- ' + tmp.data.Result.StatusMessage + ' --- ' + tmp.data.Result.StatusDetail)
                resDetail.data.Result.Status = tmp.data.Result.Status
                if (resDetail.data.Result.Status === 25) {
                    console.log('Unshielding successfull')
                    unshieldInfo.unshieldExtTx = tmp.data.Result.OutChainTx.substring(tmp.data.Result.OutChainTx.indexOf(`0x`))
                    break
                }
                else if (counter === unshieldInfo.countWating) {
                    await slack.send('Unshield over 10 minutes but not completed yet -- unshield Id = ' + unshieldInfo.backendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    break
                }
                else if (resDetail.data.Result.Status === 23 || resDetail.data.Result.Status === 26 || resDetail.data.Result.Status === 27 || resDetail.data.Result.Status === 28 || resDetail.data.Result.Status === 29 || resDetail.data.Result.Status === 33) {
                    await slack.send('Unshield seem to be stuck in the backend -- unshield Id = ' + unshieldInfo.backendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    break
                } else if (resDetail.data.Result.Status === 34) {
                    await slack.send('NotEnoughVaultPleaseWait -- unshield Id = ' + unshieldInfo.backendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    break
                }
                unshieldInfo.unshieldExtTx = tmp.data.Result.OutChainTx.substring(tmp.data.Result.OutChainTx.indexOf(`0x`))
                await slack.send('send slack for fun -- unshield Id = ' + unshieldInfo.backendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                await wait(120)
                await counter++
            }
        })
    })

    describe(`STEP_4 Verify balance in Incognito`, async () => {
        it('Verify balance affter unshield', async () => {
            await wait(40)
            accountInfoAfter.incTokenBal = await account.useCli.getBalance(tokenUnifiedID)
            console.log('accountInfoAfter: ', accountInfoAfter.incTokenBal)
            chai.assert.notEqual(accountInfoBefore.incTokenBal, accountInfoAfter.incTokenBal, 'burn token unsuceessfull')
        })
    })

    describe('STEP_5 Verify data on Ethereum', async () => {
        it('Verify transaction', async () => {
            await console.log('tx unshield on ethereum : ', unshieldInfo.unshieldExtTx)
            let res = await web3.eth.getTransactionReceipt(unshieldInfo.unshieldExtTx)
            chai.assert.isTrue(res.status)
        })
        it('Verify update balance', async () => {
            accountInfoAfter.extTokenBal = await web3.eth.getBalance(extAccount.address)
            console.log('receiver balance : ', accountInfoAfter.extTokenBal)
            chai.assert.notEqual(accountInfoBefore.extTokenBal, accountInfoAfter.extTokenBal, `the receiver has not received yet`)
        })
    })
})