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
const flash = require('connect-flash');
const passport = require('passport');
const port = 1234;

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

app.listen(port, () => {
	console.log('>>> Express Connected <<<');
})