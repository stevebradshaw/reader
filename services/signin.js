var //md5 = require('md5'),
    bcrypt = require('bcrypt'),
    mysql = require('mysql'),
    async = require('async'),
    redis = require("redis"),
    client = redis.createClient(),
    uuid = require('node-uuid') ;

var req, res ;
var t ;

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'reader_dev',
    password : 'dev',
    database : 'reader'
});

connection.connect() ;

function get(params) {

} 

//function delete() {
//}

function post(params) {

  var q = "select id, email, password, admin from users where email = ? and active = 'Y'";

  connection.query(q, params.username, function(err,data) {

    if (!err) {

      if (data.length == 0) {
        res.status(404) ;
        res.end() ;
      } else {


        bcrypt.compare(params.password, data[0].password, function(err, isMatch) {
	        if(err) {
			  return console.error(err);
			}

            if (isMatch) {
				res.cookie("loggedin", "yes", { maxAge: 3600*1000, path: "/"});
                res.cookie("user_id", data[0].id, { maxAge: 3600*1000, path: "/"});
                res.cookie("email", data[0].email, { maxAge: 3600*1000, path: "/"});

                var sessionid = "SESSION:" + uuid.v1() ;

                res.cookie("sessionid", sessionid, { maxAge: 3600*1000, path: "/"});
                var sess = { email: data[0].email, id: data[0].id } ;
  
                client.set(sessionid, JSON.stringify(sess), redis.print);

                client.expire(sessionid, 24*60*60);
                res.status(200) ;


		    } else {
              res.status(401) ;
			}
            res.end() ;
        });
      } 
    } else { 
      res.status(500) ;
      res.end() ;
    }
  }) ;
}

module.exports.initRouting = function(router) {

  router.route('/signin')
/*      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
		  get({user_id: 1, key: req.query.key})  ;
	  })*/

      .post(function(rq,rs) {
          res = rs ;
          req = rq ;

          post({username: req.body.username, password: req.body.password, rememberuser: req.body.rememberuser}) ;
      })

      .delete(function(rq,rs) {
          res = rs ;
          req = rq ;
//        delete() ;
      }) ;
	  
} ;
