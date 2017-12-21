const passport = require('../helpers/ppInformation');
const User = require('../models/user');

// Load Login Page
exports.login = (req, res) => {
	res.render('auth/login');
}

// Load Register Page
exports.register = (req, res) => {
	res.render('auth/register');
}

exports.logout = (req, res) => {
	req.logout()
	req.flash('success', 'You are logged out')
	res.redirect('/auth/login');
}

// Post Register Form Details
exports.signup = (req, res) => {
	req.checkBody('firstName', 'First name cannot be empty').notEmpty();
	req.checkBody('lastName', 'Last name cannot be empty').notEmpty();
	req.checkBody('userName', 'User name cannot be empty').notEmpty();
	req.checkBody('email', 'Email cannot be empty').notEmpty();
	req.checkBody('password', 'Password cannot be empty').notEmpty();
	req.checkBody('password2', 'Please confirm your password').notEmpty();
	if (req.body.password2) {
		req.checkBody('password', 'You did not enter the same password').equals(req.body.password2);
	}

	let errors = req.validationErrors();

	if (errors) {
		res.render('auth/register', {'errors': errors});
		;
	} else {
		User.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			userName: req.body.userName,
		}, (err, createdUser) => {
			if(err) {
				req.flash('error', 'Could not create user account')
				res.render('/auth/register');
			} else {
				// Send user to auth page of profile
				passport.authenticate('local', {
					successRedirect: '/', 
					successFlash: 'Account created and logged in'
				})(req, res);
			}
		});
	}
}