const RequestState = require('./requestState');
const msgString = require('../../utils/msgString')
const bimehModel = require('../../models/bimehModel');
const { Buttons } = require('../../../index');



const showRelBimehState = function() {
    RequestState.apply(this, arguments);
    // showRelBimehState ShowMenulization...
};
showRelBimehState.prototype = Object.create(RequestState.prototype);
showRelBimehState.prototype.constructor = showRelBimehState;

showRelBimehState.prototype.check = async function(request) {
    let bimeh = await bimehModel.findOne({ meliCode: request.meliCode});
    let relBimeh = bimeh.relations.find(el => el.meliCode === Number(request.relMeliCode));
    if(request.btn == '') {
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
            msgString.CusShowRelBody.format(relBimeh.relation, relBimeh.meliCode, relBimeh.fullName, msgString.EnableOrDisbale(relBimeh.hasBimeh), msgString.ShowCost(relBimeh.cost)),
            btns,
            msgString.CusShowRelTitle.format(relBimeh.relation, relBimeh.meliCode, relBimeh.fullName),
            msgString.CusShowRelFooter.format(relBimeh.cost));
        this.requestChecker.client.sendMessage(request.from, button);      
    }
    else if(request.btn == 'CusShowInvoiceBtnDisableRel') { 
        relBimeh = bimeh.relations.find(el => el.meliCode === request.relMeliCode)                  
        relBimeh.hasBimeh = false;
        relBimeh.cost = 0;
        bimeh.totalCost = bimeh.totalCost - 14400000;
        await bimeh.save();               
        request.relMeliCode = 0;
        request.btn = "";
        await request.save();
        this.requestChecker.ShowBimehState.check(request);
    }
    else if(request.btn == 'CusShowInvoiceBtnEnableRel') {
        relBimeh = bimeh.relations.find(el => el.meliCode === request.relMeliCode)
        relBimeh.hasBimeh = true;
        relBimeh.cost = 14400000;
        bimeh.totalCost = bimeh.totalCost + 14400000;
        await bimeh.save();
        request.relMeliCode = 0;
        request.btn = "";
        await request.save();
        this.requestChecker.ShowBimehState.check(request);
    }
    else if(request.btn == 'CusShowInvoiceBtnRetuen') {
        request.relMeliCode = 0;
        request.btn = "";
        await request.save();
        this.requestChecker.ShowBimehState.check(request);
    }
}

module.exports = showRelBimehState;