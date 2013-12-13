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
var bridge = require('../src');
var http = require('http');

describe('digger bridge', function(){

  it('should route a http request through to the handler function', function (done) {

    var handler = bridge(function(req, reply){
      req.headers['x-json-thing'].apple.should.equal(10);
      reply(null, {
        orange:12
      })
    })

    var server = http.createServer(handler);

    server.listen(8791, function(){

      var req = http.request({
        hostname: '127.0.0.1',
        port: 8791,
        path: '/',
        headers:{
          "x-json-thing":'{"apple":10}'
        },
        method: 'GET'
      }, function(res){

        var answer = '';

        res.on('data', function(data){
          answer += data;
        })

        res.on('end', function(){
          answer = JSON.parse(answer);
          answer.orange.should.equal(12);
          done();
        })

      })

      req.end();
    })

  })


})


