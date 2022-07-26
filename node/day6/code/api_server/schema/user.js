// 导入定义验证规则的包
const joi = require('@hapi/joi')

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 定义 id， nickname， email 的验证规则
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const email = joi.string().email().required();

// 定义 avator 的验证规则
const avator = joi.string().dataUri().required()

// 定义验证 注册 和 登录 表单数据的规则对象
exports.reg_login_schema = {
  body: {
    username,
    password
  }
}

// 定义验证 更新用户信息 表单数据的规则对象
exports.update_userinfo_schema = {
  body: {
    id,
    nickname,
    email
  }
}
// 定义验证 更新密码 的规则对象
exports.update_password_schema = {
  body: {
    oldPwd: password,
    // 1. joi.ref('oldPwd') 表示 newPwd 必须和 oldPwd 保持一致
    // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd
    // 3. .concat() 用户合并 joi.not(joi.ref('oldPwd')) 和 password 两条规则
    newPwd: joi.not(joi.ref('oldPwd')).concat(password)
  }
}

// 定义验证 avator 投降的规则对象
exports.update_avator_schema = {
  body: {
    avator
  }
}