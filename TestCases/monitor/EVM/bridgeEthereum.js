const Constants = require('../../../lib/Incognito/Constants');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const backendApischemas = require("../../../schemas/backendApi_schemas");
const { BackendApi } = require('../../../lib/Incognito/BackendApi')
const { IncAccount } = require('../../../lib/Incognito/Account/Account');
const { IncNode } = require('../../../lib/Incognito/IncNode');
const { ENV } = require('../../../global');
const { wait } = require('../../../lib/Utils/Timer');
let Tx = require('ethereumjs-tx').Transaction;
// const web3CommonFuntion = require('../../../constant/web3CommonFuntion');

let chai = require('chai');
let Web3 = require('web3');


describe(`[Ethereum brigde]`, async () => {
    const extPrivateKey = '0xd455f2de1aa18787ea5820afce2ae95b7405d11b9eb19d340f6f2d821047d437'
    const privateKey = `112t8rnX3VTd3MTWMpfbYP8HGY4ToAaLjrmUYzfjJBrAcb8iPLkNqvVDXWrLNiFV5yb2NBpR3FDZj3VW8GcLUwRdQ61hPMWP3YrREZAZ1UbH`
    const tokenID = Constants.TOKEN.ETH
    const tokenUnifiedID = Constants.TOKEN.UnifiedETH

    let node = new IncNode()
    let account = new IncAccount(privateKey).attachTo(node)
    let backendApi = new BackendApi()

    let web3 = await new Web3(new Web3.providers.HttpProvider())
    let extAccount = await web3.eth.accounts.privateKeyToAccount(extPrivateKey)

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
        tmpWalletAddress: null
    }


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
            shieldInfo.tmpWalletAddress = res.data.Result.Address
            shieldInfo.shieldTokenFee = res.data.Result.EstimateFee
            console.log('tmp wallet address : ' + shieldInfo.tmpWalletAddress)
            console.log('estimate shielding fee : ' + shieldInfo.shieldTokenFee)
        })
    })

    describe(`[WEB3] Deposit token`, async () => {
        it(`Get balance before deposit`, async () => {
            accountInfoBefore.extTokenBal = await web3.eth.getBalance(extAccount.address)
            await console.log('accountInfoBefore.extTokenBal: ', accountInfoBefore.extTokenBal)
            tmpWalletBal = await web3.eth.getBalance(extAccount.address)
            await console.log('tmpWalletBal: ', tmpWalletBal)
        });
        it(`Deposit token`, async () => {
            await console.log('sender %s -- receiver %s ', extAccount.address, shieldInfo.tmpWalletAddress)
            await sendNativeToken(extAccount.address, shieldInfo.tmpWalletAddress, extPrivateKey, (0.01 + shieldInfo.shieldTokenFee) * 1e18, ENV.EthereumFullnode[0].url)
            await wait(10)
            accountInfoAfter.extTokenBal = await web3.eth.getBalance(extAccount.address)
            await console.log('accountInfoBefore.extTokenBal: ', accountInfoBefore.extTokenBal)
            tmpWalletBal = await web3.eth.getBalance(extAccount.address)
            await console.log('tmpWalletBal new: ', tmpWalletBal)
        })
    })
    describe(`TC002_Verify_record_shield_backend`, async () => {
        let shieldID
        it('Waiting create shielding record', async () => {
            let resBefore = await backendApi.historyByTokenAccount(account.paymentK, tokenUnifiedID, SignPublicKeyEncode)
            console.log('aaaaa : ', resBefore.data)
            await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountSchemas, resBefore.data)
            shieldID = await pickNewShield(account.paymentK, tokenUnifiedID, SignPublicKeyEncode)
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


async function pickNewShield(WalletAddress,
    PrivacyTokenAddress,
    SignPublicKeyEncode = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
) {
    let backendApi = await new BackendApi()
    let id = 0
    const resBefore = await backendApi.historyByTokenAccount(WalletAddress, PrivacyTokenAddress, SignPublicKeyEncode)
    console.log(resBefore.data)
    await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountSchemas, resBefore.data)

    for (let i = 0; i < 5; i++) {
        let resAfter = await backendApi.historyByTokenAccount(WalletAddress, PrivacyTokenAddress, SignPublicKeyEncode)
        // console.log('resAfter.data.Result.length = ' + resAfter.data.Result.length + '----' + 'resBefore.data.Result.length = ' + resBefore.data.Result.length   )
        console.log('[ %d ] Waiting backend listen tx shield .... ', i + 1)
        if (resAfter.data.Result.length > resBefore.data.Result.length) {
            const idList = []
            for (const iterator of resAfter.data.Result) {
                idList.push(iterator.ID)
            }
            id = idList.sort(function (a, b) { return b - a });
            return id[0]
        }
        await wait(120)
    }
    return id
}


async function sendNativeToken(fromAddress, toAddress, pk, amountToSend, networkNode) {
    let web3 = await new Web3(new Web3.providers.HttpProvider(networkNode))
    let privateKey = await Buffer.from(pk.slice(2), 'hex')
    let count = await web3.eth.getTransactionCount(fromAddress)

    let rawTransaction = {
        "gasPrice": web3.utils.toHex(web3.utils.toWei('90', 'gwei')),
        "gasLimit": web3.utils.toHex(220000),
        "to": toAddress,
        "value": web3.utils.toHex(amountToSend),
        "nonce": web3.utils.toHex(count)
    }

    let transaction = new Tx(rawTransaction, { chain: 'goerli' })
    transaction.sign(privateKey)

    let result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
    console.log(result)
    return result
}
