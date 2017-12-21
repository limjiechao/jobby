const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
	position: {
		type: String,
		required: true
	},
	company: {
		type: String,
		required: true
	},
	start: {
		type: Date,
		required: true
	},
	end: {
		type: Date,
		required: true
	},
	user: {
		type: String,
		required: true
	}
});

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;