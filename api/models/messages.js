const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  userEmail: { type: String },
  toUser: { type: String },
  messages: [{
      userEmail:String,
      toUser:String,
      mes:String,
    }]
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;