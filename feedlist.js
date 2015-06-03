var mysql      = require('mysql');

var data = [] ;

function myCB(folder, feeds) {
	var n = folder ;
	n.feeds = feeds ;

	data.push(n) ;
	console.log(data) ;
	console.log('     ') ;
}

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'reader_dev',
  password : 'dev',
  database : 'reader'
});

connection.connect();

//var q1 = "select id, folder_name from (select id, folder_name from user_folders where user_id = ? order by folder_name) uf union select 0 id,'Uncategorised' folder_name limit 5" ;
var q1 = "select id, folder_name from user_folders where user_id = 1 union select 0 id,'Uncategorised' folder_name  order by if(folder_name='Uncategorised', 'ZZZZZZZZZZ', folder_name) limit 5" ;

var query = connection.query(q1,1) ;

query.on('error', function(err) {
  throw err ;
}) ;

query.on('field', function(fields) {
  console.log(fields) ;
}) ;

query.on('result', function(row) {
//  console.log(row) ;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'reader_dev',
  password : 'dev',
  database : 'reader'
});

connection.connect();
  
  var q2 = "select f.id, uf.feed_title from feeds f, user_feeds uf where uf.user_id = ? and f.id = uf.feed_id and uf.folder_id = ? limit 2" ;
//  var query2 = connection.query(q2,[1, row.id]) ;
connection.query(q2,[1, row.id], function(err, rows, fields)  {
myCB(row, rows) ;
}) ;

connection.end() ;
}) ;
/*
,function(err, rows, fields) {
  if (!err) {
console.log(rows);

for(var idx in rows){
console.log(idx) ;
  console.log(rows[idx].id);

var q2 = "select f.id, uf.feed_title from feeds f, user_feeds uf where uf.user_id = ? and f.id = uf.feed_id and uf.folder_id = ? limit 2" ;
connection.query(q2, [1, rows[idx].id], function(err,r,f) {
console.log(err) ;
}) ;
}
  } else
    console.log('Error while performing Query.');
});
*/
console.log(data) ;
connection.end();

//
//var mongoose = require('mongoose'),
//    BurpModel = require('../models/burp-model') ;  

/*var burp = new BurpModel() ;

module.exports.initRouting = function(router) {

  console.log('init burp services') ;
  
  router.route('/burp')
      .get(function(req,res) {


	  })
	  
	  .post(function(req,res) {
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

	  }) ;
}*/


