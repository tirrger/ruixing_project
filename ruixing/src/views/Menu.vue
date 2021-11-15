<template>
  <div class="Menu">
    <!-- 导航栏 -->
    <van-nav-bar left-text="返回" left-arrow fixed>
      <template #left>
        <van-search placeholder="请输入搜索关键词" />
      </template>
    </van-nav-bar>
    <!-- 商品类型 -->
    <div class="pro-type">
      <div class="type-item">
        <img src="../assets/images/icons_21.gif" alt="" />
        <div class="active">推荐</div>
      </div>
      <div class="type-item">
        <img src="../assets/images/icons_05.gif" alt="" />
        <div>拿铁</div>
      </div>
      <div class="type-item">
        <img src="../assets/images/icons_03.gif" alt="" />
        <div>咖啡</div>
      </div>
      <div class="type-item">
        <img src="../assets/images/icons_07.gif" alt="" />
        <div>瑞纳冰</div>
      </div>
    </div>
    <!-- 商品 -->
    <div class="pro-type-box">
      <div class="pro-item" v-for="(item,index) in 10 " :key="index">
        <div class="pro-img"></div>
        <div class="pro-info clearflx">
          <div class="info-name fl">
            <div class="name">焦糖玛奇朵</div>
            <div class="enname">adadadad</div>
          </div>
          <div class="info-price fr">￥28.00</div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import "../assets/less/menu.less";
export default {};
</script>

<style>
</style>