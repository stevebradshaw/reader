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

function del() {
  res.end() ;
}


function create_uf(params) {

console.log(params) ;

  q = 'insert into user_folders (user_id, folder_name) values (?, ?)'
    + ' on duplicate key update folder_name = ?, id = LAST_INSERT_ID(id)' ;

  connection.query(q, [ params.user_id, params.feed.folder_name, params.feed.folder_name], function (err, result) {
    console.log(err) ;
    if (!err) {
      console.log(result) ;
      q2 = 'update user_feeds set folder_id = ? where user_id = ? and feed_id = ?' ;
console.log('---------------------') ;
console.log(result.insertId) ;
console.log(params.user_id) ;
console.log(params.feed.feed_id) ;
console.log('---------------------') ;
      connection.query(q2, [ result.insertId, params.user_id, params.feed.feed_id ], function (err, result) {
        console.log(err) ;
        if (!err) {
          console.log(result) ;
          // TODO: finally, check if any folders are now empty and delete?
          q3 = 'delete from user_folders uf where user_id = 1 and not exists (select 1 from user_feeds u where u.user_id =1 and u.folder_id = uf.id)' ;
  res.end() ;
        }
      }) ;
    }
  }) ;
}

function update_uf(params) {
console.log('-- UPDATE -------------------------------------------------------------------') ;
console.log(params) ;
  q = 'update user_folders set folder_name = ? where user_id = ? and id = ?'  ;
  connection.query(q, [ params.feed.folder_name, params.user_id, params.feed.folder_id ], function(err, result) {
    console.log(err) ;
    console.log(result) ;
  res.end() ;
  }) ;

console.log('-----------------------------------------------------------------------------') ;
}

function put(params) {

  console.log(params) ;


  for (x in params.feed) {

    var f = params.feed[x] ;

    if (typeof f.folder_id === 'undefined') {
      create_uf( { user_id: params.user_id, feed: f} ) ;
    } else {
console.log('update') ;
      update_uf(params) ;
    }
/*async.waterfall([
    function(next) { 
        var q = "select id from user_folders where user_id = ? and folder_name = 'Blogs'" ;
		 connection.query(q, [ params.user_id ], next) ;
	},
    function(results, next){ console.log('second ') ; console.log(results) ; }
]);*/

  }
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

/*  var q = "select id, email, password, admin from users where email = ? and active = 'Y'";

  connection.query(q, params.username, function(err,data) {

    if (!err) {

      if (data.length == 0) {
        res.status(404) ;
        res.end() ;
      } else {


        bcrypt.compare(params.password, data[0].password, function(err, isMatch) {
	        if(err) {
			  return console.error(err);
			}

			console.log('do they match?', isMatch);
            if (isMatch) {
				res.cookie("loggedin", "yes", { maxAge: 3600*1000, path: "/"});
                res.cookie("user_id", data[0].id, { maxAge: 3600*1000, path: "/"});
                res.cookie("email", data[0].email, { maxAge: 3600*1000, path: "/"});

                var sessionid = "SESSION:" + uuid.v1() ;

                res.cookie("sessionid", sessionid, { maxAge: 3600*1000, path: "/"});
                var sess = { email: data[0].email, id: data[0].id } ;
  
                client.set(sessionid, JSON.stringify(sess), redis.print);

                client.expire(sessionid, 24*60*60);
                res.status(200) ;


		    } else {
              console.log("password doesn't match") ;
              res.status(401) ;
			}
            res.end() ;
        });
      } 
    } else { 
      console.log('error') ;
      console.log(err) ;
      res.status(500) ;
      res.end() ;
    }
  }) ;*/
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
		  console.log(req.body) ;
          put({user_id: 1,  feed: req.body}) ;
//          put({user_id: req.cookies.user_id, feed: req.body}) ;
      })
      .post(function(rq,rs) {
          res = rs ;
          req = rq ;
		  console.log(req.body) ;
          post({user_id: req.cookies.user_id, feed: req.body.feed}) ;
      }) 

      .delete(function(rq,rs) {
        res = rs ;
        req = rq ;
        del() ;
      }) ;

} ;
