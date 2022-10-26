<template>
    <div>
        <vs-row>


            <vs-col vs-w="6">

                <CircleCounter size="90" :dash-count="100" :active-count="getPercentage()" :stroke-width="3"
                               :active-width="9" active-stroke="dodgerblue" :dash-spacing="0" :rotate="-50"
                               :reverse="false" text="coverage 90%"></CircleCounter>

                <vs-avatar color="success" :text="passed.toString()"/>

                <vs-avatar color="warning" :text="fail.toString()"/>


            </vs-col>

            <vs-col vs-w="3">

            </vs-col>
            <vs-col vs-w="3">

                <vs-button @click="automate" class="m-3" style="width: 80%" size="small" color="primary" type="border"
                           icon="cached">Automate Lists
                </vs-button>
            </vs-col>
        </vs-row>


        <vs-row v-if="purePercentage()===100">
            <vs-divider></vs-divider>
            <vs-button @click="active_add_commit_dialog=!active_add_commit_dialog" class="m-3" size="small"
                       color="warning"
                       type="border" icon="timeline">
                commit
            </vs-button>
            <vs-button @click="active_add_version_dialog=!active_add_version_dialog" class="m-3" size="small"
                       color="dark"
                       type="border" icon="timeline">
                New Version
            </vs-button>
        </vs-row>


        <!--        commit diloag -->
        <vs-popup class="holamundo" title="Create new commit" :active.sync="active_add_commit_dialog">
            <form @submit.prevent="newCommit">
                <vs-input size="default" :danger="$v.commit_message.$error" :success="!$v.commit_message.$invalid"
                          success-text="valid message"
                          danger-text="message required"
                          style="width: 100%" class="my-2 p-3" label="commit message" placeholder=commit message
                          v-model.trim="$v.commit_message.$model"/>

                <vs-row>
                    <vs-col vs-w="6" vs-offset="3">
                        <vs-button @click="newCommit" style="width: 100%" class="mt-3 text-center "
                                   color="primary"
                                   type="border"
                                   icon="add">Create Commit
                        </vs-button>
                    </vs-col>
                </vs-row>
            </form>

        </vs-popup>

        <!--        new version dialog -->

        <vs-popup class="holamundo" title="Create new commit" :active.sync="active_add_version_dialog">
            <form @submit.prevent="newVersion">
                <vs-input size="default" :danger="$v.release_note.$error" :success="!$v.release_note.$invalid"
                          success-text="valid"
                          danger-text="required"
                          style="width: 100%" class="my-2 p-3" label="release note" placeholder="release note"
                          v-model.trim="$v.release_note.$model"/>


                <vs-input size="default" :danger="$v.version_code.$error" :success="!$v.version_code.$invalid"
                          success-text="validi"
                          danger-text="required"
                          style="width: 100%" class="my-2 p-3" label="version code" placeholder="version code"
                          v-model.trim="$v.version_code.$model"/>

                <vs-row>
                    <vs-col vs-w="6" vs-offset="3">
                        <vs-button @click="newVersion" style="width: 100%" class="mt-3 text-center "
                                   color="primary"
                                   type="border"
                                   icon="add">Create version
                        </vs-button>
                    </vs-col>
                </vs-row>
            </form>

        </vs-popup>


    </div>
</template>

<script>
    import CircleCounter from '../../dashboard/fragmnets/CircleCounter'
    import {RequestsService} from "../../../../services/requests_service";
    import {required} from 'vuelidate/lib/validators'
    import {CommitService} from "../../../../services/commit_service";
    import {UserSession} from "../../../../services/users_session_services";
    import {VersionService} from "../../../../services/version_service";

    export default {
        name: "RequestAutomationHeader",
        props: {
            requests: Array
        },
        data() {
            return {
                passed: 0,
                active_add_commit_dialog: false,
                active_add_version_dialog: false,
                commit_message: '',
                release_note: '',
                version_code: '',
                fail: 0,
                test_results: [],
                passed_requests: []

            }
        },
        validations: {

            commit_message: {
                required
            },
            release_note: {
                required
            },
            version_code: {
                required
            }
        },
        components: {CircleCounter},
        methods: {



            async newCommit() {
                this.$vs.loading()

                for (let index = 0; index < this.passed_requests.length; index++) {
                    const request_with_result = this.passed_requests[index];
                    // console.log(request_with_result['request'])
                    // console.log(request_with_result['result'])
                    //


                    //admin_id, project_id, request_id, response

                    await RequestsService.updateRequestResponse(this.$route.query['admin_id'], this.$route.params['p_id'],
                        request_with_result['request']['_id'], JSON.stringify(request_with_result['result']['response']), UserSession.getUserData()['_id'], request_with_result['request']['title'])


                    if (index === this.passed_requests.length - 1) {
                        //    now create new commit
                        CommitService.createCommit(this.$route.query['admin_id'], this.$route.params['p_id'], UserSession.getUserData()['_id'], this.commit_message)
                            .then(response => {


                                console.log(response)
                                if (response['status']) {
                                    this.$vs.loading.close();
                                    console.log('create successfully');
                                    //<||---|--||---||--|-|>
                                    this.active_add_commit_dialog = false;

                                    setTimeout(() => {
                                        this.$vs.notify({
                                            title: 'Alert',
                                            text: 'commit created successfully ',
                                            color: 'success',
                                            icon: 'done'
                                        })
                                    }, 10)

                                }

                            }).catch(err => {

                            console.log(err)
                        })
                    }

                }

            },


            newVersion() {
                this.$vs.loading()
                //    update all request response with new value
                //    prepare for new version
                for (let index = 0; index < this.passed_requests.length; index++) {
                    const request_with_result = this.passed_requests[index];
                    // console.log(request_with_result['request'])
                    // console.log(request_with_result['result'])
                    //


                    //admin_id, project_id, request_id, response

                    RequestsService.updateRequestResponse(this.$route.query['admin_id'], this.$route.params['p_id'],
                        request_with_result['request']['_id'], JSON.stringify(request_with_result['result']['response']), UserSession.getUserData()['_id'], request_with_result['request']['title'])
                        .then(response => {
                            console.log("request updated")
                        }).catch(err => {
                        console.log(err)
                    })


                    if (index === this.passed_requests.length - 1) {
                        //    now create new commit
                        VersionService.createVersion(this.$route.query['admin_id'], this.$route.params['p_id'], UserSession.getUserData()['_id'], this.release_note, this.version_code)
                            .then(response => {
                                console.log(response)
                                if (response['status']) {
                                    this.$vs.loading.close();
                                    console.log('create successfully');
                                    //<||---|--||---||--|-|>
                                    this.active_add_version_dialog = false;

                                    setTimeout(() => {
                                        this.$vs.notify({
                                            title: 'Alert',
                                            text: 'version created successfully ',
                                            color: 'success',
                                            icon: 'done'
                                        })
                                    }, 10)

                                }

                            }).catch(err => {

                            console.log(err)
                        })
                    }

                }

            },
//getPercentage


            purePercentage() {
                return (this.passed / this.requests.length) * 100
            },
            getPercentage() {

                if (this.passed > 0) {
                    let result = (this.passed / this.requests.length) * 100
                    if (result === 100) {
                        return 99;
                    } else {
                        return result;
                    }
                } else {
                    return 0;
                }
                // console.log((this.passed / this.test_results.length) * 100)

            },
            automate() {
                this.passed_requests = []
                this.passed = 0;
                this.fail = 0;
                this.test_results = []
                for (let index = 0; index < this.requests.length; index++) {

                    const request_id = this.requests[index]['_id']

                    RequestsService.runRequest(this.$route.query['admin_id'], this.$route.params['p_id'], request_id).then(response => {
                        console.log("Case " + index)
                        if (response['test_cases_result'].length > 0) {
                            this.test_results.push(
                                response
                            )
                            let count = 0;
                            for (let _case = 0; _case < response['test_cases_result'].length; _case++) {
                                if (response['test_cases_result'][_case]['status'] === 'passed') {
                                    count += 1;

                                }
                            }
                            if (count === response['test_cases_result'].length) {
                                this.passed += 1;
                                this.passed_requests.push(
                                    {
                                        "request": this.requests[index],
                                        "result": response
                                    }
                                );
                                console.log("passed-->" + this.passed)
                            } else {
                                this.fail += 1;
                                console.log("fail---->" + this.fail)
                            }
                        } else {
                            console.log("not have a test cases")
                        }
                        console.log(index === this.requests.length)
                        console.log(index === this.requests.length - 1)

                        if (index === this.requests.length - 1) {
                            console.log('emit it ')
                            this.$emit('test_results', this.test_results)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }
        }

    }
</script>

<style scoped>

</style>
