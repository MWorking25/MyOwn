var express = require('express');
var path = require('path');
var bodypareser = require('body-parser')
var fs = require('fs');
var routes = require('./lib/routes');

var app = express();

app.use(bodypareser.urlencoded({limit:'5mb',extended:true}));
app.use(bodypareser.json({limit:'5mb'}));
	
app.use(express.static(path.join(__dirname,'www')));

routes.configure(app);
	
var server = app.listen(parseInt(process.env.SERVING_PORT),function(){
	console.log('server start on '+ server.address().port+ ' port');
})	



