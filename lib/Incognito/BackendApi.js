const { ENV } = require("../../global");
const { BaseApi } = require("../Base/BaseApi");

class BackendApi extends BaseApi {
    constructor(obj = ENV.Testbed.Incognito.Backend) {
        super(obj);
    }

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

    async otaGenerateShield({
        CurrencyType,
        PaymentAddress,
        PrivacyTokenAddress,
        AddressType = 1,
        NewShieldDecentralized = 1,
        SignPublicKeyEncode = "7974e5e3bc278c43a800d08efae659b68f1ed61be697c6ef0371ff732097d650",
    }) {
        let path = `ota/generate`;
        let body = {
            CurrencyType,
            AddressType,
            PaymentAddress,
            WalletAddress: PaymentAddress,
            PrivacyTokenAddress,
            NewShieldDecentralized,
            SignPublicKeyEncode,
        };

        return this.postWithAuth(path, body);
    }

    async otaGenerateUnShield({
        currencyType,
        requestedAmount, //"0,025"
        incognitoAmount, //25000000
        paymentAddress, //"zil1u2umu2kjpmlp48mu5akq2y82x98qcaz4my2yr5"
        walletAddress, //"12sveuNGdToMM98xz5Q8EKbkAtNoi6qsFdA4yei2wBe73X3Fwt5qDY6PHGvwxLVqDT8MMmGy7yuU4GzeJ6mCc7MJNYepC54jaWKxLW2kyWPhzQUuFm4FnK4QDr9fuj4cpvXqkm5PB9XXwXUyUniy"
        privacyTokenAddress,
        addressType = 2,
        signPublicKeyEncode = "7974e5e3bc278c43a800d08efae659b68f1ed61be697c6ef0371ff732097d650",
    }) {
        let path = `ota/generate`;
        let body = {
            CurrencyType: currencyType,
            AddressType: addressType,
            RequestedAmount: requestedAmount,
            IncognitoAmount: incognitoAmount,
            PaymentAddress: paymentAddress,
            WalletAddress: walletAddress,
            PrivacyTokenAddress: privacyTokenAddress,
            SignPublicKeyEncode: signPublicKeyEncode,
        };

        return this.postWithAuth(path, body);
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
            "SignPublicKeyEncode": signPublicKey
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

 // Polygon 

 async plgGenerate(addressType = 1,
    walletAddress,
    tokenId,
    signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
) {
    let path = `plg/generate`
    let body = {
        "AddressType": addressType,
        "WalletAddress": walletAddress,
        "PrivacyTokenAddress": tokenId,
        "SignPublicKeyEncode": signPublicKey
    }
    return this.postWithAuth(path, body)
}

async plgUnshieldEstFee(unshieldAmount,
    addressType = 2,
    extRemoteAddr,
    tokenId,
    unifiedTokenId,
    IncPaymentAddr,
    decimalPToken = 9,
    signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
) {
    let path = `plg/estimate-fees`
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

async submutTxPLGUnshield(
    currencyType ,
    addressType ,
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
    let path = `plg/add-tx-withdraw`
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


 // Fantom 


 async ftmGenerate(addressType = 1,
    walletAddress,
    tokenId,
    signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
) {
    let path = `ftm/generate`
    let body = {
        "AddressType": addressType,
        "WalletAddress": walletAddress,
        "PrivacyTokenAddress": tokenId,
        "SignPublicKeyEncode": signPublicKey
    }
    return this.postWithAuth(path, body)
}

async ftmUnshieldEstFee(unshieldAmount,
    addressType = 2,
    extRemoteAddr,
    tokenId,
    unifiedTokenId,
    IncPaymentAddr,
    decimalPToken = 9,
    signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
) {
    let path = `ftm/estimate-fees`
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

async submutTxFTMUnshield(
    currencyType ,
    addressType ,
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
    let path = `ftm/add-tx-withdraw`
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


    // Avax 


    async avaxGenerate(addressType = 1,
        walletAddress,
        tokenId,
        signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    ) {
        let path = `avax/generate`
        let body = {
            "AddressType": addressType,
            "WalletAddress": walletAddress,
            "PrivacyTokenAddress": tokenId,
            "SignPublicKeyEncode": signPublicKey
        }
        return this.postWithAuth(path, body)
    }

    async avaxUnshieldEstFee(unshieldAmount,
        addressType = 2,
        extRemoteAddr,
        tokenId,
        unifiedTokenId,
        IncPaymentAddr,
        decimalPToken = 9,
        signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    ) {
        let path = `avax/estimate-fees`
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

    async submutTxAvaxUnshield(
        currencyType,
        addressType,
        unshieldAmount,
        decimalPToken = 9,
        extRemoteAddr,
        tokenID,
        rawTxId,
        IncPaymentAddr,
        id,
        userFeeSelection = 1,
        userFeeLevel = 1,
        signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    ) {
        let path = `avax/add-tx-withdraw`
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

    // Aurora 

    async auroraGenerate(addressType = 1,
        walletAddress,
        tokenId,
        signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    ) {
        let path = `aurora/generate`
        let body = {
            "AddressType": addressType,
            "WalletAddress": walletAddress,
            "PrivacyTokenAddress": tokenId,
            "SignPublicKeyEncode": signPublicKey
        }
        return this.postWithAuth(path, body)
    }

    async auroraUnshieldEstFee(unshieldAmount,
        addressType = 2,
        extRemoteAddr,
        tokenId,
        unifiedTokenId,
        IncPaymentAddr,
        decimalPToken = 9,
        signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    ) {
        let path = `aurora/estimate-fees`
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

    async submutTxAuroraUnshield(
        currencyType,
        addressType,
        unshieldAmount,
        decimalPToken = 9,
        extRemoteAddr,
        tokenID,
        rawTxId,
        IncPaymentAddr,
        id,
        userFeeSelection = 1,
        userFeeLevel = 1,
        signPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    ) {
        let path = `aurora/add-tx-withdraw`
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
        SignPublicKeyEncode = "f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a"
    ) {
        let path = `eta/history`;
        let body = {
            WalletAddress: WalletAddress,
            PrivacyTokenAddress: PrivacyTokenAddress,
            SignPublicKeyEncode: SignPublicKeyEncode,
        };
        return this.postWithAuth(path, body);
    }

    async historyDetail(historyID,
        CurrencyType ,
        SignPublicKeyEncode ='f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a',
        Decentralized 
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
        tokenID = "0000000000000000000000000000000000000000000000000000000000000004",
    }) {
        let path = `pool/staker/submit-rawdata`;
        //"SignPublicKeyEncode": "8a59a648a9cf47168e72e348b98d7bb296c67f7dd2d50cc9e043d2feb40b9cc8", zxv
        let body = {
            PStakeAddress: PStakeAddress,
            SignPublicKeyEncode: "8a59a648a9cf47168e72e348b98d7bb296c67f7dd2d50cc9e043d2feb40b9cc8",
            IncognitoTx: transactionID,
            RawData: base58Proof,
            Amount: amount,
            TermID: 1,
            "g-recaptcha-response": "03AIIukzgv9Y-4kjH0tEqIsN4LlSbq-V932i16YkfFR9Of-cB7dg3WzDuSEDs_8ifBYE684-wDaV8upW9MQM9jx0UarrbetErL8Fri0wrt5XNKycKnfo7U16dvqiRZVJRpu1DeRlgzG1slfqRLkfFUnPl-jszpehkrcjk_kJyvhXNFRcgNWiasy9eUjJ6dfQ4BNh94by22CrV0wrn6XCj3gyUKyLaV3-pbxvPgWNchlCySmvD61pf2sRAEOg4J5MtMy4mxGQPqX1nZzxTPI2cvk2UsSnyr0VvjcaYXJQK0ZogfQfk_QdGKnGlBmlbah8_p465tokrRjauxRm9uALPtY-tiquKv48L-OV9YNmDOpJsTI4LxEPgtvEtMnb1R-rrIZIe5PqIwZR2GDkUFIajDaPLTCPImPZDUar9lssT0bUV5RZJ9mdeiol_eFXxhj7MJZ-tagjRl4oxuoLorAu4vZDEatlP7DWi8KQU5Up9IGVlNNQpqxYaWvSER1Adtbdkhy8Xf1QJi3yWR",
            CaptchaVersion: "v3",
            TokenID: tokenID,
            Locked: false,
        };
        let provideResponse = await this.postWithAuth(path, body);
        return provideResponse;
    }

    async provideRequestWithdrawReward({ PStakeAddress: PStakeAddress }) {
        let path = `pool/staker/withdraw-reward`;
        let body = {
            PStakeAddress: PStakeAddress,
            SignEncode: "18d72be162a68a0a5a97f5a41b45225b1a20cfc30f04755b6407b5164969de016fa7eb078a2ad47334967d0962af72b9cd6af656595730819e0e9c718be3110c",
            PaymentAddress: PStakeAddress,
            Amount: 0,
            "g-recaptcha-response": "03AIIukzjtMeP6k5Woqc1eYtcK87Aehpa1F5f5fVP27QvwG0QqlTYQnyCSoWt-bAuzQvUyhX8O-1ZuMBQfkZukAWRdr-C2-baMeb34JcNFF9dvo-0HTKUFg45UY_14uM4BkzLa_iC9L4AeimcgIMlitS1nShBpzZ798MSIGUgBaoataspp9T1O9iNRTNYvDKh7KEv6GgGOSEactwSpbEhMW0c--gbKZQoDmzTxrClONvz5KODkRpDz5IgxzWQ-_dzxHM3LQB90VLnYZohtBdVpq1avVFRWBtOjDuBDmjewXdciSVwXYH8Pd5M-YqWDlV293fFh06hsvyXeeb7Vv5HaUu39LX0tlQGnWUT2yXMUdr-GlqK5jHF_42XHoMQmXeJR65orUYtvy8hdFK09yi2Gq--3mJFM1leK5mHVcAl03suKUESBu3d3mQdL0vu3SoDlbBVJDl2OYqn_I-nmjSV_WnER4CwWqEA2Ygh0cv2yW82fmCsUhW_SDCPabuK_tXwMsF54IPVEslwk",
            CaptchaVersion: "v3",
        };
        let withdrawRewardResponse = await this.postWithAuth(path, body);
        return withdrawRewardResponse;
    }

    async provideRequestWithdrawProvision({
        PStakeAddress: PStakeAddress,
        amount: amount,
        tokenID = "0000000000000000000000000000000000000000000000000000000000000004",
    }) {
        let path = `pool/staker/create-unstake`;
        let body = {
            PStakeAddress: PStakeAddress,
            SignEncode: "cb3ccf455a288e0c2b62db7b17c85fd41431ef1f5bfd1d66831c829847d58b062a9eb5a5263aaacaec9af16003f4f38872bf364c72df53300907c5807d03cd08",
            PaymentAddress: PStakeAddress,
            Amount: amount,
            TokenID: tokenID,
            "g-recaptcha-response": "03AIIukzjtMeP6k5Woqc1eYtcK87Aehpa1F5f5fVP27QvwG0QqlTYQnyCSoWt-bAuzQvUyhX8O-1ZuMBQfkZukAWRdr-C2-baMeb34JcNFF9dvo-0HTKUFg45UY_14uM4BkzLa_iC9L4AeimcgIMlitS1nShBpzZ798MSIGUgBaoataspp9T1O9iNRTNYvDKh7KEv6GgGOSEactwSpbEhMW0c--gbKZQoDmzTxrClONvz5KODkRpDz5IgxzWQ-_dzxHM3LQB90VLnYZohtBdVpq1avVFRWBtOjDuBDmjewXdciSVwXYH8Pd5M-YqWDlV293fFh06hsvyXeeb7Vv5HaUu39LX0tlQGnWUT2yXMUdr-GlqK5jHF_42XHoMQmXeJR65orUYtvy8hdFK09yi2Gq--3mJFM1leK5mHVcAl03suKUESBu3d3mQdL0vu3SoDlbBVJDl2OYqn_I-nmjSV_WnER4CwWqEA2Ygh0cv2yW82fmCsUhW_SDCPabuK_tXwMsF54IPVEslwk",
            CaptchaVersion: "v3",
        };
        let withdrawProvisionResponse = await this.postWithAuth(path, body);
        return withdrawProvisionResponse;
    }

    // pNode
    async pNodeRequestWithdrawReward({ProductID = "b2ccea61-6b43-4545-8d81-a6e1cdc6a424",QRCode = "5P2B-GXHHWL", PaymentAddress= "12smWdiLHjGAHgaX9Qg71wSCS1iA3KaQfyVJ7mitX6GwKNAeGeZ6VtTCq96hcPQY1eBi6jBCtwfDmS7mAnHhRNWWhB369tXTctFbXy7uvmS4QSLKAhzdfw4xX9upys2hLqRDpJ8kJ6MDq1kqBDrC"}) {
        let path = `pool/request-withdraw`;
        let body = {
            "ProductID": ProductID,
            "ValidatorKey": "1234",
            "QRCode": QRCode,
            "PaymentAddress": PaymentAddress
        };
        let withdrawpNodeRewardResponse = await this.postWithAuth(path, body);
        return withdrawpNodeRewardResponse;
    }

    async getpNodeInfo(QRCode= "5P2B-GXHHWL") {
        let path = `pnode/get-node-info`;
        let body = [
            {
                "QRCode": QRCode
            }
        ];
        let getpNodeInfoResponse = await this.postWithAuth(path, body);
        // logger.info(`aa ${JSON.stringify(getpNodeInfoResponse.data.)}`)
        return getpNodeInfoResponse.data
        // return getpNodeInfoResponse.Result[0].Rewards[0].Amount;
    }
}

module.exports = { BackendApi };