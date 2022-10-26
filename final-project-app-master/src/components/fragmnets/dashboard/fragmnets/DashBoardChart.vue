

<script>
    import { Line  } from 'vue-chartjs'

    export default {
        name: "DashBoardChart",
        props: {
            dates: Array,
            count: Array,
            title : String,
            width: {
                default: 100,
                type: Number
            },
            height: {
                default: 100,
                type: Number
            },

        },
        data (){
            return {
                chart_dates : this.dates,
                chart_temps : this.count
            }
        },
        extends: Line ,
        mounted () {

            // Overwriting base render method with actual data.
            this.renderChart({


                labels: this.chart_dates,

                datasets: [
                    {
                        label: this.title,
                        backgroundColor: '#f87979',
                        data: this.chart_temps
                    }
                ]
            })
        }
    }
</script>

<style scoped>

</style>
