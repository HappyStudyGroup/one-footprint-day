import serve from 'rollup-plugin-serve'
import babel from 'rollup-plugin-babel'

// 用于打包的配置
// 打包类库 -> rollup   (打包非常干净且支持es6->es5)
// 打包项目 -> webpack  (打包出来的东西非常多)
export default {
  input: './src/index.js',
  output: {
    file: 'dist/vue.js',
    name: 'Vue',        // 全局的名字 Vue
    format: 'umd',      // window.Vue
    sourceMap: true,    // es6-es5
  },
  plugins: [
    babel({
      exclude: "node_modules/**",   //这个目录不需要用babel转换
    }),
    serve({
      open: true,
      openPage: "/public/index.html",
      port: 3000,
      contentBase: '',              // 以当前文件的根目录为基准
    })
  ]
}

