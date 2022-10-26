import axios from 'axios';
import {Config} from "./config";
import {UserSession} from "./users_session_services";


export class RequestParamsService {


    static getAll(admin_id, project_id, request_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request/${request_id}/params/index`, {
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


    static create(admin_id, project_id, request_id, key, value) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request/${request_id}/params/create`, {
                    key, value
                }, {
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


    static update(admin_id, project_id, request_id, param_id, key, value) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.put(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request/${request_id}/params/update/${param_id}`, {
                    key, value
                }, {
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


    static delete(admin_id, project_id, request_id, param_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.delete(Config.getUrl() + `/user/${admin_id}/project/${project_id}/request/${request_id}/params/delete/${param_id}`, {
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
