
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import store from "../store"

// import i18n from "../lang"
// const Home = ()=> import(/*webpackChunkName:"Home"*/'@/views/Home.vue');
// const App=()=> import(/*webpackChunkName:"AppTab"*/"@/views/App.vue");
// const Index = ()=> import(/*webpackChunkName:"Index"*/'@/views/Index.vue');
// const PersonalCenter = ()=> import(/*webpackChunkName:"PersonalCenter"*/"@/views/PersonalCenter.vue");
// const BuyerReport = () => import (/*webpackChunkName:"BuyerReport"*/'@/views/BuyerReport.vue');
// const Report =()=> import (/*webpackChunkName:"Report"*/'@/components/Report/Report.vue');
// const MaterialReport = () => import (/*webpackChunkName:"MaterialReport"*/'@/views/MaterialReport.vue');
// const AppDetail = () => import (/*webpackChunkName:"AppDetail"*/"@/components/APP/AppDetail.vue");
// const Buyer = () => import(/*webpackChunkName:"Buyer"*/"@/views/Buyer.vue");
// const CreateBuyer = () => import(/*webpackChunkName:"CreateBuyer"*/"@/components/Buyer/CreateBuyer.vue");
// const CreativeTemplate = () => import(/*webpackChunkName:"CreativeTemplate"*/"@/components/Template/CreativeTemplate.vue");
// const PolyMerization=()=>import(/*webpackChunkName:"PolyMerization"*/"@/components/Mediation/PolyMerization.vue");
// const AdvertisingPlatform=()=>import(/*webpackChunkName:"AdvertisingPlatform"*/"@/components/Mediation/AdvertisingPlatform.vue");
// const NewAdSource=()=>import(/*webpackChunkName:"NewAdSource"*/"@/components/Mediation/NewAdSource.vue");
// const ManageAdFeeds=()=>import(/*webpackChunkName:"ManageAdFeeds"*/"@/components/Mediation/ManageAdFeeds.vue");
// const VastCreateNew = () => import(/*webpackChunkName:"VastCreateNew"*/"@/components/Template/VastCreateNew.vue");
// const VastExtensions = () => import(/*webpackChunkName:"VastExtensions"*/"@/components/Template/VastExtensions.vue");
// const DirectCustomer = () => import(/*webpackChunkName:"DirectCustomer"*/"@/views/DirectCustomer.vue");
// const CreateDirCusGroup = () => import(/*webpackChunkName:"CreateDirCusGroup"*/"@/components/DirectCustomer/CreateDirCusGroup.vue");
// const CreateDirCusCampaign = () => import(/*webpackChunkName:"CreateDirCusCampaign"*/"@/components/DirectCustomer/CreateDirCusCampaign.vue");
// const CreateProduction = () => import(/*webpackChunkName:"CreateProduction"*/"@/components/DirectCustomer/CreateProduction.vue");
// const EditDirCusCampaign = () => import(/*webpackChunkName:"EditDirCusCampaign"*/"@/components/DirectCustomer/EditDirCusCampaign.vue");
// const MaterialLibrary = () => import(/*webpackChunkName:"MaterialLibrary"*/"@/views/MaterialLibrary.vue");

import Home from '@/views/Home.vue';
import App from "@/views/App.vue";
import Index from '@/views/Index.vue';
import PersonalCenter from"@/views/PersonalCenter.vue";
import BuyerReport from '@/views/BuyerReport.vue';
import Report from '@/components/Report/Report.vue';
import MaterialReport from '@/views/MaterialReport.vue';
import AppDetail from "@/components/APP/AppDetail.vue";
import Buyer from "@/views/Buyer.vue";
import CreateBuyer from "@/components/Buyer/CreateBuyer.vue";
import CreativeTemplate from "@/components/Template/CreativeTemplate.vue";
import PolyMerization from "@/components/Mediation/PolyMerization.vue";
import AdvertisingPlatform from "@/components/Mediation/AdvertisingPlatform.vue";
import NewAdSource from "@/components/Mediation/NewAdSource.vue";
import ManageAdFeeds from "@/components/Mediation/ManageAdFeeds.vue";
import VastCreateNew from "@/components/Template/VastCreateNew.vue";
import VastExtensions from "@/components/Template/VastExtensions.vue";
import DirectCustomer from "@/views/DirectCustomer.vue";
import CreateDirCusGroup from "@/components/DirectCustomer/CreateDirCusGroup.vue";
import CreateDirCusCampaign from "@/components/DirectCustomer/CreateDirCusCampaign.vue";
import CreateProduction from "@/components/DirectCustomer/CreateProduction.vue";
import EditDirCusCampaign from "@/components/DirectCustomer/EditDirCusCampaign.vue";
import MaterialLibrary from "@/views/MaterialLibrary.vue";
import NotFound404 from "@/pageNotExist/NotFound404.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/hl',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound404',
    component: NotFound404,
  },
  {
    path:"/hl",
    name:"换量平台",
    component:Home,
    children: [
      
      {
        path: 'index',
        name: 'home.home',
        component: Index,
      },
      {
        path: 'app',
        name: 'home.myApp',
        component: App,
        // beforeEnter: (to:any, from:any, next:any) => {
        //     setTimeout(() => {
        //         if (store.getters["User/getUserAccessControl"].ALLOW_ACCESS_TO_APP) {
        //             next()
        //         } else if (store.getters["User/getUserAccessControl"].ALLOW_ACCESS_TO_EXCHANGE_ACTIVITIES) {
        //             next("/hl/buyer")
        //         } else {
        //             next("/hl/buyerReport")
        //         }
        //     }, 0)
        // } 
      },
      {
        path: "appDetail",
        name: "home.appDetails",
        meta: { title: 'home.myApp',content:"/hl/app" },
        component: AppDetail
      },
      {
        path: "buyer",
        name: "home.crossPromotionCenter",
        component: Buyer,
        // beforeEnter: (to:any, from:any, next:any) => {
        //   setTimeout(() => {
        //       if (store.getters["User/getUserAccessControl"].ALLOW_ACCESS_TO_EXCHANGE_ACTIVITIES) {
        //           next()
        //       } else if (store.getters["User/getUserAccessControl"].ALLOW_ACCESS_TO_APP) {
        //           next("/hl/app")
        //       } else {
        //           next("/hl/buyerReport")
        //       }
        //   }, 0)
        // }
      },
      {
        path: "createBuyer",
        name: "home.newCrossPromotion",
        meta: { title: 'home.crossPromotionCenter',content:"/hl/buyer" },
        component: CreateBuyer
      },
      {
        path: "createBuyers",
        name: "home.editCrossPromotion",
        meta: { title: 'home.crossPromotionCenter',content:"/hl/buyer" },
        component: CreateBuyer
      },
      {
        path: 'personalCenter',
        name: 'home.companyInfor',
        component: PersonalCenter,
      },
      {
        path: 'buyerReport',
        name: 'home.crossPromotionReport',
        component: BuyerReport
      },
      {
        path: 'materialReport',
        name: 'home.creativeReport',
        component: MaterialReport
      }
      ,
      {
        path: 'report',
        name: 'home.report',
        component: Report
      }
      ,
      {
        path: 'polyMerization',
        name: 'home.mediation',
        component: PolyMerization,
        // beforeEnter: (to:any, from:any, next:any) => {
        //   store.commit('Temp/setLoading',true);
        //   setTimeout(() => {
        //     if (store.getters["User/getUserAccessControl"].ALLOW_ACCESS_TO_MEDIATION) {
        //       next()
        //       store.commit('Temp/setLoading',false);
        //     } else {
        //       next("/getlogin/login")
        //     }
        //   }, 0)
        // },
      },
      {
        path: 'advertisingPlatform',
        name: 'home.network',
        component: AdvertisingPlatform,
        // beforeEnter: (to:any, from:any, next:any) => {
        //   store.commit('Temp/setLoading',true);
        //   setTimeout(() => {
        //     if (store.getters["User/getUserAccessControl"].ALLOW_ACCESS_TO_MEDIATION) {
        //       next()
        //       store.commit('Temp/setLoading',false);
        //     } else {
        //       next("/getlogin/login")
        //     }
        //   }, 0)
        // },
      },
      /* 新建广告源 */
      {
        path: 'newAdSource',
        name: 'home.newAdSoureces',
        meta: { title: 'home.mediation',content:"/hl/polyMerization" },
        component: NewAdSource,
        // beforeEnter: (to:any, from:any, next:any) => {
        //   store.commit('Temp/setLoading',true);
        //   setTimeout(() => {
        //     if (store.getters["User/getUserAccessControl"].ALLOW_ACCESS_TO_MEDIATION) {
        //       next()
        //       store.commit('Temp/setLoading',false);
        //     } else {
        //       next("/getlogin/login")
        //     }
        //   }, 0)
        // },
      },
      /* 编辑广告源 */
      {
        path: 'EidtAdSource',
        name: 'home.editAdSoureces',
        meta: { title: 'home.mediation',content:"/hl/polyMerization" },
        component: NewAdSource,
        // beforeEnter: (to:any, from:any, next:any) => {
        //   store.commit('Temp/setLoading',true);
        //   setTimeout(() => {
        //     if (store.getters["User/getUserAccessControl"].ALLOW_ACCESS_TO_MEDIATION) {
        //       next()
        //       store.commit('Temp/setLoading',false);
        //     } else {
        //       next("/getlogin/login")
        //     }
        //   }, 0)
        // },
      },
      {
        path: 'manageAdFeeds',
        name: 'home.adSourecesManager',
        meta: { title: 'home.network',content:"/hl/advertisingPlatform" },
        component: ManageAdFeeds,
        // beforeEnter: (to:any, from:any, next:any) => {
        //   store.commit('Temp/setLoading',true);
        //   setTimeout(() => {
        //     if (store.getters["User/getUserAccessControl"].ALLOW_ACCESS_TO_MEDIATION) {
        //       next()
        //       store.commit('Temp/setLoading',false);
        //     } else {
        //       next("/getlogin/login")
        //     }
        //   }, 0)
        // },
      },
      {
        path: 'CreativeTemplate',
        name: 'home.creativeTemplate',
        component: CreativeTemplate
      },
      {
        path:'VastExtensions',
        name:'home.vastTemplate',
        component:VastExtensions,
        // beforeEnter: (to:any, from:any, next:any) => {
        //   store.commit('Temp/setLoading',true);
        //   setTimeout(() => {
        //     if (store.getters["User/getUserAccessControl"].ALLOW_ACCESS_TO_TOOLS) {
        //       next()
        //       store.commit('Temp/setLoading',false);
        //     } else {
        //       next("/getlogin/login")
        //     }
        //   }, 0)
        // },
      },
      {
        path:'VastCreateNew',
        name:'home.newVASTTemplate',
        component:VastCreateNew,
        // beforeEnter: (to:any, from:any, next:any) => {
        //   console.log('beforeEnter');
        //   store.commit('Temp/setLoading',true);
        //   setTimeout(() => {
        //       if (store.getters["User/getUserAccessControl"].ALLOW_ACCESS_TO_TOOLS) {
        //         next()
        //         store.commit('Temp/setLoading',false);
        //       } else {
        //           next("/getlogin/login")
        //       }
        //   }, 0)
        // },
      },
      {
        path: 'DirectCustomer',
        name: 'home.DirCusCenter',
        component: DirectCustomer
      },
      {
        path: 'CreateDirCusGroup',
        name: 'home.NewDirCusGroup',
        meta: { title: 'home.DirCusGroup',content:"/hl/DirectCustomer" },
        component: CreateDirCusGroup
      },
      {
        path: 'EidtCreateDirCusGroup',
        name: 'home.EditDirCusGroup',
        meta: { title: 'home.DirCusGroup',content:"/hl/DirectCustomer" },
        component: CreateDirCusGroup
      },
      {
        path: 'CreateDirCusCampaign',
        name: 'home.NewDirCusCampaigns',
        meta: { title: 'home.DirCusCampaigns',content:"/hl/DirectCustomer" },
        component: CreateDirCusCampaign
      },
      {
        path: 'CreateProduction',
        name: 'newCampaign.addCreative',
        component: CreateProduction,
        meta: { title: 'home.DirCusCampaigns',content:"/hl/DirectCustomer" },
      },
      {
        path: 'EditDirCusCampaign',
        name: 'home.EditDirCusCampaigns',
        meta: { title: 'home.DirCusCampaigns',content:"/hl/DirectCustomer" },
        component: EditDirCusCampaign
      },
      {
        path: 'MaterialLibrary',
        name: 'home.MaterialLibrary',
        component: MaterialLibrary
      },
    ],
    
  },
  {
    path: '/:pathMatch(.*)*',
    // redirect: '/hl/NotFound404'
    component: NotFound404,
  },
  
];
 
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// router.beforeEach((to:any, from:any, next:any) => {
//   console.log(to);
  
//})

// router.beforeEach((to, from, next) => {
//   console.log(to);
  
//   if (to.matched.length === 0) { // 如果未匹配到路由
//     next('/hl/NotFound404') 
//   } else {
//     next() // 如果匹配到正确跳转
//   }

// })

/* router.beforeEach((to, from, next) => {
  console.log("---------------------");
  console.log(to);
}) */


export default router