var bcrypt = require('bcrypt') ;

var password = "passX"
  , hash = "$2a$10$4JLLtd4l6.at5sf64SI8XOKNeu.leYmLtBlvhXCswgyYprS0hpmeS"

bcrypt.compare(password, hash, function(err, isMatch) {
	if(err) {
	return console.error(err);
	}

	console.log('do they match?', isMatch);
});
