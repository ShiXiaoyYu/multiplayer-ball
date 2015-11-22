/**
 * Created by zhouss on 15-11-19.
 */
var express = require('express');
var app = express();
var path = require('path');
app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);

var players = [];
var speed = 0.05;
var small = false;//要写在外面
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {


    players.push({
        'id': socket.id,
        'x': 100*(Math.floor(Math.random()*10+1)),
        'y': 50*(Math.floor(Math.random()*10+1))
    });

    var clearUp = false;
    var clearDown = false;
    var clearRight = false;
    var clearLeft = false;
    io.sockets.emit('move', players);

    socket.on('move', function (data) {


        if (data.direction == 'up') {
            clearUp = false;
            clearDown = true;
            clearRight = true;
            clearLeft = true;
            clearInterval(timerUp);
            getSmall(data.socketId);
            if(small == true){
                getPlayerById(data.socketId).y -= speed;
            }
            var timerUp = setInterval(function () {

                if (clearUp == true) {
                    clearInterval(timerUp);
                }
                getPlayerById(data.socketId).y -= speed;
              console.log(getPlayerById(data.socketId).y);

                if(getPlayerById(data.socketId).y<=10){
                    console.log('up'+'over');
                 //   io.sockets.on('last','second');
                    clearInterval(timerUp);
                }

            }, 100);

        } else if (data.direction == 'down') {
            clearDown = false;
            clearUp = true;
            clearRight = true;
            clearLeft = true;
            clearInterval(timerDown);
            if(small == true){
                getPlayerById(data.socketId).y += speed;
            }
            var timerDown = setInterval(function () {
              //  console.log('down');

                if (clearDown == true) {
                    clearInterval(timerDown);
                }
                getPlayerById(data.socketId).y += speed;

                if( getPlayerById(data.socketId).y>=990){
                    console.log('down'+'over');
                    io.sockets.emit('last');
                    clearInterval(timerDown);
                }

            }, 100);


        } else if (data.direction == 'left') {

            clearLeft = false;
            clearUp = true;
            clearDown = true;
            clearRight = true;
            clearInterval(timerLeft);

            getSmall(data.socketId);
            if(small == true){
                getPlayerById(data.socketId).x -= speed;
                io.sockets.emit('last');
            }
            var timerLeft = setInterval(function () {
                if (clearLeft == true) {
                    clearInterval(timerLeft);
                }
                getPlayerById(data.socketId).x -= speed;
                console.log(getPlayerById(data.socketId).x);
                if(getPlayerById(data.socketId).x<=10){
                    console.log('left'+'over');

                    io.sockets.emit('last');
                    clearInterval(timerLeft);
                  //  io.sockets.on('disconnect');
                }

            }, 100);


        } else if (data.direction == 'right') {
            clearRight = false;
            clearUp = true;
            clearDown = true;
            clearLeft = true;
            getSmall(data.socketId);
            if(small == true){
                getPlayerById(data.socketId).x += speed;

            }
            clearInterval(timerRight);
            var timerRight = setInterval(function () {
             //   console.log('right');
                if (clearRight == true) {
                    clearInterval(timerRight);
                }
                getPlayerById(data.socketId).x += speed;

                if(getPlayerById(data.socketId).x>=1490){
                    console.log('right'+'over');
                   // io.sockets.emit('lastT','second'); // 前端并没有触发go  cai:一个事件推送 只能定义一次 触发就随意了; 而且定义在全局权限最高(并不是)
                    clearInterval(timerRight);

                    clearUp = true;
                    clearDown = true;
                    clearRight = true;
                    clearLeft = true;

                    io.sockets.emit('last');
                //    io.sockets.on('disconnect');


                }

            }, 100);
        }

    //    console.log('go');
        io.sockets.emit('move', players);
        io.sockets.emit('disconnect');
    });


    socket.on('over', function () {
        clearUp = true;
        clearDown = true;
        clearRight = true;
        clearLeft = true;
        console.log('game over');
        io.sockets.emit('last');
   //     io.sockets.on('disconnect');

    });
   // socket.on('disconnect',function(){
       // console.log('dis')
    //})

});


function getSmall(id) {
    for (var i = 0; i < players.length; i++) {
        if (i < 1) {
            speed = 0.05;
            small = true;
        } else {
            speed = 0.25;
            small = false;
        }

    }
}
/**/
function getPlayerById(id) {
    for (var i = 0; i < players.length; i++) {
        if (i < 1) {
            speed = 0.05;
        } else {
            speed = 0.5;
        }
        if (id == players[i].id) {
            return players[i]
        }
    }
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendfile('/home/zhouss/blog/views/index.html');
});


server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
