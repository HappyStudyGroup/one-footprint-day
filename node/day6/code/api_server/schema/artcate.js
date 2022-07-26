// 1. 导入定义验证规则的模块
const joi = require('@hapi/joi');


// 2. 定义 name 和 alias 的验证规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()
const id = joi.number().integer().min(1).required()


// 3. 向外共享验证规则对象

exports.add_cate_schema = {
  body: {
    name,
    alias
  }
}

exports.get_cate_schema = {
  params: {
    id
  }
}

exports.del_cate_schema = {
  params: {
    id
  }
}
exports.update_cate_schema = {
  query: {
    id,
    name,
    alias
  }
}