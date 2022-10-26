const  path = require("path")


module.exports = {


    outputDir : path.relative(__dirname , '../final_project_rest_api/public') ,
    devServer:{
        proxy:{
            '/api' : {
                target : 'http://localhost:5000'
            }
        }

    }
}
