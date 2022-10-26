var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const ProjectLogController = require('../controllers/project_log');


router.get('/user/:admin_id/project/:project_id/log/index', restify_jwt({secret: 'secret'}), ProjectLogController.index);
router.post('/user/:admin_id/project/:project_id/log/create', restify_jwt({secret: 'secret'}), ProjectLogController.create);

module.exports = router;
