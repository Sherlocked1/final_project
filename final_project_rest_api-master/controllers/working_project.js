const {sendJsonResponse, getUserFromToken} = require('../utils/common_utils');

const errors = require('restify-errors');
const User = require('../models/User');
const restify_jwt = require('restify-jwt-community');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const WorkingProject = require('../models/WorkingProject');


var randtoken = require('rand-token');
module.exports.myWorkingProject = async (req, res, next) => {
    try {
        await getUserFromToken(req, res, async (user) => {

            const working_projects = await WorkingProject.find({stakeholder_oid: user._id});

            let projects = [];

            if (working_projects.length > 0) {

                for (let index = 0; index < working_projects.length; index++) {

                    console.log(working_projects[index])
                    const workingProject = working_projects[index]
                    const admin = await User.findById(workingProject['admin_oid'])
                    const project = admin.projects.id(workingProject['p_oid'])


                    projects.push({
                        p_name: project['p_name'],
                        P_description: project['P_description'],
                        createdAt: project['createdAt'],
                        admin_id: workingProject['admin_oid'],
                        role: workingProject['p_role'],
                        _id: project['_id']
                    })

                    if (index === working_projects.length - 1) {
                        sendJsonResponse(res, projects, 200);
                    }

                }

            } else {
                sendJsonResponse(res, [], 200);
            }
        }, (err) => {
            sendJsonResponse(res, err, 400);
        })

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 400);

    }
}


module.exports.getCollaboratorsForProject = async (req, res, next) => {
    try {
        await getUserFromToken(req, res, async (user) => {
            const working_projects = await WorkingProject.find({admin_oid: user._id, p_oid: req.params["p_oid"]});
            sendJsonResponse(res, working_projects, 200);
        }, (err) => {
            sendJsonResponse(res, err, 200);
        })

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 200);

    }
}


module.exports.create = async (req, res, next) => {

    await getUserFromToken(req, res, async (user) => {
        const {p_role, p_oid, admin_oid, stakeholder_oid} = req.body;
        try {
            const working_projects = await WorkingProject(
                {
                    p_role: p_role,
                    p_oid: p_oid,
                    admin_oid: admin_oid,
                    stakeholder_oid: stakeholder_oid
                }
            );

            const saved_working_projects = await working_projects.save();

            sendJsonResponse(res, saved_working_projects, 200);
        } catch (e) {
            sendJsonResponse(res, {"message": e.message}, 200);

        }

    }, (err) => {
        sendJsonResponse(res, err, 200);
    })


}

module.exports.show = async (req, res, next) => {
    try {
        await getUserFromToken(req, res, async (user) => {
            const {wp_oid} = req.params;

            const working_project = await WorkingProject.findById(wp_oid);

            sendJsonResponse(res, working_project, 200);
        }, (err) => {
            sendJsonResponse(res, err, 200);
        })

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 200);

    }

}


module.exports.delete = async (req, res, next) => {
    try {
        await getUserFromToken(req, res, async (user) => {
            const {wp_oid} = req.params;

            await WorkingProject.findOneAndRemove({_id: wp_oid});


            sendJsonResponse(res, {"message": "deleted successfully", "status": "success"}, 200);
        }, (err) => {
            sendJsonResponse(res, err, 200);
        })

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 200);

    }
}


module.exports.removeStakeHolderFromWorkerProject = async (req, res, next) => {
    try {
        await getUserFromToken(req, res, async (user) => {
            const {wp_oid} = req.params;

            const working_project = await WorkingProject.findById(wp_oid);

            console.log(working_project["admin_oid"])
            console.log(user["_id"])


            if (working_project["admin_oid"].toString() === user["_id"].toString()) {
                console.log("you are the owner");

                await WorkingProject.findOneAndRemove({_id: wp_oid});

                sendJsonResponse(res, {"message": "removed successfully", "status": "success"}, 200);
            } else {
                sendJsonResponse(res, {
                    "message": "only the owner can delete his stakeholder",
                    "status": "success"
                }, 400);

            }

        }, (err) => {
            sendJsonResponse(res, err, 400);
        })

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 400);

    }
}










