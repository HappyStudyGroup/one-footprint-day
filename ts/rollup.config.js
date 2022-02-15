import ts from 'rollup-plugin-typescript2'; // 解析 ts
import { nodeResolve } from '@rollup/plugin-node-resolve'; // 解析第三方模块
import serve from 'rollup-plugin-serve';
import path from 'path';

// rollup 支持 es6 语法, 所以全用 import
export default {
  input: 'src/index.ts',
  output: {
    format: 'iife', // 立即执行(自执行函数)
    file: path.resolve(__dirname, 'dist/bundle.js'), // 出口文件(当前路径)
    sourcemap: true, // 根据源码产生映射文件
  },
  plugins:[
    nodeResolve({
      extensions: ['.js', '.ts']
    }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    serve({
      open: true, // 自动打开浏览器
      openPage: '/public/index.html',
      contentBase: '',
      port: 8080
    })
  ]
}