const { execSync, exec } = require('child_process')
class BaseCli {

    constructor(args = "") {
        this.settings = `bin file ${args}`
        this.sync = true
    }

    run(args) {
        let command = `${this.settings} ${args}`
        console.log("run::", command)
        if (this.sync) {
            return execSync(command, { encoding: 'utf-8' });
        }
        return exec(command, { encoding: 'utf-8' });
    }
}

module.exports = { BaseCli }