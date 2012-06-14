var zombie = require("zombie");
var browser = new zombie.Browser;

/* Dammit.1 Can't create element 'iframe' (TypeError: Property '__defineGetter__' of object #<error> is not a function) Using a div for now. FIXME! */
/* Dammit.2 TypeError: Cannot call method 'dispatchEvent' of undefined */
/* Ref https://gist.github.com/764536 */
browser.visit("http://localhost:8080/index2.html", function (err) {
	browser.attach("upload", __filename)
	browser.pressButton("Upload", function(err){
		console.log(browser.html());
	});
});