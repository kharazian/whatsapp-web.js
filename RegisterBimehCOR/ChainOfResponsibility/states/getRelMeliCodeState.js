const RequestState = require('./requestState');
const msgString = require('../../utils/msgString')
const bimehModel = require('../../models/bimehModel');
const checkCodeMeli = require('../../utils/checkMeliCode')
const ShowBimehState = require('./showBimehState')
const ShowRelBimehState = require('./showRelBimehState')

const GetRelMeliCodeState = function(requestChecker) {
    RequestState.apply(this, arguments);
    // GetRelMeliCodeState initialization...
};
GetRelMeliCodeState.prototype = Object.create(RequestState.prototype);
GetRelMeliCodeState.prototype.constructor = GetRelMeliCodeState;

GetRelMeliCodeState.prototype.check = async function(request) {
    if(request.relMeliCode > 0) {
        this.requestChecker.currentState = new ShowRelBimehState(this.requestChecker);
        this.requestChecker.currentState.check(request);
    }
    else {
        if(isNaN(request.body)){
            this.requestChecker.client.sendMessage(request.from, msgString.ReCusIdCodeEnter);
        }
        else {
            let bimeh = await bimehModel.findOne({ meliCode: Number(request.meliCode)});
            let relBimeh = bimeh.relations.find(el => el.meliCode === Number(request.body));
            if(!relBimeh){
                this.requestChecker.client.sendMessage(request.from, msgString.CusIdCodeNotFound.format(request.body));
            }
            else {
                request.relMeliCode = Number(request.body);
                await request.save();
                this.requestChecker.currentState = new ShowRelBimehState(this.requestChecker);
                this.requestChecker.currentState.check(request);
            }
        }
    }
}

module.exports = GetRelMeliCodeState;