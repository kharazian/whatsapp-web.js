const { jsPDF } = require("jspdf"); // will automatically load the node version
const fs = require('fs');
const BimehModel = require('../models/bimehModel')

const makePdfReceipt = async function(doc, bimeh){ 
  var bitmap = fs.readFileSync("./RegisterBimehCOR/pdfMaker/bimehReceipt.jpg");
  let imgData = new Buffer(bitmap).toString('base64');
  doc.addImage(imgData, "JPEG", 0, 0, width, height);


  doc.text( bimeh.name + " " + bimeh.family , 170, 40, null, null, "right");

  doc.save("./RegisterBimehCOR/data/"+melicode+"_Receipt.pdf"); // will save the file in the current working directory
}

const makePdfBank = async function(doc, bimeh){ 

  var bitmap = fs.readFileSync("./RegisterBimehCOR/pdfMaker/bimehBank.jpg");
  let imgData = new Buffer(bitmap).toString('base64');
  doc.addImage(imgData, "JPEG", 0, 0, width, height);


  doc.text( bimeh.name + " " + bimeh.family , 170, 40, null, null, "right");

  doc.save("./RegisterBimehCOR/data/"+melicode+"_Bank.pdf"); // will save the file in the current working directory
}

const makePdf = async function(melicode){ 

  let bimeh = await BimehModel.findOne({ meliCode: melicode });
  if( bimeh?.finished ){
      let doc = new jsPDF("p", "mm", "a4");

      doc.addFont("./RegisterBimehCOR/pdfMaker/BTitrBd.ttf", "BTitrBd", "normal");
      doc.addFont("./RegisterBimehCOR/pdfMaker/BZar.ttf", "BZar", "normal");
      doc.setFont("BTitrBd"); // set font
      doc.setFontSize(10);
      makePdfReceip(doc, bimeh);
      makePdfBank(doc, bimeh);
    }
}

module.exports = makePdf;