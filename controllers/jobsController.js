const Job = require('../models/job');

exports.home = (req, res) => {
	res.render('jobs/home');
}

exports.add = (req, res) => {
	res.render('jobs/add');
}

exports.apply = (req, res) => {
	req.checkBody('title', 'First name cannot be empty').notEmpty();
	req.checkBody('description', 'Last name cannot be empty').notEmpty();
	req.checkBody('slug', 'User name cannot be empty').notEmpty();
	req.checkBody('company', 'Email cannot be empty').notEmpty();

	let errors = req.validationErrors();

	if (errors) {
		res.render('auth/register', {'errors': errors});
		;
	} else {
		User.create({
			title: req.body.title,
			description: req.body.description,
			slug: req.body.slug,
			company: req.body.company
		}, (err, createdUser) => {
			if(err) {
				req.flash('error', 'Could not create user account')
				res.render('/auth/register');
			} else {
				req.flash('success', 'Job added to Jobby')
				res.render('/jobs/home');
			}
		});
	}
}