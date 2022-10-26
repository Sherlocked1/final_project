<template>
    <div>
        <vs-row vs-type="flex">
            <vs-card>
                <vs-list>
                    <vs-list-item :title="version['author']['name']" subtitle="Author">
                        <template slot="avatar">
                            <vs-avatar size="default"
                                       :src="version['author']['avatar']"/>

                        </template>
                        <vs-alert active="true" color="danger">
                            {{version['version_code']}}
                        </vs-alert>
                    </vs-list-item>
                </vs-list>
                <vs-alert active="true" color="primary" icon="speaker_notes">
                    {{version['release_note']}}
                </vs-alert>
                <vs-button @click="open(version['html_file_url'])" color="primary" type="flat" icon="remove_red_eye">
                    View
                    documentation
                </vs-button>
                <vs-button @click.prevent="downloadItem(version['pdf_file_url'] , version['version_code'])"
                           color="warning" type="flat"
                           icon="cloud_download">Download documentation
                </vs-button>
            </vs-card>
        </vs-row>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "VersionItem",
        props: {
            version: Object
        },
        methods: {
            open(url) {
                window.open(url)
            },
            downloadItem(url, version) {
                axios.get(url, {responseType: 'blob'})
                    .then(response => {
                        const blob = new Blob([response.data], {type: 'application/pdf'})
                        const link = document.createElement('a')
                        link.href = URL.createObjectURL(blob)
                        link.download = `documentation_version_${version}.pdf`
                        link.click()
                        URL.revokeObjectURL(link.href)
                    }).catch(console.error)
            }
        }
    }
</script>

<style scoped>

</style>
