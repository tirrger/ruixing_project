<template>
  <div class="detail">
    <!-- 导航栏 -->
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- 背景图片 -->
    <div class="bg-box">
      <img :src="detailData.large_img" alt="" class="auto-img" />
      <div class="img-name">{{ detailData.name }}</div>
    </div>
    <!-- 商品规格盒子 -->
    <div class="products-rule-box">
      <!-- 商品规格 -->
      <div class="pro-rule">
        <div
          class="pro-item"
          v-for="(item, index) in detailData.rules"
          :key="index"
        >
          <div class="item-name">{{ item.title }}</div>
          <div class="item-rule">
            <div
              class="rule"
              :class="{ active: item.currentIndex === i }"
              v-for="(n, i) in item.rule"
              :key="i"
              @click="toggleRle(item, i)"
            >
              {{ n }}
            </div>
          </div>
        </div>
      </div>
      <!-- 商品描述 -->
      <div class="pro-desc-box">
        <div class="desc-title">商品描述</div>
        <div
          class="desc-list"
          v-for="(item, index) in detailData.desc"
          :key="index"
        >
          <div>{{ `${index + 1}、${item}` }}</div>
        </div>
      </div>
      <!-- 价格 -->
      <div class="pro-price-box clearflx">
        <div class="pro-price fl">￥{{ detailData.price }}</div>
        <div class="fr">
          <van-stepper
            v-model="proCount"
            theme="round"
            button-size="22"
            disable-input
          />
        </div>
      </div>
      <!-- 商品导航 -->
      <van-goods-action>
        <van-goods-action-icon
          :color="ShopCount > 0 ? '#0b34ba' : '#989898'"
          :badge="ShopCount > 0 ? ShopCount : ''"
          icon="bag"
          text="购物袋"
          @click="$router.push({name:'ShopBag'})"
        />
        <van-goods-action-icon
          :color="isLike ? '#0b34ba' : '#989898'"
          icon="like"
          :text="isLike ? '已收藏' : '未收藏'"
          @click="getLike()"
        />
        <van-goods-action-button
          color="#587fcd"
          type="warning"
          text="加入购物车"
          @click="addshopcart()"
        />
        <van-goods-action-button
          color="#0b34ba"
          type="danger"
          text="立即购买"
        />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../assets/less/detail.less";
export default {
  data() {
    return {
      pid: 0,
      detailData: [],
      //是否收藏
      isLike: false,
      //购物袋商品数量
      ShopCount: 0,
      //商品的数量
      proCount: 0,
    };
  },
  created() {
    this.pid = this.$route.params.pid;
    // console.log(this.$route.params);
    this.getDetailData();
    this.findLike();
    this.getshopcartRows();
  },
  methods: {
    //商品详情信息
    getDetailData() {
      // 显示加载中
      this.$toast.loading({
        //加载的文本
        message: "加载中...",
        //防穿透
        forbidClick: true,
        //显示的时间
        duration: 0,
      });
      this.axios({
        //请求类型
        method: "GET",
        //请求地址
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // console.log("商品详情 res=>", res);
          if (res.data.code === 600) {
            //处理备注信息
            let data = res.data.result[0];
            data.desc = data.desc.split(/\n/);
            // [
            //   {
            //     title:'温度',
            //     rules:['冷','热']
            //   }
            // ]
            //处理数据
            let rules = [];
            let ruleData = ["cream", "milk", "tem", "sugar"];
            ruleData.map((v) => {
              let r = {};
              r.title = data[v + "_desc"]; //{title:"温度"},{title:"糖"}
              r.currentIndex = 0;
              r.rule = []; //{title:"温度",rule:[]}...
              let ruleString = data[v].split("/"); //{title:"温度",rule:['冷','热']}...
              ruleString.map((o) => {
                if (!o == "") {
                  r.rule.push(o);
                }
              });
              if (r.rule.length > 0) {
                rules.push(r); //[{title:"温度",rule:['冷','热']},{}.{}]
              }
            });
            data.rules = rules;
            this.detailData = data;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("商品详情 err=>", err);
        });
    },
    //切换规格
    toggleRle(item, i) {
      item.currentIndex = i;
    },
    //收藏、取消收藏接口
    getLike() {
      //获取toke
      let tokenString = localStorage.getItem("_tk");
      //动态url
      let url = this.isLike ? "/notlike" : "/like";
      if (!tokenString) {
        this.$toast("请先登录！");
        //跳转到登陆页面
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        //请求类型
        method: "POST",
        //请求地址
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((res) => {
          //请求成功，返回数据
          console.log("收藏&取消收藏 res=>", res);
          this.$toast(res.data.msg);
          if (res.data.code === 700) {
            //非法token 跳转到登陆页
            this.$router.push({ name: "Login" });
          } else if (res.data.code === 800) {
            this.isLike = true;
          } else if (res.data.code === 900) {
            this.isLike = false;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("收藏&取消收藏 err=>", err);
        });
    },
    //查询收藏接口
    findLike() {
      //获取toke
      let tokenString = localStorage.getItem("_tk");
      if (!tokenString) {
        return;
      }
      this.axios({
        //请求类型
        method: "GET",
        //请求地址
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((res) => {
          // console.log("查询收藏 res=>", res);
          if (res.data.code === 700) {
            this.$toast(res.data.msg);
            this.$router.push({ name: "Login" });
          } else if (res.data.code === 1000 && res.data.result.length > 0) {
            this.isLike = true;
          }
        })
        .catch((err) => {
          console.log("查询收藏 err=>", err);
        });
    },
    //获取购物车商品条目
    getshopcartRows() {
      //获取toke
      let tokenString = localStorage.getItem("_tk");
      if (!tokenString) {
        return;
      }
      this.axios({
        //请求类型
        method: "GET",
        //请求地址
        url: "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          // console.log("查询购物车商品数量 res=>", res);
          if (res.data.code === 700) {
            this.$toast(res.data.msg);
            this.$router.push({ name: "Login" });
          } else if (res.data.code === 8000) {
            this.ShopCount = res.data.result;
          }
        })
        .catch((err) => {
          console.log("查询购物车商品数量 err=>", err);
        });
    },
    //添加商品购物车
    addshopcart() {
      //获取toke
      let tokenString = localStorage.getItem("_tk");
      if (!tokenString) {
        return this.$$router.push({ name: "Login" });
      }
      // 处理规格的数据
      let rule = this.detailData.rules.map((v) => {
        return v.rule[v.currentIndex];
      });
      rule = rule.join("/");
      this.axios({
        //请求类型
        method: "POST",
        //请求地址
        url: "/addShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          pid: this.pid,
          count: this.proCount,
          rule,
        },
      })
        .then((res) => {
          console.log("加入购物车 res=>", res);
          if (res.data.code === 700) {
            this.$toast(res.data.msg);
            this.$router.push({ name: "Login" });
          } else if (res.data.code === 3000 && res.data.status === 1) {
            this.$toast(res.data.msg);

            this.ShopCount++;
          } else {
            this.$$toast("购物袋已存在该商品，商品数量已更新");
          }
        })
        .catch((err) => {
          console.log("加入购物车 err=>", err);
        });
    },
  },
};
</script>

<style>
</style>