const express = require('express');
const userController = require('./../controller/userController');
const authController = require('../controller/authController');

// router.param('id', (req, res, next, val) => {
//     console.log(`Tour id is: ${val}`);
//     next();
// })

const router = express.Router();

router.post('/signup', authController.signUp);

router
    .route('/')
    .get(userController.getAllUser)
    .post(userController.createUser)

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)
module.exports = router;
