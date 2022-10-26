const axios = require('axios');


// output  --- > [response  , time , status code]
exports.testRequest = (request) => {

    switch (request['method']) {
        case 'get' :
            return get(request);
        case 'post' :
            return post(request);

        case 'delete' :
            return del (request);
        case 'put' :
            return put(request);
    }
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
function getBodyAsObject(request) {
    let result = null;
    if (request["body"]) {
        if (request["body"].length > 0) {
            result = {};
            for (let index = 0; index < request["body"].length; index++) {
                result [request["body"][index]["key"]] = parseStringBasedOnDataType(request["body"][index]["data_type"], request["body"][index]["value"])
            }

        }
    }

    return result;

}

function generateForFullUrl(request) {
    //if we have a prams
    let url = request["url"];
    if (request["params"]) {
        for (let index = 0; index < request["params"].length; index++) {
            if (index === 0) {
                let paramVal = parseStringBasedOnDataType(request["params"][index]["data_type"], request["params"][index]["value"]);
                url += `?${request["params"][index]["key"]}=${paramVal}`
            } else {
                url += `&${request["params"][index]["key"]}=${request["params"][index]["value"]}`

            }
        }


    }
    return url;
}

function getHeadersAsObject(request) {

    let result = null;

    if (request["headers"]) {
        if (request["headers"].length > 0) {
            result = {
                "headers": {}
            };
            for (let index = 0; index < request["headers"].length; index++) {
                result["headers"] [request["headers"][index]["key"]] = request["headers"][index]["value"]
            }

        }
    }

    return result;

}

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
    // console.log(`axios.get("${request['url']}", ${JSON.stringify(getHeadersAsObject(request))})`)


    return axios.get(request['url'], getHeadersAsObject(request)
    );
}

function getRequestWithParams(request) {
    return axios.get(generateForFullUrl(request));
}

function getRequestWithParamsAndHeaders(request) {
    return axios.get(generateForFullUrl(request), getHeadersAsObject(request));

}

function getWithUrlOnly(request) {
    return axios.get(`${request['url']}`);
}

//delete
function delRequestWithHeaders(request) {
    return axios.delete(`${request['url']}`, getHeadersAsObject(request));
}

function delRequestWithParams(request) {
    return axios.delete(generateForFullUrl(request));
}

function delRequestWithParamsAndHeaders(request) {
    return axios.delete(generateForFullUrl(request), getHeadersAsObject(request));

}

function delWithUrlOnly(request) {
    return axios.delete(`${request['url']}`);
}


//put or post  request stuff
function postWithParamsHeaderBody(request) {
    return axios.post(generateForFullUrl(request), getBodyAsObject(request), {
        "headers": getHeadersAsObject(request)
    });
}

function postWithParamsAndBody(request) {
    return axios.post(generateForFullUrl(request), getBodyAsObject(request));
}

function postWithParamsAndHeaders(request) {
    return axios.post(generateForFullUrl(request), {}, {
        "headers": getHeadersAsObject(request)
    });
}

function postWithHeadersAndBody(request) {
    return axios.post(request['url'], getBodyAsObject(request));


}

function postWithHeaders(request) {
    return axios.post(request['url'], {}, {
        "headers": getHeadersAsObject(request)
    });
}

function postWithParams(request) {
    return axios.post(generateForFullUrl(request), {});
}

function postWithBody(request) {
    return axios.post(request['url'], getBodyAsObject(request));

}

function postWithUrl(request) {
    return axios.post(request['url']);

}

//put stuff
function putWithParamsHeaderBody(request) {
    return axios.put(generateForFullUrl(request), getBodyAsObject(request), {
        "headers": getHeadersAsObject(request)
    });
}

function putWithParamsAndBody(request) {
    return axios.put(generateForFullUrl(request), getBodyAsObject(request));
}

function putWithParamsAndHeaders(request) {
    return axios.put(generateForFullUrl(request), {}, {
        "headers": getHeadersAsObject(request)
    });
}

function putWithHeadersAndBody(request) {
    return axios.put(request['url'], getBodyAsObject(request));


}

function putWithHeaders(request) {
    return axios.put(request['url'], {}, {
        "headers": getHeadersAsObject(request)
    });
}

function putWithParams(request) {
    return axios.put(generateForFullUrl(request), {});
}

function putWithBody(request) {
    return axios.put(request['url'], getBodyAsObject(request));

}

function putWithUrl(request) {
    return axios.put(request['url']);

}


exports.runTestCases = (testCases, actual_statusCode, actual_time) => {
    let result = []
    for (let index = 0; index < testCases.length; index++) {
        switch (testCases[index]['to_be_tested']) {

            case  'time' :
                result.push(compare(testCases[index], actual_time))
                break;

            case 'status':
                result.push(compare(testCases[index], actual_statusCode))
                break;

        }

    }

    return result;
}


function compare(testCase, actual) {

    let expectedVal = parseInt(testCase['expected_value']);
    let testCaseAsString = `${testCase['to_be_tested']} ${testCase['operator']} ${testCase['expected_value']}`;
    switch (testCase['operator']) {
        case  "=":
            if (expectedVal === actual) {
                return {
                    "test_case": testCaseAsString,
                    "status": "passed"
                }
            } else {
                return {
                    "test_case": testCaseAsString,
                    "status": "failed",
                    "message": `expected is ${expectedVal} but found ${actual}`
                }
            }
        case  ">":
            if (actual > expectedVal) {
                return {
                    "test_case": testCaseAsString,
                    "status": "passed"
                }
            } else {
                return {
                    "test_case": testCaseAsString,
                    "status": "failed",
                    "message": `expected is ${expectedVal} but found ${actual}`
                }
            }
        case  "<":
            if (actual < expectedVal) {
                return {
                    "test_case": testCaseAsString,
                    "status": "passed"
                }
            } else {
                return {
                    "test_case": testCaseAsString,
                    "status": "failed",
                    "message": `expected is ${expectedVal} but found ${actual}`
                }
            }
        case  ">=":
            if (actual >= expectedVal) {
                return {
                    "test_case": testCaseAsString,
                    "status": "passed"
                }
            } else {
                return {
                    "test_case": testCaseAsString,
                    "status": "failed",
                    "message": `expected is ${expectedVal} but found ${actual}`
                }
            }
        case  "<=":
            if (actual <= expectedVal) {
                return {
                    "test_case": testCaseAsString,
                    "status": "passed"
                }
            } else {
                return {
                    "test_case": testCaseAsString,
                    "status": "failed",
                    "message": `expected is ${expectedVal} but found ${actual}`
                }
            }
    }

}

