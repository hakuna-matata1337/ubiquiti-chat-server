const setNickname = require('./setNickname');
const broadcastMessage = require('./broadcastMessage');
const disconnectUser = require('./disconnectUser');

// Sets socket events

module.exports = (socket, io) => {
  socket.on('set nickname', nickname => setNickname(nickname, socket, io));
  socket.on('global message', message => broadcastMessage(message, socket, io));
  socket.on('disconnect user', () => disconnectUser(socket, io, 'self'));
  socket.on('disconnect', () => disconnectUser(socket, io, 'server'));
};
