
const {sendJsonResponse, getUserFromToken , getType} = require('../utils/common_utils');
const User = require('../models/User');


async function requestHeadersByAdminAndProjectId(admin_id, p_id, r_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const headers = project.requests.id(r_id).headers;
        onSuccess(headers, admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


async function requestHeaderByAdminAndProjectId(admin_id, p_id, request_id, header_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const header = project.requests.id(request_id).headers.id(header_id);

        onSuccess(header, admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


module.exports.index = async (req, res, next) => {


    const {admin_id, project_id, request_id} = req.params;
    await requestHeadersByAdminAndProjectId(admin_id, project_id, request_id, (header) => {
        sendJsonResponse(res, header, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);

    })

}


module.exports.create = async (req, res, next) => {

    const {admin_id, project_id, request_id} = req.params;
    const {key, value} = req.body;

    await requestHeadersByAdminAndProjectId(admin_id, project_id, request_id, async (header, admin) => {

        header.push(
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

    const {admin_id, project_id, request_id, header_id} = req.params;
    await requestHeaderByAdminAndProjectId(admin_id, project_id, request_id, header_id, async (header) => {

        sendJsonResponse(res, header, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}


module.exports.update = async (req, res, next) => {

    const {admin_id, project_id, request_id, header_id} = req.params;
    const {key, value} = req.body;

    await requestHeaderByAdminAndProjectId(admin_id, project_id, request_id, header_id, async (header, admin) => {
        header.set({
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

    const {admin_id, project_id, request_id, header_id} = req.params;
    await requestHeaderByAdminAndProjectId(admin_id, project_id, request_id, header_id, async (header, admin) => {
        header.remove();
        await admin.save();
        sendJsonResponse(res, {"message": "Deleted successfully"}, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}










