// Require mongoose module
const mongoose = require("mongoose");

// Grabbing needed things
let Schema = mongoose.Schema;

// Create a schema for each user (An instance of Schema)
let UserSchema = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  password2: String,  
  phonenumber: Number,
  Registered: {type: Date, default: Date.now}
});

// Schema is useless so far, we need to create a model using it
// Create a model using created schema and make it available to User in node application
module.exports = mongoose.model('User', UserSchema);

