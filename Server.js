var express = require('express');
var path = require('path');
var bodypareser = require('body-parser')
var fs = require('fs');
var routes = require('./lib/routes');
const phantom = require('phantom');


var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./invoice.html', 'utf8');
var options = { format: 'Letter',"orientation": "portrait", };
 
pdf.create(html, options).toFile('./pdf/Invoivce1.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res); // { filename: '/app/businesscard.pdf' }
});

var app = express();

app.use(bodypareser.urlencoded({limit:'5mb',extended:true}));
app.use(bodypareser.json({limit:'5mb'}));
	
app.use(express.static(path.join(__dirname,'www')));

routes.configure(app);
/* 	
	phantom.create().then(function(ph) {
    ph.createPage().then(function(page) {
        page.open("./invoice.html").then(function(status) {
            page.render('./pdf/invoice.pdf').then(function() {
                console.log('Page Rendered');
                ph.exit();
            });
        });
    });
}); */
	

var server = app.listen(parseInt(process.env.SERVING_PORT),function(){
	console.log('server start on '+ server.address().port+ ' port');
})	



