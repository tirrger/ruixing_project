<template>
  <div class="Home">
    <van-nav-bar left-text="返回" right-text="按钮" left-arrow fixed>
      <template #left>
        <div class="user-title">
          <div class="time">晚上好,</div>
          <div class="user-name">Allen</div>
        </div>
      </template>
      <template #right>
        <van-search placeholder="请输入搜索关键词" />
      </template>
    </van-nav-bar>
    <!-- 商品区域 -->
    <div class="procucts-box">
      <!--轮播图 -->
      <div class="banner-box">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item, index) in bannerData" :key="index">
            <img class="auto-img" :src="item.bannerImg" alt="" />
            <div class="img-name">{{ item.name }}</div>
          </van-swipe-item>
          <template #indicator>
            <span></span>
          </template>
        </van-swipe>
      </div>
      <!-- 热门推荐 -->
      <div class="procuts-content">
        <div class="clearflx">
          <div class="pro-title fl">热门推荐</div>
        </div>
        <div class="pro-item-box">
          <div class="pro-item" v-for="(item,index) in productData" :key="index" @click="goDetail(item.pid)">
            <div class="pro-img">
              <img
                :src="item.largeImg"
                alt=""
                class="auto-img"
              />
            </div>
            <div class="pro-name text-eli">{{item.name}}</div>
            <div class="pro-enname text-eli">{{item.enname}}</div>
            <div class="pro-price">￥{{item.price}}</div>
          </div>
         
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/Home.less";
export default {
  data() {
    return {
      bannerData: [],
      productData: [],
    };
  },
  methods: {
    //请求轮播图数据
    getBanerData() {
      // 显示加载中
      this.$toast.loading({
        //加载的文本
        message: "加载轮播图",
        //防穿透
        forbidClick: true,
        //显示的时间
        duration: 0,
      });
      this.axios({
        //请求类型
        method: "GET",
        //请求地址
        url: "/banner",
        params: {
          appkey: this.appkey,
        },
      })
        .then((res) => {
          this.$toast.clear();
          console.log("轮播图 res=>", res);
          this.bannerData = res.data.result;
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("轮播图 err=>", err);
        });
    },
    //请求热门推荐的数据
    getProductsData() {
      this.axios({
        //请求类型
        method: "GET",
        //请求地址
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((res) => {
          console.log("热门推荐 res=>", res);
          if (res.data.code === 500) {
            this.productData = res.data.result;
          }
        })
        .catch((err) => {
          console.log("热门推荐 err=>", err);
        });
    },
    //跳转详情页
    goDetail(pid){
      this.$router.push({name:'Detail',params:{pid}})
},
  },
  created() {
    //请求轮播图数据
    this.getBanerData();
    //请求热门数据
    this.getProductsData();
    
  },
};
</script>

<style>
</style>