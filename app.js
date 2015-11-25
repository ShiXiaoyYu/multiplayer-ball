/**
 * Created by zhouss on 15-11-19.
 */
var express = require('express');
var app = express();
var path = require('path');
app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);

var players = [];
//var speed = 0.05;
var speedXv = 0.5;
var speedYv = 1.5;
var small = false;//要写在外面
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {


    console.log('565666666666666666666666666666');
if(players.length>=2){

    socket.emit('wait');
    return;
}

    players.push({
        'id': socket.id,
        'x': parseInt(100*(Math.floor(Math.random()*10+1))),
        'y': parseInt(50*(Math.floor(Math.random()*10+1)))

    });


    var timerDown;
    io.sockets.emit('move', players);

    socket.on('move', function (data) {

           console.log(data);
        console.log(players);

        if (data.direction == 'up') {



            function judgement(id){
                for(var i = 0; i<players.length;i++){
                    if(i<1&&id == players[i].id){

                        console.log('samll'+i);


                        getPlayerById(data.socketId).y -= speedXv;
                        if(getPlayerById(data.socketId).y <=10){
                            io.sockets.emit('failure',data.socketId);
                            return;
                        }

                    }else if(i>0&&id == players[i].id){
                        console.log('897665133');
                        var timerUp = setTimeout(function(){
                                return (function (){
                                    if(getPlayerById(data.socketId).y <=10){
                                        clearTimeout(timerUp);
                                        io.sockets.emit('failure',data.socketId);
                                        clearTimeout(timerUp);
                                        return;
                                    }
                                    getPlayerById(data.socketId).y -= speedYv;
                                    clearTimeout(timerUp);
                                })()
                            },1000
                        );
                    }
                }

            }

            judgement(data.socketId);



        } else if (data.direction == 'down') {


            function judgements(id){
                for(var i = 0; i<players.length;i++){
                    if(i<1&&id == players[i].id){

                        if(getPlayerById(data.socketId).y >=990){
                            io.sockets.emit('failure',data.socketId);
                            return;
                        }
                        getPlayerById(data.socketId).y += speedXv;

                    }else if(i>0&&id == players[i].id){
                        var timerDown = setTimeout(function(){
                                return (function (){
                                    if(getPlayerById(data.socketId).y >=990){
                                        clearTimeout(timerDown);
                                        io.sockets.emit('failure',data.socketId);
                                        clearTimeout(timerDown);
                                        return;
                                    }
                                    getPlayerById(data.socketId).y += speedYv;
                                    clearTimeout(timerDown);
                                })()
                            },1000
                        );
                    }
                }

            }

            judgements(data.socketId);

        } else if (data.direction == 'left') {


            function judgementss(id){
                for(var i = 0; i<players.length;i++){
                    if(i<1&&id == players[i].id){

                        if(getPlayerById(data.socketId).x <=10){
                            io.sockets.emit('failure',data.socketId);
                            return;
                        }

                        getPlayerById(data.socketId).x -= speedXv;


                    }else if(i>0&&id == players[i].id){
                        var timerLeft = setTimeout(function(){
                                return (function (){
                                    if(getPlayerById(data.socketId).x <=10){
                                        clearTimeout(timerLeft);
                                        io.sockets.emit('failure',data.socketId);
                                        return;
                                    }
                                    getPlayerById(data.socketId).x -= speedYv;
                                    small = false;
                                    clearTimeout(timerLeft);
                                })()
                            },1000
                        );
                    }
                }

            }
            judgementss(data.socketId);



        } else if (data.direction == 'right') {


            function judgementD(id){
                for(var i = 0; i<players.length;i++){
                    if(i<1&&id == players[i].id){
                        if(getPlayerById(data.socketId).x >=1490){
                            io.sockets.emit('failure',data.socketId);
                            return;
                        }
                        getPlayerById(data.socketId).x += speedXv;

                    }else if(i>0&&id == players[i].id){
                        console.log('max'+i);

                        var timerRight = setTimeout(function(){
                                return (function (){
                                    if(getPlayerById(data.socketId).x >=1490){
                                        io.sockets.emit('failure',data.socketId);
                                        clearTimeout(timerRight);
                                        return;
                                    }
                                    getPlayerById(data.socketId).x += speedYv;
                                    clearTimeout(timerRight);
                                })()
                            },1000)
                    }
                    }
                }
            judgementD(data.socketId);

            }

        io.sockets.emit('move', players);
        io.sockets.emit('disconnect');
    });

 console.log(socket.id);

    socket.on('disconnect',function(){

        players.splice(0,2);
        io.sockets.emit('offline','off');

    });


});






function getSmall(id) {
    for (var i = 0; i < players.length; i++) {
        if (i < 1) {
           // speed = 0.05;
            speed = 0.5;
            small = true;
        } else {
            speed = 1.5;
            small = false;
        }

    }
}
/**/
function getPlayerById(id) {
    for (var i = 0; i < players.length; i++) {
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
