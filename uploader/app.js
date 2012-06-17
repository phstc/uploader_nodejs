var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app)
	, formidable = require('formidable')
	, fs = require('fs')
	, url = require('url')
	, static = require('node-static');
	

var port = (process.argv[2] == 'production') ? 80 : 8080;

app.listen(port);

var fileServer = new(static.Server)('./public');

function handler (req, res) {
	if (req.url.match(/^\/upload\?socketid=.+/) && req.method.toLowerCase() == 'post') {
		upload(req, res);
		return;
	}
	fileServer.serve(req, res);
}

function createSendSocketMessage(socketid){
	return function(room, message){
		sendSocketMessage(socketid, room, message);
	};
}

function sendSocketMessage(socketid, room, message){
	io.sockets.socket(socketid).emit(room, message);
}

function upload(req, res){
	var form = new formidable.IncomingForm();

	form.uploadDir = __dirname + '/public/uploaded_files';

	form.parse(req, function(err, fields, files) {
		res.writeHead(200, {'Content-type': 'text/plain'});
		res.end('upload received');
	});
	
	var url_parts = url.parse(req.url, true);

	var currentSendSocketMessage = createSendSocketMessage(url_parts.query.socketid);
	
	form.on('file', function(field, file) {
		fs.rename(file.path, form.uploadDir + '/' + file.name);
		currentSendSocketMessage('uploaded_file', {path: '/uploaded_files/' + file.name, name: file.name});
	});
	
	form.addListener('progress' , function(bytesReceived, bytesExpected){
		var percentage = parseInt((bytesReceived * 100) / bytesExpected, 10);
		currentSendSocketMessage('upload_percentage', percentage);
	});
}
