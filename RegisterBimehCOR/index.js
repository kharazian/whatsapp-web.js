const fs = require('fs');
const { Client, Location, List, Buttons, MessageMedia } = require('../index');

const config = require('./config')
const initDB = require('./database') 
const makePdf = require('./pdfMaker/index')
const requestModel = require('./models/requestModel');
const RequestCheker = require('./ChainOfResponsibility/requestChecker');

const SESSION_FILE_PATH = 'session.json';
let sessionCfg;
if (fs.existsSync('./' + SESSION_FILE_PATH)) {
    sessionCfg = require('../' + SESSION_FILE_PATH);
}

const client = new Client({ puppeteer: { headless: false }, session: sessionCfg });

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED', session);
  sessionCfg=session;
  fs.writeFile('./' +SESSION_FILE_PATH, JSON.stringify(session), function (err) {
      if (err) {
        console.error(err);
      }
  });
});

client.on('message', async msg => {
  console.log('MESSAGE RECEIVED', msg);

  // if (msg.body[0] === '*')
  // {
      dispatchMsg(msg);
  // }
});

async function startApp() {
  const mongooseConnection = await initDB(config.mongoUri, config.credentials.mongodb);

  // await makePdf(40076520);
  await client.initialize();
  
  //--------------------
  //        test
  //--------------------
  // msg = {
  //     author: "",
  //     body:"*36550299",
  //     from: "989132672983@c.us",
  //     fromMe: false,
  //     to: "989132672983@c.us",
  //     type: "",
  //     title: "",
  //     description: "",
  //     selectedButtonId: ""
  // }
  // dispatchMsg(msg);

  console.log("SuccessFul");
}

async function dispatchMsg(msg){

  // msg.body = msg.body.replace('*','');
  msg.body = msg.body.numEnglish();
  
  var requestBimeh = await requestModel.findOne({from: msg.from, finished: false})
  if(!requestBimeh){
      requestBimeh = new requestModel({
          dateRequest: Date().toString(),
          from: msg.from,
          meliCode : 0,
          relMeliCode : 0,
          finished : false,
          commands  : []
      });
      await requestBimeh.save();
  }
  requestBimeh.body=  msg.body;
  requestBimeh.btn= msg.selectedButtonId || ""; 
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
      selectedButtonId: msg.selectedButtonId || ""
  });
  await requestBimeh.save();
  let requestCheker = new RequestCheker();
  await requestCheker.check(requestBimeh, client);
}

startApp()
.catch((e) => {
  console.log("Server failed with error:");
  console.log(e);
  process.exitCode = 1;
});