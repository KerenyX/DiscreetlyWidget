const axios = require('axios');
const logsController = require('./logsController');

outChatController = {
    async sendMessageToServer(socketId, ipAddress, eventType, message) {
        /* eventType: text, start, end, typing */
        await axios.post(`${process.env.TARGET_SERVER}/userMessage`, {
            userId: socketId,
            userName: "", 
            text: message,
            timestamp: Date.now(),
            eventType: eventType,
            ipAddress: ipAddress
        })
        .then(response => {
            const eventId = getEventIdFromEventStr(eventType);
            logsController.logMessage(eventId, socketId, ipAddress, `Event (${eventType}) sent to server`);
        })
        .catch(error => {
            logsController.logMessage(6, socketId, ipAddress, `(${eventType}) Error sending msg to server. ${error}`);
        })
        .finally(() => {
            return socketId;
        })
    }
};

function getEventIdFromEventStr(eventStr) {
    let eventId;

    switch(eventStr) {
        case "text": {
            eventId = 5;
            break;
        }
        case "start": {
            eventId = 1;
            break;
        }
        case "end": {
            eventId = 2;
            break;
        }
        case "typing": {
            eventId = 9;
            break;
        }
        default: {
            eventId = 6;
            break;    
        }
    }

    return eventId;
}

module.exports = outChatController;
