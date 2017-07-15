const https = require('https');

module.exports = function(forecastRequest, callback) {

  https.get(forecastRequest, darksky => {

    let data = '';

    darksky.setEncoding('utf8');

    darksky.on('data', (chunk) => {
      data += chunk;
    });

    darksky.on('end', () => {
      return callback(JSON.parse(data));
    });

    darksky.on('error', (err) => {
      return callback(JSON.parse(err));
    });
    
  });
}