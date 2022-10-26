<template>
    <div>
        <vs-row>
            <vs-col vs-w="0"  vs-xs="1"/>
            <vs-col vs-w="2.5" vs-xs="10" vs-sm="4">
                <RequestsList @done="done" :requests="requests"
                              @select_request="select_request"></RequestsList>
            </vs-col>
            <vs-col vs-w="0"  vs-xs="1"/>
            <vs-col vs-w="0"  vs-xs="1"/>

            <vs-col v-if="selected_request" vs-w="8.5" vs-xs="10" vs-offset="0.5" vs-sm="7">


                <RequestHeaderForm @canceled="canceled" :isCanceled="cancel_request" @sending="sending"
                                   @test_result="test_result" @done="done"
                                   :request="selected_request"></RequestHeaderForm>

                <vs-card>
                    <vs-tabs>
                        <vs-tab label="Params">
                            <div class="con-tab-ejemplo">
                                <RequestRelevent @done="done" :request="selected_request" :type="'param'"
                                ></RequestRelevent>

                            </div>
                        </vs-tab>
                        <vs-tab label="Headers">
                            <div class="con-tab-ejemplo">
                                <RequestRelevent @done="done" :request="selected_request" :type="'header'"
                                ></RequestRelevent>

                            </div>
                        </vs-tab>
                        <vs-tab label="Body">
                            <div class="con-tab-ejemplo">
                                <RequestRelevent @done="done" :request="selected_request" :type="'body'"
                                ></RequestRelevent>

                            </div>
                        </vs-tab>
                        <vs-tab label="Tests">
                            <div class="con-tab-ejemplo">
                                <RequestTestCase @done="done" :request="selected_request"></RequestTestCase>
                            </div>
                        </vs-tab>

                    </vs-tabs>

                </vs-card>

                <vs-progress v-if="show_sending_progress" indeterminate color="primary">primary</vs-progress>


                <ResponseViewer :canceled="cancel_request" @cancel="cancel" :show_cancel="show_sending_progress"
                                :response="response"></ResponseViewer>


            </vs-col>


            <vs-col v-else vs-w="9" class="mt-5" vs-sm="8">

                <AppHint message="Select request to start test it"
                         image_name="undraw_select_option_y75i.svg" w="250" h="250"/>
            </vs-col>
            <vs-col vs-w="0"  vs-xs="1"/>

        </vs-row>


    </div>

</template>

<script>
    import RequestRelevent from "./fragments/RequestRelevent";
    import RequestTestCase from "./fragments/RequestTestCase";
    import RequestsList from "./fragments/RequestsList";
    import RequestHeaderForm from "./fragments/RequestHeaderForm";
    import ResponseViewer from "./fragments/ResponseViewer";
    import {RequestsService} from "../../../services/requests_service";
    import AppHint from "../../partials/AppHint";


    export default {
        name: "Tool",
        components: {AppHint, ResponseViewer, RequestHeaderForm, RequestsList, RequestTestCase, RequestRelevent},
        data() {
            return {
                test: {"message": "hi there "},
                show_sending_progress: false,

                response: {},
                selected_request: null,
                requests: [],
                cancel_token: '',
                cancel_request: false

            }
        },

        created() {
            this.getAllRequests();
        },
        methods: {


            cancel() {
                this.cancel_request = true

            },
            sending(status) {
                // alert(status)
                console.log("status----------->" + status)
                this.show_sending_progress = status;
                this.cancel_request = false
            },
            canceled() {
                this.show_sending_progress = false
            },
            test_result(result) {
                console.log("not canceled............")
                this.response = result;

            },
            done() {
                this.getAllRequests();
            },
            select_request(request) {
                this.cancel_request = false
                this.response = {}
                console.log('selected')
                this.selected_request = null


                setTimeout(() => {
                    this.selected_request = request;
                }, 100);


            },

            getAllRequests() {
                RequestsService.allRequests(this.$route.query['admin_id'], this.$route.params['p_id'])
                    .then(response => {
                        this.requests = response;
                    }).catch(err => {
                    console.log(err)
                })
            },
            click() {

            },

        }
    }
</script>

<style scoped>


</style>
