<template>
    <div>
        <vs-row class="mt-5">
            <vs-col  vs-xs="1"/>
            <vs-col vs-w="6"  vs-xs="10">
                <ProjectStakeHolders @remove_collaborator="remove_collaborator" v-if="collaborators"
                                     :collaborators="collaborators" :manage="true"></ProjectStakeHolders>
                <InviteCollaborator></InviteCollaborator>
            </vs-col>
            <vs-col  vs-xs="1"/>
        </vs-row>

    </div>
</template>

<script>
    import ProjectCollaborators from "./fragments/ProjectCollaborators";
    import InviteCollaborator from "./fragments/InviteCollaborator";
    import ProjectStakeHolders from "../dashboard/fragmnets/ProjectStakeHolders";
    import {DashboardService} from "../../../services/dashboard_service";
    import {CollaborationsService} from "../../../services/collaboration_service";

    export default {
        name: "Collaborators",
        components: {ProjectStakeHolders, InviteCollaborator, ProjectCollaborators},
        data() {
            return {

                p_id: this.$route.params['p_id'],
                collaborators: {}
            }
        },
        created() {
            this.getCollaborators();
        },
        methods: {
            remove_collaborator(id) {
                CollaborationsService.removeCollaboratorFromProject(id)
                    .then(response => {
                        this.$vs.notify({
                            title: 'Alert',
                            text: response['message'],
                            color: 'success',
                            // icon: 'done'
                        })
                        this.getCollaborators();
                    }).catch(err => {
                    this
                        .showErr(err)
                })
            },
            getCollaborators() {
                DashboardService.getProjectCollaborators(this.p_id).then(response => {
                    this.collaborators = response;
                }).catch(err => {
                    this
                        .showErr(err)

                })
            },
            showErr(err) {
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
