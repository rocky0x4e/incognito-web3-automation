const { IncCli } = require("../CLI/IncCli.js")
class IncAccount {
    constructor(privateKey) {
        let cli = new IncCli()
        this.keyInfo = {
            "PrivateKey": "",
            "PublicKey": '',
            "PaymentAddressV1": '',
            "PaymentAddress": '',
            "ReadOnlyKey": '',
            "OTAPrivateKey": '',
            "MiningKey": '',
            "MiningPublicKey": '',
            "ValidatorPublicKey": '',
            "ShardID": 0
        }
        this.keyInfo = JSON.parse(cli.run(`account keyinfo --privateKey ${privateKey}`))

    }
}

module.exports = { IncAccount };
