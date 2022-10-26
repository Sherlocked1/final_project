var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const ProjectRequestParamsController = require('../controllers/request_params');


router.get('/user/:admin_id/project/:project_id/request/:request_id/params/index', restify_jwt({secret: 'secret'}), ProjectRequestParamsController.index);
router.get('/user/:admin_id/project/:project_id/request/:request_id/params/show/:param_id', restify_jwt({secret: 'secret'}), ProjectRequestParamsController.show);
router.post('/user/:admin_id/project/:project_id/request/:request_id/params/create', restify_jwt({secret: 'secret'}), ProjectRequestParamsController.create);
router.put('/user/:admin_id/project/:project_id/request/:request_id/params/update/:param_id', restify_jwt({secret: 'secret'}), ProjectRequestParamsController.update);
router.delete('/user/:admin_id/project/:project_id/request/:request_id/params/delete/:param_id', restify_jwt({secret: 'secret'}), ProjectRequestParamsController.delete);


module.exports = router;
