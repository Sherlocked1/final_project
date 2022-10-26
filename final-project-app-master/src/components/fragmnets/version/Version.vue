<template>
    <div v-if="!is_loading_versions">


        <timeline v-if="versions.length>0">
            <div v-for="(version , index)  in versions " :key="index">
                <vs-row vs-type="flex">
                    <vs-col  vs-xs="1" vs-sm="1" />
                    <vs-col vs-w="6" vs-xs="11" vs-sm="11" >
                <timeline-title>
                    <timeago :datetime="version['createdAt']" :auto-update="60"></timeago>

                </timeline-title>

                <timeline-item  bg-color="#9dd8e0">
                    <VersionItem :version="version"></VersionItem>
                </timeline-item>
                    </vs-col>
                </vs-row>

            </div>
        </timeline>
        <div v-else>
            <AppHint message="No versions found yet"
                     image_name="undraw_google_docs_jf93.svg" w="400" h="400"/>
        </div>

    </div>


</template>

<script>
    import {Timeline, TimelineItem, TimelineTitle} from 'vue-cute-timeline'
    import VersionItem from "./fragments/VersionItem";
    import {VersionService} from "../../../services/version_service";
    import AppHint from "../../partials/AppHint";

    export default {
        name: "Version",
        data() {
            return {
                versions: [],
                is_loading_versions: true
            }
        },
        created() {
            this.getAllVersions();
        },
        methods: {
            getAllVersions() {
                this.$vs.loading();

                VersionService.allVersion(this.$route.query['admin_id'], this.$route.params['p_id'])
                    .then(response => {
                        console.log(response)
                        this.$vs.loading.close();

                        this.versions = response
                        this.is_loading_versions = false;

                    }).catch(err => {
                    console.log(err)
                    this.is_loading_versions = false;
                    this.$vs.loading.close();
                })
            }
        },
        components: {
            AppHint,
            VersionItem,
            Timeline,
            TimelineItem,
            TimelineTitle
        }
    }
</script>

<style scoped>

</style>
