const connectionString =
  "mongodb+srv://admin:admin@cluster0.e5mar42.mongodb.net/?retryWrites=true&w=majority"; //connection string to atlas bd
const mongoDB = require("mongodb"); //import the mongobd module
const mongoClient = mongoDB.MongoClient; //create client, which is used as the interface to interact with the database
const crypt = require("bcrypt"); //used to encrypt passwords before sending to the server and to confront passwords and encrypted passswords to see if they match

exports.signUp = (req, res) => {
  const user = { userName: req.body.userName, password: req.body.password }; // we prepare the data in the format accepted by mongobd
  let connection = mongoClient.connect(connectionString); // we open the connection to the database
  connection.catch((error) => {
    console.log("SERVER CONNECTION ERROR" + error.message);
  });
  connection.then(async (Client) => {
    let collection = Client.db("sitoTurismo").collection("users"); //we access the collection containing the list of users and their passwords
    let result = await collection.findOne({ userName: user.userName });
    if (result) {
      res.render("user", { data: "user already exists" }); //we use render in order to pass data to the page
    } else {
      let hash = crypt.hashSync(user.password, 10);
      collection.insertOne({
        userName: user.userName,
        password: hash,
        hasAccess: "false",
        mail: req.body.mail,
        name: req.body.Name,
        surname: req.body.surName,
      });
      res.render("user", { data: "Registred successfully" });
    }
  });
};

exports.login = (req, res) => {
  const user = { name: req.body.userName, password: req.body.password }; // we prepare the data in the format accepted by mongobd
  let connection = mongoClient.connect(connectionString); // we open the connection to the database
  connection.catch((error) => {
    console.log("SERVER CONNECTION ERROR" + error.message);
  });
  connection.then(async (Client) => {
    //we declare the function async in order to use await when executing the query
    let collection = Client.db("sitoTurismo").collection("users"); //we access the collection containing the list of users and their passwords
    console.log(JSON.stringify(user));
    let result = await collection.findOne({ userName: user.name }); // we use await to wait for the result, if we do not use await the result will be undefined since the function did not have the time to retrieve the data from the db
    if (!result) {
      res.render("user", { data: "username or password invalida" }); //we pass the data to the page using render
    } else {
      let isUser = await crypt.compare(user.password, result.password); //we use await to wait for the results
      console.log(isUser);
      if (isUser == true) {
        let access = result.hasAccess;
        req.session["name"] = result.userName;
        req.session["hasAccess"] = access;
        res.render("user", { data: "benvenuto" });
      } else {
        res.render("user", { data: "username or password invalida" });
      }
    }
  }); //connection then
};

exports.logOut = (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.render("user", { data: "logged out" });
  } else {
    res.render("user", { data: "no data" });
  }
};

exports.page = (req, res) => {
  res.render("user", { data: " " });
};

exports.store = (req, res) => {
  res.render("store", {
    data: { name: req.session["name"], hasAccess: req.session["hasAccess"] },
  });
};

exports.payment = (req, res) => {
  let connection = mongoClient.connect(connectionString);
  connection.catch((error) => {
    console.log(error);
  }); //catch
  connection.then(async (Client) => {
    let db = Client.db("sitoTurismo").collection("users");
    await db.findOneAndUpdate(
      { userName: req.session["name"] },
      { $set: { hasAccess: true } }
    );
    req.session["hasAccess"] = true;
    res.render("user", { data: "Acquisto completato" });
  }); //.then
};

exports.account = (req, res) => {
  if (req.session["name"]) {
    let connection = mongoClient.connect(connectionString); // we open the connection to the database
    connection.catch((error) => {
      console.log("SERVER CONNECTION ERROR" + error.message);
    });
    connection.then(async (Client) => {
      //we declare the function async in order to use await when executing the query
      let collection = Client.db("sitoTurismo").collection("users"); //we access the collection containing the list of users and their passwords
      let result = await collection.findOne({ userName: req.session["name"] }); //name refers to the username saved inside the session, we use await to wait for the result, if we do not use await the result will be undefined since the function did not have the time to retrieve the data from the db
      if (!result) {
        res.render("user", { data: "Login" }); //we pass the data to the page using render
      } else {
        console.log(result);
        res.render("account", {
          data: {
            userName: result.userName,
            name: result.name,
            surname: result.surname,
            mail: result.mail,
            premium: result.hasAccess,
            message: " ",
          },
        });
      }
    });
  } else {
    res.render("user", { data: "please make an account" });
  }
};

exports.modifyPassword = (req, res) => {
  let hash = crypt.hashSync(req.body.password, 10);
  let connection = mongoClient.connect(connectionString);
  connection.catch((error) => {
    console.log(error);
  }); //catch
  connection.then(async (Client) => {
    let db = Client.db("sitoTurismo").collection("users");
    await db.findOneAndUpdate(
      { userName: req.session["name"] },
      { $set: { password: hash } }
    );
    let result = await db.findOne({ userName: req.session["name"] })
    console.log("finished update");
    res.render("account", {
      data: {
        userName: result.userName,
        name: result.name,
        surname: result.surname,
        mail: result.mail,
        premium: result.hasAccess,
        message: "Password modificata",
      },
    });
  }); //.then
};

exports.modifyMail = (req, res) => {
  let connection = mongoClient.connect(connectionString);
  connection.catch((error) => {
    console.log(error);
  }); //catch
  connection.then(async (Client) => {
    let db = Client.db("sitoTurismo").collection("users");
    await db.findOneAndUpdate(
      { userName: req.session["name"] },
      { $set: { mail: req.body.mail } }
    );
     let result = await db.findOne({ userName: req.session["name"] })
    console.log("finished update");
    res.render("account", {
      data: {
        userName: result.userName,
        name: result.name,
        surname: result.surname,
        mail: result.mail,
        premium: result.hasAccess,
        message: "Mail modificata",
      },
    });
  }); //.then
};
