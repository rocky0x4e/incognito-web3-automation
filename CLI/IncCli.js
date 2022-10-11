const { execSync } = require('child_process')
const bin = "bin/incognito-cli-linux"

class IncCli {

    constructor(args = "") {
        this.settings = `${bin} ${args}`
    }

    run(args) {
        let command = `${this.settings} ${args}`
        console.log(command)
        return execSync(command, { encoding: 'utf-8' });
    }
}

module.exports = { IncCli };
