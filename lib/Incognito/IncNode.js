const { ENV } = require("../../global")
const { getLogger } = require("../Utils/LoggingManager")
const { wait } = require("../Utils/Timer")
const { IncCli } = require("./IncCli")
const { IncRpc } = require("./RPC/Rpc")
const logger =  getLogger("IncNode")

class IncNode {
    constructor(obj = ENV.Testbed.Incognito.FullNode) {
        this.url = obj.url
        this.accessToken = obj.accessToken
        this.rpc = new IncRpc(this.url)
        this.cli = new IncCli(this.url)
    }

    async getTransactionByHashRpc(txId, checkInterval = 10, timeout = 90) {
        var txDetail
        logger.info(`Getting tx by hash: ${txId}`)
        while (true) {
            txDetail = await this.rpc.getTxByHash(txId)
            if (txDetail && txDetail.result && txDetail.isConfirmed()) { return txDetail }
            if (timeout <= 0) { break }
            timeout -= checkInterval
            logger.info(`Wait for ${checkInterval}s then try again`)
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