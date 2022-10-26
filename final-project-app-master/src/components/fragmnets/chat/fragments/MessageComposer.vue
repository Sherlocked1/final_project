<template>
    <div style="background-color: #f9f9f9; border-top-left-radius: 10px ; border-top-right-radius: 10px ;   box-shadow: 0 1px 0 rgba(0,0,0,0.2);

  ">


        <!--        <vs-card>-->
        <form @submit.prevent="send">
            <vs-row style="margin: 2vh">

                <vs-col vs-w="9.5" vs-xs="8 ">
                    <input
                            v-model="message"/>
                </vs-col>
<!--                <vs-col vs-w="0.1">-->

<!--                </vs-col>-->
                <vs-col vs-w="0.5" vs-xs="1">
                    <vs-row class="m-1">

                        <vs-col vs-w="12">
                            <vs-button @click="$refs.file.click()" radius size="large" color="primary"
                                       icon="attach_file"
                                       type="flat">

                            </vs-button>
                            <input ref="file" type="file" hidden name="profile_image" v-on:change="handleFileInput">

                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-w="0.5" vs-xs="1">
                    <vs-row class="m-1">

                        <vs-col vs-w="12">
                            <vs-button @click="show_emoji_picker=!show_emoji_picker" radius size="large" color="primary"
                                       icon="sentiment_satisfied_alt"
                                       type="flat">

                            </vs-button>

                        </vs-col>
                    </vs-row>
                </vs-col>

                <vs-col vs-w="0.5" vs-xs="1">
                    <vs-row class="m-1">

                        <vs-col vs-w="12">
                            <vs-button radius @click="send()" size="large" color="primary" icon="send"
                                       type="flat">

                            </vs-button>
                        </vs-col>
                    </vs-row>
                </vs-col>


            </vs-row>

            <vs-row v-if="show_emoji_picker">
                <VEmojiPicker @select="selectEmoji" style="width: 100%"/>
            </vs-row>
        </form>

        <!--        </vs-card>-->


    </div>
</template>

<script>
    import {required} from 'vuelidate/lib/validators'
    import axios from "axios";
    import {UserSession} from "../../../../services/users_session_services";
    import {ChatService} from "../../../../services/chat_service";
    import VEmojiPicker from 'v-emoji-picker';

    export default {
        name: "MessageComposer",
        components: {VEmojiPicker},
        data() {
            return {
                message: '',
                show_emoji_picker: false
            }
        },
        validations: {
            message: {
                required
            },


        },
        methods: {
            selectEmoji(emoji) {
                console.log(emoji)
                this.message+=emoji["data"]

            },
            handleFileInput(e) {
                console.log("file")


                this.$emit('send_file', e.target.files[0]);
                this.show_emoji_picker = false


            },
            addEmoji() {

            },
            send() {
                this.$emit('send', this.message);
                this.message = ''
                this.show_emoji_picker = false
            }
        }
    }
</script>

<style scoped>
    input {

        border-radius: 20px;
        border: none;
        padding: 10px;
        /*color: white;*/
        background: white;
        width: 100%;
        font-size: 14px;
    }
</style>
