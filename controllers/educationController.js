const Education = require('../models/education');

exports.home = (req, res) => {
	res.render('education/home');
}

exports.add = (req, res) => {
	res.render('education/add');
}