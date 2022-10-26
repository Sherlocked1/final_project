<template>
    <div>
        <vs-button @click="openAddDilaog" color="warning" type="flat" icon="add_box">New {{type}}
        </vs-button>
        <vs-divider></vs-divider>
        <vs-table

                :data="request_relevant_data">
            <template slot="thead">
                <vs-th>
                    Key
                </vs-th>
                <vs-th>
                    Value
                </vs-th>
                <vs-th>
                    Edit
                </vs-th>
                <vs-th>
                    Delete
                </vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].key">
                        {{data[indextr].key}}
                    </vs-td>

                    <vs-td :data="data[indextr].value">
                        {{data[indextr].value}}
                    </vs-td>


                    <vs-td>
                        <vs-button @click="openUpdateDilaog(data[indextr])" color="primary" type="line"
                                   icon="edit"></vs-button>

                    </vs-td>

                    <vs-td>
                        <vs-button v-if="!is_deleting" @click="deleteItem(data[indextr]['_id'])" color="danger"
                                   type="line"
                                   icon="remove_circle_outline"></vs-button>

                        <ClipLoader v-else color="#00B8D4"></ClipLoader>


                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--        new req rev dialog-->
        <vs-popup class="holamundo" :title="'create new '+type" :active.sync="activeAddDialog">
            <form @submit.prevent="add">
                <vs-input size="default"

                          style="width: 100%" class="p-3"
                          label="Key"

                          placeholder="Key" v-model.trim="key"/>
                <vs-input size="default"

                          style="width: 100%" class="p-3"
                          label="Value"

                          placeholder="Value" v-model.trim="value"/>
                <vs-row>
                    <vs-col vs-w="6" vs-offset="3">
                        <vs-button v-if="!is_adding" @click="add" style="width: 100%" class="mt-3 text-center "
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

        <vs-popup class="holamundo" :title="'update'+type" :active.sync="activeUpdateDialog">
            <form @submit.prevent="update">
                <vs-input size="default"

                          style="width: 100%" class="p-3"
                          label="Key"

                          placeholder="Key" v-model.trim="key"/>
                <vs-input size="default"

                          style="width: 100%" class="p-3"
                          label="Value"

                          placeholder="Value" v-model.trim="value"/>
                <vs-row>
                    <vs-col vs-w="6" vs-offset="3">
                        <vs-button v-if="!is_updating" @click="update" style="width: 100%"
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
    </div>
</template>

<script>
    import {RequestParamsService} from "../../../../services/request_params_service";
    import {RequestBodyService} from "../../../../services/request_body_service";
    import {RequestHeadersService} from "../../../../services/request_headers_service";
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

    export default {
        name: "RequestRelevent",
        components: {ClipLoader},
        props: {
            // request_data: Array,
            type: String,
            request: Object
        },
//request_relevant_data

        data() {
            return {
                activeAddDialog: false,
                is_adding: false,
                is_updating: false,
                is_deleting: false,
                title_for_add: "Add " + this.type,
                title_for_update: "Update " + this.type,
                selected_request_relevant_for_update_id: '',

                activeUpdateDialog: false,
                key: '',
                value: '',
                request_relevant_data: []

            }
        },

        created() {
            console.log("get data ");

            this.getData();
        },

        methods: {


            getData() {
                switch (this.type) {

                    case  'param':
                        RequestParamsService.getAll(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'])
                            .then(response => {
                                this.request_relevant_data = response;
                            }).catch(err => {
                            console.log(err)

                        });
                        break;
                    case  'header':
                        RequestHeadersService.getAll(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'])
                            .then(response => {
                                this.request_relevant_data = response;
                            }).catch(err => {
                            console.log(err)

                        });
                        break;

                    case 'body':
                        RequestBodyService.getAll(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'])
                            .then(response => {
                                this.request_relevant_data = response;
                            }).catch(err => {
                            console.log(err)

                        });

                }
            },

            add() {
                this.is_adding = true;
                switch (this.type) {

                    case  'param' :
                        RequestParamsService.create(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], this.key, this.value)
                            .then(response => {
                                this.activeAddDialog = false;
                                this.getData();
                                this.$emit('done')
                                this.is_adding = false;
                            }).catch(err => {
                            this.is_adding = false;

                            console.log(err)
                        })
                        break;
                    case  'header' :
                        RequestHeadersService.create(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], this.key, this.value)
                            .then(response => {
                                this.activeAddDialog = false;
                                this.getData();
                                this.$emit('done')
                                this.is_adding = false;

                            }).catch(err => {
                            this.is_adding = false;

                            console.log(err)
                        })
                        break;
                    case  'body' :
                        RequestBodyService.create(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], this.key, this.value)
                            .then(response => {
                                this.activeAddDialog = false;
                                this.getData();
                                this.$emit('done')
                                this.is_adding = false;

                            }).catch(err => {
                            this.is_adding = false;

                            console.log(err)
                        })


                }
            },
            //request_relevant_id
            deleteItem(request_relevant_id) {
                this.is_deleting = true;

                switch (this.type) {
                    case  'param' :
                        RequestParamsService.delete(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], request_relevant_id)
                            .then(response => {
                                this.getData();
                                this.$emit('done')
                                this.is_deleting = false;


                            }).catch(err => {
                            this.is_deleting = false;

                            console.log(err)
                        })
                        break;
                    case  'header' :
                        RequestHeadersService.delete(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], request_relevant_id)
                            .then(response => {
                                this.getData();
                                this.$emit('done')
                                this.is_deleting = false;

                            }).catch(err => {
                            console.log(err)
                        })
                        break;
                    case  'body' :
                        RequestBodyService.delete(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], request_relevant_id)
                            .then(response => {
                                this.getData();
                                this.$emit('done')

                            }).catch(err => {
                            this.is_deleting = false;

                            console.log(err)
                        })


                }
            },
            openUpdateDilaog(request_relevant) {
                this.key = request_relevant['key']
                this.value = request_relevant['value']
                this.selected_request_relevant_for_update_id = request_relevant['_id']
                this.activeUpdateDialog = true;
            },
            openAddDilaog() {
                this.key = ''
                this.value = ''

                this.activeAddDialog = true;
            },
            update() {
                this.is_updating = true;

                switch (this.type) {
                    case  'param' :
                        RequestParamsService.update(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], this.selected_request_relevant_for_update_id, this.key, this.value)
                            .then(response => {
                                this.activeUpdateDialog = false;
                                this.selected_request_relevant_for_update_id = null
                                this.getData();
                                this.$emit('done')
                                this.is_updating = false;

                            }).catch(err => {
                            this.is_updating = false;

                            console.log(err)
                        })
                        break;
                    case  'header' :
                        RequestHeadersService.update(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], this.selected_request_relevant_for_update_id, this.key, this.value)
                            .then(response => {
                                this.activeUpdateDialog = false;
                                this.selected_request_relevant_for_update_id = null
                                this.getData();
                                this.$emit('done')
                                this.is_updating = false;

                            }).catch(err => {
                            this.is_updating = false;

                            console.log(err)
                        })
                        break;
                    case  'body' :
                        RequestBodyService.update(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], this.selected_request_relevant_for_update_id, this.key, this.value)
                            .then(response => {
                                this.is_updating = false;

                                this.activeUpdateDialog = false;
                                this.selected_request_relevant_for_update_id = null
                                this.getData();
                                this.$emit('done')

                            }).catch(err => {
                            this.is_updating = false;

                            console.log(err)
                        })


                }
            },

        }
    }
</script>

<style scoped>

</style>
