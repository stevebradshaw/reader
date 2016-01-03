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
	
  var q = 'select c.category, c.id, count(1) number from categories c'
        + ' join feed_categories fc on fc.category_id = c.id '
        + 'where not exists (select 1 from user_feeds uf where uf.feed_id = fc.feed_id and uf.user_id = ?) '
        + ' group by c.category, c.id '
//        + 'union '
//        + 'select category, id, 0 from categories c where not exists (select 1 from feed_categories fc where fc.category_id = c.id)
        + 'order by category' ;
  async.waterfall([
    function(next) {
  	connection.query(q,params.user_id, next) ;
  },
  function(results, next) {
	  res.send(results) ;
      res.end() ;
  }
], function (err,res) {

}) ;
	 
} 

function put(rq,rs) {
req = rq ;
res = rs ;
}

module.exports.initRouting = function(router) {

  router.route('/category')
      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
		  get({user_id: req.cookies.user_id})  ;
	  })

      .put(function(rq,rs) {
          put(rq,rs) ;
      })  ;
	  
} ;
