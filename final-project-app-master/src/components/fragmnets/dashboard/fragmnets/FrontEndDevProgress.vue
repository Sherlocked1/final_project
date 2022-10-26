<template>
    <div>
        <vs-card>
            <vs-row>
                <vs-col  vs-w="4" vs-xs="12">
                    <CircleCounter size="100" :dash-count="100" :active-count="this.progress" :stroke-width="5"
                                   :active-width="10" active-stroke="dodgerblue" :dash-spacing="0" :rotate="-90"
                                   :reverse="false" text="90%"></CircleCounter>

                </vs-col>

                <vs-col  vs-xs="12" vs-w="8"  vs-type="flex" vs-justify="center" vs-align="center">

                    <vs-alert style="height: 80%" active="true" color="rgb(111, 38, 224)" icon="emoji_objects">
                        <p style="font-size: 10px; font-weight: bold"> Progress of api connection with client by front
                            end developer</p>
                    </vs-alert>


                </vs-col>
            </vs-row>


        </vs-card>
    </div>
</template>

<script>
    import CircleCounter from "./CircleCounter";

    export default {
        name: "FrontEndDevProgress",
        props: {
            progress: Number
        },
        components: {CircleCounter},
    }
</script>

<style scoped>

</style>
