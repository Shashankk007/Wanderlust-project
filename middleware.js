const Listing = require('./models/listing.js'); 
const Review = require('./models/review.js'); 
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require('./schema.js');  //joi schema require kar rhe hai
const {reviewSchema} = require('./schema.js');  //joi schema require kar rhe hai

module.exports.isLoggedIn = (req, res, next) => {
    //agar user loggedin nhi hai to usko kaha jana hai usko save karwana padega
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; //saare middleware ke pas req.session ki access to hogi hi
        req.flash('error', 'You must be signed in to make a new listing!');
        return res.redirect('/login');
        
    }
    next();
};

//jaise hi authenticate ho jata hai to passport req.session ko reset kar deta hia
//to usko locals me save karwa lenge

module.exports.saveRedirectUrl = (req,res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// module.exports.isReviewAuthor = async(req, res, next) =>{
//     let {id , reviewId} = req.params; //reviewId nhi aa rhi
//     console.log(req.params);
//     const review = await Review.findById(reviewId);
//     if(!review.author._id.equals(res.locals.currentUser._id)){
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/listings/${id}`);
//     }
//     next();
// };



module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body); //jo bhi result aaya ussey error nikal liya
    
    if(error){
        let errMsg = error.details.map(el => el.message).join(','); //error details se error message nikal liya
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};


//middleware for validation of review...post route ne ja ke dekkho
module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body); //jo bhi result aaya ussey error nikal liya
    if(error){
        let errMsg = error.details.map(el => el.message).join(','); 
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}
