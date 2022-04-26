const fs = require('fs');
const config = require('./config')
const initDB = require('./database') 
const bimehModel = require('./models/bimehModel') 

startApp()
    .catch((e) => {
    console.error("Server failed with error:");
    console.error(e);
    process.exitCode = 1
    });

async function startApp() {
    const mongooseConnection = await initDB(config.mongoUri, config.credentials.mongodb);
    bimehs = await bimehModel.find({ })
    // bimeh = await bimehModel.findOne({ meliCode: 40076520 })
    bimehs.forEach( async bimeh => {
        if(bimeh && bimeh.relations.find(obj => obj.relation == "خود شخص" )){
            bimeh.relations.remove(bimeh.relations.find(obj => obj.relation == "خود شخص" ));
            await bimeh.save();
        }
        
    });
}