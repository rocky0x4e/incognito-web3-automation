var assert = require('assert');
const axios = require("axios");

class BaseRpc {

    DEFAULT_HEADER = { 'Content-Type': 'application/json' }
    DEFAULT_TIMEOUT = 320

    constructor(url) {
        this.url = url
        this.payload = { "jsonrpc": "1.0", "id": 1 }
    }

    with_id(new_id) {
        this.payload['id'] = new_id
        return this
    }

    with_json_rpc(json_rpc) {
        this.payload['jsonrpc'] = json_rpc
        return this
    }

    with_url(url) {
        this.url = url
        return this
    }

    with_params(params) {
        this.payload["params"] = params
        return this
    }

    with_method(method) {
        this.payload["method"] = method
        return this
    }

    async execute() {
        this.print_pay_load()
        let response = await axios({
            url: this.url,
            method: 'POST',
            headers: BaseRpc.DEFAULT_HEADER,
            data: this.payload
        })
        return new BaseResponse(response)
    }

    print_pay_load() {
        console.info(`RCP: ${this.url} \n${JSON.stringify(this.payload, null, 3)}`)
        return this
    }

    setpayload(payload) {
        this.payload = payload
        return this
    }
}

class BaseResponse {
    constructor(response) {
        this.response = response
    }

    get_data() {
        return this.response.data
    }

    get_result() {
        return this.get_data()["Result"]
    }

    get_error() {
        return this.get_data()["Error"]
    }

    expect_no_error() {
        assert(this.get_error() == null, `Expect no error but got ${this.get_error()}`)
    }

    expect_error(error_msg = null) {
        if (error_msg == null) {
            assert(this.get_error() != null, `Expect some error but got nothing`)
        }
        if (!this.get_error().includes(error_msg)) {
            assert(false, `Expect ${error_msg} but got something else`)
        }
    }

    pretty(indent = 3) {
        return JSON.stringify(this.get_data(), null, indent)
    }
}

module.exports = { BaseRpc, BaseResponse };
