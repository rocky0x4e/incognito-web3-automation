const INC = require('incognito-chain-web-js');
const cliCommonFunction = require("./cliCommonFunction");
const csCommonFunction = require("./csCommonFunction");
const commonFunction = require("./commonFunction");
const _ = require('lodash');

const {
    Wallet,
    Account: AccountWallet,
    init,
    PDexV3,
    wasm,
} = INC;

let account

const SERVICE = {
    fullNode: global.urlFullNode,
    coinService: global.urlCoinService,
    pubsubService: global.urlPubsubService,
    requestService: global.urlCoinService,
    apiService: global.urlBackend,
    portalService: 'https://api-portalv4.incognito.org',
    shardCount: 8,
}

const initAccount = async(privateKey) => {
    account = await importAccount({ privateKey })
    return account
}

const checkBalance = async(account) => {
    let balanceResult = {}
        // console.log('hoánh', account.account.privateKey);
    let otaKey = (await cliCommonFunction.keyInfo(account.account.privateKey)).OTAPrivateKey
        // console.log({ otaKey });

    let coinIndex = await csCommonFunction.getKeyInfoCoinIndex(otaKey)
        // console.log({ coinIndex });
    const tasks1 = Object.keys(coinIndex).map(async tokenID => {
        const balance = await account.account.accountSender.getBalance({
            tokenID: tokenID,
            version: 2
        })
        console.log({ balance });

        if (balance > 0) {
            balanceResult[tokenID] = parseInt(balance)
        }
    })

    await Promise.all(tasks1)

    let nftIndex = await csCommonFunction.getKeyInfoNftIndex(otaKey)
        // console.log({ nftIndex });
    const tasks2 = Object.keys(nftIndex).map(async tokenID => {
        const balance = await account.account.accountSender.getBalance({
            tokenID: tokenID,
            version: 1
        })

        if (balance > 0) {
            balanceResult[tokenID] = parseInt(balance)
        }
    })

    await Promise.all(tasks2)

    return balanceResult;
}

const send = async({
    account,
    paymentAddress,
    amountTransfer,
    networkFee = 100,
    info = "",
    version = 2
}) => {
    let paymentInfosParam = []
    paymentInfosParam[0] = {
        PaymentAddress: paymentAddress,
        Amount: amountTransfer,
        Message: info,
    };
    // create and send PRV
    try {
        let res = await account.accountSender.createAndSendNativeToken({
            transfer: {
                prvPayments: paymentInfosParam,
                fee: networkFee,
                info
            },
            extra: { isEncryptMessage: true, txType: 0, version },
        });
        // console.log("Send tx succesfully with TxID: ", res);
        return res.txId;
    } catch (e) {
        console.log("Error when send PRV: ", e);
    }
}

const sendToken = async({
    account,
    tokenId,
    paymentAddress,
    amountTransfer,
    networkFee = 100,
    info = "",
    version = 2
}) => {
    let tokenPaymentInfo = [{
        PaymentAddress: paymentAddress,
        Amount: amountTransfer,
        Message: info,
    }, ];
    let hasPrivacy = true;
    await account.accountSender.resetProgressTx();
    try {
        let res = await account.accountSender.createAndSendPrivacyToken({
            transfer: {
                tokenID: tokenId,
                tokenPayments: tokenPaymentInfo,
                fee: networkFee,
                info: info,
            },
            extra: { txType: 0, version: version },
        });
        // console.log("Send tx succesfully with TxID: ", res);
        return res.txId;
    } catch (e) {
        console.log("Error when transferring ptoken: ", e);
    }
}

const importAccount = async(account) => {
    await init();
    await wasm.setShardCount('', SERVICE.shardCount);
    let localStorage;
    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
    }
    let accountSender;
    let pDexV3Instance = new PDexV3();
    let authToken = new Date().getTime();
    authToken = String(authToken)
    try {
        accountSender = new AccountWallet(Wallet);
        accountSender.setRPCCoinServices(SERVICE.coinService);
        accountSender.setRPCClient(SERVICE.fullNode);
        accountSender.setRPCTxServices(SERVICE.pubsubService);
        accountSender.setRPCRequestServices(SERVICE.requestService);
        accountSender.setAuthToken(authToken);
        accountSender.setRPCApiServices(SERVICE.apiService, authToken);
        accountSender.setStorageServices(localStorage)

        await accountSender.setKey(account.privateKey);

        /**---> Config pdex3 instance <---*/
        pDexV3Instance.setAccount(accountSender);
        pDexV3Instance.setAuthToken(authToken);
        pDexV3Instance.setRPCTradeService(SERVICE.coinService);
        pDexV3Instance.setRPCClient(SERVICE.fullNode);
        pDexV3Instance.setStorageServices(localStorage);
        pDexV3Instance.setRPCApiServices(SERVICE.apiService);
    } catch (error) {
        console.log('import account error: ', error);
    }
    return {
        ...account,
        accountSender,
        pDexV3Instance,
    }
}


module.exports = {
    checkBalance,
    send,
    initAccount,
    sendToken
}