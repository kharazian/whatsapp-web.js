const fs = require('fs');
const config = require('./config')
const initDB = require('./database') 
const bimehModel = require('./models/bimehModel') 
const logger = require('./utils/logger')

let dataArray = [];
fs.readFile('./temp.csv', 'utf8', function (err, data) {
    if (err) {
        console.error(err);
        return
      }
    dataArray = data.split(/\r?\n/);  //Be careful if you are in a \r\n world... 
    startApp()
        .catch((e) => {
        logger.error("Server failed with error:");
        logger.error(e);
        process.exitCode = 1;
        });  
})

async function addBimeh(element) {
    bimeh = await bimehModel.findOne({ meliCode: Number(element[5]) })
    if(!bimeh){
        bimeh = new bimehModel({
            file:               element[0],             //String,
            name:               element[1],             //String, 
            family:             element[2],             //String,
            fatherName:         element[3],             //String,
            shNum:              element[4],             //String,
            meliCode:           Number(element[5]),     //Number, 
            birthdayDate:       element[6],             //String,
            birthdayPlace:      element[7],             //String,
            birthdayIssue:      element[8],             //String,
            retCode:            Number(element[9]),     //Number, 
            cost:               Number(element[10]),    //Number,
            resBank:            element[11],            //String,
            refBank:            element[12],            //String,
            workplace:          element[13],            //String,
            workplaceCode:      Number(element[14]),    //Number,
            address:            element[15],            //String,
            phoneNumber:        Number(element[16]),    //Number,
            totalCost:          Number(element[17]),    //Number,
            signDate:           "",                     //String,
          
            hasBimeh:           element[19] == "TRUE" ? true : false,//    Boolean,
            finished:           false,                  //Boolean,

            relations  : []
        });
    }
    if( element[28] != "خودشخص"){
        bimeh.relations.push({
            name:           element[21],                // String, 
            family:         element[22],                // String,
            fullName:       element[23],                // String,
            sponsorship:    element[24],                // String,
            meliCode:       Number(element[25]),        // Number, 
            fatherName:     element[26],                // String,
            birthdayDate:   element[27],                // String,
            relation:       element[28],                // String,
            cost:           Number(element[29]),        // Number,
            
            hasBimeh:       element[30] == "TRUE" ? true : false,//  Boolean,

          });
    }
    else {
        bimeh.cost = Number(element[29]);
    }
    await bimeh.save();
}

async function startApp() {
    const mongooseConnection = await initDB(config.mongoUri, config.credentials.mongodb);

    let bimeh;
    for (let index = 1; index < dataArray.length; index++) {
        if( dataArray[index] != '') {
            var element = dataArray[index].split(',');
            try {
                await addBimeh(element);                
                console.log( 'Success! ' + element[5].padStart(10,"0") + " - " + element[25].padStart(10,"0"));            
            } catch (error) {
                console.log( 'Falied  !' + element[5].padStart(10,"0") + " - " + element[25].padStart(10,"0"));            
            }
        }
    }   
}