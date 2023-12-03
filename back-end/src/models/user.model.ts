import mongoose, { Schema } from 'mongoose'
import { CollectionName, Roles } from './constants'
import Utils from '../utils/utils'

export interface IUser extends Document {
    fullName: string
    email: string
    password: string
    role: string
    comparePassword: (enteredPassword: string) => boolean
}

export type UserInput = {
    fullName: string
    email: string
    password: string
}

const userSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: Utils.emailValidator,
                message: 'Email address is not conform',
            },
        },
        password: {
            type: String,
            required: true,
            validate: {
                validator: Utils.passwordValidator,
                message:
                    'Invalid password. Password most have 8 characters or more and contain a number, upper case an special character such as &,@,!,#,^,/',
            },
        },
        role: {
            type: String,
            default: Roles.Reader,
        },
    },
    {
        timestamps: true,
    },
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await Utils.encrypt(this.password)
})

userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await Utils.compareEncrypted(enteredPassword, this.password)
}

const User = mongoose.model(CollectionName.Users, userSchema)

export default User
