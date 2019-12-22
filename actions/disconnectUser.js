const log = require('../tools/Logger');
const getAllConnections = require('./getAllConnections');

// Disconnects a user and emits corresponding events

module.exports = (socket, io, type) => {
  try {
    if (socket.nickname) {
      // Broadcast to all users with nicknames
      getAllConnections(io)
        .filter(user => user.nickname !== socket.nickname)
        .forEach(user => {
          io.sockets.sockets[user.id].emit('user left', {
            nickname: socket.nickname,
            type,
          });
        });

      if (type === 'self' || type === 'inactivity') {
        socket.emit('disconnect user', type);
      }

      delete socket.nickname;
      delete socket.time;
      delete socket.session;
    }
  } catch (error) {
    log.error(`${error.name}: ${error.message} in => ${__filename}`);
  }
};
