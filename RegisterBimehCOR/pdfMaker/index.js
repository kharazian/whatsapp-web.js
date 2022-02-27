const { jsPDF } = require("jspdf"); // will automatically load the node version
const fs = require('fs');
const BimehModel = require('../models/bimehModel');
const pdfmodel = require('./pdfModel');

let bitmapReceipt = fs.readFileSync("./RegisterBimehCOR/pdfMaker/bimehReceipt.jpg");
let imgDataReceipt = new Buffer.alloc(bitmapReceipt.length, bitmapReceipt).toString('base64');
let bitmapBank = fs.readFileSync("./RegisterBimehCOR/pdfMaker/bimehBank.jpg");
let imgDataBank = new Buffer.alloc(bitmapBank.length, bitmapBank).toString('base64');

let width = 0;
let height = 0;

const makePdfReceipt = function(doc, bimeh){ 
  doc.addImage(imgDataReceipt, "JPEG", 0, 0, width, height);

  pdfmodel.bimeh.forEach(element => {
    doc.text( element.value , element.x, element.y, null, null, "right");    
  });

  doc.save("./RegisterBimehCOR/data/" + bimeh.meliCode + "_Receipt.pdf"); // will save the file in the current working directory
}

const makePdfBank = function(doc, bimeh){ 

  doc.addImage(imgDataBank, "JPEG", 0, 0, width, height);
  
  pdfmodel.bank.forEach(element => {
    doc.text( element.value , element.x, element.y, null, null, "right");    
  });

  doc.save("./RegisterBimehCOR/data/" + bimeh.meliCode + "_Bank.pdf"); // will save the file in the current working directory
}

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
      makePdfReceipt(doc, bimeh);
      makePdfBank(doc, bimeh);

      doc.addImage(imgDataReceipt, "JPEG", 0, 0, width, height);
      pdfmodel.bimeh.forEach(element => {
        doc.text( element.value , element.x, element.y, null, null, "right");    
      });      

      doc.addPage();
      doc.addImage(imgDataBank, "JPEG", 0, 0, width, height);  
      pdfmodel.bank.forEach(element => {
        doc.text( element.value , element.x, element.y, null, null, "right");    
      });
    
      doc.save("./RegisterBimehCOR/data/" + bimeh.meliCode + ".pdf"); // will save the file in the current working directory
          
    }
}

module.exports = makePdf;