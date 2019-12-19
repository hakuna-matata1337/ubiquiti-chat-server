const express = require('express');

const app = express();

let nicknames = [];

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', '*');
  res.set('Access-Control-Allow-Methods', '*');
  console.log(`Method: ${req.method} | URL: ${req.url} | IP: ${req.ip}`);
  next();
});

//TODO implement express router and the rest of the routes and sockets

app.get('/users/:name', (req, res) => {
  if (nicknames.includes(req.params.name)) {
    return res.json({
      error: 'This nickname is already is use. Please choose a different one.',
    });
  }

  return res.json({ message: 'This nickname is free.' });
});

app.delete('/users/:name', (req, res) => {
  if (!nicknames.find(name => name === req.params.name)) {
    return res.json({
      error: 'You are already logged out.',
    });
  }

  nicknames = nicknames.filter(name => name !== req.params.name);

  return res.json({ message: 'Logged out successfully.' });
});

app.use('/', (_, res) => res.status(404).json({ error: 'Page not found' }));

app.listen(4000, () => console.log('server listening on port 4000'));
