var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()
const ChatController = require('../controllers/chat');


router.get('/project/:project_id/chat/messages', restify_jwt({secret: 'secret'}), ChatController.getAllMessagesInProject);


router.post('/project/:project_id/chat/create', restify_jwt({secret: 'secret'}), ChatController.addMessageToChatInProject);


router.post('/project/:project_id/chat/create_file', restify_jwt({secret: 'secret'}), ChatController.uploadFileToChat);


router.delete('/project/:project_id/chat/delete/:message_id', restify_jwt({secret: 'secret'}), ChatController.deleteMessage);

router.get('/project/chat/messages/:message_pic', ChatController.getMessageFile);

module.exports = router;
