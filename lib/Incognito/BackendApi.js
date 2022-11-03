const { BaseApi } = require('../Base/BaseApi');

class BackendApi extends BaseApi {
    async authProfile() {
        let path = `auth/profile`;
        return this.getWithAuth(path);
    }

    async disableFunctionConfig() {
        let path = `system/disable-function-configs`;
        return this.get(path);
    }

    async lastVersion() {
        let path = `system/ios/last-version`;
        return this.get(path);
    }

    //pancake
    async tradeToken() {
        let path = `trade/tokens`;
        return this.getWithAuth(path);
    }

    async uniswapToken() {
        let path = `uniswap/tokens`;
        return this.getWithAuth(path);
    }

    async curveToken() {
        let path = `curve/tokens`;
        return this.getWithAuth(path);
    }

    //pancale
    async tradeHistory(address) {
        let path = `trade/history?filter%5Bwallet_address%5D=${address}`;
        return this.getWithAuth(path);
    }

    async uniswapHistory(address) {
        let path = `uniswap/history?filter%5Bwallet_address%5D=${address}`;
        return this.getWithAuth(path);
    }

    async curveHistory(address) {
        let path = `curve/history?filter%5Bwallet_address%5D=${address}`;
        return this.getWithAuth(path);
    }

    async tradeRewardHistory(address) {
        let path = `trade/reward-history?filter%5Bwallet_address%5D=${address}`;
        return this.getWithAuth(path);
    }

    async uniswapRewardHistory(address) {
        let path = `uniswap/reward-history?filter%5Bwallet_address%5D=${address}`;
        return this.getWithAuth(path);
    }

    async curveRewardHistory(address) {
        let path = `curve/reward-history?filter%5Bwallet_address%5D=${address}`;
        return this.getWithAuth(path);
    }

    // shielding evm
    // Ethereum
    
    async ethGenerate(addressType = 1 ,
        walletAddress, 
        tokenId, 
        signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
        ) {
        let path = `eth/generate`
        let body = {
            "AddressType": addressType,
            "WalletAddress": walletAddress,
            "PrivacyTokenAddress": tokenId,
            "SignPublicKeyEncode" : signPublicKey
        }
        return this.postWithAuth(path, body)
    }

    async ethUnshieldEstFee(unshieldAmount ,
        addressType = 2 ,
        extRemoteAddr, 
        tokenId, 
        unifiedTokenId,
        IncPaymentAddr,
        decimalPToken = 9 ,
        signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
        ) {
        let path = `eth/estimate-fees`
        let body = {
            "RequestedAmount": unshieldAmount.toString(),
            "AddressType": addressType,
            "IncognitoAmount": (unshieldAmount * Number('1e' + decimalPToken)).toString(),
            "PaymentAddress": extRemoteAddr,
            "PrivacyTokenAddress": tokenId,
            "WalletAddress": IncPaymentAddr,
            "IncognitoTx": "",
            "UnifiedTokenID": unifiedTokenId,
            "SignPublicKeyEncode": signPublicKey
        }
        return this.postWithAuth(path, body)
    }

    async submutTxEthereumUnshield(
        currencyType = 1,
        addressType = 2 ,
        unshieldAmount,
        decimalPToken = 9,
        extRemoteAddr,
        tokenID,
        rawTxId,
        IncPaymentAddr,
        id ,
        userFeeSelection = 1,
        userFeeLevel =1,
        signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    ){
        let path = `eth/add-tx-withdraw`
        let body = {
            "CurrencyType": currencyType,
            "AddressType": addressType,
            "RequestedAmount": unshieldAmount.toString(),
            "IncognitoAmount": (unshieldAmount * Number('1e' + decimalPToken)).toString(),
            "PaymentAddress": extRemoteAddr,
            "Erc20TokenAddress": "",
            "PrivacyTokenAddress": tokenID,
            "IncognitoTx": rawTxId,
            "WalletAddress": IncPaymentAddr,
            "ID": id,
            "UserFeeSelection": userFeeSelection,
            "UserFeeLevel": userFeeLevel,
            "SignPublicKeyEncode": signPublicKey
        }
        return this.postWithAuth(path, body)
    }

    // BSC 


    async bscGenerate(addressType = 1,
        walletAddress,
        tokenId,
        signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    ) {
        let path = `bsc/generate`
        let body = {
            "AddressType": addressType,
            "WalletAddress": walletAddress,
            "PrivacyTokenAddress": tokenId,
            "SignPublicKeyEncode": signPublicKey
        }
        return this.postWithAuth(path, body)
    }

    async bscUnshieldEstFee(unshieldAmount,
        addressType = 2,
        extRemoteAddr,
        tokenId,
        unifiedTokenId,
        IncPaymentAddr,
        decimalPToken = 9,
        signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    ) {
        let path = `bsc/estimate-fees`
        let body = {
            "RequestedAmount": unshieldAmount.toString(),
            "AddressType": addressType,
            "IncognitoAmount": (unshieldAmount * Number('1e' + decimalPToken)).toString(),
            "PaymentAddress": extRemoteAddr,
            "PrivacyTokenAddress": tokenId,
            "WalletAddress": IncPaymentAddr,
            "IncognitoTx": "",
            "UnifiedTokenID": unifiedTokenId,
            "SignPublicKeyEncode": signPublicKey
        }
        return this.postWithAuth(path, body)
    }

    async submutTxBSCUnshield(
        currencyType = 7,
        addressType = 2,
        unshieldAmount,
        decimalPToken = 9,
        extRemoteAddr,
        tokenID,
        rawTxId,
        IncPaymentAddr,
        id ,
        userFeeSelection = 1,
        userFeeLevel = 1,
        signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    ) {
        let path = `bsc/add-tx-withdraw`
        let body = {
            "CurrencyType": currencyType,
            "AddressType": addressType,
            "RequestedAmount": unshieldAmount.toString(),
            "IncognitoAmount": (unshieldAmount * Number('1e' + decimalPToken)).toString(),
            "PaymentAddress": extRemoteAddr,
            "Erc20TokenAddress": "",
            "PrivacyTokenAddress": tokenID,
            "IncognitoTx": rawTxId,
            "WalletAddress": IncPaymentAddr,
            "ID": id,
            "UserFeeSelection": userFeeSelection,
            "UserFeeLevel": userFeeLevel,
            "SignPublicKeyEncode": signPublicKey
        }
        return this.postWithAuth(path, body)
    }
    // history shield + unshield EVM

    async historyByTokenAccount(WalletAddress,
        PrivacyTokenAddress,
        SignPublicKeyEncode ='f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
        ){
            let path = `eta/history`
            let body = {
                "WalletAddress": WalletAddress,
                "PrivacyTokenAddress": PrivacyTokenAddress,
                "SignPublicKeyEncode" : SignPublicKeyEncode
            }
            return this.postWithAuth(path, body)
        }

    async historyDetail(historyID,
        CurrencyType = 1,
        SignPublicKeyEncode ='f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a',
        Decentralized = 2
        ){
            let path = `eta/history/detail`
            let body = {
                "ID": historyID,
                "CurrencyType" : CurrencyType,
                "SignPublicKeyEncode" : SignPublicKeyEncode,
                'Decentralized' : Decentralized
            }
            return this.postWithAuth(path, body)
        }

    // PROVIDE
    async provideSubmitRawData({
        PStakeAddress,
        transactionID,
        base58Proof,
        amount = 1234000567,
        tokenID = '0000000000000000000000000000000000000000000000000000000000000004'
    }) {
        let path = `pool/staker/submit-rawdata`;
        let body = {
            PStakeAddress: PStakeAddress,
            SignPublicKeyEncode: '8a59a648a9cf47168e72e348b98d7bb296c67f7dd2d50cc9e043d2feb40b9cc8',
            IncognitoTx: transactionID,
            RawData: base58Proof,
            Amount: amount,
            TermID: 1,
            'g-recaptcha-response':
                '03AIIukzgv9Y-4kjH0tEqIsN4LlSbq-V932i16YkfFR9Of-cB7dg3WzDuSEDs_8ifBYE684-wDaV8upW9MQM9jx0UarrbetErL8Fri0wrt5XNKycKnfo7U16dvqiRZVJRpu1DeRlgzG1slfqRLkfFUnPl-jszpehkrcjk_kJyvhXNFRcgNWiasy9eUjJ6dfQ4BNh94by22CrV0wrn6XCj3gyUKyLaV3-pbxvPgWNchlCySmvD61pf2sRAEOg4J5MtMy4mxGQPqX1nZzxTPI2cvk2UsSnyr0VvjcaYXJQK0ZogfQfk_QdGKnGlBmlbah8_p465tokrRjauxRm9uALPtY-tiquKv48L-OV9YNmDOpJsTI4LxEPgtvEtMnb1R-rrIZIe5PqIwZR2GDkUFIajDaPLTCPImPZDUar9lssT0bUV5RZJ9mdeiol_eFXxhj7MJZ-tagjRl4oxuoLorAu4vZDEatlP7DWi8KQU5Up9IGVlNNQpqxYaWvSER1Adtbdkhy8Xf1QJi3yWR',
            CaptchaVersion: 'v3',
            TokenID: tokenID,
            Locked: false
        };
        return this.postWithAuth(path, body);
    }
}

module.exports = { BackendApi };
