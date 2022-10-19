const INC = require('incognito-chain-web-js');
const _ = require('lodash');

const {
    Wallet,
    Account: AccountWallet,
    init,
    PDexV3,
    wasm,
} = INC;


const SERVICE = {
    fullNode: global.urlFullNode,
    coinService: global.urlCoinService,
    pubsubService: global.urlPubsubService,
    requestService: global.urlCoinService,
    apiService: global.urlBackend,
    portalService: 'https://api-portalv4.incognito.org',
    shardCount: 8,
}

class IncSdk {

    async initAccount(privateKey) {
        account = await importAccount({ privateKey })
        return account
    }

    async checkBalance(account) {
        let balanceList = []
        let otaKey = (await cliCommonFunction.keyInfo(account.privateKey)).OTAPrivateKey

        let coinIndex = await csCommonFunction.getKeyInfo(otaKey)
        // console.log({ coinIndex });

        const tasks = Object.keys(coinIndex).map(async tokenID => {
            const balance = await account.accountSender.getBalance({
                tokenID: tokenID,
                version: 2
            })

            if (balance > 0) {
                balanceList.push({
                    tokenID,
                    balance
                })
            }
        })

        await Promise.all(tasks)

        balanceList = _.orderBy(balanceList, "tokenID")
        return balanceList;
    }

    async send(account, paymentAddress, amountTransfer, fee, info, version) {
        let paymentInfosParam = []
        paymentInfosParam[0] = {
            PaymentAddress: paymentAddress,
            Amount: amountTransfer,
            Message: info,
        };
        // create and send PRV
        try {
            let res = await account.accountSender.createAndSendNativeToken({
                transfer: { prvPayments: paymentInfosParam, fee, info },
                extra: { isEncryptMessage: true, txType: 0, version },
            });
            console.log("Send tx succesfully with TxID: ", res);
            return res;
        } catch (e) {
            console.log("Error when send PRV: ", e);
        }
    }

    async sendToken(account, tokenId, paymentAddress, amountTransfer, fee, info, version) {
        let tokenPaymentInfo = [{
            PaymentAddress: paymentAddress,
            Amount: amountTransfer,
            Message: info,
        },];
        let feePRV = fee;
        await account.accountSender.resetProgressTx();
        try {
            let res = await account.accountSender.createAndSendPrivacyToken({
                transfer: {
                    tokenID: tokenId,
                    tokenPayments: tokenPaymentInfo,
                    fee: feePRV,
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

    async importAccount(account) {
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

}

module.exports = { IncSdk }