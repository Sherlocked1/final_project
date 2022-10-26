const {generateFiles, deleteFile} = require('../utils/doc_engine');

const {sendJsonResponse, getUserFromToken} = require('../utils/common_utils');
const User = require('../models/User');


async function commitsByAdminAndProjectId(admin_id, p_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const commits = project.commits;
        onSuccess(commits, project, admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


async function commitByAdminAndProjectId(admin_id, p_id, commit_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const commits = project.commits;
        onSuccess(commits.id(commit_id), admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


module.exports.index = async (req, res, next) => {
    const {admin_id, project_id} = req.params;
    await commitsByAdminAndProjectId(admin_id, project_id, async (commits) => {


        let commits_with_user_info = []


        if (commits.length > 0) {

            for (let index = 0; index < commits.length; index++) {
                const user = await User.findById(commits[index]['author_oid'])
                commits_with_user_info.push({
                    _id: commits[index]['_id'],
                    html_file_url: commits[index]['html_file_url'],
                    pdf_file_url: commits[index]['pdf_file_url'],
                    commit_message: commits[index]['commit_message'],
                    author: {
                        "_id": user['_id'],
                        'name': user['name'],
                        "avatar": user['profile'] ? user['profile']['profile_image_path'] ? `${process.env.BASE_URL}/api/users/profile_image/` + user['profile']['profile_image_path'] : "https://api.adorable.io/avatars/285/user.png" : "https://api.adorable.io/avatars/285/user.png",
                    },
                    createdAt: commits[index]['createdAt'],

                })

                if (index === commits.length - 1) {
                    sendJsonResponse(res, commits_with_user_info.reverse(), 200);

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
    const {author_oid, commit_message} = req.body;

    await commitsByAdminAndProjectId(admin_id, project_id, async (commits, project, admin) => {


        generateFiles(project).then(async (response) => {


            commits.push(
                {
                    html_file_name: response['html_file_name'],
                    html_file_url: response['url_to_html_doc'],
                    //
                    pdf_file_name: response['pdf_file_name'],
                    pdf_file_url: response['url_to_pdf_doc'],
                    author_oid: author_oid,
                    commit_message: commit_message
                }
            );


            await admin.save();
            sendJsonResponse(res, {
                "status": "success",
                html_file_name: response['htmlDocName'],
                html_file_url: response['url_to_html_doc'],
                pdf_file_name: response['pdfDocName'],
                pdf_file_url: response['url_to_pdf_doc'],
                author_oid: author_oid,
                commit_message: commit_message
            }, 200);


        }).catch(err => {
            sendJsonResponse(res, err, 200);

        })


    }, (err) => {
        sendJsonResponse(res, err, 200);
    })
}


module.exports.show = async (req, res, next) => {

    const {admin_id, project_id, commit_id} = req.params;
    await commitByAdminAndProjectId(admin_id, project_id, commit_id, async (commit) => {

        sendJsonResponse(res, commit, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}


module.exports.delete = async (req, res, next) => {
    const {admin_id, project_id, commit_id} = req.params;
    await commitByAdminAndProjectId(admin_id, project_id, commit_id, async (commit, admin) => {


        ///
        try {
            const htmlRes = await deleteFile(commit['html_file_name']);
            if (htmlRes['done']) {
                //    delete pdf file
                const pdfRes = await deleteFile(commit['pdf_file_name']);

                if (pdfRes['done']) {
                    // remove commit here
                    commit.remove();

                    await admin.save();
                    sendJsonResponse(res, {"message": "deleted successfully "}, 200);

                } else {
                    sendJsonResponse(res, {"message": pdfRes["message"]}, 200);
                }
            } else {
                sendJsonResponse(res, {"message": htmlRes["message"]}, 200);

            }
        } catch (e) {
            sendJsonResponse(res, {"message": e.message}, 200);
        }


    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}










