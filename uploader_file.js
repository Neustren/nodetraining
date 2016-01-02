var http = require('http');

var message = "Here's looking at you, kid.";
var options = {
  host: 'localhost', port: 3025, path: '/', method: 'POST'
}

var request = http.request(options, function(response) {
  response.on('data', function(data) {
    console.log(data);
  });
});

request.write(message);
request.end();
