const winston = require("winston")


const {printf, timestamp, combine} = winston.format;
const customFormat = printf(({level, message, timestamp}) => {
    return `${timestamp} ${level} : ${message}`
})


module.exports = winston.createLogger({
    foemat: combine(
        timestamp(),
        customFormat
    ),
    transports : [
        new winston.transports.Console()
    ]
})