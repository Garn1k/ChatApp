const mongoose = require('mongoose');
const {db_url} = require("../src/variables.config");
const logger = require("../logger");

mongoose.connection.once('open', () => {
    logger.info('ok');
})
mongoose.connection.on('error', err => {
    logger.info('error');
})

async function connectMongo() {
    await mongoose.connect(db_url)
}

async function disconnectMongo() {
    await mongoose.disconnect(db_url)
}

module.exports = {connectMongo, disconnectMongo}

