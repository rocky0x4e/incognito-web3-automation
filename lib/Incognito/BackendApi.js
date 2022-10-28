const AddingContent = require("../Utils/AddingContent");
const { BaseApi } = require("../Base/BaseApi");

class BackendApi extends BaseApi {

    async authProfile() {
        let path = `auth/profile`
        return this.getWithAuth(path)
    }

    async disableFunctionConfig() {
        let path = `system/disable-function-configs`
        return this.get(path)
    }

    async lastVersion() {
        let path = `system/ios/last-version`
        return this.get(path)
    }

    //pancake
    async tradeToken() {
        let path = `trade/tokens`
        return this.getWithAuth(path)
    }

    async uniswapToken() {
        let path = `uniswap/tokens`
        return this.getWithAuth(path)
    }

    async curveToken() {
        let path = `curve/tokens`
        return this.getWithAuth(path)
    }

    //pancale
    async tradeHistory(address) {
        let path = `trade/history?filter%5Bwallet_address%5D=${address}`
        return this.getWithAuth(path)
    }

    async uniswapHistory(address) {
        let path = `uniswap/history?filter%5Bwallet_address%5D=${address}`
        return this.getWithAuth(path)
    }

    async curveHistory(address) {
        let path = `curve/history?filter%5Bwallet_address%5D=${address}`
        return this.getWithAuth(path)
    }

    async tradeRewardHistory(address) {
        let path = `trade/reward-history?filter%5Bwallet_address%5D=${address}`
        return this.getWithAuth(path)
    }

    async uniswapRewardHistory(address) {
        let path = `uniswap/reward-history?filter%5Bwallet_address%5D=${address}`
        return this.getWithAuth(path)
    }

    async curveRewardHistory(address) {
        let path = `curve/reward-history?filter%5Bwallet_address%5D=${address}`
        return this.getWithAuth(path)
    }

    async otaGenerateShield({
        CurrencyType,
        PaymentAddress,
        PrivacyTokenAddress,
        AddressType = 1,
        NewShieldDecentralized = 1,
        SignPublicKeyEncode = '7974e5e3bc278c43a800d08efae659b68f1ed61be697c6ef0371ff732097d650'
    }) {
        let path = `ota/generate`
        let body = {
            CurrencyType,
            AddressType,
            PaymentAddress,
            WalletAddress: PaymentAddress,
            PrivacyTokenAddress,
            NewShieldDecentralized,
            SignPublicKeyEncode
        }

        return this.postWithAuth(path, body)
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
        let path = `ota/generate`
        let body = {
            "CurrencyType": currencyType,
            "AddressType": addressType,
            "RequestedAmount": requestedAmount,
            "IncognitoAmount": incognitoAmount,
            "PaymentAddress": paymentAddress,
            "WalletAddress": walletAddress,
            "PrivacyTokenAddress": privacyTokenAddress,
            "SignPublicKeyEncode": signPublicKeyEncode
        }

        return this.postWithAuth(path, body)
    }


}


module.exports = { BackendApi }