const INC = require('incognito-chain-web-js');
const csCommonFunction = require("./csCommonFunction");
const config = require("./config");
const commonFunction = require("./commonFunction");

const {
    Wallet,
    Account: AccountWallet,
    init,
    PDexV3,
    wasm,
} = INC;

let account

const initAccount = async(privateKey) => {
    account = await importAccount(privateKey)
    return account
}

const checkBalance = async({ account, otaKey }) => {
    let balanceResult = {}

    let coinIndex = await csCommonFunction.getKeyInfoCoinIndex(otaKey)
        // console.log({ coinIndex });
    const tasks1 = Object.keys(coinIndex).map(async tokenID => {
        const balance = await account.accountSender.getBalance({
            tokenID: tokenID,
            version: 2
        })

        if (balance > 0) {
            balanceResult[tokenID] = parseInt(balance)
        }
    })

    await Promise.all(tasks1)

    return balanceResult;
}

const checkBalanceSignleThread = async({ account, otaKey }) => {
    let balanceResult = {}

    let coinIndex = await csCommonFunction.getKeyInfoCoinIndex(otaKey)
        // console.log({ coinIndex });
    for (const tokenID of Object.keys(coinIndex)) {
        const balance = await account.accountSender.getBalance({
            tokenID: tokenID,
            version: 2
        })
        if (balance > 0) {
            balanceResult[tokenID] = parseInt(balance)
        }
        // console.log('====> ', tokenID, balance);
        await commonFunction.sleep(500)
    }
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

const send1 = async(
    account,
    paymentAddress,
    amountTransfer,
    networkFee = 100,
    info = "",
    version = 2
) => {
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

const swap = async({
    account,
    tokenIDToSell,
    sellAmount,
    tokenIDToBuy,
    tradingFee,
    tradePath,
    feetoken,
    version = 2,
    minAcceptableAmount,
    networkFee = 100,
    info = ''
}) => {
    // create and send PRV
    try {
        let res = await account.pDexV3Instance.createAndSendSwapRequestTx({
            transfer: {
                fee: networkFee, //PRV
                info
            },
            extra: {
                tokenIDToSell,
                sellAmount: String(sellAmount),
                tokenIDToBuy,
                tradingFee,
                tradePath,
                feetoken,
                version,
                minAcceptableAmount: String(minAcceptableAmount)
            }
        });
        return res.txId;
    } catch (e) {
        console.log("Error when createAndSendSwapRequestTx: ", e);
    }
}

const getNFTTokenData = async({
    account,
    version = 2,
}) => {
    // create and send PRV
    try {
        let res = await account.pDexV3Instance.getNFTTokenData({
            version
        });
        return res.list;
    } catch (e) {
        console.log("Error when getNFTTokenData: ", e);
    }
}

const addOrder = async({
    account,
    version = 2,
    info = '',
    networkFee = 100,
    //extra
    tokenIDToSell,
    poolPairID,
    sellAmount,
    minAcceptableAmount,
    tokenIDToBuy,
}) => {
    // create and send PRV
    try {
        let res = await account.pDexV3Instance.createAndSendOrderRequestTx({
            transfer: {
                fee: networkFee, //PRV
                info
            },
            extra: {
                tokenIDToSell,
                poolPairID,
                sellAmount: String(sellAmount),
                version,
                minAcceptableAmount: String(minAcceptableAmount),
                tokenIDToBuy,
            }
        });
        return res.txId;
    } catch (e) {
        console.log("Error when createAndSendOrderRequestTx: ", e);
    }
}

const cancelOrder = async({
    account,
    version = 2,
    info = '',
    networkFee = 100,
    //extra
    token1ID,
    token2ID,
    poolPairID,
    orderID,
    amount = '0',
    txType = 0,
    nftID

}) => {
    // create and send PRV
    try {
        let res = await account.pDexV3Instance.createAndSendWithdrawOrderRequestTx({
            transfer: {
                fee: networkFee, //PRV
                info
            },
            extra: {
                withdrawTokenIDs: [token1ID, token2ID],
                poolPairID,
                orderID,
                amount: '0',
                version,
                txType,
                nftID,
            }
        });
        return res.txId;
    } catch (e) {
        console.log("Error when createAndSendWithdrawOrderRequestTx: ", e);
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

const importAccount = async(privateKey) => {
    await init();

    const SERVICE = {
        fullNode: global.urlFullNode,
        coinService: global.urlCoinService,
        pubsubService: global.urlPubsubService,
        requestService: global.urlCoinService,
        apiService: global.urlBackend,
        portalService: 'https://api-portalv4.incognito.org',
        shardCount: 8,
    }

    await wasm.setShardCount('', SERVICE.shardCount);
    let localStorage;
    if (typeof localStorage === "undefined" || localStorage === null) {
        // var LocalStorage = require('store2');
        var LocalStorage = require('node-localstorage').LocalStorage;
        // var LocalStorage = window.localStorage
        localStorage = new LocalStorage('./scratch', 2000000000);
    }
    let accountSender;
    let pDexV3Instance = new PDexV3();
    let authToken = new Date().getTime();
    authToken = String(authToken)
    try {
        console.log('hoanh3', SERVICE);
        accountSender = new AccountWallet(Wallet);
        accountSender.setRPCCoinServices(SERVICE.coinService);
        accountSender.setRPCClient(SERVICE.fullNode);
        accountSender.setRPCTxServices(SERVICE.pubsubService);
        accountSender.setRPCRequestServices(SERVICE.requestService);
        accountSender.setAuthToken(authToken);
        accountSender.setRPCApiServices(SERVICE.apiService, authToken);
        accountSender.setStorageServices(localStorage)

        await accountSender.setKey(privateKey);

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

const getNumberUtxo = async({
    account,
    tokenID,
    version = 2
}) => {
    const unspentCoins = await account.accountSender.getUnspentCoinsExcludeSpendingCoins({
        tokenID,
        version
    })
    return unspentCoins.length
}

const getUtxo = async({
    account,
    tokenID,
    version = 2
}) => {
    const unspentCoins = await account.accountSender.getUnspentCoinsExcludeSpendingCoins({
        tokenID,
        version
    })
    return unspentCoins
}


const consolidate = async({
    account,
    tokenId,
    version = 2,
}) => {
    try {
        let res = await account.accountSender.consolidate({
            transfer: {
                tokenID: tokenId
            },
            extra: { version: version },
        });

        let listTx = []
        for (const tx of res) {
            listTx.push(tx.txId)
        }
        return listTx
    } catch (e) {
        console.log("Error when consolidate : ", e);
    }
}

const splitPRV = async({
    account,
    number,
    paymentAddress,
    networkFee = 100,
    info = "",
    version = 2
}) => {

    //balance
    const balance = await account.accountSender.getBalance({
        tokenID: "0000000000000000000000000000000000000000000000000000000000000004",
        version: 2
    })
    let amountEach = Math.floor(balance / number)

    let tokenPaymentInfo = [];
    for (let index = 0; index < number - 1; index++) {
        tokenPaymentInfo.push({
            PaymentAddress: paymentAddress,
            Amount: amountEach,
            Message: info,
        })
    }
    try {
        let res = await account.accountSender.createAndSendNativeToken({
            transfer: {
                prvPayments: tokenPaymentInfo,
                fee: networkFee,
                info
            },
            extra: {
                isEncryptMessage: true,
                txType: 0,
                version: version
            },
        });
        // console.log("Send tx succesfully with TxID: ", res);
        return res.txId;
    } catch (e) {
        console.log("Error when transferring ptoken: ", e);
    }
}

const splitToken = async({
    account,
    number,
    paymentAddress,
    tokenID,
    networkFee = 100,
    info = "",
    version = 2
}) => {

    //balance
    const balance = await account.accountSender.getBalance({
        tokenID,
        version: 2
    })
    let amountEach = Math.floor(balance / number)
        // console.log({ amountEach });

    let tokenPaymentInfo = [];
    for (let index = 0; index < number - 1; index++) {
        tokenPaymentInfo.push({
            PaymentAddress: paymentAddress,
            Amount: amountEach,
            Message: info,
        })
    }
    // console.log({ tokenPaymentInfo });
    await account.accountSender.resetProgressTx();
    try {
        let res = await account.accountSender.createAndSendPrivacyToken({
            transfer: {
                tokenID: tokenID,
                tokenPayments: tokenPaymentInfo,
                fee: networkFee,
                info: info,
            },
            extra: { txType: 0, version: version },
        });
        console.log("Send tx succesfully with TxID: ", res);
        return res.txId;
    } catch (e) {
        console.log("Error when transferring ptoken: ", e);
    }
}


module.exports = {
    checkBalance,
    send,
    initAccount,
    sendToken,
    swap,
    addOrder,
    cancelOrder,
    getNFTTokenData,
    checkBalanceSignleThread,
    getNumberUtxo,
    consolidate,
    splitPRV,
    splitToken,
    getUtxo
}