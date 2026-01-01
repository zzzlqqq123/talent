import mongoose, { Schema, Document } from 'mongoose'

export interface IQuestion extends Document {
  questionText: string
  questionType: 'single' | 'scenario'
  category: 'cognitive' | 'creativity' | 'emotional' | 'practical'
  dimension: string
  subDimension?: string
  options: Array<{
    value: number
    label: string
  }>
  isReverse: boolean
  difficulty: number
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const QuestionSchema = new Schema<IQuestion>(
  {
    questionText: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      enum: ['single', 'scenario'],
      default: 'single'
    },
    category: {
      type: String,
      enum: ['cognitive', 'creativity', 'emotional', 'practical'],
      required: true
    },
    dimension: {
      type: String,
      required: true
    },
    subDimension: String,
    options: [
      {
        value: { type: Number, required: true },
        label: { type: String, required: true }
      }
    ],
    isReverse: {
      type: Boolean,
      default: false
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    order: {
      type: Number,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IQuestion>('Question', QuestionSchema)
