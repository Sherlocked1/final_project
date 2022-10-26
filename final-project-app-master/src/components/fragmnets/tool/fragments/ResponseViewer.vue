<template>
    <div>

        <vs-card>


            <vs-tabs>
                <vs-tab label="Response">
                    <div class="con-tab-ejemplo">
<!--                        <vs-row v-if="this.show_cancel" class="m-2">-->
<!--                            <vs-col vs-w="2" vs-offset="5">-->

<!--                                <vs-button @click="cancelRequest" icon="cancel_schedule_send" color="primary"-->
<!--                                           type="border">Cancel Request-->
<!--                                </vs-button>-->
<!--                            </vs-col>-->
<!--                        </vs-row>-->

                        <vs-row v-if="response['response'] && this.show_cancel===false" class="p-3" vs-type="flex"
                                vs-justify="space-between">
                            <h5>Response</h5>

                            <div v-if="response['response']">
                                <vs-row>
                                    <p class="mx-3" style="color: orange">
                                        <vs-icon icon="timer"></vs-icon>
                                        {{this.response['time']}}
                                    </p>
                                    <p class="mx-3" style="color: green">
                                        <vs-icon icon="sync_alt"></vs-icon>
                                        {{this.response['status']}}
                                    </p>
                                </vs-row>
                            </div>

                        </vs-row>
                        <vs-divider></vs-divider>

                        <json-viewer class="json_view" v-if="response['response'] "
                                     :value="response['response']"
                                     :expand-depth=15
                                     copyable

                                     sort></json-viewer>

                        <AppHint v-else  message="Hit send , to get response"
                                 image_name="undraw_server_push_vtms.svg" w="150" h="150"/>

                    </div>
                </vs-tab>

                <vs-tab label="Test Results">
                    <div class="con-tab-ejemplo">

                        <TestResult v-if="this.response['test_cases_result']"
                                    :results="this.response['test_cases_result']"></TestResult>

                        <AppHint v-else  message="Add test case to increase your ends points reliability"
                                 image_name="undraw_mobile_testing_reah.svg" w="150" h="150"/>

                    </div>
                </vs-tab>
            </vs-tabs>


        </vs-card>
    </div>
</template>

<script>
    import TestResult from "./TestResult";
    import AppHint from "../../../partials/AppHint";

    export default {
        name: "ResponseViewer",
        components: {AppHint, TestResult},
        props: {
            response: Object,
            show_cancel: Boolean,
            canceled : Boolean
        },
        methods: {
            cancelRequest() {
                this.$emit('cancel')
            }
        },

        data() {
            return {}
        }
    }
</script>

<style scoped>

    .json_view{
        /*height: 500px;*/
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
    }

</style>
