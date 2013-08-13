/*

  (The MIT License)

  Copyright (C) 2005-2013 Kai Davenport

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

var Client = require('digger-client');
var http = require('http');
http.globalAgent.maxSockets = 100;
var exports = module.exports = function(options){

  options = options || {};

  if(typeof(options)==='string'){
    var parts = options.split(':');
    options = {
      hostname:parts[0],
      port:parts[1]
    }
  }
  var hostname = options.hostname || '127.0.0.1';
  var port = options.port || 8791;

  function run_http_request(http_options, done){

    http_options.hostname = hostname;
    http_options.port = port;
    http_options.headers = http_options.headers || {};
    http_options.path = http_options.url;

    for(var prop in http_options.headers){
      var val = http_options.headers[prop];
      if(typeof(val)!=='string'){
        http_options.headers[prop] = JSON.stringify(val);
      }
    }

    var body = null;
    if(http_options.body && typeof(http_options.body)!=='string'){
      body = JSON.stringify(http_options.body);
    }
    delete(http_options.body);
    if(body){
      http_options.headers['content-type'] = 'application/json';
      http_options.headers['content-length'] = body.length;  
    }

    var req = http.request(http_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (body){
        if(res.headers['content-type'] === 'application/json'){
          body = JSON.parse(body);
        }
        done(null, body, res);
      });
    });

    req.on('error', function(e) {
      done(e);
    });

    // write data to request body
    if(body){
      req.write(body);
    }
    req.end();
  }

  function check_server(done){
    run_http_request({
      url:'/ping',
      method:'GET'
    }, function(error, body, res){
      if(error || body!=='pong'){
        console.error('could not connect to HTTP server: ' + hostname + ':' + port);
        console.error(error);
        process.exit();
      }
      done();
    })
  }

  function connector(req, reply){
    run_http_request(req, function(error, body, res){
      if(error || (res && res.statusCode!==200)){
        console.error((res ? res.statusCode : '') + ' - ' + (error || body));
      }
      else{
        reply(null, body);
      }
    })
  }

  var client = Client(connector);
  client.check_server = check_server;
  return client;
}