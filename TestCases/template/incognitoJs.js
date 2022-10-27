const INC = require('incognito-chain-web-js');
const sdkCommonFunction = require("../../constant/sdkCommonFunction");
const csCommonFunction = require("../../constant/csCommonFunction");
const cliCommonFunction = require("../../constant/cliCommonFunction");
const commonFunction = require("../../constant/commonFunction");
const config = require("../../constant/config");

const {
    Wallet,
    Account: AccountWallet,
    init,
    PDexV3,
    wasm,
} = INC;

const SERVICE = {
    fullNode: 'https://lb-fullnode.incognito.org/fullnode',
    coinService: 'https://api-coinservice.incognito.org',
    pubsubService: 'https://api-coinservice.incognito.org/txservice',
    requestService: 'https://api-coinservice.incognito.org',
    apiService: 'https://api-service.incognito.org',
    portalService: 'https://api-portalv4.incognito.org',
    shardCount: 8,
}
const run = async() => {

    let amountTranfer = await commonFunction.randomNumber(100)
    console.log({ amountTranfer });

    let account1 = await config.getAccount("3")
    let account1Sdk = await sdkCommonFunction.initAccount(account1.privateKey)
        // console.log({ account1Sdk });

    // let account2 = await config.getAccount('2')
    // let account2Address = (await cliCommonFunction.keyInfo(account2.privateKey)).PaymentAddress

    //checkBalance

    let balance = await sdkCommonFunction.checkBalance({ account: account1Sdk })
    console.log({ balance });
    for (const item of Object.keys(balance)) {
        let name = await csCommonFunction.getTokenSymbol(item.tokenID)
        let network = await csCommonFunction.getTokenNetwork(item.tokenID)
        console.log(`${item.tokenID} - ${name} - ${network} : - ${item.balance}`);
    }

    // //send
    // let tx1 = await sdkCommonFunction.send(account1Sdk, account2Address, 1234, 200, 'hoanh', 2)
    // console.log({ tx1 });

    //send Token
    // let token = "ffd8d42dc40a8d166ea4848baf8b5f6e9fe0e9c30d60062eb7d44a8df9e00854"
    // let tx2 = await sdkCommonFunction.sendToken(account1Sdk, token, account2Address, 5678, 200, 'hoanh', 2)
    // console.log({ tx2 });
}

run()
