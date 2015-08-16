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
//console.log(params) ;
//  var q = "select * from feeds f where id in (select feed_id from feed_categories where category_id in (" + params.ids.join() + "))"
  var q = "select * from feeds f where id in (select feed_id from feed_categories where category_id = ?)"
        + " and not exists (select 1 from user_feeds uf where uf.user_id = ? and uf.feed_id = f.id)" ;
   
  console.log(q) ;
console.log(req.cookies.userid) ;
  async.waterfall([
    function(next) {
  	connection.query(q,[params.category_id, params.userid], next) ;
  },
  function(results, next) {
//console.log(results) ;
	  res.send(results) ;
res.end() ;
  }
], function (err,res) {

}) ;
}

function post(params) {
  var data = [] ;
/*	
  var q = "select c.category, c.id, count(1) number from categories c join feed_categories fc on fc.category_id = c.id group by c.category, c.id union select category, id, 0 from categories c where not exists (select 1 from feed_categories fc where fc.category_id = c.id) order by category"

  async.waterfall([
    function(next) {
  	connection.query(q,[], next) ;
  },
  function(results, next) {
console.log(results) ;
	  res.send(results) ;
res.end() ;
  }
], function (err,res) {

}) ;
*/	 
} 

function put(rq,rs) {
req = rq ;
res = rs ;

/*if (typeof req.query.feedid !== 'undefined') {
//  console.log('key set') ;
  updateFeed({userid: 1, feedid: req.query.feedid, status: req.query.status})  ;
} else if (typeof req.query.key !== 'undefined') {
//  console.log('key not set') ;
  updateEntry({userid: 1, key: req.query.key, status: req.query.status})  ;
} else {
res.status(400) ;
res.end() ;
}*/
}

module.exports.initRouting = function(router) {

  router.route('/suggestfeeds')
      .post(function(rq,rs) {
console.log(rq) ;
		  req = rq ;
		  res = rs ;
		  post()  ;
	  })

      .get(function(rq,rs) {
        req = rq ;
        res = rs ;
        get({ userid: req.cookies.userid, category_id: req.query.category_id }) ;//ids: rq.body.jObject }) ; 
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
