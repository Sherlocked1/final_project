<template>
    <div v-if="!is_loading_commit">
        <timeline v-if="commits.length>0">
            <div v-for="(commit , index) in commits " :key="index">
                <vs-row vs-type="flex">
                    <vs-col  vs-xs="1" vs-sm="1"/>
                    <vs-col vs-w="6" vs-xs="11" vs-sm="11">
                        <timeline-title>

                            <timeago :datetime="commit['createdAt']" :auto-update="60"></timeago>
                        </timeline-title>
                        <timeline-item  bg-color="#9dd8e0">

                            <CommitItem :commit="commit"></CommitItem>

                        </timeline-item>
                    </vs-col>
                </vs-row>
            </div>
        </timeline>
        <div v-else>
            <AppHint message="No commits found yet"
                     image_name="undraw_google_docs_jf93.svg" w="400" h="400"/>
        </div>

    </div>


</template>

<script>
    import {Timeline, TimelineItem, TimelineTitle} from 'vue-cute-timeline'
    import CommitItem from "./fragments/CommitItem";
    import {CommitService} from "../../../services/commit_service";
    import AppHint from "../../partials/AppHint";

    export default {
        name: "Commit",
        data() {
            return {
                commits: [],
                is_loading_commit: true
            }
        },
        created() {
            this.getAllCommit();
        },

        methods: {
            getAllCommit() {
                this.$vs.loading()

                CommitService.allCommit(this.$route.query['admin_id'], this.$route.params['p_id'])
                    .then(response => {
                        this.$vs.loading.close();

                        this.commits = response
                        this.is_loading_commit = false

                    }).catch(err => {
                    console.log(err)
                    this.$vs.loading.close();
                    this.is_loading_commit = false


                })
            }


        },
        components: {
            AppHint,
            CommitItem,
            Timeline,
            TimelineItem,
            TimelineTitle
        }
    }
</script>

<style scoped>

</style>
