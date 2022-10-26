<template>
    <div>
        <vs-card>
            <vs-list>
                <vs-list-header icon="supervisor_account" title="Tasks"></vs-list-header>
                <vs-list-item v-for="(request , index) in requests" :key="index" :title="request['title']"
                              :subtitle="request['description']">
                    <vs-checkbox size="small" @change="change(request)" :value="false"
                                 v-model="request['done_by_front_end_developer']"></vs-checkbox>
                </vs-list-item>


            </vs-list>
        </vs-card>

    </div>
</template>

<script>
    import {RequestsService} from "../../../../services/requests_service";
    import {UserSession} from "../../../../services/users_session_services";

    export default {
        name: "TodoList",
        props: {
            requests: Array
        },
        data() {
            return {
                isChecked: true
            }
        },
        methods: {
            change(request) {
                // alert(this.isChecked);
                this.updateRequest(request)
            },
            updateRequest(request) {
                console.log(request['title'])
                let done = request['done_by_front_end_developer'];

                RequestsService.doneByFrontEndDeveloperDeveloper(this.$route.query['admin_id'], this.$route.params['p_id'], request['_id'], done === false ? "false" : true, UserSession.getUserData()['_id'], request['title'])
                    .then(response => {
                        console.log(response);

                        this.$emit('reload_data')

                    }).catch(err => {
                    console.log(err)

                })
            }
        }
    }
</script>

<style scoped>

</style>
