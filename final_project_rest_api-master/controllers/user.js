const {sendJsonResponse} = require('../utils/common_utils');

const errors = require('restify-errors');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const restify_jwt = require('restify-jwt-community');
require('dotenv').config()

const jwt = require('jsonwebtoken');
const {authentication} = require('../auth');
const path = require('path');
const multer = require('multer');

var hbs = require('nodemailer-express-handlebars');
var nodemailer = require('nodemailer');
var randtoken = require('rand-token');
let fs = require('fs');

var privateKEY  = fs.readFileSync('./private.key', 'utf8');

const storage = multer.diskStorage(
    {
        destination: './public/uploads/profiles_images',
        filename: function (req, file, cb) {
            const file_name = "profile_images" + '_' + Date.now() + path.extname(file.originalname);
            console.log("shit")
            cb(null, file_name);
        }
    }
);
//


const upload = multer({
    storage: storage,
    limits: {fileSize: (1024 * 1024) * 200 },
    fileFilter: function (req, file, cp) {
        checkForType(cp, file);
    }
}).single('profile_image');

function checkForType(cp, file) {
    console.log("CHECK ")
    const type = /jpeg|png|jpg|gif|/;
    const extname = type.test(path.extname(file.originalname).toLowerCase());
    const mimeType = type.test(file.mimetype);

    if (extname && mimeType) {
        cp(null, true);
    } else {
        cp('Error invalid image', false);
    }
}









module.exports.signIn = async function (req, res, next) {

    const {email, password} = req.body;
    try {

        const user = await authentication(email, password);
        console.log(user)

        // signing process using user object and client secret

        const  userInfo = {
            _id: user._id,
            email: user.email,
            password: user.password,
            name: user.name,

        }

        const user_token = jwt.sign(userInfo, process.env.JWT_SECRET, {expiresIn: '12h'  });
        const {iat, exp} = jwt.decode(user_token);

        sendJsonResponse(res, {
            "status": "success", "access_token": user_token, "user": {
                "user_name": user["name"],
                "_id": user["_id"],
                "email": user["email"]
            }
        }, 200);


    } catch (e) {
        sendJsonResponse(res, {"message": e.toString()}, 401);

    }

};
module.exports.signUp = async (req, res, next) => {
    const {email, password, name, about} = req.body;


    const newUser = new User({
        email,
        password,
        name,
        profile: {
            about: '',
            phone_number: '',
            job: ''
        }
    });
    //password length 10
    bcrypt.genSalt(10, (err, salt) => {
        //hash password
        bcrypt.hash(newUser.password, salt, async (err, hashedPassword) => {
            // replace old password with hashed password
            newUser.password = hashedPassword;
            try {
                // save user with hashed password
                var savedUser = await newUser.save();
                sendJsonResponse(res, {
                    "status": "success", "user": {
                        "user_name": savedUser["name"],
                        "email": savedUser["email"]


                    }
                }, 201);

            } catch (e) {
                return sendJsonResponse(res, {
                    "status": "error",
                    "message": e.message
                }, 400);

            }
        });
    });
}
module.exports.getUser = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        const authorization_header = req.headers.authorization;
        const size = authorization_header.length;

        // substring JWT string from header  with space to get clean token
        const user_token = authorization_header.substr(4, size);


        try {

            // decode user model using jwt verify using client secret and and clean token
            const decoded_user = jwt.verify(user_token, process.env.JWT_SECRET);

            // find user using id from decoded user
            const user = await User.findById(decoded_user._id);
            sendJsonResponse(res, {
                "status": "success",
                "user": {
                    "_id": user["_id"],
                    "user_name": user["name"],
                    "email": user["email"],
                    "profile": user["profile"],
                }
            }, 200);


        } catch (e) {
            sendJsonResponse(res, {"status": "error", "message": e.message}, 400);

        }
    } else {
        sendJsonResponse(res, {"status": "error", 'message': 'Authorization header required'}, 400);
    }
};
module.exports.createProfile = async (req, res, next) => {
    try {
        const {about, phone_number, job} = req.body;

        const authorization_header = req.headers.authorization;
        const size = authorization_header.length;

        // substring JWT string from header  with space to get clean token
        const user_token = authorization_header.substr(4, size);


        // decode user model using jwt verify using client secret and and clean token
        const decoded_user = jwt.verify(user_token, process.env.JWT_SECRET);
        const user = await User.findById({_id: decoded_user._id})


        if (typeof user.profile != 'undefined') {
            user.profile.about = about;
            user.profile.phone_number = phone_number;
            user.profile.job = job;

        } else {
            user.profile = {
                about: about,
                phone_number: phone_number,
                job: job
            };
        }

        const savedUser = await user.save();
        sendJsonResponse(res, {
            "status": "success",
            "profile": savedUser["profile"]
        }, 200);

    } catch (e) {
        sendJsonResponse(res, e, 404);
    }
};

function deleteProfileImageFile(doc_name) {


    const root = __dirname.replace('\\controllers', '');

    let path = `${root}\\public\\uploads\\profiles_images\\${doc_name}`;


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


module.exports.uploadProfileImage = async (req, res, next) => {

    console.log(req.file)

    if (req.headers && req.headers.authorization) {
        const authorization_header = req.headers.authorization;
        const size = authorization_header.length;

        // substring JWT string from header  with space to get clean token
        const user_token = authorization_header.substr(4, size);
        const decoded_user = jwt.verify(user_token, process.env.JWT_SECRET);

//`${process.env.BASE_URL}/api/users/profile_image/` +
        upload(req, res, async (err) => {
                if (err) {
                    sendJsonResponse(res, {"message": err}, 200);
                } else {
                    const user = await User.findById(decoded_user._id);
                    if (typeof user.profile !== 'undefined') {


                        if (user.profile['profile_image_path'] !== null) {
                            //    delete old file and insert new one

                            deleteProfileImageFile(user.profile['profile_image_path']).then(res => {

                                if (res['done']) {

                                    console.log(req.file.filename.toString())
                                    user.profile.profile_image_path = req.file.filename.toString()
                                } else {
                                    user.profile.profile_image_path = req.file.filename.toString()
                                }

                            }).catch(err => {
                                user.profile.profile_image_path = req.file.filename.toString()
                                console.log(err)

                            })

                        } else {
                            user.profile.profile_image_path = req.file.filename.toString()
                        }

                    } else {

                        user.profile = {
                            about: '',
                            profile_image_path: req.file.filename.toString(),
                            phone_number: '',
                            job: ''
                        }


                    }
                    const saved_user = await user.save();
                    sendJsonResponse(res, {"image_path": `${process.env.BASE_URL}/api/users/profile_image/` + saved_user.profile.profile_image_path}, 200);
                }
            }
        );


    } else {
        sendJsonResponse(res, {'message': 'Authorization header required'}, 400);
    }


}
;
module.exports.getProfileImage = (req, res) => {
    res.status(200);
    res.sendfile('./public/uploads/profiles_images/' + req.params.image_name);
};
module.exports.updateUser = async (req, res) => {
    if (req.headers && req.headers.authorization) {

        try {
            const authorization_header = req.headers.authorization;
            const size = authorization_header.length;

            // substring JWT string from header  with space to get clean token
            const user_token = authorization_header.substr(4, size);


            // decode user model using jwt verify using client secret and and clean token
            const decoded_user = jwt.verify(user_token, process.env.JWT_SECRET);


            const oldUserDate = await User.findById({_id: decoded_user._id});
            const user = await User.findOneAndUpdate({_id: decoded_user._id}, {
                name: req.body.name === undefined ? oldUserDate.name : req.body.name,
                email: req.body.email === undefined ? oldUserDate.email : req.body.email,
                profile: {
                    profile_image_path: oldUserDate.profile.profile_image_path,
                    job: req.body.job === undefined ? oldUserDate.profile.job : req.body.job,
                    about: req.body.about === undefined ? oldUserDate.profile.about : req.body.about,
                    phone_number: req.body.phone_number === undefined ? oldUserDate.profile.phone_number : req.body.phone_number
                }
            });

            sendJsonResponse(res, {"status": "success", "message": "updated successfully"}, 200);

        } catch (e) {
            sendJsonResponse(res, {'message': e.message}, 400);

        }
    } else {
        sendJsonResponse(res, {'message': 'Authorization header required'}, 400);
    }
}
module.exports.passwordReset = async (req, res) => {
    const user_email = req.body.email;


    try {
        const user = await User.findOne({email: user_email});
        if (user) {
            if (typeof user.email != "undefined") {
                var token = randtoken.generate(16);

                const updated_user = await User.findOneAndUpdate({email: user_email}, {
                    password_reset_token: token
                });
                sendEmail(user_email, `http://localhost:8080/#/password_change?token=${token}`);
                sendJsonResponse(res, {"message": "check your email to reset your password"}, 200);
            } else {
                sendJsonResponse(res, {"message": 'User with this email not found'}, 400);
            }
        } else {
            sendJsonResponse(res, {"message": 'User with this email not found'}, 400);

        }

    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 400);
    }

}

function sendEmail(email, link) {
    var transport = nodemailer.createTransport({
        service: 'gmail',

        auth: {
            user: "melamin23.me@gmail.com",
            pass: "mohamed1337"
        }
    });
    let mailOptions = {
        from: "melamin23.me@gmail.com", // sender address
        to: email, // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Message: please reset your password using this link <a href="${link}" >mail</a></li>
    </ul>
    <a  href="${link}" style="border-radius: 10px; padding: 1%; color: white; background-color: cornflowerblue; ">Change My Password</a>
  ` // html body
    };
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    });
}

module.exports.passwordChange = async (req, res) => {

    try {
        var user = await User.findOne({password_reset_token: req.params.token})

        if (user) {
            var newPassword = req.body.new_password;
            bcrypt.genSalt(10, (err, salt) => {
                //hash password
                bcrypt.hash(newPassword, salt, async (err, hashedPassword) => {
                    // replace old password with hashed password
                    newPassword = hashedPassword;
                    try {
                        // save user with hashed password
                        var updatedUser = await User.findOneAndUpdate({password_reset_token: req.params.token}, {
                            password: newPassword,
                            password_reset_token: null
                        });
                        sendJsonResponse(res, {"message": "password updated successfully"}, 201);

                    } catch (e) {
                        return sendJsonResponse(res, {"message": "Send your email again"}, 400);

                    }
                });
            });
        } else {
            return sendJsonResponse(res, {"message": "Send your email again"}, 201);
        }
    } catch (e) {
        return sendJsonResponse(res, {"message": e.message}, 201);

    }


}

//search

module.exports.search = async (req, res) => {

    try {
        var users = await User.find({email: new RegExp(req.params['email'], "i")});

        let result = [];

        if (users.length > 0) {
            for (let index = 0; index < users.length; index++) {

                result.push({
                    "_id": users[index]['_id'],
                    "name": users[index]['name'],

                    "avatar": users[index]['profile'] ? users[index]['profile']['profile_image_path'] ? `${process.env.BASE_URL}/api/users/profile_image/` + users[index]['profile']['profile_image_path'] : "https://api.adorable.io/avatars/285/user.png" : "https://api.adorable.io/avatars/285/user.png",
                })


                if (index === users.length - 1) {
                    return sendJsonResponse(res, result, 201);
                }

            }
        } else {
            return sendJsonResponse(res, users, 201);

        }


    } catch (e) {
        return sendJsonResponse(res, {"message": e.message}, 201);

    }


}

module.exports.passwordUpdate = async (req, res) => {
    if (req.headers && req.headers.authorization) {
        const authorization_header = req.headers.authorization;
        const size = authorization_header.length;

        // substring JWT string from header  with space to get clean token
        const user_token = authorization_header.substr(4, size);
        var newPassword = req.body.new_password;
        var oldPassword = req.body.old_password;
        const decoded_user = jwt.verify(user_token, process.env.JWT_SECRET);

        const user = await User.findById({_id: decoded_user._id});


        bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
            if (err) {
                // throw err;
                return sendJsonResponse(res, {"message": err}, 404);

            }
            if (isMatch) {
                bcrypt.genSalt(10, (err, salt) => {
                    //hash password
                    bcrypt.hash(newPassword, salt, async (err, hashedPassword) => {
                        // replace old password with hashed password
                        newPassword = hashedPassword;
                        try {
                            // save user with hashed password
                            var updatedUser = await User.findOneAndUpdate({_id: decoded_user._id}, {
                                password: newPassword,
                            });
                            sendJsonResponse(res, {"message": "Updated Successfully", "status": "success"}, 200);

                        } catch (e) {
                            return sendJsonResponse(res, {"message": "Fail to change password", "status": 400}, 200);

                        }
                    });
                });
                //   save new password
            } else {
                //   your old password wrong
                return sendJsonResponse(res, {"message": "Password is wrong", "status": 400}, 200);

            }
        });


        // decode user model using jwt verify using client secret and and clean token

    } else {
        sendJsonResponse(res, {'message': 'Authorization header required'}, 200);
    }

}


async function deleteFile(path) {
    try {
        await fs.remove(path)
        console.log('success!')
    } catch (err) {
        console.error(err)
    }
}
