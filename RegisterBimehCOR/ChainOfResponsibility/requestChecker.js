const InitialState = require('./states/initilState')

const RequestChecker = function() {
    this.currentState;
    this.showBimehState;
    this.client;
    this.onlyTextMessage;
 };
 
 RequestChecker.prototype.check = async function(request, client) {    
    this.client = client;
    this.currentState = new InitialState(this);
    this.onlyTextMessage = true;
    this.currentState.check(request);
}

RequestChecker.prototype.sendMessage = async function(chatId, content) {
    if(!this.onlyTextMessage){
        this.client.sendMessage(chatId, content);
    }
    else if(typeof content === 'string' || content instanceof String) {
        this.client.sendMessage(chatId, content);
    }
    else if(content.mimetype) {
        this.client.sendMessage(chatId, content);
    }
    else {
        let msg = content.title + '\n';
        msg = msg + content.body + '\n';
        msg = msg + content.footer + '\n';
        for (let index = 0; index < content.buttons.length; index++) {
            msg = msg + content.buttons[index].buttonText.displayText + '\n';            
        }
        content.buttons.forEach(el => {
            
        });
        this.client.sendMessage(chatId, msg);
    }
}
 module.exports = RequestChecker;