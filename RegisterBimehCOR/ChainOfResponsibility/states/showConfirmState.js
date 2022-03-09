const RequestState = require('./requestState');
const msgString = require('../../utils/msgString')
const bimehModel = require('../../models/bimehModel');
const { Buttons, MessageMedia } = require('../../../index');
const makePdf = require('../../pdfMaker/index');


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
            bimeh.relations.map(el => {
                return msgString.CusShowInvoiceBody.format(el.relation, el.meliCode, el.fullName, msgString.EnableOrDisbale(el.hasBimeh), el.cost.numSeparator());
            }).reduce( (pValue, cValue) => {
                return pValue + cValue;
            }, msgString.CusShowNoRel),
            btns,
            msgString.CusShowInvoiceTitle.format(bimeh.meliCode, bimeh.name, bimeh.family, msgString.EnableOrDisbale(bimeh.hasBimeh), bimeh.cost.numSeparator()),
            msgString.CusShowInvoiceFooter.format(bimeh.totalCost.numSeparator()));
        this.requestChecker.client.sendMessage(request.from, button);       
    }
    else if(request.btn == 'CusShowInvoiceBtnPrint') {
        try {
            await makePdf(request.meliCode);
            let media = MessageMedia.fromFilePath("./RegisterBimehCOR/data/"+request.meliCode+".pdf");
            this.requestChecker.client.sendMessage(request.from, media);
            request.btn = "";
            await request.save();
            
        } catch (error) {
            
        }
    }
    else if(request.btn == 'CusShowInvoiceBtnClose') {
        request.finished = true;
        request.btn = "";
        await request.save();
    }
}

module.exports = ShowConfirmState;