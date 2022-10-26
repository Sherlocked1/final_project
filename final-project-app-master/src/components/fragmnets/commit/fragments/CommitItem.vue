<template>
    <div>

        <vs-row >
              <vs-card>
                  <vs-list>
                      <vs-list-item :title="commit['author']['name']" subtitle="Author">
                          <template slot="avatar">
                              <vs-avatar size="default"
                                         :src="commit['author']['avatar']"/>

                          </template>
                      </vs-list-item>
                  </vs-list>
                  <vs-alert active="true" color="warning" icon="speaker_notes">
                      {{commit['commit_message']}}
                  </vs-alert>
                  <vs-button @click="open(commit['html_file_url'])" color="primary" type="flat" icon="remove_red_eye">View
                      documentation
                  </vs-button>
                  <vs-button color="warning" type="flat" icon="cloud_download"
                             @click.prevent="downloadItem(commit['pdf_file_url'])">Download documentation
                  </vs-button>
              </vs-card>
        </vs-row>


    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "CommitItem",
        props: {
            commit: Object
        },
        methods: {
            open(url) {
                window.open(url)
            },
            downloadItem(url) {
                axios.get(url, {responseType: 'blob'})
                    .then(response => {
                        const blob = new Blob([response.data], {type: 'application/pdf'})
                        const link = document.createElement('a')
                        link.href = URL.createObjectURL(blob)
                        link.download = 'documentation'
                        link.click()
                        URL.revokeObjectURL(link.href)
                    }).catch(console.error)
            }
        }


    }
</script>

<style scoped>

</style>
