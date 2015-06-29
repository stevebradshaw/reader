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
	
/*  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'reader_dev',
    password : 'dev',
    database : 'reader'
  });

  connection.connect() ;*/


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

function updateEntry(params) {

/*  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'reader_dev',
    password : 'dev',
    database : 'reader'
  });

  connection.connect() ;*/

    q = connection.query("UPDATE user_entry_status SET status = ? where entry_key = ? and user_id = ?", [ "R", params.key, 1 ], function(err,result) {
//	  console.log(err) ;
//	  console.log(result) ;
res.end() ;
    });  

//  console.log(q.sql);
}

function updateFeed(params) {
    q = connection.query("UPDATE user_entry_status SET status = ? where feed_id = ? and user_id = ?", [ "R", params.feedid, 1 ], function(err,result) {
//	  console.log(err) ;
//	  console.log(result) ;
res.end() ;
    });  

//  console.log(q.sql);

}

function put(rq,rs) {
req = rq ;
res = rs ;

if (typeof req.query.feedid !== 'undefined') {
//  console.log('key set') ;
  updateFeed({userid: 1, feedid: req.query.feedid, status: req.query.status})  ;
} else if (typeof req.query.key !== 'undefined') {
//  console.log('key not set') ;
  updateEntry({userid: 1, key: req.query.key, status: req.query.status})  ;
} else {
res.status(400) ;
res.end() ;
}
}

module.exports.initRouting = function(router) {

  router.route('/entry')
      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
		  get({userid: 1, key: req.query.key})  ;
	  })

      .put(function(rq,rs) {
          put(rq,rs) ;
      })  ;
	  
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
