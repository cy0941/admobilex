<template>
  <a-config-provider :locale="language === 'en' ? enUS : zhCN">
      <router-view v-if="isRouter"/>
  </a-config-provider>
</template>

<script>
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {defineComponent,computed} from "vue"
import request from "./utils/request.js"
import router from './router'
import store from "@/store"
export default defineComponent({
  setup(){ 
    const language = computed(() => {
      //return useStore().getters["Util/getOpenMenuKey"];getOpenKeys
      return store.state.Util.language;
    });
    return{
      language,
      zhCN,
      enUS
    }
  },
  // watch: {
  //   '$store.state.Util.language'(newVal,oldVal){
  //       console.log(newVal,oldVal);
  //       this.reload();
  //   }
  // },
  // provide(){
  //   reload:this.reload
  // },
  data(){
    return{
      isRouter:true,
    }
  },
  methods:{
    reload(){
      this.isRouter=false;
      this.$nextTick(()=>{
        this.isRouter=true;
      })
    }
  },
  created() {
    (function (win) {
      
      var tid;
      function refreshRem() {
        let designSize = 1920; // 设计图尺寸
        let html = document.documentElement;
        let wW = html.clientWidth; // 窗口宽度
        if (wW <= 1281) {
          wW = 1280;
        }
        let rem = (wW * 100) / designSize;
        document.documentElement.style.fontSize = rem + "px";
      }

      win.addEventListener(
        "resize",
        function () {
          clearTimeout(tid);
          tid = setTimeout(refreshRem, 300);
        },
        false
      );
      win.addEventListener(
        "pageshow",
        function (e) {
          if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
          }
        },
        false
      );
      refreshRem();
    })(window);
  },
});
</script>

<style>
html {
  font-size: 100px;
}
body {
  font-size: 0.14rem;
  overflow: overlay;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
}
</style>