const Listing = require('../models/listing');

module.exports.index = async(req, res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs" , {allListing})}


module.exports.renderNewForm = (req, res)=>{
    res.render('listings/new.ejs');
}

module.exports.showListing = async(req, res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id) //populate use kar rhe hai taaki sirf objectId na aaye saari cheeze aa jaye
    .populate({path : "review", populate :{path : "author"}}) //mtlb review ke sath jo uska author hai usko bhi populate kar do
    .populate('owner');
    if(!listing){
        req.flash('error', 'Cannot find that listing!');
        res.redirect('/listings');
    }
    res.render('listings/show.ejs', {listing});

}

module.exports.createListing = async(req, res)=>{
    //let ListingObject = req.body.listing; //get the listing object from the form
    //console.log(newListing);
    //res.send(req.file);
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; //logged in user ka id store kar diya
    newListing.image = {url, filename};
    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect('/listings');
}

module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Cannot find that listing!');
        res.redirect('/listings');
    }
    //pixel decrease karne ke liye cloudinary ke link me change kar rhe hai
    let originalImg = listing.image.url;
    let newImg = originalImg.replace('upload', 'upload/w_250');
    res.render('listings/edit.ejs', {listing,newImg});

}

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== 'undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();}
    req.flash('success', 'Listing Updated!');
    res.redirect('/listings');
}

module.exports.deleteListing = async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted listing!');
    res.redirect('/listings');
}