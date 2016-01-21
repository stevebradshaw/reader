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

  var q = "select uf.feed_id, uf.feed_title, ifnull(f.folder_name,'Uncategorised') folder_name, ifnull(f.id,0) folder_id "
        + "from user_folders f right join user_feeds uf on f.id = uf.folder_id "
        + "where uf.user_id = ? order by feed_title" ;

  async.waterfall([
    function(next) {
  	  connection.query(q, [ params.user_id ], next) ;
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

  router.route('/feedlist')

      .get(function(rq,rs) {
        req = rq ;
        res = rs ;

        get({ user_id: req.cookies.user_id }) ;
      })  ;
	  
} ;
