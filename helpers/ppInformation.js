const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy({
	usernameField: 'userName',
	passwordField: 'password'
},
function(userName, password, done) {
	User.findOne({ userName: userName }, function (err, user) {
		if (err) { return done(err); }
		if (!user) {
			console.log('Incorrect username');
			return done(null, false, { error: 'Incorrect username.' });
		}
		if (!user.validPassword(password)) {
			console.log('Incorrect password');
			return done(null, false, { error: 'Incorrect password.' });
		}

		return done(null, user);
	});
}));

module.exports = passport;