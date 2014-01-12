/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/
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