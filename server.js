require('dotenv').config();
const express = require('express');
const NodeCache = require('node-cache');

const forcastUrlBuilder = require('./utils/forecast-url-builder.util');
const forecastRequester = require('./services/forecast-request.service'); 

const app = express();

const forecastCache = new NodeCache({ stdTTL: 3600, checkperiod: 3600 }); 

app.set('port', process.env.PORT || 3000);

// Accept requests from codepen
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://s.codepen.io');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Refuse referer other than codepen
app.use((req, res, next) => {
  let referer = req.headers['referer'];
  if(!referer || !referer.includes(process.env.AUTHORIZED_REFERER)) {
    return next(err);
  }
  next();
});

// Handle users requests
app.get('*',(req, res, next) => {

  // /favicon.ico pattern
  let patt = /^\/favicon\.ico/;
  let params = req.params['0'];
  
  // Refuse connection for favicon.ico requests
  if(patt.test(req.params['0'])) {
    return;
  }

  // Build a forecast url from users requests
  let forecastRequest = forcastUrlBuilder(req)['forecastUrl'];
  
  // Get Latitude and longitude from users requests
  let latLong = forcastUrlBuilder(req)['latLong'];

  // Get User's queryOptions
  let queryOptions = forcastUrlBuilder(req)['queryOptions'];

  // If lat,long is provided
  if(latLong) {
    // Check cache for 'lat,long' key
    forecastCache.get(latLong, (err, value) => {
      if(err) {
        console.log(err);
        return res.json({status: 503, error: 'Unexpected error, please try again'});
      }
      // 'lat,long' key not found in cache
      if(!err && !value) {
        console.log('Set cache');
        // Hit darksky api 
        forecastRequester(forecastRequest, response => {
          // Don't cache responses with errors
          if(response['error']) {
            return res.json(response);
          }
          // Cache the response as { 'lat,long': { response, queryOptions } }
          forecastCache.set(latLong, {data: response, options: queryOptions}, 3600, (err, isSet) => {
            // Cache is set success
            if(!err && isSet) {
              return res.json(response);
            }
            return res.json({status: 503, error: 'Unexpected error, please try again'});
          });
        });
      // 'lat,long' key found in cache 
      } else {
        // Cached value has the same queryOptions
        if(value['options'] === queryOptions) {
          console.log('Data from cache');
          return res.json(value['data']);
        }
        // Update user request
        forecastRequester(forecastRequest, response => {
          // Cache the response as { 'lat,long': { response, queryOptions } }
          forecastCache.set(latLong, {data: response, options: queryOptions}, 3600, (err, isSet) => {
            // Cache is set success
            if(!err && isSet) {
              console.log('Update cache');
              return res.json(response);
            }
            return res.json({status: 503, error: 'Unexpected error, please try again'});
          });
        });
      }
    });
  // user did not provide lat,lng
  } else {
    return res.json({status: 404, error: 'Bad request'});
  }
});

app.use((err, req, res, next) => {
  return res.json({status: 500, error: 'Unauthorized'});
});

app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});