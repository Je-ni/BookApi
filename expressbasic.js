/**USING EXPRESS*/
var express = require('express');

var app = express();
var port = 3000;

var server = app.listen(port, function(){
    var serverAddress = server.address();
    console.log(`I just created a new server on ${serverAddress.address}:${serverAddress.port}`);
});

app.get('/', function(request, response){
    response.send('My first web application');
})
//add, remove, browse, update: book api in other words: a library

