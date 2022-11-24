let Web3 = require('web3');
let Tx = require('ethereumjs-tx').Transaction;

class EvmAccount {
    /**
     * @param {string} privateKey
    */
    constructor(privateKey = null, provider = null) {
        this.privateKey = privateKey
        this.accountData = null
        if (provider != null) { this.setProvider(provider) } else provider = null
    }

    /**
     * @param {(string|Web3)} provider: Evm full node url or Web3 object, IE: new Web3(evmFullnodeUrl)
     */
    setProvider(provider) {
        if (typeof provider == "string") {
            this.provider = new Web3(new Web3.providers.HttpProvider(provider))
        } else if (provider instanceof Web3) {
            this.provider = provider
        } else {
            let err = new Error("!! Expect provider to be a web3 object or url of Evm fullnode\n" +
                ` ! Got ${provider} instead`)
            throw err
        }
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

    set address(address) {
        if (this.accountData) { this.accountData.address = address }
        else { this.accountData = { address } }
    }

    async getBalance() {
        return await this.provider.eth.getBalance(this.address)
    }

    /**
     * send native token
     * @param {(EvmAccount|string)} to: address string or EvmAccount object
     * @param {number} amount: amount to send
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
        /**
         * @property {Array<EvmAccount>} accountList
         */
        this.accountList = []
    }

    /**
     *
     * @param {Array<EvmAccount>} array
     * @param {Web3} node
     */
    importKeyList(array) {
        for (var key of array) {
            this.accountList.push(new EvmAccount(key))
        }
        return this
    }

    setProvider(evmNode) {
        for (var acc of this.accountList) {
            acc.setProvider(evmNode)
        }
        return this
    }

    /**
     *
     * @param {number} index
     * @returns {EvmAccount}
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