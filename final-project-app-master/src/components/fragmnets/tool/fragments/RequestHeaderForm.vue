<template>
    <div>
        <vs-card class="mt-1" >
            <vs-row >
                <vs-col vs-w="2" vs-xs="12" vs-sm="4">
<!--                    <vs-select-->
<!--                            class="selectExample"-->
<!--                            style="width: 90%"-->
<!--                            v-model="selectedMethod"-->
<!--                    >-->
<!--                        <vs-select-item v-for="(role , index) in methods" :key="index" :value="role.value"-->
<!--                                        :text="role.text"-->
<!--                        />-->
<!--                    </vs-select>-->

                    <VueSelect v-model="selectedMethod" style="width: 100%;  padding: 2%"
                               :options="methods"/>

                </vs-col>
                <vs-col vs-w="8" vs-xs="12" vs-sm="8">
                    <vs-input :danger="$v.url.$error" :success="!$v.url.$invalid"
                              icon="language"
                              success-text="valid url"

                              danger-text="invalid url"
                              type="url"
                              v-model.trim="$v.url.$model"
                              style="width: 100%" size="default" placeholder="collaborator url"
                              v-model="url"/>
                </vs-col>
                <vs-col vs-w="2" vs-xs="12" vs-sm="12">
                    <vs-row>
                        <vs-col vs-w="1"></vs-col>

                        <vs-col vs-w="5">
                            <vs-button @click="runRequest" :disabled='this.url===""'  size="small"
                                       color="primary" icon="send"
                                       style="width: 100%"
                                       type="filled">
                                SEND
                            </vs-button>
                        </vs-col>
                        <vs-col vs-w="1"></vs-col>

                        <vs-col vs-w="5">

                            <vs-button @click="save"  size="small" color="primary" icon="save"     style="width: 100%"
                                       type="filled">
                                SAVE
                            </vs-button>
                        </vs-col>


                    </vs-row>
                </vs-col>


            </vs-row>
        </vs-card>
    </div>
</template>

<script>
    import {required,} from 'vuelidate/lib/validators'
    import {RequestsService} from "../../../../services/requests_service";
    import {UserSession} from "../../../../services/users_session_services";
    import axios from "axios";
    import VueSelect from 'vue-select'

    // const request = axios.CancelToken.source();
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    export default {
        name: "RequestHeaderForm",
        props: {
            request: Object,
            isCanceled: Boolean
        },
        components : {VueSelect},

        watch: {
            isCanceled: {
                immediate: true,
                deep: true,
                handler(old, newVal) {
                    console.log(old)
                    console.log(newVal)

                    if (newVal===true) {
                        console.log("cancel that shit")
                        source.cancel('canceled successfully')
                    }
                    // do your stuff
                }
            }
        },
        cancel() {
            // source.cancel('canceled successfully')
        },
        created() {
            if (this.request['method']) {
                this.selectedMethod = this.request['method'].toUpperCase()
            }

            if (this.request['url']) {
                this.url = this.request['url']
            }
        },
        data() {
            return {
                url: "",
                selectedMethod: 'GET',

                methods : ['GET' , 'POST','PUT','DELETE']

            }
        },
        methods: {
            save() {
                RequestsService.updateRequestMethodAndUrl(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], this.selectedMethod.toLowerCase(),
                    this.url, UserSession.getUserData()['_id'], this.request['title'])
                    .then(response => {
                        setTimeout(() => {
                            this.$vs.notify({
                                title: 'Alert',
                                text: response['message'],
                                color: 'success',
                                icon: 'done'
                            })
                            this.$emit('done')
                        }, 10)

                    }).catch(err => {

                    this.showErr(err)
                })
            },
            showErr(err) {
                this.$vs.notify({
                    title: 'Alert',
                    text: err,
                    color: 'danger',
                })
            },
            runRequest() {
                this.$emit('sending', true)
                RequestsService.updateRequestMethodAndUrl(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], this.selectedMethod.toLowerCase(),
                    this.url, UserSession.getUserData()['_id'], this.request['title'])
                    .then(response => {
                        this.$emit('done')
                        // source.cancel("stop");

                        RequestsService.runRequest(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], source).then(response => {
                            this.$emit('sending', false)
                            this.$emit('test_result', response);

                        }).catch(err => {
                            this.$emit('sending', false)
                            console.log(err)
                        })

                    }).catch(err => {
                    this.$emit('sending', false)

                    this.showErr(err)
                })


            },
        },


        validations: {
            url: {
                required
            },
        },
    }
</script>

<style scoped>

</style>
