var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const InviteController = require('../controllers/invite');
// get my invites
router.get('/invite/index', restify_jwt({secret: 'secret'}),InviteController.index);

router.get('/invite/count', restify_jwt({secret: 'secret'}),InviteController.count);



///p_id admin_id stake_holder_id role
router.post('/invite/send', restify_jwt({secret: 'secret'}),InviteController.send);
//from use invite id to get invite info and get admin project and then then assign it to my working project
router.post('/invite/accept/:id', restify_jwt({secret: 'secret'}),InviteController.accept);
//just remove it  from invite table
router.delete('/invite/reject/:id', restify_jwt({secret: 'secret'}),InviteController.reject);



module.exports = router;
