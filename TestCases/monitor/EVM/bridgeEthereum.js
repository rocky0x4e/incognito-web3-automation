const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const backendApischemas = require("../../../schemas/backendApi_schemas");
const { BackendApi } = require('../../../lib/Incognito/BackendApi')
const { ENV } = require('../../../global');
const { wait } = require('../../../lib/Utils/Timer');
const SlackIntegrate = require('../../../lib/Utils/SlackIntegrate')
const { getLogger } = require("../../../lib/Utils/LoggingManager");
const logger = getLogger("ETH_EVM")

let Web3 = require('web3');
let chai = require('chai');
const { ACCOUNTS, NODES } = require('../../TestBase');

const networkBridgeInfo = {
    "networkDetail": {
        "chainParams": {
            'name': 'goerli',
            'networkId': 5,
            'chainId': 5
        },
        "chain": "goerli",
        "hardfork": "istanbul"
    },
    "configInc": {
        currencyType: 1,
        decentralized: 2
    }
}

const MasterShieldFeeWallet = '0xfebefa80332863d292c768dfed0a3f5bee74e632'
const MasterUnshieldFeeWallet = '0x2228ad9ec671a1aee2786c04c695a580a3653853'
const MIN_BAL_FEE_MASTER_WALLET = 0.05 * 1e18
let signPublicKeyEncode = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a';


describe(`[ ======  ETHEREUM BRIDGE - SHIELD ======  ]`, async () => {
    const tokenID = ENV.Testbed.Tokens.ETH_ETH
    const tokenUnifiedID = ENV.Testbed.Tokens.ETH_UT
    let web3 = await new Web3(new Web3.providers.HttpProvider(ENV.Testbed.EthereumFullnode[0].url))

    let account = ACCOUNTS.Incognito.get(0)
    let backendApi = new BackendApi()
    let extAccount = ACCOUNTS.Evm.get(0).setProvider(ENV.Testbed.EthereumFullnode[0].url)

    const accountInfoBefore = {
        incTokenBal: 0,
        extTokenBal: 0
    }
    const accountInfoAfter = {
        incTokenBal: 0,
        extTokenBal: 0
    }

    const shieldInfo = {
        shieldAmt: 0.01, // eth
        shieldBackendId: null,
        shieldPrvFee: 0,
        shieldTokenFee: 0,
        tmpWalletAddress: null,
        timeout: 900,
        txDeposit: null,
        blockTime: 20,
        pTokenDecimal: 9
    }

    describe('SHIELDING ETH', async () => {
        it('Init data', async () => {
            accountInfoBefore.incTokenBal = await account.useCli.getBalance(tokenUnifiedID)
            logger.info( `accountInfoBefore :  ${accountInfoBefore.incTokenBal}`)
        }).timeout(60000);
    })

    describe(`STEP_1 get shielding address and estimate shield fee`, async () => {
        it('Call API backend..', async () => {
            let res = await backendApi.ethGenerate({
                walletAddress :  account.paymentK,
                tokenId : tokenID
            })
            await validateSchemaCommand.validateSchema(backendApischemas.generateShieldAddressSchemas, res.data)
            shieldInfo.tmpWalletAddress = res.data.Result.Address
            shieldInfo.shieldTokenFee = res.data.Result.EstimateFee
            logger.info(`BE wallet address:   ${shieldInfo.tmpWalletAddress}`)
            logger.info(`estimate shielding fee:  ${shieldInfo.shieldTokenFee} `)
        }).timeout(60000);
    })

    describe(`STEP_2 Deposit token`, async () => {
        it(`[2.1] Get balance before deposit`, async () => {
            accountInfoBefore.extTokenBal = await extAccount.getBalance()
            logger.info(`accountInfoBefore.extTokenBal: ${accountInfoBefore.extTokenBal}`)
            tmpWalletBal = await web3.eth.getBalance(shieldInfo.tmpWalletAddress)
            logger.info(`recever BE balance :  ${tmpWalletBal}`)
        }).timeout(60000);

        it(`[2.2] Deposit token`, async () => {
            logger.info(`sender ${extAccount.address}-- receiver ${shieldInfo.tmpWalletAddress}`)

            let resDeposit = await extAccount.sendNativeToken({
                to: shieldInfo.tmpWalletAddress,
                amount: web3.utils.toWei((shieldInfo.shieldAmt + shieldInfo.shieldTokenFee).toString(), 'ether')
            })
            await wait(15)

            shieldInfo.txDeposit = resDeposit.transactionHash
            console.log('deposit transaction hash : ', resDeposit.transactionHash)
            let resReceipt = await web3.eth.getTransactionReceipt(shieldInfo.txDeposit)
            chai.assert.isTrue(resReceipt.status)

            accountInfoAfter.extTokenBal = await extAccount.getBalance()
            await console.log('accountInfoAfter.extTokenBal: ', accountInfoAfter.extTokenBal)

            tmpWalletBal = await web3.eth.getBalance(shieldInfo.tmpWalletAddress)
            console.log('tmp Wallet Bal : ', tmpWalletBal)
        }).timeout(60000);
    })

    describe(`STEP_3 Verify record shield backend`, async () => {
        it('[3.1] Check balance Shield Fee Master Wallet', async () => {
            let balFeeMaster = await web3.eth.getBalance(MasterShieldFeeWallet)
            if (balFeeMaster < MIN_BAL_FEE_MASTER_WALLET) {
                SlackIntegrate.slackAlert('Need send more fee to Mater Fee Wallet ' + MasterShieldFeeWallet)
            }
            await chai.assert.isTrue(balFeeMaster > MIN_BAL_FEE_MASTER_WALLET )
        }).timeout(60000);
        it('[3.2] Call API backend to get new shielding ', async () => {
            let resBefore = await backendApi.historyByTokenAccount({
                WalletAddress : account.paymentK ,
                PrivacyTokenAddress : tokenUnifiedID
            })
            await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountSchemas, resBefore.data)
            shieldInfo.shieldBackendId = await account.waitForNewShieldRecord({
                tokenId: tokenUnifiedID,
                interval: shieldInfo.blockTime * 4,
                timedOut: shieldInfo.timeout
            })
            console.log('New ShieldID : ', shieldInfo.shieldBackendId)

            if (shieldInfo.shieldBackendId === 0) {
                SlackIntegrate.slackAlert(`Seem to be stuck in the backend -- not listened to tx deposit yet `)
            }
            await chai.assert.notEqual(shieldInfo.shieldBackendId, 0, 'Backend seems to be not creating new shield')
        }).timeout(900000);
        it('[3.3] Verify shielding detail', async () => {
            let resDetail = await backendApi.historyDetail({
                historyID: shieldInfo.shieldBackendId,
                CurrencyType: networkBridgeInfo.configInc.currencyType,
                Decentralized: networkBridgeInfo.configInc.decentralized
            })
            await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountDetailSchemas, resDetail.data)

            let timeOut  = shieldInfo.timeout
            while (resDetail.data.Result.Status != 12 ) {
                let tmp = await backendApi.historyDetail({
                    historyID: shieldInfo.shieldBackendId,
                    CurrencyType: networkBridgeInfo.configInc.currencyType,
                    Decentralized: networkBridgeInfo.configInc.decentralized
                })
                console.log('Shield status = ' + tmp.data.Result.Status + ' ---- ' + tmp.data.Result.StatusMessage + ' --- ' + tmp.data.Result.StatusDetail)
                resDetail.data.Result.Status = tmp.data.Result.Status
                if (resDetail.data.Result.Status === 12) {
                    console.log('Shielding successfull')
                    break
                }
                else if (timeOut <= 0) {
                    SlackIntegrate.slackAlert('Shielding over 10 minutes but not mint tokens yet -- shield Id = ' + shieldInfo.shieldBackendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    break
                }
                else if (resDetail.data.Result.Status === 16 || resDetail.data.Result.Status === 13 || resDetail.data.Result.Status === 14 || resDetail.data.Result.Status === 15 || resDetail.data.Result.Status === 5 || resDetail.data.Result.Status === 8) {
                    SlackIntegrate.slackAlert('Shield seem to be stuck in the backend -- shield Id = ' + shieldInfo.shieldBackendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    break
                }
                // await slack.send('send slack for fun -- shield Id = ' + shieldInfo.shieldBackendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                await wait(shieldInfo.blockTime * 5)
                timeOut -= (shieldInfo.blockTime * 5)
            }
        }).timeout(1200000);
    })
    describe(`STEP_4 Verify balance in Incognito`, async () => {
        it('Verify balance affter shield', async () => {
            await wait(shieldInfo.blockTime * 3)
            accountInfoAfter.incTokenBal = await account.useCli.getBalance(tokenUnifiedID)
            console.log('Token balance after shield: ', accountInfoAfter.incTokenBal)
            chai.assert.isTrue(accountInfoAfter.incTokenBal - accountInfoBefore.incTokenBal > 0, 'mint token unsuceessfull')
        }).timeout(100000);
    })
});


describe(`[======  ETHEREUM BRIDGE -- UNSHIELDING ====== ]`, async () => {
    const tokenID = ENV.Testbed.Tokens.ETH_ETH
    const tokenUnifiedID = ENV.Testbed.Tokens.ETH_UT
    let web3 = await new Web3(new Web3.providers.HttpProvider(ENV.Testbed.EthereumFullnode[0].url))

    let account = ACCOUNTS.Incognito.get(0)
    let extAccount = ACCOUNTS.Evm.get(0).setProvider(ENV.Testbed.EthereumFullnode[0].url)
    let backendApi = new BackendApi()

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
        timeout: 900,
        blockTime: 20,
        pTokenDecimal : 9
    }

    describe('UNSHIELDING ETH', async () => {
        it('Init data', async () => {
            accountInfoBefore.incTokenBal = await account.useCli.getBalance(tokenUnifiedID)
            await console.log('token balance on INC: ', accountInfoBefore.incTokenBal)
            accountInfoBefore.extTokenBal = await extAccount.getBalance()
            await console.log('token balance on external network : ', accountInfoBefore.extTokenBal)
        }).timeout(60000);
    })

    describe('STEP_1 Estimate Unshield Fee', async () => {
        it('Call API get estimate Fee and backend UnshielId', async () => {
            resEst = await backendApi.ethUnshieldEstFee({
                unshieldAmount : unshieldInfo.unshieldAmt,
                extRemoteAddr : extAccount.address,
                tokenId : tokenID,
                unifiedTokenId : tokenUnifiedID,
                IncPaymentAddr: account.paymentK,
                decimalPToken: unshieldInfo.pTokenDecimal
            })
            unshieldInfo.backendId = resEst.data.Result.ID
            unshieldInfo.unshieldTokenFee = resEst.data.Result.TokenFees.Level1
            unshieldInfo.feeAccount = resEst.data.Result.FeeAddress
            console.log('Response Estimate Unshield data :', resEst.data)
        }).timeout(60000);
    })

    describe(`STEP_2 Burn token`, async () => {
        it(`[2.1] Create unshield transaction by SDK `, async () => {
            await account.initSdkInstance();

            unshieldInfo.unshieldIncTx = await account.useSdk.unshieldUnifiedEvm({
                unshieldBackendId : unshieldInfo.backendId,
                tokenId : tokenID,
                unifiedTokenId : tokenUnifiedID,
                receiver : unshieldInfo.feeAccount,
                amount : unshieldInfo.unshieldAmt,
                amountFee : unshieldInfo.unshieldTokenFee,
                decimalPtoken: unshieldInfo.pTokenDecimal ,
                remoteAddress : extAccount.address
            })
            console.log('tx unshield : ' + unshieldInfo.unshieldIncTx)
            await wait(unshieldInfo.blockTime)
            let resTxHashDetail = await NODES.Incognito.getTransactionByHashRpc(unshieldInfo.unshieldIncTx)
            console.log('resTxHashDetail : ' + resTxHashDetail)

        }).timeout(100000);

        it(`[2.2] Submit unshield tx to backend`, async () => {
            let resSubmitTx = await backendApi.submutTxEthereumUnshield({
                currencyType: networkBridgeInfo.configInc.currencyType, //currencyType ETH
                unshieldAmount: unshieldInfo.unshieldAmt,
                decimalPToken : unshieldInfo.pTokenDecimal,
                extRemoteAddr : extAccount.address,
                tokenID : tokenID,
                rawTxId : unshieldInfo.unshieldIncTx,
                IncPaymentAddr : account.paymentK,
                id : unshieldInfo.backendId,
                userFeeSelection : 1,
                userFeeLevel : 1
            })
            console.log('Res submit tx to backend : ', resSubmitTx.data)
            await chai.assert.isTrue(resSubmitTx.data.Result, 'submit tx not success')
        }).timeout(60000);
    })

    describe(`STEP_3 Verify record unshield backend`, async () => {
        it('[3.1] Check balance Unhield Fee Master Wallet', async () => {
            let balFeeMaster = await web3.eth.getBalance(MasterUnshieldFeeWallet)
            if (balFeeMaster < MIN_BAL_FEE_MASTER_WALLET) {
                SlackIntegrate.slackAlert('Need send more fee to Mater Fee Wallet ' + MasterUnshieldFeeWallet)
            }
            await chai.assert.isTrue(balFeeMaster > MIN_BAL_FEE_MASTER_WALLET)
        }).timeout(60000);

        it('[3.2] Verify unshielding detail', async () => {
            let resDetail = await backendApi.historyDetail({
                historyID: unshieldInfo.backendId,
                CurrencyType: networkBridgeInfo.configInc.currencyType,
                Decentralized: networkBridgeInfo.configInc.decentralized
            })
            console.log(resDetail.data)
            await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountDetailSchemas, resDetail.data)
            let timeOut = unshieldInfo.timeout
            while (resDetail.data.Result.Status != 25) {
                let tmp = await backendApi.historyDetail({
                    historyID: unshieldInfo.backendId,
                    CurrencyType: networkBridgeInfo.configInc.currencyType,
                    Decentralized: networkBridgeInfo.configInc.decentralized
                })
                console.log('Unshield status = ' + tmp.data.Result.Status + ' ---- ' + tmp.data.Result.StatusMessage + ' --- ' + tmp.data.Result.StatusDetail)
                resDetail.data.Result.Status = tmp.data.Result.Status
                if (resDetail.data.Result.Status === 25) {
                    console.log('Unshielding successfull')
                    unshieldInfo.unshieldExtTx = tmp.data.Result.OutChainTx.substring(tmp.data.Result.OutChainTx.indexOf(`0x`))
                    break
                }
                else if (timeOut <= 0) {
                    SlackIntegrate.slackAlert('Unshield over 10 minutes but not completed yet -- unshield Id = ' + unshieldInfo.backendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    // await slack.send('Unshield over 10 minutes but not completed yet -- unshield Id = ' + unshieldInfo.backendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    break
                }
                else if (resDetail.data.Result.Status === 23 || resDetail.data.Result.Status === 26 || resDetail.data.Result.Status === 27 || resDetail.data.Result.Status === 28 || resDetail.data.Result.Status === 29 || resDetail.data.Result.Status === 33) {
                    SlackIntegrate.slackAlert('Unshield seem to be stuck in the backend -- unshield Id = ' + unshieldInfo.backendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    // await slack.send('Unshield seem to be stuck in the backend -- unshield Id = ' + unshieldInfo.backendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    break
                } else if (resDetail.data.Result.Status === 34) {
                    SlackIntegrate.slackAlert('NotEnoughVaultPleaseWait -- unshield Id = ' + unshieldInfo.backendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    // await slack.send('NotEnoughVaultPleaseWait -- unshield Id = ' + unshieldInfo.backendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                    break
                }
                unshieldInfo.unshieldExtTx = tmp.data.Result.OutChainTx.substring(tmp.data.Result.OutChainTx.indexOf(`0x`))
                // await slack.send('send slack for fun -- unshield Id = ' + unshieldInfo.backendId + ' in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusDetail)
                await wait(unshieldInfo.blockTime * 5)
                timeOut -= (unshieldInfo.blockTime * 5)
            }
        }).timeout(1200000);
    })

    describe(`STEP_4 Verify balance in Incognito`, async () => {
        it('Verify balance affter unshield', async () => {
            await wait(unshieldInfo.blockTime * 2)
            accountInfoAfter.incTokenBal = await account.useCli.getBalance(tokenUnifiedID)
            console.log('accountInfoAfter: ', accountInfoAfter.incTokenBal)
            chai.assert.notEqual(accountInfoBefore.incTokenBal, accountInfoAfter.incTokenBal, 'burn token unsuceessfull')
        })
    }).timeout(120000);

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
    }).timeout(120000);
})