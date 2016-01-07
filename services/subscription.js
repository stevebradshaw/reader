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

function del(params) {
  q1 = 'delete from user_entry_status where user_id = ? and feed_id = ?' ;

  connection.query(q1, [ params.user_id, params.feed.feed_id ], function (err, result) {

    q2 = 'delete from user_feeds where user_id = ? and feed_id = ?' ;

    connection.query(q2, [ params.user_id, params.feed.feed_id ], function (err, result) {
      // TODO: handle error condition?
      //
      // TODO: if the folder is now empty, delete it?
    }) ;
  }) ;
  res.end() ;
}


function create_uf(params) {

  q = 'insert into user_folders (user_id, folder_name) values (?, ?)'
    + ' on duplicate key update folder_name = ?, id = LAST_INSERT_ID(id)' ;

  connection.query(q, [ params.user_id, params.feed.folder_name, params.feed.folder_name], function (err, result) {

    if (!err) {
      q2 = 'update user_feeds set folder_id = ? where user_id = ? and feed_id = ?' ;
      connection.query(q2, [ result.insertId, params.user_id, params.feed.feed_id ], function (err, result) {

        if (!err) {
          // TODO: finally, check if any folders are now empty and delete?
          q3 = 'delete from user_folders uf where user_id = 1 and not exists (select 1 from user_feeds u where u.user_id =1 and u.folder_id = uf.id)' ;
          res.end() ;
        }
      }) ;
    } else {
      res.status(500) ;
	  res.send(err) ;
	  res.end() ;
	}
  }) ;
}

function update_uf(params) {

  q = 'update user_folders set folder_name = ? where user_id = ? and id = ?'  ;
  connection.query(q, [ params.feed.folder_name, params.user_id, params.feed.folder_id ], function(err, result) {
	  if (!err) {
        res.end() ;
	  } else {
        res.status(500) ;
	    res.send(err) ;
	    res.end() ;
	  }
  }) ;

}

function update_feed_title(params) {
  q = 'update user_feeds set feed_title = ? where user_id = ? and feed_id = ?' ;

  connection.query(q, [params.feed.feed_title, params.user_id, params.feed.feed_id], function(err, result) {
	  if (!err) {
        res.end() ;
	  } else {
        res.status(500) ;
	    res.send(err) ;
	    res.end() ;
	  }
  }) ;
}
function put(params) {

  async.waterfall([
    function(next) {

  for (x in params.feed) {

    var f = params.feed[x] ;
    // TODO: Update feed title
    update_feed_title({ user_id: params.user_id, feed: f}) ;

    // TODO: Don't hard-code the catch-all folder name
    if (f.folder_name != 'Uncategorised') {
      if (typeof f.folder_id === 'undefined') {
        create_uf( { user_id: params.user_id, feed: f} ) ;
      } else {
        update_uf(params) ;
      }
    }
  }

    },
    function(results, next) {
      res.send(results) ;
      res.end() ;
    }
  ], function (err,res) {
     console.log(err) ;
  }) ;

}

function post(params) {

  if (params.feed.id) {
    // feed id populated so just add subscription for user
    var q = "select title from feeds where id = ?";
    
    connection.query(q, params.feed.id, function(err,data) {

      if (!err) {

        if (data.length == 0) {
          res.status(404) ;
          res.end() ;
        } else {
  
          var q2 = "insert into user_feeds (user_id, feed_id, folder_id, feed_title) values (?,?,?,?)"

          connection.query(q2, [params.user_id, params.feed.id, 0, data[0].title], function(err,data) {
          
            if (!err) {
              res.status(201) ;
              var q3 = 'select * from user_feeds uf, feed_categories fc where uf.id = ? and uf.feed_id = fc.feed_id' ;
              connection.query(q3, data.insertId, function (err,data) {
              res.send(data) ;
              res.end() ;
                                                  }) ;
            } else {
              res.status(500) ;
              res.send() ;
              console.log(err) ;
            }

          }) ;
        }
      } else {
        res.status(500) ;
        res.send() ;
        console.log(err) ;
      }
    }) ;
  } else {
    // need to create feed and subscribe user to it
  }

}

module.exports.initRouting = function(router) {

  router.route('/subscription')
      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
          get({ user_id: req.cookies.user_id }) ;
	  })

      .put(function(rq,rs) {
          res = rs ;
          req = rq ;
//          put({user_id: 1,  feed: req.body}) ;
          put({user_id: req.cookies.user_id, feed: req.body}) ;
      })
      .post(function(rq,rs) {
          res = rs ;
          req = rq ;
          post({user_id: req.cookies.user_id, feed: req.body.feed}) ;
      }) 

      .delete(function(rq,rs) {
        res = rs ;
        req = rq ;
        del({user_id: req.cookies.user_id, feed: req.body.feed}) ;
      }) ;

} ;
