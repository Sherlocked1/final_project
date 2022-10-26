let fs = require('fs');

var pdf = require('html-pdf');


exports.deleteFile = (doc_name) => {


    const root = __dirname.replace('\\utils', '');

    let path = `${root}\\public\\uploads\\project_related_files\\${doc_name}`;


    return new Promise(async (resolve, reject) => {
        try {

            if (fs.existsSync(path)) {
                fs.unlinkSync(path);

                resolve({"done": true});
            } else {
                resolve({"done": false, "message": "file not found"});

            }
        } catch (e) {
            reject({"done": false, "message": e.message});

        }
    });


}


exports.generateFiles = (project) => {

    const project_data = project;


    let project_doc = "";
    let project_doc_pdf = "";

    const doc_header = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Blog App</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.0/themes/prism.min.css"
    />
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
            integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n"
            crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
            integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
            crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
            integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
            crossorigin="anonymous"></script>

    <link href="monokai.css" rel="stylesheet" type="text/css">
    <script src="rainbow-custom.min.js"></script>
    <script src="https://use.fontawesome.com/releases/v5.14.0/js/all.js" data-auto-replace-svg="nest"></script>


</head>

</head>

<style>
    body {
        position: relative;
    }

    ul.nav-pills {
        top: 20px;
        position: fixed;
    }


</style>

<body data-spy="scroll" data-target="#myScrollspy" data-offset="1" style="background-color: ghostwhite">


<div class="container-fluid">

    `;

    project_doc += doc_header;
    project_doc_pdf += doc_header;
    const doc_footer = "</div><script src=\"https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.0/prism.min.js\"></script></body>\n" +
        "</html>";


    //-------------------------------------------------------------------------------------- Aside nav start

    let asideNav = `  <nav id="myScrollspy">
                <ul class="nav nav-pills flex-column ">`;

    // add sections
    let sections = '';

    for (let listIndex = 0; listIndex < project_data["requests"].length; listIndex++) {
        let list = project_data["requests"][listIndex];

        if (listIndex === 0) {
            asideNav += `      <li class="nav-item">
                        <a class="nav-link active" href="#sec${listIndex}"><i style="margin: 5px"
                                                                   class="fas fa-satellite-dish"></i>${list["title"]}</a>
                    </li>`

        } else {
            asideNav += `      <li class="nav-item">
                        <a class="nav-link " href="#sec${listIndex}"><i style="margin: 5px"
                                                                   class="fas fa-satellite-dish"></i>${list["title"]}</a>
                    </li>`
        }


        //-------------------------------------------------------------------------------------- Aside nav end


        //******************************************************************************************* Requests start


        sections += `   <div id="sec${listIndex}">
                <div class="row">
                    <div class="col-md-6">
                        <div style="background-color: white;  margin: 5%; padding: 3%; border-radius: 10px">
                            <div class="row">
                                <p class="text text-warning  " style="margin: 2%">${list["method"].toUpperCase()}</p><br>
                                <p style="margin: 2%">${list["title"]}</p>
                            </div>


                            <p class="alert alert-secondary"><i style="color: deepskyblue; margin: 5px"
                                                                class="fas fa-link"></i>
                               ${list["url"]}</p>

                            <p style="margin-left: 2%; color: gray">${list["description"]}</p> `


        if (list["body"]) {
            if (list["body"].length > 0) {
                sections += `<h6><i style="color: green; margin: 5px" class="fas fa-server"></i>Request Body</h6>`;
                sections += generateTable(list["body"]);
            }
        }
        if (list["headers"]) {
            if (list["headers"].length > 0) {
                sections += `<h6><i style="color: green; margin: 5px" class="fas fa-server"></i>Request Headers</h6>`;
                sections += generateTable(list["headers"]);
            }
        }

        if (list["params"]) {
            if (list["params"].length > 0) {
                sections += `<h6><i style="color: green; margin: 5px" class="fas fa-server"></i>Request Params</h6>`;
                sections += generateTable(list["params"]);
            }
        }


        //close first
        sections += `    
                           
                        </div>
                    </div>`


        // code stuff
        sections += `


                    <!--                    -->

                    <div class="col-md-6 ">
                        <div style="background-color: white;  margin: 5%; padding: 3%; border-radius: 10px">
                            <h6><i style="color: dodgerblue ; margin: 5px" class="fas fa-reply-all"></i>Response Body
                            </h6>
                            <pre style=" max-height: 500px; overflow-y: scroll">
                               <code data-language="javascript">
                               ${isJson(list["response"]) ? JSON.stringify(JSON.parse(list["response"])) : list["response"]}
</code>   </pre>
                            <h6><i style="color: orange; margin: 5px" class="fab fa-js"></i>Template For javascript</h6>
                            <pre><code data-language="javascript">${getCodeFromUrlInfo(list)}</code></pre>

                        </div>


                    </div>

                </div>


            </div>
            <hr>`


        //
        // sections += `<h3 >Response</h3><br>`;
        // // console.log(list["response"])
        //
        // if (isJson(list["response"])) {
        //     sections += `<pre class="mb-5"><code class=\"language-javascript\">${JSON.stringify(JSON.parse(list["response"]))}</code></pre>`;
        //
        // } else {
        //     // if (list["response"])
        //     sections += `<pre class="mb-5"><code class=\"language-javascript\">${list["response"]}</code></pre>`;
        //     // else
        //     //     sections += `<pre class="mb-5"><code class=\"language-javascript\">${{}}</code></pre>`;
        //
        // }
        // sections += `<h3 >Template to use endpoint in javascript</h3><br>`;
        // sections += `<pre class="mb-5"><code class=\"language-javascript\">${getCodeFromUrlInfo(list)}</code></pre>`;
        //
        //
        // sections += "</div>"


    }
    asideNav += "              </ul>\n" +
        "            </nav>";

    let row_web = `
    <div class="row">
   
      <div class="col-md-2">${asideNav}</div>

  
    <div class="col-md-10">${sections}</div>
    
    
    
</div>
    
    `;

    let row_pdf = `
    <div class="row">
   
  
    <div class="col-md-10">${sections}</div>
    
    
    
</div>
    
    `;

    //add section  to doc
    // add nav to doc

    project_doc += row_web;
    project_doc += doc_footer;

    project_doc_pdf += row_pdf;
    project_doc_pdf += doc_footer;


    let htmlDocName = project_data["p_name"].replace(" ", "_") + new Date().getTime().toString() + ".html";
    let pdfDocName = project_data["p_name"].replace(" ", "_") + new Date().getTime().toString() + ".pdf";
    let backBone = `${process.env.BASE_URL}/api/project/show_doc/`;


    return new Promise(async (resolve, reject) => {
        try {
            generateFiles(htmlDocName, pdfDocName, project_doc, project_doc_pdf, function (done) {
                if (done) {


                    resolve({
                        "status": "success",
                        "url_to_html_doc": backBone + htmlDocName,
                        "url_to_pdf_doc": backBone + pdfDocName,
                        "html_file_name": htmlDocName,
                        "pdf_file_name": pdfDocName,
                    });


                }
            })
        } catch (e) {
            reject({"err": e.message});
        }
    });


    // console.log(data);


}


function generateFiles(htmlDocName, pdfDocName, htmlData, pdfData, ondone) {
    let root = __dirname.replace('\\utils', '');
    fs.writeFile("public/uploads/project_related_files/" + htmlDocName, htmlData, function (err) {
        if (err) throw err;
        // read file again

        fs.writeFile("public/uploads/project_related_files/" + "temp_" + htmlDocName, pdfData, function (err) {
            if (err) throw err;
            //read temp pdf file
            let html_doc = fs.readFileSync(`public/uploads/project_related_files/temp_${htmlDocName}`, 'utf8');
            let options = {
                format: 'Letter', "height": "18.5in",        // allowed units: mm, cm, in, px
                "width": "16in",
            };
            //create pdf from temp file
            pdf.create(html_doc, options).toFile('public/uploads/project_related_files/' + pdfDocName, function (err, response) {
                if (err) return console.log(err);
                //make sure delete temp file

                //temp pdf file
                let path = `public/uploads/project_related_files/temp_${htmlDocName}`;


                if (fs.existsSync(path)) {
                    fs.unlinkSync(path);

                    //send done
                    ondone(true);
                } else {
                    //send done
                    ondone(false);

                }


            });
        });


    });

}

function generateTable(list) {
    let table_header = "<div class='table-responsive'><table class=\"table table-dark\" style='display: table'>\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th scope=\"col\">key</th>\n" +
        "      <th scope=\"col\">value</th>\n" +
        "      <th scope=\"col\">type</th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>\n";


    for (let index = 0; index < list.length; index++) {
        let row = list[index];


        table_header += " <tr>\n" +
            `    <td>${row["key"]}</td>\n` +
            `    <td>${row["value"]}</td>\n` +
            `    <td>${typeof row["value"]}</td>\n` +

            "    </tr>";


    }

    let table_footer = "  </tbody>\n" +
        "</table></div>"
    table_header += table_footer;

    return table_header;
}

function generateForFullUrl(urlInfo) {
    //if we have a prams
    let url = urlInfo["url"];
    if (urlInfo["params"]) {
        for (let index = 0; index < urlInfo["params"].length; index++) {
            if (index === 0) {
                url += `?${urlInfo["params"][index]["key"]}=${urlInfo["params"][index]["value"]}`
            } else {
                url += `&${urlInfo["params"][index]["key"]}=${urlInfo["params"][index]["value"]}`

            }
        }


    }
    return url;
}

function getHeadersAsObject(urlInfo) {

    let result = null;

    if (urlInfo["headers"]) {
        if (urlInfo["headers"].length > 0) {
            result = {
                "headers": {}
            };
            for (let index = 0; index < urlInfo["headers"].length; index++) {
                result["headers"] [urlInfo["headers"][index]["key"]] = urlInfo["headers"][index]["value"]
            }

        }
    }

    return result;

}

function getBodyAsObject(urlInfo) {
    let result = null;
    if (urlInfo["body"]) {
        if (urlInfo["body"].length > 0) {
            result = {};
            for (let index = 0; index < urlInfo["body"].length; index++) {
                result [urlInfo["body"][index]["key"]] = urlInfo["body"][index]["value"]
            }
        }
    }
    return result;
}


function getCodeFromUrlInfo(request) {


    switch (request["method"]) {
        case  "get" :
            return get(request);
        case  "post" :
            return post(request);
        case  "put" :
            return put(request);
        case  "delete" :
            return del(request);
    }

}


function getResponseAsTree(data) {

    return data.reduce(function (r, a) {
        function getParent(s, b) {
            return b.id === a.parentId ? b : (b.nodes && b.nodes.reduce(getParent, s));
        }

        var index = 0, node;
        if ('parentId' in a) {
            node = r.reduce(getParent, {});
        }
        if (node && Object.keys(node).length) {
            node.nodes = node.nodes || [];
            node.nodes.push(a);
        } else {
            while (index < r.length) {
                if (r[index].parentId === a.id) {
                    a.nodes = (a.nodes || []).concat(r.splice(index, 1));
                } else {
                    index++;
                }
            }
            r.push(a);
        }
        return r;
    }, []);

}


//&url params & headers
function get(request) {
//    if we have params and headers
    if (request['params'].length > 0 && request['headers'].length > 0) {
        // send using url and headers and params
        // console.log(getRequestWithParamsAndHeaders(request).toString())
        return getRequestWithParamsAndHeaders(request)
    } else {
        //if we have params or headers
        if (request['params'].length > 0 || request['headers'].length > 0) {
            if (request['params'].length > 0) {
                console.log(getRequestWithParams(request).toString())
                return getRequestWithParams(request)
                // send using url and params only
            } else if (request['headers'].length > 0) {
                console.log("headers only")
                return getRequestWithHeaders(request)

            } // send using url and headers only
        } else {
            console.log("basic one")
            return getWithUrlOnly(request)
            //    just with url only
        }

    }
}

function del(request) {
    if (request['params'].length > 0 && request['headers'].length > 0) {
        // send using url and headers and params
        return delRequestWithParamsAndHeaders(request)
    } else {
        //if we have params or headers
        if (request['params'].length > 0 || request['headers'].length > 0) {
            if (request['params'].length > 0) {
                return delRequestWithParams(request)
                // send using url and params only
            } else if (request['headers']) {
                return delRequestWithHeaders(request)

            } // send using url and headers only
        } else {
            return delWithUrlOnly(request)
            //    just with url only
        }

    }
}


//params & body & headers
function post(request) {
    //all required
    if (request['params'].length > 0 && request['headers'].length > 0 && request['body'].length > 0) {
        return postWithParamsHeaderBody(request)
        // send using url and headers and params and body
    } else {
        //tow are filled
        if (request['params'].length > 0 && request['headers'].length > 0) {
            return postWithParamsAndHeaders(request)

        } else if (request['params'].length > 0 && request['body'].length > 0) {
            return postWithParamsAndBody(request)


        } else if (request['headers'].length > 0 && request['body'].length > 0) {
            return postWithHeadersAndBody(request)

        } else {
            // one are filled
            if (request['params'].length > 0) {
                return postWithParams(request)
                // send using url and params only
            } else if (request['headers'].length > 0) {
                return postWithHeaders(request)
                // send using url and headers only

            } else if (request['body'].length > 0) {
                return postWithBody(request)
                // send using url and headers only

            } else {
                return postWithUrl(request)
                //    send it using url only
            }
        }


    }
}

//params & body & headers
function put(request) {
    //all required
    if (request['params'].length > 0 && request['headers'].length > 0 && request['body'].length > 0) {
        return putWithParamsHeaderBody(request)
        // send using url and headers and params and body
    } else {
        //tow are filled
        if (request['params'].length > 0 && request['headers'].length > 0) {
            return putWithParamsAndHeaders(request)

        } else if (request['params'].length > 0 && request['body'].length > 0) {
            return putWithParamsAndBody(request)


        } else if (request['headers'].length > 0 && request['body'].length > 0) {
            return putWithHeadersAndBody(request)

        } else {
            // one are filled
            if (request['params'].length > 0) {
                return putWithParams(request)
                // send using url and params only
            } else if (request['headers'].length > 0) {
                return postWithHeaders(request)
                // send using url and headers only

            } else if (request['body'].length > 0) {
                return putWithBody(request)
                // send using url and headers only

            } else {
                return putWithUrl(request)
                //    send it using url only
            }
        }


    }
}

//params  & headers


//generateRequestRelevant


//parseStringBasedOnDataType
function parseStringBasedOnDataType(type, value) {
    switch (type) {
        case  "Int" :
            return parseInt(value);
        case "float" :
            return parseFloat(value);
        case  "string":
            return value;
    }
}


//get request stuff
function getRequestWithHeaders(request) {
    // console.log(`axios.get(""${request['url']}"", ${JSON.stringify(getHeadersAsObject(request))})`)


    return `axios.get("${request['url']}",
     ${JSON.stringify(getHeadersAsObject(request))}
     ).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;

}

function getRequestWithParams(request) {

    return `axios.get("${generateForFullUrl(request)}").then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;

}

function getRequestWithParamsAndHeaders(request) {

    return `axios.get("${generateForFullUrl(request)}", 
    ${JSON.stringify(getHeadersAsObject(request))}
    ).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;


}

function getWithUrlOnly(request) {

    return `axios.get("${request['url']}").then(response=>{}).catch(err=>{})`;

}

//delete
function delRequestWithHeaders(request) {
    return `axios.delete("${request['url']}",
     ${JSON.stringify(getHeadersAsObject(request))}
     ).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;
}

function delRequestWithParams(request) {
    return `axios.delete("${generateForFullUrl(request)}").then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;
}

function delRequestWithParamsAndHeaders(request) {
    return `axios.delete("${generateForFullUrl(request)}", 
    ${JSON.stringify(getHeadersAsObject(request))}).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;

}

function delWithUrlOnly(request) {
    return `axios.delete("${request['url']}").then(response=>{}).catch(err=>{})`;
}


//put or post  request stuff
function postWithParamsHeaderBody(request) {
    return `axios.post("${generateForFullUrl(request)}",
      ${getBodyAsObject(request)}, {
        "headers": ${JSON.stringify(getBodyAsObject(request))}
    }).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;
}

function postWithParamsAndBody(request) {
    return `axios.post("${generateForFullUrl(request)}",
     ${JSON.stringify(getBodyAsObject(request))}).
     then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;
}

function postWithParamsAndHeaders(request) {
    return `axios.post("${generateForFullUrl(request)}",
     {}, {
        "headers":${JSON.stringify(getBodyAsObject(request))}
    }).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;
}

function postWithHeadersAndBody(request) {
    return `axios.post("${request['url']}",
     ${JSON.stringify(getBodyAsObject(request))}
     ).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;


}

function postWithHeaders(request) {
    return `axios.post("${request['url']}",
     {}, {
        "headers": ${JSON.stringify(getHeadersAsObject(request))}
    }).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;
}

function postWithParams(request) {
    return `axios.post("${generateForFullUrl(request)}",
     {}).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;
}

function postWithBody(request) {
    return `axios.post("${request['url']}", 
    ${JSON.stringify(getBodyAsObject(request))}).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;

}

function postWithUrl(request) {
    return `axios.post("${request['url']}").then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;

}

//put stuff
function putWithParamsHeaderBody(request) {
    return `axios.put("${generateForFullUrl(request)}", 
    ${JSON.stringify(getBodyAsObject(request))}, {
        "headers": ${JSON.stringify(getHeadersAsObject(request))}
    }).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;
}

function putWithParamsAndBody(request) {
    return `axios.put("${generateForFullUrl(request)}",
     ${JSON.stringify(getBodyAsObject(request))}).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;
}

function putWithParamsAndHeaders(request) {
    return `axios.put("${generateForFullUrl(request)}", {}, {
        "headers": ${JSON.stringify(getHeadersAsObject(request))}
    }).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;
}

function putWithHeadersAndBody(request) {
    return `axios.put("${request['url']}",
    ${JSON.stringify(getBodyAsObject(request))}).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;


}

function putWithHeaders(request) {
    return `axios.put("${request['url']}", {}, {
        "headers": ${JSON.stringify(getHeadersAsObject(request))}
    }).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;
}

function putWithParams(request) {
    return `axios.put("${generateForFullUrl(request)}", {}).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;
}


function putWithBody(request) {
    return `axios.put("${request['url']}",
     ${JSON.stringify(getBodyAsObject(request))}).then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;

}


function putWithUrl(request) {
    return `axios.put("${request['url']}").then(response=>{
                   console.log(Json.parse(response))
                 }).catch(err=>{
                 console.log(err)
                 
                 });`;

}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
