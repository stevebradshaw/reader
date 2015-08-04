var md5 = require('md5'),
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
  var data = [] ;
	
  var q = "select url_id,"
        + "entry_key,"
        + "entry_xml,"
        + "entry_html,"
        + "date_extracted,"
        + "entry_title,"
        + "publication_date,"
        + "publication_tz,"
        + "publication_date_utc,"
        + "entry_uri,"
        + "entry_author"
	    + " from feed_entries"
	    + " where entry_key = ?" ;


  async.waterfall([
    function(next) {
  	connection.query(q,params.key, next) ;
  },
  function(results, next) {
	  res.send(results) ;
  }
], function (err,res) {

}) ;
	 
} 

//function delete() {
//}

function post(params) {
  var q = "select id, email, password_salt, password_md5, admin from users where email = ? and active = 'Y'";

  connection.query(q, params.username, function(err,data) {

  if (!err) {
console.log('found') ;
console.log(data) ;
    if (data.length == 0) {
      res.status(404) ;
res.end() ;
    } else {
console.log('md5(' + data[0].password_salt + params.password + ')') ;
console.log(md5(data[0].password_salt + params.password)) ;
      if ( md5(data[0].password_salt + params.password) == data[0].password_md5 ) {

console.log('start a session...') ;
res.cookie('loggedin', 'yes', { maxAge: 900000 });

res.cookie("loggedin", "yes", { maxAge: 3600*1000, path: "/"});
//res.cookie("user", "yes", { maxAge: 3600*1000, path: "/");
res.cookie("userid", data[0].id, { maxAge: 3600*1000, path: "/"});
res.cookie("email", data[0].email, { maxAge: 3600*1000, path: "/"});

/*console.log('POST: rememberuser = ' + params.rememberuser) ;
if (params.rememberuser == "on") {
  res.cookie("rememberuser", "on", { maxAge: 60*60*24*365*1000, path: "/"}) ;
  res.cookie("rememberemail", params.username, { maxAge: 60*60*24*365*1000, path: "/"}) ;
} else {
res.clearCookie("rememberuser") ;
res.clearCookie("rememberemail") ;
}*/
var sessionid = uuid.v1() ;

res.cookie("sessionid", "SESSION:" + sessionid, { maxAge: 3600*1000, path: "/"});
var sess = { email: data[0].email, id: data[0].id } ;

client.set("SESSION:" + sessionid, JSON.stringify(sess), redis.print);
client.expire("SESSION:" + sessionid, 24*60*60);
      res.status(200) ;
      } else {
console.log("password doesn't match") ;
res.status(401) ;
      }
res.end() ;
    } 
  } else { 
console.log('error') ;
console.log(err) ;
  }
                                  }) ;
}

module.exports.initRouting = function(router) {

  router.route('/signup')
      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
		  get({userid: 1, key: req.query.key})  ;
	  })

      .post(function(rq,rs) {
          res = rs ;
          req = rq ;
console.log('********************') ;
console.log(req.body) ;
console.log('********************') ;
//          post({username: req.body.username, password: req.body.password, rememberuser: req.body.rememberuser}) ;
      })

      .delete(function(rq,rs) {
          res = rs ;
          req = rq ;
//        delete() ;
      }) ;
	  
/*	  .post(function(req,res) {
          var burp = new BurpModel() ;
          burp.message = req.body.msg;
//console.log(req.body.msg) ;
          burp.burper_id = req.session.id ;

          burp.save(function (err, burp) {
            if (err) {
              res.status(500) ;
              res.send(err) ;
              res.end() ;
            } else {
              res.status(201) ;
              res.setHeader('Location', req.headers.host + req.originalUrl + '/' + burp.id) ;
              res.end() ;
            }
          });
	  })

	  .patch(function(req,res) {

	  })

	  .delete(function(req,res) {

	  }) ;*/
} ;
