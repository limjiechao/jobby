const User = require('../models/user');
// Index
exports.index = (req, res) => {
	res.render('home');

}
// Home
exports.home = (req, res) => {
	res.render('home');
}