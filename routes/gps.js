//router for the gps links contained inside the city pages, they link to /route resource that is the managed here, redirecting to google maps with the apropriate parameters
const express = require('express');
const router = express.Router();
const _url = require('url');

router.get('/', (req, res)=>{
    let googleUrl = "https://www.google.com/maps/dir/?api=1&destination=";//we get the base url for google maps
    let url = _url.parse(req.url,true);//we parse the query 
    console.log(url);
    let query = url.query['routing_location'];//we take the value containing the address
    //we format the string into the format requested by google
    query = query.replace(" " , "+");
    query = query.replace("," , "%2C");
    googleUrl = googleUrl + query;//we combine the two links
    res.redirect(googleUrl);//we redirect the client to google maps
});

module.exports = router;