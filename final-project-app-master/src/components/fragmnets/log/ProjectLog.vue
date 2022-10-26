<template>
    <div class="m-5">

        <vue-horizontal-timeline v-if="items.length>0" :items="items"/>
    </div>

</template>

<script>
    import {LogService} from "../../../services/log_service";
    import TimeAgo from 'javascript-time-ago'
    import en from 'javascript-time-ago/locale/en'

    TimeAgo.addDefaultLocale(en)

    // Create formatter (English).
    const timeAgo = new TimeAgo('en-US')

    export default {
        name: "ProjectLog",
        data() {
            return {
                items: []
            }
        },
        created() {
            this.getAllLog();
        },
        methods: {
            getAllLog() {
                this.$vs.loading();

                LogService.allLog(this.$route.query['admin_id'], this.$route.params['p_id'])
                    .then(response => {
                        console.log(response)
                        this.$vs.loading.close();

                        for (let index = 0; index < response.length; index++) {
                            this.items.push(
                                {
                                    title: timeAgo.format( new Date(response[index]['createdAt'])),
                                    content: response[index]['event_message']

                                }
                            )

                        }
                    }).catch(err => {
                    console.log(err)
                    this.$vs.loading.close();
                })
            }
        }
    }
</script>

<style scoped>

</style>
