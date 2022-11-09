const { wait } = require("../Utils/Timer")
const { IncCli } = require("./IncCli")
const { IncRpc } = require("./RPC/Rpc")
const { ENV } = require("../../global")

class IncNode {
    constructor(obj = ENV.Testbed.FullNode) {
        this.url = obj.url
        this.rpc = new IncRpc(obj)
        this.cli = new IncCli(obj.url)
    }

    async getTransactionByHashRpc(txId, checkInterval = 10, timeout = 90) {
        var txDetail
        while (true) {
            txDetail = await this.rpc.getTxByHash(txId)
            if (txDetail.isConfirmed()) { return txDetail }
            if (timeout <= 0) { break }
            timeout -= checkInterval
            await wait(checkInterval)
        }
        logger.info("Time out, tx is not confirmed!")
        return txDetail
    }

    async calCurrentBlockTime() {
        var latestBeaconHeight = await this.getCurrentBeaconHeight()
        var latestBeaconBlock = await this.rpc.getBeaconBlock(latestBeaconHeight)
        var latestBeaconBlockTime = latestBeaconBlock.result[0].Time
        var prevBeaconBlock = await this.rpc.getBeaconBlock(latestBeaconHeight - 1)
        var prevBeaconBlockTime = prevBeaconBlock.result[0].Time
        return latestBeaconBlockTime - prevBeaconBlockTime
    }

    async getCurrentBeaconHeight() {
        var blockChainInfo = await this.rpc.getBlockchainInfo()
        return blockChainInfo.result.BestBlocks['0'].Height
    }
}

module.exports = { IncNode }