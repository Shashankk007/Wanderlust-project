//this file is for joi validation schema..mtlb koi backend se khali request na jaye jaise agar koi hopscotch use kar liya to
//to uske liye pehle joi schema banaya phir index.js me  validation function banaya aur phir usey middleware jaise pass kar diya post request me

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image : Joi.string().allow('', null)
          
    }).required(),  //required mtlv listing name ki object honi hi chahiye
    
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required()
});

