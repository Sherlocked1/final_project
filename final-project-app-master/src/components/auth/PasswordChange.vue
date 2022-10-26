<template>
    <div style="background-color: white; height: 100vh">
        <vs-row  vs-type="flex"   vs-justify="center"   style="padding: 2%;" >
            <vs-col vs-w="4" vs-xs="12"  vs-type="flex">

                <vs-card vs-justify="start">
                    <form @submit.prevent="submit">

                        <vs-input :danger="$v.newPassword.$error" :success="!$v.newPassword.$invalid" size="default"
                                  icon="lock" type="password"
                                  style="width: 100%" class="p-3"
                                  label="New Password"
                                  success-text="valid password"
                                  danger-text="The password does not meet the standards min password character is 6"
                                  placeholder="new password" v-model.trim="$v.newPassword.$model"/>
                        <vs-row>
                            <vs-col vs-w="6" vs-offset="3">
                                <vs-button @click="submit" style="width: 100%" class="mt-3 text-center " color="primary"
                                           type="border"
                                           icon="open_in_browser">Change Password
                                </vs-button>
                            </vs-col>
                        </vs-row>
                    </form>
                </vs-card>


            </vs-col>
        </vs-row>

    </div>

</template>

<script>
    import {required, minLength} from 'vuelidate/lib/validators'
    import {AuthService} from "../../services/auth_service";

    export default {
        name: "PasswordChange",
        data() {
            return {
                newPassword: '',
                showError: false,
                err_message: "",
                isLoading: false
            }
        },
        validations: {

            newPassword: {
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
                    // alert("valid")

                    // console.log('valid')
                    this.isLoading = true
                    this.passwordChange();
                }
            },
            passwordChange() {
                AuthService.passwordChange(this.newPassword, this.$route.query.token)
                    .then((response) => {
                        this.$vs.loading.close()
                        this.$vs.notify({
                            title: 'Alert',
                            text: 'password changed successfully',
                            color: 'success',
                            icon: 'done'
                        })

                        setTimeout(() => {

                            this.$router.push("/sign_in")
                        }, 2000);
                    })
                    .catch((err) => {
                        this.err_message = err.response.data['message']

                    })

            }
        }
    }
</script>

<style scoped>

</style>
