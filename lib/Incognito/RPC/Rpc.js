const { BaseRpc } = require("../../Base/BaseRpc");

class IncRpc extends BaseRpc {
    getBeaconBestStateDetail() {
        return this.withMethod("getbeaconbeststatedetail").withParams([]).execute()
    }

    getBeaconBestState() {
        return this.withMethod("getbeaconbeststate").withParams([]).execute()
    }

    async getTxByHash(txID) {
        const { TxRpcResponse } = require("./ResponseGetTx")
        return new TxRpcResponse(await this.withMethod("gettransactionbyhash").withParams([txID])
            .execute())
    }


}

module.exports = { IncRpc };

