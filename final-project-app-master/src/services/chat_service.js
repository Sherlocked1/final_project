import axios from 'axios';
import {Config} from "./config";
import {UserSession} from "./users_session_services";


export class ChatService {


    static getAllMessage(project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + `project/${project_id}/chat/messages`, {
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


    static sendMessage(project_id, message) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + `project/${project_id}/chat/create`, {
                    message

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


    static sendFile(project_id, file) {
        return new Promise(async (resolve, reject) => {
            try {
                let formData = new FormData();
                formData.append('chat_file', file);
                const result = await  axios.post(Config.getUrl() + `project/${project_id}/chat/create_file`, formData, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`,
                        'Content-Type': 'multipart/form-data'
                    },

                    onUploadProgress: (progressEvent) => {
                        // this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
                        // console.log(this.uploadPercentage)
                        // this.start_uploading = false;

                    }
                })
                console.log(result.data)

                const data = result.data;
                resolve(data);
            } catch (e) {
                reject(e.response.data['message']);
            }
        });
    }


    static deleteMessage(project_id, message_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.delete(Config.getUrl() + `project/${project_id}/chat/delete/${message_id}`, {
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
