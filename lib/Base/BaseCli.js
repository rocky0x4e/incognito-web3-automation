const { execSync, exec } = require('child_process')
const { LOGGER } = require('../Utils/LoggingManager')
class BaseCli {

    constructor(args = "") {
        this.settings = args
        this.sync = true
    }

    run(args) {
        let command = `${this.settings} ${args}`
        if (this.sync) {
            LOGGER.debug("run sync::", command)
            return execSync(command, { encoding: 'utf-8' });
        }
        LOGGER.debug("run async::", command)
        return exec(command, { encoding: 'utf-8' });
    }
}

module.exports = { BaseCli }