var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app)
	, formidable = require('formidable')
	, fs = require('fs')
	, url = require('url');

var port = (process.argv[2] == 'production') ? 80 : 8080;

app.listen(port);

function handler (req, res) {
	if (req.url.match(/^\/upload.+/) && req.method.toLowerCase() == 'post') {
		upload(req, res);
		return;
	}
	index(req, res);
}

function sendSocketMessage(socketid, room, message){
	if(socketid){
		io.sockets.socket(socketid).emit(room, message);
	}
}

function upload(req, res){
	var form = new formidable.IncomingForm();

	form.uploadDir = __dirname + '/uploaded_files';

	form.parse(req, function(err, fields, files) {
		res.writeHead(200, {'Content-type': 'text/plain'});
		res.end('upload received');
	});

	form.on('file', function(field, file) {
		fs.rename(file.path, form.uploadDir + '/' + file.name);
		sendSocketMessage(url_parts.query.socketid, 'uploaded_file', '/uploaded_files/' + '/' + file.name);
	});

	var url_parts = url.parse(req.url, true);

	form.addListener('progress' , function(bytesReceived, bytesExpected){
		var percentage = parseInt((bytesReceived * 100) / bytesExpected, 10);
		sendSocketMessage(url_parts.query.socketid, 'percentage', percentage);
	});
}

function index(req, res){
	fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
		res.end(text);
	});
}

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {});
