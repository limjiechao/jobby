const express = require('express');
const router = express.Router();

const passport = require('../helpers/ppInformation');
const isLoggedIn = require('../helpers/loginBlock');

const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const jobsController = require('../controllers/jobsController');
const educationController = require('../controllers/educationController');
const experienceController = require('../controllers/experienceController');

// Home for none-auth and auth access
router.get('/', homeController.index);
router.get('/home', isLoggedIn, homeController.home);

// Jobs for auth access
router.get('/jobs', isLoggedIn, jobsController.home);
router.get('/jobs/add', isLoggedIn, jobsController.add);
router.post('/jobs/add', isLoggedIn, jobsController.add);
router.post('/jobs/apply', isLoggedIn, jobsController.apply);

// Education for auth access
router.get('/education', isLoggedIn, educationController.home);
router.get('/education/add', isLoggedIn, educationController.add);
router.post('/education/add', isLoggedIn, educationController.add);

// Experience for auth access
router.get('/experience', isLoggedIn, experienceController.home);
router.get('/experience/add', isLoggedIn, experienceController.add);
router.post('/experience/add', isLoggedIn, experienceController.add);

// User auth
router.get('/auth/login', authController.login);
router.post('/auth/login',
	passport.authenticate('local', { 
	successRedirect: '/',
	failureRedirect: '/auth/login',
	failureFlash: 'Invalid username and/or password',
	successFlash: 'You have logged in'
}));
router.get('/auth/register', authController.register);
router.post('/auth/register', authController.signup);
router.get('/auth/logout', authController.logout);

module.exports = router;