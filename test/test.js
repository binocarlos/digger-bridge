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

var bridge = require('../src/server');
var http = require('http');
var fs = require('fs');
var phantom = require('phantom');

describe('digger bridge', function(){
  var browser, server;

  before(function (done) {
    this.timeout(5000);

    serverstatus = {};

    phantom.create(function (ph) {
      ph.createPage(function (tab) {

        browser = tab;
        
        var port = process.env['DIGGER_APP_PORT'] || 8791;

        var handler = bridge(function(req, reply){
          req.headers['x-json-thing'].apple.should.equal(10);
          reply(null, [{
            orange:12
          }])
        })

        server = http.createServer(function(req, res){
          if(req.url=='/test.html' || req.url=='/browser.js'){
            fs.createReadStream(__dirname + req.url).pipe(res);
          }
          else{
            handler(req, res);
          }
        });

        server.listen(8791, function(){

          done();

        })
        
      })
    })
  })


  it('should route a http request through to the handler function', function (done) {

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
        answer[0].orange.should.equal(12);
        done();
      })

    })

    req.end();

  })

  it('should route a browser http request through to the handler function', function (done) {


    this.timeout(3000);

    browser.open('http://localhost:8791/test.html', function (status) {

      setTimeout(function () {
        browser.evaluate(function inBrowser() {
          // this will be executed on a client-side
          return window._test;
        }, function fromBrowser(_test) {

          _test.results.length.should.equal(1);
          _test.results[0].orange.should.equal(12);
          done();
        });
      }, 1000)

    });

  })

})