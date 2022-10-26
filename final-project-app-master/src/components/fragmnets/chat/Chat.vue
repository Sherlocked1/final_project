<template>
    <div v-if="!is_loading_chat" >
        <vs-row class="">

<!--                        <vs-col vs-w="2">-->
<!--                            <ChatCollaborator></ChatCollaborator>-->
<!--                        </vs-col>-->
<!--                        <vs-col vs-w="1"></vs-col>-->
           <vs-col   vs-xs="1" vs-sm="1"/>
            <vs-col  vs-w="7"  vs-sm="11" vs-xs="11" style="background-color: white">

                <Messages   :messages="messages"></Messages>
                <vs-row>
                  <vs-col vs-w="12" >
                      <MessageComposer  class="footer" @send_file="sendFile" @send="send"></MessageComposer>
                  </vs-col>
                </vs-row>
            </vs-col>

        </vs-row>

    </div>

</template>

<script>
    import MessageComposer from "./fragments/MessageComposer";
    import Messages from "./fragments/Messages";
    import ChatCollaborator from "./fragments/ChatCollaborator";
    import {ChatService} from "../../../services/chat_service";
    import {UserSession} from "../../../services/users_session_services";
    import axios from "axios";

    var pusher = new Pusher('d736889d89b7aa399d13', {
        cluster: 'ap2',
        forceTLS: true
    });


    export default {
        name: "Chat",
        components: {ChatCollaborator, Messages, MessageComposer},
        data() {
            return {
                messages: [],
                is_loading_chat: true
            }
        },
        created() {
            this.getAllMessages();

        },
        methods: {
            // getAllMessages

            listenForMessages() {
                var app = this;

                var channel = pusher.subscribe(`project_no_${this.$route.params['p_id']}`);
                channel.bind('message_created', function (data) {


                    if (data.message.from['_id'] !== UserSession.getUserData()['_id']) {
                        var found = false;
                        for (var i = 0; i < app.messages.length; i++) {
                            if (app.messages[i]._id === data['message']._id) {
                                found = true;
                                break;
                            }
                        }

                        if (!found) {
                            app.messages.push(data['message']);

                        }
                    }

                });
            },
            getAllMessages() {
                this.$vs.loading()
                ChatService.getAllMessage(this.$route.params['p_id']).then(response => {
                    this.messages = response;
                    this.listenForMessages();
                    this.is_loading_chat = false
                    this.$vs.loading.close()
                }).catch(err => {
                    this.showErr(err)
                    this.is_loading_chat = false
                    this.$vs.loading.close()


                })
            },
            // |<|-|-|-|-|-|>|
            send(message) {

                ChatService.sendMessage(this.$route.params['p_id'], message)
                    .then(response => {
                        this.messages.push(
                            response
                        )
                    }).catch(err => {
                    this.showErr(err)
                })
            },

            sendFile(file){
                console.log("sending.. file"+file)
                ChatService.sendFile(this.$route.params['p_id'], file)
                    .then(response => {
                        this.messages.push(
                            response
                        )
                       console.log(response)
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
            }
        }
    }
</script>

<style scoped>

    .footer{
        position:fixed;
        /*top:0;*/
        bottom: 0;
        width:53.4%;

        z-index:100;
    }

    /*@media (min-width: 481px) and (max-width: 767px) {*/

    /*    .footer{*/
    /*        position:fixed;*/
    /*        !*top:0;*!*/
    /*        bottom: 0;*/
    /*        width:80.4%;*/

    /*        z-index:100;*/
    /*    }*/


    /*}*/
    @media (min-width: 320px) and (max-width: 480px) {


        .footer{
            position:fixed;
            /*top:0;*/
            bottom: 0;
            width:82%;

            z-index:100;
        }

    }




</style>
