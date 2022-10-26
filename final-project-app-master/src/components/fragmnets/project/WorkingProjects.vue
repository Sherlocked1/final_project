<template>
    <div v-if="!load_projects">


        <vs-row v-if="projects.length>0">
            <vs-col v-for="(project , index) in projects" :key="index" class="p-3 " type="flex" vs-align="center"
                    vs-w="3" vs-xs="6" vs-sm="4">
                <ProjectItem :isAdmin="false" :project="project"></ProjectItem>
            </vs-col>

        </vs-row>


        <AppHint v-else message="Ask projects owner to invites you on project"
                 image_name="undraw_empty_street_sfxm.svg" w="350" h="350"/>

    </div>

</template>

<script>
    import {required} from 'vuelidate/lib/validators'
    import ProjectItem from "./fragments/ProjectItem";
    import {MyProjectService} from "../../../services/my_project_service";
    import AppHint from "../../partials/AppHint";

    export default {
        name: "MyProjects",
        components: {AppHint, ProjectItem},
        data() {
            return {
                title: '',

                disableProject: true,
                description: '',
                projects: [],

                addNewProjectPopActive: false,
                ProjectSettingPopActive: false,
                load_projects: true


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
            this.getWorkingProject();
        },
        methods: {


            getWorkingProject() {
                this.load_projects = true
                this.$vs.loading()

                MyProjectService.getAllWorkingProjects().then(response => {
                    this.load_projects = false
                    this.projects = response;
                    this.$vs.loading.close()


                }).catch(err => {
                    this.load_projects = false
                    this.$vs.loading.close()
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
