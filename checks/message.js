const config = require('../config.json');

// All checks required before sending a new message

module.exports = (message, socket) => {
  try {
    if (!socket.nickname) {
      socket.emit('notification', {
        type: 'danger',
        message: 'You must choose nickname before you can post messages.',
      });

      socket.emit('disconnect user');

      return false;
    }

    const sinceLastMessage = Date.now() - socket.lastMessage;

    if (sinceLastMessage < config.message.timeout) {
      socket.emit('notification', {
        type: 'danger',
        message: `You can send a new message in ${(
          (config.message.timeout - sinceLastMessage) /
          1000
        ).toFixed(2)} seconds.`,
      });

      return false;
    }

    if (!/[^><]/gi.test(message)) {
      socket.emit('notification', {
        type: 'danger',
        message: 'You are not allowed to use ">" and "<" in messages.',
      });

      return false;
    }

    if (
      message.length < config.message.minLength ||
      message.length > config.message.maxLength
    ) {
      socket.emit('notification', {
        type: 'danger',
        message: `Your message cannot be less than ${config.message.minLength} or more than ${config.message.maxLength} characters long.`,
      });

      return false;
    }

    return true;
  } catch (error) {
    console.log('error ', error.message);
    return false;
  }
};
