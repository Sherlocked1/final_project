<template>
    <div style="margin: 5%">
        <vs-row class="mt-5" >
            <vs-col vs-type="flex" vs-justify="center" vs-align="center">
                <img :src="getImgUrl(image_name)" :width="w" :height="h">
            </vs-col>
        </vs-row>

        <vs-row class="mt-5" vs-justify="center">
            <vs-col vs-xs="12"  vs-type="flex" vs-justify="center"  vs-align="center">
                <h5 style="color: gray">{{message}}</h5>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    export default {
        name: "AppHint",
        data (){
            return{

            }
        },
        methods:{
            getImgUrl(pic) {
                return require("@/assets/"+pic)
            }
        },
        props: {
            image_name: String,
            message: String,
            w : Number,
            H : Number
        },
    }
</script>

<style scoped>

</style>
