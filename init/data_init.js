//to insert data into database this file is created

const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

main().then(()=> console.log('MongoDB connected...'))
    .catch(err => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async ()=>{
    //pehle data delete kar diya jo previously bhara hua tha
    await Listing.deleteMany({});
    //sabhi document ke andar owner add kar rhe hai
    initData.data = initData.data.map((obj)=>({...obj, owner : '666d2b3796d9c4742a603207' }))
    //ab insert kar diya
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
}

initDB();