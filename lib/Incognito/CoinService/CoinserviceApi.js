const axios = require("axios");
const { CS } = require("../Constants");

class BaseCoinServiceApi {
    DEFAULT_HEADER = { 'Content-Type': 'application/json' }
    constructor(url = CS.url) {
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
        if (CS.listToken.length == 0) {
            CS.listToken = await this.getListToken()
        } return CS.listToken
    }

    async initListPoolVerify() {
        if (CS.listPoolVerify.length == 0) {
            CS.listPoolVerify = (await this.get("pdex/v3/listpools?pair=all&verify=true")).data.Result
        }
    }

    async getPoolInfo(poolID) {
        this.initListPoolVerify()
        for (const pool of CS.listPoolVerify) {
            if (pool.PoolID == poolID) {
                return pool
            }
        }
    }

    async getTokenSymbol(tokenID) {
        await this.initListToken()
        for (const token of CS.listToken) {
            if (token.TokenID == tokenID) {
                return token.Symbol
            }
        }
    }

    async getTokenNetwork(tokenID) {
        await this.initListToken()
        for (const token of CS.listToken) {
            if (token.TokenID == tokenID) {
                return token.Network
            }
        }
    }

    async getTokenInfoFromContract(contractID) {
        await this.initListToken()
        for (const token of CS.listToken) {
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
        for (const token of CS.listToken) {
            if (token.TokenID == tokenID) {
                return token.PDecimals
            }
        }
    }

    async getTokenDecimalPow(tokenID) {
        await this.initListToken()
        for (const token of CS.listToken) {
            if (token.TokenID == tokenID) {
                return Math.pow(10, token.PDecimals)
            }
        }
    }

    async getTokenPriceUSD(tokenID) {
        await this.initListToken()
        for (const token of CS.listToken) {
            if (token.TokenID == tokenID) {
                return token.PriceUsd
            }
        }
    }

    async getTokenPricePRV(tokenID) {
        await this.initListToken()
        for (const token of CS.listToken) {
            if (token.TokenID == tokenID) {
                return token.PricePrv
            }
        }
    }

    async getTokenCurrencyType(tokenID) {
        await this.initListToken()
        for (const token of CS.listToken) {
            if (token.TokenID == tokenID) {
                return token.CurrencyType
            }
        }
    }

    async getTokenContract(tokenID, network = null) {
        await this.initListToken()
        var tokenMatch = CS.listToken.find(element => element.TokenID == tokenID)
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

    async getKeyInfo(otaKey) {
        let response = await this.get(`getkeyinfo?key=${otaKey}&version=2`)
        if (response.data.Result && response.data.Result.coinindex) {
            let coinindex = await response.data.Result.coinindex
            return coinindex
        }
        return null
    }
}

module.exports = { CoinServiceApi }