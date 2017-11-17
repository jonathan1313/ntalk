var express = require('express')
	, app = express()
	, load = require('express-load')
	, error = require('./middleware/error')
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server);

const KEY = 'ntalk.sid', SECRET = 'ntalk';
var cookie = express.cookieParser(SECRET)
	, store = express.session.MemoryStore()
	, sessOpts = {secret: SECRET, key: KEY, store: store}
	, session = express.session(sessOpts);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookie);
app.use(session);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(error.notFound);
app.use(error.serverError);

// app.get('/', routes.index);
// app.get('/usuarios', routes.user.index);

io.set('authorization', function(data, accept) {
	cookie(data, {}, function(err) {
		var sessionID = data.signedCookies[KEY];
		store.get(sessionID, function(err, session) {
			if (err || !session) {
				accept(null, false);	
			} else {
				data.session = session;
				accept(null, true);
			}
		});
	});
});

load('models')
	.then('controllers')
	.then('routes')
	.into(app);
load('sockets')
	.into(io);

server.listen(3000, function(){
	console.log("Ntalk no ar.")
});


/* CODIGO GERADO ALTOMATICAMENTE */
// var express = require('express');
// var path = require('path');
// var favicon = require('static-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

// var routes = require('./routes/index');
// var users = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(favicon());
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

// /// catch 404 and forwarding to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// /// error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });


// module.exports = app;
