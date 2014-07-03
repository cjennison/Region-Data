var http	= require('http'),
	express	= require('express')//,
	user_routes = require('./routes/index')
	data_routes = require('./routes/data')
	database = require('./lib/database')
	//index	= require
var zip = require('express-zip');
var url = require('url');

var app = express();

var enableCORS = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://felek.cns.umass.edu:8080');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
 
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};


app.configure(function(){
  app.set('views', __dirname + '/views');
  console.log(__dirname);
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ secret : 'streams' }));
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/users'));
  app.use(express.static('/home/dataadmin/tmp'));
  app.use(express.static('/home/dataadmin/todownload'));
  app.use(app.router);
  app.use(enableCORS);
});



//NAVIGATION
app.get('/view-results', user_routes.viewResults);

app.get('/', function(req, res){
	if(req.session.username != undefined){
		res.redirect('/main');
		
		return;
	}
	//res.send("<b>My Name is Bill Clinton</b>");
	res.render('index.ejs');
});
app.get('/browse', user_routes.browsePage);
app.get('/edit', user_routes.editPage);
app.get('/browse', user_routes.browsePage);
app.get('/model', user_routes.modelPage);
app.get('/db', user_routes.showDatabase);
app.get('/data-viewer', user_routes.viewData);
app.get('/explore', user_routes.exploreData);
app.get('/data-settings', function(req, res){
	if(req.session.username == undefined){
		res.redirect('/');
		
		return;
	}
	
	res.render('settings.ejs');
})
app.get('/main', function(req, res){
	
	if(req.session.username == undefined){
		res.redirect('/');
		
		return;
	}
	
	res.render('main.ejs');
})


//LOGIN
app.post('/register-user', user_routes.registerUser);
app.post('/login-user', user_routes.loginUser);


//UPLOAD
app.post('/upload', data_routes.uploadData);

//DOWNLOAD
app.post('/download', data_routes.download);



//DATA
app.post('/send-results', data_routes.sendResults);
app.post('/get-data-by-date', data_routes.getDataByDate);
app.get('/user-databases', data_routes.exportDatabases);
app.post('/showdatabase', data_routes.showDatabaseOfUser);
app.post('/send-results', data_routes.sendResults);
app.get('/getAllData', data_routes.getAllData);
app.post('/viewDatabase', data_routes.getSingleDatabase);
app.post('/create-database', data_routes.createDatabase);
app.post('/remove-database', data_routes.removeDatabase);
app.post('/add-relation', data_routes.addRelation);
app.post('/get-relations', data_routes.getRelations);


//UI
app.post('/morerows', data_routes.getMoreRows);


//UTIL
app.get('/whoami', function(req, res){
	res.json(req.session.username);
})




//Listener
var server = app.listen(1337, function(){
	 console.log('Listening on port %d', server.address().port);
})
