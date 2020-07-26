const mongoose = require('mongoose');

const logMessage = {
    timestamp: String,
    eventType: Number,
    message: String,
    userId: String,
    ipAddress: String
};

let modelName = process.env.ENVIRONMENT == "prod" ? 'LogMessage' : 'TestLogMessage';

const logMessageSchema = new mongoose.Schema(logMessage);
const LogMessage = mongoose.model(modelName, logMessageSchema);

module.exports = LogMessage;

/*  eventType:
    1: user connected
    2: user disconnected
    3: chat started
    4: incoming message
    5: outgoing message
    6: error
    7: chat ended
    8: incoming typing
    9: outgoing typing
*/
