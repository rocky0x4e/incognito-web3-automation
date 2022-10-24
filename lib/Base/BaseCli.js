const { execSync, exec } = require('child_process')
class BaseCli {

    constructor(args = "") {
        this.settings = `bin file ${args}`
        this.sync = true
    }

    run(args) {
        let command = `${this.settings} ${args}`
        if (this.sync) {
            console.log("run sync::", command)
            return execSync(command, { encoding: 'utf-8' });
        }
        console.log("run async::", command)
        return exec(command, { encoding: 'utf-8' });
    }
}

module.exports = { BaseCli }