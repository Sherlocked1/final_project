<template>
    <div>
        <vs-card>
            <vs-list>
                <vs-list-header title="Tester/Developer" color="primary" icon="build"></vs-list-header>
                <vs-list-item v-for="(item , index) in dev_dev" :key="index" title="Steve Jobes">
                    <template slot="avatar">
                        <vs-avatar src="https://i.pravatar.cc/150?u="/>
                    </template>
                    <vs-button color="danger" type="flat" icon="close"></vs-button>
                </vs-list-item>

                <vs-list-header title="Front End Developer" icon="laptop_mac" color="primary"></vs-list-header>
                <vs-list-item v-for="item in front_end_dev" :key="item" title="Xian Famous Foods">
                    <template slot="avatar">
                        <vs-avatar src="https://i.pravatar.cc/150?u="/>
                    </template>
                    <vs-button color="danger" type="flat" icon="close"></vs-button>

                </vs-list-item>
            </vs-list>
        </vs-card>
    </div>
</template>

<script>
    import {DashboardService} from "../../../../services/dashboard_service";

    export default {
        name: "ProjectCollaborators",
        data() {
            return {

                p_id : this.$route.params['p_id'],
                collaborators : []
            }
        },
        created() {
            this.getCollaborators();
        },
        methods: {
            getCollaborators() {
                DashboardService.getProjectCollaborators(this.p_id).then(response => {
                    this.collaborators = response;
                }).catch(err => {
                    this
                        .showErr(err)

                })
            }
        }
    }
</script>

<style scoped>

</style>
