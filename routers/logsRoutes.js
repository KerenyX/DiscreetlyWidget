const express = require("express");
const logsRouter = express.Router();
const path = require('path');
const logsController = require('../controllers/logsController.js');

const parentPath = path.join(__dirname, '../', '/public/');

logsRouter.get('', (req, res) => {
    res.sendFile(parentPath + 'logs.html');
});
logsRouter.post('/chat', (req, res) => {
    logsController.getMessagesByDates(req, res);
});

module.exports = logsRouter;
