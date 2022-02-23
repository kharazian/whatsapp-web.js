const RequestState = require('./requestState');

const ShowRelationState = function() {
    RequestState.apply(this, arguments);
    console.log('ShowRelationState');
    // ShowRelationState ShowMenulization...
};
ShowRelationState.prototype = Object.create(RequestState.prototype);
ShowRelationState.prototype.constructor = ShowRelationState;

ShowRelationState.prototype.check = async function() {
    console.log('ShowRelationState.check');
}

module.exports = ShowRelationState;