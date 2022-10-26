<template>
    <div>
        <vs-card>
            <vs-list>
                <vs-list-header title="Tester/Developer" color="primary" icon="build"></vs-list-header>
                <vs-list-item :subtitle="user['email']" :title="user['name']"
                              v-for="(user ,index) in this.collaborators['back_end_developers']"
                              v-bind:key="index">
                    <template slot="avatar">
                        <vs-avatar :src="user['avatar']"/>
                    </template>
                    <vs-button v-if="manage" @click="remove(user['working_project_id'])" color="danger" type="flat"
                               icon="close"></vs-button>
                </vs-list-item>

                <vs-list-header title="Front End Developer" icon="laptop_mac" color="primary"></vs-list-header>
                <vs-list-item v-for="(user ,index) in this.collaborators['front_end_developers']" v-bind:key="index"
                              :subtitle="user['email']" :title="user['name']">
                    <template slot="avatar">
                        <vs-avatar :src="user['avatar']"/>
                    </template>
                    <vs-button @click="remove(user['working_project_id'])" v-if="manage" color="danger" type="flat"
                               icon="close"></vs-button>
                </vs-list-item>
            </vs-list>
        </vs-card>
    </div>
</template>

<script>
    export default {
        name: "ProjectStakeHolders",
        props: {
            collaborators: Object,
            manage: Boolean
        },
        methods: {
            remove(_id) {
                this.$emit('remove_collaborator', _id)
            }
        }
    }
</script>

<style scoped>

</style>
