<template>
    <div style="cursor: pointer">
        <vs-card >


            <!--            <vs-alert style="" class="my-2" v-if="!isAdmin" active="true" color="warning">-->
            <!--               -->
            <!--            </vs-alert>-->
            <vs-row v-if="!isAdmin">
                <vs-col vs-w="12">
                    <vs-chip transparent color="warning">
                        <vs-avatar :src="this.$store.state.profile_image_path"/>
                        {{project['role']}}
                    </vs-chip>
                </vs-col>
            </vs-row>

            <h6 style="margin: 5%; font-weight: bold;">{{project['p_name'].length > 30 ? project['p_name'].substring(0,30)+"..." :
                project['p_name']}}</h6>
            <!--            <vs-divider/>-->
            <p style="margin: 5%; color: gray; font-weight: bold;">
                <span>{{project['P_description'].length > 100 ? project['P_description'].substring(0,100)+"..." : project['P_description']}}</span>
            </p>
            <!--            <vs-divider/>-->
            <vs-row style="margin: 5%">
                <vs-col vs-type="flex" vs-justify="start">
                    <vs-icon size="small" icon="access_time"></vs-icon>
                    <p class="mt-1" style="font-size: smaller; font-weight: bold; color: gray">
                        <timeago :datetime="this.project['createdAt']"></timeago>
                    </p>

                </vs-col>
            </vs-row>
            <vs-row style="background-color: #00D0EA; border-radius: 10px">
                <vs-col vs-type="flex" vs-justify="space-around">
                    <vs-button @click="toProject" color="dark" type="flat" icon="visibility">View
                    </vs-button>
                    <vs-button v-if="isAdmin" @click="ProjectSettingPopActive=true" color="dark" type="flat"
                               icon="settings_applications">Setting
                    </vs-button>

                </vs-col>
            </vs-row>
        </vs-card>


        <vs-popup class="holamundo" title="Project Setting" :active.sync="ProjectSettingPopActive">
            <vs-row>
                <vs-col vs-w="5">
                    <vs-button style="width: 80%" @click="openUpdateDialog" color="primary" class="p-2" type="border"
                               icon="create">Edit
                    </vs-button>

                </vs-col>

                <vs-col vs-w="2"></vs-col>
                <vs-col vs-w="5">
                    <vs-button v-if="!del_project" style="width: 80%" color="danger" @click="deleteProject" class="p-2"
                               type="border"
                               icon="delete">Delete
                    </vs-button>

                    <ClipLoader v-else color="#00B8D4"></ClipLoader>

                </vs-col>
            </vs-row>

        </vs-popup>


        <vs-popup class="holamundo" title="update" :active.sync="UpdateProjectPopActive">
            <form @submit.prevent="createNewProject">
                <vs-input size="default" :danger="$v.title.$error" :success="!$v.title.$invalid"
                          success-text="valid title"
                          danger-text="invalid title"
                          style="width: 100%" class="my-2 p-3" label="Title" placeholder="project title"
                          v-model.trim="$v.title.$model"/>
                <vs-input :danger="$v.description.$error" :success="!$v.description.$invalid" size="default"

                          style="width: 100%" class="p-3"
                          label="Description"
                          success-text="valid description"
                          danger-text="invalid description"
                          placeholder="password" v-model.trim="$v.description.$model"/>
                <vs-row>
                    <vs-col vs-w="6" vs-offset="3">
                        <vs-button v-if="!updating_project" @click="update" style="width: 100%"
                                   class="mt-3 text-center "
                                   color="primary"
                                   type="border"
                                   icon="create">Update
                        </vs-button>

                        <ClipLoader v-else color="#00B8D4"></ClipLoader>
                    </vs-col>
                </vs-row>
            </form>

        </vs-popup>


    </div>
</template>

<script>
    import {required} from 'vuelidate/lib/validators'
    import {MyProjectService} from "../../../../services/my_project_service";
    import {UserSession} from "../../../../services/users_session_services";
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'


    export default {
        name: "ProjectItem",
        components: {ClipLoader},
        props: {
            project: Object,
            isAdmin: Boolean
        },
        data() {
            return {
                ProjectSettingPopActive: false,
                UpdateProjectPopActive: false,
                updating_project: false,
                del_project: false,

                title: '',
                disableProject: true,
                view_project_route: `/project/${this.project['_id']}/admin/dashboard?role=admin`
            }
        },
        created() {
            this.title = this.project['p_name'];
            this.description = this.project['P_description'];

        },

        validations: {

            title: {
                required
            },
            description: {
                required
            }
        },
        methods: {

            toProject(project) {

                if (this.isAdmin) {
                    this.$router.push(`/project/${this.project['_id']}/admin/dashboard?role=admin&admin_id=${UserSession.getUserData()['_id']}`)
                } else {
                    if (this.project['role'] === 'Devloper/Tester') {
                        this.$router.push(`/project/${this.project['_id']}/tester/testing_tool?role=tester&admin_id=${this.project['admin_id']}`)
                    } else {
                        this.$router.push(`/project/${this.project['_id']}/front_end_dev/front_dev?role=front_end_dev&admin_id=${this.project['admin_id']}`)
                    }
                }

            },
            deleteProject() {
                this.del_project = true;
                this.ProjectSettingPopActive = false
                MyProjectService.delete(this.project['_id']).then(response => {

                    this.$emit('deleted', response['message'])
                    this.del_project = false;

                }).catch(err => {
                    console.log(err)
                    this.del_project = false;

                })

            },
            openUpdateDialog() {
                this.ProjectSettingPopActive = false
                this.UpdateProjectPopActive = true
            },
            update() {
                this.UpdateProjectPopActive = false
                this.updating_project = true
                MyProjectService.update(this.project['_id'], this.title, this.description)
                    .then(response => {

                        this.$emit('updated', response['message'])
                        this.updating_project = false

                    }).catch(err => {
                    console.log(err)
                    this.updating_project = false


                })


            }
        }
    }
</script>

<style scoped>

</style>
