digger-bridge
=============

A client to server bridge for digger requests


```js
var Bridge = require('digger-bridge');

// create a bridge connected to a reception server on the given details
var bridge = Bridge({
	hostname:'127.0.0.1',
	port:8799
});

// get a supply chain connected to a backend warehouse
var supplychain = bridge.connect('/my/database/path');

// we can use the supplychain as a container to select from
supplychain('some selector').ship(function(results){
	
})

```