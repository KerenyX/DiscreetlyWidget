const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const inChatController = require('./controllers/inChatController.js');
const logsController = require('./controllers/logsController.js');
const outChatController = require('./controllers/outChatController.js');
// const addressController = require('./controllers/addressController.js');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('/api/chat', (req, res) => {
    inChatController.getMessageFromServer(req, res, io);
});

const viewRoutes = require('./routers/viewRoutes.js');
const logsRouter = require('./routers/logsRoutes.js');
app.use('', viewRoutes);
app.use('/api/logs', logsRouter);

io.on('connection', (socket) => {
    logsController.logMessage(1, socket.id, 0, `User sent a request to connect`);
    outChatController.sendMessageToServer(socket.id, 0, "start", "");

    socket.on('out chat message', (msg) => {
        logsController.logMessage(5, socket.id, 0, `User asked to send a message`);
        outChatController.sendMessageToServer(socket.id, 0, "text", msg);
        socket.emit('out chat message', msg); /* Show the user what the message was */
    });

    socket.on('disconnect', () => {
        logsController.logMessage(2, socket.id, 0, `User sent a request to disconnect`);
        outChatController.sendMessageToServer(socket.id, 0, "end", "");
        socket.disconnect();
    });

    socket.on('user is typing', () => {
        outChatController.sendMessageToServer(socket.id, 0, "typing", "");
    });
});

server.listen(port, () => console.log('Express server is running on port', port));
