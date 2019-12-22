// Returns an array with all connected sockets with a nickname

module.exports = io => {
  try {
    return Object.keys(io.sockets.sockets)
      .map(id => ({
        id,
        nickname: io.sockets.sockets[id].nickname,
        time: io.sockets.sockets[id].time,
      }))
      .filter(user => user.nickname);
  } catch (error) {
    console.log('error ', error.message);
  }
};
