<template>
    <div style="background-color: white; height: 100vh">
        <vs-row vs-type="flex"   vs-justify="center"   style="padding: 2%;" >
            <vs-col vs-w="6"  vs-xs="12" vs-type="flex">


                <vs-card vs-justify="start">


                    <vs-row vs-justify="center" vs-type="flex">
                        <vs-col vs-w="4" vs-lg="6"  vs-xs="6" vs-sm="4" >
                            <img src="@/assets/undraw_enter_uhqk.svg" width="100%" height="100%">
                        </vs-col>
                        <vs-col vs-w="8" vs-lg="6"  vs-xs="12"  vs-sm="12">

                            <h2 class="mt-3 ml-3">Welcome</h2>
                            <h6 style="color: gray" class="mt-3 ml-3">Sign to restify</h6>
                            <vs-alert v-if="err_message" title="Alert" active="true" color="danger">
                                {{err_message}}
                            </vs-alert>
                            <form @submit.prevent="submit">
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
                                    <vs-col vs-w="12" vs-type="flex" vs-justify="center">
                                        <vs-button to="/sign_up" color="success" type="flat">
                                            create
                                            new account
                                        </vs-button>
                                        <vs-button to="/password_reset" color="success"
                                                   type="flat">
                                            forget password ?
                                        </vs-button>


                                    </vs-col>
                                </vs-row>
                                <vs-col vs-w="12" class="mt-2" vs-type="flex" vs-justify="center">
                                    <vs-button @click="submit"
                                               color="primary"
                                               type="border"
                                               style="width: 80%"

                                               icon="open_in_browser">Sign in
                                    </vs-button>
                                </vs-col>


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
        name: "SignIn",
        data() {
            return {
                password: '',
                email: '',
                showError: false,
                error_data: "",
                err_message: null,
                isLoading: false
            }
        },
        validations: {
            email: {
                required, email
            },
            password: {
                required,
                minLength: minLength(6)
            }
        },
        methods: {
            submit() {
                this.$vs.loading()

                this.$v.$touch()
                if (this.$v.$invalid) {
                    // console.log('invalid')
                    // alert("invalid")
                    setTimeout(() => {
                        this.$vs.loading.close()
                    }, 1000);

                } else {

                    this.SignIn();
                }
            },
            SignIn() {
                // this.$vs.loading.close()
                AuthService.signIn(this.email, this.password).then((response) => {
                    UserSession.setToken(response["access_token"])
                    if (UserSession.isAuth()) {
                        console.log("is auth")
                        AuthService.getUserInfo(UserSession.getUserToken()).then((response) => {

                            UserSession.saveUserData(response).then(done => {
                                if (done) {
                                    this.$store.dispatch('shareUserName', response['user_name'])

                                    if (response['profile']) {
                                        if (response['profile']['profile_image_path']) {
                                            this.$store.dispatch('shareImageUrl', `http://139.59.140.220/api/users/profile_image/${response['profile']['profile_image_path']}`)
                                        }
                                    }

                                }
                            })

                            this.$vs.loading.close();
                            this.$router.push("/")
                        }).catch((err) => {
                            console.log(err.message)

                            this.err_message = err.toString();

                            this.$vs.loading.close();
                        })
                    }
                }).catch((err) => {
                    console.log(err.message)
                    this.err_message = err.response['data']['message'];

                    this.$vs.loading.close();
                })
            }
        }
    }
</script>

<style scoped>

</style>
