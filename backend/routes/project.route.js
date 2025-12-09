const express = require("express");
const router = express.Router();
const projectController = require("../controller/project.controller");
const authMiddleWare=require("../middleware/auth.middleware")
const { body } = require("express-validator");


router.post('/create',
    authMiddleWare.authUser,
    body('name').isString().withMessage('Name is required'),
    projectController.createProject
)

router.get('/all',
    authMiddleWare.authUser,
    projectController.getAllProject
)

router.put('/add-user',
    authMiddleWare.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    projectController.addUserToProject

)

router.get('/get-project/:projectId',
    authMiddleWare.authUser,
    projectController.getProjectById
)

module.exports=router