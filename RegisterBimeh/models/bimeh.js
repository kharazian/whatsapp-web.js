const mongoose = require('mongoose');

const relationSchema = new mongoose.Schema({
  meliCode: Number, 
  name: String, 
  family: String,
  fullName: String,
  relation: String,
  hasBimeh: Boolean,
  cost: Number
});

const bimehSchema = new mongoose.Schema ({
  meliCode: Number, 
  name: String, 
  family: String,
  retCode: Number, 
  workplace: String,
  workplaceCode: Number,
  hasBimeh: Boolean,
  phoneNumber: Number,
  AccountNumber: String,
  cost: Number,
  totalCost: Number,
  relations  : [relationSchema]
});
const bimehModel = mongoose.model('bimeh', bimehSchema);
module.exports = bimehModel;