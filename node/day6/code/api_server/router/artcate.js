const express = require('express')

const router = express.Router();

const artcate_handler = require('../router_handler/artcates')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
const { add_cate_schema, get_cate_schema, del_cate_schema, update_cate_schema } = require('../schema/artcate')

// 获取文章分类列表数据的路由
router.get('/cates', artcate_handler.getArticleCates)

// 根据 id 查询文章信息
router.get("/cates/:id", expressJoi(get_cate_schema), artcate_handler.getArtCateById)

// 新增文章分类的路由
router.post('/add', expressJoi(add_cate_schema), artcate_handler.addArticleCates)

// 根据 id 删除文章的路由
router.get("/delete/:id", expressJoi(del_cate_schema), artcate_handler.deleteCateById)

// 根据 id 更新文章的路由
router.get("/update", expressJoi(update_cate_schema), artcate_handler.updateArtCate)


module.exports = router;