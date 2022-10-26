<template>
    <div>
        <vs-card>

            <vs-row class="mb-3 p-2" vs-justify="space-between"
                    style="background-color: rgb(36, 33, 69); border-radius: 10px">
                <vs-button @click="openCreateRequestDialog" color="warning" type="flat"
                           icon="add_circle"></vs-button>
                <vs-button v-if="typeof  selected_request === 'object' " color="primary" type="flat" icon="edit"
                           @click="activeForUpdateReq=!activeForUpdateReq"></vs-button>
                <div v-if="!is_deleting">
                    <vs-button v-if="typeof  selected_request === 'object' " color="danger" type="flat" icon="clear"
                               @click="deleteRequest"></vs-button>
                </div>
                <ClipLoader v-else color="#00B8D4"></ClipLoader>


                <vs-button @click="checkForRequest" color="success" type="flat" icon="autorenew"
                >
                </vs-button>


            </vs-row>
            <ul class="list-group " style="max-height: 610px; overflow-y: auto; overflow-x: hidden; height: 610px">
                <li class="list-group-item p-2 " v-for="(request , index) in requests" :key="index"
                    @click="select(request)"
                    :style="[selected_request['_id']===request['_id'] ? {'background-color': 'ghostwhite' , 'border-radius': '10px'} : {}]">

                    <vs-row vs-type="flex" vs-justify="space-between">
                        <vs-col vs-w="2" vs-type="flex" vs-justify="flex-start" vs-align="start">
                            <div v-if="selected_request['_id']===request['_id']"
                                 style="height: 50px; width: 3px; background-color: #00B8D4">

                            </div>
                        </vs-col>

                        <vs-col vs-w="10">
                            <vs-row>
                                <div
                                        class="px-2">
                                    <span v-if="request['method'].toUpperCase()==='POST'"
                                          style="color: orange; font-weight: bold">{{request['method'].toUpperCase()}}</span>
                                    <span v-else-if="request['method'].toUpperCase()==='POST'"
                                          style="color: orange; font-weight: bold">{{request['method'].toUpperCase()}}</span>
                                    <span v-else-if="request['method'].toUpperCase()==='GET'"
                                          style="color: green; font-weight: bold">{{request['method'].toUpperCase()}}</span>
                                    <span v-else-if="request['method'].toUpperCase()==='PUT'"
                                          style="color: blue; font-weight: bold">{{request['method'].toUpperCase()}}</span>
                                    <span v-else-if="request['method'].toUpperCase()==='DELETE'"
                                          style="color: red; font-weight: bold">{{request['method'].toUpperCase()}}</span>


                                </div>
                                <p style="color:  #00B8D4; font-weight: bold"
                                   v-if="selected_request['_id']===request['_id']">
                                    {{request['title']}}</p>
                                <p v-else> {{request['title']}}</p>
                            </vs-row>
                        </vs-col>


                    </vs-row>

                    <!--                    <vs-divider/>-->

                </li>


            </ul>
        </vs-card>


        <!--        add request pop-->

        <!--        new req rev dialog-->
        <vs-popup class="holamundo" title="title_for_add" :active.sync="activeForAddReq">
            <form @submit.prevent="createRequest">
                <vs-input :danger="$v.title.$error" :success="!$v.title.$invalid"
                          success-text="valid title"
                          label="title"
                          danger-text="invalid title"
                          v-model.trim="$v.title.$model"
                          style="width: 100%" size="default" placeholder="title"/>
                <vs-input
                        :danger="$v.description.$error" :success="!$v.description.$invalid"
                        success-text="valid description"
                        danger-text="invalid description"
                        label="description"
                        v-model.trim="$v.description.$model"
                        style="width: 100%" size="default" placeholder="description"
                />
                <vs-row>
                    <vs-col vs-w="6" vs-offset="3">
                        <vs-button v-if="!is_adding" @click="createRequest" style="width: 100%"
                                   class="mt-3 text-center "
                                   color="primary"
                                   type="border"
                                   icon="add">Add
                        </vs-button>
                        <ClipLoader v-else color="#00B8D4"></ClipLoader>

                    </vs-col>
                </vs-row>
            </form>
        </vs-popup>

        <!--        update req rev dialog-->

        <vs-popup class="holamundo" title="title_for_update" :active.sync="activeForUpdateReq">
            <form @submit.prevent="updateTitleAndDescription">
                <vs-input :danger="$v.title.$error" :success="!$v.title.$invalid"
                          success-text="valid title"
                          danger-text="invalid title"
                          label="title"
                          v-model.trim="$v.title.$model"
                          style="width: 100%" size="default" placeholder="title"/>
                <vs-input
                        :danger="$v.description.$error" :success="!$v.description.$invalid"
                        success-text="valid description"
                        danger-text="invalid description"
                        label="description"
                        v-model.trim="$v.description.$model"
                        style="width: 100%" size="default" placeholder="description"
                />
                <vs-row>
                    <vs-col vs-w="6" vs-offset="3">
                        <vs-button v-if="!is_updating" @click="updateTitleAndDescription" style="width: 100%"
                                   class="mt-3 text-center "
                                   color="primary"
                                   type="border"
                                   icon="edit">Update
                        </vs-button>
                        <ClipLoader v-else color="#00B8D4"></ClipLoader>

                    </vs-col>
                </vs-row>
            </form>
        </vs-popup>

        <!--        update request pop-->

    </div>

</template>

<script>
    import {required} from 'vuelidate/lib/validators'
    import {RequestsService} from "../../../../services/requests_service";
    import {UserSession} from "../../../../services/users_session_services";
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import fab from 'vue-fab'

    export default {
        name: "RequestsList",
        components: {ClipLoader, fab},

        props: {
            requests: Array
        },
        data() {
            return {
                title: '',
                is_adding: false,
                is_updating: false,
                is_deleting: false,
                description: '',
                selected_request: 'null',
                // requests: [1, 2, 3, 4, 2,],

                activeForAddReq: false,
                activeForUpdateReq: false,

            }
        },
        validations: {

            title: {
                required
            },
            description: {
                required
            },

        },
        methods: {

            openCreateRequestDialog() {
                this.activeForAddReq = !this.activeForAddReq
                this.clearFields();
            },

            checkForRequest() {
                RequestsService.allProjectHasTestCases(this.$route.query['admin_id'], this.$route.params['p_id'],)
                    .then(response => {

                        if (response['all_has_at_least_one_test_case'] === false) {
                            //    to next
                            this.$vs.notify({
                                title: 'Alert',
                                text: response['message'],
                                color: 'warning',
                                icon: 'warning'
                            })
                        } else {
                            this.$router.push(`/project/${this.$route.params['p_id']}/tester/requests_automation?role=${this.$route.query['role']}&admin_id=${this.$route.query['admin_id']}`)
                            //    show message
                        }

                    }).catch(err => {
                    console.log(err)
                })
            },

            createRequest() {
                this.is_adding = true
                RequestsService.createRequest(this.$route.query['admin_id'], this.$route.params['p_id'], this.title, this.description, UserSession.getUserData()['_id'])
                    .then(response => {
                        this.activeForAddReq = false;
                        this.clearFields()
                        this.$emit('done')
                        this.is_adding = false

                    }).catch(err => {
                    console.log(err)
                    this.is_adding = false

                })
            },
            updateTitleAndDescription() {
                this.is_updating = true

                RequestsService.updateRequestTitleAndDescription(this.$route.query['admin_id'], this.$route.params['p_id'],
                    this.selected_request['_id'], this.title, this.description, UserSession.getUserData()['_id'], this.selected_request['title'])
                    .then(response => {
                        //dialog ---->false
                        this.activeForUpdateReq = false;
                        setTimeout(() => {
                            this.$vs.notify({
                                title: 'Alert',
                                text: response['message'],
                                color: 'success',
                                icon: 'done'
                            })

                            this.$emit('done')
                            this.is_updating = false

                        }, 10)

                    }).catch(err => {
                    this.showErr(err)
                    this.is_updating = false

                })
            },


            select(request) {
                this.selected_request = request
                this.title = this.selected_request['title']
                this.description = this.selected_request['description']

                this.$emit('select_request', request)
            },
            deleteRequest() {
                this.is_deleting = true

                if (this.selected_request !== "null") {
                    RequestsService.removeRequest(this.$route.query['admin_id'], this.$route.params['p_id'], this.selected_request['_id'], UserSession.getUserData()['_id'], this.selected_request['title']).then(response => {
                        this.$vs.notify({
                            title: 'Alert',
                            text: response['message'],
                            color: 'success',
                            icon: 'done'
                        })

                        this.$emit('done')
                        this.clearFields()
                        this.is_deleting = false


                    }).catch(err => {
                        this.showErr(err)
                        this.is_deleting = false

                    })
                } else {
                    this.showErr("please select request")
                    this.is_deleting = false

                }

            },
            clearFields() {
                this.title = ''
                this.description = ''
            },
            showErr(err) {
                this.$vs.notify({
                    title: 'Alert',
                    text: err,
                    color: 'danger',
                })
            }
        }
    }
</script>

<style scoped>

    li {
        border: 0px;

    }

    li :hover {
        background-color: ghostwhite;
        cursor: pointer;
    }
</style>
