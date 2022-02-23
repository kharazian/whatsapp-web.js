const fs = require('fs');
const { Client, Buttons, MessageMedia } = require('../index');

const config = require('./config')
const initDB = require('./database') 
const bimehModel = require('./models/bimeh')  
const requestModel = require('./models/request')  
const enums = require('./models/enum')
// const logger = require('./utils/logger')
const msgString = require('./utils/msgString')
const checkCodeMeli = require('./utils/checkMeliCode')

const SESSION_FILE_PATH = 'session.json';
let sessionCfg;
if (fs.existsSync('./' + SESSION_FILE_PATH)) {
    sessionCfg = require('../' + SESSION_FILE_PATH);
}
const client = new Client({ puppeteer: { headless: false }, session: sessionCfg });
async function startApp() {
    const mongooseConnection = await initDB(config.mongoUri, config.credentials.mongodb);


    client.initialize();


    client.on('message', async msg => {
        console.log('MESSAGE RECEIVED', msg);

        if (msg.body[0] === '*')
        {
            dispatchMsg(msg);
        }
    });
}

async function dispatchMsg(msg){
    msg.body = msg.body.replace('*','');
    msg.body = msg.body.replace(' ','');
    var requestBimeh = await requestModel.findOne({phoneNumber: msg.from.replace('@c.us',''), finished: false})
    if(!requestBimeh){
        requestBimeh = new requestModel({
            dateRequest: Date().toString(),
            phoneNumber: msg.from.replace('@c.us',''),
            meliCode : 0,
            relMeliCode : 0,
            finished : false,
            state: enums.state.Initial,
            commands  : []
        });
        await requestBimeh.save();
    }
    requestBimeh.commands.push({
        dateRequest: Date().toString(),
        author: msg.author,
        body: msg.body,
        from: msg.from,
        fromMe: msg.fromMe,
        to: msg.to,
        type: msg.type,
        title: msg.title,
        description: msg.description,
        selectedButtonId: msg.selectedButtonId
    });
    await requestBimeh.save();
    var bimeh;
    if(requestBimeh.meliCode == 0) {
        if(!checkCodeMeli(msg.body)){
            // Send a new message as a reply to the current one            
            client.sendMessage(msg.from, msgString.CusIdCodeEnter);
            return false;
        }
        bimeh = await bimehModel.findOne({ meliCode: msg.body});
        if(!bimeh){
            client.sendMessage(msg.from, msgString.CusIdCodeNotFound.format( msg.body));
            return false;            
        }
        else if(bimeh.finished) {
            requestBimeh.meliCode = Number(msg.body);
            requestBimeh.state = enums.state.Confirm;
            await requestBimeh.save();
            ShowConfirm(msg, bimeh);         
        }
        else {
            requestBimeh.meliCode = Number(msg.body);
            requestBimeh.state = enums.state.ShowInvoice;
            await requestBimeh.save();
            ShowMenu(msg, bimeh);
        }
    }
    else {        
        bimeh = await bimehModel.findOne({ meliCode: requestBimeh.meliCode});
        switch(requestBimeh.state) {
            // ------------------------------------------------------------------------------------------------
            case enums.state.ShowInvoice:
                if(msg.selectedButtonId == 'CusShowInvoiceBtnEnableAll') {
                    bimeh.hasBimeh = true;
                    bimeh.cost = bimeh.workplaceCode == 1 ? 6000000 : 14400000;
                    bimeh.totalCost = bimeh.workplaceCode == 1 ? 6000000 : 14400000;
                    await bimeh.save();
                    ShowMenu(msg, bimeh);
                    return false;            
                }
                else if(msg.selectedButtonId == 'CusShowInvoiceBtnDisableAll') {                    
                    bimeh.hasBimeh = false;
                    bimeh.cost = 0;
                    bimeh.totalCost = 0;
                    bimeh.relations.forEach(element => {
                        element.hasBimeh = false;
                        element.cost = 0;
                    });
                    await bimeh.save();
                    ShowMenu(msg, bimeh);
                    return false;            
                }
                else if(msg.selectedButtonId == 'CusShowInvoiceBtnEditRel') {  
                    requestBimeh.state = enums.state.ShowRelation;
                    await requestBimeh.save();
                    client.sendMessage(msg.from, msgString.ReCusIdCodeEnter);
                    return false;            
                }
                else if(msg.selectedButtonId == 'CusShowInvoiceBtnConfirm') {
                    requestBimeh.state = enums.state.Confirm;
                    await requestBimeh.save();
                    bimeh.finished = true;
                    await bimeh.save();
                    ShowConfirm(msg, bimeh);
                    return false;            
                }
                if(bimeh.finished){
                    ShowConfirm(msg, bimeh);
                }
                else {
                    ShowMenu(msg, bimeh);
                }
              break;

            // ------------------------------------------------------------------------------------------------
            case enums.state.ShowRelation:
                if(requestBimeh.relMeliCode == 0) {
                    if(isNaN(msg.body)){
                        client.sendMessage(msg.from, msgString.CusIdCodeNotFound.format( msg.body));
                        return false;            
                    }
                    relBimeh = await bimeh.relations.find(el => el.meliCode === Number(msg.body));
                    if(!relBimeh){
                        client.sendMessage(msg.from, msgString.CusIdCodeNotFound.format( msg.body));
                        return false;            
                    }
                    else {
                        requestBimeh.relMeliCode = Number(msg.body);
                        await requestBimeh.save();
                        ShowRel(msg, relBimeh);
                        return false;            
                    }
                }
                else if(msg.selectedButtonId == 'CusShowInvoiceBtnEnableRel') {
                    relBimeh = bimeh.relations.find(el => el.meliCode === requestBimeh.relMeliCode)
                    relBimeh.hasBimeh = true;
                    relBimeh.cost = 14400000;
                    bimeh.totalCost = bimeh.totalCost + 14400000;
                    await bimeh.save();               
                    requestBimeh.state = enums.state.ShowInvoice;
                    requestBimeh.relMeliCode = 0;
                    await requestBimeh.save();
                    ShowMenu(msg, bimeh);
                    return false;            
                }
                else if(msg.selectedButtonId == 'CusShowInvoiceBtnDisableRel') { 
                    relBimeh = bimeh.relations.find(el => el.meliCode === requestBimeh.relMeliCode)                  
                    relBimeh.hasBimeh = false;
                    relBimeh.cost = 0;
                    bimeh.totalCost = bimeh.totalCost - 14400000;
                    await bimeh.save();               
                    requestBimeh.state = enums.state.ShowInvoice;
                    requestBimeh.relMeliCode = 0;
                    await requestBimeh.save();
                    ShowMenu(msg, bimeh);
                    return false;            
                }
                else if(msg.selectedButtonId == 'CusShowInvoiceBtnRetuen') {            
                    requestBimeh.state = enums.state.ShowInvoice;
                    requestBimeh.relMeliCode = 0;
                    await requestBimeh.save();
                    ShowMain(msg, bimeh);
                    return false;            
                }
                relBimeh = await bimeh.relations.find(el => el.meliCode === requestBimeh.relMeliCode);
                ShowRel(msg, relBimeh);
            break;

            // ------------------------------------------------------------------------------------------------
            case enums.state.Confirm:              
                if(msg.selectedButtonId == 'CusShowInvoiceBtnPrint') { 
                    printBimeh(msg, bimeh);
                    return false;            
                }
                else if(msg.selectedButtonId == 'CusShowInvoiceBtnClose') {            
                    requestBimeh.state = enums.state.Finished;
                    requestBimeh.finished = true;
                    await requestBimeh.save();
                    return false;            
                }
                ShowConfirm(msg, bimeh);
              break;

            // ------------------------------------------------------------------------------------------------
            default:
                console.log('Not Supported');
          }
    }

}

const printBimeh = function(msg, bimeh){
    const media = MessageMedia.fromFilePath('./a.pdf');
    client.sendMessage(msg.from, media);
}

const ShowConfirm = function(msg, bimeh) {
    let btns = [];
    btns.push({id: 'CusShowInvoiceBtnPrint', body: msgString.CusShowInvoiceBtnPrint});
    btns.push({id: 'CusShowInvoiceBtnClose', body: msgString.CusShowInvoiceBtnClose});
    
    let button = new Buttons(
        bimeh.relations.reduce(( pValue, cValue) => {
            return msgString.CusShowInvoiceBody.format(pValue.relation, pValue.meliCode, pValue.fullName, msgString.EnableOrDisbale(pValue.hasBimeh), pValue.cost) + 
            msgString.CusShowInvoiceBody.format(cValue.relation, cValue.meliCode, cValue.fullName, msgString.EnableOrDisbale(cValue.hasBimeh), cValue.cost);
        }),
        btns,
        msgString.CusShowInvoiceTitle.format(bimeh.meliCode, bimeh.name, bimeh.family, msgString.EnableOrDisbale(bimeh.hasBimeh), bimeh.cost),
        msgString.CusShowInvoiceFooter.format(bimeh.totalCost));
    client.sendMessage(msg.from, button);
}


const ShowRel = async function(msg, relBimeh){
    let btns = [];
    if(relBimeh.hasBimeh) {
        btns.push({id: 'CusShowInvoiceBtnDisableRel', body: msgString.CusShowInvoiceBtnDisableRel});
        btns.push({id: 'CusShowInvoiceBtnRetuen', body: msgString.CusShowInvoiceBtnRetuen});
    }
    else {        
        btns.push({id: 'CusShowInvoiceBtnEnableRel', body: msgString.CusShowInvoiceBtnEnableRel});
        btns.push({id: 'CusShowInvoiceBtnRetuen', body: msgString.CusShowInvoiceBtnRetuen});
    }
    let button = new Buttons(
        msgString.CusShowRelBody.format(relBimeh.relation, relBimeh.meliCode, relBimeh.fullName, msgString.EnableOrDisbale(relBimeh.hasBimeh), relBimeh.cost),
        btns,
        msgString.CusShowRelTitle.format(relBimeh.relation, relBimeh.meliCode, relBimeh.fullName),
        msgString.CusShowRelFooter.format(relBimeh.cost));
    client.sendMessage(msg.from, button);
}

const ShowMenu = function(msg, bimeh) {
    let btns = [];
    if(bimeh.hasBimeh) {
        btns.push({id: 'CusShowInvoiceBtnDisableAll', body: msgString.CusShowInvoiceBtnDisableAll});
        btns.push({id: 'CusShowInvoiceBtnEditRel', body: msgString.CusShowInvoiceBtnEditRel});
        btns.push({id: 'CusShowInvoiceBtnConfirm', body: msgString.CusShowInvoiceBtnConfirm});
    }
    else {        
        btns.push({id: 'CusShowInvoiceBtnEnableAll', body: msgString.CusShowInvoiceBtnEnableAll});
    }
    let button = new Buttons(
        bimeh.relations.reduce(( pValue, cValue) => {
            return msgString.CusShowInvoiceBody.format(pValue.relation, pValue.meliCode, pValue.fullName, msgString.EnableOrDisbale(pValue.hasBimeh), pValue.cost) + 
            msgString.CusShowInvoiceBody.format(cValue.relation, cValue.meliCode, cValue.fullName, msgString.EnableOrDisbale(cValue.hasBimeh), cValue.cost);
        }),
        btns,
        msgString.CusShowInvoiceTitle.format(bimeh.meliCode, bimeh.name, bimeh.family, msgString.EnableOrDisbale(bimeh.hasBimeh), bimeh.cost),
        msgString.CusShowInvoiceFooter.format(bimeh.totalCost));
    client.sendMessage(msg.from, button);
}

startApp()
.catch((e) => {
//   logger.error("Server failed with error:");
//   logger.error(e);
  console.log("Server failed with error:");
  console.log(e);
  process.exitCode = 1;
});