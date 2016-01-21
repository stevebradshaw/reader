var mysql = require('mysql'),
    async = require('async') ;

var req, res ;

function get(params) {

  var data = [] ;

  var connection = mysql.createConnection({ host     : 'localhost',
                                            user     : 'reader_dev',
                                            password : 'dev',
                                            database : 'reader'
                                          });

  var q1 = "select id, folder_name from user_folders where user_id = ? union select 0 id,'Uncategorised' folder_name  order by if(folder_name='Uncategorised', 'ZZZZZZZZZZ', folder_name)", 
      q2 = "select f.id, uf.feed_title from feeds f, user_feeds uf where uf.user_id = ? and f.id = uf.feed_id and uf.folder_id = ? order by feed_title" ;

  connection.connect() ;

  async.waterfall([
    function(next) {
      if ( typeof req.query.folder_name !== 'undefined' ) {
        q1 = "select * from (" + q1 + ") x where folder_name = ?" ; 
      	connection.query(q1, [ params.user_id,req.query.folder_name ],next) ;
      } else {
      	connection.query(q1,params.user_id,next) ;
      }
    },
    function(results, next) {
	  async.forEachSeries(results, function(item, next) {
        var t = next ;
		async.waterfall([
		  function(next) {
            connection.query(q2,[params.user_id, item.id],next) ;
		  },
		  function(results,next) {
			var d = item ;
			d.feeds = results ;
			data.push(d) ;
            t() ;
		  }
        ]) ;
	  },
      function() {
	    connection.end() ;
        res.send(data) ;
	  }) ;
    }
    ], function (err,res) {

       }
  ) ;
	 
} ;

module.exports.initRouting = function(router) {

  router.route('/folderlist')
      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
		  get({user_id: req.cookies.user_id})  ;
	  })
}
