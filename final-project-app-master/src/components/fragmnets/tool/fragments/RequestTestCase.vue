<template>
    <div>
        <vs-button @click="openAddDiloag" color="warning" type="flat" icon="add_box">New Test case
        </vs-button>
        <vs-divider></vs-divider>


        <vs-table

                :data="test_cases">
            <template slot="thead">
                <vs-th>
                    Actual
                </vs-th>
                <vs-th>
                    Operator
                </vs-th>
                <vs-th>
                    Expected
                </vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :data="tr" :to_be_tested="indextr" v-for="(tr, indextr) in data" :key="indextr">
                    <vs-td :data="data[indextr].to_be_tested">
                        {{data[indextr].to_be_tested}}
                    </vs-td>

                    <vs-td :data="data[indextr].operator">
                        {{data[indextr].operator}}
                    </vs-td>


                    <vs-td :data="data[indextr].operator">
                        {{data[indextr].expected_value}}
                    </vs-td>


                    <vs-td>
                        <vs-button @click="openDialogForUpdate(data[indextr])" color="primary" type="line"
                                   icon="edit"></vs-button>

                    </vs-td>

                    <vs-td>
                        <vs-button v-if="!is_deleting" color="danger" @click="deleteTestCase(data[indextr]['_id'])"
                                   type="line"
                                   icon="remove_circle_outline"></vs-button>
                        <ClipLoader v-else-if="is_deleting && selected_for_dele===data[indextr]['_id']"
                                    color="#00B8D4"></ClipLoader>


                    </vs-td>

                </vs-tr>
            </template>
        </vs-table>


        <!--        new req rev dialog-->
        <vs-popup class="holamundo" title="Add new test case" :active.sync="activeAddDialog">
            <form @submit.prevent="add">


                <p class="start">Case</p>
                <VueSelect v-model="selectedCase" style="width: 100%;  margin-bottom: 1%"
                           :options="cases"/>


                <p class="start">Operator</p>

                <VueSelect v-model="selectedOp" style="width: 100% ; margin-bottom: 1%"
                           :options="op"/>


                <vs-input size="default"

                          style="width: 100%" class="pb-3"
                          label="Expected operator"

                          placeholder="Value" v-model.trim="expected_value"/>
                <vs-row>
                    <vs-col vs-w="6" vs-offset="3">
                        <vs-button v-if="!is_adding" @click="add" style="width: 100%" class=" text-center "
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

        <vs-popup class="holamundo" title="Update test case" :active.sync="activeUpdateDialog">
            <form @submit.prevent="update">
                <!--                <vs-select-->
                <!--                        class="selectExample"-->
                <!--                        width="100%"-->
                <!--                        label="cases"-->
                <!--                        v-model="selectedCase"-->
                <!--                >-->
                <!--                    <vs-select-item v-for="(_case , index ) in cases" :value="_case" :key="index"-->
                <!--                                    :text="_case"-->
                <!--                    />-->
                <!--                </vs-select>-->


                <!--                <vs-select-->
                <!--                        class="selectExample"-->


                <!--                        width="100%"-->
                <!--                        label="operators"-->
                <!--                        v-model="selectedOp"-->
                <!--                >-->
                <!--                    <vs-select-item v-for="(_op , index ) in op" :value="_op" :key="index"-->
                <!--                                    :text="_op"-->
                <!--                    />-->
                <!--                </vs-select>-->

                <p class="start">Case</p>
                <VueSelect v-model="selectedCase" style="width: 100%;  margin-bottom: 1%"
                           :options="cases"/>


                <p class="start">Operator</p>

                <VueSelect v-model="selectedOp" style="width: 100% ; margin-bottom: 1%"
                           :options="op"/>


                <vs-input size="default"

                          style="width: 100%" class="pb-3"
                          label="Expected operator"

                          placeholder="Value" v-model.trim="expected_value"/>
                <vs-row>
                    <vs-col vs-w="6" vs-offset="3">
                        <vs-button v-if="!is_updating" @click="update" style="width: 100%" class=" text-center "
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
<!--operator-->
<script>

    import {RequestTestCasesService} from "../../../../services/test_cases_service";
    import VueSelect from 'vue-select'
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

    import vSelect from 'vue-select'

    export default {
        name: "RequestTestCase",
        components: {VueSelect, ClipLoader},
        props: {
            // test_data: Array,
            request: Object
        },
        data() {
            return {
                test_cases: [],
                activeAddDialog: false,
                selectedCase: 'time',
                cases: ['time', 'status'],
                selectedOp: '=',
                op: ['=', '>', '<', '<=', '>='],
                is_adding: false,
                is_updating: false,
                is_deleting: false,
                selected_for_dele: 0,

                title_for_add: "Add ",
                title_for_update: "Update ",
                activeUpdateDialog: false,
                selected_test_case_id_for_update: null,
                to_be_tested: '',
                operator: '',
                expected_value: ''
//expected_value
            }
        },
        created() {
            this.getData();
        },

        methods: {
            onCaseChange(_case) {
                this.selectedCase = _case
            },
            onOpChange(_op) {
                this.selectedOp = _op;
            },
            getData() {

                RequestTestCasesService.getAll(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'])
                    .then(response => {
                        this.test_cases = response;
                    }).catch(err => {
                    console.log(err)

                });


            },
            openAddDiloag() {
                this.selectedCase = 'time'
                this.selectedOp = '='
                this.expected_value = ''
                this.activeAddDialog = true

            },
            openDialogForUpdate(test_case) {
                this.selected_test_case_id_for_update = test_case['_id']
                this.selectedCase = test_case['to_be_tested']
                this.selectedOp = test_case['operator']
                this.expected_value = test_case['expected_value']

                this.activeUpdateDialog = true

            },
            add() {
                this.is_adding = true
                RequestTestCasesService.create(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], this.selectedCase, this.selectedOp, this.expected_value)
                    .then(response => {
                        this.activeAddDialog = false;
                        this.getData();
                        this.$emit('done')
                        this.is_adding = false


                    }).catch(err => {
                    console.log(err)
                })

            },
            deleteTestCase(test_case_id) {
                this.is_deleting = true
                this.selected_for_dele = test_case_id

                RequestTestCasesService.delete(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], test_case_id)
                    .then(response => {
                        this.activeAddDialog = false;
                        this.getData();
                        this.$emit('done')
                        this.is_deleting = false

                    }).catch(err => {
                    console.log(err)
                    this.is_deleting = false

                })
            },
            update() {

                // console.log(this.to_be_tested)
                this.is_updating = true

                RequestTestCasesService.update(this.$route.query['admin_id'], this.$route.params['p_id'], this.request['_id'], this.selected_test_case_id_for_update, this.selectedCase, this.selectedOp, this.expected_value)
                    .then(response => {
                        this.activeUpdateDialog = false;
                        this.getData();
                        this.$emit('done')
                        this.is_updating = false

                    }).catch(err => {
                    console.log(err)
                    this.is_updating = false

                })
            },

        }
    }
</script>

<style scoped>


    .start {
        margin-left: 1%
    }
</style>
