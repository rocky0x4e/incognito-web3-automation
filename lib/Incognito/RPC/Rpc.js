const { BaseRpc } = require("../../Base/BaseRpc");

class IncRpc extends BaseRpc {
    async getBeaconBestStateDetail() {
        return await this.withMethod("getbeaconbeststatedetail").withParams([]).execute()
    }

    async getBeaconBestState() {
        return await this.withMethod("getbeaconbeststate").withParams([]).execute()
    }

    async getTxByHash(tx_id) {
        const { TxRpcResponse } = require("./ResponseGetTx")
        return new TxRpcResponse(await this.withMethod("gettransactionbyhash").withParams([tx_id])
            .execute())
    }

}

module.exports = { IncRpc };
