const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.ObjectId

// Schema of User Collection 
const userSchema = new Schema({
    id: ObjectId,
    email: String,
    password: String, // encrypted password
    token: String, // jwt token
    files: [String] // array of previously edited file urls
})

const UserModal = new mongoose.model('Users', userSchema)


module.exports = UserModal