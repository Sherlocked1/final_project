<template>
    <div class="mt-5">
        <vs-row>
            <vs-col vs-w="6" vs-sm="8" vs-xs="8" vs-offset="3">
                <CommitItem  :commit="commit" v-if="commit"></CommitItem>
                <div v-else>
                    <AppHint message="No tasks yet to accomplish"
                             image_name="empty_tasks.png" w="150" h="150"/>
                </div>
                <TodoList @reload_data="getAllRequests" v-if="commit && requests.length>0"  :requests="requests"></TodoList>

            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import CommitItem from "../commit/fragments/CommitItem";
    import TodoList from "./fragments/TodoList";
    import {RequestsService} from "../../../services/requests_service";
    import {CommitService} from "../../../services/commit_service";
    import AppHint from "../../partials/AppHint";

    export default {
        name: "FrontEndDev",
        components: {AppHint, TodoList, CommitItem},
        data() {
            return {
                requests: [],
                commit: null
            }
        },
        created() {
            this.getLastCommit();
            this.getAllRequests();
        },
        methods: {
            getLastCommit() {
                CommitService.allCommit(this.$route.query['admin_id'], this.$route.params['p_id'])
                    .then(response => {
                        this.$vs.loading.close();

                        this.commit = response[0]

                    }).catch(err => {
                    console.log(err)
                    this.$vs.loading.close();


                })
            },
            getAllRequests() {
                this.$vs.loading()
                RequestsService.allRequests(this.$route.query['admin_id'], this.$route.params['p_id'])
                    .then(response => {
                        this.$vs.loading.close()
                        this.requests = response;
                    }).catch(err => {
                    console.log(err)
                })
            },
        }

    }
</script>

<style scoped>

</style>
