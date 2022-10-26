var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const ProjectRequestController = require('../controllers/project_requests');

//user_id

//admin_id project_id
router.get('/user/:admin_id/project/:project_id/request', restify_jwt({secret: 'secret'}), ProjectRequestController.index);

router.get('/user/:admin_id/project/:project_id/request/show/:request_id', restify_jwt({secret: 'secret'}), ProjectRequestController.show);
router.post('/user/:admin_id/project/:project_id/request/create', restify_jwt({secret: 'secret'}), ProjectRequestController.create);
router.put('/user/:admin_id/project/:project_id/request/update/:request_id', restify_jwt({secret: 'secret'}), ProjectRequestController.update);
router.delete('/user/:admin_id/project/:project_id/request/delete/:request_id', restify_jwt({secret: 'secret'}), ProjectRequestController.delete);


//
router.get('/user/:admin_id/project/:project_id/request/allProjectHasTestCases', restify_jwt({secret: 'secret'}), ProjectRequestController.allProjectHasTestCases);

router.get('/user/:admin_id/project/:project_id/request/progress', restify_jwt({secret: 'secret'}), ProjectRequestController.progress);

router.get('/user/:admin_id/project/:project_id/request/test_request/:request_id', restify_jwt({secret: 'secret'}), ProjectRequestController.doTesting);


//progress

module.exports = router;
