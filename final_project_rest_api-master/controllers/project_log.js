const {sendJsonResponse, getUserFromToken} = require('../utils/common_utils');
const User = require('../models/User');


async function logsByAdminAndProjectId(admin_id, p_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const log = project.log;
        onSuccess(log, admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


module.exports.index = async (req, res, next) => {
    const {admin_id, project_id} = req.params;
    await logsByAdminAndProjectId(admin_id, project_id, async (log) => {


        let logs_with_info = []


        if (log.length > 0) {

            for (let index = 0; index < log.length; index++) {
                const user = await User.findById(log[index]['worker_oid']);
                logs_with_info.push({
                    _id: log[index]['_id'],
                    event_message: user ? user['name'] + " " + log[index]['event_message'] : 'not set',
                    createdAt: log[index]['createdAt'],

                })

                if (index === log.length - 1) {
                    sendJsonResponse(res, logs_with_info.reverse(), 200);

                }

            }
        } else {
            sendJsonResponse(res, [], 200);

        }


    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}


module.exports.create = async (req, res, next) => {
    const {admin_id, project_id} = req.params;
    const {worker_oid, event_message} = req.body;

    await logsByAdminAndProjectId(admin_id, project_id, async (log, admin) => {
        log.push(
            {
                worker_oid: worker_oid,
                event_message: event_message,
            }
        );
        const _admin = await admin.save();
        sendJsonResponse(res, {"message": "created successfully"}, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })
}










