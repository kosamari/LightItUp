var socket = require('socket.io-client')('http://lightitup.space:5040')
var five = require("johnny-five")
var board = new five.Board()

board.on('ready', function () {

  var led = new five.Led.RGB([6, 5, 3])
  led.on()

  socket.on('action', function (data) {
    led.color(data.color)
  })

})
