const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  message: { type: String, default: "" },
});

module.exports = mongoose.model("Post", PostSchema);
