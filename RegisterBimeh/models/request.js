const mongoose = require('mongoose');

const requestCommand = new mongoose.Schema({
  phoneNumber: Number, 
  meliCode: Number, 
  requestState: Number, 
  name: String, 
  family: String,
  relation: String,
  hasBimeh: Boolean,
  cost: Number
});

const requestSchema = new mongoose.Schema ({
  meliCode: Number, 
  name: String, 
  family: String,
  retCode: Number, 
  workplace: String,
  workplaceCode: Number,
  hasBimeh: Boolean,
  cost: Number,
  totalCost: Number,
  relations  : [requestCommand]
});
const requestModel = mongoose.model('request', requestSchema);
module.exports = requestModel;