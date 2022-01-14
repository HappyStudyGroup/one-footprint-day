<template>
  <div id="app">
    <div id="nav">
      <!-- 导航可能是hash, history.pushState -->
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'app'
}
</script>