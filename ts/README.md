# ts 学习

## 直接使用 ts
```js
$ npm install typescript -g --force     // 全局强制安装
$ tsc --init                            // 初始化一个 tsconfig.json 文件
$ tsc                                   // 将 ts 根据 tsconfig.json 中配置的规则, 转化成 js 语法
$ npm install ts-node -g                // 安装可直接执行 ts 的插件
$ tsc --watch                           // 像构建工具一样监听, 一旦内容保存更新, 立马编译 js
```

## 通过构建工具 rollup 使用 ts
```dash
$ npm install rollup typescript rollup-plugin-typescript2 @rollup/plugin-node-resolve rollup-plugin-serve -D

> rollup-plugin-typescript2   : 解析 ts 的插件
> @rollup/plugin-node-resolve : 解析第三方模块的插件
> rollup-plugin-serve         : 启动本地服务的插件

---------------------
interface中无法使用联合类型
```