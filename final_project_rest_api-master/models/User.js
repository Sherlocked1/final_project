const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');

var profileSchema = new mongoose.Schema({
    job: {type: String},
    profile_image_path: {type: String},
    about: {type: String},
    phone_number: {type: String}
});
var requestRelevant = new mongoose.Schema({
    key: {type: String},
    value: {type: String},
    data_type: {type: String}
});
requestRelevant.plugin(timestamp);


//operator
var testCaseSchema = new mongoose.Schema({
    to_be_tested: {type: String},
    operator: {type: String},
    expected_value: {type: String}
});

testCaseSchema.plugin(timestamp);

var requestSchema = new mongoose.Schema({
    //added on create new request
    title: {type: String},
    //added on create new request
    description: {type: String},
//title
    //all-just for update
    response: {type: String},
    url: {type: String},
    method: {type: String},
    body: [requestRelevant],
    params: [requestRelevant],
    headers: [requestRelevant],
    test_cases: [testCaseSchema],
    // is_deprecated : Boolean ,
    done_by_front_end_developer: {type: Boolean},


});
requestSchema.plugin(timestamp);

var projectCommitsDocumentation = new mongoose.Schema({
    html_file_name: {type: String},
    html_file_url: {type: String},
    pdf_file_name: {type: String},
    pdf_file_url: {type: String},
    author_oid: {type: mongoose.SchemaTypes.ObjectId, required: true},
    commit_message: {type: String},

    // commit_token: {type: String},

});
projectCommitsDocumentation.plugin(timestamp);


var projectVersionsDocumentation = new mongoose.Schema({
    html_file_name: {type: String},
    html_file_url: {type: String},
    pdf_file_name: {type: String},
    pdf_file_url: {type: String},
    author_oid: {type: mongoose.SchemaTypes.ObjectId, required: true},
    release_note: {type: String},
    version_name: {type: String},
});


var logSchema = new mongoose.Schema({
    worker_oid: {type: mongoose.SchemaTypes.ObjectId, required: true},
    event_message: {type: String},
});
logSchema.plugin(timestamp);


projectVersionsDocumentation.plugin(timestamp);
//projectCommitDocumentation
var projectSchema = new mongoose.Schema({
    p_name: {type: String},
    P_description: {type: String},
    requests: [requestSchema],
    commits: [projectCommitsDocumentation],
    versions: [projectVersionsDocumentation],
    log: [logSchema]

});

//versions_documentation
projectSchema.plugin(timestamp);


//{type: mongoose.SchemaTypes.ObjectId, required: true}

var userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password_reset_token: {type: String},
    email: {type: String, required: true, email: true, unique: true,},
    password: {type: String, required: true},
    profile: profileSchema,
    projects: [projectSchema],
    // working_projects: [workingProjectSchema]
});


userSchema.plugin(uniqueValidator);


userSchema.plugin(timestamp);


var userModule = mongoose.model("User", userSchema);
// expert the model

module.exports = userModule;