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

const InitialState = function(requestChecker) {
    RequestState.apply(this, arguments);
    // InitialState initialization...
};
InitialState.prototype = Object.create(RequestState.prototype);
InitialState.prototype.constructor = InitialState;

InitialState.prototype.check = async function(request) {
    if(request.meliCode) {
        this.requestChecker.currentState = new ShowBimehState(this.requestChecker);
        this.requestChecker.ShowBimehState = this.requestChecker.currentState;
        this.requestChecker.currentState.check(request);
    }
    else {
        if(!checkCodeMeli(request.body)){
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