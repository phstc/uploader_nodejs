It's my solution to the Code Challenge [File Upload with Progress](https://github.com/phstc/uploader_nodejs/blob/master/BackendDeveloperChallengeUpdated.pdf).

I decided to split this project into small projects, the [Uploader in Node.js](https://github.com/phstc/uploader_nodejs) and the [Uplader client in Rails](https://github.com/phstc/uploader_rails). It's a kind of System of Systems, Node.js fits better for the upload (event-driven, non-blocking I/O) and Rails fits better for the client (gems, community, maturity etc).

[![Build Status](https://secure.travis-ci.org/phstc/uploader_nodejs.png)](http://travis-ci.org/phstc/uploader_nodejs)

##Upload progress

When a client sends an upload request, it needs to send a socketid parameter.

    /upload?socketid=...&security_hash=..&timestamp=..

This socketid parameter is the ID generated from the [socket.io](http://socket.io/).

    var socket = io.connect(...);
    
    socket.on('connect', function () {
    var formAction = "/upload?socketid=" + socket.socket.sessionid;
    $("#form_upload").attr('action', formAction);

See a full example at [github.com/phstc/uploader_nodejs/blob/master/public/index.html](https://github.com/phstc/uploader_nodejs/blob/master/public/index.html).

###Status

The Uploader will update the status to client in three channels: ```upload_percentage```, ```uploaded_file``` and ```upload_error```.

    'uploaded_file', {path: file.path, name: file.name}
    
    'upload_percentage', percentage
    
    'upload_error', 'invalid credential'

##Credential

To validate if the upload request is from a valid client, the upload request must pass a ```security_hash``` and ```timestamp```.

The ```security_hash``` is ```md5(SECRET_KEY + timestamp)```.

##Running it

    $ make server

###Test suite

    $ make test

