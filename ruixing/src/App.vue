<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.auto-img{
  display: block;
  width: 100%;
  height: 100%;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clearflx::after{
  content: "";
  display: block;
  clear: both;
}
.text-eli{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
