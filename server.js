require('dotenv').config();
const express = require('express');
const nodeCache = require('node-cache');

const forcastUrlBuilder = require('./utils/forecast-url-builder.util');
const forecastRequester = require('./services/forecast-request.service'); 

const app = express();

app.set('port', process.env.PORT || 3000);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://s.codepen.io');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('*',(req, res, next) => {

  let referer = req.headers['referer'];
  if(!referer || !referer.includes(process.env.AUTHORIZED_REFERER)) {
    return res.json({status: 500, error: 'Unauthorized'});
  }

  let patt = /^\/favicon\.ico/;
  let params = req.params['0'];
  
  if(patt.test(req.params['0'])) {
    return;
  }

  let forecastRequest = forcastUrlBuilder(req);
  
  forecastRequester(forecastRequest, response => {
    return res.json(response);
  });

});

app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});