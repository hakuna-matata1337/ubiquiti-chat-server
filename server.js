const io = require('socket.io')(2000);
const users = [];

const authorize = socket => users.find(user => user.id === socket.client.id);
const setNickname = (nickname, socket) => {
  if (authorize(socket)) {
    socket.emit('notification', {
      type: 'danger',
      message: 'It looks like you already have a nickname? :]',
    });
  }

  if (
    users.find(user => user.nickname.toLowerCase() === nickname.toLowerCase())
  ) {
    socket.emit('notification', {
      type: 'danger',
      message:
        'This nickname has already been taken. Please choose another one.',
    });
  }

  users.push({
    id: socket.client.id,
    nickname,
  });

  socket.emit('notification', {
    type: 'success',
    message: 'Nickname set to ' + nickname,
  });
};

const userDisconnect = socket => {
  const user = users.findIndex(user => user.id === socket.client.id);
  if (user) {
    users.splice(user, 1);

    socket.emit('notification', {
      type: 'success',
      message: 'user disconnected, id ' + socket.client.id,
    });
  } else {
    console.log('disc failed, id: ', socket.client.id);
  }
};

const broadcastMessage = (message, socket) => {
  socket.broadcast.emit('chat-message', message);

  socket.emit('notification', {
    type: 'danger',
    message: 'It looks like you already have a nickname? :]',
  });
};

io.on('connection', socket => {
  //Object.keys(io.sockets.connected)
  socket.emit('notification', {
    type: 'success',
    message: 'connection with id ' + socket.client.id,
  });

  socket.on('set-nickname', nickname => setNickname(nickname, socket));
  socket.on('chat-message', message => broadcastMessage(message, socket));
  socket.on('disconnect', () => userDisconnect(socket));
});
