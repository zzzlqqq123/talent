import { body, ValidationChain } from 'express-validator'

// 注册验证规则
export const registerValidator: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('密码长度必须在6-20个字符之间')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('密码必须包含大小写字母和数字'),
  
  body('nickname')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('昵称长度必须在2-20个字符之间')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/)
    .withMessage('昵称只能包含中文、字母、数字和下划线')
]

// 登录验证规则
export const loginValidator: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
]

