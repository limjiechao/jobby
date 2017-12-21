const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const educationSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	discipline: {
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
	}
});

const Education = mongoose.model('Education', educationSchema);

module.exports = Education;