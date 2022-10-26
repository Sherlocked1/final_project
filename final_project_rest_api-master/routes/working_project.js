var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const WorkingProjectController = require('../controllers/working_project');

////user_id


router.get('/working_project/index', restify_jwt({secret: 'secret'}), WorkingProjectController.myWorkingProject);

router.get('/working_project/collaborators/:p_oid', restify_jwt({secret: 'secret'}), WorkingProjectController.getCollaboratorsForProject);


router.get('/working_project/show/:wp_oid', restify_jwt({secret: 'secret'}), WorkingProjectController.show);
// //p_role p_oid  admin_oid
router.post('/working_project/create', restify_jwt({secret: 'secret'}), WorkingProjectController.create);
router.delete('/working_project/delete/:wp_oid', restify_jwt({secret: 'secret'}), WorkingProjectController.delete);

router.delete('/working_project/remove_from_project/:wp_oid', restify_jwt({secret: 'secret'}),
    WorkingProjectController.removeStakeHolderFromWorkerProject);



module.exports = router;
