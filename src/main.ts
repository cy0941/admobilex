import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import inStallAntd from "@/plugins/antd.js";
import installElement from './plugins/element.js';
import request from "./utils/request.js";
import "@/assets/css/reset.css";
import "@/assets/css/index.css";
import "element-plus/lib/theme-chalk/el-icon.css";
import "element-plus/lib/theme-chalk/base.css";
import echarts from '@/plugins/echarts.js';
import { ElMessageBox } from "element-plus";
import { delCookie } from "@/utils/globalMethods.js";
import VueI18n from './lang'




const app = createApp(App);

inStallAntd(app);
installElement(app);


app.config.globalProperties.$req = request;
app.config.globalProperties.$echarts = echarts;

store.dispatch('User/reqUserInfo');
// router.beforeEach((to:any, from:any, next:any) => {
//     let str=sessionStorage.getItem("language");
//     console.log(window,1,str)
//     request.getUserInfo().then((res:any) => {
//         console.log(res,app);
//         if (res.headers["x-route"] === "/*") {
//             console.log(res);
//             ElMessageBox.confirm(str=='en'?'Your login has expired, please login again!':'您的登录已过期，请重新登录！', "", {
//                     title:str=='en'?'Login Expired':'登录过期',
//                     confirmButtonText: str=='en'?'OK':'确定',
//                     type: "",
//                     showClose: false,
//                     showCancelButton: false,
//                     closeOnClickModal: false,
//                     closeOnPressEscape: false,
//                     closeOnHashChange: false
//             }).then(()=> {
//                 delCookie();
//                 window.localStorage.clear();
//                 window.location.replace(window.location.origin);
//             })
//         }else{
//             next()
//         }
//     }).catch((errs:any)=>{
//        
//     })
// })

app.use(store).use(router).use(VueI18n).mount("#app");

// export default app;