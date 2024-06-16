//to create model of collection this file is used

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title : {
        type: String,
        required: true},
    description : String,
    image : {
        // type: String,
        // default : "https://images.unsplash.com/photo-1535262412227-85541e910204?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set : (value) => value==="" ? "https://images.unsplash.com/photo-1535262412227-85541e910204?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : value
        url : String,
        filename : String
    },

    price : {
        type: Number,
        required: true},
    location : { 
        type: String,
        required: true},
    country : {
        type: String,
        required: true},

    review : [      //to store review of that listing to array of objectId store karwa rhe hai
        {
            type : Schema.Types.ObjectId,
            ref : "Review"  //ye review model hai
        } ,
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"  //user model ka reference
    }

});

//middleware to delete review of that listing when that listing is deleted
listingSchema.post('findOneAndDelete', async function(listing){  //listing ka data aayga jo delete hone wali hai
    if(listing){
        await Review.deleteMany({
            _id : {
                $in : listing.review
            }
        })
    }
   
});



const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;