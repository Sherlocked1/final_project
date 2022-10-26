import vue from 'vue'


import Vuex from 'vuex';
import {UserSession} from "../services/users_session_services";
import {AuthService} from "../services/auth_service";

import {vm} from '../main'


vue.use(Vuex);


const user = UserSession.getUserData();

export default {
//    we have 5 method to use
//    1- State
    state:
        {
            currentUser: user,
            user_token: UserSession.getUserToken(),
            isLoggedIn: !!user,
            loading: false,
            updating: false,
            auth_error: null,
            password_reset_message: null,
            password_reset_err: false,
            password_change_message: null,
            password_update_message: null,
            error_message: null,
            user_name: UserSession.getUserName(),
            message: "",
            uploadingImage: false,
            profile_image_path: UserSession.getImageUrl()

        },
    getters:
        {
            isLoading(state) {
                return state.user_name;
            },
            getUserName(state) {
                return state.loading;
            },
            isLoggedIn(state) {
                return state.isLoggedIn;
            },
            currentUser(state) {
                return state.currentUser;
            },
            getErrorData(state) {
                return state.auth_error;
            },
            getUserToken(state) {
                return state.user_token;
            },


        }
    ,
    actions:
        {

            logOut({commit}) {
                commit("logout");
                vm.$router.push('/sign_in');

            },
            prepareUserData({commit}, payload) {
                commit("setUserData", payload);
            },
            getUserData({commit, state}) {
                commit("gettingUserData");
                AuthService.getUserInfo(state.user_token)
                    .then((response) => {
                        commit("setUserData", response);

                    }).catch((err) => {
                    commit("setErrorUser", err);

                });
            },

            shareImageUrl({commit, state}, payload) {
                commit("finishUploadProfileImage", payload);
            },
            shareUserName({commit, state}, payload) {
                commit("share_user_name", payload);
            }
        },
    mutations:
        {


            share_user_name(state, payload) {

                state.user_name = payload;
                UserSession.updateUserName(payload)

            },

            finishUploadProfileImage(state, payload) {
                state.uploadingImage = false;
                state.message = "Uploading..";
                state.profile_image_path = payload;
                UserSession.updateProfielImage(payload)
            },

            setErrorUser(state, payload) {
                state.error_data = payload;
                state.loading = false;
            },
            gettingUserData(state) {
                state.loading = true;
            },

            setUserData(state, payload) {
                state.currentUser = payload;
                state.loading = false;
            },

            logout(state) {
                UserSession.destroySession();
                state.currentUser = null
                state.isLoggedIn = false;
                state.user_token = ""
                state.profile_image_path=""
                state.user_name=""
                state.auth_error = null
            }

        }
}
