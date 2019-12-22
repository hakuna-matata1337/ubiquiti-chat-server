const io = require('socket.io')(2000);
const setSocketListeners = require('./actions/setSocketListeners');

io.on('connection', socket => setSocketListeners(socket, io));

['SIGINT', 'SIGTERM'].forEach(eventType => {
  process.on(eventType, () => io.close());
});
