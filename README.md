digger-bridge
=============

Connector module for digger clients either in node or in the browser.




Turns HTTP requests into digger req objects and converts the response back to HTTP


## usage

Server:

```js

```

Browser:

```js
var app = express();
var Bridge = require('digger-bridge');

var digger = Bridge(function(req, reply){
	// req is an object
	// reply is a callback
})

app.use('/digger', digger);
```

## install

```
$ npm install digger-bridge
```