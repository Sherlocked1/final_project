<template>
    <div>
<!--        <vs-card style="height: 500px; max-height: 500px;  overflow-y: auto;  overflow-x: hidden;">-->
                    <vs-list>
                        <vs-list-header title="Chat users" color="primary" icon="textsms"></vs-list-header>
                        <vs-list-item title="Steve Jobes">
                            <template slot="avatar">
                                <vs-avatar src="https://i.pravatar.cc/150?u=1"/>
                            </template>
                            <vs-icon icon="fiber_manual_record" color="success" size="small"></vs-icon>
                        </vs-list-item>
                        <vs-list-item title="Steve Jobes">
                            <template slot="avatar">
                                <vs-avatar src="https://i.pravatar.cc/150?u=1"/>
                            </template>
                            <vs-icon icon="fiber_manual_record" color="dark" size="small"></vs-icon>
                        </vs-list-item>

                        <vs-list-item title="Steve Jobes">
                            <template slot="avatar">
                                <vs-avatar src="https://i.pravatar.cc/150?u=1"/>
                            </template>
                            <vs-icon icon="fiber_manual_record" color="success" size="small"></vs-icon>
                        </vs-list-item>
                        <vs-list-item title="Steve Jobes">
                            <template slot="avatar">
                                <vs-avatar src="https://i.pravatar.cc/150?u=1"/>
                            </template>
                            <vs-icon icon="fiber_manual_record" color="dark" size="small"></vs-icon>
                        </vs-list-item>
                    </vs-list>
<!--                </vs-card>-->
    </div>
</template>
<script>
    export default {
        name: "ChatCollaborator",
        data() {
            return {
            }
        }
    }
</script>

<style scoped>

</style>
