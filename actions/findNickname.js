const log = require('../tools/Logger');
const getAllConnections = require('./getAllConnections');

// Checks if a nickname is already in use

module.exports = (nickname, io) => {
  try {
    return getAllConnections(io).find(
      user => user.nickname.toLowerCase() === nickname.toLowerCase(),
    );
  } catch (error) {
    log.error(`${error.name}: ${error.message} in => ${__filename}`);
  }
};
