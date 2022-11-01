const { ENV } = require("../../global");
const { BaseApi } = require("../Base/BaseApi");
const { getLogger } = require("../Utils/LoggingManager");
const logger = getLogger("CSApi")

class CoinServiceApi extends BaseApi {
    constructor(obj = ENV.CoinService) {
        super(obj)
    }

    async getKey(privateKey) {
        return this.get(`wallet-info?privateKey=${privateKey}`);
    }

    async initListToken() {
        if (BaseApi.LIST_TOKEN.length == 0) {
            BaseApi.LIST_TOKEN = await this.getListToken();
        }
        return BaseApi.LIST_TOKEN;
    }

    async initListPoolVerify() {
        if (BaseApi.LIST_POOL_VERIFY.length == 0) {
            BaseApi.LIST_POOL_VERIFY = (await this.get("pdex/v3/listpools?pair=all&verify=true")).data.Result;
        }
    }

    async getPoolInfo(poolID) {
        this.initListPoolVerify();
        for (const pool of BaseApi.LIST_POOL_VERIFY) {
            if (pool.PoolID == poolID) {
                return pool;
            }
        }
    }

    async getTokenSymbol(tokenID) {
        await this.initListToken();
        for (const token of BaseApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return token.Symbol;
            }
        }
    }

    async getTokenNetwork(tokenID) {
        await this.initListToken();
        for (const token of BaseApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return token.Network;
            }
        }
    }

    async getTokenInfoFromContract(contractID) {
        await this.initListToken();
        for (const token of BaseApi.LIST_TOKEN) {
            if (token.ContractID.toLowerCase() == contractID.toLowerCase()) {
                return token;
            }
            if (token.ListChildToken && token.ListChildToken.length > 0) {
                for (const childToken of token.ListChildToken) {
                    if (childToken.ContractID.toLowerCase() == contractID.toLowerCase()) {
                        return token;
                    }
                }
            }
        }
    }

    async getTokenDecimal(tokenID) {
        await this.initListToken();
        for (const token of BaseApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return token.PDecimals;
            }
        }
    }

    async getTokenDecimalPow(tokenID) {
        await this.initListToken();
        for (const token of BaseApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return Math.pow(10, token.PDecimals);
            }
        }
    }

    async getTokenPriceUSD(tokenID) {
        await this.initListToken();
        for (const token of BaseApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return token.PriceUsd;
            }
        }
    }

    async getTokenPricePRV(tokenID) {
        await this.initListToken();
        for (const token of BaseApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return token.PricePrv;
            }
        }
    }

    async getTokenCurrencyType(tokenID) {
        await this.initListToken();
        for (const token of BaseApi.LIST_TOKEN) {
            if (token.TokenID == tokenID) {
                return token.CurrencyType;
            }
        }
    }

    async getTokenContract(tokenID, network = null) {
        await this.initListToken();
        logger.debug("Finding token contract by ID")
        var tokenMatch = BaseApi.LIST_TOKEN.find((element) => element.TokenID == tokenID);
        if (typeof tokenMatch == "undefined") {
            logger.debug("not found by token ID");
            return null;
        }
        if (tokenMatch.CurrencyType != 25) {
            logger.debug("type !=25 ");
            return tokenMatch.ContractID;
        }
        var networkMatch = tokenMatch.ListUnifiedToken.find((element) => element.Network.toLowerCase().includes(network.toLowerCase()));

        return typeof networkMatch == "undefined" ? null : networkMatch.ContractID;
    }

    async submitOtaKey(otaKey) {
        let response = await this.post("submitotakey", {
            OTAKey: otaKey,
            ShardID: 0
        });
        return response.data.Result;
    }

    async getListToken() {
        let response = await this.get("coins/tokenlist");
        return response.data.Result;
    }

    async getTokenInfo(listtokenID) {
        let response = await this.post("coins/tokeninfo", { TokenIDs: listtokenID });
        return response.data.Result;
    }

    async getCoinIndexAll(otaKey) {
        let response = await this.get(`getkeyinfo?key=${otaKey}&version=2`);
        return response.data.Result ? await response.data.Result : null;
    }

    async getCoinIndex(otaKey) {
        let coinIndex = await this.getCoinIndexAll(otaKey);
        return coinIndex.coinindex ? coinIndex.coinindex : null;
    }

    async getNtfIndex(otaKey) {
        let coinIndex = await this.getCoinIndexAll(otaKey);
        return coinIndex.coinindex ? coinIndex.nftindex : null;
    }
    async poolShare(nftID) {
        return this.get(`pdex/v3/poolshare?nftid=${nftID}`);
    }

    async poolDetail({ poolIDs }) {
        let path = `pdex/v3/poolsdetail`;
        let body = {
            poolIDs
        };
        return this.post(path, body);
    }

    async contributeHistory({ nftID, limit = 1000, offset = 0 }) {
        let path = `pdex/v3/contributehistory?nftid=${nftID}&limit=${limit}&offset=${offset}`;

        return this.get(path);
    }

    async withdrawHistory({ nftID, limit = 1000, offset = 0 }) {
        let path = `pdex/v3/withdrawhistory?nftid=${nftID}&limit=${limit}&offset=${offset}`;

        return this.get(path);
    }

    async withdrawFeeHistory({ nftID, limit = 1000, offset = 0 }) {
        let path = `pdex/v3/withdrawfeehistory?nftid=${nftID}&limit=${limit}&offset=${offset}`;

        return this.get(path);
    }

    async tokenList() {
        let path = `coins/tokenlist`;

        return this.get(path);
    }

    async listPools() {
        let path = `pdex/v3/listpools?pair=all`;

        return this.get(path);
    }

    async listPairs() {
        let path = `pdex/v3/listpairs`;

        return this.get(path);
    }

    async tradeHistory({ otaKey }) {
        let path = `pdex/v3/tradehistory?otakey=${otaKey}&limit=1000000000&offset=0`;

        return this.get(path);
    }

    async estimateTrade({ tokenSell, tokenBuy, isMax = false, sellAmount }) {
        let path = `pdex/v3/estimatetrade?selltoken=${tokenSell}&buytoken=${tokenBuy}&ismax=${isMax}&sellamount=${sellAmount}`;

        return this.get(path);
    }

    async pendingOrder({ poolid }) {
        let path = `pdex/v3/pendingorder?poolid=${poolid}`;

        return this.get(path);
    }

    async pendingLimit({ ID }) {
        let path = `pdex/v3/pendinglimit`;
        let body = {
            ID: ID
        };
        return this.post(path, body);
    }

    async orderTradeHistory({ poolid, nftid, limit = 1000000000, offset = 0 }) {
        let path = `pdex/v3/tradehistory?poolid=${poolid}&nftid=${nftid}&limit=${limit}&offset=${offset}`;
        return this.get(path);
    }

    async getKeyInfo({ otaKey }) {
        let path = `getkeyinfo?key=${otaKey}&version=2`;
        return this.get(path);
    }

    async getKeyImage({ KeyImages, ShardID = 0 }) {
        let path = `checkkeyimages`;
        let body = {
            KeyImages: KeyImages,
            ShardID: ShardID
        };
        return this.post(path, body);
    }

    async tokenInfo({ TokenIDs }) {
        let path = `coins/tokeninfo`;
        let body = {
            TokenIDs: TokenIDs
        };
        return this.post(path, body);
    }

    async getTxsBySender({ ShardID = 0, Keyimages, Base58 = false }) {
        let path = `gettxsbysender`;
        let body = {
            ShardID,
            Keyimages,
            Base58
        };
        return this.post(path, body);
    }

    async getTxsByPubkey({ Pubkeys, Base58 = false }) {
        let path = `gettxsbypubkey`;
        let body = {
            Pubkeys,
            Base58
        };
        return this.post(path, body);
    }
}

module.exports = { CoinServiceApi };