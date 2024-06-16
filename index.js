if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');    //to templates making
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');


//routes to require kar rhe hai
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');


const app = express();
app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


const dbUrl = process.env.ATLASDB_PASS;

main().then(()=> console.log('MongoDB connected...'))
    .catch(err => console.log(err));



async function main(){
    await mongoose.connect(dbUrl);
};


const store = MongoStore.connect({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET},
    touchAfter : 24 * 60 * 60 //time period in seconds...itni der tak session store rhe agar change na kare to
});

store.on("error", function(e){
    console.log("Session store error", e);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    //jis cookies ki expiry set nhi hoti to browser close hone par delete ho jati hai
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000*60*60*24*7, //millisecond me batana hoga aaj ki date se 7 din aage
        maxAge : 1000*60*60*24*7
    
    }
};




app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //session use karega passport
//agar user ek page se dusre page pe ja rha hai to app ko pata ho ki user same hi hai
//series of request and response , each assoiated with the same user is known as session
passport.use(new localStrategy(User.authenticate())); //authenticate() method passport-local-mongoose se aata hai
//mtlb passport ke andar jo localStrategy hai usse use kar rhe hai

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//user info ko store karana = serialization and vice versa


//middleware for flash and locals
app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user; //req.user me user ki info hoti hai to isko ejs me bhi access kar sakte hai
    next();
});


// app.get('/demouser', async(req, res)=>{
//     const fakeUser = new User({
//         email : 'shashank@gmail.com',
//         username : 'shashank'
//     });

//     let registeredUser = await User.register(fakeUser, "password");
//     res.send(registeredUser);
// });

app.use('/listings', listingRouter); //jab bhi /listings aayega to listings.js me jayega
app.use('/listings/:id/reviews', reviewRouter); //jab bhi /listings/:id/review aayega to review.js me jayega
//agar hum chahte hai ki :id wali jo id hai wo yahi index.js me na ruk jaye aur reviews ke andar jaye
//to mergeParams use karna hoga
app.use('/', userRouter); //jab bhi / aayega to user.js me jayega



//agar uper ki api call ho gyi to theek agar link match nhi hua to * (means for all links)
app.all('*', (req,res,next)=>{
    next(new ExpressError(404, "Page not found"))
}); 


//error middleware
app.use((err, req, res, next)=>{
    //deconstruction of error code and message
    let {status = 500 , message} = err;
    res.status(status).render('listings/error.ejs', {message});
});


app.listen(8080, ()=>{
    console.log('Server is running on port 8080');
})
