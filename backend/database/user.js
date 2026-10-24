let mongoose = require("mongoose");
let Schema = new mongoose.Schema({
  role: String,
  email: String,
  phone: String,
  uuid: String,
  picture: String,
  name: String,
  specialty: String,
  ip: String,
});
let User = mongoose.model("User", Schema);
module.exports = User;
