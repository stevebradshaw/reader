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

  var qparams = [] ;
  var q = "select * from feeds f"
        + " where not exists (select 1 from user_feeds uf where uf.user_id = ? and uf.feed_id = f.id)" ;

  qparams.push(params.user_id) ;

  if (typeof req.query.q != 'undefined') {
    q = q + " and title like ?" 
    var str = '%' + params.q + '%' ;
    qparams.push(str) ;
  }
   
  if (typeof req.query.category_id != 'undefined') {
    q = q + " and exists (select 1 from feed_categories fc where fc.feed_id = f.id and fc.category_id = ?)" ;
    qparams.push(params.category_id) ;
  }

  console.log(qparams) ;
  async.waterfall([
    function(next) {
  	  connection.query(q,qparams, next) ;
    },
    function(results, next) {
	  res.send(results) ;
      res.end() ;
    }
  ], function (err,res) {
     console.log(err) ;
  }) ;
}

module.exports.initRouting = function(router) {

  router.route('/suggestfeeds')

      .get(function(rq,rs) {
        req = rq ;
        res = rs ;

        get({ user_id: req.cookies.user_id, q: req.query.q, category_id: req.query.category_id}) ;
      })  ;
	  
} ;
