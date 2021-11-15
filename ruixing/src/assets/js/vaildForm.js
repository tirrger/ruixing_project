import Vue from 'vue'
import { Toast } from "vant";


class ValidForm {
    constructor() { }
    valid(o) {
        // console.log('验证表单', o);
        for(let key in o){
            // console.log('key==>',key); //健名
            // console.log('o[key]==>',o[key]);//键值
            //正则表达式，test(value)
            //value 匹配返回true,不匹配返回false
            if(!o[key].reg.test(o[key].value)){
                //验证失败
                Toast.fail(o[key].errorMsg);
                return false
            }
        }
        //验证成功
        // Toast.success('注册成功')
        return true;
    }

}
export default new ValidForm();