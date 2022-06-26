
const express = require('express');
const router = require('./auth/routes');

const app = express();



// Prepare the express app


app.use(express.json());
const PORT = process.env.PORT || 3002;
app.use(express.urlencoded({ extended: true }));

app.use(router);

module.exports = {
  server: app,
  start: () => app.listen(PORT, console.log('server running on', PORT)),
}