const getAllConnections = require('./getAllConnections');

// Checks if a nickname is already in use

module.exports = (nickname, io) => {
  try {
    return getAllConnections(io).find(
      user => user.nickname.toLowerCase() === nickname.toLowerCase(),
    );
  } catch (error) {
    console.log('error ', error.message);
  }
};
