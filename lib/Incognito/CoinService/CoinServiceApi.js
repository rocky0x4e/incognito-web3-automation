const axios = require("axios");
const { ENV } = require("../../../global");

class BaseCoinServiceApi {
    static LIST_TOKEN = []
    static LIST_POOL_VERIFY = []
    static DEFAULT_HEADER = { 'Content-Type': 'application/json' }
    constructor(url = ENV.urlCoinService) {
        this.baseUrl = url
    }

    async get(path) {
        let response = await axios({
            url: `${this.baseUrl}/${path}`,
            method: 'GET',
            headers: BaseCoinServiceApi.DEFAULT_HEADER,
        })
        return response
    }

    async post(path, body) {
        let response = await axios({
            url: `${this.baseUrl}/${path}`,
            method: 'POST',
            headers: BaseCoinServiceApi.DEFAULT_HEADER,
            data: body,
        })
        return response
    }
}
class CoinServiceApi extends BaseCoinServiceApi {
    async getKey(privateKey) {
        return this.get(`wallet-info?privateKey=${privateKey}`)
    }

    async initListToken() {
        if (BaseCoinServiceApi.LIST_TOKEN.length == 0) {
            BaseCoinServiceApi.LIST_TOKEN = await this.getListToken()
        }
        return BaseCoinServiceApi.LIST_TOKEN
    }

    async initListPoolVerify() {
        if (BaseCoinServiceApi.LIST_POOL_VERIFY.length == 0) {
            BaseCoinServiceApi.LIST_POOL_VERIFY = (await this.get("pdex/v3/listpools?pair=all&verify=true")).data.Result
        }
    }

    async getPoolInfo(poolID) {
        this.initListPoolVerify()
        for (const pool of BaseCoinServiceApi.LIST_POOL_VERIFY) {
            if (pool.PoolID == poolID) {
                return pool
            }
        }
    }

    async getTokenSymbol(tokenID) {
        await this.initListToken()
        for (const token of BaseCoinServiceApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return token.Symbol
            }
        }
    }

    async getTokenNetwork(tokenID) {
        await this.initListToken()
        for (const token of BaseCoinServiceApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return token.Network
            }
        }
    }

    async getTokenInfoFromContract(contractID) {
        await this.initListToken()
        for (const token of BaseCoinServiceApi.LIST_TOKEN) {
            if (token.ContractID.toLowerCase() == contractID.toLowerCase()) {
                return token
            }
            if (token.ListChildToken && token.ListChildToken.length > 0) {
                for (const childToken of token.ListChildToken) {
                    if (childToken.ContractID.toLowerCase() == contractID.toLowerCase()) {
                        return token
                    }
                }
            }
        }
    }


    async getTokenDecimal(tokenID) {
        await this.initListToken()
        for (const token of BaseCoinServiceApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return token.PDecimals
            }
        }
    }

    async getTokenDecimalPow(tokenID) {
        await this.initListToken()
        for (const token of BaseCoinServiceApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return Math.pow(10, token.PDecimals)
            }
        }
    }

    async getTokenPriceUSD(tokenID) {
        await this.initListToken()
        for (const token of BaseCoinServiceApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return token.PriceUsd
            }
        }
    }

    async getTokenPricePRV(tokenID) {
        await this.initListToken()
        for (const token of BaseCoinServiceApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return token.PricePrv
            }
        }
    }

    async getTokenCurrencyType(tokenID) {
        await this.initListToken()
        for (const token of BaseCoinServiceApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return token.CurrencyType
            }
        }
    }

    async getTokenContract(tokenID, network = null) {
        await this.initListToken()
        var tokenMatch = BaseCoinServiceApi.LIST_TOKEN.find(element => element.TokenID == tokenID)
        if (typeof tokenMatch == "undefined") {
            console.debug("not found by token ID")
            return null
        }
        if (tokenMatch.CurrencyType != 25) {
            console.debug("type !=25 ")
            return tokenMatch.ContractID
        }
        var networkMatch = tokenMatch.ListUnifiedToken.find(element =>
            element.Network.toLowerCase().includes(network.toLowerCase()))

        return typeof networkMatch == "undefined" ? null : networkMatch.ContractID
    }

    async submitOtaKey(otaKey) {
        let response = await this.post("submitotakey", {
            "OTAKey": otaKey,
            "ShardID": 0
        })
        return response.data.Result
    }

    async getListToken() {
        let response = await this.get("coins/tokenlist")
        return response.data.Result
    }

    async getTokenInfo(listtokenID) {
        let response = await this.post("coins/tokeninfo", { "TokenIDs": listtokenID })
        return response.data.Result
    }

    async getCoinIndexAll(otaKey) {
        let response = await this.get(`getkeyinfo?key=${otaKey}&version=2`)
        return (response.data.Result) ? await response.data.Result : null
    }

    async getCoinIndex(otaKey) {
        let coinIndex = await this.getCoinIndexAll(otaKey)
        return (coinIndex.coinindex) ? coinIndex.coinindex : null

    }

    async getNtfIndex(otaKey) {
        let coinIndex = await this.getCoinIndexAll(otaKey)
        return (coinIndex.coinindex) ? coinIndex.nftindex : null
    }

    async poolShare(nftID) {
        return this.get(`pdex/v3/poolshare?nftid=${nftID}`)
    }

    async poolDetail({ poolIDs }) {
        let path = `pdex/v3/poolsdetail`
        let body = {
            poolIDs
        }
        return this.post(path, body)
    }

    async contributeHistory({
        nftID,
        limit = 1000,
        offset = 0
    }) {
        let path = `pdex/v3/contributehistory?nftid=${nftID}&limit=${limit}&offset=${offset}`

        return this.get(path)
    }

    async withdrawHistory({
        nftID,
        limit = 1000,
        offset = 0
    }) {
        let path = `pdex/v3/withdrawhistory?nftid=${nftID}&limit=${limit}&offset=${offset}`

        return this.get(path)
    }


    async withdrawFeeHistory({
        nftID,
        limit = 1000,
        offset = 0
    }) {
        let path = `pdex/v3/withdrawfeehistory?nftid=${nftID}&limit=${limit}&offset=${offset}`

        return this.get(path)
    }

    async tokenList() {
        let path = `coins/tokenlist`

        return this.get(path)
    }

    async listPools() {
        let path = `pdex/v3/listpools?pair=all`

        return this.get(path)
    }

    async listPairs() {
        let path = `pdex/v3/listpairs`

        return this.get(path)
    }


}

module.exports = { CoinServiceApi }