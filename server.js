var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Light Me Up.');
}).listen(5030);
console.log('Server running at 5030');