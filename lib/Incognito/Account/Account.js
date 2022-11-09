const { IncNode } = require("../IncNode.js")

class IncAccount {
    constructor(obj, node = null) {
        const { CliAction, RpcAction } = require("./Actions.js");
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
        this.node = (node == null) ? new IncNode() : node
        this.keyInfo = (typeof obj == "string") ? this.node.cli.getKeyInfo(obj) : obj
        this.useCli = new CliAction(this.keyInfo, this.node)
        this.useRpc = new RpcAction(this.keyInfo, this.node)
        this.sdkInstance = null
    }

    async initSdkInstance() {
        if (this.sdkInstance == null) {
            const { SdkAction } = require("./Actions.js");
            this.sdkInstance = new SdkAction(this.keyInfo, this.node)
            await this.sdkInstance.init()
        }
        return this
    }

    get useSdk() {
        if (this.sdkInstance == null) {
            throw "Sdk instance is not yet init, please call [Incognito account object].initSdkInstance() first"
        }
        return this.sdkInstance
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
        if (!(node instanceof IncNode)) {
            throw `expected IncNode Object, get ${typeof node} instead`
        }
        this.node = node
        return this
    }
    static isValid() {
        for (let i in arguments) {
            if (!(arguments[i] instanceof IncAccount)) {
                throw `Argument at index ${i} is ${typeof arguments[i]} when expecting ${typeof IncAccount}`
            }
        }
    }
}

class IncAccountGroup {

    constructor() {
        this.mnemonic = null
        this.accountList = []
    }

    importFromKeyList(keyList) {
        for (const element of keyList) { this.accountList.push(new IncAccount(element)) }
        return this
    }

    importFromMnemonic(mnemonic = null, numAccount = 1) {
        let node = new IncNode()
        var cliResponse = node.cli.genAccount(mnemonic, numAccount)
        if (mnemonic == null) {
            this.mnemonic = cliResponse["Mnemonic"]
            cliResponse = cliResponse["Accounts"]
        }
        for (const obj of cliResponse) {
            var newAcc = new IncAccount(null, node)
            newAcc.keyInfo = obj
            this.accountList.push(newAcc)
        }
        return this
    }

    attachTo(node) {
        for (const acc of this.accountList) {
            acc.attachTo(node)
        }
        return this
    }

    get(index) {
        return this.accountList[index]
    }

    getAccNoPrivateKey({ all = false }) {
        if (all) {
            let found = []
            for (var acc of this.accountList) {
                if (!acc.privateK) {
                    found.push(acc)
                }
            }
            return found
        } else {
            for (var acc of this.accountList) {
                if (!acc.privateK) {
                    return acc
                }
            }
        }
    }

    append() {
        for (account of arguments) {
            this.accountList.push(account)
        }
        return this
    }

    push() { return this.append(arguments) }
}

module.exports = { IncAccount, IncAccountGroup };