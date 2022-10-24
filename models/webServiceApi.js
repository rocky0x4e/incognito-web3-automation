const api = require('../constant/api');
const addingContent = require('../testbase/addingContent');


module.exports.Api_OTA_Shield = async(network, currencyType, addressType, requestedAmount, paymentAddress, walletAddress, privacyTokenAddress) => {
    try {
        let url = global.urlWebService + '/genshieldaddress'
        body = {
            "Network": network,
            "CurrencyType": currencyType,
            "AddressType": addressType,
            "RequestedAmount": requestedAmount,
            "PaymentAddress": paymentAddress,
            "WalletAddress": walletAddress,
            "PrivacyTokenAddress": privacyTokenAddress,
        }

        let response = await api.post(url, body)
        await addingContent.addContent({
            url,
            body,
            response
        })
        return response
    } catch (error) {
        await addingContent.addContent({
            url,
            body
        })
        throw error
    }
};

module.exports.Api_EstimateSwapFee = async(amount, fromToken, network, slippage, toToken) => {
    let url
    let body
    try {
        url = global.urlWebService + '/papps/estimateswapfee'
        body = {
            "Network": network,
            "Amount": amount,
            "FromToken": fromToken,
            "ToToken": toToken,
            "Slippage": slippage
        }

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

module.exports.Api_SwapStatus = async(listTx) => {
    let url
    let body
    try {
        url = global.urlWebService + '/papps/swapstatus'
        body = { "TxList": listTx }

        let response = await api.post(url, body)
        await addingContent.addContent({
            url,
            body,
            response
        })
        return response
    } catch (error) {
        await addingContent.addContent({
            url,
            body
        })
        throw error
    }
};

module.exports.Api_GenShieldAddress = async(addressType, network, privacyTokenAddress, walletAddress) => {
    let url
    let body
    try {
        url = global.urlWebService + '/genshieldaddress'
        body = {
            "Network": network,
            "AddressType": addressType,
            "WalletAddress": walletAddress,
            "PrivacyTokenAddress": privacyTokenAddress
        }

        let response = await api.post(url, body)
        await addingContent.addContent({
            url,
            body,
            response
        })
        return response
    } catch (error) {
        await addingContent.addContent({
            url,
            body
        })
        throw error
    }
};

module.exports.Api_GenUnshieldAddress = async(network, requestedAmount, addressType, incognitoAmount, paymentAddress, privacyTokenAddress, walletAddress, unifiedTokenID) => {
    let url
    let body
    try {
        url = global.urlWebService + '/genunshieldaddress'
        body = {
            "Network": network,
            "RequestedAmount": requestedAmount,
            "AddressType": addressType,
            "IncognitoAmount": incognitoAmount,
            "PaymentAddress": paymentAddress,
            "PrivacyTokenAddress": privacyTokenAddress,
            "WalletAddress": walletAddress,
            "UnifiedTokenID": unifiedTokenID
        }

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