<template>
    <p></p>
</template>

<script>
    export default {
        name: "Home",
        created() {
            this.$vs.loading(
                { type:'corners',}
            )
            setTimeout(() => {
                this.$vs.loading.close()
                this.$router.push('/my_projects')
            }, 2000);



        }
    }
</script>

<style scoped>

</style>
