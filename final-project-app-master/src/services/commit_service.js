import axios from 'axios';
import {Config} from "./config";
import {UserSession} from "./users_session_services";
import {LogService} from "./log_service";


export class CommitService {


    //get all commits
    static allCommit(admin_id, project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `user/${admin_id}/project/${project_id}/commit/index`, {
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


    static createCommit(admin_id, project_id, author_oid, commit_message) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + `user/${admin_id}/project/${project_id}/commit/create`, {
                    author_oid, commit_message
                }, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    }
                });
                LogService.createLog(admin_id, project_id, UserSession.getUserData()['_id'], 'create new commit ')
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


    static deleteCommit(admin_id, project_id, commit_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.delete(Config.getUrl() + `user/${admin_id}/project/${project_id}/commit/delete/${commit_id}`, {
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
