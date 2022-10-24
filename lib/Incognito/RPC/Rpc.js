const { BaseRpc } = require("../../Base/BaseRpc");
const { TOKEN } = require("../Constants");

class IncRpc extends BaseRpc {
    async getBeaconBestStateDetail() {
        return await this.withMethod("getbeaconbeststatedetail").withParams([]).execute()
    }

    async getBeaconBestState() {
        return await this.withMethod("getbeaconbeststate").withParams([]).execute()
    }

    async getTxByHash(txID) {
        const { TxRpcResponse } = require("./ResponseGetTx")
        return new TxRpcResponse(await this.withMethod("gettransactionbyhash").withParams([txID])
            .execute())
    }

    async getBalance(privateKey, tokenId = TOKEN) {
        let res = await this.withMethod("getbalanceprivacycustomtoken").withParams([privateKey, tokenId]).execute()
        return res.result
    }
}

module.exports = { IncRpc };

