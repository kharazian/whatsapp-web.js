const mongoose = require('mongoose');
const { string } = require('sharp/lib/is');

const requestCommand = new mongoose.Schema({
  dateRequest: String,
  author: String,
  body: String,
  from: String,
  fromMe: Boolean,
  to: String,
  type: String,
  title: String,
  description: String,
  selectedButtonId: String,
});

const requestSchema = new mongoose.Schema ({
  dateRequest: String,
  from: String, 
  body: String, 
  btn: String, 
  meliCode: Number, 
  relMeliCode: Number, 
  finished: Boolean,
  state: String,
  commands  : [requestCommand]
});
const requestModel = mongoose.model('request', requestSchema);
module.exports = requestModel;