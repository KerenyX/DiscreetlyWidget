const logsController = require('./logsController');

inChatController = {
    async getMessageFromServer(req, res, io) {
        /* eventType: volStart, volEnd, text, volTyping */
        const { userId, VolName, text = "", eventType } = req.body;
        let eventNum, eventName = "";

        try {
            switch (eventType) {
                case "volStart": {
                    eventName = 'chat started';
                    eventNum = 3;
                    break;
                }
                case "volEnd": {
                    eventName = 'chat ended';
                    eventNum = 7;
                    break;
                }
                case "text": {
                    eventName = 'in chat message';
                    eventNum = 4;
                    break;
                }
                case "volTyping": {
                    eventName = "volunteer is typing";
                    break;
                }
                default: {
                    eventName = "Unknown error";
                    eventNum = 6;
                    break;
                }
            }

            if (eventNum) {
                logsController.logMessage(eventNum, userId, "0", `(${eventName})`);
            }

            if (eventNum && eventNum != 6) {
                await io.to(userId).emit(eventName, text);
            }
        } catch(error) {
            logsController.logMessage(6, userId, "0", `(${eventType}) Error getting msg from server: ${error}`);
        } finally {
            res.status(200).json(userId);
        }
    }
};

module.exports = inChatController;
