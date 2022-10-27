const api = require('./api');
const fs = require('fs')
const config = require('./config')
const _ = require('lodash')

let listTokenCS = []
let listPoolVerifyCS = []

const getKey = async(privateKey) => {
    // console.log( global.urlBackendTool)

    let url = global.urlBackendTool + `/wallet-info?privateKey=${privateKey}`

    // console.log({ url });
    let response = await api.get(url)
    return response
}

const initListTokenCS = async() => {
    // console.log( global.urlBackendTool)

    let url = global.urlCoinService + `/coins/tokenlist`

    // console.log({ url });
    let response = await api.get(url)
    listTokenCS = response.Result
}

const initListPoolVerifyCS = async() => {

    let url = global.urlCoinService + `/pdex/v3/listpools?pair=all&verify=true`

    // console.log({ url });
    let response = await api.get(url)
    listPoolVerifyCS = response.Result
}

const getPoolInfo = async(poolID) => {
    // console.log( global.urlBackendTool)

    if (!listPoolVerifyCS || listPoolVerifyCS.length == 0) {
        await initListPoolVerifyCS()
    }
    for (const pool of listPoolVerifyCS) {
        if (pool.PoolID == poolID) {
            return pool
        }
    }
}

const getTokenSymbol = async(tokenID) => {

    if (!listTokenCS || listTokenCS.length == 0) {
        await initListTokenCS()
    }
    for (const token of listTokenCS) {
        if (token.TokenID == tokenID) {
            return token.Symbol
        }
    }
}

const getTokenNetwork = async(tokenID) => {

    if (!listTokenCS || listTokenCS.length == 0) {
        await initListTokenCS()
    }
    for (const token of listTokenCS) {
        if (token.TokenID == tokenID) {
            return token.Network
        }
    }
}

const getTokenInfoFromContract = async(contractID) => {

    if (!listTokenCS || listTokenCS.length == 0) {
        await initListTokenCS()
    }
    // console.log({ listTokenCS });
    for (const token of listTokenCS) {
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


const getTokenDecimal = async(tokenID) => {

    if (!listTokenCS || listTokenCS.length == 0) {
        await initListTokenCS()
    }
    for (const token of listTokenCS) {
        if (token.TokenID == tokenID) {
            return token.PDecimals
        }
    }
}

const getTokenDecimalPow = async(tokenID) => {

    if (!listTokenCS || listTokenCS.length == 0) {
        await initListTokenCS()
    }
    for (const token of listTokenCS) {
        if (token.TokenID == tokenID) {
            return Math.pow(10, token.PDecimals)
        }
    }
}

const getTokenPriceUSD = async(tokenID) => {

    if (!listTokenCS || listTokenCS.length == 0) {
        await initListTokenCS()
    }
    for (const token of listTokenCS) {
        if (token.TokenID == tokenID) {
            return token.PriceUsd
        }
    }
}

const getTokenPricePRV = async(tokenID) => {

    if (!listTokenCS || listTokenCS.length == 0) {
        await initListTokenCS()
    }
    for (const token of listTokenCS) {
        if (token.TokenID == tokenID) {
            return token.PricePrv
        }
    }
}

const getTokenCurrencyType = async(tokenID) => {

    if (!listTokenCS || listTokenCS.length == 0) {
        await initListTokenCS()
    }
    for (const token of listTokenCS) {
        if (token.TokenID == tokenID) {
            return token.CurrencyType
        }
    }
}

const getTokenContract = async(tokenID, network = null) => {

    if (!listTokenCS || listTokenCS.length == 0) {
        await initListTokenCS()
    }

    for (const token of listTokenCS) {
        if (token.TokenID == tokenID) {
            if (token.CurrencyType == 25) {
                let item

                switch (network.toLowerCase()) {
                    case 'eth':
                        item = token.ListUnifiedToken.find(element => element.Network == 'Ethereum');
                        return item.ContractID
                    case 'bsc':
                        item = token.ListUnifiedToken.find(element => element.Network == 'BSC');
                        return item.ContractID
                    case 'plg':
                        item = token.ListUnifiedToken.find(element => element.Network == 'Polygon');
                        return item.ContractID
                    case 'ftm':
                        item = token.ListUnifiedToken.find(element => element.Network == 'Fantom');
                        return item.ContractID
                    default:
                        return null

                }
            } else {
                return token.ContractID
            }
        }
    }
}



const submitOtaKey = async(otaKey) => {

    let url = global.urlCoinService + `/submitotakey`

    let body = {
        "OTAKey": otaKey,
        "ShardID": 0
    }

    // console.log({ url });
    let response = await api.post(url, body)
    return response.Result
}

const getListToken = async() => {

    let url = global.urlCoinService + `/coins/tokenlist`
        // console.log({ url });

    let response = await api.get(url)
    return response.Result
}

const getTokenInfo = async(listtokenID) => {

    let url = global.urlCoinService + `/coins/tokeninfo`

    let body = {
        "TokenIDs": listtokenID
    }

    let response = await api.post(url, body)
    return response.Result
}

const getKeyInfoCoinIndex = async(otaKey) => {

    //url
    let url = global.urlCoinService + `/getkeyinfo?key=${otaKey}&version=2`
        // console.log({ url });

    //get status
    let response = await api.get(url)

    // console.log({ url });
    // console.log(JSON.stringify(response));
    if (response.Result && response.Result.coinindex) {
        let coinindex = await response.Result.coinindex
        return coinindex
    }
    return null

}

const getKeyInfoNftIndex = async(otaKey) => {

    //url
    let url = global.urlCoinService + `/getkeyinfo?key=${otaKey}&version=2`
        // console.log({ url });

    //get status
    let response = await api.get(url)

    // console.log({ url });
    // console.log(JSON.stringify(response));
    if (response.Result && response.Result.nftindex) {
        let nftindex = await response.Result.nftindex
        return nftindex
    }

    return null
}

module.exports = {
    getKey,
    submitOtaKey,
    getListToken,
    getTokenInfo,
    initListTokenCS,
    initListPoolVerifyCS,
    getTokenSymbol,
    getTokenDecimal,
    getTokenDecimalPow,
    getTokenPricePRV,
    getTokenPriceUSD,
    getPoolInfo,
    getTokenNetwork,
    getTokenInfoFromContract,
    getTokenCurrencyType,
    getKeyInfoCoinIndex,
    getKeyInfoNftIndex,
    getTokenContract
}