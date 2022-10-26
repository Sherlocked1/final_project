<template>
    <div style="background-color: whitesmoke ; height: 100vh">
        <!--        navbar and side bar go here-->
        <NavBar></NavBar>
        <router-view></router-view>
    </div>
</template>

<script>
    import NavBar from "./partials/NavBar";
    import {CometChat} from "@cometchat-pro/chat";
    import {UserSession} from "../services/users_session_services";

    var pusher = new Pusher('d736889d89b7aa399d13', {
        cluster: 'ap2',
        forceTLS: true
    });
    export default {
        name: 'MainApp',
        components: {NavBar},
        created() {
            CometChat.init("24716f1452bf9af").then(
                () => {
                    console.log("Initialization completed successfully");
                },
                error => {
                    console.log("Initialization failed with error:", error);
                }
            );
            this.listenForInvites();
        },
        methods: {
            listenForInvites() {
                var app = this;

                var channel = pusher.subscribe(`user_${UserSession.getUserData()['_id']}`);
                channel.bind('invite_sent', function (data) {
                    if (data['message']) {
                        app.$vs.notify({
                            title: 'Alert',
                            text: data['message'],
                            color: 'success',
                            icon: 'done'
                        })

                    }

                    app.invites_count = data['count']
                });
            },

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
