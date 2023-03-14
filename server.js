/* TO DO
    -div pagamento css - V
    -sistema di "pagamento" che modifichi la proprietà has access - V 
    -bloccare pagamento se è gia stato comprato - V
    -area account
    -chat room per ogni città
    -calendario eventi
    -separare login e signup + interfaccia
    -pulire codice + semplificare e rimuovere ridondanze
*/

//-------------------------express-------------------------------//
const express = require('express');
const app = express();
const path = require('path');
//----------------------used for routes--------------------------------//
const cityRouter = require('./routes/city');
const gpsRouter = require('./routes/gps');
const userRouter = require('./routes/user');
//-----------------------session---------------------------------//
const session = require('express-session');
const cookieParser = require('cookie-parser'); //used to read cookie headers
const sessionSecret = "Ie:k*pcG6MNE<!u%%4Rml4(D9g_=YN";
const {v4: uuidv4} = require('uuid');//used to generate a random id for the session, v4 => random 
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({// we prepare the connection to the db that will store the sessions
    uri: "mongodb+srv://admin:admin@cluster0.e5mar42.mongodb.net/?retryWrites=true&w=majority",
    collection: 'sessions'
});


app.use(cookieParser());
app.use(session({
    secret: sessionSecret, //used to hash the session id
    resave: false, //indicates if the session needs to be saved even if we don't modify the cookie
    saveUninitialized: true, //indicates if we need to save an unitialized session, a new session that hasn't been modified yet, we set it to true to be able to recognise returning users
    unset: 'destroy',//indicates the result of unsetting a session, destroy => the session is deleted
    store: store, //indicates the db where we will save the session
    name: 'art & Culture', //cookie name
    genid: (req) => {
        return uuidv4();
    }
}));

app.get('/testsession', (req,res) =>{
    console.log(req.session);
    res.send(req.session);
})


app.use(express.static(__dirname + '/public'));//makes it so the base path will always include public in it, allowing us to access the files inside the html pages
app.use(express.json());//allows us to read post parameters both in json format and in URL-Encoded 
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');


app.use('/user' , userRouter);//the user resource contains both login and signup modules 
app.use('/city' , cityRouter);//makes it so every url containing the /city path is managed by the router
app.use('/routing', gpsRouter);
app.get('/', (req, res)=>{
    res.render("index");
});


app.listen(3000);