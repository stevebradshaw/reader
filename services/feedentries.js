var mysql = require('mysql'),
    async = require('async') ;

var req, res ;
var t ;


function get(params) {

//	console.log(params) ;

	var data = [] ;
	
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'reader_dev',
  password : 'dev',
  database : 'reader'
});


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

connection.connect() ;

async.waterfall([
  function(next) {
q = connection.query(q,[ params.feed, params.userid, params.feed ],next) ;
//console.log(q) ;
  },
  function(results, next) {
	  res.send(results) ;

/*	async.forEachSeries(results, function(item, next) {
        var t = next ;
		async.waterfall([
		  function(next) {
            connection.query(q2,[params.userid, item.id],next) ;
		  },
		  function(results,next) {
			var d = item ;
			d.feeds = JSON.stringify(results) ;
			data.push(d) ;
            t() ;
		  }]) ;

	},
	function() {
	  connection.end() ;
      //params.res.send(data) ;
      res.send(data) ;
//	  console.log(data) ;
	}) ;*/
  }
], function (err,res) {

}) ;
	 
} 

module.exports.initRouting = function(router) {

  router.route('/feedentries')
      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
		  get({userid: 1, feed: req.query.feed, status: req.query.status}) ;
//		  get({userid: 1, res: res}) ;
	  }) ;
	  
/*	  .post(function(req,res) {
          var burp = new BurpModel() ;
          burp.message = req.body.msg;
console.log(req.body.msg) ;
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


