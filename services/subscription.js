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
      connection.query(q, [ params.userid ], next) ;
    },
    function(results, next) {
      res.send(results) ;
      res.end() ;
    }
  ], function (err,res) {
     console.log(err) ;
  }) ;

} 

function delte() {
  res.end() ;
}

function put(params) {
  for (x in params.feed) {
    console.log(params.feed[x]) ;
    var f = params.feed[x] ;
console.log(f.folder_id) ;
  }
  res.end() ;
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

          connection.query(q2, [params.userid, params.feed.id, 0, data[0].title], function(err,data) {
          
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
                res.cookie("userid", data[0].id, { maxAge: 3600*1000, path: "/"});
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
          get({ userid: req.cookies.userid }) ;
	  })

      .put(function(rq,rs) {
          res = rs ;
          req = rq ;
          put({userid: req.cookies.userid, feed: req.body}) ;
      })
      .post(function(rq,rs) {
          res = rs ;
          req = rq ;
          post({userid: req.cookies.userid, feed: req.body.feed}) ;
      }) 

      .delete(function(rq,rs) {
        res = rs ;
        req = rq ;
        delte() ;
      }) ;

} ;
