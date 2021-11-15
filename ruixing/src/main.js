import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {
  Button, NavBar, Form, Field, Icon, Popup, Toast,
  Tabbar, TabbarItem, Search, Swipe, SwipeItem,GoodsAction,
  GoodsActionIcon, GoodsActionButton ,Stepper,Empty,Checkbox, 
  CheckboxGroup,SwipeCell ,SubmitBar,Dialog
} from 'vant';
import 'lib-flexible/flexible'
import axios from 'axios'
import VueAxios from 'vue-axios'


//配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'
//设置Vue原型属性(全局变量)
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

//axios 拦截器
axios.interceptors.request.use(config => {
  console.log(config)
  //处理post请求参数，进行参数序列化;
  if (config.method === 'post') {
    let paramsString = "";
    for (let key in config.data) {
      //
      paramsString += `${key}=${config.data[key]}&`;
    }
    //String.slice(0,-1) 字符串的截取（从第0个索引开始截取，到倒数第一个结束，不包含）
    config.data = paramsString.slice(0, -1);
  }
  //必须返回config ,结束拦截，进行下一步
  return config;
})


Vue.config.productionTip = false
Vue.use(Button).use(NavBar).use(Form).use(VueAxios, axios)
  .use(Field).use(Icon).use(Popup).use(Toast).use(Tabbar)
  .use(TabbarItem).use(Search).use(Swipe).use(SwipeItem)
  .use(GoodsAction).use(GoodsActionIcon).use(GoodsActionButton)
  .use(Stepper).use(Empty).use(Checkbox).use(CheckboxGroup)
  .use(SwipeCell).use(SubmitBar).use(Dialog);




new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
