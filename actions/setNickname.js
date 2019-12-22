const log = require('../tools/Logger');
const config = require('../config.json');
const getAllConnections = require('./getAllConnections');
const disconnectUser = require('./disconnectUser');
const nicknameChecks = require('../checks/nickname');

// Sets user nickname

module.exports = (nickname, socket, io) => {
  try {
    if (nicknameChecks(nickname, socket, io)) {
      socket.nickname = nickname;
      socket.time = Date.now();
      socket.session = config.disconnect.inactivity;

      socket.emit('set nickname', {
        nickname,
        time: socket.time,
        session: config.disconnect.inactivity,
      });

      // Broadcast to all users with nicknames
      getAllConnections(io)
        .filter(user => user.nickname !== socket.nickname)
        .forEach(user => {
          io.sockets.sockets[user.id].emit('new user join', {
            nickname,
            time: socket.time,
          });
        });

      socket.emit(
        'users list',
        getAllConnections(io).map(user => ({
          nickname: user.nickname,
          time: user.time,
        })),
      );

      const interval = setInterval(() => {
        if (socket.session <= 0 || isNaN(socket.session)) {
          clearInterval(interval);
          disconnectUser(socket, io, 'inactivity');
        } else {
          socket.session -= 1;
        }
      }, 1000);
    }
  } catch (error) {
    log.error(`${error.name}: ${error.message} in => ${__filename}`);
  }
};
