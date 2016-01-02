var fs = require('fs'),
    http = require('http');

http.createServer(function(request, response) {

  var y = (JSON.stringify(request.url).substring(2,request.url.length+1)).replace(/%20/g, " ");
  var newFile = fs.createWriteStream(y);
  request.pipe(newFile);

  request.on('end', function() {
    response.end('uploaded!');
  });

}).listen(3026);
