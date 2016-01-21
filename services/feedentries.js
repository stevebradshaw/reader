var mysql = require('mysql'),
    async = require('async') ;

var req, res ;
var t ;

function get(params) {

  var data = [] ;
	
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'reader_dev',
    password : 'dev',
    database : 'reader'
  });

  connection.connect() ;

  var status_predicate = '' ;

  if (params.status == "U") {
	 var status_predicate = " and (reader.ues.status = 'U') " ;
  } else if(params.status == "R")  {
	  status_predicate = " and (reader.ues.status = 'R') " ;
  }

  var q = "select reader.fe.id as id, "
        + "reader.fe.entry_key as entry_key, "
        + "reader.fe.entry_title as entry_title, "
        + "reader.fe.entry_html as entry_html, "
        + "reader.fe.entry_author as entry_author, "
        + "reader.fe.entry_uri as entry_uri, "
        + "reader.fe.publication_date_utc as publication_date, "
        + "'UTC' as publication_tz, "
        + "reader.uf.feed_title as feed_title, "
        + "if(reader.ues.status='U', 'unread', 'read') as status "
	    + "from reader.user_entry_status ues "
        + "join reader.user_feeds uf on reader.uf.user_id = reader.ues.user_id and reader.uf.feed_id = reader.ues.feed_id "
        + "join reader.feed_entries fe "
        + "on ((reader.fe.url_id = ?) "
        + "and (reader.ues.user_id = ?) " //. $status_predicate . 
        + "and (reader.ues.feed_id = ?) "
        + status_predicate
        + "and (reader.fe.entry_key = reader.ues.entry_key)) "
        + "order by reader.fe.publication_date_utc desc limit 50" ; //?,?" ;

  async.waterfall([
    function(next) {
      q = connection.query(q,[ params.feed, params.user_id, params.feed ],next) ;
    },
    function(results, next) {
	  res.send(results) ;
    }
   ], function (err,res) {

   }
  ) ;
} 

module.exports.initRouting = function(router) {

  router.route('/feedentries')
      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
		  get({user_id: req.cookies.user_id, feed: req.query.feed, status: req.query.status}) ;
	  }) ;
	  
} ;
