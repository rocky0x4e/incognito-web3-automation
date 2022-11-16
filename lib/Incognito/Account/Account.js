const { getLogger } = require("../../Utils/LoggingManager.js");
const { wait } = require("../../Utils/Timer.js");
const { BackendApi } = require("../BackendApi.js");
const { IncNode } = require("../IncNode.js")

const logger = getLogger("IncAccount")
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

    /**
     * @returns {string}
     */
    get privateK() {
        return this.keyInfo["PrivateKey"]
    }

    /**
     * @returns {string}
     */
    get publicK() {
        return this.keyInfo["PublicKey"]
    }

    /**
     * @returns {string}
     */
    get paymentKv1() {
        return this.keyInfo["PaymentAddressV1"]
    }

    /**
     * @returns {string}
     */
    get paymentK() {
        return this.keyInfo["PaymentAddress"]
    }

    /**
     * @returns {string}
     */
    get readonlyK() {
        return this.keyInfo["ReadOnlyKey"]
    }

    /**
     * @returns {string}
     */
    get otaPrivateK() {
        return this.keyInfo["OTAPrivateKey"]
    }

    /**
     * @returns {string}
     */
    get miningK() {
        return this.keyInfo["MiningKey"]
    }

    /**
     * @returns {string}
     */
    get miningPublicK() {
        return this.keyInfo["MiningPublicKey"]
    }

    /**
     * @returns {string}
     */
    get validatorPublicK() {
        return this.keyInfo["ValidatorPublicKey"]
    }

    /**
     * @returns {string}
     */
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

    /**
     *
     * @param {string} PrivacyTokenAddress
     * @param {string} SignPublicKeyEncode
     * @returns {Promise<string>}
     */
    async getMyLatestShieldRecord(PrivacyTokenAddress,
        SignPublicKeyEncode = 'f78fcecf2b0e2b3267d5a1845c314b76f3787f86981c7abcc5b04abc49ae434a'
    ) {
        /**
         *  get the last shield record from Incognito Backend
         */
        let backendApi = new BackendApi()
        let id = 0
        const resBefore = await backendApi.historyByTokenAccount(this.paymentK, PrivacyTokenAddress, SignPublicKeyEncode)

        for (let i = 0; i < 5; i++) {
            let resAfter = await backendApi.historyByTokenAccount(this.paymentK, PrivacyTokenAddress, SignPublicKeyEncode)
            // console.log('resAfter.data.Result.length = ' + resAfter.data.Result.length + '----' + 'resBefore.data.Result.length = ' + resBefore.data.Result.length   )
            logger.debug('[ %d ] Waiting backend listen tx shield .... ', i + 1)
            if (resAfter.data.Result.length > resBefore.data.Result.length) {
                const idList = []
                for (const iterator of resAfter.data.Result) {
                    idList.push(iterator.ID)
                }
                let id = idList.sort(function (a, b) { return b - a });
                return id[0]
            }
            await wait(120)
        }
        return id
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

    importFromKeyList(keyList, node = null) {
        for (const element of keyList) { this.accountList.push(new IncAccount(element, node)) }
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
            var newAcc = new IncAccount(null)
            newAcc.keyInfo = obj
            newAcc.attachTo(node)
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

    /**
     *
     * @param {number} index
     * @returns {IncAccount}
     */
    get(index) {
        return this.accountList[index]
    }

    /**
     *
     * @param {boolean} all: True: return a list of accout that has no privatekey. False: return the first account found
     * @returns {(IncAccount|Array<IncAccount>)}
     */
    getAccNoPrivateKey(all = false) {
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
        for (const account of arguments) {
            this.accountList.push(account)
        }
        return this
    }

    push() { return this.append(arguments) }
}

module.exports = { IncAccount, IncAccountGroup };