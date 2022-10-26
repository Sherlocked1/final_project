
const {sendJsonResponse, getUserFromToken, getType} = require('../utils/common_utils');
const User = require('../models/User');


async function requestBodysByAdminAndProjectId(admin_id, p_id, r_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const bodys = project.requests.id(r_id).body;
        onSuccess(bodys, admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


async function requestBodyByAdminAndProjectId(admin_id, p_id, request_id, body_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const body = project.requests.id(request_id).body.id(body_id);

        onSuccess(body, admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


module.exports.index = async (req, res, next) => {


    const {admin_id, project_id, request_id} = req.params;
    await requestBodysByAdminAndProjectId(admin_id, project_id, request_id, (bodys) => {
        sendJsonResponse(res, bodys, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);

    })

}


module.exports.create = async (req, res, next) => {

    const {admin_id, project_id, request_id} = req.params;
    const {key, value} = req.body;

    await requestBodysByAdminAndProjectId(admin_id, project_id, request_id, async (bodys, admin) => {

        bodys.push(
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

    const {admin_id, project_id, request_id, body_id} = req.params;
    await requestBodyByAdminAndProjectId(admin_id, project_id, request_id, body_id, async (body) => {

        sendJsonResponse(res, body, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}


module.exports.update = async (req, res, next) => {

    const {admin_id, project_id, request_id, body_id} = req.params;
    const {key, value} = req.body;

    await requestBodyByAdminAndProjectId(admin_id, project_id, request_id, body_id, async (body, admin) => {
        body.set({
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

    const {admin_id, project_id, request_id, body_id} = req.params;
    await requestBodyByAdminAndProjectId(admin_id, project_id, request_id, body_id, async (body, admin) => {
        body.remove();
        await admin.save();
        sendJsonResponse(res, {"message": "Deleted successfully"}, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}










