const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');    //for error handling
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js'); //middleware require kar rhe hai

const listingController = require('../controller/listing.js');

const multer = require('multer');
const {storage} = require('../cloud-config.js');
const upload = multer({ storage }); //multer cloud storage me save karwa rha hai
//multer form se file lega aur destination me save karwa dega...default me ye uploads name ka folder bana dega



//using router.route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn, 
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing));


//new route
router.get('/new', isLoggedIn, wrapAsync(listingController.renderNewForm));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing, 
        wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner , wrapAsync(listingController.deleteListing));


    
//edit get route
router.get('/:id/edit', isLoggedIn ,isOwner, wrapAsync(listingController.renderEditForm));




module.exports = router;