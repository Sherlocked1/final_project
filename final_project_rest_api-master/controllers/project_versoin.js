const {sendJsonResponse, getUserFromToken} = require('../utils/common_utils');
const User = require('../models/User');
const {generateFiles, deleteFile} = require('../utils/doc_engine');


async function versionsByAdminAndProjectId(admin_id, p_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const versions = project.versions;
        onSuccess(versions, project, admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


async function versionByAdminAndProjectId(admin_id, p_id, version_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const versions = project.versions;
        onSuccess(versions.id(version_id), admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


module.exports.index = async (req, res, next) => {
    const {admin_id, project_id} = req.params;
    await versionsByAdminAndProjectId(admin_id, project_id, async (versions) => {


        let versions_with_user_info = []


        if (versions.length > 0) {

            for (let index = 0; index < versions.length; index++) {
                const user = await User.findById(versions[index]['author_oid'])
                versions_with_user_info.push({
                    _id: versions[index]['_id'],
                    html_file_url: versions[index]['html_file_url'],
                    pdf_file_url: versions[index]['pdf_file_url'],
                    release_note: versions[index]['release_note'],
                    version_code: versions[index]['version_name'],

                    author: {
                        "_id": user['_id'],
                        'name': user['name'],
                        "avatar": user['profile'] ? user['profile']['profile_image_path'] ? `${process.env.BASE_URL}/api/users/profile_image/` + user['profile']['profile_image_path'] : "https://api.adorable.io/avatars/285/user.png" : "https://api.adorable.io/avatars/285/user.png",
                    },
                    createdAt: versions[index]['createdAt'],
                })

                if (index === versions.length - 1) {
                    sendJsonResponse(res, versions_with_user_info.reverse(), 200);

                }
            }
        } else {
            sendJsonResponse(res, [], 200);

        }


        // sendJsonResponse(res, versions, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

};


module.exports.create = async (req, res, next) => {
    const {admin_id, project_id} = req.params;
    const {author_oid, release_note, version_name} = req.body;

    await versionsByAdminAndProjectId(admin_id, project_id, async (versions, project, admin) => {


        generateFiles(project).then(async (response) => {


            versions.push(
                {

                    html_file_name: response['html_file_name'],
                    html_file_url: response['url_to_html_doc'],
                    //
                    pdf_file_name: response['pdf_file_name'],
                    pdf_file_url: response['url_to_pdf_doc'],
                    //
                    author_oid: author_oid,
                    release_note: release_note,
                    version_name: version_name,
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
                release_note: release_note,
                version_name: version_name,
            }, 200);


        }).catch(err => {
            sendJsonResponse(res, err, 200);

        })


    }, (err) => {
        sendJsonResponse(res, err, 200);
    })
}


module.exports.show = async (req, res, next) => {

    const {admin_id, project_id, version_id} = req.params;
    await versionByAdminAndProjectId(admin_id, project_id, version_id, async (version) => {
        sendJsonResponse(res, version, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}


module.exports.delete = async (req, res, next) => {
    const {admin_id, project_id, version_id} = req.params;
    await versionByAdminAndProjectId(admin_id, project_id, version_id, async (version, admin) => {


        try {
            const htmlRes = await deleteFile(version['html_file_name']);
            if (htmlRes['done']) {
                //    delete pdf file
                const pdfRes = await deleteFile(version['pdf_file_name']);

                if (pdfRes['done']) {
                    // remove commit here
                    version.remove();

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










