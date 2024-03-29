const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  is_member: { type: Boolean, default: false },
});

UserSchema.virtual("full_name").get(function () {
  const first = undefined === this.first_name ? "" : this.first_name;
  const last = undefined === this.last_name ? "" : this.last_name;
  return `${last}, ${first}`;
});

module.exports = mongoose.model("User", UserSchema);
