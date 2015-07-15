var mysql = require('mysql'),
    async = require('async') ;

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
console.log('start a session...') ;
      res.status(200) ;
res.end() ;
    } 
  } else { 
console.log('error') ;
console.log(err) ;
  }
                                  }) ;
}

module.exports.initRouting = function(router) {

  router.route('/login')
      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
		  get({userid: 1, key: req.query.key})  ;
	  })

      .post(function(rq,rs) {
          res = rs ;
          req = rq ;
console.log(req.body) ;
          post({username: req.body.username, password: req.body.password}) ;
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
