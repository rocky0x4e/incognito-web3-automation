const { BaseResponse } = require("../../Base/BaseRpc")

class TxRpcResponse extends BaseResponse {
    getBlockHash() {
        return this.getResult()["BlockHash"]
    }

    getBlockHeight() {
        return this.getResult()["BlockHeight"]
    }

    isConfirmed() {
        if (this.getBlockHeight()) {
            return true
        }
        return false
    }
}
module.exports = { TxRpcResponse }