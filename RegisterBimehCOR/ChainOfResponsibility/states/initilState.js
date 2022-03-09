// const RequestState = require('./requestState');

// const InitialState = function() {
//     RequestState.apply(this, arguments);
//     console.log('InitialState');
//     // InitialState initialization...
// };
// InitialState.prototype = Object.create(RequestState.prototype);
// InitialState.prototype.constructor = InitialState;

// InitialState.prototype.check = function() {
//     console.log('InitialState.check');
// }

// module.exports = InitialState;

const RequestState = require('./requestState');
const msgString = require('../../utils/msgString')
const bimehModel = require('../../models/bimehModel');
const checkCodeMeli = require('../../utils/checkMeliCode')
const ShowBimehState = require('./showBimehState')
const { List } = require('../../../index');

const InitialState = function(requestChecker) {
    RequestState.apply(this, arguments);
    // InitialState initialization...
};
InitialState.prototype = Object.create(RequestState.prototype);
InitialState.prototype.constructor = InitialState;

InitialState.prototype.check = async function(request) {  
    if (request.body[0] === '#'){
        try {
            requestMsg = request.body.replace("#","");
            let params = requestMsg.split("@");
            let codeMeli = params[0].split(",");
            let commands = params[1].split(",");
            let bimeh = await bimehModel.findOne({ meliCode: Number(codeMeli[0])});
            let relBime = bimeh?.relations.find( el => el.meliCode == Number(codeMeli[1]));      
            if(relBime){
                if( relBime[commands[0]] !== undefined) {
                    relBime[commands[0]] = commands[1];
                    await bimeh.save();
                    this.requestChecker.client.sendMessage(request.from, msgString.CusCommandfinished.format());
                }
                else {
                    this.requestChecker.client.sendMessage(request.from, msgString.CusCommandWrongCommand.format());
                }
            }
            else if( codeMeli[1] != '' ) {
                this.requestChecker.client.sendMessage(request.from, msgString.CusCommandRelCodeMeli.format());     
            }
            else if(bimeh) {
                if( bimeh[commands[0]] !== undefined) {
                    bimeh[commands[0]] = commands[1];
                    await bimeh.save();
                    this.requestChecker.client.sendMessage(request.from, msgString.CusCommandfinished.format());
                }
                else {
                    this.requestChecker.client.sendMessage(request.from, msgString.CusCommandWrongCommand.format());
                }            
            }
            else {
                this.requestChecker.client.sendMessage(request.from, msgString.CusCommandCodeMeli.format());
            }
        } catch (error) {
            this.requestChecker.client.sendMessage(request.from, error.message);
        }
        request.finished = true;
        await request.save();
    }
    else if(request.meliCode) {
        this.requestChecker.currentState = new ShowBimehState(this.requestChecker);
        this.requestChecker.ShowBimehState = this.requestChecker.currentState;
        this.requestChecker.currentState.check(request);
    }
    else {
        if(isNaN(request.body)){
            this.requestChecker.client.sendMessage(request.from, msgString.CusIdCodeEnter);
        }
        else {
            let bimeh = await bimehModel.findOne({ meliCode: Number(request.body)});
            if(!bimeh){
                this.requestChecker.client.sendMessage(request.from, msgString.CusIdCodeNotFound.format(request.body));
            }
            else {
                request.meliCode = Number(request.body);
                await request.save();
                this.requestChecker.currentState = new ShowBimehState(this.requestChecker);
                this.requestChecker.ShowBimehState = this.requestChecker.currentState;
                this.requestChecker.currentState.check(request);
            }
        }
    }
}

module.exports = InitialState;