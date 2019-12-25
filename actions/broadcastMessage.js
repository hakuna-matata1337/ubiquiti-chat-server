const log = require('../tools/Logger');
const config = require('../config.json');
const messageChecks = require('../checks/message');
const getAllConnections = require('./getAllConnections');

// Emits a global message to all users

module.exports = (message, socket, io) => {
  try {
    if (messageChecks(message, socket)) {
      socket.lastMessage = Date.now();
      socket.session = config.disconnect.inactivity;

      socket.emit('session update', config.disconnect.inactivity);

      getAllConnections(io).forEach(user => {
        io.sockets.sockets[user.id].emit('global message', {
          text: message,
          nickname: socket.nickname,
          time: socket.lastMessage,
        });
      });
    }
  } catch (error) {
    log.error(`${error.name}: ${error.message} in => ${__filename}`);
  }
};
