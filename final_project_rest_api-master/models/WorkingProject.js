const mongoose = require('mongoose');

const timestamp = require('mongoose-timestamp');


//m:m relation no need to combine it one relation [cause duplication problem]
var workingProjectSchema = new mongoose.Schema({
    p_role: {type: String},
    p_oid: {type: mongoose.SchemaTypes.ObjectId, required: true},
    stakeholder_oid: {type: mongoose.SchemaTypes.ObjectId, required: true},
    admin_oid: {type: mongoose.SchemaTypes.ObjectId, required: true},
});
workingProjectSchema.plugin(timestamp);

workingProjectSchema.index({p_role: 1, stakeholder_oid: 1, p_oid: 1}, {unique: true});

const workingProjectModel = mongoose.model('WorkingProject', workingProjectSchema);


module.exports = workingProjectModel
