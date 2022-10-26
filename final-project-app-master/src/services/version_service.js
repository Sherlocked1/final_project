import axios from 'axios';
import {Config} from "./config";
import {UserSession} from "./users_session_services";
import {LogService} from "./log_service";


export class VersionService {


    //get all commits
    static allVersion(admin_id, project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `user/${admin_id}/project/${project_id}/version/index`, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    }
                });

                const data = result.data;
                resolve(data);
            } catch (e) {

                reject(e.response.data['message']);
            }
        });
    }


    static createVersion(admin_id, project_id, author_oid, release_note, version_name) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + `user/${admin_id}/project/${project_id}/version/create`, {
                    author_oid, release_note, version_name
                }, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    }
                });

                LogService.createLog(admin_id, project_id, UserSession.getUserData()['_id'], 'create new version ')
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


    static deleteVersion(admin_id, project_id, commit_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.delete(Config.getUrl() + `user/${admin_id}/project/${project_id}/version/delete/${commit_id}`, {
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
