const mongoose = require('mongoose');

const timestamp = require('mongoose-timestamp');


var ChatSchema = new mongoose.Schema({
    from: {type: String, required: true, trim: true},
    message: {type: String, required: true, trim: true},
    message_type: {type: String, required: true, trim: true},
    project_id: {type: mongoose.SchemaTypes.ObjectId, required: true}
});

ChatSchema.plugin(timestamp);


const Chat = mongoose.model('Chat', ChatSchema);


module.exports = Chat
