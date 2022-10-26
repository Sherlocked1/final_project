<template>
    <div v-if="!load_projects">


        <vs-row>
            <vs-col vs-type="flex" vs-justify="start">
                <vs-button @click="addNewProjectPopActive=true" color="warning" type="flat" icon="add_circle">Create new
                    project
                </vs-button>
            </vs-col>
        </vs-row>


        <vs-row v-if="projects.length>0" >
            <vs-col v-for="(item , index) in projects" :key="index" class="p-3 " type="flex" vs-align="center" vs-w="2" vs-xs="6" vs-sm="4">
                <ProjectItem :isAdmin="true" @updated="done" @deleted="done" :project="projects[index]"></ProjectItem>
            </vs-col>



        </vs-row>
        <AppHint v-else  message="Empty projects , create project and invite team"
                 image_name="undraw_empty_street_sfxm.svg" w="350" h="350"/>

        <!--        pop up for create new project-->
        <vs-popup class="holamundo" title="Create new project" :active.sync="addNewProjectPopActive">
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
                          placeholder="description" v-model.trim="$v.description.$model"/>
                <vs-row>
                    <vs-col vs-w="6" vs-offset="3">
                        <vs-button v-if="!adding_project" @click="createProject" style="width: 100%"
                                   class="s-con-loading__container mt-3 text-center "
                                   color="primary"
                                   type="border"
                                   ref="addBtn"
                                   icon="add">
                            Create new project
                        </vs-button>

                        <ClipLoader v-else color="#00B8D4"></ClipLoader>

                    </vs-col>
                </vs-row>
            </form>

        </vs-popup>
        <!--        pop for project setting-->


    </div>

</template>

<script>
    import {required} from 'vuelidate/lib/validators'
    import ProjectItem from "./fragments/ProjectItem";
    import {MyProjectService} from "../../../services/my_project_service";
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import AppHint from "../../partials/AppHint";

    export default {
        name: "MyProjects",
        components: {AppHint, ProjectItem, ClipLoader},
        data() {
            return {
                title: '',
                disableProject: true,
                description: '',
                err_message: '',
                projects: [],
                adding_project: false,
                updating_project: false,
                addNewProjectPopActive: false,
                load_projects  :false


            }
        },
        validations: {

            title: {
                required
            },
            description: {
                required
            }
        },
        created() {
            this.getAll();
        },
        methods: {

            done(message) {
                this.$vs.notify({
                    title: 'Alert',
                    text: message,
                    color: 'success',
                    icon: 'done'
                })

                this.getAll();

            },

            createProject() {
                this.adding_project = true;

                MyProjectService.create(this.title, this.description)
                    .then(response => {
                        this.addNewProjectPopActive = false;




                        setTimeout(() => {
                            this.getAll();
                            this.title = ''
                            this.description = ''
                            this.adding_project = false;
                        }, 1000);


                    }).catch(err => {
                    this.err_message = err;
                    this.adding_project = false;


                })
            },

            getAll() {
                this.load_projects=true
                this.$vs.loading()
                MyProjectService.getAll().then(response => {
                    this.projects = response;
                    this.$vs.loading.close()
                    this.load_projects=false
                }).catch(err => {

                    this.$vs.loading.close()
                    this.err_message = err;
                    this.load_projects=false
                })
            },
            createNewProject() {
                this.$vs.loading()

                this.$v.$touch()
                if (this.$v.$invalid) {
                    // console.log('invalid')
                    // alert("invalid")
                    setTimeout(() => {
                        this.$vs.loading.close()
                    }, 1000);

                } else {
                    // alert("valid")
                    setTimeout(() => {
                        this.$vs.loading.close()
                    }, 2000);
                    // console.log('valid')
                    this.isLoading = true
                }
            }
        }
    }
</script>

<style scoped>

</style>
