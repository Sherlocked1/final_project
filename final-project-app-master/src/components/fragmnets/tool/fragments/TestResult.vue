<template>
    <div>
        <vs-list>
            <vs-list-header title="Result"></vs-list-header>
            <vs-list-item v-for="(result  , index) in results" :title="result['test_case']" :subtitle="result['status']"
                          :key="index">
                <vs-icon v-if="result['status']==='passed'" icon="done" color="success"></vs-icon>
                <vs-icon v-else icon="error" color="danger"></vs-icon>

            </vs-list-item>

            <!--            <vs-list-item title="time = 10 ms" subtitle="Not passed">-->
            <!--            </vs-list-item>-->

        </vs-list>


    </div>
</template>

<script>
    export default {
        props: {
            results: Array
        },
        name: "TestResult",

    }
</script>

<style scoped>

</style>
