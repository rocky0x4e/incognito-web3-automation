const { IncCli } = require("./IncCli")
const { IncRpc } = require("./RPC/Rpc")

class IncNode {
    constructor(url = null) {
        this.url = url
        this.rpc = new IncRpc(this.url)
        this.cli = new IncCli(this.url)
    }
}

module.exports = { IncNode }