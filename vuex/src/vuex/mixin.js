
function vuexInit() {
  if(this.$options.store) {// 根组件
    this.$store = this.$options.store; // 给根属性增加$store
  }else if(this.$parent && this.$parent.$store) {
    this.$store = this.$parent.$store;
  }
}

export const applyMixin = (Vue) => {// 需要将store属性分配给所有组件
  Vue.mixin({
    beforeCreate: vuexInit
  })
}