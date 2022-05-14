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
        bimeh.cost = bimeh.hasBimeh ? (bimeh.workplaceCode == 1 ? 6000000 : 14400000) : 0;
        let sumCost = bimeh.cost;
        bimeh.relations.forEach(el => {
            el.cost = el.hasBimeh ? 14400000 : 0;
            sumCost = sumCost + el.cost;
        });
        bimeh.totalCost = sumCost;
        await bimeh.save();

        // if(bimeh && bimeh.relations.find(obj => obj.relation == "خود شخص" )){
        //     bimeh.relations.remove(bimeh.relations.find(obj => obj.relation == "خود شخص" ));
        //     await bimeh.save();
        // }
        
    });
    console.log("finished");
}