const {sendJsonResponse, getUserFromToken} = require('../utils/common_utils');
const Invite = require('../models/Invite');
const User = require('../models/User');

require('dotenv').config()
const axios = require('axios');
var Pusher = require('pusher');
let BreakException = {};

var pusher = new Pusher({
    appId: process.env.PUSER_APP_ID,
    key: process.env.PUSER_KEY,
    secret: process.env.PUSER_SECRET,
    cluster: process.env.PUSER_CLUSTER,
    encrypted: true
});


module.exports.send = async (req, res, next) => {
    try {

        await getUserFromToken(req, res, async (user, token) => {
            const {p_oid, stake_holder_oid, admin_oid, role} = req.body;


            try {
                //get working project by admin and project


                const workingProjects = await axios.get(`${process.env.BASE_URL}/api/working_project/collaborators/${p_oid}`, {
                    headers: {
                        Authorization: token
                    }
                });
                let count = 0;


                workingProjects.data.forEach((project) => {
                    if (project["p_role"] === role && project["stakeholder_oid"].toString() === stake_holder_oid) {
                        sendJsonResponse(res, {
                            "status": "warning",
                            "message": "user with this role already found"
                        }, 400);
                        throw BreakException;

                    } else {
                        count += 1;
                        console.log("current count" + count + "----max " + workingProjects.data.length)
                    }
                });
                console.log("end current count" + count + "----max " + workingProjects.data.length)

                if (count === workingProjects.data.length) {
                    const invite = new Invite({
                        p_oid: p_oid,
                        stake_holder_oid: stake_holder_oid,
                        admin_oid: admin_oid,
                        role: role
                    });

                    const savedInvite = await invite.save();

                    //listen for invites
                    // send total invites
                    const invites = await Invite.find({stake_holder_oid: stake_holder_oid});

                    pusher.trigger(`user_${stake_holder_oid}`, 'invite_sent', {
                        "count": invites.length,
                        "message" : `New invite from ${user['name']} `
                    });


                    sendJsonResponse(res, {"status": "success", "invite": savedInvite}, 200);

                }

            } catch (e) {
                sendJsonResponse(res, {"message": e.message}, 400);

            }

        }, async (e) => {

            sendJsonResponse(res, {"message": e.message}, 400);

        });


    } catch (e) {
        next(e)
        sendJsonResponse(res, {"message": e.message}, 400);

    }
}

module.exports.accept = async (req, res, next) => {
    try {
        await getUserFromToken(req, res, async (user, token) => {
            const invite = await Invite.findById(req.params.id);


            try {

                const workingProject = await axios.post(`${process.env.BASE_URL}/api/working_project/create`, {
                    p_role: invite["role"],
                    p_oid: invite["p_oid"],
                    //the user who accept invitation
                    stakeholder_oid: user["_id"],
                    admin_oid: invite["admin_oid"]
                }, {
                    headers: {
                        Authorization: token
                    }
                });


                console.log(workingProject)


                const toDel = await axios.delete(`${process.env.BASE_URL}/api/invite/reject/` + req.params.id, {
                    headers: {
                        Authorization: token
                    }
                });

                //listen for invites
                pusher.trigger(`admin_${invite["admin_oid"]}`, 'invite_accepted', {
                    "invite": {"message": "your invite has been accepted", "project": workingProject.data}
                });
                const invites = await Invite.find({stake_holder_oid: user._id});

                pusher.trigger(`user_${user._id}`, 'invite_sent', {
                    "count": invites.length
                });

                sendJsonResponse(res, {"message": `You are now a ${workingProject.data["p_role"]} in this project`}, 200);

            } catch (e) {
                sendJsonResponse(res, {"message": e.message}, 400);

            }

        }, (err) => {
            sendJsonResponse(res, err, 400);
        });


        //  add project  to working , delete invite

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 400);

    }


}

module.exports.reject = async (req, res, next) => {


    try {


        await getUserFromToken(req, res, async (user) => {
            await Invite.findOneAndRemove({_id: req.params.id});
            sendJsonResponse(res, {"message": "deleted successfully"}, 200);

            const invites = await Invite.find({stake_holder_oid: user._id});
            pusher.trigger(`user_${user._id}`, 'invite_sent', {
                "count": invites.length
            });
        })


    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 400);

    }

}

module.exports.index = async (req, res, next) => {

    try {

        await getUserFromToken(req, res, async (user) => {
            const invites = await Invite.find({stake_holder_oid: user._id});

            let invites_with_info = [];

            if (invites.length > 0) {

                for (let index = 0; index < invites.length; index++) {
                    const invite = invites[index];

                    const user = await User.findById(invite['admin_oid']);
                    const project = user.projects.id(invite['p_oid'])


                    invites_with_info.push({
                        "project": {
                            "_id": project['_id'],
                            "name": project['p_name']
                        },
                        "admin": {
                            "_id": user['_id'],
                            'name': user['name'],
                            "avatar": user['profile'] ? user['profile']['profile_image_path'] ? `${process.env.BASE_URL}/api/users/profile_image/` + user['profile']['profile_image_path'] : "https://api.adorable.io/avatars/285/user.png" : "https://api.adorable.io/avatars/285/user.png",

                        },
                        "role": invite['role'],
                        "_id": invite['_id'],
                        "collaborator_id": invite['stake_holder_oid']
                    })


                    console.log(index)
                    if (index === invites.length - 1) {
                        sendJsonResponse(res, invites_with_info.reverse(), 200);
                    }
                }

            } else {
                sendJsonResponse(res, [], 200);
            }


        }, (err) => {
            sendJsonResponse(res, err, 200);
        });
    } catch (e) {
        sendJsonResponse(res, {"error": e.message}, 200);

    }

}

module.exports.count = async (req, res, next) => {

    try {

        await getUserFromToken(req, res, async (user) => {
            const invites = await Invite.find({stake_holder_oid: user._id});

            sendJsonResponse(res, {'count': invites.length}, 200);

        }, (err) => {
            sendJsonResponse(res, err, 200);
        });
    } catch (e) {
        sendJsonResponse(res, {"error": e.message}, 200);

    }

}










