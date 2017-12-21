const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
	title: {
		type: String,
		required: [true, 'Job title is required']
	},
	description: {
		type: String,
		required: [true, 'Job description is required']
	},
	slug: {
		type: String,
		required: true
	},
	company: {
		type: String,
		required: true
	}
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;