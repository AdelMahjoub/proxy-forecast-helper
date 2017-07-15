const https = require('https');

module.exports = function(forecastRequest, callback) {

  https.get(forecastRequest, darksky => {

    if(darksky.statusCode === 404) {
      return callback({status: 404, error: 'bad request'});
    }

    let data = '';

    darksky.setEncoding('utf8');

    darksky.on('data', (chunk) => {
      data += chunk;
    });

    darksky.on('end', () => {
      return callback(JSON.parse(data));
    });

  });
}