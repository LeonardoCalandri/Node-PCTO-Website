const express = require('express');
const router = express.Router();
const path = require('path').resolve(__dirname, '..') // we get the path to the folder above this one  using the ..

const authmiddleware = (req, res, next) =>{ //used to check user permission and login status
    if(req.session['hasAccess'] == true ){//we check if the user has payed for the service to give him access
        next();   
       }else if(req.session['name']){
        res.render('store',{data: {name: req.session["name"], hasAccess: req.session["hasAccess"]}});
       }else{
        res.render('signUp',{data: {message:'please make an account'}});
       }
}

//We prepare all the routers that will manage the calls to /city 
router.get('/london', authmiddleware,(req, res)=>{ // once the script reaches this point it already considers itself inside /city so we do not need to add the /city before the new ones
    res.render("london", { data: {name :req.session["name"]} });;  //we get the absolute path to the public folder
});
router.get('/barcellona', authmiddleware,(req, res)=>{ 
    res.render("barcellona", { data: {name :req.session["name"]} }); 
});
router.get('/iasi', authmiddleware,(req, res)=>{ 
    res.render("iasi", { data: {name :req.session["name"]} }); 
});
router.get('/milano', authmiddleware,(req, res)=>{ 
    res.render("milano", { data: {name :req.session["name"]} });
});
router.get('/parigi', authmiddleware,(req, res)=>{ 
    res.render("parigi", { data: {name :req.session["name"]} }); 
});
router.get('/tokyo',authmiddleware, (req, res)=>{ 
    res.render("tokyo", { data: {name :req.session["name"]} });
});


module.exports = router;