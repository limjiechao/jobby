 // Dependencies
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const expressValidator = require('express-validator')
const server = require('http').createServer(app); // Sockets runs on server, not express
const io = require('socket.io')(server);
const flash = require('connect-flash');
const passport = require('passport');
const port = process.env.PORT || 3000;

const routes = require('./routes/routes');
const dbConfig = require('./config/dbConfig');

// Middlewares
mongoose.Promise = global.Promise;
mongoose.connect(
	dbConfig.url, 
	{ useMongoClient: true }).then(
		() => { console.log('>>> Mongoose    Ready <<<'); },
		(err) => { console.log(err) }
);
app.use(cookieParser()); // Read cookies for auth
app.use(bodyParser.json()); // Get information from HTML forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Creates session
app.use(session({
	secret: 'whateverthefuckitis',
	resave: false,
	saveUninitialized: true,
	// cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// Use connect-flash for flash messages stored in session

app.use((req, res, next) => {
	// Before every route, attach the flash messages and current user to res.locals
	res.locals.alerts =  req.flash();
	res.locals.currentUser =  req.user;
	next();
});

// Validator for express
app.use(expressValidator({
	errorFormatter: (param, msg, value) => {
		let namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while (namespace.length) {
			formParam += '['+ namespace.shift()+ ']'
		}

		return {
			param: formParam,
			msg: msg,
			value: value
		}
	}
}));

// Routes
app.use('/', routes);

server.listen(port, () => {
	console.log('>>> Server connected <<<');
});

let users = [];
var numUsers = 0;

// Socket.io connect
io.on('connection', function(socket){
	console.log('A user connected');

	socket.on('set user', (data, callback) => {
		if (users.indexOf(data) != -1) {
			callback(false);
		} else {
			callback(true);
			socket.username = data;
			users.push(socket.username);
			updateUsers();
		}
	});

	socket.on('send message', function(data) {
		io.emit('show message', { msg: data, user: socket.username });
	});

	socket.on('user is typing', function(data) {
		// console.log(data);
		io.emit('show status', { user: socket.username });
	});

	socket.on('user stopped typing', function(data) {
		io.emit('hide status', { user: socket.username });
	});

	socket.on('disconnect', function(data) {
		if (!socket.username) return;
		users.splice(users.indexOf(socket.username), 1);
		updateUsers();
	});

	function updateUsers() {
		io.sockets.emit('users', users);
	}
});

// app.listen(port, () => {
// 	console.log('>>> Express Connected <<<');
// })