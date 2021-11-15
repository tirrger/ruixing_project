<template>
  <div class="main">
    <!-- 二级路由出口-->
    <router-view></router-view>
    <!-- tabar标签拦 -->
    <van-tabbar v-model="tabbarActive" active-color="#0b34ba" route>
      <van-tabbar-item v-for="(item, index) in tabbarData" :key="index"
      :to="item.path">
        <span>{{ item.title }}</span>
        <template #icon="props">
          <img :src="props.active ? item.active : item.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabbarActive: 0,
      tabbarData: [
        {
          title: "首页",
          active: require("../assets/images/home_active.png"),
          inactive: require("../assets/images/home.png"),
          path:'/main/home'
        },
        {
          title: "菜单",
          active: require("../assets/images/menu_active.png"),
          inactive: require("../assets/images/menu.png"),
          path:'/main/menu'

        },
        {
          title: "购物袋",
          active: require("../assets/images/shopbag_active.png"),
          inactive: require("../assets/images/shopbag.png"),
          path:'/main/shopBag'

        },
        {
          title: "我的",
          active: require("../assets/images/my_active.png"),
          inactive: require("../assets/images/my.png"),
          path:'/main/my'

        },
      ],
    };
  },
};
</script>

<style>
</style>