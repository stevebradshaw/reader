var mysql = require('mysql'),
    $ = require('jquery'),
    async = require('async') ;

var req, res ;

function get(params) {
console.log(params) ;
	var data = [] ;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'reader_dev',
  password : 'dev',
  database : 'reader'
});


var q = "select folder_name from user_folders where user_id = ? union select 'Uncategorised' folder_name  order by if(folder_name='Uncategorised', 'ZZZZZZZZZZ', folder_name)" ;

connection.connect() ;

  async.waterfall([
    function(next) {
      connection.query(q, [ params.userid ], next) ;
    },
    function(results, next) {
console.log('here') ;
console.log(results);


var array = [] ;
for (x in results) {
array.push(results[x].folder_name) ;
}

/*var array = $.map(results, function(value, index) {
console.log(value) ;
    return [value];
});*/
console.log(array) ;
      res.send(array) ;
res.status(200) ;
      res.end() ;
    }
  ], function (err,res) {
     console.log(err) ;
  }) ;

	 
} ;

module.exports.initRouting = function(router) {

  router.route('/userfolders')
      .get(function(rq,rs) {
		  req = rq ;
		  res = rs ;
		  get({userid: req.cookies.userid})  ;
/*    var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
                  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
                  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
                  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
                  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
                  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
                  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
                  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
                  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
                 ];

res.send(states) ;*/
	  })
	  
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
}


