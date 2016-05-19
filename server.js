var express = require('express');
var app = express();
var port = 5030;
var ioport = 5040;
var io = require('socket.io').listen(ioport);

/*
express server
*/
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get('/', function (req, res) {
  res.render('controller',{port:ioport});
});
app.use(express.static(__dirname + '/public'));
app.listen(port);

/*
socket.io
*/
io.on('connection', function (socket) {

  socket.on('action', function(message) {
    socket.broadcast.emit('action', message);
  });

});
