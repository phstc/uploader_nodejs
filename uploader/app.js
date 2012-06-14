var formidable = require('formidable')
   , http = require('http')
   , util = require('util')
   , fs = require('fs');

http.createServer(function(req, res) {
	var form = new formidable.IncomingForm();
	
	form.uploadDir = __dirname + '/uploaded_files/';
	
	form.parse(req, function(err, fields, files) {
		res.writeHead(200, {'Content-type': 'text/plain'});
		res.end('received upload');
	 });
	
	form.on('file', function(field, file) {
	    fs.rename(file.path, form.uploadDir + '/' + file.name);
	})
	
	form.addListener('progress' , function(bytesReceived, bytesExpected){
		var percentage = parseInt((bytesReceived * 100) / bytesExpected, 10);
		console.log(percentage);
	});	
}).listen(8181);
