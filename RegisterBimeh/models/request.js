const mongoose = require('mongoose');

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
  phoneNumber: Number, 
  meliCode: Number, 
  name: String, 
  family: String,
  retCode: Number, 
  workplace: String,
  workplaceCode: Number,
  hasBimeh: Boolean,
  cost: Number,
  finished: Boolean,
  state: String,
  totalCost: Number,
  commands  : [requestCommand]
});
const requestModel = mongoose.model('request', requestSchema);
module.exports = requestModel;