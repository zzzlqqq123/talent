import { body, ValidationChain } from 'express-validator'

// 更新资料验证规则
export const updateProfileValidator: ValidationChain[] = [
  body('nickname')
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('昵称长度必须在2-20个字符之间'),
  
  body('avatar')
    .optional()
    .isURL()
    .withMessage('头像必须是有效的URL'),
  
  body('profile.gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('性别值不正确'),
  
  body('profile.age')
    .optional()
    .isInt({ min: 1, max: 150 })
    .withMessage('年龄必须在1-150之间'),
  
  body('profile.occupation')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('职业长度不能超过50个字符'),
  
  body('profile.location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('地址长度不能超过100个字符')
]

// 修改密码验证规则
export const updatePasswordValidator: ValidationChain[] = [
  body('oldPassword')
    .notEmpty()
    .withMessage('原密码不能为空'),
  
  body('newPassword')
    .isLength({ min: 6, max: 20 })
    .withMessage('新密码长度必须在6-20个字符之间')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('新密码必须包含大小写字母和数字'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('两次输入的密码不一致')
      }
      return true
    })
]

