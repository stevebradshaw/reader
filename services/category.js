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


//  var q = " select c.category, c.id, count(1) number from categories c join feed_categories fc on fc.category_id = c.id group by c.category, c.id union select category, id, 0 from categories c where not exists (select 1 from feed_categories fc where fc.category_id = c.id) order by category"

  var q = 'select c.category, c.id, count(1) number from categories c'
        + ' join feed_categories fc on fc.category_id = c.id '
        + 'where not exists (select 1 from user_feeds uf where uf.feed_id = fc.feed_id and uf.user_id = ?) '
        + ' group by c.category, c.id '
//        + 'union '
//        + 'select category, id, 0 from categories c where not exists (select 1 from feed_categories fc where fc.category_id = c.id)
        + 'order by category' ;
  async.waterfall([
    function(next) {
  	connection.query(q,params.userid, next) ;
  },
  function(results, next) {
console.log(results) ;
	  res.send(results) ;
res.end() ;
  }
], function (err,res) {

}) ;
	 
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

  router.route('/category')
      .get(function(rq,rs) {
console.log(rq) ;
		  req = rq ;
		  res = rs ;
		  get({userid: req.cookies.userid})  ;
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
