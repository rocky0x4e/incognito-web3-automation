const winston = require('winston');
const format = winston.format;

function makeLogFile() {
    var dt = new Date()
    var arrTime = [dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds()]
    for (var index in arrTime) {
        arrTime[index] = (arrTime[index] < 10) ? "0" + arrTime[index] : arrTime[index]
    }
    var nameLogFile = arrTime.join(".")
    return `logs/${nameLogFile.substring(0, 10)}-${nameLogFile.substring(11)}.log`
}
const formatConsole = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${JSON.stringify(info.message, null, 3)}`)

// var nameLogFile = makeLogFile()
var nameLogFile="logs/mocha.log"
function getLogger(label = "Test") {
    const LOGGER = winston.createLogger({
        level: 'debug',
        format: format.combine(
            format.label({ label: label }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            // Format the metadata object
            format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
        ),
        transports: [
            new winston.transports.File({
                filename: nameLogFile,
                level: 'debug',
                format: format.combine(
                    // format.json()
                    formatConsole
                )
            }),
            new winston.transports.Console({
                level: 'info',
                format: format.combine(
                    format.colorize(),
                    formatConsole
                )
            })
        ],
    });
    return LOGGER
}

module.exports = { getLogger }