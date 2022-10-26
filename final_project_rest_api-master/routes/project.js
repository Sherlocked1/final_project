var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const ProjectController = require('../controllers/project');

//user_id


router.get('/project/index', restify_jwt({secret: 'secret'}), ProjectController.index);
router.get('/user/:admin_id/project/show/:p_oid', restify_jwt({secret: 'secret'}), ProjectController.show);
router.post('/project/create', restify_jwt({secret: 'secret'}), ProjectController.create);
router.put('/project/update/:p_oid', restify_jwt({secret: 'secret'}), ProjectController.update);
router.delete('/project/delete/:p_oid', restify_jwt({secret: 'secret'}), ProjectController.delete);

router.get('/project/count/:p_oid', restify_jwt({secret: 'secret'}), ProjectController.count);


router.get('/project/commits_per_months/:p_oid', restify_jwt({secret: 'secret'}), ProjectController.commitsByMonths);
router.get('/project/versions_per_months/:p_oid', restify_jwt({secret: 'secret'}), ProjectController.versionsByMonths);
router.get('/project/collaborators/:p_oid', restify_jwt({secret: 'secret'}), ProjectController.collaborators);


router.get('/project/show_doc/:doc_name', ProjectController.showDoc);


///
module.exports = router;
