const RequestState = require('./requestState');
const msgString = require('../../utils/msgString')
const bimehModel = require('../../models/bimehModel');
const { Buttons } = require('../../../index');
const ShowConfirmState = require('./showConfirmState')
const GetRelMeliCodeState = require('./getRelMeliCodeState')
const ShowRelBimehState = require('./showRelBimehState')



const ShowBimehState = function() {
    RequestState.apply(this, arguments);
    // ShowBimehState ShowMenulization...
};
ShowBimehState.prototype = Object.create(RequestState.prototype);
ShowBimehState.prototype.constructor = ShowBimehState;

ShowBimehState.prototype.check = async function(request) {
    let bimeh = await bimehModel.findOne({ meliCode: request.meliCode});
    if(bimeh.finished) {
        this.requestChecker.currentState = new ShowConfirmState(this.requestChecker);
        this.requestChecker.currentState.check(request);         
    }
    else if(request.relMeliCode == -1) {
        this.requestChecker.currentState = new GetRelMeliCodeState(this.requestChecker);
        this.requestChecker.currentState.check(request);        
    }
    else if(request.relMeliCode) {
        this.requestChecker.currentState = new ShowRelBimehState(this.requestChecker);
        this.requestChecker.currentState.check(request);         
    }
    else if(request.btn == '') {
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
        this.requestChecker.client.sendMessage(request.from, button);        
    }
    else if(request.btn == 'CusShowInvoiceBtnDisableAll') { 
        bimeh.hasBimeh = false;
        bimeh.cost = 0;
        bimeh.totalCost = 0;
        bimeh.relations.forEach(element => {
            element.hasBimeh = false;
            element.cost = 0;
        });
        await bimeh.save();
        request.btn = "";
        await request.save();
        this.requestChecker.currentState = new ShowBimehState(this.requestChecker);
        this.requestChecker.currentState.check(request);
    }
    else if(request.btn == 'CusShowInvoiceBtnEnableAll') {         
        bimeh.hasBimeh = true;
        bimeh.cost = bimeh.workplaceCode == 1 ? 6000000 : 14400000;
        bimeh.totalCost = bimeh.workplaceCode == 1 ? 6000000 : 14400000;
        await bimeh.save();
        request.btn = "";
        await request.save();
        this.requestChecker.currentState = new ShowBimehState(this.requestChecker);
        this.requestChecker.currentState.check(request);
    }
    else if(request.btn == 'CusShowInvoiceBtnEditRel') {
        request.btn = "";
        request.relMeliCode = -1;
        await request.save(); 
        this.requestChecker.client.sendMessage(request.from, msgString.ReCusIdCodeEnte);
    }
    else if(request.btn == 'CusShowInvoiceBtnConfirm') {
        bimeh.finished = true;
        await bimeh.save();     
        request.btn = "";
        await request.save();
        this.requestChecker.currentState = new ShowConfirmState(this.requestChecker);
        this.requestChecker.currentState.check(request);
    }
}

module.exports = ShowBimehState;