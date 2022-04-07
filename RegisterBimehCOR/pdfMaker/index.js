const { jsPDF } = require("jspdf"); // will automatically load the node version
const fs = require('fs');
const BimehModel = require('../models/bimehModel');
const pdfmodel = require('./pdfModel');
const utils = require('../utils/util')

let bitmapReceipt = fs.readFileSync("./RegisterBimehCOR/pdfMaker/bimehReceipt.jpg");
let imgDataReceipt = new Buffer.alloc(bitmapReceipt.length, bitmapReceipt).toString('base64');
let bitmapBank = fs.readFileSync("./RegisterBimehCOR/pdfMaker/bimehBank.jpg");
let imgDataBank = new Buffer.alloc(bitmapBank.length, bitmapBank).toString('base64');

let width = 0;
let height = 0;

const makePdf = async function(melicode){ 

  let bimeh = await BimehModel.findOne({ meliCode: melicode });
  if( bimeh?.finished ){
      let doc = new jsPDF("p", "mm", "a4");

      width = doc.internal.pageSize.getWidth();
      height = doc.internal.pageSize.getHeight();

      doc.addFont("./RegisterBimehCOR/pdfMaker/BTitrBd.ttf", "BTitrBd", "normal");
      doc.addFont("./RegisterBimehCOR/pdfMaker/BZar.ttf", "BZar", "normal");
      doc.setFont("BTitrBd"); // set font
      doc.setFontSize(10);

      let pdfBimeh = [];
      let pdfBank = [];

      pdfmodel.bimeh.forEach(element => {
        pdfBimeh.push( Object.assign({}, element));
      });
      pdfmodel.bank.forEach(element => {
        pdfBank.push( Object.assign({}, element));
      });  

      pdfBimeh.forEach(element => {
        element.value = bimeh[element.id] ? bimeh[element.id].toString() : element.value;
      });
      pdfBank.forEach(element => {
        element.value = bimeh[element.id] ? bimeh[element.id].toString() : element.value;
      });      
      pdfBimeh.find(obj => obj.id == "fullName" ).value = bimeh.name + " " + bimeh.family;
      pdfBimeh.find(obj => obj.id == "cost" ).value = bimeh.cost.numSeparator();
      pdfBimeh.find(obj => obj.id == "totalCost" ).value = bimeh.totalCost.numSeparator();

      pdfBank.find(obj => obj.id == "fullName" ).value = bimeh.name + " " + bimeh.family;
      pdfBank.find(obj => obj.id == "totalCostBank" ).value = (bimeh.totalCost + 600000).numSeparator();
      pdfBank.find(obj => obj.id == "eachInstallments" ).value = Math.ceil((bimeh.totalCost + 600000)/11).numSeparator();

      let pdfIndex = 1;
      for (let index = 0; index < bimeh.relations.length; index++) {
        const element = bimeh.relations[index];
        if( element.hasBimeh && index < 5){
          pdfBimeh.find(obj => obj.id == "fullName" + pdfIndex ).value = element.fullName;
          pdfBimeh.find(obj => obj.id == "sponsorship" + pdfIndex ).value = element.sponsorship;
          pdfBimeh.find(obj => obj.id == "meliCode" + pdfIndex ).value = element.meliCode.toString(); 
          pdfBimeh.find(obj => obj.id == "fatherName" + pdfIndex ).value = element.fatherName;
          pdfBimeh.find(obj => obj.id == "birthdayDate" + pdfIndex ).value = element.birthdayDate;
          pdfBimeh.find(obj => obj.id == "relation" + pdfIndex ).value = element.relation;
          pdfBimeh.find(obj => obj.id == "cost" + pdfIndex ).value = element.cost.numSeparator();
          pdfIndex++;
        }
      }
      for (let index = pdfIndex; index < 6; index++) {
        pdfBimeh.find(obj => obj.id == "fullName" + index ).value = "";
        pdfBimeh.find(obj => obj.id == "sponsorship" + index ).value = "";
        pdfBimeh.find(obj => obj.id == "meliCode" + index ).value = ""; 
        pdfBimeh.find(obj => obj.id == "fatherName" + index ).value = "";
        pdfBimeh.find(obj => obj.id == "birthdayDate" + index ).value = "";
        pdfBimeh.find(obj => obj.id == "relation" + index ).value = "";
        pdfBimeh.find(obj => obj.id == "cost" + index ).value = "";
        
      }

      doc.addImage(imgDataReceipt, "JPEG", 0, 0, width, height);
      pdfBimeh.forEach(element => {
        doc.text( element.value , element.x, element.y, null, null, "right");    
      });      

      doc.addPage();
      doc.addImage(imgDataBank, "JPEG", 0, 0, width, height);  
      pdfBank.forEach(element => {
        doc.text( element.value  , element.x, element.y, null, null, "right");    
      });
    
      doc.save("./RegisterBimehCOR/data/" + bimeh.meliCode + ".pdf"); // will save the file in the current working directory
          
    }
}

module.exports = makePdf;