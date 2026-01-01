import mongoose, { Schema, Document } from 'mongoose'

export interface IAnswer {
  questionId: mongoose.Types.ObjectId
  answerValue: number
  duration?: number
  timestamp: Date
}

export interface IResult extends Document {
  userId: mongoose.Types.ObjectId
  reportId?: mongoose.Types.ObjectId
  testId: string
  answers: IAnswer[]
  startTime: Date
  endTime?: Date
  totalDuration: number
  status: 'in_progress' | 'completed' | 'abandoned'
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

const ResultSchema = new Schema<IResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reportId: {
      type: Schema.Types.ObjectId,
      ref: 'Report'
    },
    testId: {
      type: String,
      required: true,
      unique: true
    },
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: 'Question'
        },
        answerValue: {
          type: Number,
          min: 1,
          max: 5
        },
        duration: Number,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date
    },
    totalDuration: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress'
    },
    ipAddress: String,
    userAgent: String
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IResult>('Result', ResultSchema)
