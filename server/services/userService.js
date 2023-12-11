const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserModal = require('../db/Users')


const createUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Invalid Fields" })
        }

        if (await UserModal.findOne({ email: email }).exec()) {
            return res.status(400).json({ message: "Email already registered" })
        }

        const passwordHash = await createHash(password)
        const token = createJwtToken(email)

        const user = new UserModal()
        user.email = email
        user.password = passwordHash
        user.token = token
        const savedUser = await user.save();

        return res.json({
            id: savedUser._id,
            email: savedUser.email,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to create user" })
    }
}

const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await checkUser(email, password)
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const token = createJwtToken(user.email)
        await UserModal.updateOne({ _id: user.id }, { token: token })
        return res.json({ ...user, token })
    } catch {
        return res.status(400).json({ message: "Failed" })
    }
}

const logout = async (req, res) => {
    try {
        const token = req.headers['authorization']
        if (!token || !token.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const user = await UserModal.findOne({ token: token.split('Bearer ')[1] }).exec()

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        await UserModal.updateOne({ _id: user._id }, { token: null })
        return res.json({ message: 'success' })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to logout' })
    }
}

const getUserFiles = async (req, res) => {
    const userdata = await UserModal.findOne({ email: req.user.email }).exec()
    return res.json(userdata.files)
}

const createHash = async (password) => {
    const salt = 10;
    try {
        const hash = await bcrypt.hash(password, salt)
        return hash
    } catch (error) {
        console.log(error);
        return null
    }

}

const checkUser = async (email, password) => {
    try {
        const user = await UserModal.findOne({ email: email }).exec()
        const match = await bcrypt.compare(password, user.password)
        if (!match)
            return null

        return {
            id: user._id,
            email: user.email
        }
    } catch (error) {
        console.log(error);
    }
}

const verifyToken = async (token) => {
    try {
        const user = jwt.verify(token, 'private_key87934jnkjsahidhu7q2eSDSDA')
        const userdata = await UserModal.findOne({ email: user.email }).exec()
        if (userdata.token === token)
            return user
        else
            return null
    } catch (error) {
        return null
    }
}

const createJwtToken = (email) => {
    return jwt.sign({ email: email }, "private_key87934jnkjsahidhu7q2eSDSDA")
}

module.exports = {
    createUser,
    signin,
    logout,
    verifyToken,
    getUserFiles
}

