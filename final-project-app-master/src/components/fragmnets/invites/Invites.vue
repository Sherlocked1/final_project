<template>
    <div v-if="!load_invites">

        <vs-row class="mt-5">
            <vs-col vs-w="6" vs-offset="3">
                <vs-card v-if="invites.length>0">
                    <vs-list>
                        <vs-list-header title="Invites" color="success"></vs-list-header>
                        <vs-list-item  v-for="(invite , index) in invites" :key="index" :title="invite['admin']['name']"
                                      :subtitle="invite['admin']['name']+' ask you to join '+invite['project']['name']+' as '+invite['role']">
                            <template slot="avatar">
                                <vs-avatar :src="invite['admin']['avatar']"/>
                            </template>
                            <vs-button @click="acceptInvite(invite['_id'])" class="m-1" color="success" icon="done"
                                       type="border" radius></vs-button>
                            <vs-button @click="rejectInvite(invite['_id'])" class="m-1" color="danger" icon="clear"
                                       type="border" radius></vs-button>

                        </vs-list-item>
                    </vs-list>
                </vs-card>

                <AppHint v-else message="No invites yet"
                         image_name="undraw_subscriber_vabu.svg" w="300" h="300"/>
            </vs-col>
        </vs-row>

    </div>

</template>

<script>
    import {CollaborationsService} from "../../../services/collaboration_service";
    import AppHint from "../../partials/AppHint";

    export default {
        name: "Invites",
        components: {AppHint},
        data() {
            return {
                invites: [],
                load_invites  : true
            }
        },
        created() {
            this.getAllInvites();
        },
        methods: {
            getAllInvites() {
                this.load_invites=true
                this.$vs.loading()
                CollaborationsService.getMyInvites().then(response => {
                    this.invites = response;
                    this.$vs.loading.close();
                    this.load_invites =false
                }).catch(err => {
                    this.$vs.loading.close();
                    this.showErr(err)
                    this.load_invites=false
                })
            },
            acceptInvite(_id) {
                CollaborationsService.acceptInvite(_id).then(response => {
                    this.showSuccess(response['message'])
                    this.getAllInvites()
                }).catch(err => {
                    this.showErr(err)
                })
            },
            rejectInvite(_id) {

                CollaborationsService.rejectInvite(_id).then(response => {
                    this.showSuccess(response['message'])
                    this.getAllInvites()

                }).catch(err => {
                    this.showErr(err)
                })

            },
            showErr(err) {
                this.$vs.notify({
                    title: 'Alert',
                    text: err,
                    color: 'danger',
                    // icon: 'done'
                })
            },
            showSuccess(message) {
                this.$vs.notify({
                    title: 'Alert',
                    text: message,
                    color: 'success',
                    // icon: 'done'
                })
            }
        }
    }
</script>

<style scoped>

</style>
