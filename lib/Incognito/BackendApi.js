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

    // shielding evm
    
    async ethGenerate(AddressType = 1 ,
        walletAddress, 
        tokenId, 
        SignPublicKey = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
        ) {
        let path = `eth/generate`
        let body = {
            "AddressType": AddressType,
            "WalletAddress": walletAddress,
            "PrivacyTokenAddress": tokenId,
            "SignPublicKeyEncode" : SignPublicKey
        }
        return this.postWithAuth(path, body)
    }

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

}


module.exports = { BackendApi }