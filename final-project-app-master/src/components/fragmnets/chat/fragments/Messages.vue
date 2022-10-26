<template>
    <div>
        <div style="background-color: rgb(36, 33, 69); border-top-left-radius: 15px; border-top-right-radius: 15px; ">

            <vs-row class="p-3">
                <!--&lt;!&ndash;                <vs-icon icon="lock" color="white"></vs-icon>&ndash;&gt;-->
                <!--                <vs-avatar src="https://i.pravatar.cc/150?u=1"/>-->
                <!--                <h6 style="color: white">{{project_info['p_name']}}</h6>-->
                <!--                -->
                <vs-list>
                    <vs-list-item :title="project_info['p_name']" style="color: white">
                        <template slot="avatar">
                            <vs-avatar src="https://i.pravatar.cc/150?u=2"/>
                        </template>
                        <vs-icon @click="startVideoCall()" icon="videocam" color="warning" size="small"></vs-icon>
                    </vs-list-item>
                </vs-list>

                <!--                <vs-icon color="white" size="20px" icon="supervised_user_circle"></vs-icon>-->
                <!--                <p style="color: white">{{project_info['no_of_collaborators']}} users</p>-->
            </vs-row>
        </div>


        <!--        <vs-card>-->
        <div class="chat" ref="chat">


            <div v-if="messages.length===0">


                <AppHint message="Send message to start chat with collaborators"
                         image_name="undraw_chatting_2yvo.svg" w="250" h="250"/>


            </div>

            <div v-for="message in messages" v-bind:key="message._id">
                <div v-if="message.from['_id'] === currentUserId"
                     class="mine messages">


                    <div v-if="message.message_type ==='text'" class="message last">
                        <!--                        {{message.message}}-->
                        <p> {{message.message}}</p>
                    </div>


                    <div v-else-if="message.message_type.substring(0  ,message.message_type.indexOf('/')) ==='image'">
                        <a :href="message.message" target="_blank">
                            <img :src="message.message" style=" border-radius: 5px" width="250" height="180">
                        </a>
                    </div>


                    <div v-else-if="message.message_type.substring(0  ,message.message_type.indexOf('/')) ==='video'">

                        <video-player class="video-player-box"
                                      ref="videoPlayer"

                                      :options="getVideoOption(message)"
                                      :playsinline="true"
                        />

                    </div>

                    <div v-else style="cursor: pointer;width: 20%" @click="downloadFile(message)">
                        <vs-card>
                            <vs-icon icon="insert_drive_file" size="120px"></vs-icon>
                        </vs-card>

                    </div>

                    <p style="font-size: 8px; color: black">
                        <timeago :datetime="message.createdAt"></timeago>
                    </p>


                    <!--                -->
                </div>


                <div v-else class="yours messages">
                    <vs-row vs-type="flex">


                        <vs-col vs-w="1" vs-xs="2">
                            <vs-avatar
                                    :src="message['from']['avatar']"/>
                        </vs-col>

                        <vs-col vs-w="10" vs-xs="10">

                            <div v-if="message.message_type ==='text'" class="message last">
                                <!--                                <small style="color: gray;  font-size: xx-small">-->
                                <!--                                    @{{message['from']['name']}}</small>-->
                                <p> {{message.message}}</p>


                            </div>
                            <div v-else-if="message.message_type.substring(0  ,message.message_type.indexOf('/')) ==='image'">

                                <a :href="message.message" target="_blank">
                                    <img :src="message.message" width="250" height="180" style=" border-radius: 5px">

                                </a>

                                <!--                                <v-lazy-image :src="message.message"     style="width: 150px; height: 150px"-->
                                <!--                                />-->


                            </div>

                            <div v-else-if="message.message_type.substring(0  ,message.message_type.indexOf('/')) ==='video'">

                                <video-player class="video-player-box"
                                              ref="videoPlayer"
                                              :options="getVideoOption(message)"
                                              :playsinline="true"


                                />

                            </div>


                            <div v-else style="cursor: pointer; width: 20%" @click="downloadFile(message)">
                                <vs-card>
                                    <vs-icon icon="insert_drive_file" size="120px"></vs-icon>
                                </vs-card>

                            </div>


                            <p style="font-size: 8px; color: black">
                                <timeago :datetime="message.createdAt"></timeago>
                            </p>
                        </vs-col>


                    </vs-row>

                </div>
            </div>


        </div>

        <!--        </vs-card>-->
    </div>

</template>

<script>
    import {UserSession} from "../../../../services/users_session_services";
    import {MyProjectService} from "../../../../services/my_project_service";
    import AppHint from "../../../partials/AppHint";
    import {videoPlayer} from 'vue-video-player'
    import {CometChat} from "@cometchat-pro/chat";
    import axios from "axios";

    export default {
        name: "Messages",
        components: {AppHint, videoPlayer},
        data() {
            return {
                currentUserId: UserSession.getUserData()["_id"],
                project_info: {},
                showSpinner: false,
                playerOptions: {
                    // videojs options
                    muted: true,
                    language: 'en',
                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                    sources: [{
                        type: "video/mp4",
                        src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                    }],
                    poster: "/static/images/author.jpg",
                }
            }
        },

        methods: {


            startVideoCall() {
                let apiKey = "24716f1452bf9af";
                var uid = "user1";
                var name = "Kevin";

                var user = new CometChat.User(uid);

                user.setName(name);

                CometChat.createUser(user, apiKey).then(
                    user => {
                        console.log("user created", user);
                    }, error => {
                        console.log("error", error);
                    }
                )
            },

            getVideoOption(message) {
                console.log(message.message)
                return {
                    // videojs options
                    muted: true,
                    language: 'en',
                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                    width: 250,
                    border: 10,
                    sources: [{
                        // type: "video/mp4",
                        src: message.message
                    }],
                    poster: "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg",
                }
            },
            loadProjectInfo() {
                MyProjectService.show(this.$route.query['admin_id'], this.$route.params['p_id'])
                    .then(response => {
                        this.project_info = response;
                    }).catch(err => {

                })
            },
            scrollToEnd() {
                setTimeout(() => {

                    this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight - this.$refs.chat.clientHeight;
                }, 50);
            },
            downloadFile(message) {
                const extension = message.message.substring(message.message.indexOf('.'));
                axios.get(message.message, {responseType: 'blob'})
                    .then(response => {
                        const blob = new Blob([response.data], {type: message.type})
                        const link = document.createElement('a')
                        link.href = URL.createObjectURL(blob)
                        link.download = `download_${message._id}${extension}`
                        link.click()
                        URL.revokeObjectURL(link.href)
                    }).catch(console.error)
            }
        },
        watch: {
            messages() {
                this.scrollToEnd();
            }
        },
        created() {
            // this.currentUserId = 2;
            this.loadProjectInfo();
            this.scrollToEnd();
        },
        props: {
            messages: Array
        }
    }
</script>

<style scoped>

    /* (1920x1080) Full HD Display */
    @media screen and (max-width: 1920px) {
        /* insert styles here */
        .chat {
            /*width: 300px;*/
            height: 720px;
            max-height: 720px;
            /*position: fixed;*/
            /*width: 500px;*/
            overflow-y: auto;
            overflow-x: hidden;
            /*border: solid 1px #EEE;*/
            display: flex;
            flex-direction: column;
            padding: 10px;
        }
    }

    /* (1280x1024) SXGA Display */
    @media screen and (max-width: 1280px) and (min-width: 768px) {
        /* insert styles here */
        .chat {
            /*width: 300px;*/
            height: 400px;
            max-height: 400px;
            /*position: fixed;*/
            /*width: 500px;*/
            overflow-y: auto;
            overflow-x: hidden;
            /*border: solid 1px #EEE;*/
            display: flex;
            flex-direction: column;
            /*padding: 10px;*/
        }
    }

    @media screen and (max-width: 1366px)  {
        /* insert styles here */
        .chat {
            /*width: 300px;*/
            height: 400px;
            max-height: 400px;
            /*position: fixed;*/
            /*width: 500px;*/
            overflow-y: auto;
            overflow-x: hidden;
            /*border: solid 1px #EEE;*/
            display: flex;
            flex-direction: column;
            /*padding: 10px;*/
        }
    }


    @media screen and (max-width: 600px)  {
        /* insert styles here */
        .chat {
            /*width: 300px;*/
            height: 400px;
            max-height: 400px;
            /*position: fixed;*/
            /*width: 500px;*/
            overflow-y: auto;
            overflow-x: hidden;
            /*border: solid 1px #EEE;*/
            display: flex;
            flex-direction: column;
            /*padding: 10px;*/
        }
    }

    @media (min-width: 320px) and (max-width: 480px) {


        .chat {
            /*width: 300px;*/
            height: 500px;
            max-height: 520px;
            position: fixed;
            /*width: 500px;*/
            overflow-y: auto;
            overflow-x: hidden;
            /*border: solid 1px #EEE;*/
            display: flex;
            flex-direction: column;
            padding: 10px;
            width: 82%;

        }

    }


    .messages {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
    }

    .message {
        border-radius: 20px;
        padding: 8px 15px;
        margin-top: 5px;
        margin-bottom: 5px;
        display: inline-block;
    }

    .yours {
        align-items: flex-start;
    }

    .yours .message {
        margin-right: 25%;
        background-color: #eee;
        position: relative;
    }

    .yours .message.last:before {
        content: "";
        position: absolute;
        z-index: 0;
        bottom: 0;
        left: -7px;
        height: 20px;
        width: 20px;
        background: #eee;
        border-bottom-right-radius: 15px;
    }

    .yours .message.last:after {
        content: "";
        position: absolute;
        z-index: 1;
        bottom: 0;
        left: -10px;
        width: 10px;
        height: 20px;
        background: white;
        border-bottom-right-radius: 10px;
    }

    .mine {
        align-items: flex-end;


    }

    .mine .message {
        color: white;
        margin-left: 25%;
        background: linear-gradient(to bottom, #00D0EA 0%, #0085D1 100%) fixed;
        position: relative;
    }

    .mine .message.last:before {
        content: "";
        position: absolute;
        z-index: 0;
        bottom: 0;
        right: -8px;
        height: 20px;
        width: 20px;
        background: linear-gradient(to bottom, #00D0EA 0%, #0085D1 100%) fixed;
        border-bottom-left-radius: 15px;
    }

    .mine .message.last:after {
        content: "";
        position: absolute;
        z-index: 1;
        bottom: 0;
        right: -10px;
        width: 10px;
        height: 20px;
        background: white;
        border-bottom-left-radius: 10px;
    }
</style>
