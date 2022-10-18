const api = require('../constant/api');
const addingContent = require('../testbase/addingContent');


module.exports.Api_OTA_Generate = async(authenToken, currencyType, addressType, paymentAddress, walletAddress, privacyTokenAddress, newShieldDecentralized, signPublicKeyEncode) => {

    try {
        let url = global.urlBackend + '/ota/generate'
        let body = {
            "CurrencyType": currencyType,
            "AddressType": addressType,
            "PaymentAddress": paymentAddress,
            "WalletAddress": walletAddress,
            "PrivacyTokenAddress": privacyTokenAddress,
            "NewShieldDecentralized": newShieldDecentralized,
            "SignPublicKeyEncode": signPublicKeyEncode
        }

        let response = await api.postWithToken(url, authenToken, body)
        await addingContent.addContent('api', {
            url,
            authenToken,
            body,
            response
        })
        return response
    } catch (error) {
        await addingContent.addContent('api', {
            url,
            authenToken,
            body,
        })
        throw error
    }


};