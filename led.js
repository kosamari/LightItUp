var socket = require('socket.io-client')('http://lightitup.space:5040');
var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var r1 = new five.Relay(4);
  var b1 = new five.Relay(5);
  var g1 = new five.Relay(6);
  var r2 = new five.Relay(7);
  var b2 = new five.Relay(8);
  var g2 = new five.Relay(9);
  var interval;
  var currentColor = 'white'
  var colorstate = true;
  var times = 5;

  var color =  {
      white:function white(){
        currentColor = 'white'
        r1.off()
        g1.off()
        b1.off()
        r2.off()
        g2.off()
        b2.off()
      },
      lightBlue:function lightBlue(){
        currentColor = 'lightBlue'
        r1.on()
        g1.off()
        b1.off()
        r2.on()
        g2.off()
        b2.off()
      },
      blue:function blue(){
        currentColor = 'blue'
        r1.on()
        g1.on()
        b1.off()
        r2.on()
        g2.on()
        b2.off()
      },
      lightGreen:function lightGreen(){
        currentColor = 'lightGreen'
        r1.off()
        g1.off()
        b1.on()
        r2.off()
        g2.off()
        b2.on()
      },
      green:function green(){
        currentColor = 'green'
        r1.on()
        g1.off()
        b1.on()
        r2.on()
        g2.off()
        b2.on()
      },
      red:function red(){
        currentColor = 'red'
        r1.off()
        g1.on()
        b1.on()
        r2.off()
        g2.on()
        b2.on()
      },
      pink:function pink(){
        currentColor = 'pink'
        r1.off()
        g1.on()
        b1.off()
        r2.off()
        g2.on()
        b2.off()
      }
    }

  function turnOff(){
    r1.on()
    g1.on()
    b1.on()
    r2.on()
    g2.on()
    b2.on()
  }

  function turnOn(){
    currentColor = 'white'
    r1.off()
    g1.off()
    b1.off()
    r2.off()
    g2.off()
    b2.off()
  }

  function blink(col){
    if(times > 0){
      if(colorstate){
        // console.log(times)
        times = times-1;
        color[col]();
      }else{
        turnOff()
      }
    }else{
      enableBlink();
      clearInterval(interval)
    }
    colorstate = !colorstate
  }

  function makeItBlink(){
    times = 5;
    interval = setInterval(function(){blink(currentColor)},300)
    disableBlink();
  }

  function random(){
    var name = ['white','lightBlue','blue','lightGreen','green','red','pink']
    var random = Math.floor(Math.random()*7)
    color[name[random]]();
  }

  function disableBlink(color) {
    socket.emit('blink', {state:false});
  }

  function enableBlink(color) {
    socket.emit('blink', {state:true});
  }

  //socket IO setting
  socket.on('connect', function(){
    console.log('Socket Connected')
  });
  socket.on('action', function(data){
    if(data.blink){
      console.log(data.name + ' made LED blink')
      makeItBlink()
    }else{
      console.log(data.name + ' changed LED color to ' + data.color)
      color[data.color]();
    }
  });
  socket.on('disconnect', function(){
    console.log('Socket Disconnected !')
  });


  this.repl.inject({
    r1: r1,
    g1: g1,
    b1: b1,
    r2: r2,
    g2: g2,
    b2: b2,
    turnOn:turnOn,
    turnOff:turnOff,
    white:color.white,
    lightBlue:color.lightBlue,
    blue:color.blue,
    lightGreen:color.lightGreen,
    green:color.green,
    red:color.red,
    pink:color.pink,
    startInterval: function(sec){interval = setInterval(random,sec)},
    clearInterval: function(){clearInterval(interval)},
    blink: function(col,t,i){times = t||5; interval = setInterval(function(){blink(col||currentColor)},i||300)}
  });
});