const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.ObjectId


const userSchema = new Schema({
    id: ObjectId,
    email: String,
    password: String,
    token: String,
    files: [String]
})

const UserModal = new mongoose.model('Users', userSchema)


module.exports = UserModal