const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  phonenumber: Number,
});

module.exports = mongoose.model('User', UserSchema);

