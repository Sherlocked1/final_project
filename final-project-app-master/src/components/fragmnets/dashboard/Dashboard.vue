<template>
    <div>


       <vs-row>

           <vs-col vs-w="0" vs-xs="1" vs-sm="1"></vs-col>


           <vs-col vs-w="12" vs-xs="10" vs-sm="10">
               <vs-row v-if="counts" vs-type="flex" vs-justify="space-around" >
                   <vs-col vs-w="1" vs-xs="0" vs-sm="0"></vs-col>

                   <!--            {requests: 0, commits: 0, versions: 0, collaborators: 0}-->
                   <vs-col vs-w="1" vs-xs="6" vs-sm="6" style="padding: 1%">
                       <ProjectAggregations :title="counts['collaborators']+'-users'"
                                            icon="supervised_user_circle"></ProjectAggregations>
                   </vs-col>
                   <vs-col vs-w="1" vs-xs="6" vs-sm="6" style="padding: 1%">
                       <ProjectAggregations :title="counts['requests']+'-requests'"
                                            icon="compare_arrows"></ProjectAggregations>
                   </vs-col>

                   <vs-col vs-w="1"  vs-xs="6" vs-sm="6" style="padding: 1%">
                       <ProjectAggregations :title="counts['commits']+'-commits'" icon="share"></ProjectAggregations>
                   </vs-col>

                   <vs-col vs-w="1"  vs-xs="6" vs-sm="6" style="padding: 1%">
                       <ProjectAggregations :title="counts['versions']+'-versions'" icon="all_inclusive"></ProjectAggregations>
                   </vs-col>
                   <vs-col vs-w="1" vs-xs="0" vs-sm="0"></vs-col>

               </vs-row>

               <div id="count-loading">

               </div>


               <vs-row vs-type="flex" vs-justify="center" class="mt-5">

                   <vs-col vs-w="3" vs-xs="12" vs-sm="12">
                       <vs-card>
                           <DashBoardChart v-if="commits" :title="commit_title" :dates="commits['months']"
                                           :count="commits['counts']"></DashBoardChart>
                       </vs-card>

                   </vs-col>
                   <vs-col vs-w="1" ></vs-col>

                   <vs-col vs-w="3" vs-xs="12" vs-sm="12">
                       <vs-card>
                           <DashBoardChart   v-if="versions" :title="version_title" :dates="versions['months']"
                                           :count="versions['counts']"></DashBoardChart>
                       </vs-card>

                   </vs-col>

               </vs-row>


               <vs-row vs-type="flex" vs-justify="center" class="mt-5">


                   <vs-col vs-w="3" vs-xs="12" vs-sm="12">

                       <ProjectStakeHolders :manage="false" v-if="collaborators"
                                            :collaborators="collaborators"></ProjectStakeHolders>

                   </vs-col>
                   <vs-col vs-w="1" vs-xs="0"></vs-col>

                   <vs-col vs-w="3" vs-xs="12" vs-sm="12">
                       <FrontEndDevProgress v-if="progress_data" :progress="progress_data"></FrontEndDevProgress>
                   </vs-col>

               </vs-row>
           </vs-col>
           <vs-col vs-w="0" vs-xs="1"></vs-col>


       </vs-row>


    </div>
</template>

<script>
    import DashBoardChart from "./fragmnets/DashBoardChart";
    import FrontEndDevProgress from "./fragmnets/FrontEndDevProgress";
    import ProjectStakeHolders from "./fragmnets/ProjectStakeHolders";
    import ProjectAggregations from "./fragmnets/ProjectAggregations";
    import {DashboardService} from "../../../services/dashboard_service";
    import {MyProjectService} from "../../../services/my_project_service";
    // import VueCircle from 'vue2-circle-progress'

    export default {
        name: "Dashboard",
        components: {ProjectAggregations, ProjectStakeHolders, FrontEndDevProgress, DashBoardChart},
        data() {
            return {
                commit_title: 'Commits',
                version_title: 'Versions',
                fill: {gradient: ["red", "green", "blue"]},
                p_id: this.$route.params['p_id'],
                counts: null,
                commit_count: [2, 3, 4, 4, 55, 6],
                // commit_date: ['jan', 'sempt', 'oct', 'asd', 'asd', 'asd'],
                commits: null,
                progress_data: 0,
                versions: null,
                collaborators: null
            }
        },
        created() {


            this.getProjectProgress();
            this.getCounts();
            this.getCollaborators();
            this.getCommitsBerMonths();
            this.getVersionsPerMonths();
        },
        methods: {
            getProjectProgress() {
                console.log('get progress')
                MyProjectService.projectProgress(this.$route.query['admin_id'], this.$route.params['p_id'])
                    .then(response => {
                        console.log(response['progress'])
                        if (response['progress'] === 100) {
                            this.progress_data = 99
                        } else {
                            this.progress_data = response['progress']
                        }


                    }).catch(err => {
                    console.log(err)
                })
                // console.log(stepValue);
            },

            getCollaborators() {
                DashboardService.getProjectCollaborators(this.p_id).then(response => {
                    this.collaborators = response;
                }).catch(err => {
                    this
                        .showErr(err)

                })
            },
            getCommitsBerMonths() {
                DashboardService.getProjectCommitsPerMonths(this.p_id).then(response => {
                    this.commits = response;
                }).catch(err => {
                    this
                        .showErr(err)

                })
            },
            getVersionsPerMonths() {
                DashboardService.getProjectVersionsPerMonths(this.p_id).then(response => {
                    this.versions = response;
                }).catch(err => {
                    this
                        .showErr(err)

                })
            },
            getCounts() {

                DashboardService.getProjectCount(this.p_id).then(response => {
                    this.counts = response;
                }).catch(err => {
                    console.log(err)
                    this.showErr(err)

                })
            },
            showErr(err) {
                this.$vs.notify({
                    title: 'Alert',
                    text: err,
                    color: 'danger',
                    // icon: 'done'
                })
            },
            progress_end(event) {
                alert(event)
                // console.log("Circle progress end");
            }
        }
    }
</script>

<style scoped>

</style>
