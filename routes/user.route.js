const express = require('express');

const router = express.Router();
const userController = require('../controllers/user.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', userController.test);
router.post('/register', userController.user_create);
router.post('/login', userController.user_login);
router.post('/checkuser', userController.user_check);
// router.get('/:id', userController.user_details);
router.put('/update', userController.user_update);
// router.delete('/:id/delete', userController.user_delete);
router.post('/userworks', userController.user_works);

module.exports = router;
