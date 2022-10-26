var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const ProjectVersionController = require('../controllers/project_versoin');


router.get('/user/:admin_id/project/:project_id/version/index', restify_jwt({secret: 'secret'}), ProjectVersionController.index);
router.get('/user/:admin_id/project/:project_id/version/show/:version_id', restify_jwt({secret: 'secret'}), ProjectVersionController.show);
router.post('/user/:admin_id/project/:project_id/version/create', restify_jwt({secret: 'secret'}), ProjectVersionController.create);

router.delete('/user/:admin_id/project/:project_id/version/delete/:version_id', restify_jwt({secret: 'secret'}), ProjectVersionController.delete);


module.exports = router;
