const express = require("express");
const viewRouter = express.Router();
const path = require('path');

const parentPath = path.join(__dirname, '../', '/public/');

viewRouter.get('/', (req, res) => {
    res.sendFile(parentPath + `${process.env.ENTRY_HTML}.html`);
});
viewRouter.get('/kolmila', (req, res) => {
    res.sendFile(parentPath + 'kolmila.html');
});
viewRouter.get('/discreetly', (req, res) => {
    res.sendFile(parentPath + 'discreetly.html');
});

module.exports = viewRouter;
