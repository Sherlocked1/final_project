var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const ProjectRequestTestCaseController = require('../controllers/request_test_cases');


router.get('/user/:admin_id/project/:project_id/request/:request_id/test_case/index', restify_jwt({secret: 'secret'}), ProjectRequestTestCaseController.index);
router.post('/user/:admin_id/project/:project_id/request/:request_id/test_case/create', restify_jwt({secret: 'secret'}), ProjectRequestTestCaseController.create);
router.put('/user/:admin_id/project/:project_id/request/:request_id/test_case/update/:test_case_id', restify_jwt({secret: 'secret'}), ProjectRequestTestCaseController.update);
router.delete('/user/:admin_id/project/:project_id/request/:request_id/test_case/delete/:test_case_id', restify_jwt({secret: 'secret'}), ProjectRequestTestCaseController.delete);


module.exports = router;
