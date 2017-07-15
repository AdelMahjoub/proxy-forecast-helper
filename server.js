require('dotenv').config();
const express = require('express');
const NodeCache = require('node-cache');

const forcastUrlBuilder = require('./utils/forecast-url-builder.util');
const forecastRequester = require('./services/forecast-request.service'); 

const app = express();

const forecastCache = new NodeCache({ stdTTL: 3600, checkperiod: 3600 }); 

app.set('port', process.env.PORT || 3000);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://s.codepen.io');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((req, res, next) => {
  let referer = req.headers['referer'];
  if(!referer || !referer.includes(process.env.AUTHORIZED_REFERER)) {
    return next(err);
  }
  next();
});

app.get('*',(req, res, next) => {

  let patt = /^\/favicon\.ico/;
  let params = req.params['0'];
  
  if(patt.test(req.params['0'])) {
    return;
  }

  let forecastRequest = forcastUrlBuilder(req)['forecastUrl'];
  let latLong = forcastUrlBuilder(req)['latLong'];

  if(latLong) {
    forecastCache.get(latLong, (err, value) => {
      if(err) {
        console.log(err);
      }
      if(!err && !value) {
        console.log('setting cache');
        forecastRequester(forecastRequest, response => {
          forecastCache.set(latLong, response, 3600, (err, isSet) => {
            if(!err && isSet) {
              return res.json(response);
            }
            return res.json({status: 503, error: 'Unexpected error, please try again'});
          });
        });
      } else {
        return res.json(value);
      }
    });
  }
});

app.use((err, req, res, next) => {
  return res.json({status: 500, error: 'Unauthorized'});
});

app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});