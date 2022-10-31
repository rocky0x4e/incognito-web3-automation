const { wait } = require("../Utils/Timer")
const { IncCli } = require("./IncCli")
const { IncRpc } = require("./RPC/Rpc")

class IncNode {
    constructor(url) {
        const { ENV } = require("../../global")
        if (!url) {
            url = ENV.FullNode.url
        }
        this.url = url
        this.rpc = new IncRpc(this.url)
        this.cli = new IncCli(this.url)
        this.accessToken = ENV.FullNode.accessToken
    }

    async getTransactionByHashRpc(txId, checkInterval = 10, timeout = 90) {
        var txDetail
        while (true) {
            txDetail = await this.rpc.getTxByHash(txId)
            if (txDetail.isConfirmed()) { return txDetail }
            if (timeout <= 0) { break }
            timeout -= checkInterval
            wait(checkInterval)
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
        console.log(blockChainInfo.result)
        return blockChainInfo.result.BestBlocks['0'].Height
    }
}

module.exports = { IncNode }