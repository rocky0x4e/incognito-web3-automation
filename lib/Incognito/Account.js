const { TokenId } = require("./const/BlockChain.js")
const { IncNode } = require("./IncNode.js")

class IncAccount {
    constructor(obj, node = null) {

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

    getBalanceAll() {
        return this.node.cli.getBalanceAll(this.privateK)
    }

    getBalance(token = TokenId.PRV) {
        return this.node.cli.getBalance(this.privateK, token)
    }

    send(receiver, amount, token = TokenId.PRV) {
        this._validateArgs(receiver)
        return this.node.cli.send(this.privateK, receiver.paymentK, amount, token)
    }

    addOrder(pairID, nftId, sellToken, sellAmount, minAcceptAmount) {
        return this.node.cli.addOrder(this.privateK, pairID, nftId, sellToken, sellAmount, minAcceptAmount)
    }

    trade(selToken, buyToken, sellAmount, tradingFee, minAcceptAmount, tradingPath, prvFee) {
        return this.node.cli.trade(this.privateK, selToken, buyToken, sellAmount, tradingFee,
            minAcceptAmount, tradingPath, prvFee)
    }

    withdrawLpFee(pairId, nftId) {
        return this.node.cli.withdrawLpFee(this.privateK, pairId, nftId)
    }

    consolidate(tokenId) {
        return this.node.cli.consolidate(this.privateK, tokenId)
    }

    printUTXO(tokenId) {
        return this.node.cli.printUTXO(this.privateK, tokenId)
    }

    withrawOrder(orderId, pairId, nftId, tokenId) {
        return this.node.cli.withrawOrder(this.privateK, orderId, pairId, nftId, tokenId)
    }

    stake(validator, rewarReceiver) {
        this._validateArgs(validator, rewarReceiver)
        return this.node.cli.stake(this.privateK, validator.miningK, validator.paymentK, rewarReceiver.paymentK)
    }

    unstake(validator) {
        this._validateArgs(validator)
        return this.node.cli.unstake(this.privateK, validator.miningK, validator.paymentK)
    }

    _validateArgs() {
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
        for (const element of arguments) {
            if (element instanceof IncAccount) {
                this.accountList.push(element)
            } else if (typeof element === "string") {
                this.accountList.push(new IncAccount(element))
            }
        }
    }

    genAccounts({ mnemonic = null, numAccount = 1 }) {
        let node = new IncNode()
        var cliResponse = node.cli.genAccount(mnemonic, numAccount)
        if (mnemonic == null) {
            this.mnemonic = cliResponse["Mnemonic"]
            cliResponse = cliResponse["Accounts"]
        }
        for (const obj of cliResponse) {
            var newAcc = new IncAccount(undefined, node)
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
}

module.exports = { IncAccount, IncAccountGroup };
