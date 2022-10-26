import axios from 'axios';
import {Config} from "./config";


export class AuthService {


    static signIn(email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + "auth", {
                    email, password

                });
                console.log(result.data)

                const data = result.data;
                resolve(data);
            } catch (e) {

                reject(e);
            }
        });
    }

    static signUp(email, password, name) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + "users", {
                    email, password, name
                });

                // console.log(re)

                try {
                    const result = await axios.post(Config.getUrl() + "auth", {
                        email, password
                    });
                    const data = result.data;
                    console.log(result.data)

                    resolve(data);
                } catch (e) {

                    reject(e.response.data['message']);
                }

            } catch (e) {
                reject(e.response.data['message']);
            }
        });


    }


    static passwordReset(email) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + "users/password_reset", {
                    email
                });
                const data = result.data;
                resolve(data);
            } catch (e) {

                reject(e);
            }
        });
    }


    static passwordChange(newPassword, resetToken) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + `users/password_change/${resetToken}`, {
                    "new_password": newPassword
                });
                const data = result.data;
                resolve(data);
            } catch (e) {
                reject(e);
            }
        });
    }


    static passwordUpdate(newPassword, oldPassword, user_token) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.put(Config.getUrl() + "users/update_password", {
                    "old_password": oldPassword,
                    "new_password": newPassword
                }, {
                    headers: {
                        "Authorization": `jwt ${user_token}`
                    }
                });
                const data = result.data;
                resolve(data);
            } catch (e) {
                reject(e);
            }
        });
    }


    static updateUserInfo(phone_num, about, job, name, token) {
        //users/5cc429961c3f8211e0e1277f/profile
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.put(Config.getUrl() + `users/update`, {
                    "phone_number": phone_num,
                    "about": about,
                    "name": name,
                    "job": job
                }, {
                    headers: {
                        "Authorization": `jwt ${token}`
                    }
                });
                const data = result.data;
                resolve(data);
            } catch (e) {
                if (e.response.status === 401)
                    reject("Unauthorized");
                else

                reject(e.response.data['message']);
            }
        });
    }


    static createProfile(about, job, token) {
        //users/5cc429961c3f8211e0e1277f/profile
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.post(Config.getUrl() + `users/profile`, {
                    "about": about,
                    "job": job
                }, {
                    headers: {
                        "Authorization": `jwt ${token}`
                    }
                });
                const data = result.data;
                resolve(data);
            } catch (e) {
                if (e.response.status === 401)
                    reject("Unauthorized");
                else
                    reject(e);
            }
        });
    }


    static getUserInfo(token) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(Config.getUrl() + "users", {
                    headers: {
                        "Authorization": `jwt ${token}`
                    }
                });

                const data = result.data;
                console.log(data['user'])

                resolve(data['user']);
            } catch (e) {

                console.log(e.response.status)

                if (e.response.status === 401)
                    reject("Unauthorized");
                else
                    reject(e.response.data['message']);
                //    log out


            }
        });
    }


    static uploadProfileImage(image, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let formData = new FormData();
                formData.append('profile_image', image);
                const result = await axios.post(Config.getUrl() + "users/profile/upload_profile_image", formData, {
                    headers: {
                        "Authorization": `jwt ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const data = result.data;
                resolve(data);
            } catch (e) {
                if (e.response.status === 401)
                    reject("Unauthorized");
                else
                    reject(e);
            }
        });
    }

}
