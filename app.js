var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
require("dotenv").config();

var app = express();

//Models
const UserModel = require("./model/User");

//Database Connection
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.on("error", (error) => console.log(error));
mongoose.Promise = global.Promise;

//Authentication base
require("./auth/auth");

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
const userSecureRoute = require("./routes/users-secure-routes/secure-routes");
const fileSecureRoute = require("./routes/file-secure-routes/secure-routes");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Routes Use
app.use("/", indexRouter);
app.use("/auth", authRouter);
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use("/user", passport.authenticate("jwt", { session: false }), userSecureRoute);
app.use("/file", passport.authenticate("jwt", { session: false }), fileSecureRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
