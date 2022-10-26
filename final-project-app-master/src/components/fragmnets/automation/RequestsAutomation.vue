<template>

    <div>

        <vs-row class="mt-5">


            <vs-col vs-w="6" vs-offset="3">

                <vs-card v-if="requests.length>0">
                    <RequestAutomationHeader @test_results="showresult" :requests="requests"></RequestAutomationHeader>
                    <vs-divider></vs-divider>
                    <TestResultForRequests :result="result"></TestResultForRequests>

<!--                    <vs-tabs alignment="left">-->
<!--                        <vs-tab label="All" icon="list" @click="colorx='warning'">-->
<!--                        </vs-tab>-->
<!--                        <vs-tab label="Passed" icon="check_circle" @click="colorx='success'">-->
<!--                            <TestResultForRequests :result="result"></TestResultForRequests>-->

<!--                        </vs-tab>-->
<!--                        <vs-tab label="Fail" icon="error" @click="colorx='danger'">-->
<!--                            <TestResultForRequests :result="result"></TestResultForRequests>-->

<!--                        </vs-tab>-->

<!--                    </vs-tabs>-->

                </vs-card>
            </vs-col>


        </vs-row>


    </div>


</template>


<script>
    import TestResultForRequests from "./fragments/TestResultForRequests";
    import RequestAutomationHeader from "./fragments/RequestAutomationHeader";
    import {RequestsService} from "../../../services/requests_service";

    export default {
        name: "RequestsAutomation",
        data() {
            return {
                colorx: 'danger',
                requests: [],
                result: []
            }
        },
        created() {
            // this.$vs.loading(
            //     {type: 'corners',}
            // )
            // setTimeout(() => {
            //     this.$vs.loading.close()
            // }, 2000);

            this.getAllRequests();


        },
        methods: {
            showresult(result) {
              // console.log('data'+result)
                this.result = result;
            },
            getAllRequests() {
                RequestsService.allRequests(this.$route.query['admin_id'], this.$route.params['p_id'])
                    .then(response => {
                        this.requests = response;
                    }).catch(err => {
                    console.log(err)
                })
            },
        },
        components: {RequestAutomationHeader, TestResultForRequests}
    }
</script>

<style scoped>

</style>
