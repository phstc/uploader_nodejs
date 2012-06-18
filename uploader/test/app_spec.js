var http = require('http'),
	request = require('superagent');
require('should')
require('../app')

describe('http requests', function(){
	describe('POST /upload', function(){
		it('should deny the upload', function(done){
			request
				.post('http://localhost:8080/upload?socketid=1&security_hash=1&timestamp=1')
				.end(function(res){
					res.should.have.status(401);
					done();
				});
		});
		
		it('should allow the upload', function(done){
			var req = request
				.post('http://localhost:8080/upload?socketid=1&security_hash=283b461226e842f7ab68fdffd524b966&timestamp=1339987734');
				req.part()
				   .set('Content-Type', 'text/plain')
				   .set('Content-Disposition', 'attachment; filename="hello.txt"')
				   .write('hello world');
				req.end(function(res){
					res.should.have.status(200);
					done();
				});
		});
	});
	describe('Static content', function(){
		describe('GET /hello.txt', function(){
			it('should return the contents of hello.txt', function(done){
				request
					.get('http://localhost:8080/hello.txt')
					.end(function(res){
					  res.text.should.equal('hello');
						done();
					});
			});
		});
	});
});
