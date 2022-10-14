const { IncCli } = require("./IncCli.js")

class IncAccount {
    constructor(obj) {

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
        if (!obj == undefined) {
            this.keyInfo = cli.getKeyInfo(obj)
        }
        this.node = null
    }

    get privateK() {
        return this.keyInfo["PrivateKey"]
    }

    get publicK() {
        return this.keyInfo["PublicKey"]
    }

    get paymentKv1() {
        return this.keyInfo["PaymentAddressV1"]
    }

    get paymentK() {
        return this.keyInfo["PaymentAddress"]
    }

    get readonlyK() {
        return this.keyInfo["ReadOnlyKey"]
    }

    get otaPrivateK() {
        return this.keyInfo["OTAPrivateKey"]
    }

    get miningK() {
        return this.keyInfo["MiningKey"]
    }

    get miningPublicK() {
        return this.keyInfo["MiningPublicKey"]
    }

    get validatorPublicK() {
        return this.keyInfo["ValidatorPublicKey"]
    }

    get shardId() {
        return this.keyInfo["ShardID"]
    }

    attachTo(node) {
        this.node = node
    }
}

class IncAccountGroup {
    constructor() {
        this.mnemonic = null
        this.accountList = []
        for (const element of arguments) {
            if (element instanceof IncAccount) {
                this.accountList.push(element)
            } else if (typeof element === "string") {
                this.accountList.push(new IncAccount(element))
            }
        }
    }

    genAccounts(mnemonic = null, numAccount = 1) {
        var cli = new IncCli()
        var cli_response = cli.genAccount(mnemonic, numAccount)
        if (mnemonic == null) {
            this.mnemonic = cli_response["Mnemonic"]
            cli_response = cli_response["Accounts"]
        }
        for (const i in cli_response) {
            var new_acc = new IncAccount()
            new_acc.keyInfo = cli_response[i]
            this.accountList.push(new_acc)
        }
        return this
    }

    attachTo(node) {
        for (const acc in this.accountList) {
            acc.attachTo(node)
        }
        return this
    }
}

module.exports = { IncAccount, IncAccountGroup };
