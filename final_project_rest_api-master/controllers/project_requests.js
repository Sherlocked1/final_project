const {testRequest, runTestCases} = require("../utils/test_tool_helpers");

const {sendJsonResponse, getUserFromToken} = require('../utils/common_utils');
const User = require('../models/User');


async function requestsByAdminAndProjectId(admin_id, p_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const requests = project.requests;
        onSuccess(requests, admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


async function requestByAdminAndProjectId(admin_id, p_id, request_id, onSuccess, onErr) {
    try {
        const admin = await User.findById(admin_id);
        const project = await admin.projects.id(p_id);
        const requests = project.requests;
        onSuccess(requests.id(request_id), admin);
    } catch (e) {

        onErr({"message": e.message});
    }
}


module.exports.index = async (req, res, next) => {


    const {admin_id, project_id} = req.params;
    await requestsByAdminAndProjectId(admin_id, project_id, (requests) => {
        sendJsonResponse(res, requests, 200);

    }, (err) => {
        sendJsonResponse(res, err, 200);

    })

}


module.exports.allProjectHasTestCases = async (req, res, next) => {


    const {admin_id, project_id} = req.params;
    await requestsByAdminAndProjectId(admin_id, project_id, (requests) => {

        let not_have_test_cases = 0;
        let message = '';
        for (let index = 0; index < requests.length; index++) {
            const request = requests[index]
            // console.log(request[])


            // console.log(request['test_cases'])
            if (request['test_cases']) {
                if (request['test_cases'].length === 0) {
                    console.log('we foun one')
                    not_have_test_cases = not_have_test_cases + 1
                    console.log(not_have_test_cases)
                    message += `${request['title']} must have at least test cases - \n`
                }
            }

            if (index === requests.length - 1) {
                console.log(not_have_test_cases)
                if (not_have_test_cases > 0) {
                    sendJsonResponse(res, {'all_has_at_least_one_test_case': false, 'message': message}, 200);

                } else {
                    sendJsonResponse(res, {'all_has_at_least_one_test_case': true}, 200);

                }

            }

        }


        // sendJsonResponse(res, requests, 200);

    }, (err) => {
        sendJsonResponse(res, {message: err.message}, 200);

    })

}


////

// module.exports.todo = async (req, res, next) => {
//
//
//     const {admin_id, project_id} = req.params;
//     await requestsByAdminAndProjectId(admin_id, project_id, (requests) => {
//
//         let request_with_info = []
//
//         for (let index = 0; index < requests.length; index++) {
//             const  request= requests[index]
//             request_with_info.push(
//                 {
//                     _id : request['_id'] ,
//
//                 }
//             )
//         }
//         sendJsonResponse(res, requests, 200);
//
//     }, (err) => {
//         sendJsonResponse(res, err, 200);
//
//     })
//
// }

module.exports.progress = async (req, res, next) => {


    const {admin_id, project_id} = req.params;
    await requestsByAdminAndProjectId(admin_id, project_id, (requests) => {

        if (requests.length > 0) {
            let checkedList = requests.filter(function (request) {
                return request['done_by_front_end_developer'];
            })

            console.log('we have data')
            let progrss = Math.floor((checkedList.length / requests.length) * 100)

            sendJsonResponse(res, {progress: progrss !== null ? progrss : 0}, 200);


        } else {
            sendJsonResponse(res, {progress: 0}, 200);

        }


    }, (err) => {
        sendJsonResponse(res, err, 200);

    })

}


module.exports.doTesting = async (req, res, next) => {
//request_id
    const {admin_id, project_id, request_id} = req.params;
    await requestByAdminAndProjectId(admin_id, project_id, request_id, async (request) => {

        // console.log(request)
        let start = Date.now();


        const testCases = request['test_cases'];


        try {

            const response = await testRequest(request);
            // console.log(response['res']['IncomingMessage'])
            let millis = Date.now() - start;


            //now run test case against api result


            sendJsonResponse(res, {
                "title": request['title'],
                "response": response.data,
                "test_cases_result": runTestCases(testCases, response.status, millis),
                "status": response.status,
                "time": millis >= 1000 ? Math.floor(millis / 1000) + "-s" : millis + "-ms"
            }, 200);
        } catch (e) {

            let millis = Date.now() - start;
            console.log(e.response)
            sendJsonResponse(res, {
                "title": request['title'],
                "response": e.response.data,
                "status": e.response.status,
                "test_cases_result": runTestCases(testCases, e.response.status, millis),
                "time": millis >= 1000 ? Math.floor(millis / 1000) + "-s" : millis + "-ms"
            }, 200);

        }


    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}


//doTesting

module.exports.create = async (req, res, next) => {
    const {admin_id, project_id, request_id} = req.params;
    const {description, title, done_by_front_end_developer} = req.body;

    await requestsByAdminAndProjectId(admin_id, project_id, async (requests, admin) => {
        requests.push(
            {
                description: description,
                title: title,
                method: 'get',
                done_by_front_end_developer: false
            }
        );
        const _admin = await admin.save();
        sendJsonResponse(res, {"message": "created successfully"}, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })
}


module.exports.show = async (req, res, next) => {

    const {admin_id, project_id, request_id} = req.params;
    await requestByAdminAndProjectId(admin_id, project_id, request_id, async (request) => {

        sendJsonResponse(res, request, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}


module.exports.update = async (req, res, next) => {

    const {admin_id, project_id, request_id} = req.params;
    const {title, description, method, url, done_by_front_end_developer, response} = req.body;

    await requestByAdminAndProjectId(admin_id, project_id, request_id, async (request, admin) => {


        request.set({
            title: title ? title : request["title"],
            description: description ? description : request["description"],
            method: method ? method : request["method"],
            response: response ? response : request['response'],
            url: url ? url : request["url"],
            done_by_front_end_developer: done_by_front_end_developer ? done_by_front_end_developer : request["done_by_front_end_developer"]
        });
        await admin.save();
        sendJsonResponse(res, {"message": "updated successfully"}, 200);
    }, (err) => {
        sendJsonResponse(res, err, 200);
    })

}
module.exports.delete = async (req, res, next) => {

    const {admin_id, project_id, request_id} = req.params;
    await requestByAdminAndProjectId(admin_id, project_id, request_id, async (request, admin) => {
        request.remove();
        await admin.save();
        sendJsonResponse(res, {"message": "Deleted successfully"}, 200);
    }, (err) => {
        sendJsonResponse(res, err, 400);
    })

}










