var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const ProjectRequestHeadersController = require('../controllers/request_headers');


router.get('/user/:admin_id/project/:project_id/request/:request_id/headers/index', restify_jwt({secret: 'secret'}), ProjectRequestHeadersController.index);
router.get('/user/:admin_id/project/:project_id/request/:request_id/headers/show/:header_id', restify_jwt({secret: 'secret'}), ProjectRequestHeadersController.show);
router.post('/user/:admin_id/project/:project_id/request/:request_id/headers/create', restify_jwt({secret: 'secret'}), ProjectRequestHeadersController.create);
router.put('/user/:admin_id/project/:project_id/request/:request_id/headers/update/:header_id', restify_jwt({secret: 'secret'}), ProjectRequestHeadersController.update);
router.delete('/user/:admin_id/project/:project_id/request/:request_id/headers/delete/:header_id', restify_jwt({secret: 'secret'}), ProjectRequestHeadersController.delete);


module.exports = router;
