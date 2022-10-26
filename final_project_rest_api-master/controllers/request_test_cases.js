const {sendJsonResponse, getUserFromToken} = require('../utils/common_utils');
const User = require('../models/User');


async function requestTestCasesByAdminAndProjectId(admin_id, p_id, r_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const test_cases = project.requests.id(r_id).test_cases;
        onSuccess(test_cases, admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


async function requestTestCaseByAdminAndProjectId(admin_id, p_id, request_id, param_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const param = project.requests.id(request_id).test_cases.id(param_id);

        onSuccess(param, admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


module.exports.index = async (req, res, next) => {


    const {admin_id, project_id, request_id} = req.params;
    await requestTestCasesByAdminAndProjectId(admin_id, project_id, request_id, (test_cases) => {
        sendJsonResponse(res, test_cases, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);

    })

}


module.exports.create = async (req, res, next) => {

    const {admin_id, project_id, request_id} = req.params;
    const {to_be_tested, operator, expected_value} = req.body;


    await requestTestCasesByAdminAndProjectId(admin_id, project_id, request_id, async (test_cases, admin) => {

        test_cases.push(
            {
                to_be_tested, operator, expected_value
            }
        );
        await admin.save();
        sendJsonResponse(res, {"message": "created successfully"}, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })
}


module.exports.update = async (req, res, next) => {

    const {admin_id, project_id, request_id, test_case_id} = req.params;
    const {to_be_tested, operator, expected_value} = req.body;

    await requestTestCaseByAdminAndProjectId(admin_id, project_id, request_id, test_case_id, async (param, admin) => {
        param.set({
            to_be_tested, operator, expected_value

        });
        await admin.save();
        sendJsonResponse(res, {"message": "updated successfully"}, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}


module.exports.delete = async (req, res, next) => {

    const {admin_id, project_id, request_id, test_case_id} = req.params;
    await requestTestCaseByAdminAndProjectId(admin_id, project_id, request_id, test_case_id, async (testCase, admin) => {
        testCase.remove();
        await admin.save();
        sendJsonResponse(res, {"message": "Deleted successfully"}, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}










