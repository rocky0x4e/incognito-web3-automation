const { ENV } = require('../../global');
const { BaseApi } = require('../Base/BaseApi');
const { getLogger } = require('../Utils/LoggingManager');
const logger = getLogger('Provide');

class BackendApi extends BaseApi {
    constructor(obj = ENV.Backend) {
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
        SignPublicKeyEncode = '7974e5e3bc278c43a800d08efae659b68f1ed61be697c6ef0371ff732097d650'
    }) {
        let path = `ota/generate`;
        let body = {
            CurrencyType,
            AddressType,
            PaymentAddress,
            WalletAddress: PaymentAddress,
            PrivacyTokenAddress,
            NewShieldDecentralized,
            SignPublicKeyEncode
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
        signPublicKeyEncode = '7974e5e3bc278c43a800d08efae659b68f1ed61be697c6ef0371ff732097d650'
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
            SignPublicKeyEncode: signPublicKeyEncode
        };

        return this.postWithAuth(path, body);
    }

    // shielding evm

    async ethGenerate(AddressType = 1, walletAddress, tokenId, SignPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a') {
        let path = `eth/generate`;
        let body = {
            AddressType: AddressType,
            WalletAddress: walletAddress,
            PrivacyTokenAddress: tokenId,
            SignPublicKeyEncode: SignPublicKey
        };
        return this.postWithAuth(path, body);
    }

    async historyByTokenAccount(
        WalletAddress,
        PrivacyTokenAddress,
        SignPublicKeyEncode = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    ) {
        let path = `eta/history`;
        let body = {
            WalletAddress: WalletAddress,
            PrivacyTokenAddress: PrivacyTokenAddress,
            SignPublicKeyEncode: SignPublicKeyEncode
        };
        return this.postWithAuth(path, body);
    }

    async historyDetail(
        historyID,
        CurrencyType = 1,
        SignPublicKeyEncode = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a',
        Decentralized = 2
    ) {
        let path = `eta/history/detail`;
        let body = {
            ID: historyID,
            CurrencyType: CurrencyType,
            SignPublicKeyEncode: SignPublicKeyEncode,
            Decentralized: Decentralized
        };
        return this.postWithAuth(path, body);
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
        //"SignPublicKeyEncode": "8a59a648a9cf47168e72e348b98d7bb296c67f7dd2d50cc9e043d2feb40b9cc8", zxv
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
        try {
            let provideResponse = await this.postWithAuth(path, body);
            logger.debug(JSON.stringify(provideResponse));
            return { status: provideResponse.response.status, data: provideResponse.response.data };
        } catch (err) {
            logger.debug(`Exception error: ${err}`);
            return { status: err.response.status, data: err.response.data };
        }
    }

    async provideRequestWithdrawReward({ PStakeAddress: PStakeAddress }) {
        let path = `pool/staker/withdraw-reward`;
        let body = {
            PStakeAddress: PStakeAddress,
            SignEncode:
                '18d72be162a68a0a5a97f5a41b45225b1a20cfc30f04755b6407b5164969de016fa7eb078a2ad47334967d0962af72b9cd6af656595730819e0e9c718be3110c',
            PaymentAddress: PStakeAddress,
            Amount: 0,
            'g-recaptcha-response':
                '03AIIukzjtMeP6k5Woqc1eYtcK87Aehpa1F5f5fVP27QvwG0QqlTYQnyCSoWt-bAuzQvUyhX8O-1ZuMBQfkZukAWRdr-C2-baMeb34JcNFF9dvo-0HTKUFg45UY_14uM4BkzLa_iC9L4AeimcgIMlitS1nShBpzZ798MSIGUgBaoataspp9T1O9iNRTNYvDKh7KEv6GgGOSEactwSpbEhMW0c--gbKZQoDmzTxrClONvz5KODkRpDz5IgxzWQ-_dzxHM3LQB90VLnYZohtBdVpq1avVFRWBtOjDuBDmjewXdciSVwXYH8Pd5M-YqWDlV293fFh06hsvyXeeb7Vv5HaUu39LX0tlQGnWUT2yXMUdr-GlqK5jHF_42XHoMQmXeJR65orUYtvy8hdFK09yi2Gq--3mJFM1leK5mHVcAl03suKUESBu3d3mQdL0vu3SoDlbBVJDl2OYqn_I-nmjSV_WnER4CwWqEA2Ygh0cv2yW82fmCsUhW_SDCPabuK_tXwMsF54IPVEslwk',
            CaptchaVersion: 'v3'
        };
        try {
            let withdrawRewardResponse = await this.postWithAuth(path, body);
            logger.debug(JSON.stringify(withdrawRewardResponse));
            return { status: withdrawRewardResponse.response.status, data: withdrawRewardResponse.response.data };
        } catch (err) {
            logger.debug(`Exception error: ${err}`);
            return { status: err.response.status, data: err.response.data };
        }
    }

    async provideRequestWithdrawProvision({ PStakeAddress: PStakeAddress, amount: amount,tokenID = '0000000000000000000000000000000000000000000000000000000000000004' }) {
        let path = `pool/staker/create-unstake`;
        let body = {
            PStakeAddress: PStakeAddress,
            SignEncode:
                'cb3ccf455a288e0c2b62db7b17c85fd41431ef1f5bfd1d66831c829847d58b062a9eb5a5263aaacaec9af16003f4f38872bf364c72df53300907c5807d03cd08',
            PaymentAddress: PStakeAddress,
            Amount: amount,
            TokenID: tokenID,
            'g-recaptcha-response':
                '03AIIukzjtMeP6k5Woqc1eYtcK87Aehpa1F5f5fVP27QvwG0QqlTYQnyCSoWt-bAuzQvUyhX8O-1ZuMBQfkZukAWRdr-C2-baMeb34JcNFF9dvo-0HTKUFg45UY_14uM4BkzLa_iC9L4AeimcgIMlitS1nShBpzZ798MSIGUgBaoataspp9T1O9iNRTNYvDKh7KEv6GgGOSEactwSpbEhMW0c--gbKZQoDmzTxrClONvz5KODkRpDz5IgxzWQ-_dzxHM3LQB90VLnYZohtBdVpq1avVFRWBtOjDuBDmjewXdciSVwXYH8Pd5M-YqWDlV293fFh06hsvyXeeb7Vv5HaUu39LX0tlQGnWUT2yXMUdr-GlqK5jHF_42XHoMQmXeJR65orUYtvy8hdFK09yi2Gq--3mJFM1leK5mHVcAl03suKUESBu3d3mQdL0vu3SoDlbBVJDl2OYqn_I-nmjSV_WnER4CwWqEA2Ygh0cv2yW82fmCsUhW_SDCPabuK_tXwMsF54IPVEslwk',
            CaptchaVersion: 'v3'
        };
        try {
            let withdrawProvisionResponse = await this.postWithAuth(path, body);
            logger.debug(JSON.stringify(withdrawProvisionResponse));
            return { status: withdrawProvisionResponse.response.status, data: withdrawProvisionResponse.response.data };
        } catch (err) {
            logger.debug(`Exception error: ${err}`);
            return { status: err.response.status, data: err.response.data };
        }
    }
}

module.exports = { BackendApi };
