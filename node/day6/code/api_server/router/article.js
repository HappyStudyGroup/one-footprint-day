const express = require('express')
// 导入处理 formdata格式的表单数据
const multer = require('multer')
const path = require('path')
const expressJoi = require('@escook/express-joi')
const { pub_article_schema } = require('../schema/article')
const article_handler = require('../router_handler/article')


const upload = multer({ dest: path.join(__dirname, '../uploads') })
const router = express.Router()


// 发布文章的路由
// upload.single(fieldname), 接受一个以 fieldname 命名的文件。这个文件的信息保存在 req.file。
// upload.array(fieldname[, maxCount]), 接受一个以 fieldname 命名的文件数组。可以配置 maxCount 来限制上传的最大数量。这些文件的信息保存在 req.files。
// upload.fields(fields), 
//        接受指定 fields 的混合文件。这些文件的信息保存在 req.files。
//        fields 应该是一个对象数组，应该具有 name 和可选的 maxCount 属性。
// upload.none(), 只接受文本域。如果任何文件上传到这个模式，将发生 "LIMIT_UNEXPECTED_FILE" 错误。
// upload.any(), 接受一切上传的文件。文件数组将保存在 req.files。
router.post('/pub', upload.any(), expressJoi(pub_article_schema), article_handler.publicArticle)







module.exports = router