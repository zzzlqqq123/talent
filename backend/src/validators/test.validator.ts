import { body, ValidationChain } from 'express-validator'

// 保存答案验证规则
export const saveAnswersValidator: ValidationChain[] = [
  body('testId')
    .notEmpty()
    .withMessage('测试ID不能为空')
    .isMongoId()
    .withMessage('测试ID格式不正确'),
  
  body('answers')
    .isArray({ min: 1 })
    .withMessage('答案列表不能为空'),
  
  body('answers.*.questionId')
    .notEmpty()
    .withMessage('题目ID不能为空')
    .isMongoId()
    .withMessage('题目ID格式不正确'),
  
  body('answers.*.answerValue')
    .isInt({ min: 1, max: 5 })
    .withMessage('答案值必须在1-5之间'),
  
  body('answers.*.duration')
    .optional()
    .isInt({ min: 0 })
    .withMessage('答题时长必须为非负整数')
]

// 完成测试验证规则
export const completeTestValidator: ValidationChain[] = [
  body('testId')
    .notEmpty()
    .withMessage('测试ID不能为空')
    .isMongoId()
    .withMessage('测试ID格式不正确'),
  
  body('totalDuration')
    .isInt({ min: 0 })
    .withMessage('总时长必须为非负整数')
]

