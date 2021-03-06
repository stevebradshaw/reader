var mysql = require('mysql'),
    $ = require('jquery'),
    async = require('async') ;

var req, res ;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'reader_dev',
  password : 'dev',
  database : 'reader'
});

connection.connect() ;

function get(params) {

  var data = [] ;

  var q = "select folder_name from user_folders where user_id = ? union select 'Uncategorised' folder_name  order by if(folder_name='Uncategorised', 'ZZZZZZZZZZ', folder_name)" ;

  async.waterfall([
    function(next) {
      connection.query(q, [ params.user_id ], next) ;
    },
    function(results, next) {

      var array = [] ;

      for (x in results) {
        array.push(results[x].folder_name) ;
      }

      res.send(array) ;
      res.status(200) ;
      res.end() ;
    }
  ], function (err,res) {
     console.log(err) ;
     res.status(500) ;
     res.send(err) ;
     res.end() ;
  }) ;

	 
} ;

module.exports.initRouting = function(router) {

  router.route('/userfolders')
      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
		  get({user_id: req.cookies.user_id})  ;
	  })
	  
}
