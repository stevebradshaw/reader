var mysql = require('mysql'),
    async = require('async') ;

var data = [] ;

function get(params) {
	data = [] ;
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'reader_dev',
  password : 'dev',
  database : 'reader'
});


var q1 = "select id, folder_name from user_folders where user_id = ? union select 0 id,'Uncategorised' folder_name  order by if(folder_name='Uncategorised', 'ZZZZZZZZZZ', folder_name) limit 5", 
    q2 = "select f.id, uf.feed_title from feeds f, user_feeds uf where uf.user_id = ? and f.id = uf.feed_id and uf.folder_id = ? limit 2" ;


connection.connect() ;

async.waterfall([
  function(next) {
	connection.query(q1,params.userid,next) ;
  },
  function(results, next) {
	async.forEachSeries(results, function(item, next) {
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
//	  console.log(data) ;
	}) ;
  }
], function (err,res) {
}) ;
	  return data ;
} ;

//
//var mongoose = require('mongoose'),
//    BurpModel = require('../models/burp-model') ;  

/*var burp = new BurpModel() ;*/

module.exports.initRouting = function(router) {
console.log('feedlist routing') ;
  router.route('/feedlist')
      .get(function(req,res) {
		  var d = get({userid: 1}) ;
		  console.log(d) ;
		res.end() ;
	  })
	  
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
}


