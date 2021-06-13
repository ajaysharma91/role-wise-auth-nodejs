import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { Schema, model } from 'mongoose'
import { SECRET } from '../constant'
import { randomBytes } from 'crypto'
import { pick } from 'lodash'

const UserSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user','owner']
    },
    verificationCode: {
        type: String,
        require: false
    },
    resetPasswordToken: {
        type: String,
        require: false
    },
    resetPasswordExpiresIn: {
        type: String,
        require: false
    }
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
    let user = this
    if (!user.isModified('password')) return next()
    let password = await hash(user.password, 10)
    next()
})

UserSchema.methods.comparePassword = async function (password) {
    return await compare(password, this.password)
}

UserSchema.methods.generateJWT = async function () {
    let payload = {
        username: this.username,
        email: this.email,
        name: this.name,
        id: this._id
    }
    return await sign(payload, SECRET, { expiresIn: "1 day" })
}

UserSchema.methods.generatePasswordReset = function () {
    this.resetPasswordExpiresIn = Date.now() + 36000000
    this.resetPasswordToken = randomBytes(20).toString('hex')
}

UserSchema.methods.getUserInfo = function () {
    return pick(this, ["_id", "username", "email", "name", "verified","role"])
}

const User = model("users", UserSchema)
export default User