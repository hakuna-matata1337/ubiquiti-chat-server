const io = require('socket.io')(process.env.PORT || 2000);
const setSocketListeners = require('./actions/setSocketListeners');

io.on('connection', socket => setSocketListeners(socket, io));

process.on('SIGINT', () => io.close(() => process.exit(0)));
process.on('SIGTERM', () => io.close(() => process.exit(0)));
