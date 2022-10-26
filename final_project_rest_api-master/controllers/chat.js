const {sendJsonResponse, getUserFromToken} = require("../utils/common_utils");

const jwt = require('jsonwebtoken');

const errors = require('restify-errors');
const Chat = require('../models/chat');

const User = require('../models/User');
const fs = require('fs');


const restify_jwt = require('restify-jwt-community');

var Pusher = require('pusher');

const path = require('path');
const multer = require('multer');
const FileType = require('file-type');

var mime = require('mime-types')



var pusher = new Pusher({
    appId: process.env.PUSER_APP_ID,
    key: process.env.PUSER_KEY,
    secret: process.env.PUSER_SECRET,
    cluster: process.env.PUSER_CLUSTER,
    encrypted: true
});


const storage = multer.diskStorage(
    {
        destination: './public/uploads/chat_files',
        filename: function (req, file, cb) {
            const file_name = "chat_file" + '_' + Date.now() + path.extname(file.originalname);
            // console.log("shit")
            cb(null, file_name);
        }
    }
);
//


const upload = multer({
    storage: storage,
    limits: {fileSize: (1024 * 1024) * 200},
    fileFilter: function (req, file, cp) {
        // checkForType(cp, file);
        cp(null, true);
    }
}).single('chat_file');


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


module.exports.getAllMessagesInProject = (async (req, res, next) => {

    try {
        const messages = await Chat.find({project_id: req.params.project_id});

        let messagesWithInfo = [];


        if (messages.length > 0) {
            for (let index = 0; index < messages.length; index++) {
                const message = messages[index]
                const user = await User.findById(message['from'])

                messagesWithInfo.push(
                    {
                        _id: message['_id'],
                        message: message['message_type']!=="text" ?  `${process.env.BASE_URL}/api/project/chat/messages/`+message['message'] : message['message'],
                        //new update
                        message_type: message['message_type'],

                        createdAt: message['createdAt'],
                        from: {
                            "name": user['name'],
                            "_id": user['_id'],
                            "avatar": user['profile'] ? user['profile']['profile_image_path'] ? `${process.env.BASE_URL}/api/users/profile_image/` + user['profile']['profile_image_path'] : "https://api.adorable.io/avatars/285/user.png" : "https://api.adorable.io/avatars/285/user.png",
                        }

                    }
                )


                if (index === messages.length - 1) {
                    sendJsonResponse(res, messagesWithInfo, 200);
                }

            }

        } else {
            sendJsonResponse(res, [], 200);

        }


    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 400);

    }
});


module.exports.uploadFileToChat = (async (req, res, next) => {
    // console.log(req)


    await getUserFromToken(req, res, async (user, token) => {


        upload(req, res, async (err) => {
            if (err) {
                sendJsonResponse(res, {"message": err}, 200);
            } else {
                await sendMessage(req, res, user, "file");
            }
        });
        // await sendMessage(req, res,user, "file");


    }, (err) => {
        sendJsonResponse(res, {"message": err}, 400);

    })

});


module.exports.addMessageToChatInProject = (async (req, res, next) => {
    await getUserFromToken(req, res, async (user, token) => {


        await sendMessage(req, res, user, "message");
    }, (err) => {
        sendJsonResponse(res, {"message": err}, 400);

    })


});


module.exports.getMessageFile = (req, res) => {
    res.status(200);
    res.sendfile('./public/uploads/chat_files/' + req.params.message_pic);
};


//------------------------||-------------------------------||
module.exports.deleteMessage = (async (req, res, next) => {
    try {
        const {project_id, message_id} = req.params;
        await Chat.findOneAndRemove({_id: message_id})
        pusher.trigger(`project_no_${project_id}`, 'message_deleted', {
            "message_id": message_id
        });
        console.log("Message deleted successfully-------->");

        sendJsonResponse(res, {"message": "Message deleted successfully"}, 400);
    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 400);
    }

});

async function sendMessage(req, res, user, type) {
    try {
        const {message} = req.body;
        const {project_id} = req.params;

        // const fileType =    await FileType.fromStream(fs.createReadStream(req.file.path))
        // console.log(fileType)

        const chat = new Chat({
            "from": user['_id'],
            "message": type === "file" ? req.file.filename.toString() : message,
            "message_type": type === "file" ? mime.lookup(req.file.path).toString()   : "text",
            "project_id": project_id
        });

        const newMessage = await chat.save();
        console.log(newMessage)

        const messageWithInfo = {
            _id: newMessage['_id'],
            message: type==="file" ?   `${process.env.BASE_URL}/api/project/chat/messages/`+newMessage['message'] : newMessage['message'],
            //new update
            message_type: newMessage["message_type"],
            createdAt: newMessage['createdAt'],
            from: {
                "name": user['name'],
                "_id": user['_id'],
                "avatar": user['profile'] ? user['profile']['profile_image_path'] ? `${process.env.BASE_URL}/api/users/profile_image/` + user['profile']['profile_image_path'] : "https://api.adorable.io/avatars/285/user.png" : "https://api.adorable.io/avatars/285/user.png",
            }

        };
        pusher.trigger(`project_no_${project_id}`, 'message_created', {
            "message": messageWithInfo
        });
        console.log("Message sent successfully-------->");
        sendJsonResponse(res, messageWithInfo, 201);
    } catch (e) {
        sendJsonResponse(res, {"message": e.message}, 400);

    }
}


