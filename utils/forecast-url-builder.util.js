const queryString   = require('querystring');
const isEmptyObject = require('./is-empty-object.util.js');

module.exports = function(req) {

  let queryParams = req.params['0'];
  let queryOptions = '';
  
  if(!isEmptyObject(req.query)) {
    queryOptions = `?${queryString.stringify(req.query)}`
  }

  if(queryParams.includes('/forecast')) {
    queryParams = queryParams.replace('/forecast', '');
  }

  return `${process.env.DARKSKY_URL}/${process.env.DARKSKY_KEY + queryParams + queryOptions}`;
  
}