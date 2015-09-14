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
/*
    console.log(params.p) ;
    if (params.p) {
console.log('p set') ;
var q = "update users set active = 'Y', date_activated = now() where activation_code = ? and active = 'N'" ;
      connection.query(q, params.p, function(err,data) {

        if (!err) {
console.log(data.affectedRows) ;
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
console.log('p not set') ;
      res.status(500) ;
      res.end() ;
    }
*/

} 

//function delete() {
//}

function put(params) {

}

function post(params) {

  console.log(params) ;

  if (params.feed.id) {
    // feed id populated so just add subscription for user
    var q = "select title from feeds where id = ?";
    
    connection.query(q, params.feed.id, function(err,data) {

      if (!err) {

        if (data.length == 0) {
          res.status(404) ;
          res.end() ;
        } else {
          console.log(data[0].title) ;
          var q2 = "insert into user_feeds (user_id, feed_id, folder_id, feed_title) values (?,?,?,?)"

          connection.query(q2, [params.userid, params.feed.id, 0, data[0].title], function(err,data) {
          
            if (!err) {
console.log('**************************') ;
console.log(data) ;
console.log('**************************') ;
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

  router.route('/subscribe')
      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
		  get(req.query)  ;
	  })

      .put(function(rq,rs) {
          res = rs ;
          req = rq ;
console.log('********************') ;
console.log(req.body) ;
console.log('********************') ;
          put({userid: req.cookies.userid, feed: req.body.feed}) ;
      }) ;
      .post(function(rq,rs) {
          res = rs ;
          req = rq ;
console.log('********************') ;
console.log(req.body) ;
console.log('********************') ;
          post({userid: req.cookies.userid, feed: req.body.feed}) ;
      }) ;

/*      .delete(function(rq,rs) {
          res = rs ;
          req = rq ;
//        delete() ;
      }) ;
*/	  
/*	  .post(function(req,res) {
          var burp = new BurpModel() ;
          burp.message = req.body.msg;
//console.log(req.body.msg) ;
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
} ;
