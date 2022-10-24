const { BaseRpc } = require("../Base/BaseRpc")

class EvmRPC extends BaseRpc {
    constructor(url) {
        super(url)
        this.payload = { "jsonrpc": "2.0", "id": 1 }
    }

    async getBlockNumber() {
        var response = await this.withMethod("eth_blockNumber").withId(83).withParams([]).execute()
        return parseInt(response.result, 16)
    }
}

module.exports = { EvmRPC }
