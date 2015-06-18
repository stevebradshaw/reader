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

connection.connect() ;

async.waterfall([
  function(next) {
	connection.query(q,params.key, next) ;
  },
  function(results, next) {
	  console.log(results) ;
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
          put(
	}) ;*/
  }
], function (err,res) {

}) ;
	 
} 

function put(params) {
}

module.exports.initRouting = function(router) {

  router.route('/entry')
      .get(function(rq,rs) {
console.log('get entry') ;
		  req = rq ;
		  res = rs ;
		  get({userid: 1, key: req.query.key})  ;
//		  get({userid: 1, res: res}) ;
	  })

      .put(function(rq,rs) {
console.log('put entyr');
		  req = rq ;
		  res = rs ;
		  put({userid: 1, key: req.query.key, status: req.query.status})  ;
      })  ;
	  
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
