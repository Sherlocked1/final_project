<template>
    <div>
        <vs-collapse accordion>
            <vs-collapse-item v-for="(result_item, index) in result" :key="index">
                <div slot="header">
                    {{result_item['title']}}
                    <!--                    <vs-icon v-if="result_item['status']==='passed'" :icon="done" color="success"></vs-icon>-->
                    <!--                    <vs-icon v-else :icon="error" color="danger"></vs-icon>-->

                </div>

                <vs-list>
                    <vs-list-item v-for="(test_case, index) in result_item['test_cases_result']" :key="index"
                                  v-if="test_case['status']==='passed'" color="success"
                                  :title="test_case['test_case']">
                        <vs-icon color="success" icon="check_circle"></vs-icon>
                    </vs-list-item>

                    <vs-list-item v-else color="danger" :title="test_case['test_case']">
                        <vs-icon color="danger" icon="error"></vs-icon>
                    </vs-list-item>

                </vs-list>

            </vs-collapse-item>

        </vs-collapse>
    </div>
</template>

<script>
    export default {
        name: "PassedRequests",
        props: {
            result: Array
        },
        data() {
            return {}
        }
    }
</script>

<style scoped>

</style>
