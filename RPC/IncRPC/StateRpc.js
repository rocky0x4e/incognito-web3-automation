const { BaseRpc } = require("../BaseRpc")

class IncRpc extends BaseRpc {
    async get_beacon_best_state_detail() {
        return await this.with_method("getbeaconbeststatedetail").with_params([]).execute()
    }

    async get_beacon_best_state() {
        return await this.with_method("getbeaconbeststate").with_params([]).execute()
    }

    async get_tx_by_hash(tx_id) {
        return await this.rpc_connection.with_method("gettransactionbyhash").with_params([tx_id]).execute()
    }

}

module.exports = { IncRpc };
