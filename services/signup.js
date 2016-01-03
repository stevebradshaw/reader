var md5 = require('md5'),
    mysql = require('mysql'),
    async = require('async'),
    redis = require("redis"),
    client = redis.createClient(),
    uuid = require('node-uuid'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10 ;

var req, res ;
var t ;

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'reader_dev',
    password : 'dev',
    database : 'reader'
});

connection.connect() ;

function post(params) {

  var q = "insert into users (username, email, password_salt, password, date_created, activation_code, active) values (?, ?, ?, ?, now(), ?, 'N')" 
    , activation_code = uuid.v1()
//    , password_salt = "XYZ" //TODO: get a better SALT!
    , password_encr = params.password
    ;

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (!err) {

          // hash the password using our new salt
          bcrypt.hash(params.password, salt, function(err, hash) {
              if (!err) {


                 connection.query(q
                                , [ params.email,           //username
                                    params.email,           //email
					                salt,                   //password_salt
					                hash,                   //password
					                activation_code ]
					            , function(err,data) {

	if (!err) {
      // TODO:  something!
	} else {
      // TODO:  Handle error
	}
          }) ;
          // override the cleartext password with the hashed one
          password_encr = hash;
        }
        });
    }
  });
}

module.exports.initRouting = function(router) {

  router.route('/signup')

      .post(function(rq,rs) {
          res = rs ;
          req = rq ;
          res.end() ;
          post({name: req.body.name, password: req.body.password, email: req.body.username}) ;
      })

} ;
