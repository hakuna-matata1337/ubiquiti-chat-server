const log = require('../tools/Logger');
const config = require('../config.json');
const findNickname = require('../actions/findNickname');

// All checks required before setting a new nickname

module.exports = (nickname, socket, io) => {
  try {
    if (
      nickname.length < config.nickname.minLength ||
      nickname.length > config.nickname.maxLength
    ) {
      socket.emit('notification', {
        type: 'danger',
        message: `Your nickname cannot be less than ${config.nickname.minLength} or more than ${config.nickname.maxLength} characters long.`,
      });

      return false;
    }

    if (!/^[a-z0-9-_.@! ]+$/gi.test(nickname)) {
      socket.emit('notification', {
        type: 'danger',
        message: 'Please use only letters, digits and - _ . @ !',
      });

      return false;
    }

    if (findNickname(nickname, io)) {
      socket.emit('notification', {
        type: 'danger',
        message:
          'Looks like this Nickname has already been used. Please try with a different one!',
      });

      return false;
    }

    return true;
  } catch (error) {
    log.error(`${error.name}: ${error.message} in => ${__filename}`);
    return false;
  }
};
