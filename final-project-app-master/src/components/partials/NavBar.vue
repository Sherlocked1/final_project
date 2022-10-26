<template>
    <div id="parentx" v-if="show">


        <vs-navbar v-model="activeItem" class="nabarx">
            <div slot="title">
                <vs-navbar-title>
                    <!--              <vs-button @click="active=!active" color="primary" type="filled">Open Sidebar</vs-button>-->
                    <vs-button class="my-1" @click="active=!active" type="flat" icon="drag_indicator"></vs-button>

                </vs-navbar-title>
            </div>
            <vs-navbar-item index="1">

                <router-link to="/invites">
                    <!--                    <vs-avatar size="large" :badge="invites_count" icon="mail"/>-->
                    <notification-bell :count="invites_count" :size="25" iconColor="rgb(36, 33, 69)"/>
                </router-link>

            </vs-navbar-item>
            <!--            <vs-navbar-item index="2">-->
            <!--                <a href="#">-->
            <!--                    <vs-avatar size="small" :badge="3" icon="notification_important"/>-->
            <!--                </a>-->
            <!--            </vs-navbar-item>-->
        </vs-navbar>


        <!--        -->
        <vs-sidebar parent="body" default-index="2" color="primary" class="sidebarx" spacer v-model="active">

            <div class="header-sidebar" slot="header">
                <vs-avatar size="80px" :src="this.$store.state.profile_image_path"/>


                <p>{{this.$store.state.user_name}}</p>
                <h4>

                    <vs-button color="primary" icon="more_horiz" type="flat"></vs-button>
                </h4>

            </div>


            <vs-sidebar-item to="/profile" index="1" icon="account_box">
                Profile
            </vs-sidebar-item>

            <vs-sidebar-item to="/my_projects" index="2" icon="code">
                My Projects
            </vs-sidebar-item>


            <vs-sidebar-item to="/working_project" index="3" icon="code">
                Working Projects
            </vs-sidebar-item>


            <vs-divider position="left">
            </vs-divider>


            <div class="footer-sidebar" slot="footer">
                <vs-button @click="signOut()" icon="reply" color="danger" type="flat">log out</vs-button>
                <vs-button icon="settings" color="primary" type="border"></vs-button>
            </div>

        </vs-sidebar>
    </div>
</template>

<script>
    import {AuthService} from "../../services/auth_service";
    import {UserSession} from "../../services/users_session_services";
    import {CollaborationsService} from "../../services/collaboration_service";
    import NotificationBell from 'vue-notification-bell'

    var pusher = new Pusher('d736889d89b7aa399d13', {
        cluster: 'ap2',
        forceTLS: true
    });

    export default {
        name: "NavBar",
        components: {NotificationBell},
        data() {
            return {
                active: false,
                activeItem: '',
                route: '',
                name: '',
                invites_count: 0,

                to: '',
                from: '',
                show: false
            }
        },
        watch: {
            $route(to, from) {
                // react to route changes.
                this.to = to;
                this.from = from;
                this.show = this.checkRoute();
                this.name = UserSession.getUserData()['name']
            }
        },
        created() {

            this.route = this.$route.fullPath;
            this.name = UserSession.getUserData()['name']
            this.checkRoute()
            this.getInvitesCount();
            this.listenForInvites()
        },
        //signOut

        methods: {
            getInvitesCount() {
                CollaborationsService.count().then(res => {
                    this.invites_count = res['count'];
                }).catch(err => {

                })
            },
            signOut() {
                this.active = false
                setTimeout(() => {
                    this.$store.dispatch("logOut")
                }, 1000);
                // setTimeout()
            },
            close() {
                setTimeout(() => {
                    this.active = false
                }, 1000);
            },
            toProfile() {
                // this.active=false;
            },
            checkRoute() {


                console.log(this.to)
                console.log(this.from)


                if (this.from === "" && this.to === "") {
                    console.log("reload " + this.route)


                    this.show = (this.route.includes('/my_project') || this.route.includes('/working_project') || this.route.includes('/profile') || this.route.includes('/invites'));

                    return true;
                } else {
                    return this.to.fullPath.includes('/my_project') || this.to.fullPath.includes('/working_project') || this.to.fullPath.includes('/profile') || this.to.fullPath.includes('/invites');

                }

                ///working_project  /invites
            }
        }
    }
</script>

<style scoped>
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
