require('dotenv').config()
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.sendJsonResponse = (res, data, status) => {
    res.status(status);
    res.send(data);
}

exports.getUserFromToken = async (req, res, onSuccess, onErr) => {
    if (req.headers && req.headers.authorization) {
        const authorization_header = req.headers.authorization;
        const size = authorization_header.length;
        const user_token = authorization_header.substr(4, size);
        const decoded_user = jwt.verify(user_token, process.env.JWT_SECRET);

        try {
            const user = await User.findById({_id: decoded_user._id});
            onSuccess(user, authorization_header);
        } catch (e) {
            onErr({"message": e.message});
        }
        // substring JWT string from header  with space to get clean token
    } else {
        onErr({"message": "Authorization header is required"});
    }

}

exports.getType = (value) => {
    return isNumeric(value) ? "Int" : isFloat(value) ? "float" : "string"

}


exports.groupListByMonth = (list) => {
    let months_count = 12;
    let commits_by_months = {};
    for (let index = 0; index < list.length; index++) {
        let month = ((new Date(list[index]['createdAt']).getMonth()) + 1).toString();
        // not found in the result create new one
        if (typeof commits_by_months[month] === "undefined") {
            console.log("new one")
            commits_by_months[month] = {
                "month": month,
                "count": 1
            };
        } else {
            //    else check if current month in list == to month in result
            //    then update count by one
            console.log("already found ")
            if (commits_by_months[month]['month'] === month) {
                let newCount = commits_by_months[month]['count'] + 1;
                commits_by_months[month] = {
                    'month': month,
                    'count': newCount
                }
            }
        }
        if (index === list.length - 1) {
            let finalResult = [];
            for (let month = 1; month <= months_count; month++) {

                if (!(typeof commits_by_months[month.toString()] === 'undefined')) {
                    finalResult.push(commits_by_months[month.toString()])
                } else {
                    finalResult.push(
                        {
                            'month': month.toString(),
                            'count': 0
                        }
                    )
                }

                if (month === months_count) {
                    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                    ];


                    return {
                        "counts": finalResult.map(function (result) {
                            return result['count'];
                        }),
                        "months": finalResult.map(function (result) {
                            return monthNames [parseInt(result['month']) - 1];
                        })

                    };
                }

            }


        }

    }

}

//file_Extension
// exports.getFileType = (file_extension)=>{
//     switch (file_extension) {
//         case "jpg"
//
//     }
//
// }


function isNumeric(value) {
    return /^\d+$/.test(value);
}

function isFloat(value) {
    return value.match(/^[+-]?(?:\d*\.)?\d+$/)
}


