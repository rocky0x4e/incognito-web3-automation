const { ENV } = require("../../global")
const { wait } = require("../Utils/Timer")
const { IncCli } = require("./IncCli")
const { IncRpc } = require("./RPC/Rpc")

class IncNode {
    constructor(url = ENV.FullNode.url) {
        this.url = url
        this.rpc = new IncRpc(this.url)
        this.cli = new IncCli(this.url)
    }

    getTransactionByHashRpc(txId, checkInterval = 10, timeout = 90) {
        var txDetail
        while (true) {
            txDetail = this.rpc.getTxByHash(txId)
            if (txDetail.isConfirmed()) { return txDetail }
            if (timeout <= 0) { break }
            timeout -= checkInterval
            wait(checkInterval)
        }
        logger.info("Time out, tx is not confirmed!")
        return txDetail
    }

}

module.exports = { IncNode }