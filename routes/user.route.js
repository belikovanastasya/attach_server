const express = require('express');
const router = express.Router();
const passport = require('passport');
// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/user.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', user_controller.test);
router.post('/register', user_controller.user_create);
router.post('/login', user_controller.user_login);
router.get('/checkuser', user_controller.user_check);
// router.get('/:id', user_controller.user_details);
// router.put('/:id/update', user_controller.user_update);
// router.delete('/:id/delete', user_controller.user_delete);
module.exports = router;