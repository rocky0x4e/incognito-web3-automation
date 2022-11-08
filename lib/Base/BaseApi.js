const axios = require("axios");
const { ENV, DEVICE_ID, DEVICE_TOKEN } = require("../../global");
const { getLogger } = require("../Utils/LoggingManager");
const logger = getLogger("BaseApi")
class BaseApi {
    static LIST_TOKEN = []
    static LIST_POOL_VERIFY = []
    static DEFAULT_HEADER = { 'Content-Type': 'application/json' }
    constructor(obj) {
        this.baseUrl = obj.url
        this.authPath = obj.authPath
        this.authToken = null
    }

    async get(path, headers = BaseApi.DEFAULT_HEADER) {
        let request = {
            url: `${this.baseUrl}/${path}`,
            method: 'GET',
            headers: headers,
            validateStatus: function(status) { return status }
        }
        logger.debug(request)
        let response = await axios(request)
        logger.debug(request, response)
        return response
    }

    async post(path, body, headers = BaseApi.DEFAULT_HEADER) {
        let request = {
            url: `${this.baseUrl}/${path}`,
            method: 'POST',
            headers: headers,
            validateStatus: function(status) { return status },
            data: body,
        }
        logger.debug(request)
        let response = await axios(request)
        logger.debug(request, response)
        return response
    }

    async postWithAuth(path, body) {
        if (this.authToken == null) { await this.authen() }
        return this.post(path, body, {...BaseApi.DEFAULT_HEADER, ... { 'Authorization': 'Bearer ' + this.authToken } })
    }

    async getWithAuth(path) {
        if (this.authToken == null) { await this.authen() }
        return this.get(path, {...BaseApi.DEFAULT_HEADER, ... { 'Authorization': 'Bearer ' + this.authToken } })
    }

    async authen() {
        let response = await this.post(this.authPath, {
            "DeviceID": DEVICE_ID,
            "DeviceToken": DEVICE_TOKEN
        })
        this.authToken = response.data.Result.Token
        return this
    }

}

module.exports = { BaseApi }