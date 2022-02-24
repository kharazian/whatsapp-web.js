const { jsPDF } = require("jspdf"); // will automatically load the node version
const BimehModel = require('../models/bimehModel')

const makePdf = async function(melicode){
    const doc = new jsPDF();
    doc.addFont("./RegisterBimehCOR/data/BTitrBd.ttf", "BTitrBd", "normal");
    doc.addFont("./RegisterBimehCOR/data/BZar.ttf", "BZar", "normal");
    let bimeh = await BimehModel.findOne({ meliCode: melicode });

    if( bimeh?.finished ){
        var generateData = function(amount) {
            var result = [];
            var data = {
              coin: "100",
              game_group: "GameGroup",
              game_name: "XPTO2",
              game_version: "25",
              machine: "20485861",
              vlt: "0"
            };
            for (var i = 0; i < amount; i += 1) {
              data.id = (i + 1).toString();
              result.push(Object.assign({}, data));
            }
            return result;
          };
          
          function createHeaders(keys) {
            var result = [];
            for (var i = 0; i < keys.length; i += 1) {
              result.push({
                id: keys[i],
                name: keys[i],
                prompt: keys[i],
                width: 65,
                align: "center",
                padding: 0
              });
            }
            return result;
          }
          
          var headers = createHeaders([
            "id",
            "coin",
            "game_group",
            "game_name",
            "game_version",
            "machine",
            "vlt"
          ]);
          doc.viewerPreferences({"Direction" : "R2L"}, true);
          doc.table(1, 100, generateData(10), headers, { autoSize: true });

        doc.text("Hello world!", 10, 10);

        doc.setFont("BTitrBd"); // set font
        doc.setFontSize(10);

        var arabicText = "خط اول هست";

        doc.text( bimeh.name, 100, 60);

        doc.save("./RegisterBimehCOR/data/"+melicode+".pdf"); // will save the file in the current working directory
    }
}

module.exports = makePdf;