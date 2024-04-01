const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  member_status: {
    type: String,
    required: true,
    enum: ["Guest", "Member", "Admin"],
    default: "Guest",
  },
});

UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

UserSchema.virtual("full_name").get(function () {
  const first = undefined === this.first_name ? "" : this.first_name;
  const last = undefined === this.last_name ? "" : this.last_name;
  return `${last}, ${first}`;
});

UserSchema.virtual("is_member").get(function () {
  if (this.member_status === "Member" || this.member_status === "Admin") {
    return true;
  }
  return false;
});

UserSchema.virtual("is_admin").get(function () {
  if (this.member_status === "Admin") {
    return true;
  }
  return false;
});

module.exports = mongoose.model("User", UserSchema);
