import axios from 'axios';
import {Config} from "./config";
import {UserSession} from "./users_session_services";


export class CollaborationsService {


    static searchUserByEmail(email) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `users/search/${email}`, {
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


    static inviteStakeHolder(p_oid, stake_holder_oid, role) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + `invite/send`, {
                    "p_oid": p_oid,
                    "stake_holder_oid": stake_holder_oid,
                    "admin_oid": UserSession.getUserData()["_id"],
                    "role": role
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


    static getMyInvites() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `invite/index`, {
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

    static count() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `invite/count`, {
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

    static acceptInvite(invite_oid) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + `invite/accept/${invite_oid}`, {}, {
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


    static rejectInvite(invite_oid) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.delete(Config.getUrl() + `invite/reject/${invite_oid}`, {
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


    static removeCollaboratorFromProject(working_project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.delete(Config.getUrl() + `working_project/remove_from_project/${working_project_id}`, {
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
