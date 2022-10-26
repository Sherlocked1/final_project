import axios from 'axios';
import {Config} from "./config";
import {UserSession} from "./users_session_services";
import {LogService} from "./log_service";
import {req} from "vuelidate/src/validators/common";


export class RequestsService {


    static allRequests(admin_id, project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request`, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    }
                });
                console.log(result.data)

                const data = result.data;
                resolve(data);
            } catch (e) {

                reject(e.response.data['message']);
            }
        });
    }


    static createRequest(admin_id, project_id, title, description, worker_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request/create`, {
                    title, description
                }, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    }
                });

                LogService.createLog(admin_id, project_id, worker_id, 'create new request ')
                    .then(res => {
                        console.log(result.data)

                        const data = result.data;
                        resolve(data);
                    }).catch(e => {
                    reject(e.response.data['message']);

                })

            } catch (e) {

                reject(e.response.data['message']);
            }
        });
    }


    // update gog here
    static updateRequestTitleAndDescription(admin_id, project_id, request_id, title, description, worker_id, request_name) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.put(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request/update/${request_id}`, {
                    title, description
                }, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    }
                });

                LogService.createLog(admin_id, project_id, worker_id, 'update request title and description for request name  ' + request_name)
                    .then(res => {
                        console.log(result.data)

                        const data = result.data;
                        resolve(data);
                    }).catch(e => {
                    reject(e.response.data['message']);

                })
            } catch (e) {

                reject(e.response.data['message']);
            }
        });
    }


    static updateRequestMethodAndUrl(admin_id, project_id, request_id, method, url, worker_id, request_name) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.put(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request/update/${request_id}`, {
                    method, url
                }, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    }
                });
                LogService.createLog(admin_id, project_id, worker_id, 'update request method and url for request name  ' + request_name)
                    .then(res => {
                        console.log(result.data)

                        const data = result.data;
                        resolve(data);
                    }).catch(e => {
                    reject(e.response.data['message'].toString());

                })
            } catch (e) {

                reject(e.response.data['message']);
            }
        });
    }


    static updateRequestResponse(admin_id, project_id, request_id, response, worker_id, request_name) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.put(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request/update/${request_id}`, {
                    response
                }, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    }
                });
                LogService.createLog(admin_id, project_id, worker_id, 'update request response for request name  ' + request_name)
                    .then(res => {
                        console.log(result.data)

                        const data = result.data;
                        resolve(data);
                    }).catch(e => {
                    reject(e.response.data['message']);

                })
            } catch (e) {

                reject(e.response.data['message']);
            }
        });
    }


    static doneByFrontEndDeveloperDeveloper(admin_id, project_id, request_id, done, worker_id, request_name) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.put(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request/update/${request_id}`, {
                    "done_by_front_end_developer": done
                }, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    }
                });
                console.log(request_name)
                LogService.createLog(admin_id, project_id, worker_id, `connect ${request_name} request with client`)
                    .then(res => {
                        console.log(result.data)

                        const data = result.data;
                        resolve(data);
                    }).catch(e => {
                    reject(e.response.data['message']);

                })
            } catch (e) {

                reject(e.response.data['message']);
            }
        });
    }


    static removeRequest(admin_id, project_id, request_id, worker_id, request_name) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.delete(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request/delete/${request_id}`, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    }
                });
                LogService.createLog(admin_id, project_id, worker_id, `delete  ${request_name}  request `)
                    .then(res => {
                        console.log(result.data)

                        const data = result.data;
                        resolve(data);
                    }).catch(e => {
                    reject(e.response.data['message']);

                })
            } catch (e) {

                reject(e.response.data['message']);
            }
        });
    }

//    run request

    static runRequest(admin_id, project_id, request_id, source) {



        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request/test_request/${request_id}`, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    },
                    // cancelToken: source.token

                });
                console.log(result.data)

                const data = result.data;
                resolve(data);
            } catch (e) {

                reject(e.message.toString());
            }
        });
    }


    static allProjectHasTestCases(admin_id, project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request/allProjectHasTestCases`, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    }
                });
                console.log(result.data)

                const data = result.data;
                resolve(data);
            } catch (e) {

                reject(e.response.data['message']);
            }
        });
    }
}
