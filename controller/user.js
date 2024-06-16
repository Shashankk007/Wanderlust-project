const User = require('../models/user.js');

module.exports.renderSignup = (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            email,
            username
        });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser , (err)=>{  //taki signup karne pe direct login ho jaye
            if(err){
                next(err);
            }
            req.flash('success', "Welcome to Wanderlust");
            res.redirect('/listings');
        })
        
    }
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/signup');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login = async (req, res) => {
    req.flash('success', "Welcome back!");
    let redirect_Url = res.locals.redirectUrl || '/listings';
    res.redirect(redirect_Url);
    
}

module.exports.logout = async(req, res , next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
    })
    req.flash('success', "Successfully logged out");
    res.redirect('/listings');
}