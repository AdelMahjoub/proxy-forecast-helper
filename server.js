require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const nodeCache = require('node-cache');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.json({status: 'ok'});
});

app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});