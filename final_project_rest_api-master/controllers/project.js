const
    axios = require('axios');
const path = require("path");

const {deleteFile} = require('../utils/doc_engine');

const {sendJsonResponse, getUserFromToken, groupListByMonth} = require('../utils/common_utils');
const User = require('../models/User');
require('dotenv').config()
let fs = require('fs');

const WorkingProject = require('../models/WorkingProject')
const Chat = require('../models/chat')

module.exports.index = async (req, res, next) => {
    try {
        await getUserFromToken(req, res, async (user) => {
            const projects = await user.projects;
            sendJsonResponse(res, projects.reverse(), 200);
        }, (err) => {
            sendJsonResponse(res, err, 200);
        })

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 200);

    }
}


module.exports.showDoc = async (req, res, next) => {
    try {
        const root = __dirname.replace('\\controllers', '');

        // console.log(__dirname)

        let _path = `/public/uploads/project_related_files/${req.params.doc_name}`;

        const full_path = path.join(process.platform === "win32" ? __dirname.replace("\\controllers", "") :
            __dirname.replace("/controllers", ""), _path)
        console.info(full_path)
        if (fs.existsSync(full_path)) {
            res.status(200);
            res.sendFile(full_path);

        } else {
            sendJsonResponse(res, {"message": "File not found"}, 404);

        }


    } catch (e) {

        sendJsonResponse(res, {"message": e.toString()}, 404);

    }
}


module.exports.commitsByMonths = async (req, res, next) => {

    try {
        await getUserFromToken(req, res, async (user) => {
            try {
                const projects = await user.projects;
                const {p_oid} = req.params;

                const commits = projects.id(p_oid)['commits']

                //init result


                //
                sendJsonResponse(res, groupListByMonth(commits) ? groupListByMonth(commits) : {
                    "counts": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "months": [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                    ]
                }, 200);

            } catch (e) {
                sendJsonResponse(res, {"message": e.message}, 200);
            }

        }, (err) => {
            sendJsonResponse(res, err, 200);
        })

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 200);

    }
}


module.exports.versionsByMonths = async (req, res, next) => {

    try {
        await getUserFromToken(req, res, async (user) => {
            try {
                const projects = await user.projects;
                const {p_oid} = req.params;

                const versions = projects.id(p_oid)['versions']

                //init result

                //
                sendJsonResponse(res, groupListByMonth(versions) ? groupListByMonth(versions) : {
                    "counts": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "months": [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                    ]
                }, 200);

            } catch (e) {
                sendJsonResponse(res, {"message": e.message}, 400);
            }

        }, (err) => {
            sendJsonResponse(res, err, 200);


        })

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 400);

    }
}


module.exports.collaborators = async (req, res, next) => {
    const {p_oid} = req.params;

    try {
        //get stakeholder ids from working project where project equal this id

        const workers = await WorkingProject.find({p_oid: p_oid});

        let workers_info = [];

        if (workers.length > 0) {

            for (let workerIndex = 0; workerIndex < workers.length; workerIndex++) {
                const user = await User.findById(workers[workerIndex]['stakeholder_oid']);
                workers_info.push({
                    "_id": user["_id"],
                    "working_project_id": workers[workerIndex]['_id'],
                    "name": user["name"],
                    "email": user["email"],
                    "avatar": user['profile'] ? user['profile']['profile_image_path'] ? `${process.env.BASE_URL}/api/users/profile_image/` + user['profile']['profile_image_path'] : "https://api.adorable.io/avatars/285/user.png" : "https://api.adorable.io/avatars/285/user.png",
                    "role": workers[workerIndex]['p_role']
                })

                if (workerIndex === workers.length - 1) {
                    //   now filter user with role

                    const devTesters = workers_info.filter(function (worker) {
                        return worker['role'] === process.env.COLLABORATORS_AS_DEV
                    })

                    const frontEndDev = workers_info.filter(function (worker) {
                        return worker['role'] === process.env.COLLABORATORS_AS_FRONT_END_DEV
                    })

                    sendJsonResponse(res, {
                        "back_end_developers": devTesters,
                        "front_end_developers": frontEndDev
                    }, 200);

                }
            }
        } else {


            sendJsonResponse(res, {
                "back_end_developers": [],
                "front_end_developers": []
            }, 200);

        }


    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 200);

    }
}

//

module.exports.create = async (req, res, next) => {
    try {
        await getUserFromToken(req, res, async (user) => {
            const projects = await user.projects;
            const {name, description} = req.body;

            projects.push(
                {
                    p_name: name,
                    P_description: description
                }
            );

            const saveUser = await user.save();

            sendJsonResponse(res, saveUser.projects[saveUser.projects.length - 1], 200);
        }, (err) => {
            sendJsonResponse(res, err, 200);
        })

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 200);

    }


}
module.exports.show = async (req, res, next) => {


    try {
        const {p_oid, admin_id} = req.params;

        const user = await User.findById(admin_id);
        const projects = await user.projects;
        const project = projects.id(p_oid);
        const working_projects = await WorkingProject.find({admin_oid: user._id, p_oid: p_oid});


        sendJsonResponse(res, projects.id(p_oid) ? {
            "p_name": project['p_name'],
            "no_of_collaborators": working_projects.length
        } : {"message": "not found"}, 200);
    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 200);

    }

}


module.exports.count = async (req, res, next) => {


    try {
        await getUserFromToken(req, res, async (user) => {
            try {
                const projects = await user.projects;
                const {p_oid} = req.params;

                const usersInsideProject = await WorkingProject.find({p_oid: p_oid});


                sendJsonResponse(res, projects.id(p_oid) ? {
                    requests: projects.id(p_oid)['requests'].length,
                    commits: projects.id(p_oid)['commits'].length,
                    versions: projects.id(p_oid)['versions'].length,
                    collaborators: usersInsideProject.length

                } : {"message": "not found"}, 200);
            } catch (e) {
                sendJsonResponse(res, {"message": e.message}, 400);

            }


        }, (err) => {
            sendJsonResponse(res, err, 400);
        })

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 400);

    }

}


module.exports.update = async (req, res, next) => {

    try {
        await getUserFromToken(req, res, async (user) => {
            const projects = await user.projects;
            const {name, description} = req.body;
            const {p_oid} = req.params;


            projects.id(p_oid).set({
                p_name: name,
                P_description: description

            });

            await user.save();

            sendJsonResponse(res, {"message": "updated successfully", "status": "success"}, 200);
        }, (err) => {
            sendJsonResponse(res, err, 200);
        })

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 200);

    }

}
module.exports.delete = async (req, res, next) => {

    try {
        await getUserFromToken(req, res, async (user, token) => {
            const projects = user.projects;
            const {p_oid} = req.params;


            // delete working project where project id === p_iod

            deleteWorkingProjectReletedToProject(p_oid)
                .then(done => {

                    if (done) {
                        console.log('delete working project')
                        deleteChatReletedToProject(p_oid)
                            .then(done => {
                                if (done) {
                                    console.log('delete chat')
                                    deleteVersoinReletedToProject(user, token, p_oid)
                                        .then(done => {
                                            if (done) {
                                                console.log('delete versions')
                                                deleteCommitsReletedToProject(user, token, p_oid)
                                                    .then(async (done) => {

                                                        console.log('delete commits')

                                                        projects.id(p_oid).remove();
                                                        await user.save();
                                                        sendJsonResponse(res, {
                                                            "message": "deleted successfully",
                                                            "status": "success"
                                                        }, 200);
                                                    }).catch(err => {
                                                    console.log(err)

                                                })
                                            }


                                        }).catch(err => {
                                        console.log(err)

                                    })
                                }

                            }).catch(err => {
                            console.log(err)

                        })
                    }

                }).catch(error => {
                console.log(error)

            })

            // delete chat where project id === p_iod

            // get all version related to project

            // delete version and remove file

            // get all commits by project id

            // delete commit and then remove related file

            // after all of this delete the project


        }, (err) => {
            sendJsonResponse(res, err, 200);
        })

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 200);

    }


}


async function deleteWorkingProjectReletedToProject(project_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const working_projects = await WorkingProject.remove({p_oid: project_id})
            resolve(true)
        } catch (e) {
            resolve(false)
        }
    })


}


async function deleteChatReletedToProject(project_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const chat = await Chat.remove({project_id: project_id})
            resolve(true)
        } catch (e) {
            resolve(false)
        }
    })

}


async function deleteVersoinReletedToProject(user, token, project_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const versions = user.projects.id(project_id).versions;


            if (versions !== null) {
                if (versions.length > 0) {

                    for (let index = 0; index < versions.length; index++) {
                        let version = versions[index]

                        await axios.delete(`http://localhost:3000/api/user/${user['_id']}/project/${project_id}/version/delete/${version['_id']}`, {
                            headers: {
                                "Authorization": token
                            }
                        })
                        if (index === versions.length - 1) {
                            console.log('version deleted successfully ')

                            resolve(true)
                        }

                    }
                } else {
                    resolve(true)
                }
            } else {
                resolve(true)
            }


        } catch (e) {
            console.log(e.message)
            resolve(true)
        }
    })

}


async function deleteCommitsReletedToProject(user, token, project_id) {

    return new Promise(async (resolve, reject) => {
        try {
            const commits = user.projects.id(project_id).commits;
            // console.log('number of commits per project ' + commits.length)

            if (commits !== null) {
                if (commits.length > 0) {
                    for (let index = 0; index < commits.length; index++) {
                        let commit = commits[index]

                        await axios.delete(`http://localhost:3000/api/user/${user['_id']}/project/${project_id}/commit/delete/${commit['_id']}`, {
                            headers: {
                                "Authorization": token
                            }
                        })
                        if (index === commits.length - 1) {

                            resolve(true)
                        }

                    }
                } else {
                    resolve(true)
                }
            } else {
                resolve(true)
            }


        } catch (e) {
            resolve(true)
        }
    })

}










