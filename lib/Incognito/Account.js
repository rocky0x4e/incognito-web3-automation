const { BaseAction } = require("../Base/BaseAction.js")
const { TokenId } = require("./Constants.js")
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
        this.useCli = new CliAction(this)
        this.useRpc = new RpcAction(this)
        this.useCs = new CsAction(this)
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
class CliAction extends BaseAction {
    getBalanceAll() {
        return this.node.cli.getBalanceAll(this.account.privateK)
    }

    getBalance(token = TokenId.PRV) {
        return this.node.cli.getBalance(this.account.privateK, token)
    }

    send(receiver, amount, token = TokenId.PRV) {
        this._validateArgs(receiver)
        return this.node.cli.send(this.account.privateK, receiver.paymentK, amount, token)
    }

    addOrder(pairID, nftId, sellToken, sellAmount, minAcceptAmount) {
        return this.node.cli.addOrder(this.account.privateK, pairID, nftId, sellToken, sellAmount, minAcceptAmount)
    }

    trade(selToken, buyToken, sellAmount, tradingFee, minAcceptAmount, tradingPath, prvFee) {
        return this.node.cli.trade(this.account.privateK, selToken, buyToken, sellAmount, tradingFee,
            minAcceptAmount, tradingPath, prvFee)
    }

    withdrawLpFee(pairId, nftId) {
        return this.node.cli.withdrawLpFee(this.account.privateK, pairId, nftId)
    }

    consolidate(tokenId) {
        return this.node.cli.consolidate(this.account.privateK, tokenId)
    }

    printUTXO(tokenId) {
        return this.node.cli.printUTXO(this.account.privateK, tokenId)
    }

    withrawOrder(orderId, pairId, nftId, tokenId) {
        return this.node.cli.withrawOrder(this.account.privateK, orderId, pairId, nftId, tokenId)
    }

    stake(validator, rewarReceiver) {
        IncAccount.isValid(validator, rewarReceiver)
        return this.node.cli.stake(this.account.privateK, validator.miningK, validator.paymentK, rewarReceiver.paymentK)
    }

    unstake(validator) {
        IncAccount.isValid(validator)
        return this.node.cli.unstake(this.account.privateK, validator.miningK, validator.paymentK)
    }
}

class RpcAction extends BaseAction {

}

class CsAction extends BaseAction {

}
module.exports = { IncAccount, IncAccountGroup };

