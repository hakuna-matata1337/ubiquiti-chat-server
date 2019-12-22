const config = require('../config.json');
const messageChecks = require('../checks/message');

// Emits a global message to all users

module.exports = (message, socket, io) => {
  try {
    if (messageChecks(message, socket)) {
      socket.lastMessage = Date.now();
      socket.session = config.disconnect.inactivity;

      socket.emit('session update', config.disconnect.inactivity);

      io.emit('global message', {
        text: message,
        nickname: socket.nickname,
        time: socket.lastMessage,
      });
    }
  } catch (error) {
    console.log('error ', error.message);
  }
};
