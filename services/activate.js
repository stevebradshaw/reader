var mysql = require('mysql'),
    async = require('async')
    ;

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

  if (params.p) {
    var q = "update users set active = 'Y', date_activated = now() where activation_code = ? and active = 'N'" ;
    connection.query(q, params.p, function(err,data) {

        if (!err) {
          if (data.affectedRows== 0) {
            res.status(404) ;
            res.end() ;
          } else {
            res.send('Activate account!') ;
            res.status(200) ;
            res.end() ;
          }
        } else {
          res.status(500) ;
          res.end() ;
        }
      }) ;

    } else {
      res.status(500) ;
      res.end() ;
    }
} 

module.exports.initRouting = function(router) {

  router.route('/activate')
      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
		  get(req.query)  ;
	  })

} ;
