var appinfo = { port: 3000 }
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , logger = require('morgan')
  , redis = require("redis")
  , client = redis.createClient();

var app = express() ;

var http = require('http').Server(app) ;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.locals.basedir = __dirname ;

var folderlist = require('./services/folderlist'),
    entry = require('./services/entry'),
    category = require('./services/category'),
    suggestfeeds = require('./services/suggestfeeds'),
    user = require('./services/user'),
    signin = require('./services/signin'),
    signup = require('./services/signup'),
    activate = require('./services/activate'),
    subscribe = require('./services/subscribe'),
    feedentries = require('./services/feedentries') ;


var router = express.Router();

activate.initRouting(router) ;

app.use('/', router) ;

folderlist.initRouting(router) ;
feedentries.initRouting(router) ;
entry.initRouting(router) ;
category.initRouting(router) ;
suggestfeeds.initRouting(router) ;
user.initRouting(router) ;
subscribe.initRouting(router) ;
signin.initRouting(router) ;
signup.initRouting(router) ;

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(logger("combined")) ;

app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))

app.use(express.static(__dirname + '/public')) ;

app.use('/api', router) ;

app.get('/', function (req,res) {
    res.render('index', { title : 'Feed Reader' })
  }) ;

app.get('/reader', function (req,res) {
    if (req.cookies.loggedin == 'yes') {
      res.render('reader', { title : 'Feed Reader' })
    } else {
      res.redirect('/')
    }
  }) ;

app.get('/signout',function (req,res) {
  client.expire(req.cookies.sessionid, 0) ;
  res.clearCookie('loggedin') ;
  res.clearCookie('userid') ;
  res.clearCookie('sessionid') ;
  res.redirect('/') ;
}) ;

/*app.get('/activate', function (req,res) {
    console.log(req.query.p) ;
    if (req.query.p) {
console.log('p set') ;
      res.send('Activate account!') ;
      res.status(200) ;
      res.end() ;
    } else {
console.log('p not set') ;
      res.status(500) ;
      res.end() ;
    } 
//    res.render('index', { title : 'Feed Reader' })
  }) ;
*/
http.listen(appinfo.port, function(){
  console.log('listening on ' + appinfo.port);
}) ;
