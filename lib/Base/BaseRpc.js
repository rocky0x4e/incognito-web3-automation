const assert = require('assert');
const axios = require("axios");

class BaseRpc {

    DEFAULT_HEADER = { 'Content-Type': 'application/json' }
    DEFAULT_TIMEOUT = 320

    constructor(url) {
        this.url = url
        this.payload = { jsonrpc: "1.0", id: 1, params: [], method: "" }
    }

    withId(newId) {
        this.payload['id'] = newId
        return this
    }

    withJsonRpcVer(jsonRpc) {
        this.payload['jsonrpc'] = jsonRpc
        return this
    }

    withURL(url) {
        this.url = url
        return this
    }

    withParams(paramObj) {
        this.payload["params"] = paramObj
        return this
    }

    withMethod(method) {
        this.payload["method"] = method
        return this
    }

    async execute() {
        this.printPayload()
        let response = await axios({
            url: this.url,
            method: 'POST',
            headers: BaseRpc.DEFAULT_HEADER,
            data: this.payload
        })
        return new BaseResponse(response)
    }

    printPayload() {
        console.info(`RCP: ${this.url} \n${JSON.stringify(this.payload, null, 3)}`)
        return this
    }

    setPayload(payload) {
        this.payload = payload
        return this
    }
}

class BaseResponse {
    constructor(response) {
        if (response instanceof BaseResponse) {
            this.response = response.response
        } else {
            this.response = response
        }
    }

    get data() {
        return this.response.data
    }

    get result() {
        var res = this.data["Result"]
        if (res == undefined) {
            return this.data["result"]
        }
        return res
    }

    get error() {
        return this.data["Error"]
    }

    expectNoError() {
        assert(this.error == null, `Expect no error but got ${this.error}`)
        return true
    }

    expectError(errMsg = null) {
        if (errMsg == null) {
            assert(this.getError() != null, `Expect some error but got nothing`)
        }
        if (!this.getError().includes(errMsg)) {
            assert(false, `Expect ${errMsg} but got something else`)
        }
        return true
    }

    pretty(indent = 3) {
        return JSON.stringify(this.data, null, indent)
    }
}

module.exports = { BaseRpc, BaseResponse };
