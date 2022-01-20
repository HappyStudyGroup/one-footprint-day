import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

// 注意的就是vuex中的 store, 所有组件都可以通过 $store 拿到这个变量
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
