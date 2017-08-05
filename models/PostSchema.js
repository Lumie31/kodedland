// Require mongoose module
const mongoose = require("mongoose");

let Schema = mongoose.Schema;

// Create a schema for each post
let PostSchema = new Schema({
  title: String,
  author: String,
  content: String,
  created: { type: Date, default: Date.now },
  tags: [String],
  comments: [
    {
      user: String,
      created: { type: Date, default: Date.now },
      content: String
    }
  ],
  votes: { type: Number, default: 0 },
  imagelink: String,
});

// Schema is useless so far, we need to create a model using it
// Create a model using created schema and make it available to Post in node application
module.exports = mongoose.model('Post', PostSchema);

