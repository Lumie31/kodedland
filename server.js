// Require needed modules and files...
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const routes = require("./routes");

// Declare/Assign port 
const PORT = 8800;

mongoose.Promise = global.Promise;

// Connect to mongoDB database for data storage
let db = mongoose
  .connect("mongodb://kodedland:kodedland@ds125113.mlab.com:25113/kodedland")
  .then(() => {
    console.log("Database successfully connected");
  })
  .catch(err => {
    console.log(err);
  });

const app = express();

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Express Middleware
app.use(express.static(path.join(__dirname, "assets")));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use("/", routes);

// This allows for listening on PORT
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
