export class UserSession {


    static setToken(token) {

        localStorage.setItem("token", token);

    }

    static updateProfielImage(image_path) {

        localStorage.setItem("profile_image_path", image_path);

    }

    static updateUserName(name) {

        localStorage.setItem("name", name);

    }


    static getUserName() {

        return localStorage.getItem("name");

    }

    static saveUserData(user) {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem("email", user["email"]);
                localStorage.setItem("_id", user["_id"]);
                this.updateUserName(user["user_name"]);

                if (user['profile']) {
                    if (user['profile']['profile_image_path']) {
                        localStorage.setItem("profile_image_path", `http://localhost:3000/api/users/profile_image/${user['profile']['profile_image_path']}`);
                    }
                }
                resolve(true);
            } catch (e) {
                resolve(false)
            }
        })

    }


    static getImageUrl() {
        return localStorage.getItem("profile_image_path")

    }

    static getUserData() {
        return {
            "email": localStorage.getItem("email"),
            "name": this.getUserName(),
            "_id": localStorage.getItem("_id"),

        };
    }


    static destroySession() {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        localStorage.removeItem("_id");
        localStorage.removeItem("profile_image_path");

    }

    static getUserToken() {
        return localStorage.getItem("token");
    }

    static isAuth() {
        console.log(this.getUserToken())
        return this.getUserToken() !== 'undefined' && this.getUserToken() !== null;
    }


}



