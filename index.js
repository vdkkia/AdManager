const express = require("express");
const config = require("config");
const db = require("./api/db/mongo");
const bodyParser = require("body-parser");
const routes = require("./api/routes/");
const Auth = require("./api/controllers/Auth");

const app = express();

const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/static", express.static(__dirname + "/public"));
app.use(Auth.ValidateUser);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const baseURL = config.get("baseURL");
app.use(baseURL, routes);

app.use(function(req, res) {
  res.status(404).json({
    meta: {
      status: 404,
      message: "Not found!"
    }
  });
});

const PORT = process.env.PORT || config.get("PORT");
db.connect()
  .then(() => {
    console.log("DB Connected");
    app.listen(PORT, function() {
      console.log("AdManager API service started on: " + PORT);
    });
  })
  .catch(err => console.log("cannot connect to db", err));

module.exports = app;
