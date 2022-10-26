
const {sendJsonResponse, getUserFromToken , getType} = require('../utils/common_utils');
const User = require('../models/User');


async function requestParamssByAdminAndProjectId(admin_id, p_id, r_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const params = project.requests.id(r_id).params;
        onSuccess(params, admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


async function requestParamByAdminAndProjectId(admin_id, p_id, request_id, param_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const param = project.requests.id(request_id).params.id(param_id);

        onSuccess(param, admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


module.exports.index = async (req, res, next) => {


    const {admin_id, project_id, request_id} = req.params;
    await requestParamssByAdminAndProjectId(admin_id, project_id, request_id, (params) => {
        sendJsonResponse(res, params, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);

    })

}


module.exports.create = async (req, res, next) => {

    const {admin_id, project_id, request_id} = req.params;
    const {key, value} = req.body;

    await requestParamssByAdminAndProjectId(admin_id, project_id, request_id, async (params, admin) => {

        params.push(
            {
                key: key,
                value: value,
                data_type: getType(value)


            }
        );
        await admin.save();
        sendJsonResponse(res, {"message": "created successfully"}, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })
}


module.exports.show = async (req, res, next) => {

    const {admin_id, project_id, request_id, param_id} = req.params;
    await requestParamByAdminAndProjectId(admin_id, project_id, request_id, param_id, async (param) => {

        sendJsonResponse(res, param, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}


module.exports.update = async (req, res, next) => {

    const {admin_id, project_id, request_id, param_id} = req.params;
    const {key, value} = req.body;

    await requestParamByAdminAndProjectId(admin_id, project_id, request_id, param_id, async (param, admin) => {
        param.set({
            key: key,
            value: value,
            data_type: getType(value)


        });
        await admin.save();
        sendJsonResponse(res, {"message": "updated successfully"}, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}
module.exports.delete = async (req, res, next) => {

    const {admin_id, project_id, request_id, param_id} = req.params;
    await requestParamByAdminAndProjectId(admin_id, project_id, request_id, param_id, async (param, admin) => {
        param.remove();
        await admin.save();
        sendJsonResponse(res, {"message": "Deleted successfully"}, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}










