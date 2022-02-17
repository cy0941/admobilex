import axios from "axios"
import { ElMessageBox } from "element-plus";
import { delCookie } from "@/utils/globalMethods.js";

axios.interceptors.response.use((res)=>{
    if(res.data.msg&&res.data.msg=="登录过期"){
        console.log(res.data.msg);
        let str=sessionStorage.getItem("language");
        ElMessageBox.confirm(str=='en'?'Your login has expired, please login again!':'您的登录已过期，请重新登录！', "", {
                title:str=='en'?'Login Expired':'登录过期',
                confirmButtonText: str=='en'?'OK':'确定',
                type: "",
                showClose: false,
                showCancelButton: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                closeOnHashChange: false
        }).then(()=> {
            delCookie();
            window.localStorage.clear();
            window.location.replace(window.location.origin);
        })
        return
    }

    return res
},(error)=>{
    console.log(error);
    return Promise.reject(error)
})

const http = (options) => {
    return new Promise((resolve, reject) => {
        axios({
            url: options.url,
            method: options.method || "get",
            data: options.data || {},
            params: options.params || {},
            headers: options.headers || {},
            timeout: 150000,
        }).then(res => resolve(res)).catch(err => reject(err))
    })
}
export default http