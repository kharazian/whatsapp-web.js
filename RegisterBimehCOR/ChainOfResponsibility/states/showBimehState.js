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
    bimeh.cost = bimeh.hasBimeh ? (bimeh.workplaceCode == 1 ? 6000000 : 14400000) : 0;
    let sumCost = bimeh.cost;
    bimeh.relations.forEach(el => {
        el.cost = el.hasBimeh ? 14400000 : 0;
        sumCost = sumCost + el.cost;
    });
    bimeh.totalCost = sumCost;
    await bimeh.save();
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
    else if(request.btn == 'CusShowInvoiceBtnDisableAll' || request.body == '*0') { 
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
    else if(request.btn == 'CusShowInvoiceBtnEnableAll' || request.body == '*4') {         
        bimeh.hasBimeh = true;
        bimeh.cost = bimeh.workplaceCode == 1 ? 6000000 : 14400000;
        bimeh.totalCost = bimeh.workplaceCode == 1 ? 6000000 : 14400000;
        await bimeh.save();
        request.btn = "";
        await request.save();
        this.requestChecker.currentState = new ShowBimehState(this.requestChecker);
        this.requestChecker.currentState.check(request);
    }
    else if(request.btn == 'CusShowInvoiceBtnEditRel' || request.body == '*1') {
        request.btn = "";
        request.relMeliCode = -1;
        await request.save(); 
        this.requestChecker.currentState = new GetRelMeliCodeState(this.requestChecker);
        this.requestChecker.currentState.check(request); 
    }
    else if(request.btn == 'CusShowInvoiceBtnConfirm' || request.body == '*2') {
        var date = new Date();
        bimeh.finished = true;
        bimeh.signDate = date.toLocaleDateString('fa-ir');
        await bimeh.save();     
        request.btn = "";
        await request.save();
        this.requestChecker.currentState = new ShowConfirmState(this.requestChecker);
        this.requestChecker.currentState.check(request);
    }
    else if(request.btn == 'CusShowInvoiceBtnClose' || request.body == '*3') {
        request.finished = true;
        request.btn = "";
        await request.save();
    }
    else {
        let btns = [];
        if(bimeh.hasBimeh) {
            btns.push({id: 'CusShowInvoiceBtnEditRel', body: msgString.CusShowInvoiceBtnEditRel});
            btns.push({id: 'CusShowInvoiceBtnConfirm', body: msgString.CusShowInvoiceBtnConfirm});
            btns.push({id: 'CusShowInvoiceBtnClose', body: msgString.CusShowInvoiceBtnClose});
        }
        else {        
            btns.push({id: 'CusShowInvoiceBtnEnableAll', body: msgString.CusShowInvoiceBtnEnableAll});
            btns.push({id: 'CusShowInvoiceBtnClose', body: msgString.CusShowInvoiceBtnClose});
        }
        let button = new Buttons(
            bimeh.relations.map(el => {
                return msgString.CusShowInvoiceBody.format(el.relation, el.meliCode, el.fullName, msgString.EnableOrDisbale(el.hasBimeh), el.cost.numSeparator());
            }).reduce( (pValue, cValue) => {
                return pValue + cValue;
            }, msgString.CusShowNoRel),
            btns,
            msgString.CusShowInvoiceTitle.format(bimeh.meliCode, bimeh.name, bimeh.family, msgString.EnableOrDisbale(bimeh.hasBimeh), bimeh.cost.numSeparator()),
            msgString.CusShowInvoiceFooter.format(bimeh.totalCost.numSeparator()));
        this.requestChecker.sendMessage(request.from, button);        
    }
}

module.exports = ShowBimehState;