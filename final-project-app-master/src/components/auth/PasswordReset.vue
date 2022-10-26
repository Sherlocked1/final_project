<template>
    <div style="background-color: white; height: 100vh">
        <vs-row vs-type="flex"   vs-justify="center"   style="padding: 2%;" >
            <vs-col vs-w="6" vs-xs="12" vs-type="flex">

                <vs-card vs-justify="start">

                    <vs-row vs-justify="center" vs-type="flex">
                        <vs-col vs-w="6" vs-xs="6" vs-sm="4" >
                            <img src="@/assets/undraw_forgot_password_gi2d.svg" width="100%" height="100%">
                        </vs-col>
                        <vs-col vs-w="6" vs-xs="12" vs-sm="12" >
                            <form @submit.prevent="submit">
                                <h2 class="mt-3 ml-3">Forget password?</h2>
                                <h6 style="color: gray" class="mt-3 ml-3">Use your email to reset your password </h6>
                                <vs-alert v-if="err_message" title="Alert" active="true" color="danger">
                                    {{err_message}}
                                </vs-alert>

                                <vs-input size="default" :danger="$v.email.$error" :success="!$v.email.$invalid"
                                          icon="search"
                                          success-text="valid email"
                                          danger-text="invalid email"
                                          type="email"
                                          style="width: 100%" class="my-2 p-3" label="Email" placeholder="your email"
                                          v-model.trim="$v.email.$model"/>


                                <vs-row>
                                    <vs-col vs-w="12"  vs-type="flex" vs-justify="center">
                                        <vs-button @click="submit" style="width: 80%" color="primary"
                                                   type="border"
                                                   icon="open_in_browser">Password Reset
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
    import {required, email} from 'vuelidate/lib/validators'
    import {AuthService} from "../../services/auth_service";

    export default {
        name: "PasswordReset",
        data() {
            return {
                email: '',

                showError: false,
                err_message: null,
                isLoading: false
            }
        },
        validations: {
            email: {
                required, email
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
                    // alert("valid")
                    setTimeout(() => {
                        this.$vs.loading.close()
                    }, 2000);
                    // console.log('valid')
                    this.isLoading = true
                    this.passwordReset();
                }
            },
            passwordReset() {


                AuthService.passwordReset(this.email).then((response) => {

                    console.log(response['message'])
                    this.$vs.loading.close()

                    this.$vs.notify({title: 'Alert', text: response['message'], color: 'primary', icon: 'mail'})

                }).catch((err) => {
                    console.log(err.response.data['message'])
                    this.err_message = err.response.data['message']
                    this.$vs.loading.close()

                })

            }
        }
    }
</script>

<style scoped>

</style>
