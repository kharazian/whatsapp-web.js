/**
 @constructor
 @abstract
 */
 const RequestState = function(requestChecker) {
     if (this.constructor === RequestState) {
         throw new Error("Can't instantiate abstract class!");
     }
    this.requestChecker = requestChecker;
    // RequestState initialization...
};

/**
 @abstract
 */
 RequestState.prototype.check = async function() {
    throw new Error("Abstract method!");
}

module.exports = RequestState;