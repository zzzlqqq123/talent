import { body, ValidationChain } from 'express-validator'

// 自定义验证器：支持 MongoDB ObjectId 或 UUID 格式
const isValidResultId = (value: string) => {
  // 检查是否为 MongoDB ObjectId (24位十六进制字符串)
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/
  // 检查是否为 UUID (如：xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  return mongoIdRegex.test(value) || uuidRegex.test(value)
}

// 生成报告验证规则
export const generateReportValidator: ValidationChain[] = [
  body('resultId')
    .notEmpty()
    .withMessage('结果ID不能为空')
    .custom((value: string) => isValidResultId(value))
    .withMessage('结果ID格式不正确，应为 MongoDB ObjectId 或 UUID')
]

// 对比报告验证规则
export const compareReportsValidator: ValidationChain[] = [
  body('reportIds')
    .isArray({ min: 2, max: 5 })
    .withMessage('请选择2-5个报告进行对比'),
  
  body('reportIds.*')
    .isMongoId()
    .withMessage('报告ID格式不正确')
]

