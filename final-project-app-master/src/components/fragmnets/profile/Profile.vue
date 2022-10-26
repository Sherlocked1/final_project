<template>
    <div>


        <vs-row vs-type="flex"   vs-justify="center"  style="padding: 2%;" >
            <vs-col vs-w="6" vs-xs="12" vs-type="flex">

                <vs-card>

                    <vs-row vs-justify="center" vs-type="flex">
                        <vs-col vs-w="6" vs-xs="8" vs-sm="8">
                            <img src="@/assets/undraw_personal_information_962o.svg" width="100%" height="100%">
                        </vs-col>
                        <vs-col vs-w="6" vs-xs="12" vs-sm="12">

                            <div class="text-center">
                                <vs-avatar size="90px"
                                           :src="image_url"/>
                                <h6>{{this.$store.state.user_name}}</h6>

                                <input ref="file" type="file" hidden name="profile_image" v-on:change="handleFileInput">


                                <vs-button @click="$refs.file.click()" color="primary" type="border">Upload
                                </vs-button>
                                <vs-progress v-if="start_uploading" :percent="uploadPercentage" color="primary">primary</vs-progress>

                            </div>


                            <!--                    required stuff-->

                            <vs-input class="fw px-5" :danger="$v.fname.$error" :success="!$v.fname.$invalid"
                                      icon="account_box"


                                      success-text="valid first name"
                                      danger-text="Invalid first name"
                                      label-placeholder="first name" v-model.trim="$v.fname.$model"/>


                            <!--                        last name-->


                            <vs-input class="fw px-5"
                                      icon="phone"


                                      label-placeholder="phone number" v-model="phone_number"/>


                            <!--                    not required-->
                            <vs-input class="fw px-5" icon-no-border icon="business_center" label-placeholder="Your job"
                                      v-model="job"/>


                            <vs-input class="fw px-5" icon-no-border icon="info" label-placeholder="Your bio"
                                      v-model="bio"/>


                            <vs-row>
                                <vs-col vs-w="12" vs-type="flex" vs-justify="center">
                                    <vs-button @click="save" style="width: 60%" class="mt-3 text-center " color="success"
                                               type="border"
                                               icon="save">Save
                                    </vs-button>
                                </vs-col>
                            </vs-row>


                        </vs-col>

                    </vs-row>




                </vs-card>

            </vs-col>


        </vs-row>


        <vs-popup class="holamundo" title="Change Profile Image" :active.sync="uploadImagePopActive">
            <!--            <vs-upload fileName="profile_image" automatic action="https://localhost:3000/api/users/profile/upload_profile_image" @on-success="successUpload" @on-error="errUpload"/>-->


        </vs-popup>

    </div>

</template>

<script>
    import {required} from 'vuelidate/lib/validators'
    import {AuthService} from "../../../services/auth_service";
    import {UserSession} from "../../../services/users_session_services";
    import axios from "axios";

    export default {
        name: "Profile",
        data() {
            return {
                fname: '',
                phone_number: '',
                job: '',
                user: null,
                start_uploading: false,
                uploadPercentage: 0,
                bio: '',
                image_url: "https://via.placeholder.com/150/92c952",
                // email: ''
                uploadImagePopActive: false,
            }
        },
        validations: {

            fname: {
                required
            },


        },

        created() {

            this.getUserData();

        },
        methods: {

            handleFileInput(e) {
                console.log("file")

                this.start_uploading = true;

                let formData = new FormData();
                formData.append('profile_image', e.target.files[0]);
                axios.post("/api/users/profile/upload_profile_image", formData, {
                    headers: {
                        "Authorization": `jwt ${UserSession.getUserToken()}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
                        console.log(this.uploadPercentage)
                        this.start_uploading = false;

                    }
                }).then(response => {
                    console.log(response)
                    this.image_url = response.data['image_path']
                    this.start_uploading = false;
                    this.$store.dispatch('shareImageUrl', response.data['image_path'])

                }).catch(err => {
                    console.log(err)
                    this.start_uploading = false;
                })

            },

            getUserData() {

                this.$vs.loading();

                AuthService.getUserInfo(UserSession.getUserToken()).then(response => {
                    this.user = response;
                    this.$vs.loading.close()

                    this.fname = this.user['user_name'];


                    if (this.user['profile']['profile_image_path']) {
                        this.image_url = `http://139.59.140.220/api/users/profile_image/${this.user['profile']['profile_image_path']}`;

                    }

                    if (this.user['profile']['phone_number']) {
                        this.phone_number = this.user['profile']['phone_number'];
                    }

                    if (this.user['profile']['job']) {
                        this.job = this.user['profile']['job'];
                    }

                    if (this.user['profile']['about']) {
                        this.bio = this.user['profile']['about'];
                    }

                }).catch(err => {
                    this.$vs.loading.close()

                    if(err==="Unauthorized"){
                        setTimeout(() => {
                            this.$store.dispatch("logOut")
                        }, 1000);
                    }
                    console.log(err)

                })


            },
            successUpload() {

            },
            errUpload(e) {

                console.log(e)

            },

            saveProfileData() {

            },
            updateUserData() {
                AuthService.updateUserInfo(this.phone_number, this.bio, this.job, this.fname, UserSession.getUserToken())
                    .then(response => {


                        this.$store.dispatch('shareUserName', this.fname)
                        this.$vs.loading.close()
                        this.$vs.notify({
                            title: 'Alert',
                            text: response['message'],
                            color: 'success',
                            icon: 'done'
                        })

                        this.getUserData();

                    }).catch(err => {

                })


            },
            save() {
                this.$vs.loading();

                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.$vs.loading.close()
                } else {
                    this.updateUserData();
                }
            },

        }
    }
</script>

<style scoped>

    .fw {
        width: 100%;
    }


</style>
