var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const ProjectRequestBodyController = require('../controllers/request_body');


router.get('/user/:admin_id/project/:project_id/request/:request_id/body/index', restify_jwt({secret: 'secret'}), ProjectRequestBodyController.index);
router.get('/user/:admin_id/project/:project_id/request/:request_id/body/show/:body_id', restify_jwt({secret: 'secret'}), ProjectRequestBodyController.show);
router.post('/user/:admin_id/project/:project_id/request/:request_id/body/create', restify_jwt({secret: 'secret'}), ProjectRequestBodyController.create);
router.put('/user/:admin_id/project/:project_id/request/:request_id/body/update/:body_id', restify_jwt({secret: 'secret'}), ProjectRequestBodyController.update);
router.delete('/user/:admin_id/project/:project_id/request/:request_id/body/delete/:body_id', restify_jwt({secret: 'secret'}), ProjectRequestBodyController.delete);

//user/5e313342bb8bb83a4c8c8769/project/5e314b1b43af503624fa924d/request/5e33e8a803f0983a8c806442/body/create
module.exports = router;
