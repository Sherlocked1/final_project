import axios from 'axios';
import {Config} from "./config";
import {UserSession} from "./users_session_services";


export class DashboardService {


    static getProjectCount(project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `project/count/${project_id}`, {
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

//
    static getProjectCommitsPerMonths(project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `project/commits_per_months/${project_id}`, {
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


//

    static getProjectVersionsPerMonths(project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `project/versions_per_months/${project_id}`, {
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

//
    static getProjectCollaborators(project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `project/collaborators/${project_id}`, {
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
