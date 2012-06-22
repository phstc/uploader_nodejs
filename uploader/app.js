var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app)
	, formidable = require('formidable')
	, fs = require('fs')
	, url = require('url')
	, static = require('node-static')
	, uploadCredential = require('./lib/upload_credential');
	
var PORT = (process.argv[2] == 'production') ? 80 : 8080;

app.listen(PORT);

var fileServer = new(static.Server)('./public');

function handler (req, res) {
	req.query = url.parse(req.url, true).query;
	if (isUploadRequest(req)) {
		createUploadHandler(isValidCredential, authorizedUpload, unauthorizedUpload)(req, res);
		return;
	}
	fileServer.serve(req, res);
}

function createSendSocketMessage(socketid){
	return function(room, message){
		sendSocketMessage(socketid, room, message);
	}
}

function sendSocketMessage(socketid, room, message){
	io.sockets.socket(socketid).emit(room, message);
}

function isValidCredential(req){
	return uploadCredential.isValid(req.query.security_hash, req.query.timestamp);
}

function isUploadRequest(req){
	return req.url.match(/^\/upload\?socketid=.+&security_hash=.+&timestamp=.+/) 
		&& req.method.toLowerCase() == 'post';
}

function createUploadHandler(credentialValidator, funcAuthorized, funcUnauthorized){
	return function(req, res){
		if(credentialValidator(req)){
			funcAuthorized(req, res);
		} else {
			funcUnauthorized(req, res);
		}
	}
}

function unauthorizedUpload(req, res){
	createSendSocketMessage(req.query.socketid)('upload_error', 'invalid credential');
	res.writeHead(401, {'Content-type': 'text/plain'});
	res.end('invalid credential');
}

function authorizedUpload(req, res){
	var form = new formidable.IncomingForm();

	form.uploadDir = __dirname + '/public/uploaded_files';

	form.parse(req, function(err, fields, files) {
		res.writeHead(200, {'Content-type': 'text/plain'});
		res.end('upload received');
	});
	
	var currentSendSocketMessage = createSendSocketMessage(req.query.socketid);
	
	form.on('file', function(field, file) {
		fs.rename(file.path, form.uploadDir + '/' + file.name);
		currentSendSocketMessage('uploaded_file', {path: '/uploaded_files/' + file.name, name: file.name});
	});
	
	form.addListener('progress' , function(bytesReceived, bytesExpected){
		var percentage = parseInt((bytesReceived * 100) / bytesExpected, 10);
		currentSendSocketMessage('upload_percentage', percentage);
	});
}
