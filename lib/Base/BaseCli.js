const { execSync, exec } = require('child_process')
const { getLogger } = require('../Utils/LoggingManager')
const logger = getLogger("BaseCli")
class BaseCli {

    constructor(args = "") {
        this.settings = args
        this.sync = true
    }

    run(args) {
        let command = `${this.settings} ${args}`
        if (this.sync) {
            logger.debug("run sync::", command)
            return execSync(command, { encoding: 'utf-8' });
        }
        logger.debug("run async::", command)
        return exec(command, { encoding: 'utf-8' });
    }
}

module.exports = { BaseCli }