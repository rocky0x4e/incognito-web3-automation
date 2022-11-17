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

    let account = ACCOUNTS.Incognito.get(1)
    let backendApi = new BackendApi()
    let extAccount = ACCOUNTS.Evm.get(0).setProvider(ENV.Testbed.EthereumFullnode[0].url)

    let SignPublicKeyEncode = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a';

    const accountInfoBefore = {
        incTokenBal: 0,
        extTokenBal: 0
    }
    const accountInfoAfter = {
        incTokenBal: 0,
        extTokenBal: 0
    }

    const shieldInfo = {
        shieldPrvFee: 0,
        shieldTokenFee: 0,
    }
    const tmpAccount = new EvmAccount().setProvider(ENV.Testbed.EthereumFullnode[0].url)


    describe('SHIELDING', async () => {
        it('Initdata', async () => {
            accountInfoBefore.incTokenBal = await account.useCli.getBalance(tokenID)
            await console.log('accountInfoBefore: ', accountInfoBefore.incTokenBal)
        })
    })

    describe(`TC001_shielding_ETH`, async () => {
        it('STEP_01_Call_API_Gen_Shield_Address', async () => {
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
    describe(`TC002_Verify_record_shield_backend`, async () => {
        let shieldID
        it('Waiting create shielding record', async () => {
            let resBefore = await backendApi.historyByTokenAccount(account.paymentK, tokenUnifiedID, SignPublicKeyEncode)
            console.log('aaaaa : ', resBefore.data)
            await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountSchemas, resBefore.data)
            shieldID = await account.waitForNewShieldRecord({ tokenId: tokenUnifiedID })
            console.log('newShieldID : ', shieldID)
        })
        it('Verify shielding detail', async () => {
            let resDetail = await backendApi.historyDetail(shieldID, 1, SignPublicKeyEncode, 2)
            console.log(resDetail.data)
            await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountDetailSchemas, resDetail.data)

            while (resDetail.data.Result.Status != 12) {
                let tmp = await backendApi.historyDetail(shieldID, 1, SignPublicKeyEncode, 2)
                console.log('Shield status = ' + tmp.data.Result.Status + ' ---- ' + tmp.data.Result.StatusMessage + ' --- ' + tmp.data.Result.StatusDetail)
                resDetail.data.Result.Status = tmp.data.Result.Status
                if (resDetail.data.Result.Status === 12) {
                    console.log('Shielding successfull')
                    break
                }
                await wait(120)
            }
        })
    })
    describe(`TC003_Verify_balance_in_Incognito`, async () => {
        it('Verify balance affter shield', async () => {
            await wait(20)
            accountInfoAfter.incTokenBal = await account.useCli.getBalance(tokenID)
            console.log('accountInfoAfter: ', accountInfoAfter.incTokenBal)
            chai.assert.notEqual(accountInfoBefore.incTokenBal, accountInfoAfter.incTokenBal, 'mint token unsuceessfull')
        })
    })
})