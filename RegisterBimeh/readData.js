const fs = require('fs');
const config = require('./config')
const initDB = require('./database') 
const bimehModel = require('./models/bimeh') 
const logger = require('./utils/logger')

let dataArray = [];
fs.readFile('./temp.csv', 'utf8', function (err, data) {
    if (err) {
        console.error(err);
        return
      }
    dataArray = data.split(/\r?\n/);  //Be careful if you are in a \r\n world...   
    // 0:'﻿کدملی'
    // 1:'کدپرسنلی'
    // 2:'کدملی'
    // 3:'نام و نام خانوادگی'
    // 4:'نسبت'
    // 5:'شماره حساب'
    // 6:'فعال'
    // 7:'شماره ملي'
    // 8:'عضویت'
    // 9:'نام'
    // 10:'نام خانوادگي'
    // 11:'محل خدمت'
    // 12:'همراه'
    // 13:'کد گروه اشخاص'
    // 14:'شهرداری یا سازمان'     
})

async function startApp() {
    const mongooseConnection = await initDB(config.mongoUri, config.credentials.mongodb);
    
    let currentEmployee = 0;
    let bimeh;
    for (let index = 1; index < dataArray.length; index++) {
        var element = dataArray[index].split(',');
        if(currentEmployee != element[7]){
            currentEmployee = element[7];
            bimeh = new bimehModel({
                meliCode: Number(element[7]), 
                name: element[9], 
                family: element[10],
                retCode: Number(element[8]), 
                workplace: element[11],
                workplaceCode: Number(element[14]),
                hasBimeh: element[6] == "True" ? true : false,
                phoneNumber: Number(element[12]),
                AccountNumber: element[5],
                cost: element[6] == "True" ? 120000 : 0,
                totalCost: element[6] == "True" ? 120000 : 0,
                relations  : []
            });
        }
        else {
            bimeh.relations.push({
                meliCode: Number(element[2]), 
                name: '', 
                family: '',
                fullName: element[3],
                relation: element[4],
                hasBimeh: element[6] == "True" ? true : false,
                cost: element[6] == "True" ? 120000 : 0
              });
            bimeh.totalCost = bimeh.totalCost + (element[6] == "True" ? 120000 : 0);
        }
        bimeh.save(function (err) {
            if (!err) console.log('Success!');
            });

    }   
}

startApp()
.catch((e) => {
  logger.error("Server failed with error:");
  logger.error(e);
  process.exitCode = 1;
});