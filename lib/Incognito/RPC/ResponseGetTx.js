const { BaseResponse } = require("../../Base/BaseRpc")

class TxRpcResponse extends BaseResponse {
    getBlockHash() {
        return this.result["BlockHash"]
    }

    getBlockHeight() {
        return this.result["BlockHeight"]
    }

    isConfirmed() {
        if (this.getBlockHeight()) {
            return true
        }
        return false
    }
}
module.exports = { TxRpcResponse }