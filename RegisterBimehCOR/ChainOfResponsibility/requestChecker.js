const InitialState = require('./states/initilState')

const RequestChecker = function() {
    this.currentState;
    this.client;
 };
 
 RequestChecker.prototype.check = async function(request, client) {    
    this.client = client;
    this.currentState = new InitialState(this);
    this.currentState.check(request);
}
 module.exports = RequestChecker;