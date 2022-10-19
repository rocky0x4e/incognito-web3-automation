const api = require('../constant/api');
const addingContent = require('../testbase/addingContent');



module.exports.tokenList = async() => {
    try {
        let url = global.urlCoinService + '/coins/tokenlist'

        let response = await api.get(url)
        await addingContent.addContent('api', {
            url,
            response: response.Result[0]
        })
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url
        })
        throw error
    }
};

module.exports.listPool = async() => {
    try {
        let url = global.urlCoinService + '/pdex/v3/listpools?pair=all'
        let response = await api.get(url)

        await addingContent.addContent('api', {
            url,
            response: response.Result[0]
        })
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url
        })
        throw error
    }
};

module.exports.listPair = async() => {
    try {
        let url = global.urlCoinService + '/pdex/v3/listpairs'
        let response = await api.get(url)

        await addingContent.addContent('api', {
            url,
            response: response.Result[0]
        })
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url
        })
        throw error
    }
};

module.exports.tradehistory = async(otaKey) => {

    let url
    try {
        url = global.urlCoinService + `/pdex/v3/tradehistory?otakey=${otaKey}&limit=1000000000&offset=0`
        let response = await api.get(url)

        await addingContent.addContent('api', {
            url,
            response: response.Result[0]
        })
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url
        })
        throw error
    }
};

module.exports.estimateTrade = async({
    tokenSell,
    tokenBuy,
    isMax = false,
    sellAmount

}) => {

    let url
    try {
        url = global.urlCoinService + `/pdex/v3/estimatetrade?selltoken=${tokenSell}&buytoken=${tokenBuy}&ismax=${isMax}&sellamount=${sellAmount}`
        let response = await api.get(url)

        await addingContent.addContent('api', {
            url,
            response: response
        })
        console.log("hoanh", response);
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url
        })
        throw error
    }
};

module.exports.getkeyinfo = async({
    otaKey
}) => {

    let url
    try {
        url = global.urlCoinService + `/getkeyinfo?key=${otaKey}&version=2`
        let response = await api.get(url)

        await addingContent.addContent('api', {
            url,
            response: response
        })
        console.log("hoanh", response);
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url
        })
        throw error
    }
};

module.exports.checkkeyimages = async({
    KeyImages,
    ShardID = 0
}) => {

    let url
    try {
        url = global.urlCoinService + `/checkkeyimages`
        let body = {
            "KeyImages": KeyImages,
            "ShardID": ShardID
        }
        let response = await api.post(url, body)

        await addingContent.addContent('api', {
            url,
            body,
            response: response
        })
        console.log("hoanh", response);
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url,
            body
        })
        throw error
    }
};

module.exports.tokenInfo = async({
    TokenIDs
}) => {

    let url
    try {
        url = global.urlCoinService + `/coins/tokeninfo`
        let body = {
            "TokenIDs": TokenIDs
        }
        let response = await api.post(url, body)

        await addingContent.addContent('api', {
            url,
            body,
            response: response
        })
        console.log("hoanh", response);
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url,
            body
        })
        throw error
    }
};

module.exports.pendingOrder = async({
    poolid,
}) => {

    let url
    try {
        url = global.urlCoinService + `/pdex/v3/pendingorder?poolid=${poolid}`
        let response = await api.get(url)

        await addingContent.addContent('api', {
            url,
            response: response
        })
        console.log("hoanh", response);
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url,
        })
        throw error
    }
};

module.exports.pendingLimit = async({
    ID,
}) => {

    let url
    let body
    try {
        url = global.urlCoinService + `/pdex/v3/pendinglimit`
        body = {
            "ID": ID
        }
        let response = await api.post(url, body)

        await addingContent.addContent('api', {
            url,
            body,
            response: response
        })
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url,
            body
        })
        throw error
    }
};

module.exports.orderTradeHistory = async({
    poolid,
    nftid,
    limit = 1000000000,
    offset = 0
}) => {

    let url
    let body
    try {
        url = global.urlCoinService + `/pdex/v3/tradehistory?poolid=${poolid}&nftid=${nftid}&limit=${limit}&offset=${offset}`
        let response = await api.get(url)

        await addingContent.addContent('api', {
            url,
            response_Result_0: response.Result[0]
        })
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url,
        })
        throw error
    }
};

module.exports.poolShare = async({
    nftID
}) => {

    let url
    let body
    try {
        url = global.urlCoinService + `/pdex/v3/poolshare?nftid=${nftID}`
        let response = await api.get(url)

        await addingContent.addContent('api', {
            url,
            response_Result_0: response.Result[0]
        })
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url,
        })
        throw error
    }
};

module.exports.contributeHistory = async({
    nftID,
    limit = 1000,
    offset = 0
}) => {

    let url
    let body
    try {
        url = global.urlCoinService + `/pdex/v3/contributehistory?nftid=${nftID}&limit=${limit}&offset=${offset}`
        let response = await api.get(url)

        await addingContent.addContent('api', {
            url,
            response_Result_0: response.Result[0]
        })
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url,
        })
        throw error
    }
};

module.exports.poolDetail = async({
    poolIDs
}) => {

    let url = global.urlCoinService + `/pdex/v3/poolsdetail`
    let body = {
        "PoolIDs": poolIDs
    }
    try {
        let response = await api.post(url, body)

        await addingContent.addContent('api', {
            url,
            body,
            response
        })
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url,
            body
        })
        throw error
    }
};