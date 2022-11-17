let Web3 = require('web3');
const { IncAccount } = require('../Incognito/Account/Account');
let Tx = require('ethereumjs-tx').Transaction;

class EvmAccount {
    constructor(privateKey, provider = "") {
        this.privateKey = privateKey
        if (provider == "") { this.provider = new Web3(new Web3.providers.HttpProvider(provider)) }
        else if (provider instanceof Web3) { this.provider = provider }
        this.accountData = null
    }

    /**
     *
     * @param {Web3} provider: Web3 object
     */
    attachTo(provider) {
        this.provider = (typeof provider == "string") ? new Web3(new Web3.providers.HttpProvider(provider)) : provider
        return this
    }

    /**
     * @returns {string}
     */
    get address() {
        if (this.accountData == null) {
            this.accountData = this.provider.eth.accounts.privateKeyToAccount(this.privateKey)
        }
        return this.accountData.address
    }

    /**
     * send native token
     * @param {(EvmAccount|string)} to: address string or EvmAccount object
     * @param {number} gas: gwei amount, default 90
     * @param {number} gasLimit: gas limit. default 220000
     * @param {Object} options: default { chain: 'goerli' }
     * @returns
    */
    async sendNativeToken({ to, amount, gas = 90, gasLimit = 220000, options = { chain: 'goerli' } }) {
        to = (to instanceof EvmAccount) ? to.address : to
        let privateKey = await Buffer.from(this.privateKey.slice(2), 'hex')
        let count = await this.provider.eth.getTransactionCount(this.address)

        let rawTransaction = {
            "gasPrice": this.provider.utils.toHex(this.provider.utils.toWei(gas.toFixed(), 'gwei')),
            "gasLimit": this.provider.utils.toHex(gasLimit),
            "to": to,
            "value": this.provider.utils.toHex(amount),
            "nonce": this.provider.utils.toHex(count)
        }

        let transaction = new Tx(rawTransaction, options)
        transaction.sign(privateKey)

        let result = await this.provider.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
        console.log(result)
        return result
    }
}

class EvmAccountGroup {
    constructor() {
        this.accountList = []
    }

    /**
     *
     * @param {Array<EvmAccount>} array
     * @param {Web3} node
     */
    importKeylist(array, node = "") {
        for (var key of array) {
            this.accountList.push(new EvmAccount(key, node))
        }
        return this
    }

    attachTo(evmNode) {
        for (var acc of this.accountList) {
            acc.attachTo(evmNode)
        }
        return this
    }

    /**
     *
     * @param {number} index
     * @returns {IncAccount}
     */
    get(index) {
        return this.accountList[index]
    }

    push(evmAccount) {
        this.accountList.push(evmAccount)
        return this
    }
}

module.exports = { EvmAccount, EvmAccountGroup }