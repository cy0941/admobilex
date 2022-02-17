<template>
  <!-- <a-spin :spinning="loading && !Transition"> -->
    <div id="home" ref="home">
      <a-layout id="layout">
        <a-spin :spinning="loadingLead">
        <div class="lead" v-if="showMasking" @click.self="goNextStep()">
            <div class="appNote" v-if="leads==1">
                <p style="font-size:16px;">{{$t('home.addAppAndAdUnit')}}</p>
                <div class="footerBtn">
                  <span style="font-weight:700;" @click="skip">{{$t('home.Skip')}}</span>
                  <span style="font-weight:700;" @click="nextStep(2)">{{$t('home.NextStep')}}</span>
                </div>
                <div class="triangles"></div>
            </div>
            <div class="changeVolume" v-if="leads==2">
                <p style="font-size:16px;">{{$t('home.createCrossPromotionAndCreateive')}}</p>
                <div class="footerBtn">
                  <span style="font-weight:700;" @click="skip">{{$t('home.Skip')}}</span>
                  <span style="font-weight:700;" @click="nextStep(3)">{{$t('home.NextStep')}}</span>
                </div>
                <div class="triangles"></div>
            </div>
            <div class="reportForm" v-if="leads==3">
                <p style="font-size:16px;">{{$t('home.reportContent')}}</p>
                <div class="footerBtn">
                  <span style="font-weight:700;" @click="skip">{{$t('home.Skip')}}</span>
                  <span style="font-weight:700;margin-right:20px;" @click="nextStep(4)">{{$t('home.NextStep')}}</span>
                </div>
                <div class="triangles"></div>
            </div>
            <div class="personalCenter" v-if="leads==4">
                <p style="font-size:16px;">{{$t('home.accountInformation')}}</p>
                <div class="footerBtn">
                  <span style="font-weight:700;" @click="skip">{{$t('home.Skip')}}</span>
                  <span style="font-weight:700;" @click="nextStep(5)">{{$t('home.NextStep')}}</span>
                </div>
                <div class="triangles"></div>
            </div>
        </div>
        </a-spin>
        <a-layout-sider
          class="sider"
          :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }"
        >
          <div class="sider-header" @click="goIndex">
            <a-image :src="LogoUrl" :width="40" :height="40"  :preview="false" fallback="../assets/fallback.png"></a-image>
            <span class="title">Admobilex</span>
          </div>
          <a-menu
            style="width: 230px"
            mode="inline"
            color="#7f857c"
            v-model:selectedKeys="selectedMenu"
            @click="clickMenu"
            @openChange="onOpenChange"
            :openKeys="openKeys"
          >
            <a-menu-item key="/hl/index">
              <template #icon>
                <HomeOutlined />
              </template>
              {{$t('home.home')}}
            </a-menu-item>

            <a-menu-item key="/hl/app"  :class="leads==1?'myapp':''" v-if="features.ALLOW_ACCESS_TO_APP">   <!--  -->
              <template #icon>
                <UnorderedListOutlined />
              </template>
              <a-popover title="" placement="top" :mouseEnterDelay="0.4" :mouseLeaveDelay="0">
                <template #content>
                  <div>{{$t('home.managementAppAndAdUnit')}}</div>
                </template>
                {{$t('home.myApp')}}
              </a-popover>
            </a-menu-item>

            <!-- <a-menu-item key="/hl/buyer" :class="leads==2?'myapp':''"  v-if="features.ALLOW_ACCESS_TO_EXCHANGE_ACTIVITIES">
              <a-popover title="" placement="top">
                  <template #content>
                      <div>{{$t('home.managementCrossPromotionAndCreative')}}</div>
                  </template>
                  <EditOutlined />{{$t('home.crossPromotionCenter')}}
              </a-popover>
            </a-menu-item>
            
            </a-menu-item> -->
            <a-sub-menu key="5" :class="leads==2?'myapp':''">
              <template #icon><PicCenterOutlined /></template>
              <template #title>
                
                <a-popover title="" placement="top" :mouseEnterDelay="0.4" :mouseLeaveDelay="0">
                  <template #content>
                      <div>{{$t('home.managementCrossPromotionAndCreative')}}</div>
                  </template>
                  <!-- <i class="iconfont icon">&#xec23;</i>-->
                  {{$t('home.CampaignCenter')}}
                </a-popover>
              </template>
              <a-menu-item key="/hl/buyer"  v-if="features.ALLOW_ACCESS_TO_EXCHANGE_ACTIVITIES">
                <template #icon><SwapOutlined /></template>
                {{$t('home.crossPromotionCenter')}}
              </a-menu-item>
              <a-menu-item  key="/hl/DirectCustomer">
                <template #icon><EditOutlined /></template>
                {{$t('home.DirCusCenter')}}
              </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="4" v-if="features.ALLOW_ACCESS_TO_MEDIATION">
              <template #icon><PicCenterOutlined /></template>
              <template #title>
                <a-popover title="" placement="top" :mouseEnterDelay="0.4" :mouseLeaveDelay="0">
                  <template #content>
                    <div>{{$t('home.managementNetworkAndAdSoureces')}}</div>
                  </template>
                  <!-- <i class="iconfont icon">&#xec23;</i> -->
                  
                  {{$t('home.mediationCenter')}}
                </a-popover>
              </template>
              <a-menu-item key="/hl/polyMerization">
                <!-- <i class="iconfont iconfont-weight">&#xe61a;</i> -->
                <template #icon>
                  <ClusterOutlined />
                </template>
                {{$t('home.mediation')}}
              </a-menu-item>
              <a-menu-item  key="/hl/advertisingPlatform">
                <!-- <i class="iconfont iconfont-weight">&#xe602;</i> -->
                <template #icon>
                  <AppstoreOutlined />
                </template>
                {{$t('home.network')}}
              </a-menu-item>
            </a-sub-menu>
            <!-- <a-sub-menu key="1" :class="leads==3?'myapp':''">
              <template #icon></template>
              <template #title>
                <a-popover title="" placement="top">
                  <template #content>
                      <div>{{$t('home.viewCrossPromotionResults')}}</div>
                  </template>
                  <BarChartOutlined />{{$t('home.report')}}
                </a-popover>           
              </template>
              <a-menu-item key="/hl/buyerReport">
                <LineChartOutlined />{{$t('home.crossPromotionReport')}}
              </a-menu-item>
              <a-menu-item key="/hl/materialReport">
                <LineChartOutlined />{{$t('home.creativeReport')}}
              </a-menu-item>
            </a-sub-menu> -->

            <a-menu-item key="/hl/MaterialLibrary">
              <!-- <i class="iconfont icon">&#xe60e;</i> -->
              <template #icon>
                <PictureOutlined />
              </template>
              {{$t('home.MaterialLibrary')}}
            </a-menu-item>
            <a-menu-item key="/hl/report" :class="leads==3?'myapp':''"  >  
              <template #icon>
                <LineChartOutlined />
              </template> 
              <a-popover title="" placement="top" :mouseEnterDelay="0.4" :mouseLeaveDelay="0">
                  <template #content>
                      <div>{{$t('home.viewCrossPromotionResults')}}</div>
                  </template>
                  {{$t('home.report')}}
              </a-popover>
            </a-menu-item>

            <a-sub-menu key="3" v-if="features.ALLOW_ACCESS_TO_TOOLS">         <!-- --------------------测试---v-if="features.ALLOW_ACCESS_TO_TOOLS"------------------- -->
              <template #icon><ToolOutlined /></template>
              <template #title>
                {{$t('home.tools')}}
              </template>
              <a-menu-item key="/hl/CreativeTemplate">
                <template #icon>
                  <FormatPainterOutlined />
                </template>
                {{$t('home.creativeTemplate')}}
              </a-menu-item>
              <a-menu-item key="/hl/VastExtensions">
                <template #icon>
                  <HighlightOutlined />
                </template>
                {{$t('home.vastTemplate')}}
              </a-menu-item>
            </a-sub-menu>
            
            <a-menu-item-group key="2">
              
              <template #title>{{$t('home.accountCenter')}}</template>
              <a-menu-item key="/hl/personalCenter" :class="leads==4?'myapp':''">
                <template #icon>
                  <UserOutlined />
                </template>
                <a-popover title="" placement="top"  :mouseEnterDelay="0.4" :mouseLeaveDelay="0">
                    <template #content>
                        <div>{{$t('home.managePersonalAccountInformation')}}</div>
                    </template>
                    {{$t('home.companyInfor')}}
                </a-popover>
              </a-menu-item>
            </a-menu-item-group>

          </a-menu>
        </a-layout-sider>
        <a-layout>
          <a-layout-header class="header" style="margin-left:280px">
            <div class="headerLeft">
              <a-button type="link" v-if="$route.query.close" class="shisu_text_btn breadcrumbs" @click="goPrevious($route.query.close)"><LeftOutlined />{{$t('home.back')}}</a-button>
              <a-breadcrumb>
                <a-breadcrumb-item>Admobilex</a-breadcrumb-item>
                <template #separator>
                  <RightOutlined />
                </template>
                <a-breadcrumb-item v-if="!$route.meta.title">
                  <a href="" @click.prevent="goObjectives($route.path)">{{$t($route.name)}}</a>
                </a-breadcrumb-item>
                <template #separator v-if="$route.meta.title">
                  <RightOutlined />
                </template>
                <a-breadcrumb-item v-if="$route.meta.title">
                  <a href="" @click.prevent="goObjectives($route.meta.content)">{{$t($route.meta.title)}}</a>
                </a-breadcrumb-item>
                <a-breadcrumb-item v-if="$route.meta.title">
                  <a href="" @click.prevent="goObjective()">{{$t($route.name)}}</a>
                </a-breadcrumb-item>
              </a-breadcrumb>
            </div>
            <div class="headerRgiht" ref="routerView">
              <!-- <a-input type="color" style="width:100px;" v-model="color" @change="topicsChange"></a-input> -->
              <a-select class="select--language" v-model:value="language" style="width: 100px" @change="onChangeLanguage">
                <a-select-option value="zh">
                  中文
                </a-select-option>
                <a-select-option value="en">
                  English
                </a-select-option>
              </a-select>
              <a-popover title="" placement="bottom" :mouseEnterDelay="0.4" :mouseLeaveDelay="0">
                  <template #content>
                      <div>{{$t('home.goToHelpCenter')}}</div>
                  </template>
                  <span :class="leads==5?'myapp doubts':'doubts'">
                    <QuestionCircleOutlined class="iconDoubt"  @click="goHelp"/>
                  </span>
                  <!-- <span :class="leads==5?'myapp doubts':'doubts'" @click="goHelp"></span> -->
              </a-popover>
              <div class="notificationCenter" v-if="leads==6">
                  <p style="font-size:16px;">{{$t('home.ImportantMessages')}}</p>
                  <div class="footerBtn">
                    <!-- <span style="font-weight:700;" @click="skip">{{$t('home.Skip')}}</span> -->
                    <span style="font-weight:700;" @click="nextStep(7)">{{$t('home.Completion')}}</span>
                  </div>
                  <div class="triangles"></div>
              </div>
              <div class="helpCenter" v-if="leads==5">
                  <p style="font-size:16px;">{{$t('home.questions')}}</p>
                  <div class="footerBtn">
                    <span style="font-weight:700;" @click="skip">{{$t('home.Skip')}}</span>
                    <span style="font-weight:700;" @click="nextStep(6)">{{$t('home.NextStep')}}</span>
                  </div>
                  <div class="triangles"></div>
              </div>
              <!-- 通知 -->
              <a-dropdown :getPopupContainer="getPopupContainer" :trigger="['click']" placement="bottomRight" class="notification" v-model:visible="visible" @visibleChange="visibleChange">
                <template #overlay>
                  <a-menu class="header_dropdown" @click="handleMenuClick">
                    <a-menu-item key="1">
                      <a-spin :spinning="loading2">
                      <div class="noNews" v-if="!notificationList.length">{{$t('home.noNotification')}}</div>
                      <div v-else class="newsList">
                        <div class="notificationOption">
                          <div v-if="!Details" class="youHave">{{$t('home.youHave')}}{{counts}}{{$t('home.unreadMessages')}}</div>
                          <a-button type="link" v-else class="shisu_text_btn"  @click="backDetails">{{$t('home.backTo')}}</a-button>
                          <a-button type="link" v-if="!Details" class="shisu_text_btn" @click="readAll">{{$t('home.oneClickRead')}}</a-button>
                        </div>
                        <div v-if="!Details">
                          <div class="notificationItem" v-for="item in notificationList" :key="item.id">
                            <div class="notificationTitle">
                              <div class="messageHeader" @click="goDetails(item)">
                                <span class="importants" v-if="!item.is_read&&item.message_level=='1'"><span class="importantIcon"></span>{{language=="zh"?item.title:item.title_en}}</span>
                                <span class="general" v-if="!item.is_read&&item.message_level=='0'"><span class="generalIcon"></span>{{language=="zh"?item.title:item.title_en}}</span>
                                <span class="reads" v-if="item.is_read"><span class="readIcon"></span>{{language=="zh"?item.title:item.title_en}}</span>
                              </div>
                              <div :class="item.is_read?'grey read':'read'" v-if="item.time<3600">{{item.time<300?$t('home.justNow'):`${Math.floor(item.time/60)}${$t('home.minutesAgo')}`}}</div>
                              <div :class="item.is_read?'grey read':'read'" v-else-if="item.time<86400">{{`${Math.floor(item.time/3600)}${$t('home.hoursAgo')}`}}</div>
                              <div :class="item.is_read?'grey read':'read'" v-else-if="item.time<2592000">{{`${Math.floor(item.time/86400)}${$t('home.daysAgo')}`}}</div>
                              <div :class="item.is_read?'grey read':'read'" v-else>{{$t('home.oneMonthAgo')}}</div>
                            </div>
                            <div :class="item.is_read?'grey notificationContent':'notificationContent'">{{language=="zh"?item.message:item.message_en}}</div>
                          </div>
                        </div>
                        <div v-else class="circulation">
                          <div class="contentDetails">
                            <div class="contentTitle">
                              <div class="importants" v-if="!description.is_read&&description.message_level=='1'"><span class="importantIcon"></span><span>{{language=="zh"?description.title:description.title_en}}</span></div>
                                <div class="general" v-if="!description.is_read&&description.message_level=='0'"><span class="generalIcon"></span><span>{{language=="zh"?description.title:description.title_en}}</span></div>
                                <div class="reads" v-if="description.is_read"><span class="readIcon"></span><span>{{language=="zh"?description.title:description.title_en}}</span></div>
                            </div>
                            <div  :class="description.is_read?'grey contents':'contents'"><pre>{{language=="zh"?description.message:description.message_en}}</pre></div>
                          </div>
                          <div class="contentFooter">
                            <p :class="description.is_read?'grey':''">{{$t('home.admobilex')}}</p>
                            <p :class="description.is_read?'grey':''">{{description.created_on}}</p>
                          </div>
                        </div>
                      </div>
                      </a-spin>
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button type="primary" class="notification_btn">
                  <a-badge :count="counts">
                    <a-popover title="" placement="bottom" :mouseEnterDelay="0.4" :mouseLeaveDelay="0">
                        <template #content>
                            <div>{{$t('home.youHave')}}{{counts}}{{$t('home.unreadNotification')}}</div>
                        </template>
                        <span :class="leads==6?'myapp notificationIcon':'notificationIcon'">
                          <BellOutlined class="iconNotification"/>
                        </span>
                        <!-- <span  :class="leads==6?'myapp notificationIcon':'notificationIcon'"></span> -->
                    </a-popover>
                  </a-badge>
                </a-button>
              </a-dropdown>
              <!-- 退出 -->
              <a-dropdown placement="bottomCenter" class="headerOperation">
                <template #overlay>
                  <a-menu class="header_dropdown">
                    <a-menu-item key="1" @click="logOut">
                      <LogoutOutlined />{{$t('home.cancellation')}}
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button type="primary">
                  {{UserName}}
                  <DownOutlined />
                </a-button>
              </a-dropdown>
              
            </div>
          </a-layout-header>
          <a-layout-content class="content" style="margin-left:280px">
            <a-spin :spinning="loading && !Transition">
              <!-- <transition
                name="transitionRouter"
                mode="in-out"
                @before-enter="beforeEnter"
                @after-enter="afterEnter"
              > -->
                <router-view ></router-view>
              <!-- </transition> -->
            </a-spin>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </div>
  <!-- </a-spin> -->
</template>
<script>
import { defineComponent, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import store from "@/store";
import { useI18n } from 'vue-i18n';
import { delCookie } from "@/utils/globalMethods";
import Config from "@/utils/globalConfig";
import { message} from 'ant-design-vue';
import {
  MailOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  RightOutlined,
  SettingOutlined,
  DownOutlined,
  UnorderedListOutlined,
  UserOutlined,
  BarChartOutlined,
  EditOutlined,
  LineChartOutlined,
  LogoutOutlined,
  LeftOutlined,
  CopyOutlined,
  FormatPainterOutlined,
  ToolOutlined,
  HighlightOutlined,
  HomeOutlined,
  ControlOutlined,
  ExclamationCircleOutlined,
  PictureOutlined,
  ClusterOutlined,
  PicLeftOutlined,
  SwapOutlined,
  PicCenterOutlined,
  QuestionCircleFilled,
  QuestionCircleOutlined,
  BellOutlined
} from "@ant-design/icons-vue";
export default defineComponent({
  name: "Home",
  components: {
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
    BarChartOutlined,
    LineChartOutlined,
    DownOutlined,
    UserOutlined,
    UnorderedListOutlined,
    EditOutlined,
    RightOutlined,
    LogoutOutlined,
    LeftOutlined,
    ClockCircleOutlined,
    CopyOutlined,
    FormatPainterOutlined,
    ToolOutlined,
    HighlightOutlined,
    HomeOutlined,
    ControlOutlined,
    ExclamationCircleOutlined,
    PictureOutlined,
    ClusterOutlined,
    PicLeftOutlined,
    SwapOutlined,
    PicCenterOutlined,
    QuestionCircleFilled,
    QuestionCircleOutlined,
    BellOutlined
  },
  setup() {
    const loading = computed(() => {
      return useStore().getters["Util/getLoading"];
    });
    const showMasking = computed(() => {
      return useStore().getters["Util/getSpinning"];
    });
    const selectedMenu = computed(() => {
      // return useStore().getters["Util/getOpenMenuKey"];
      return store.state.Util.openMenuKey;
    });
    const openKeys = computed(() => {
      // return useStore().getters["Util/getOpenMenuKey"];
      return store.state.Util.openKeys;
    });
    const language = computed(() => {
      
      return store.state.Util.language;
    });
    return {
      loading,
      showMasking,
      selectedMenu,
      openKeys,
      language
    };
  },
  data() {
    return {
      LogoUrl: "",
      UserName: "",
      Transition: false,
      features: "",
      visible: false,
      // showMasking:true,
      notificationList: [],
      counts: 0,
      userInfo: "",
      Details: false,
      description:"",
      loading2:false,
      leads:"",
      path:"",
      loadingLead:false,
      rootSubmenuKeys:["1","3","4"],
      changeVolume:this.$t('home.changeVolume'),
      reportForm:this.$t('home.reportForm'),
      personalCenter:this.$t('home.personalCenter'),
      color:""
    };
  },
  created() {
    let str=sessionStorage.getItem("language");
    if(str){
      store.dispatch("Util/Language",str);
      this.$i18n.locale =str;
    }
    //同步浏览器语言
    if(!str){
      if(navigator.language.includes('zh')){
        store.dispatch("Util/Language",'zh');
        this.$i18n.locale = this.language;
        sessionStorage.setItem('language','zh');
      }else if(navigator.language.includes('en')){
        store.dispatch("Util/Language",'en');
        this.$i18n.locale = this.language;
        sessionStorage.setItem('language','en');
      }
    }
    const { t } = useI18n()
    this.selectedMenu[0] = useRoute().path;

    //store.dispatch("Util/OpenMenuKey",[useRoute().path]);

    this.changeVolume=this.$t('home.changeVolume');
    this.reportForm=this.$t('home.reportForm');
    this.personalCenter=this.$t('home.personalCenter');
    
    this.LogoUrl = Config.IMG_URL;
    this.features = useStore().state["User"].userAccessControl;
    // this.userInfo = useStore().state["User"].userInfo;

    //新用户引导
    this.$req.getUserInfo().then(res=>{
      if(res.data.code==200){
        this.userInfo=res.data.data;
        this.UserName=res.data.data.username;
        this.getNotification({
          memberId: res.data.data.entity_id,
          language:this.language=="zh"?"cn":this.language
        });
        if(res.data.data.is_finished==="1"){
          store.dispatch("Util/ShowMasking",false);
        }else{
          store.dispatch("Util/ShowMasking",true);
        }
        if(res.data.data.position){
          this.leads=this.userInfo.position; 
        }else{
          this.leads=1;
        }
      }
    })
  },
  mounted() {
    window.setInterval(()=>{
      setTimeout(()=>{
        this.$req
        .getNotificationList({memberId:this.userInfo.entity_id,language:this.language=="zh"?"cn":this.language})
        .then(res => {
          if (res.data.code == 200) {
            this.counts = 0;
            if(res.data.data==null){
              this.notificationList=[]
            }else {
                this.notificationList = res.data.data;
              res.data.data.forEach(v => {
                if (!v.is_read) {
                  this.counts++;
                }
              });
              this.notificationList.map(value=>{
                value.time=(Date.parse(new Date())-Date.parse(value.created_on)-28800000)/1000;
                let t=Date.parse(value.created_on)+28800000;
                value.created_on=this.getTime(new Date(t)); 
              })
            }
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
      },0)
    },120000)
  },
  methods: {
    goIndex(){
      store.dispatch("Util/OpenKeys",['/hl/index']);
      store.dispatch("Util/OpenMenuKey",['/hl/index']);
      this.$router.push("/hl/index");

    },
    topicsChange(){
      window.less
        .modifyVars({
          '@primary-color': this.color,
        })
        .then(() => {
          console.log('成功')
        })
        .catch(error => {
          alert('失败')
          console.log(error)
        })
    },
    goObjectives(e){
      console.log(e,this.$route.meta.content);
      if(this.$route.meta.content){
        if(this.$route.meta.content=="/hl/buyer"||this.$route.meta.content=="/hl/polyMerization"){
          this.$confirm({
            title: this.$t('home.cancelNew'),
            content: this.$t('home.cancelNewContent'),
            cancelText:this.$t('home.cancel'),
            okText:this.$t('home.enter'),
            icon: <ExclamationCircleOutlined  />,
            onOk: () => {
              this.$router.push(this.$route.meta.content);
            },
            onCancel: () => {}
          });
        }else if(this.$route.meta.content=="/hl/DirectCustomer"){
                this.$confirm({
                  title: this.$t('home.cancelNew'),
                  content: this.$t('home.cancelNewContent'),
                  cancelText:this.$t('home.cancel'),
                  okText:this.$t('home.enter'),
                  icon: <ExclamationCircleOutlined  />,
                  onOk: () => {
                    this.$router.push(this.$route.meta.content);
                  },
                  onCancel: () => {}
                });
              } else{
                this.$router.push(this.$route.meta.content);
              }
        
        
      }else {
        console.log(e);
        
        this.$router.push(e);
      }
      
    },
    goNextStep(){
      this.nextStep(this.leads+1);
    },
    nextStep(e){
      store.dispatch("Util/Loading",true);
      let opt={
        user_id:this.userInfo.id,
        position:e,
        is_finished:e>6?1:0,
        member_id:this.userInfo.entity_id
      }
      this.$req.editLeadActive(opt).then(res=>{
        console.log(res);
        if(res.data.code==200){
            this.leads++;
            if(this.leads>6){
              store.dispatch("Util/ShowMasking",false);
            }
          store.dispatch("Util/Loading",false);
        }else{
          store.dispatch("Util/Loading",false);
        }
      })
      
      // let demos=document.getElementsByClassName("itemFlicker");
      // console.log(demos);
    },
    skip(){
      
      let opt={
        user_id:this.userInfo.id,
        position:7,
        is_finished:1,
        member_id:this.userInfo.entity_id
      }
      this.$req.editLeadActive(opt).then(res=>{
        console.log(res);
        if(res.data.code==200){
            this.leads=7;
            store.dispatch("Util/ShowMasking",false);
            
        }
      })
    },
    getPopupContainer(){
      return this.$refs.routerView;
    },
    handleMenuClick(e) {
      
      if (e.key == "dshgds") {
        this.visible = false;
      }
    },
    visibleChange(e){
      console.log(e);
      if(!e){
        // this.Details=true;
      }else {
        this.Details=false;
        this.getNotification({
          memberId:this.userInfo.entity_id,
          language:this.language=="zh"?"cn":this.language
        });
      }
    },
    readAll(){
      if(this.counts==0){
        message.success(this.$t('home.noUnreadMessages'));
      }else{
        let opt ={
          member_id:this.userInfo.entity_id
        }
        this.loading2=true;
        this.$req.readNotificationList(opt).then(res=>{
          if(res.data.code==200){
            message.success(this.$t('home.allMarked'));
            this.getNotification({
              memberId:this.userInfo.entity_id,
              language:this.language=="zh"?"cn":this.language
            });
            this.loading2=false;
          }else {
            message.error(this.$t('home.oneClickHasFailed'));
            this.loading2=false;
          }
        })
      }
    },
    goDetails(e){
      let opt = {
        member_id: this.userInfo.entity_id,
        id: e.id,
        type:e.type,
      };
      this.loading2=true;
      this.$req
        .editNotificationList(opt)
        .then(res => {
          if (res.data.code == 200) {
            this.description=e;
            this.Details=true;
            this.loading2=false;
            this.$req.getNotificationList({memberId:this.userInfo.entity_id,language:this.language=="zh"?"cn":this.language})
              .then(res => {
                if (res.data.code == 200) {
                  this.counts = 0;
                  if(res.data.data==null){
                    this.notificationList=[]
                  }else {
                      this.notificationList = res.data.data;
                    res.data.data.forEach(v => {
                      if (!v.is_read) {
                        this.counts++;
                      }
                    });
                    this.notificationList.map(value=>{
                      value.time=(Date.parse(new Date())-Date.parse(value.created_on)-28800000)/1000;
                      let t=Date.parse(value.created_on)+28800000;
                      value.created_on=this.getTime(new Date(t)); 
                    })
                  }
                } 
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            message.error(this.$t('home.unknownError'));
            this.loading2=false;
          }
        })
        .catch(err => {
          message.error(this.$t('home.unknownError'));
          this.loading2=false;
        });
      
    },
    getTime(dt){
        var year = dt.getFullYear(); //年
        var month = dt.getMonth() + 1; //月
        var date = dt.getDate(); //日
        var h= dt.getHours();//时
        var m=dt.getMinutes();//分
        var s=dt.getSeconds();//秒
        month = month < 10 ? "0" + month : month;
        date = date < 10 ? "0" + date : date;
        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        var str = year + "-" + month + "-" + date+" "+h+":"+m+":"+s;
        return str;
    },
    backDetails(){
        this.Details=false;
        this.getNotification({
        memberId:this.userInfo.entity_id,
        language:this.language=="zh"?"cn":this.language
        });
      
    },
    goHelp() {
      window.open("/helpcenter/Home", "_blank");
    },
    onOpenChange(openKeys){
        const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          store.dispatch("Util/OpenKeys",openKeys);
        } else {
          store.dispatch("Util/OpenKeys",latestOpenKey ? [latestOpenKey] : []);
        }
    },
    clickMenu(item) {
      store.dispatch("Util/OpenMenuKey",[item.key]);
      console.log(item.key);
      
      if (item.key !== window.location.pathname) {
        this.$router.push(item.key);
      }
    },
    getNotification(opt) {
      this.loading2=true;
      this.$req
        .getNotificationList(opt)
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            this.counts = 0;
            if(res.data.data==null){
                this.notificationList=[]
            }else {
                this.notificationList = res.data.data;
                res.data.data.forEach(v => {
                  if (!v.is_read) {
                    this.counts++;
                  }
                });
                this.notificationList.map(value=>{
                  value.time=(Date.parse(new Date())-Date.parse(value.created_on)-28800000)/1000;
                  let t=Date.parse(value.created_on)+28800000;
                  value.created_on=this.getTime(new Date(t)); 
                })
            }
            this.loading2=false;
          } else {
          
            this.loading2=false;
          }
        })
        .catch(err => {
          this.loading2=false;
        });
    },
    goPrevious(e) {
      console.log(e);
      
      if (this.$route.meta.content=="/hl/buyer"||this.$route.meta.content=="/hl/polyMerization") {
        this.$confirm({
          title: this.$t('home.cancelNew'),
          content: this.$t('home.cancelNewContent'),
          cancelText:this.$t('home.cancel'),
          okText:this.$t('home.enter'),
          icon: <ExclamationCircleOutlined  />,
          onOk: () => {
            this.$router.back();
          },
          onCancel: () => {}
        });
      } else if(this.$route.meta.content=="/hl/DirectCustomer") {
          this.$confirm({
            title: this.$t('home.cancelNew'),
            content: this.$t('home.cancelNewContent'),
            cancelText:this.$t('home.cancel'),
            okText:this.$t('home.enter'),
            icon: <ExclamationCircleOutlined  />,
            onOk: () => {
              this.$router.back();
            },
            onCancel: () => {}
          });
        }
        else {
          this.$router.back();
        }
    },
    beforeEnter() {
      this.Transition = true;
    },
    afterEnter() {
      this.Transition = false;
    },
    logOut() {
      delCookie();
      let history = window.history;
      let backlength = history.length;
      history.go(-backlength);
      window.location.replace(window.location.origin);
    },
    onChangeLanguage(e){
      console.log(e);
      store.dispatch("Util/Language",e);
      this.$i18n.locale = this.language;
      sessionStorage.setItem('language',e);
      console.log(this.$i18n.locale);
      console.log(this.language);
      
      
    }
  }
});
</script>
<style lang="less">
  @font-face {
    font-family: 'iconfont';  /* Project id 2853788 */
    src: url('//at.alicdn.com/t/font_2853788_ox4f21h7gno.woff2?t=1636339530237') format('woff2'),
        url('//at.alicdn.com/t/font_2853788_ox4f21h7gno.woff?t=1636339530237') format('woff'),
        url('//at.alicdn.com/t/font_2853788_ox4f21h7gno.ttf?t=1636339530237') format('truetype');
  }
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    margin-right: 10px;
    color:#000;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .iconfont-weight{
    font-weight: 600;
  }
  // #home .ant-menu-item:hover .iconfont-weight{
  //   color:rgb(100, 117, 199);
  // }
  // #home .ant-menu-item-selected .iconfont-weight{
  //   color:rgb(100, 117, 199);
  // }

  // #home .ant-menu-submenu-active .icon{
  //   color: rgb(100, 117, 199);
  // }

  // #home .ant-menu-item-active .icon{
  //   color: rgb(100, 117, 199);
  // }

  // #home .ant-menu-item-selected .icon{
  //   color: #fff !important;
  // }

  #home .select--language{
    margin-right: 8px;
    border: none;
    color: #7f857c;
    box-shadow:none!important;
      .ant-select-selector {
        border: none;
        background-color: transparent;
        .ant-select-selection-item{
          
          text-align: right;
        }
      
    }
  }
  .purples{
    cursor: pointer;
  }

</style>
<style lang="less" scoped>
#home {
  width: 100vw;
  height: 100vh;
  /deep/.ant-layout {
    // background: rgba(234, 245, 255, 1);
    .lead{
      position: fixed;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.1);
      z-index: 9999;
      .appNote,.changeVolume,.reportForm,.personalCenter{
        position: absolute;
        border-radius: 50% 95px;
        top: 10px;
        left: 245px;
        padding: 20px;
        background-color: #fff;
        box-shadow: #aaa 3px 3px 8px;
        max-width: 300px;
        width: fit-content;
        p{
          margin-bottom: 0;
        }
        .triangles{
          position: absolute;
          top: 88px;
          left: -21px;
          border-left: 40px solid;
          border-bottom: 15px solid;
          border-color: transparent transparent #fff transparent;
          transform: rotate(-43deg);
          filter: drop-shadow(#bbb -2px 3px 3px);
        }
        .footerBtn{
          display: flex;
          justify-content: right;
          span{
            display: inline-block;
            margin-left: 20px;
            color: #6475c7;
            cursor: pointer;
            &:hover{
              color: #8b9ade;
              text-decoration: underline;
            }
            &:active{
              color: #475ab8;
              text-decoration: underline;
            }
          }
        }

      }
      .changeVolume{
        top: 71px;
        .triangles{
          top:v-bind(changeVolume);
        }
      }
      .reportForm{
        max-width: 375px;
        border-radius: 32% 95px;
        top:133px;
        .triangles{
          top: v-bind(reportForm);
          left: -14px;
        }
      }
      .personalCenter{
        top:290px;
        .triangles{
          top: v-bind(personalCenter);
        }
      }
    }
  }
  /deep/.ant-layout-sider {
    width: 250px !important;
    max-width: 250px !important;
    min-width: 250px !important;
  }
  /deep/#layout {
    min-height: 100vh;
    .sider {
      border-radius: 0px 10px 10px 0px;
      background: #fff;
      .sider-header {
        padding: 30px 15px;
        color: #374948;
        box-sizing: border-box;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        .ant-image {
          vertical-align: super;
        }
        .title {
          margin-left: 10px;
        }
      }
      .myapp {
        border-top-right-radius: 0.1rem;
        border-bottom-right-radius: 0.1rem;
        animation: flicker 1.5s infinite;
      }
      @keyframes flicker {
        from {border: 2px solid #F27A7A;}
        to {border: 2px solid #fff;}
      }
      .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
      //   background-color: #fff;
      //   background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
      //   color: #fff;
        border-radius: 0 8px 8px 0;
      //   &:hover {
      //     background-image: linear-gradient(to right, #79b8f1 0%, #6577c8 100%);
      //     color: #fff;
      //   }
      }
      
      .anticon {
        margin-right: 8px;
        font-size: 16px;
      }
      .ant-menu-submenu-selected.ant-menu-submenu-open,
      .ant-menu-submenu-open {
        // background: rgba(234, 245, 255, 1);
        border-radius: 0 0 8px 0;
        .ant-menu-submenu-title {
          border-radius: 0 8px 0 0;
          // color: #fff;
          // background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
          // i {
          //   color: #fff;
          // }
        }

        .ant-menu-sub.ant-menu-inline {
          // background: rgba(234, 245, 255, 1);
          border-radius: 0 0 8px 0;
        }
        // .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
        //   background: transparent;
        //   background-image: none;
        //   color: #6475c7;
        // }
      }
      .ant-menu-item-group-title {
        padding-left: 24px;
      }
      // .ant-menu-light .ant-menu-item:hover,
      // .ant-menu-light .ant-menu-item-active,
      // .ant-menu-light .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
      // .ant-menu-light .ant-menu-submenu-active,
      // .ant-menu-light .ant-menu-submenu-title:hover {
      //   color: #6577c8;
      // }
      .ant-menu-submenu-selected {
        .ant-menu-submenu-title {
          // color: #fff;
          border-radius: 0 8px 8px 0;
        //   background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
        //   i {
        //     color: #fff;
        //   }
        //   &:hover {
        //     color: #fff;
        //   }
        }
        // .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
        //   background: transparent;
        //   background-image: none;
        //   color: #6475c7;
        // }
      }
      // .ant-menu-submenu-inline.ant-menu-submenu-selected {
      //   .ant-menu-submenu-title {
      //     &:hover {
      //       color: #fff;
      //     }
      //   }
      // }
      // .ant-menu-submenu-inline.ant-menu-submenu-open {
      //   .ant-menu-submenu-title {
      //     &:hover {
      //       color: #fff;
      //     }
      //   }
      // }
    }
    pre {
      white-space: pre-wrap; /* css-3 */
      white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
      white-space: -pre-wrap; /* Opera 4-6 */
      white-space: -o-pre-wrap; /* Opera 7 */
      word-wrap: break-word; /* Internet Explorer 5.5+ */
      word-break:normal;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol','Noto Color Emoji';
    }
    
    
    .header {
      background: #fff;
      margin: 20px 30px;
      border-radius: 10px;
      display: flex;
      font-size: 16px;
      font-weight: 700;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      .headerLeft {
        display: flex;
        align-items: baseline;
        // span {
        //   color: #3c56cc;
        //   cursor: pointer;
        //   &:hover {
        //     color: #8ca2e6;
        //   }
        //   &:active {
        //     color: #182480;
        //   }
        // }
        .breadcrumbs{
          font-weight: 700;
          font-size: 14px;
          margin-right: 24px!important;
          span:last-child{
            margin-left: 0!important;
          }
        }
        /deep/.ant-breadcrumb {
          line-height: 64px;
          vertical-align: middle;
        }
        .ant-breadcrumb a:hover{
          color: #3c56cc;
        }
        .ant-breadcrumb span:last-child a:hover {
          color: #7f857c !important;
        }
        /* .ant-breadcrumb .ant-breadcrumb-link a {
          color: #6577c8;
        }
        .ant-breadcrumb .ant-breadcrumb-link a:hover {
          color: #8b9ade;
        }
        .ant-breadcrumb span:last-child a {
          color: #7f857c !important;
        }
        .ant-breadcrumb span:last-child a:hover {
          color: #6577c8 !important;
        } */
        // .ant-breadcrumb .ant-breadcrumb-link a {
        //   color: #6577c8;
        // }
        // .ant-breadcrumb .ant-breadcrumb-link a:hover {
        //   color: #8b9ade;
        // }
        // .ant-breadcrumb span:last-child a {
        //   color: #7f857c !important;
        // }
        // .ant-breadcrumb span:last-child a:hover {
        //   color: #6577c8 !important;
        // }
      }
      .headerRgiht {
        position: relative;
        display: flex;
        align-items: center;
        .helpCenter,.notificationCenter{
          width: 1000px;
          position: absolute;
          border-radius: 50% 95px;
          top: 90px;
          left: 65px;
          padding: 20px;
          background-color: #fff;
          box-shadow: #aaa 3px 3px 8px;
          max-width: 230px;
          z-index: 10000;
          p{
            margin-bottom: 0;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
          }
          .triangles{
            position: absolute;
            top: -25px;
            left: 95px;
            border-left: 40px solid;
            border-bottom: 15px solid;
            border-color: transparent transparent #fff transparent;
            transform: rotate(80deg);
            filter: drop-shadow(#bbb -2px 3px 3px);
          }
          .footerBtn{
            display: flex;
            justify-content: right;
            line-height: 22px;
            font-size: 14px;
            font-weight: 400;
            span{
              display: inline-block;
              margin-left: 20px;
              color: #6475c7;
              cursor: pointer;
              &:hover{
                color: #8b9ade;
                text-decoration: underline;
              }
              &:active{
                color: #475ab8;
                text-decoration: underline;
              }
            }
          }

        }
        .helpCenter{
          left: 18px;
        }
        .doubts {
          display: inline-block;
          width: 26px;
          height: 64px;
          line-height: 64px;
          margin-right: 20px;
          text-align: center;
          // background: url("//console-style.hl.com/images/dspcom/u183.svg")
          //   no-repeat;
          // background-size: 16px 16px;
          // background-position:5px 25px;
        }
        // .doubts:hover {
        //   background: url("//console-style.hl.com/images/dspcom/u182.svg")
        //     no-repeat;
        //   background-size: 16px 16px;
        //   background-position:5px 25px;
        // }
        .iconDoubt{
          font-size: 16px;
          &:hover{
            opacity: .7;
          }
        }
        .myapp {
          animation: flicker 1.8s infinite;
        }
        @keyframes flicker {
          from {border: 2px solid #F27A7A;}
          to {border: 2px solid #fff;}
        }
        .notification_btn{
            box-shadow: none!important;
          }
        .notification {
          background-color: #fff;
          border-color: transparent;
          margin-right: 10px;
          height: 64px;
          padding: 0;
          .ant-badge-count{
            top: 20px;
            right: 5px;
          }
          .notificationIcon {
            display: inline-block;
            width: 26px;
            height: 64px;
            line-height: 64px;
            &:hover{
              opacity: .7;
            }
            // background: url("//console-style.hl.com/images/dspcom/u127.svg")
            //   no-repeat;
            // background-size: 16px 17px;
            // background-position:5px 23px;
          }
          // .notificationIcon:hover {
          //   background: url("//console-style.hl.com/images/dspcom/u126.svg")
          //     no-repeat;
          //   background-size: 16px 17px;
          //   background-position:5px 23px;
          // }
          .iconNotification{
            font-size: 20px;
          }
        }
        .headerOperation {
          margin-left: 16px;
        }
      }
      
    }

    .content {
      background: transparent;
      margin: 0px 30px 20px;
      scroll-behavior: auto;
      input::-webkit-input-placeholder {
        color: #757575;
      }
      .ant-pagination {
        display: flex;
        justify-content: flex-end;
        /* margin-top: 20px;
        .ant-pagination-prev,
        .ant-pagination-next {
          width: 30px;
          height: 30px;
          line-height: 30px;
          .ant-pagination-item-link {
            border-radius: 8px;
            background-color: #eaf5ff;
            border: none;
            .anticon-left,
            .anticon-right {
              color: #6577c8;
            }
          }
        }
        .ant-pagination-options-size-changer {
          margin-top: 0;
          .ant-select-selector {
            height: 30px;
            background-color: #fff;
            border-radius: 8px;
            &:hover {
              border-color: #6577c8;
            }
          }
        }
        .ant-pagination-options-quick-jumper {
          height: 30px;
          line-height: 30px;
          input {
            border-radius: 5px;
            height: 30px;
            &:hover {
              border-color: #6577c8;
            }
            &:focus {
              border-color: #6577c8;
            }
          }
        }
        .ant-pagination-item {
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 8px;
          &:hover {
            border-color: #6577c8;
            a {
              color: #6577c8;
            }
          }
        }
        .ant-pagination-item-active {
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 8px;
          background-color: #6577c8;
          border: none;
          a {
            color: #fff;
          }
        } */
      }
    }
  }
}
/deep/.ant-dropdown-placement-bottomRight {
  // border-radius: 10px;
  // overflow: hidden;
  // box-shadow: 0 2px 8px rgb(0 0 0 / 15%)!important;
  .ant-dropdown-menu{
    overflow: hidden;
  }
  .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title {
    white-space: normal;
  }
  .ant-dropdown-menu-item {
    max-width: 450px;
    padding-right: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    overflow-y: auto;
    overflow-x:hidden;
    cursor: default;
    word-wrap:break-word;
    word-break:break-all;
  }
  .ant-dropdown-menu-item:hover {
    background-color: #fff;
  }
}
.noNews {
  width: 300px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: #ccc;
}
.newsList {
  width: 370px;
  max-width: 370px;
  max-height: 450px;
  padding-right: 10px;
  // overflow: auto;
  // overflow-y:scroll;
  // overflow-x:hidden;
  border-bottom: 1px solid #ccc;
  &:last-child {
    border: none;
  }
  .notificationOption {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    .youHave{
      display: flex;
      align-items: center;
    }
  }
  .circulation{
    width: 100%;
    word-wrap:break-word;
    word-break:break-all;
  }
  .contentDetails {
    margin-top: 6px;
    .contentTitle {
      color: #73acf6;
      font-size: 14px;
      word-break:normal;
      .importants{
          color: red;
          width: 100%;
          word-break:normal;
        }
        .general{
          color: #73acf6;
          width: 100%;
          word-break:normal;
        }
        .reads{
          color: #aaa;
          width: 100%;
          word-break:normal;
        }
        .importantIcon{
            display: inline-block;
            margin-right: 10px;
            width: 16px;
            height: 14px;
            background: url("//console-style.hl.com/images/dspcom/u233.svg")no-repeat;
            background-size: 16px 14px;
        }
        .generalIcon{
            display: inline-block;
            margin-right: 10px;
            width: 16px;
            height: 14px;
            background: url("//console-style.hl.com/images/dspcom/u228.svg")no-repeat;
            background-size: 16px 14px;
        }
        .readIcon{
            display: inline-block;
            margin-right: 10px;
            width: 16px;
            height: 16px;
            background: url("//console-style.hl.com/images/dspcom/u240.svg")no-repeat;
            background-size: 16px 16px;
        }
    }
    .contents {
      font-size: 14px;
      word-wrap:break-word;
      word-break:break-all;
    }
  }
  .contentFooter {
    margin-top: 10px;
    p {
      margin-bottom: 0;
    }
  }
  .notificationItem {
    max-width: 370px;
    padding-left: 10px;
    // padding-right: 10px;
    padding-top: 6px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    .notificationType {
      font-size: 16px;
      font-weight: 400;
      margin-bottom: 5px;
      p {
        margin-bottom: 0;
      }
    }
    .notificationTitle {
      // font-weight: 700;
      font-size: 14px;
      color: #000;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      .messageHeader {
        width: 240px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .importants{
          color: red;
          &:hover{
            text-decoration: underline;
          }
        }
        .general{
          color: #73acf6;
          &:hover{
            text-decoration: underline;
          }
        }
        .reads{
          color: #aaa;
          &:hover{
            text-decoration: underline;
          }
        }
        .importantIcon{
            display: inline-block;
            margin-right: 10px;
            width: 16px;
            height: 14px;
            background: url("//console-style.hl.com/images/dspcom/u233.svg")no-repeat;
            background-size: 16px 14px;
        }
        .generalIcon{
            display: inline-block;
            margin-right: 10px;
            width: 16px;
            height: 14px;
            background: url("//console-style.hl.com/images/dspcom/u228.svg")no-repeat;
            background-size: 16px 14px;
        }
        .readIcon{
            display: inline-block;
            margin-right: 10px;
            width: 16px;
            height: 16px;
            background: url("//console-style.hl.com/images/dspcom/u240.svg")no-repeat;
            background-size: 16px 16px;
        }
      }
    }
    .notificationContent {
      font-size: 14px;
      margin-bottom: 5px;
      max-width: 350px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 5px;
    }
  }
}
.grey{
  color: #aaa;
}
/deep/.header_dropdown {
  padding: 0;
}

// .transitionRouter-enter-active {
//   transition: all 1s;
// }
// .transitionRouter-enter-from{
//   transform: translate(100%,0);
// }
</style>
