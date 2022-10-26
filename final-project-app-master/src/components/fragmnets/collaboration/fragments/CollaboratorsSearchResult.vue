<template>
    <div>
        <vs-row>
            <vs-list>
                <vs-list-header title="Result" color="success"></vs-list-header>
                <vs-list-item v-for="(item , index) in this.collaborators" :key="index" :title="item['name']">
                    <template slot="avatar">
                        <vs-avatar :src="item['avatar']"/>
                    </template>
                    <vs-button @click="invite(item['_id'])" color="primary" type="flat" icon="send"></vs-button>

                </vs-list-item>
            </vs-list>
        </vs-row>
    </div>
</template>
////this.collaborators[0]['avatar']
<script>
    export default {
        name: "CollaboratorsSearchResult",
        props: {
            collaborators: Array
        },
        data() {
            return {
                result: [1, 2, 3]
            }
        },
        methods: {
            invite(id) {
                this.$emit('send_invite', id)
            }
        }
    }
</script>

<style scoped>

</style>
