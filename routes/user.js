const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');    //for error handling
const ExpressError = require('../utils/ExpressError.js');
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controller/user.js');

//signup route
router.get('/signup', userController.renderSignup);

router.post("/signup", wrapAsync(userController.signup));

//login route

router.get('/login', userController.renderLogin);


//post route me passport.authenticate() use karna padega as middleware..agar fail hue to redirect to login page
router.post('/login', saveRedirectUrl ,passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login);

router.get('/logout', userController.logout);


module.exports = router;