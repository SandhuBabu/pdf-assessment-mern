const express = require('express')
const cors = require('cors')
const path = require('path');
const fileupload = require('express-fileupload')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const router = require('./router')
const { verifyToken } = require('./services/userService')

const app = express()
app.use(cors())

app.use("/", async (req, res, next) => {
    if (
        req.url.startsWith("/signin") ||
        req.url.startsWith("/signup") ||
        req.url.startsWith("/uploads")
    ) {
        next()
    } else {
        const token = req.headers['authorization']
        if (!token || !token.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const user = await verifyToken(token.split('Bearer ')[1])
        if (!user)
            return res.status(401).json({ message: "Unauthorized" })
        else {
            req.user = user
            next()
        }
    }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(fileupload())
app.use('/', router)

const DB_CONNECTION_URL = 'mongodb://127.0.0.1:27017/test'
const PORT = 5000

const run = async () => {
    try {
        await mongoose.connect(DB_CONNECTION_URL)
        console.log("DB Connected");

        app.listen(PORT, (err) => {
            if (err)
                console.log(err);
            else
                console.log(`Servert started at port ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

run()