//used to interact with the mongoDB database

const express = require('express');
const router = express.Router();
const dataController =  require("../controllers/userController")

router.post("/signUp", dataController.signUp);

router.post("/login", dataController.login);

router.get("/logout", dataController.logOut);

router.post("/modify/password",dataController.modifyPassword);

router.post("/modify/mail",dataController.modifyMail);

router.get("/store", dataController.store);

router.post("/payment",dataController.payment);

router.get("/account",dataController.account);

router.get('/LoginPage', dataController.LoginPage);

router.get('/signUpPage', dataController.signUpPage);

module.exports = router;
