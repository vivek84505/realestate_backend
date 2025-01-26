const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router();

router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.post('/users/update/:userId', userController.updateUser);
router.post('/users/activeInactiveUser', userController.activeInactiveUser);

module.exports = router;
