const RequestState = require('./requestState');
const msgString = require('../../utils/msgString')
const bimehModel = require('../../models/bimehModel');
const checkCodeMeli = require('../../utils/checkMeliCode')
const ShowBimehState = require('./showBimehState')
const ShowRelBimehState = require('./showRelBimehState')
const { Buttons } = require('../../../index');

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
        if(request.btn == '') {
            if(isNaN(request.body)){
                let btns = [];
                btns.push({id: 'CusShowInvoiceBtnRetuen', body: msgString.CusShowInvoiceBtnRetuen});
                let button = new Buttons(
                    msgString.ReCusIdCodeEnter,
                    btns,
                    msgString.CusShowInvoiceBtnEditRel,
                    "---");
                this.requestChecker.client.sendMessage(request.from, button);   
            }
            else {
                let bimeh = await bimehModel.findOne({ meliCode: Number(request.meliCode)});
                let relBimeh = bimeh.relations.find(el => el.meliCode === Number(request.body));
                if(!relBimeh){
                    let btns = [];
                    btns.push({id: 'CusShowInvoiceBtnRetuen', body: msgString.CusShowInvoiceBtnRetuen});
                    let button = new Buttons(
                        msgString.CusIdCodeNotFound.format(request.body),
                        btns,
                        msgString.CusShowInvoiceBtnEditRel,
                        "---");
                    this.requestChecker.client.sendMessage(request.from, button);
                }
                else {
                    request.relMeliCode = Number(request.body);
                    await request.save();
                    this.requestChecker.currentState = new ShowRelBimehState(this.requestChecker);
                    this.requestChecker.currentState.check(request);
                }
            }   
        }
        else if(request.btn == 'CusShowInvoiceBtnRetuen') {
            request.relMeliCode = 0;
            request.btn = "";
            await request.save();
            this.requestChecker.ShowBimehState.check(request);
        }
    }
}

module.exports = GetRelMeliCodeState;