<template>
    <div style="background-color: white; height: 100vh">
        <vs-row  vs-type="flex"   vs-justify="center"  style="padding: 2%;"  >
            <vs-col vs-w="6" vs-xs="12"vs-type="flex">

                <vs-card vs-justify="start">


                    <vs-row vs-justify="center" vs-type="flex">
                        <vs-col vs-w="6" vs-xs="6" vs-sm="4" >
                            <img src="@/assets/undraw_sign_in_e6hj.svg" width="100%" height="100%">
                        </vs-col>
                        <vs-col vs-w="6" vs-xs="12" vs-sm="12" >


                            <h2 class="mt-3 ml-3">Welcome</h2>
                            <h6 style="color: gray" class="mt-3 ml-3">Sign up to restify</h6>
                            <vs-alert v-if="err_message" title="Alert" active="true" color="danger">
                                {{err_message}}
                            </vs-alert>

                            <form @submit.prevent="submit">
                                <!--                        first name-->
                                <vs-input :danger="$v.f_name.$error" :success="!$v.f_name.$invalid" size="default"
                                          icon="account_box"
                                          style="width: 100%" class="p-3"
                                          label="First name"
                                          success-text="valid first name"
                                          danger-text="Invalid first name"
                                          placeholder="first name" v-model.trim="$v.f_name.$model"/>


                                <!--                        last name-->


                                <vs-input :danger="$v.l_name.$error" :success="!$v.l_name.$invalid" size="default"
                                          icon="account_box"
                                          style="width: 100%" class="p-3"
                                          label="Last name"
                                          success-text="valid last name"
                                          danger-text="Invalid last name"
                                          placeholder="last name" v-model.trim="$v.l_name.$model"/>


                                <vs-input size="default" :danger="$v.email.$error" :success="!$v.email.$invalid"
                                          icon="search"
                                          success-text="valid email"
                                          danger-text="invalid email"
                                          type="email"
                                          style="width: 100%" class="my-2 p-3" label="Email" placeholder="your email"
                                          v-model.trim="$v.email.$model"/>


                                <vs-input :danger="$v.password.$error" :success="!$v.password.$invalid" size="default"
                                          icon="lock" type="password"
                                          style="width: 100%" class="p-3"
                                          label="Password"
                                          success-text="valid password"
                                          danger-text="The password does not meet the standards min password character is 6"
                                          placeholder="password" v-model.trim="$v.password.$model"/>

                                <vs-row>
                                    <vs-col vs-w="6" vs-offset="3">

                                        <vs-button to="/sign_in" class="mt-3 text-center " color="success" type="flat">
                                            already
                                            have account?
                                        </vs-button>

                                    </vs-col>
                                </vs-row>
                                <vs-row>
                                    <vs-col vs-w="12" vs-type="flex" vs-justify="center">
                                        <vs-button @click="submit" style="width: 80%" class="mt-3 text-center "
                                                   color="primary"
                                                   type="border"
                                                   icon="open_in_browser">Sign up
                                        </vs-button>


                                    </vs-col>
                                </vs-row>
                            </form>
                        </vs-col>



                    </vs-row>


                </vs-card>


            </vs-col>
        </vs-row>

    </div>

</template>

<script>
    import {required, minLength, email} from 'vuelidate/lib/validators'
    import {AuthService} from "../../services/auth_service";
    import {UserSession} from "../../services/users_session_services";

    export default {
        name: "SignUp",
        data() {
            return {
                password: '',
                email: '',
                f_name: '',
                l_name: '',
                showError: false,
                err_message: "",
                isLoading: false
            }
        },
        validations: {
            email: {
                required, email
            },
            f_name: {
                required
            },
            l_name: {
                required
            },
            password: {
                required,
                minLength: minLength(6)
            }
        },
        methods: {
            submit() {

                this.$v.$touch()
                if (this.$v.$invalid) {
                    // console.log('invalid')
                    // alert("invalid")
                    // setTimeout(() => {
                    //     this.$vs.loading.close()
                    // }, 1000);

                } else {
                    this.$vs.loading()

                    this.signUp();
                }
            },
            signUp() {
                AuthService.signUp(this.email, this.password, this.f_name + " " + this.l_name).then((response) => {
                    UserSession.setToken(response["access_token"]);
                    if (UserSession.isAuth()) {
                        AuthService.getUserInfo(UserSession.getUserToken()).then((response) => {
                            UserSession.saveUserData(response).then(done => {
                                if (done) {
                                    this.$store.dispatch('shareUserName', response['user_name'])
                                    if (response['profile']) {
                                        if (response['profile']['profile_image_path']) {
                                            this.$store.dispatch('shareImageUrl', `http://localhost:3000/api/users/profile_image/${response['profile']['profile_image_path']}`)
                                        }
                                    }

                                }
                            })
                            this.$vs.loading.close();
                            this.$router.push("/")
                        }).catch((err) => {
                            this.err_message = err
                            this.$vs.loading.close();
                        })
                    } else {

                        this.$vs.loading.close();

                    }
                }).catch((err) => {
                    this.err_message = err
                    this.$vs.loading.close();
                })
            }
        }
    }
</script>

<style scoped>

</style>
