const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    //new review bana rhe hai aur jo name ke andar object bana rhe the wo require kar rhe hai 
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; //author me user ki id save kar rhe hai
    //ab iss review ko listing document me daal denge
    listing.review.push(newReview); //ye aise save nhi hoga hume save() likhna hoga

    await newReview.save();
    await listing.save();
    req.flash('success', 'New review created');
    res.redirect(`/listings/${listing._id}`)
};

module.exports.deleteReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {review : reviewId}}); //reviewId ko pull kar denge mtlb hata denge list se
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted!');
    res.redirect(`/listings/${id}`);
};