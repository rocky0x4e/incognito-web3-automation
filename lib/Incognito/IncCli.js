const { execSync, exec } = require('child_process')
const { BaseCli } = require('../Base/BaseCli')
const bin = "bin/incognito-cli-linux"

class IncCli extends BaseCli {

    constructor(args = "") {
        super(args)
        this.settings = `${bin} ${args}`
    }

    getKeyInfo(privateKey) {
        return JSON.parse(this.run(`account keyinfo --privateKey ${privateKey}`))
    }

    genAccount(mnemonic = null, numAccount = 1) {
        if (mnemonic == null) {
            return JSON.parse(this.run(`account gen --numAccounts ${numAccount}`))
        }
        return JSON.parse(this.run(`account --mnemonic "${mnemonic}" --numAccounts ${numAccount}`))
    }
}

module.exports = { IncCli };
