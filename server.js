const io = require('socket.io')(2000);
const usersList = [{ nickname: 'Admin', id: '1' }];

const userExists = nickname =>
  usersList.find(
    user => user.nickname.toLowerCase() === nickname.toLowerCase(),
  );

const setNickname = (nickname, socket) => {
  if (userExists(nickname)) {
    return socket.emit('notification', {
      type: 'danger',
      message:
        'This nickname has already been taken. Please choose another one.',
    });
  }

  usersList.push({ id: socket.id, nickname });

  socket.emit('set-nickname', nickname);
  socket.emit('notification', {
    type: 'success',
    message: `Welcome to the chat, ${nickname}! 🙂`,
  });
};

const userDisconnect = (nickname, socket) => {
  const userIndex = usersList.findIndex(user => user.id === socket.client.id);
  if (userIndex !== -1) {
    usersList.splice(userIndex, 1);

    socket.emit('notification', {
      type: 'success',
      message: `You have been successfully disconnected, ${nickname}`,
    });
  } else {
    console.log('disc failed, id: ', socket.client.id, usersList[userIndex]);
  }
};

const broadcastMessage = (message, socket) => {
  socket.broadcast.emit('chat-message', message);

  socket.emit('notification', {
    type: 'success',
    message: 'message sent: ' + message,
  });
};

io.on('connection', socket => {
  console.log('connection established');
  //Object.keys(io.sockets.connected)
  socket.emit('notification', {
    type: 'success',
    message: 'connection with id ' + socket.client.id,
  });

  socket.on('set-nickname', nickname => setNickname(nickname, socket));
  socket.on('chat-message', message => broadcastMessage(message, socket));
  socket.on('disconnect', nickname => userDisconnect(nickname, socket));
});
