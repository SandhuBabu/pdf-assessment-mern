const router = require('express').Router();
const { handleRemove } = require('./services/service');
const { createUser, signin, getUserFiles, logout } = require('./services/userService');


router.post('/signup', (req, res) => {
    if (!req.body)
        return res.status(400).json({ message: "No data found with request" })
    createUser(req, res)
})

router.post('/signin', (req, res) => {
    signin(req, res)
})

router.post('/logout', (req, res) => {
    logout(req, res)
})

router.get('/user', (req, res) => {
    return res.json({ email: req?.user.email })
})

router.get('/my-files', (req, res) => {
    getUserFiles(req, res);
})

router.post('/upload', (req, res) => {
    if (!req.files?.file) {
        return res.status(400).json({ message: "No file found" })
    }
    handleRemove(req, res)
})


module.exports = router