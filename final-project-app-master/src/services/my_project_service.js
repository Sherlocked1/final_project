import axios from 'axios';
import {Config} from "./config";
import {UserSession} from "./users_session_services";


export class MyProjectService {


    static getAll() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + "project/index", {
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


    static show(admin_id, project_id) {

        console.log(admin_id)
        console.log(project_id)
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `user/${admin_id}/project/show/${project_id}`, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`
                    }
                });
                console.log(result.data)

                const data = result.data;
                resolve(data);
            } catch (e) {
                console.log(e)

                reject(e.response.data['message']);
            }
        });
    }


    static getAllWorkingProjects() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + "working_project/index", {
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


    static create(name, description) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + "project/create", {
                    name, description
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


    static update(project_id, name, description) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.put(Config.getUrl() + `project/update/${project_id}`, {
                    name, description

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


    static delete(project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.delete(Config.getUrl() + `project/delete/${project_id}`, {
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

    static projectProgress(admin_id, project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `user/${admin_id}/project/${project_id}/request/progress`, {
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
