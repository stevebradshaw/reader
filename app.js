var appinfo = { port: 3000 }
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , logger = require('morgan') ;

var app = express() ;

var http = require('http').Server(app) ;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.locals.basedir = __dirname ;

var folderlist = require('./services/folderlist'),
    entry = require('./services/entry'),
    user = require('./services/user'),
    login = require('./services/login'),
    feedentries = require('./services/feedentries') ;


var router = express.Router();

folderlist.initRouting(router) ;
feedentries.initRouting(router) ;
entry.initRouting(router) ;
user.initRouting(router) ;
login.initRouting(router) ;

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
  res.render('index',
       { title : 'Feed Reader' }
     )
  }) ;

app.get('/reader', function (req,res) {
console.log(req.cookies) ;
if (req.cookies.loggedin == 'yes') {
  res.render('reader',
       { title : 'Feed Reader' }
     )
} else {
//res.render('index', { title : 'Feed Reader' }) ;
res.redirect('/')
}
  }) ;

http.listen(appinfo.port, function(){
  console.log('listening on ' + appinfo.port);
}) ;
