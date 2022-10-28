const { BaseApi } = require("../Base/BaseApi");
const addingContent = require("../Utils/AddingContent");

class WebServiceApi extends BaseApi {

    async genShieldAddress({
        addressType,
        network,
        privacyTokenAddress,
        walletAddress
    }) {
        let path = `genshieldaddress`
        let body = {
            "Network": network,
            "AddressType": addressType,
            "WalletAddress": walletAddress,
            "PrivacyTokenAddress": privacyTokenAddress
        }
        return this.post(path, body)
    }

    async genUnshieldAddress({
        network,
        requestedAmount,
        addressType,
        incognitoAmount,
        paymentAddress,
        privacyTokenAddress,
        walletAddress,
        unifiedTokenID,
        currencyType
    }) {
        let path = `genunshieldaddress`
        let body = {
            "CurrencyType": currencyType,
            "Network": network,
            "RequestedAmount": requestedAmount,
            "AddressType": addressType,
            "IncognitoAmount": incognitoAmount,
            "PaymentAddress": paymentAddress,
            "PrivacyTokenAddress": privacyTokenAddress,
            "WalletAddress": walletAddress,
            "UnifiedTokenID": unifiedTokenID
        }

        return this.post(path, body)
    }

    async swapStatus({
        listTx
    }) {
        let path = `papps/swapstatus`
        let body = { "TxList": listTx }

        return this.post(path, body)
    }

    async estimateSwapFee({
        amount,
        fromToken,
        network,
        slippage,
        toToken
    }) {
        let path = `papps/estimateswapfee`
        let body = {
            "Network": network,
            "Amount": amount,
            "FromToken": fromToken,
            "ToToken": toToken,
            "Slippage": slippage
        }

        return this.post(path, body)
    }

    async genShieldAddress({
        network,
        currencyType,
        paymentAddress,
        privacyTokenAddress,
        AddressType = 1,
    }) {
        let path = `genshieldaddress`
        let body = {
            "Network": network,
            "AddressType": AddressType,
            "WalletAddress": paymentAddress,
            "PaymentAddress": paymentAddress,
            "BTCIncAddress": paymentAddress,
            "PrivacyTokenAddress": privacyTokenAddress,
            "CurrencyType": currencyType
        }
        return this.post(path, body)
    }
}


module.exports = { WebServiceApi }