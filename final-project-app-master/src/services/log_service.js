import axios from 'axios';
import {Config} from "./config";
import {UserSession} from "./users_session_services";


export class LogService {


    //get all commits
    static allLog(admin_id, project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `user/${admin_id}/project/${project_id}/log/index`, {
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


    static createLog(admin_id, project_id, worker_oid, event_message) {
        console.log(event_message)
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + `user/${admin_id}/project/${project_id}/log/create`, {
                    worker_oid, event_message
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


}
