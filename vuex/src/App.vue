<template>
  <div id="app">
    {{$store.state.name}},
    <button @click="$store.state.name = 'zf+'">修改属性</button>
    {{$store.getters.myAge}}
    <button @click="$store.commit('a/changeAge', 5)">mutations修改年纪</button>
    <button @click="$store.dispatch('b/changeAge', 10)">actions修改年纪</button>
    <br> ------------------------------------- <br>
    a: {{$store.state.a.name}}, {{$store.state.a.age}}
    <br> ------------------------------------- <br>
    b: {{$store.state.b.name}}, {{$store.state.b.age}}
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    
  },
  methods: {

  }
}
</script>