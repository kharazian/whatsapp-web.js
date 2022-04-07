const fs = require('fs');

const config = require('./config')
const initDB = require('./database') 
const bimehModel = require('./models/bimehModel') 


let columns = [
    'file',
    'name', 
    'family',
    'fatherName',
    'shNum',
    'meliCode', 
    'birthdayDate',
    'birthdayPlace',
    'birthdayIssue',
    'retCode', 
    'cost',
    'resBank',
    'refBank',
    'workplace',
    'workplaceCode',
    'address',
    'phoneNumber',
    'totalCost',
    'signDate',
    'hasBimeh',
    'finished',
    'nameRel', 
    'familyRel',
    'fullNameRel',
    'sponsorshipRel',
    'meliCodeRel', 
    'fatherNameRel',
    'birthdayDateRel',
    'relationRel',
    'costRel',
    'hasBimehRel'
];

let writeStream = fs.createWriteStream('./result.csv')

startApp();

async function startApp() {
    const mongooseConnection = await initDB(config.mongoUri, config.credentials.mongodb);
    writeStream.write(columns.join(',')+ '\n', () => {
        // a line was written to stream
    })
    
    let allbimehs = await bimehModel.find({});
    allbimehs.forEach((bimeh, index) => {     
        let newLine = []
        newLine.push(bimeh.file);        
        newLine.push(bimeh.name);
        newLine.push(bimeh.family);
        newLine.push(bimeh.fatherName);
        newLine.push(bimeh.shNum);
        newLine.push(bimeh.meliCode);
        newLine.push(bimeh.birthdayDate);
        newLine.push(bimeh.birthdayPlace);
        newLine.push(bimeh.birthdayIssue);
        newLine.push(bimeh.retCode);
        newLine.push(bimeh.cost);
        newLine.push(bimeh.resBank);
        newLine.push(bimeh.refBank);
        newLine.push(bimeh.workplace);
        newLine.push(bimeh.workplaceCode);
        newLine.push(bimeh.address);
        newLine.push(bimeh.phoneNumber);
        newLine.push(bimeh.totalCost);
        newLine.push(bimeh.signDate);
        newLine.push(bimeh.hasBimeh);
        newLine.push(bimeh.finished);

        newLine.push('');
        newLine.push('');
        newLine.push(bimeh.name + ' ' + bimeh.family);
        newLine.push('بلی');
        newLine.push(bimeh.meliCode);
        newLine.push(bimeh.fatherName);
        newLine.push(bimeh.birthdayDate);
        newLine.push('اصلی');
        newLine.push(bimeh.cost);
        newLine.push(bimeh.hasBimeh);
    
        writeStream.write(newLine.join(',')+ '\n', () => {
            // a line was written to stream
        });

        bimeh.relations.forEach((relBimeh, index) => {
            newLine[21] = relBimeh.name;
            newLine[22] = relBimeh.family;
            newLine[23] = relBimeh.fullName;
            newLine[24] = relBimeh.sponsorship;
            newLine[25] = relBimeh.meliCode;
            newLine[26] = relBimeh.fatherName;
            newLine[27] = relBimeh.birthdayDate;
            newLine[28] = relBimeh.relation;
            newLine[29] = relBimeh.cost;
            newLine[30] = relBimeh.hasBimeh;
            writeStream.write(newLine.join(',')+ '\n', () => {
                // a line was written to stream
            });
        });
    })
    
    writeStream.end()
    
    writeStream.on('finish', () => {
        console.log('finish write stream, moving along')
    }).on('error', (err) => {
        console.log(err)
    })

}