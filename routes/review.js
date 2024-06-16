const express = require('express');
const router = express.Router({mergeParams : true});
//mergeparams preserve the req.params values from the parent router
const wrapAsync = require('../utils/wrapAsync.js');    //for error handling
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { isLoggedIn ,validateReview, isReviewAuthor } = require('../middleware.js');

const {createReview, deleteReview } = require('../controller/review.js');



//For Reviews
//post route
//jo common part hai wo index.js me likh dena hai aur yaha / likh denge

router.post('/',isLoggedIn, validateReview ,wrapAsync(createReview));

//delete review route
router.delete('/:reviewId',isLoggedIn, wrapAsync(deleteReview));

module.exports = router;