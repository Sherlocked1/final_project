<template>
    <div>
        <vs-card class="text-center">
            <vs-icon :icon="icon" size="large"></vs-icon>
            <p>{{title}}</p>
        </vs-card>
    </div>
</template>

<script>
    export default {
        name: "ProjectAggregations",
        props: {
            title: String,
            icon: String
        }
    }
</script>

<style scoped>

</style>
