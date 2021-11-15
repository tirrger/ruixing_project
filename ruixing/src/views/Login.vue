<template>
  <div class="login">
    <van-nav-bar
      left-text="返回"
      right-text="先逛一逛"
      left-arrow
      @click-right="$router.push({ name: 'Home' })"
    >
      <template #left>
        <div class="logo-box">
          <div class="logo"></div>
          <div class="logo-name">Luckin Coffee</div>
        </div>
      </template>
    </van-nav-bar>
    <!-- 欢迎-->
    <div class="welcome-box">
      <h2 class="welcome">欢迎回来!</h2>
      <p class="welcome-en">Please login to your accounts</p>
    </div>
    <!-- 用户登录 -->
    <van-form>
      <van-field
        v-model="userLoginInfo.phone"
        name="手机号"
        label="手机号"
        placeholder="手机号"
      />
      <van-field
        v-model="userLoginInfo.password"
        :type="loginPwsShow ? '' : 'password'"
        name="密码"
        label="密码"
        placeholder="密码"
        :right-icon="loginPwsShow ? 'eye-o' : 'closed-eye'"
        @click-right-icon="loginPwsShow = !loginPwsShow"
      />
      <div class="forget">
        <span>忘记密码</span>
      </div>
      <div class="vant-btn">
        <van-button
          round
          block
          type="info"
          color="#0b34ba"
          native-type="submit"
          @click="userLogin"
          >登录</van-button
        >
      </div>
      <div class="vant-btn register-btn">
        <van-button round block type="default" @click="registerShow = true"
          >注册</van-button
        >
      </div>
    </van-form>
    <!-- 注册弹出层 -->
    <van-popup v-model="registerShow" position="bottom" closeable>
      <div class="register-title">注册</div>
      <van-form>
        <van-field
          v-model="userRegisterInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="11位手机号"
        />
        <van-field
          v-model="userRegisterInfo.nickName"
          name="昵称"
          label="昵称"
          placeholder="1-10位昵称"
        />
        <van-field
          v-model="userRegisterInfo.password"
          :type="loginPwsShow ? '' : 'password'"
          name="密码"
          label="密码"
          placeholder="6-16位密码且以字母开头"
          :right-icon="loginPwsShow ? 'eye-o' : 'closed-eye'"
          @click-right-icon="loginPwsShow = !loginPwsShow"
        />
        <div class="vant-btn register">
          <van-button round block type="info" color="#0b34ba" @click="register"
            >注册</van-button
          >
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
//引入login样式
import "../assets/less/login.less";
import vaildForm from "../assets/js/vaildForm.js";
export default {
  data() {
    return {
      //显示隐藏登录密码
      loginPwsShow: false,
      //显示隐藏注册弹出层
      registerShow: false,
      //用户登录信息
      userLoginInfo: {
        phone: "",
        password: "",
      },
      //用户注册信息
      userRegisterInfo: {
        phone: "",
        nickName: "",
        password: "",
      },
    };
  },
  methods: {
    register() {
      //构造表单的验证信息
      let o = {
        //验证手机号码是否符合要求
        phone: {
          //获取手机号码
          value: this.userRegisterInfo.phone,
          //手机号验证错误提醒文本
          errorMsg: "手机号码格式不正确",
          //正则表达式验证手机号码是否符合要求
          reg: /^1[3-9]\d{9}$/,
        },
        nickName: {
          value: this.userRegisterInfo.nickName,
          errorMsg: "昵称格式不正确",
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
        },
        password: {
          value: this.userRegisterInfo.password,
          errorMsg: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };
      //验证格式匹配，请求注册
      if (vaildForm.valid(o)) {
        var userInfo = Object.assign({}, this.userRegisterInfo);
        userInfo.appkey = this.appkey;
        console.log(userInfo);
        //参数序列化
        // {
        //   appkey:5515,
        //   nickName:4646,
        //   phone:161,
        //   password:15

        // }
        //?appkey=123&nickName=名字&phone=1&password=123
        // let paramsString = "";
        // for (let key in userInfo) {
        //   //
        //   paramsString += `${key}=${userInfo[key]}&`;
        // }
        // //String.slice(0,-1) 字符串的截取（从第0个索引开始截取，到倒数第一个结束，不包含）
        // paramsString = paramsString.slice(0, -1);
        // console.log(paramsString);
        // 显示加载中
        this.$toast.loading({
          //加载的文本
          message: "注册账号，加载中",
          //防穿透
          forbidClick: true,
          //显示的时间
          duration: 0,
        });

        this.axios({
          //请求类型
          method: "POST",
          //请求地址
          url: "/register",
          //接受的字符串类型
          data: userInfo,
        })
          .then((res) => {
            //请求成功，返回的数据
            console.log("res==>", res);
            if (res.data.code === 100) {
              //隐藏注册页面
              this.registerShow = false;
              this.$toast.clear();
            } else {
              this.$toast(res.data.msg);
            }
          })
          .catch((err) => {
            console.log("err==>", err);
          });
      }
    },
    userLogin() {
      //构造表单的验证信息
      let o = {
        //验证手机号码是否符合要求
        phone: {
          //获取手机号码
          value: this.userLoginInfo.phone,
          //手机号验证错误提醒文本
          errorMsg: "手机号码格式不正确",
          //正则表达式验证手机号码是否符合要求
          reg: /^1[3-9]\d{9}$/,
        },

        password: {
          value: this.userLoginInfo.password,
          errorMsg: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };
      //验证格式匹配，请求注册
      if (vaildForm.valid(o)) {
        var userInfo = Object.assign({}, this.userLoginInfo);
        userInfo.appkey = this.appkey;
        console.log(userInfo);

        // console.log(paramsString);
        // 显示加载中
        this.$toast.loading({
          //加载的文本
          message: "登陆中",
          //防穿透
          forbidClick: true,
          //显示的时间
          duration: 0,
        });

        this.axios({
          //请求类型
          method: "POST",
          //请求地址
          url: "/login",
          //接受的字符串类型
          data: userInfo,
        })
          .then((res) => {
            //请求成功，返回的数据
            console.log("res==>", res);
            if (res.data.code === 200) {
              //隐藏注册页面
              this.$toast.clear();
              // console.log('111111');
              localStorage.setItem("_tk", res.data.token);
              this.$router.push({ name: "Home" });
            } else {
              this.$toast(res.data.msg);
            }
          })
          .catch((err) => {
            console.log("err==>", err);
          });
      }
    },
  },
};
</script>