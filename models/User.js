const DB = require("mongoose");

const userSchema = new DB.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone1: { type: Number, default: "" },
  phone2: { type: Number, default: "" },
  password: String,
  createdWhen: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },
  address: { type: String, default: "" },
  profileImg: String,
  LGA: String,
  State: String,
});

const User = DB.model("Users", userSchema);

module.exports = User;
