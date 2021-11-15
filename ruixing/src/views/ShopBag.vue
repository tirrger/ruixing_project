<template>
  <div class="ShopBag">
    <!-- 导航栏 -->
    <!-- 导航栏 -->
    <van-nav-bar
      title="购物袋"
      left-text="返回"
      :right-text="isEdit ? '编辑' : '完成'"
      @click-right="isEdit = !isEdit"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- 空状态-->
    <van-empty
      v-if="ShopcartData.length <= 0"
      description="购物袋空空如也，去逛一逛"
    >
      <van-button
        type="danger"
        round
        class="bottom-button"
        @click="$router.push({ name: 'Home' })"
        >去逛一逛</van-button
      >
    </van-empty>
    <!-- 购物袋内容盒子 -->
    <div class="ShopBag-box" v-else>
      <!-- 顶部背景图 -->
      <div class="bg-box">
        <img src="../assets/images/shopbag_bg.png" class="auto-img" alt="" />
      </div>
      <!-- 购物袋的内容 -->
      <div class="ShopBag">
        <div
          class="pro-item"
          v-for="(item, index) in ShopcartData"
          :key="index"
        >
          <van-swipe-cell>
            <div class="ShopBag-item">
              <div class="item-fl">
                <van-checkbox
                  v-model="item.isActive"
                  checked-color="#0b34ba"
                  @click="selectOne"
                ></van-checkbox>
              </div>
              <div class="item-fr">
                <div class="item-img">
                  <img
                    class="auto-img"
                    src="http://www.kangliuyong.com:10002/images/product_large/IMG_0384_02.jpg"
                    alt=""
                  />
                </div>
                <div class="item-info">
                  <div class="item-name">
                    <div class="name">{{ item.name }}</div>
                    <div class="rule">{{ item.rule }}</div>
                  </div>
                  <div class="item-ename">{{ item.enname }}</div>
                  <div class="item-price clearflx">
                    <div class="price fl">￥{{ item.price }}</div>
                    <div class="fr">
                      <van-stepper
                        v-model="item.count"
                        theme="round"
                        button-size="22"
                        disable-input
                        @change="modifyCount(item.count, item.sid)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                square
                type="danger"
                @click="deleteShopcart(index, item.sid)"
                text="删除"
              />
            </template>
          </van-swipe-cell>
        </div>

        <!-- 提交订单栏 -->
        <van-submit-bar
          :price="total"
          button-text="提交订单"
          v-if="isEdit"
          @submit="payinfo"
        >
          <van-checkbox
            v-model="isChecked"
            checked-color="#0b34ba"
            @click="allselect"
            >全选</van-checkbox
          >
        </van-submit-bar>
        <!-- 编辑删除 -->
        <van-submit-bar
          button-text="删除选择"
          @submit="deleteSelect"
          v-if="!isEdit"
        >
          <van-checkbox
            v-model="isChecked"
            checked-color="#0b34ba"
            @click="allselect"
            >全选</van-checkbox
          >
        </van-submit-bar>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/shopBag.less";
export default {
  data() {
    return {
      //全选
      isChecked: false,
      //购物袋数据
      ShopcartData: [],
      //是否处于编辑状态
      isEdit: true,
      //总价
      total: 0,
    };
  },
  created() {
    this.findAllShopcart();
  },
  methods: {
    //
    findAllShopcart() {
      //获取toke
      let tokenString = localStorage.getItem("_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

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
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();

          console.log("查询购物袋信息 res=>", res);
          if (res.data.code === 700) {
            this.$toast(res.data.msg);
            this.$router.push({ name: "Login" });
          } else if (res.data.code === 5000) {
            const result = [];
            this.result = res.data.result;
            this.result.map((v) => {
              v.isActive = false;
            });
            this.ShopcartData = this.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("查询购物袋信息 err=>", err);
        });
    },
    //全选
    allselect() {
      this.ShopcartData.map((v) => {
        v.isActive = this.isChecked;
      });
      this.sum();
    },
    //单选
    selectOne() {
      this.sum();
      for (let i = 0; i < this.ShopcartData.length; i++) {
        //只要有一个位false (未选中，则取消全选)
        if (!this.ShopcartData[i].isActive) {
          return (this.isChecked = false);
        }
      }
      //全选
      this.isChecked = true;
    },
    //删除多个
    deleteSelect() {
      let sid = [];
      let ishas = false;
      this.ShopcartData.map((v) => {
        if (v.isActive) {
          sid.push(v.sid);
          ishas = true;
        }
      });

      if (!ishas) {
        this.$toast("请选择删除的商品！");
      }

      //获取toke
      let tokenString = localStorage.getItem("_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

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
        method: "POST",
        //请求地址
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify([sid]),
        },
      })
        .then((res) => {
          this.$toast.clear();

          console.log("删除 res=>", res);
          if (res.data.code === 700) {
            this.$toast(res.data.msg);
            this.$router.push({ name: "Login" });
          } else if (res.data.code === 7000) {
            for (let i = 0; i < this.ShopcartData.length; i++) {
              if (this.ShopcartData[i].isActive) {
                this.ShopcartData.splice(i, 1);
                i--;
              }
            }
          }
          this.total = 0;
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("删除 err=>", err);
        });
    },
    //计算总价
    sum() {
      this.total = 0;
      this.ShopcartData.map((v) => {
        if (v.isActive) {
          this.total += v.price * v.count * 100;
        }
      });
    },
    //修改数量
    modifyCount(count, sid) {
      //获取toke
      let tokenString = localStorage.getItem("_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

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
        method: "POST",
        //请求地址
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          count,
          sid,
        },
      })
        .then((res) => {
          this.$toast.clear();

          console.log("修改商品数量 res=>", res);
          if (res.data.code === 700) {
            this.$toast(res.data.msg);
            this.$router.push({ name: "Login" });
          } else if (res.data.code === 6000) {
            this.sum();
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("修该商品数量 err=>", err);
        });
    },
    //删除
    deleteShopcart(index, sid) {
      //获取toke
      let tokenString = localStorage.getItem("_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

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
        method: "POST",
        //请求地址
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify([sid]),
        },
      })
        .then((res) => {
          this.$toast.clear();

          console.log("删除 res=>", res);
          if (res.data.code === 700) {
            this.$toast(res.data.msg);
            this.$router.push({ name: "Login" });
          } else if (res.data.code === 7000) {
            this.ShopcartData.splice(index, 1);
            this.sum();
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("删除 err=>", err);
        });
    },
    //提交订单
    payinfo() {
      this.$dialog
        .confirm({
          title: "订单",
          message: "是否提交订单",
        })
        .then(() => {
          // on confirm
          //获取toke
          let tokenString = localStorage.getItem("_tk");
          let sid =[];
          let ishas = false;
          if (!tokenString) {
            return this.$router.push({ name: "Login" });
          }
          this.ShopcartData.map((v) => {
            if (v.isActive) {
              sid.push(v.sid);
              ishas = true;
            }
          });

          if(!ishas){
            return this.$toast('请选择商品！')
          }

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
            method: "POST",
            //请求地址
            url: "/pay",
            data: {
              appkey: this.appkey,
              tokenString,
              sids: JSON.stringify(sid),
              phone:'13513513513',
              address:'广东省清远市清城区东城街道广东南华工商职业学院',
              receiver:'小伙'
            },
          })
            .then((res) => {
              this.$toast.clear();

              console.log("提交订单 res=>", res);
              if (res.data.code === 700) {
                this.$toast(res.data.msg);
                this.$router.push({ name: "Login" });
              } else if (res.data.code === 60000) {
                  this.$toast(res.data.msg);
                  setTimeout(() => {
                     this.$router.push({name:'Home'})
                  }, 3000);
                 
              }
            })
            .catch((err) => {
              this.$toast.clear();
              console.log("提交订单 err=>", err);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style>
</style>