const axios = require("axios");
const { ENV, DEVICE_ID, DEVICE_TOKEN } = require("../../global");

class BaseApi {
    static LIST_TOKEN = []
    static LIST_POOL_VERIFY = []
    static DEFAULT_HEADER = { 'Content-Type': 'application/json' }
    constructor(obj = ENV.CoinService) {
        this.baseUrl = obj.url
        this.authPath = obj.authPath
        this.authToken = null
    }

    async get(path, headers = BaseApi.DEFAULT_HEADER) {
        let request = {
            url: `${this.baseUrl}/${path}`,
            method: 'GET',
            headers: headers,
        }
        console.debug(request)
        let response = await axios(request)
        return response
    }

    async post(path, body, headers = BaseApi.DEFAULT_HEADER) {
        let request = {
            url: `${this.baseUrl}/${path}`,
            method: 'POST',
            headers: headers,
            data: body,
        }
        console.debug(request)
        let response = await axios(request)
        return response
    }

    async postWithAuth(path, body) {
        if (this.authToken == null) { this.authen() }
        return this.post(path, body, { ...BaseApi.DEFAULT_HEADER, ...{ 'Authorization': 'Bearer ' + this.authToken } })
    }

    async getWithAuth(path) {
        if (this.authToken == null) { this.authen() }
        return this.get(path, { ...BaseApi.DEFAULT_HEADER, ...{ 'Authorization': 'Bearer ' + this.authToken } })
    }

    async authen() {
        let response = await this.post(this.authPath, {
            "DeviceID": DEVICE_ID,
            "DeviceToken": DEVICE_TOKEN
        })
        this.authToken = response.Result.Token
        return this
    }

}

module.exports = { BaseApi }