const { createLogger } = require('winston');
const winston = require('winston');
const format = winston.format;

var dt = new Date()
var arrTime = [dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds()]
for (var index in arrTime) {
    arrTime[index] = (arrTime[index] < 10) ? "0" + arrTime[index] : arrTime[index]
}
var nameLogFile = arrTime.join(".")
nameLogFile = `logs/${nameLogFile.substring(0, 10)}-${nameLogFile.substring(11)}.log`
const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)


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
                    format.json()
                )
            }),
            new winston.transports.Console({
                level: 'info',
                format: format.combine(
                    format.colorize(),
                    logFormat
                )
            })
        ],
    });
    return LOGGER
}

module.exports = { getLogger }