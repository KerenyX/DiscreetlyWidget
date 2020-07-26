const LogMessage = require('../model/logMessage.js');
const consts = require('../consts');
const moment = require("moment");
               require("moment-timezone");

logsController = {
    async logMessage(eventType, userId, ipAddress, message) {
        try {
            let convertedTimezone = moment.tz(moment(), "Asia/Jerusalem");

            const logMessage = new LogMessage({
                timestamp: convertedTimezone.format(),
                eventType: eventType,
                message: message,
                userId: userId,
                ipAddress: ipAddress
            });

            await logMessage.save((error, result) => {
                if (error) {
                    console.log(`Error saving message to mongoDB: ${err}`);
                }
            });
        } catch(error) {
            console.log(`Error saving message to mongoDB: ${error}`);
        }
    },
    async getMessagesByDates(req, res) {
        const { key, eventType, startDate, endDate, limit, offset } = req.body;

        if (key === process.env.SECRET_INTERNAL_KEY) {
            await LogMessage.find({
                timestamp: { $gte: parseDate(startDate), $lt: parseDate(endDate) },
                eventType: eventType > 0 ? Number(eventType) : { $gte: 0 }
            })
            .skip(Number(offset)).limit(Number(limit))
            .sort({timestamp: -1})
            .then(docs => {
                return res.json(docs);
            })
            .catch(error => console.log(`query error: ${error}`));
        } else {
            res.json({"message": "wrong api key"});
        }
    }
};

function parseDate(dateStr) {
    const date = moment(dateStr).format(consts.DATE_FORMAT);
    return date;
}

module.exports = logsController;
