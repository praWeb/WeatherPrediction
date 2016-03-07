var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('.'));

app.get('/', function(request, response){
	response.sendFile(path.__currentDir + '/index.html');
});

app.listen(8000, function(){
	console.log("Node.js server started on port 8000...");
});
