var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const ProjectCommitController = require('../controllers/project_commit');


router.get('/user/:admin_id/project/:project_id/commit/index', restify_jwt({secret: 'secret'}), ProjectCommitController.index);
router.get('/user/:admin_id/project/:project_id/commit/show/:commit_id', restify_jwt({secret: 'secret'}), ProjectCommitController.show);
router.post('/user/:admin_id/project/:project_id/commit/create', restify_jwt({secret: 'secret'}), ProjectCommitController.create);

router.delete('/user/:admin_id/project/:project_id/commit/delete/:commit_id', restify_jwt({secret: 'secret'}), ProjectCommitController.delete);


module.exports = router;
