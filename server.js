// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require("dotenv").config();
const express = require("express");
const app = express();
const pug = require("pug");
const bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/Books-Express', {
//   useNewUrlParser: true, 
//   useFindAndModify: false,
//   useCreateIndex: true,
//   useUnifiedTopology: true})
// .then(_ => console.log("MongoDB connected"))
// .catch(err => console.log("MongoDB can't connect", err));
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
})
.then(_ => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB can't connect", err));

var indexRoute = require("./routes/index.route.js");
var authRoute = require("./routes/auth.route.js");
var bookRoute = require("./routes/book.route.js");
var userRoute = require("./routes/user.route.js");
var transactionRoute = require("./routes/transaction.route.js");
var profileRoute = require("./routes/profile.route.js");
var cartRoute = require("./routes/cart.route.js");

var authMiddleware = require("./middlewares/auth.middleware");
var accountMiddleware = require("./middlewares/account.middleware");
var sessionMiddleware = require("./middlewares/session.middleware");
const cartMiddleWare = require("./middlewares/cart.middleware");

app.set("views", "./views");
app.set("view engine", "pug");
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(sessionMiddleware.session);

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));


app.use("/auth", authRoute);
app.use(cartMiddleWare.cart);

app.use("/cart",accountMiddleware.isUser, cartRoute);

app.get(
  "/",
  authMiddleware.requireAuth,
  accountMiddleware.isAdmin,
  indexRoute, 
);
app.use(
  "/books", 
  accountMiddleware.isUser,
  accountMiddleware.isAdmin,
  bookRoute
);
app.use(
  "/profiles",
  authMiddleware.requireAuth,
  accountMiddleware.isAdmin,
  profileRoute
);
app.use(
  "/users",
  authMiddleware.requireAuth,
  accountMiddleware.isAdmin,
  userRoute
);
app.use(
  "/transactions",
  authMiddleware.requireAuth,
  accountMiddleware.isAdmin,
  transactionRoute
);



// listen for requests :)
const listener = app.listen(8080, () => {
  console.log("Your app is listening on port : 8080" );
});
