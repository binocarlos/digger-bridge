var request = require('browser-request');
var jsonfields = require('json-fields');

/*

	direct proxy through to the reception server
*/

module.exports = function(baseurl){

  baseurl = baseurl || '';

	return function(req, reply){

    request({
      url:(baseurl + req.url).replace(/\/\//g, '/'),
      method:req.method.toUpperCase(),
      headers:jsonfields.stringify(req.headers, 'x-json'),
      body:JSON.stringify(req.body)
    }, function(error, res, body){
      if(error){
        reply(error);
      }
      else if(res.statusCode!=200){
        reply(res.statusCode + ':' + res.body);
      }
      else{
        reply(null, JSON.parse(body));
      }
    })
  
	}

}

module.exports.request = request;