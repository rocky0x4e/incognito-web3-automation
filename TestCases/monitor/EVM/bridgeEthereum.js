const Constants =require('../../../lib/Incognito/Constants');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const backendApischemas = require("../../../schemas/backendApi_schemas");
const { BackendApi } = require('../../../lib/Incognito/BackendApi')
const { IncAccount } = require('../../../lib/Incognito/Account/Account');
const { IncNode } = require('../../../lib/Incognito/IncNode');
const { CoinServiceApi } = require('../../../lib/Incognito/CoinServiceApi');
const { ENV } = require('../../../global');
// const addingContent = require('../../../testbase/addingContent');
const { wait } = require('../../../lib/Utils/Timer');
let fs = require('fs');
let Tx = require('ethereumjs-tx').Transaction;
let Common = require('ethereumjs-common').default;


let chai = require('chai');
let Web3 = require('web3');
let slackNotify = require('slack-notify');
const MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';


describe(`[ Ethereum brigde -- SHIELDING ]`, async() => {
    const extPrivateKey = '0xa5ae26c7154410df235bc8669ffd27c0fc9d3068c21e469a4cc68165c68cd5cb'
    const privateKey =`112t8rnX3VTd3MTWMpfbYP8HGY4ToAaLjrmUYzfjJBrAcb8iPLkNqvVDXWrLNiFV5yb2NBpR3FDZj3VW8GcLUwRdQ61hPMWP3YrREZAZ1UbH`
    const tokenID = Constants.TOKEN.ETH
    const tokenUnifiedID = Constants.TOKEN.UnifiedETH
    const fullnodeEVM = ENV.EthereumFullnode[0].url

    let node = await new IncNode()
    let account = await new IncAccount(privateKey).attachTo(node)
    let backendApi =await new BackendApi(ENV.Backend)
  
    let web3 = await new Web3(new Web3.providers.HttpProvider(fullnodeEVM))
    let extAccount = await web3.eth.accounts.privateKeyToAccount(extPrivateKey)
    let slack = await slackNotify(MY_SLACK_WEBHOOK_URL)
    const masterFeeWallet = '0xfebefa80332863d292c768dfed0a3f5bee74e632'
    let SignPublicKeyEncode ='f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a';
    
   
    const accountInfoBefore = {
        incTokenBal : 0,
        extTokenBal : 0
    }
    const accountInfoAfter = {
        incTokenBal : 0,
        extTokenBal : 0
    }

    const shieldInfo = {
        shieldAmt : 0.01, // ETH
        shieldBackendId : null,
        shieldPrvFee : 0,
        shieldTokenFee : 0,
        tmpWalletAddress : null,
        countWating : 5,
        txDeposit : null
    }
    
    describe.skip('SHIELDING ETHEREUM', async() => {
        it('Init data', async() => {
            accountInfoBefore.incTokenBal = await account.useCli.getBalance(tokenUnifiedID)
            await console.log('accountInfoBefore: ',accountInfoBefore.incTokenBal )
        })
    })

    describe.skip(`STEP_1 get shielding address and estimate shield fee`, async()=>{
        it('Call API backend..', async() => {
            let res = await backendApi.ethGenerate(1, account.paymentK, tokenID,SignPublicKeyEncode)
            await validateSchemaCommand.validateSchema(backendApischemas.generateShieldAddressSchemas,res.data)
            shieldInfo.tmpWalletAddress = res.data.Result.Address
            shieldInfo.shieldTokenFee = res.data.Result.EstimateFee
            console.log('tmp wallet address : ' + shieldInfo.tmpWalletAddress)
            console.log('estimate shielding fee : ' + shieldInfo.shieldTokenFee)
        })
    })

    describe.skip(`STEP_2 Deposit token`, async() => {
        it(`[2.1] Get balance before deposit`, async() =>{
            accountInfoBefore.extTokenBal = await web3.eth.getBalance(extAccount.address)
            console.log('accountInfoBefore.extTokenBal: ',accountInfoBefore.extTokenBal )
            tmpWalletBal = await web3.eth.getBalance(extAccount.address)
            console.log('tmpWalletBal: ',tmpWalletBal )
        })
        it(`[2.2] Deposit token`, async() =>{
            console.log('sender %s -- receiver %s ', extAccount.address, shieldInfo.tmpWalletAddress)
            let depositAmt = web3.utils.toWei((shieldInfo.shieldAmt + shieldInfo.shieldTokenFee).toString(), 'ether')

            let resDeposit = await sendNativeToken(
                extAccount.address,
                shieldInfo.tmpWalletAddress,
                extPrivateKey,
                depositAmt,
                fullnodeEVM
                )

            await wait(25)

            let resReceipt =await web3.eth.getTransactionReceipt(shieldInfo.txDeposit)
            chai.assert.isTrue(resReceipt.status)

            accountInfoAfter.extTokenBal = await web3.eth.getBalance(extAccount.address)
            console.log('accountInfoBefore.extTokenBal: ',accountInfoBefore.extTokenBal )
            tmpWalletBal = await web3.eth.getBalance(extAccount.address)
            console.log('tmpWalletBal new: ',tmpWalletBal )   
        })
    })

    describe.skip(`STEP_3 Verify record shield backend`, async() => {
        it('[3.1] Check balance Fee Master Wallet', async() => {
            let balFeeMaster = await web3.eth.getBalance(masterFeeWallet)
            if( balFeeMaster < (0.05 * 1e18) ){
                slack.send('Need send more fee to Mater Fee Wallet ' + masterFeeWallet )
            }
        })
        it('[3.2] Call API backend to get new shielding ', async() => {
            let resBefore = await backendApi.historyByTokenAccount(account.paymentK, tokenUnifiedID,SignPublicKeyEncode)
            await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountSchemas,resBefore.data)

            shieldInfo.shieldBackendId = await pickNewRecordBackend(
                account.paymentK, 
                tokenUnifiedID, 
                SignPublicKeyEncode, 
                shieldInfo.countWating
                )

            console.log('newShieldID : ', shieldInfo.shieldBackendId)
            if (shieldInfo.shieldBackendId === 0) {
                slack.send(`Seem to be stuck in backend -- don't listen tx deposit ` )
            }
            await chai.assert.notEqual(shieldInfo.shieldBackendId,0,'backend seem to be not create new shield')
        })
        it('[3.3] Verify shielding detail', async() => {
            let resDetail = await backendApi.historyDetail(shieldInfo.shieldBackendId, 1, SignPublicKeyEncode,2)
            await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountDetailSchemas,resDetail.data)

            let counter = 0 
            while(resDetail.data.Result.Status != 12){
                let tmp = await backendApi.historyDetail(shieldInfo.shieldBackendId,1,SignPublicKeyEncode,2)
                console.log('Shield status = ' +  tmp.data.Result.Status + ' ---- ' + tmp.data.Result.StatusMessage + ' --- '+ tmp.data.Result.StatusDetail)
                resDetail.data.Result.Status = tmp.data.Result.Status
                if(resDetail.data.Result.Status === 12 ){
                    console.log('Shielding successfull')
                    break
                }
                else if(counter === shieldInfo.countWating )
                {
                    slack.send('Shield over 10m but not mint token -- shield Id =  ' + shieldInfo.shieldBackendId + 'in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusMessage )
                    break
                }
                else if (resDetail.data.Result.Status === 16 ||resDetail.data.Result.Status === 13 || resDetail.data.Result.Status === 14 || resDetail.data.Result.Status === 15 || resDetail.data.Result.Status === 5 || resDetail.data.Result.Status === 8){
                    slack.send('Shield seem to be stuck -- shield Id =  ' + shieldInfo.shieldBackendId + 'in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusMessage )
                    break
                }
                await wait(120)
                await counter ++
            }
        })
    })
    describe.skip(`STEP_4 Verify balance in Incognito`, async() => {
        it('Verify balance affter shield', async() => {
            await wait(40)
            accountInfoAfter.incTokenBal = await account.useCli.getBalance(tokenUnifiedID)
            console.log('accountInfoAfter: ',accountInfoAfter.incTokenBal )
            chai.assert.isTrue(accountInfoAfter.incTokenBal - accountInfoBefore.incTokenBal > 0 , 'mint token unsuceessfull')
        })
    })
});




describe(`[Ethereum brigde -- UNSHIELDING]`, async() => {
    const extPrivateKey = '0xa5ae26c7154410df235bc8669ffd27c0fc9d3068c21e469a4cc68165c68cd5cb'
    const privateKey =`112t8rnX3VTd3MTWMpfbYP8HGY4ToAaLjrmUYzfjJBrAcb8iPLkNqvVDXWrLNiFV5yb2NBpR3FDZj3VW8GcLUwRdQ61hPMWP3YrREZAZ1UbH`
    const tokenID = Constants.TOKEN.ETH
    const tokenUnifiedID = Constants.TOKEN.UnifiedETH
    let SignPublicKeyEncode ='f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    const fullnodeEVM = ENV.EthereumFullnode[0].url
   
    let node = await new IncNode()
    let account = await new IncAccount(privateKey).attachTo(node)
    let backendApi =await new BackendApi(ENV.Backend)
    // let coinServiceApi = await new CoinServiceApi(ENV.CoinService)

    let slack = await slackNotify(MY_SLACK_WEBHOOK_URL)
    let web3 = await new Web3(new Web3.providers.HttpProvider(fullnodeEVM))
    let extAccount = await web3.eth.accounts.privateKeyToAccount(extPrivateKey)

   
    const accountInfoBefore = {
        incTokenBal : 0,
        extTokenBal : 0
    }
    const accountInfoAfter = {
        incTokenBal : 0,
        extTokenBal : 0
    }
    const unshieldInfo = {
        unshieldAmt : 0.05,
        unshieldPrvFee : 0,
        unshieldTokenFee : 0,
        backendId : null,
        feeAccount : null,
        unshieldExtTx : null,
        unshieldIncTx : null,
        rawData : null,
        countWating : 5
    }
    


    describe('UNSHIELDING ETH', async() => {
        it('Init data', async() => {
            accountInfoBefore.incTokenBal = await account.useCli.getBalance(tokenUnifiedID)
            await console.log('accountInfoBefore: ',accountInfoBefore.incTokenBal )
            accountInfoBefore.extTokenBal = await web3.eth.getBalance(extAccount.address)
            await console.log('accountInfoBefore.extTokenBal: ',accountInfoBefore.extTokenBal )
        })
    })
    
    describe('STEP_1 Estimate Unshield Fee', async() => {
        it('Call API get estimate Fee and backendUnshielId', async() => {
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

    describe(`STEP_2 Burn token`, async() => {
        it.skip(`[2.1] Create raw unshield transaction by SDK `, async() => {
                await account.initSdkInstance();

                let pushTx = await account.useSdk.unshieldUnifiedEvm(
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
                console.log('tx unshield : ' + pushTx )
                await wait(20)
                let res =  await account.useRpc.getTxByHash(pushTx)
                console.log('res get tx by hash : ' + res)

            })
        // it(`[2.2] Push raw data to CS`, async() => {
        //        let resPushTx =  await coinServiceApi.pushTx(unshieldInfo.rawData)
        //        unshieldInfo.unshieldIncTx = resPushTx.data.Result
        //        await chai.isNotNull(resSubmitTx.data.Result, 'push raw data not success')
        //     })
        it(`[2.3] Submit unshield tx to backend`, async() => {
                unshieldInfo.unshieldIncTx = '68caca8b2fd05bd77ae391e93c615c72a52fab01b71ed80fc20c07ad4df8a4c6'
                let resSubmitTx = await backendApi.submutTxUnshield(
                    1,
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
                console.log('asfsafasf : ' , resSubmitTx)
                await chai.assert.isTrue(resSubmitTx.data.Result, 'submit tx not success')
            })
        })

    describe.skip(`STEP_3 Verify record unshield backend`, async() => {
        it('[3.1] Waiting create unshielding record', async() => {
                let resBefore = await backendApi.historyByTokenAccount(account.paymentK, tokenUnifiedID,SignPublicKeyEncode)
                // console.log('aaaaa : ',resBefore.data)
                await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountSchemas,resBefore.data)
                let shieldId = await pickNewRecordBackend(
                    account.paymentK, 
                    tokenUnifiedID,
                    SignPublicKeyEncode, 
                    unshieldInfo.countWating
                    )
                console.log('newUnshieldID : ', unshieldID)
                chai.assert.equal(unshieldInfo.backendId, shieldId)
                if(unshieldInfo.backendId === shieldId ){
                    slack.send('backend seem to be stuck unshield ' + unshieldInfo.backendId )
                }
            })
        it('[3.2] Verify unshielding detail', async() => {
                let resDetail = await backendApi.historyDetail(unshieldInfo.backendId,1,SignPublicKeyEncode,2)
                console.log(resDetail.data)
                await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountDetailSchemas,resDetail.data)
                let counter = 0
                while(resDetail.data.Result.Status != 25){
                    let tmp = await backendApi.historyDetail(unshieldID,1,SignPublicKeyEncode,2)
                    console.log('Shield status = ' +  tmp.data.Result.Status + ' ---- ' + tmp.data.Result.StatusMessage + ' --- '+ tmp.data.Result.StatusDetail)
                    resDetail.data.Result.Status = tmp.data.Result.Status
                    if(resDetail.data.Result.Status === 25 ){
                        console.log('Unshielding successfull')
                        unshieldInfo.unshieldExtTx = tmp.data.Result.OutChainTx.substring(tmp.data.Result.OutChainTx.indexOf(`tx/`))
                        break
                    }
                    else if(counter === unshieldInfo.countWating )
                    {
                        slack.send('Unshield over 10m but not mint token -- unshield Id =  ' + unshieldInfo.backendId + 'in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusMessage )
                        break
                    }
                    else if (resDetail.data.Result.Status === 23 ||resDetail.data.Result.Status === 26 || resDetail.data.Result.Status === 27 || resDetail.data.Result.Status === 28 || resDetail.data.Result.Status === 29 || resDetail.data.Result.Status === 34 || resDetail.data.Result.Status === 33){
                        slack.send('Unshield seem to be stuck -- unshield Id =  ' + unshieldInfo.backendId + 'in status = ' + resDetail.data.Result.Status + ' --- ' + tmp.data.Result.StatusMessage )
                        break
                    }
                    await wait(120)
                    await counter++
                }
            })
        })

    describe.skip(`STEP_4 Verify balance in Incognito`, async() => {
        it('Verify balance affter shield', async() => {
                await wait(40)
                accountInfoAfter.incTokenBal = await account.useCli.getBalance(tokenUnifiedID)
                console.log('accountInfoAfter: ',accountInfoAfter.incTokenBal )
                chai.assert.notEqual(accountInfoBefore.incTokenBal,accountInfoAfter.incTokenBal, 'burn token unsuceessfull')
            })
        })

    describe.skip('STEP_5 Verify info on Ethereum', async()=>{
        it('Verify transaction', async() => {
            let res =await web3.eth.getTransactionReceipt(unshieldInfo.unshieldExtTx)
            chai.assert.isTrue(res.status)
        })
        it('Verify update balance', async() => {
            accountInfoAfter.extTokenBal = await web3.eth.getBalance(extAccount.address)
            console.log('New balance : ', accountInfoAfter.extTokenBal)
            chai.assert.notEqual(accountInfoBefore.extTokenBal, accountInfoAfter.extTokenBal, `account don't update balance`)
        })
    })
})




async function pickNewRecordBackend(
    WalletAddress,
    PrivacyTokenAddress,
    SignPublicKeyEncode ='f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a',
    countWating
    ) {
    let backendApi =await new BackendApi(ENV.Backend)
    let id = 0
    const resBefore = await backendApi.historyByTokenAccount(WalletAddress, PrivacyTokenAddress,SignPublicKeyEncode)
    console.log(resBefore.data)
    await validateSchemaCommand.validateSchema(backendApischemas.historyTokenAccountSchemas,resBefore.data)
  
    for (let i = 0 ; i < countWating; i++){
        let resAfter = await backendApi.historyByTokenAccount(WalletAddress, PrivacyTokenAddress,SignPublicKeyEncode)
        console.log('resAfter.data.Result.length = ' + resAfter.data.Result.length + ' ---- ' + 'resBefore.data.Result.length = ' + resBefore.data.Result.length   )
        console.log ('[Round %d ] Waiting backend listen tx shield .... ', i+1)
        if(resAfter.data.Result.length > resBefore.data.Result.length) {
            const idList = []
            for (const iterator of resAfter.data.Result) {
                idList.push(iterator.ID)
            }
            id = idList.sort(function(a, b){return b - a});
            return id[0]
        }
        await wait(120) 
    }
    return id
}

async function sendNativeToken(fromAddress, toAddress, pk, amountToSend, networkNode){
    let  web3 = await new Web3(new Web3.providers.HttpProvider(networkNode))
    let privateKey =await Buffer.from(pk.slice(2), 'hex')
    let count = await web3.eth.getTransactionCount(fromAddress)

    let rawTransaction = {
        "gasPrice": web3.utils.toHex(web3.utils.toWei('90', 'gwei')),
        "gasLimit": web3.utils.toHex(220000),
        "to": toAddress,
        "value": web3.utils.toHex(amountToSend),
        "nonce": web3.utils.toHex(count)
    }

    let transaction = new Tx(rawTransaction, { chain: 'goerli'})
    transaction.sign(privateKey)

    let result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
    console.log(result)
    return result
}