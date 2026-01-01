import mongoose, { Schema, Document } from 'mongoose'

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId
  resultId: mongoose.Types.ObjectId
  testId: string
  totalScore: number
  dimensionScores: Array<{
    dimension: string
    score: number
    level: string
    subScores: Record<string, number>
  }>
  talentType: string
  talentLevel: string
  summary: string
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  chartData: any
  shareId?: string
  isPublic: boolean
  shareCount: number
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

const ReportSchema = new Schema<IReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    resultId: {
      type: Schema.Types.ObjectId,
      ref: 'Result',
      required: true,
      unique: true
    },
    testId: {
      type: String,
      unique: true,
      sparse: true
    },
    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    dimensionScores: [
      {
        dimension: { type: String, required: true },
        score: { type: Number, required: true },
        level: { type: String, required: true },
        subScores: { type: Map, of: Number }
      }
    ],
    talentType: {
      type: String,
      required: true
    },
    talentLevel: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    chartData: {
      type: Schema.Types.Mixed,
      required: true
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    shareCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IReport>('Report', ReportSchema)
