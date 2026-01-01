import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  nickname: string
  avatar?: string
  profile: {
    gender?: 'male' | 'female' | 'other'
    age?: number
    birthday?: Date
    occupation?: string
    location?: string
  }
  stats: {
    testCount: number
    lastTestDate?: Date
    totalScore: number
  }
  status: 'active' | 'inactive' | 'banned'
  role: 'user' | 'admin'
  emailVerified: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    nickname: {
      type: String,
      required: true,
      trim: true
    },
    avatar: String,
    profile: {
      gender: { type: String, enum: ['male', 'female', 'other'] },
      age: { type: Number, min: 1, max: 150 },
      birthday: Date,
      occupation: String,
      location: String
    },
    stats: {
      testCount: { type: Number, default: 0 },
      lastTestDate: Date,
      totalScore: { type: Number, default: 0 }
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'banned'],
      default: 'active'
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    lastLoginAt: Date
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        const userObject: any = ret
        if (userObject.password) {
          delete userObject.password
        }
        return userObject
      }
    }
  }
)

export default mongoose.model<IUser>('User', UserSchema)
