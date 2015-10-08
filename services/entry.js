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

function updateEntry(params) {

    q = connection.query("UPDATE user_entry_status SET status = ? where entry_key = ? and user_id = ?", [ "R", params.key, 1 ], function(err,result) {
res.end() ;
    });  

}

function updateFeed(params) {
    q = connection.query("UPDATE user_entry_status SET status = ? where feed_id = ? and user_id = ?", [ "R", params.feedid, 1 ], function(err,result) {
res.end() ;
    });  

}

function put(params) {

if (typeof req.query.feedid !== 'undefined') {
//  console.log('key set') ;
  updateFeed({ user_id: params.user_id, feedid: req.query.feedid, status: req.query.status})  ;
} else if (typeof req.query.key !== 'undefined') {
//  console.log('key not set') ;
  updateEntry({ user_id: params.user_id, key: req.query.key, status: req.query.status})  ;
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
		  get({user_id: req.cookie.user_id, key: req.query.key})  ;
	  })

      .put(function(rq,rs) {
		  req = rq ;
		  res = rs ;
          put({ user_id: req.cookie.user_id }) ;
      })  ;
	  
} ;
