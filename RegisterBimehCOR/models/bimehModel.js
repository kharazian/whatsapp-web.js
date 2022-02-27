const mongoose = require('mongoose');

const relationSchema = new mongoose.Schema({
  name: String, 
  family: String,
  fullName: String,
  sponsorship: String,
  meliCode: Number, 
  fatherName: String,
  birthdayDate: String,
  relation: String,
  cost: Number,
  
  hasBimeh: Boolean,
});

const bimehSchema = new mongoose.Schema ({
  name: String, 
  family: String,
  fatherName: String,
  shNum: String,
  meliCode: Number, 
  birthdayDate: String,
  birthdayPlace: String,
  birthdayIssue: String,
  retCode: Number, 
  cost: Number,
  resBank: String,
  refBank: String,
  workplace: String,
  workplaceCode: Number,
  address: String,
  phoneNumber: Number,
  totalCost: Number,
  signDate: String,

  hasBimeh: Boolean,
  finished: Boolean,
  relations  : [relationSchema]
});
const bimehModel = mongoose.model('bimeh', bimehSchema);
module.exports = bimehModel;