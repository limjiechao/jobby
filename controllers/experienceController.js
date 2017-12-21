const Experience = require('../models/experience');

exports.home = (req, res) => {
	res.render('experience/home');
}

exports.add = (req, res) => {
	res.render('experience/add');
}