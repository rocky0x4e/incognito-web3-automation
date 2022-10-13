const { execSync, exec } = require('child_process')
const bin = "bin/incognito-cli-linux"

class IncCli {

    constructor(args = "") {
        this.settings = `${bin} ${args}`
    }

    run(args, sync = True) {
        let command = `${this.settings} ${args}`
        console.log("run::", command)
        if (sync) {
            return execSync(command, { encoding: 'utf-8' });
        }
        return exec(command, { encoding: 'utf-8' });
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
