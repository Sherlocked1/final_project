const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');

var inviteSchema = new mongoose.Schema({
    p_oid: {type: mongoose.SchemaTypes.ObjectId, required: true},
    stake_holder_oid: {type: mongoose.SchemaTypes.ObjectId, required: true},
    admin_oid: {type: mongoose.SchemaTypes.ObjectId, required: true},
    role: {type: String, required: true},
});

inviteSchema.index({ p_oid: 1, stake_holder_oid: 1 , role : 1,admin_oid :1}, { unique: true });

inviteSchema.plugin(uniqueValidator);


inviteSchema.plugin(timestamp);


var inviteModule = mongoose.model("Invite", inviteSchema);
// expert the model

module.exports = inviteModule;