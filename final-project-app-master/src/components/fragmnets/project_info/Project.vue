<template>
    <div class="parent">
        <vs-row>
            <vs-col vs-type="flex" vs-w="0.5">
                <div class="parentx-static">

                    <div id="parentx">


                        <vs-sidebar :hidden-background="true" :reduce="active" :reduce-not-hover-expand="false"
                                    :default-index="default_index" color="primary" class="sidebarx" spacer
                                    v-model="active">

                            <div class="header-sidebar" slot="header">
                                <vs-avatar size="70px" :src="this.$store.state.profile_image_path"/>
                            </div>


                            <vs-sidebar-item v-if="role==='admin'" :to="app_routes[0]" index="0" icon="dashboard">
                                Dashboard
                            </vs-sidebar-item>
                            <vs-sidebar-item v-if="role==='admin'" :to="app_routes[1]" index="1" icon="group">
                                Team
                            </vs-sidebar-item>
                            <vs-sidebar-item v-if="role==='tester'" :to="app_routes[2]" index="2" icon="build">
                                Tool
                            </vs-sidebar-item>
                            <vs-sidebar-item v-if="role==='admin' || role==='front_end_dev' || role==='tester'"
                                             :to="app_routes[3]" index="3" icon="message">
                                Chat
                            </vs-sidebar-item>
                            <vs-sidebar-item v-if="role==='admin' || role==='front_end_dev' || role==='tester'"
                                             :to="app_routes[4]"
                                             index="4" icon="share">
                                Commits
                            </vs-sidebar-item>
                            <vs-sidebar-item v-if="role==='admin'  || role==='front_end_dev' || role==='tester'"
                                             :to="app_routes[5]"
                                             index="5" icon="all_inclusive">
                                Versions
                            </vs-sidebar-item>
                            <vs-sidebar-item v-if="role==='front_end_dev'" :to="app_routes[6]" index="6"
                                             icon="devices_other">
                                Api consumer
                            </vs-sidebar-item>
                            <vs-sidebar-item v-if="role==='admin'" :to="app_routes[7]" index="7" icon="event_note">
                                Project Events
                            </vs-sidebar-item>

                            <div class="footer-sidebar" slot="footer">
                                <vs-button to="/my_projects" icon="arrow_back_ios" color="primary"
                                           type="border"></vs-button>
                            </div>

                        </vs-sidebar>
                    </div>

                </div>

            </vs-col>
            <vs-col vs-w="0.5" class="mt-3"></vs-col>
            <vs-col vs-w="11" class="mt-5">
                <router-view></router-view>
            </vs-col>
        </vs-row>
    </div>

</template>

<script>
    import {UserSession} from "../../../services/users_session_services";

    var pusher = new Pusher('d736889d89b7aa399d13', {
        cluster: 'ap2',
        forceTLS: true
    });
    export default {
        name: "ProjectStatistics",

        beforeCreate() {
            this.role = this.$route.query['role']
            this.admin_id = this.$route.query['admin_id']
        },


        created() {
            this.role = this.$route.query['role']
            this.admin_id = this.$route.query['admin_id']

            if (this.role === 'admin') {
                this.default_index = 0
            } else if (this.role === 'tester') {
                this.default_index = 2
            } else if (this.role === 'front_end_dev') {
                this.default_index = 6
            }

            this.listenForMessages()
        },
        data() {


            return {
                active: true,
                role: '',
                admin_id: '',
                default_index: 0,
                app_routes: [
                    `/project/${this.$route.params['p_id']}/${this.role}/dashboard?role=${this.role}&admin_id=${this.admin_id}`,
                    `/project/${this.$route.params['p_id']}/${this.role}/collaborator?role=${this.role}&admin_id=${this.admin_id}`,
                    `/project/${this.$route.params['p_id']}/${this.role}/testing_tool?role=${this.role}&admin_id=${this.admin_id}`,
                    `/project/${this.$route.params['p_id']}/${this.role}/chat?role=${this.role}&admin_id=${this.admin_id}`,
                    `/project/${this.$route.params['p_id']}/${this.role}/commits?role=${this.role}&admin_id=${this.admin_id}`,
                    `/project/${this.$route.params['p_id']}/${this.role}/versions?role=${this.role}&admin_id=${this.admin_id}`,
                    `/project/${this.$route.params['p_id']}/${this.role}/front_dev?role=${this.role}&admin_id=${this.admin_id}`,
                    `/project/${this.$route.params['p_id']}/${this.role}/log?role=${this.role}&admin_id=${this.admin_id}`,
                ],
                hide: false
            }
        },
        methods: {
            listenForMessages() {
                var app = this;

                var channel = pusher.subscribe(`project_no_${this.$route.params['p_id']}`);
                channel.bind('message_created', function (data) {
                    //    show new message here.
                    if (data.message.from['_id'] !== UserSession.getUserData()['_id']) {
                        app.$vs.notify({
                            title:  data.message.from["name"],
                            text: data.message["message"],
                            position: 'top-right',
                            icon:'message'
                        })

                    }


                });
            },

        }
    }
</script>

<style scoped>

    #parentx {
        height: 100%;
        width: 160px;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
    }

    .header-sidebar {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
    }

    .header-sidebar h4 {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    .header-sidebar h4 > button {
        margin-left: 10px;
    }

    .footer-sidebar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .footer-sidebar > button {
        border: 0px solid rgba(0, 0, 0, 0) !important;
        border-left: 1px solid rgba(0, 0, 0, 0.07) !important;
        border-radius: 0px !important;
    }


</style>
