<template>
    <div>
        <vs-card>
            <vs-row vs-type="flex" vs-justify="space-between">
                <vs-col vs-w="4" vs-xs="12" style="margin-bottom: 2%">

                    <!--                    <v-select :options="options"></v-select>-->
                    <VueSelect style="padding-right: 4%; margin-top: 0.8%" @input="setSelectedRole" width="80%"
                               :options="roles" label="text" index="value" v-model="selectedRole" />


                    <!--                    <vs-select-->
                    <!--                            class="selectExample"-->
                    <!--                            size="large"-->
                    <!--                            width="80%"-->
                    <!--                            v-model="selectedRole"-->
                    <!--                    >-->
                    <!--                        <vs-select-item v-for="(role ,index) in roles" :key="index" :value="role.value"-->
                    <!--                                        :text="role.text"-->
                    <!--                        />-->
                    <!--                    </vs-select>-->

                </vs-col>
                <vs-col vs-w="6" vs-xs="8" style="margin-bottom: 2%">
                    <vs-input :danger="$v.email.$error" :success="!$v.email.$invalid"
                              icon="mail"
                              success-text="valid email"
                              danger-text="invalid email"
                              type="email"
                              v-model.trim="$v.email.$model"
                              style="width: 100%" size="default" placeholder="collaborator email"
                              v-model="email"/>
                </vs-col>
                <vs-col vs-w="2" vs-xs="4">
                    <vs-button @click="search" class="ml-3" size="default" color="primary" icon="search"
                               type="filled">
                    </vs-button>
                </vs-col>


            </vs-row>

            <!--                    search result-->
            <CollaboratorsSearchResult @send_invite="sendInvite"
                                       :collaborators="search_result"></CollaboratorsSearchResult>
        </vs-card>
    </div>
</template>

<script>
    import {required, email} from 'vuelidate/lib/validators'
    import CollaboratorsSearchResult from "./CollaboratorsSearchResult";
    import {CollaborationsService} from "../../../../services/collaboration_service";
    import {UserSession} from "../../../../services/users_session_services";

    import VueSelect from 'vue-select'

    export default {
        name: "InviteCollaborator",
        components: {CollaboratorsSearchResult, VueSelect},
        data() {
            return {
                email: '',
                selectedRole: 'Devloper/Tester',
                search_result: [],
                roles: [{text: 'Devloper/Tester', value: 'Devloper/Tester'}, {
                    text: 'FrontEnd Developer',
                    value: "FrontEnd Developer"
                }],
            }
        },
        validations: {
            email: {
                required, email
            },

        },
        methods: {


            //on role change from drop downlist
            setSelectedRole(role) {
                if (role != null) {
                    this.selectedRole = role['value']
                }
            },

            sendInvite(id) {


                    this.$vs.loading()
                    CollaborationsService.inviteStakeHolder(this.$route.params['p_id'], id, this.selectedRole)
                        .then(response => {
                            this.$vs.loading.close();
                            if (response['status'] === 'success') {
                                this.$vs.notify({
                                    title: 'Alert',
                                    text: "Invite sent successfully",
                                    color: 'success',
                                    // icon: 'done'
                                })
                            }

                        }).catch(err => {
                        this.$vs.loading.close();
                        this.showErrAlert(err)

                    })


            },
            search() {
                //

                this.$v.$touch()
                if (this.$v.$invalid) {
                    // console.log('invalid')
                    // alert("invalid")
                    this.$vs.loading.close()


                } else {

                    this.$vs.loading()
                    if (this.email !== UserSession.getUserData()['email']) {
                        CollaborationsService.searchUserByEmail(this.email).then(response => {
                            this.search_result = response;
                            this.$vs.loading.close()

                        }).catch(err => {
                            this.showErrAlert(err)
                        })
                    } else {
                        this.$vs.notify({
                            title: 'Alert',
                            text: "You cant not invite your self for project that belong to you",
                            color: 'warning',
                            // icon: 'done'
                        })

                        setTimeout(() => {
                            this.$vs.loading.close()
                        }, 1000);
                    }


                }
            },
            showErrAlert(err) {
                this.$vs.notify({
                    title: 'Alert',
                    text: err,
                    color: 'danger',
                    // icon: 'done'
                })
            }
        }
    }
</script>

<style scoped>

</style>
