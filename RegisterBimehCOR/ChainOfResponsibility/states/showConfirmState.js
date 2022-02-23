const RequestState = require('./requestState');
const msgString = require('../../utils/msgString')
const bimehModel = require('../../models/bimehModel');
const { Buttons } = require('../../../index');


const ShowConfirmState = function() {
    RequestState.apply(this, arguments);
    // ShowConfirmState ShowMenulization...
};
ShowConfirmState.prototype = Object.create(RequestState.prototype);
ShowConfirmState.prototype.constructor = ShowConfirmState;

ShowConfirmState.prototype.check = async function(request) {
    let bimeh = await bimehModel.findOne({ meliCode: request.meliCode});
    if(request.btn == '') {
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
        this.requestChecker.client.sendMessage(request.from, button);       
    }
    else if(request.btn == 'CusShowInvoiceBtnPrint') {
        const media = MessageMedia.fromFilePath('./a.pdf');
        this.requestChecker.client.sendMessage(request.from, media);
        request.btn = "";
        await request.save();
    }
    else if(request.btn == 'CusShowInvoiceBtnClose') {          
        request.state = enums.state.Finished;
        request.finished = true;
        request.btn = "";
        await request.save();
    }
}

module.exports = ShowConfirmState;