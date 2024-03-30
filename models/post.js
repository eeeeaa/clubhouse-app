const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  message: { type: String, default: "" },
});

PostSchema.virtual("url").get(function () {
  return `/post/${this._id}`;
});

PostSchema.virtual("created_at_formatted").get(function () {
  return DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Post", PostSchema);
