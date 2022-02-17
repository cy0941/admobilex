<template>
  <div class="application" ref="application">
    <div class="app-header clearfix">
      <h1 class="app_title">{{$t('myApp.title')}}</h1>
      <div class="app_option">
        <!-- <a-input-search v-model:value="appSearchValue"  placeholder="应用名称..." /> -->
        <a-space :size="8">
          <a-select
            mode="multiple"
            v-model="searchAppName"
            style="width:450px;"
            :placeholder="$t('myApp.searchDefault')"
            showArrow
            option-label-prop="label"
            :maxTagCount="1"
            @change="changeSearch"
          >
            <template #suffixIcon>
              <SearchOutlined  />
            </template>
            <a-select-option
              v-for="item in app_names"
              :value="item.appInfo.id"
              :label="item.appInfo.app_official_name"
              :key="item.appInfo.id"
            >
              <span>
                <AppleFilled style="margin-right:5px;" v-if="item.appInfo.platform==1" />
                <AndroidFilled style="margin-right:5px;" v-else />
                {{item.appInfo.app_official_name}}
              </span>
            </a-select-option>
          </a-select>
          <a-select
            v-model:value="Platforms"
            style="width: 120px"
            :placeholder="$t('myApp.appPlatform')"
            @focus="focus"
            ref="select"
            @change="handleChange"
            allowClear
          >
            <a-select-option value="1">IOS</a-select-option>
            <a-select-option value="2">Android</a-select-option>
          </a-select>

          <a-button type="primary"  @click="appSearch">{{$t('myApp.search')}}</a-button>
        </a-space>
      </div>
      <div class="applicationBtn">
        <!-- <a-popconfirm
          :title="$t('home.clickAddApp')"
          :visible="!showMasking&&showTips"
          ok-text=""
          cancel-text=""
          :footer="false"
          placement="right"
        >
          
        </a-popconfirm> -->
        <a-popover placement="right" :getPopupContainer="()=>$refs.application" class="appNotes" :visible="!showMasking&&showTips">
          <template #content>
            <p>{{$t('home.clickAddApp')}}</p>
          </template>
          <a-button class="add-app-btn" type="primary" @click="showModal">{{$t('myApp.addApp')}}</a-button>
        </a-popover>
        <!-- <div class="appNote" v-if="!showMasking&&showTips">
          <p style="font-size:16px;">{{$t('home.clickAddApp')}}</p>
          <div class="triangles"></div>
          <span class="arrows"></span>
        </div> -->
        <!-- <div class="PlacementNote" v-if="!showMasking&&!showTips&&showPlacement">
          <p style="font-size:16px;">{{$t('home.clcikAdUnit')}}</p>
          <div class="triangles"></div>
          <span class="arrows"></span>
        </div> -->
      </div>
      <a-spin :spinning="appLoading">
        <el-table :data="list" ref="source" row-key="id" class="positioning"  @expand-change="expandChange"  style="width: 100%;min-height:5rem; margin-bottom:.2rem;" >
          <el-table-column prop="app_official_name" :label="$t('myApp.appName')" >
            <template #default="scope">
              <div style="display:flex;align-items:center;">
              <a-image
                class="shisu_table_image"
                :src="scope.row.app_icon_url"
                fallback="data:image/png;base64,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"
              />
              <el-tooltip  effect="dark" :content="scope.row.app_name" placement="top" :open-delay="200" :enterable="false">
                <span class="min">{{scope.row.app_name}}</span>
              </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="uuid" :label="$t('myApp.uuid')" width="150">
            <template #default="scope">
              <div class="uid">
                <el-tooltip  effect="dark" v-if="scope.row.uuid" :content="scope.row.uuid" placement="top" :open-delay="200" :enterable="false">
                  <span class="oneLine" v-if="scope.row.uuid">{{scope.row.uuid}}</span>
                </el-tooltip>
                <a-button type="link" size="small" class="shisu_text_btn editor"  @click="copyUuid(scope.row)"><DiffOutlined /></a-button>
              </div>
              
            </template>
          </el-table-column>
          <el-table-column prop="platform" :label="$t('myApp.platform')" width="150">
            <template #default="scope">
              <span>{{scope.row.platform==1?"iOS":"Android"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="app_campaign_count">
            <template #header>
              <span>{{$t('myApp.extension')}}</span>
              <a-popover title="" placement="top">
                <template #content>
                    <p>{{$t('myApp.goCrossPromotion')}}</p>
                </template>
                <QuestionCircleFilled class="iconNote" />
                <!-- <span class="doubt"></span> -->
              </a-popover>
            </template>
            <template #default="scope">
              <a-button size="small" class="general_btn" :disabled="scope.row.is_up=='0'" @click="goBuyer(scope.row.id,scope.row.app_name)">{{scope.row.app_campaign_count}}</a-button>
            </template>
          </el-table-column>
          <el-table-column prop="app_launch_num">
            <template #header>
              <span>{{$t('myApp.activities')}}</span>
              <a-popover title="" placement="top">
                <template #content>
                      <p>{{$t('myApp.appCrossPromotion')}}</p>
                  </template>
                  <QuestionCircleFilled class="iconNote" />
                  <!-- <span class="doubt"></span> -->
              </a-popover>
            </template>
          </el-table-column>
          <el-table-column :label="$t('myApp.AdvertisingUnit')" width="120" prop="app_placements_count">
            <template #default="scope">
              <span>{{scope.row.app_placements_count}}&emsp;{{$t('myApp.AdvertisingUnit')}}</span>
            </template>
          </el-table-column>
          <el-table-column type="expand" prop="app_placements_count" width="0" label>
              <template #default="scope" class="child_tabel">
                <a-spin :spinning="loading1">
                <el-table
                  :data="scope.row.appPlacements"
                  style="width: 100%;boxShadow:0 0 0.05rem rgba(0,0,0,.117647058823529);"
                  :header-cell-style="{ color: '#606060', background: '#fff' }"
                  class="expandTable"
                >
                  <el-table-column :label="$t('myApp.status')" prop="state" width="80" align="center">
                    <template #default="scope">
                      <span class="open" v-if="scope.row.state=='active'"></span>
                      <span class="pause" v-else></span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('myApp.AdUnitID')" prop="placement_ID" width="120"></el-table-column>
                  <el-table-column :label="$t('myApp.AdUnitName')" prop="placement_Name">
                    <template #default="scope">
                      <el-tooltip  effect="dark" :content="scope.row.placement_Name" placement="top" :open-delay="200" :enterable="false">
                        <span class="mins">{{scope.row.placement_Name}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('myApp.AdFormat')" prop="media_Type">
                    <template #default="scope">
                      <span>{{scope.row.media_Type=='other'?$t('myApp.vastVideo'):scope.row.media_Type=='banner'?$t('myApp.banner'):scope.row.media_Type=="interstitial"?$t('myApp.insertion'):$t('myApp.motivationalVideos')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('myApp.dailyImpsLimit')" prop="daily_budget_imps">
                    <template #default="scope">
                      <span>{{scope.row.daily_budget_imps==0?$t('myApp.noLimit'):scope.row.daily_budget_imps}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('myApp.activities')" prop="placement_launch_num"></el-table-column>
                  <el-table-column :label="$t('myApp.biddingAdSource')" prop="placement_launch_num">
                    <template #default="scope">
                      <a-button size="small" class="general_btn"  @click="goPolyMerization(scope.row.app_ID)">{{scope.row.placement_launch_num}}</a-button>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('myApp.operation')" prop>
                    <template #default="scope">
                      <a-button type="link" size="small" class="shisu_text_btn" @click="switchPlacement([scope.row.placement_ID,scope.row.state])">{{scope.row.state=='active'?$t('myApp.inActive'):$t('myApp.active')}}</a-button>
                      <a-button type="link" size="small" v-if="scope.row.media_Type=='other'&&features.ALLOW_ACCESS_ADD_VAST_PLACEMENT||scope.row.media_Type=='banner'&&features.ALLOW_ACCESS_ADD_BANNER_PLACEMENT||scope.row.media_Type=='interstitial'&&features.ALLOW_ACCESS_ADD_INTERSTITIAL_PLACEMENT||scope.row.media_Type=='stimulate'&&features.ALLOW_ACCESS_ADD_MOTIVATIONAl_VIDEOS_PLACEMENT" class="shisu_text_btn" @click="handleEdit(scope.row.placement_ID)">{{$t('myApp.edit')}}</a-button>
                      <a-popconfirm
                        :title="$t('myApp.deleteAdUnitContent')"
                        :ok-text="$t('myApp.enter')"
                        :cancel-text="$t('myApp.cancel')"
                        @confirm="handleDelete(scope.row.placement_ID)"
                      >
                        <a-button type="link" size="small" class="shisu_text_btn" danger>{{$t('myApp.delete')}}</a-button>
                      </a-popconfirm>
                    </template>
                  </el-table-column>
                  <template v-slot:empty >
                    <div class="icon-div"><i class="iconfont icon application-icon">&#xe635;</i></div>
                    <div class="empty-div">{{$t('myApp.noData')}}</div>
                    <div class="empty-div div--margin">{{$t('myApp.click')}}
                      <a-button type="link" class="shisu_btn--notPadding" @click="adshow = true">+{{$t('myApp.addAdUnit')}}</a-button>
                    </div>
                  </template>
                </el-table>
                </a-spin>
              </template>
          </el-table-column>
          <el-table-column prop label="" width="100">
            <template #default="scope">
              <a-button type="link" v-if="expandRow.length!=0&&expandRow[0].id==scope.row.id" size="small" class="shisu_text_btn purple" @click="expandLine(scope.row)">{{$t('myApp.collect')}}
                  <UpOutlined />
                </a-button>
                <a-button type="link" v-else  size="small" class="shisu_text_btn purple" @click="expandLine(scope.row)">{{$t('myApp.expand')}}
                  <DownOutlined />
                </a-button>
            </template>
          </el-table-column>
          <el-table-column prop :label="$t('myApp.operation')" >
            <template #default="scope">
              <a-button type="link" size="small" class="shisu_text_btn" @click="goDetail(scope.row.id)">{{$t('myApp.details')}}</a-button>
              <a-popover placement="top" :getPopupContainer="()=>$refs.application"  :visible="!showMasking&&!showTips&&showPlacement&&scope.$index==0">
                <template #content>
                  <p>{{$t('home.clcikAdUnit')}}</p>
                </template>
                <a-button type="link" size="small" class="shisu_text_btn" @click="addAdvertising(scope.row.id)" v-if="features.IS_ADD_AD_UNIT">{{$t('myApp.addAdUnit')}}</a-button>
              </a-popover>
              <a-button v-if="scope.row.is_up=='1'" type="link" size="small" class="shisu_text_btn" @click="goCreateBuyer(scope.row.id)">{{$t('myApp.newCrossPromotion')}}</a-button>
              <a-popconfirm
                :title="$t('myApp.deleteAdUnitContent')"
                :ok-text="$t('myApp.enter')"
                :cancel-text="$t('myApp.cancel')"
                @confirm="del_app(scope.row.id)"
              >
                <a-button type="link" size="small" class="shisu_text_btn" danger>{{$t('myApp.delete')}}</a-button>
              </a-popconfirm>
            </template>
          </el-table-column>  
          <template v-slot:empty >
            <div class="icon-div"><i class="iconfont icon application-icon">&#xe635;</i></div>
            <div class="empty-div">{{$t('myApp.noData')}}</div>
            <div class="empty-div div--margin">{{$t('myApp.click')}}<a-button type="link" class="shisu_btn--notPadding" @click="showModal">+{{$t('myApp.addApp')}}</a-button>，{{$t('myApp.uploadYourApp')}}</div>
          </template>
        </el-table>
      </a-spin>
      <a-pagination
        :total="total"
        show-quick-jumper
        show-size-changer
        :show-total="total => `${$t('myApp.total')} ${total} ${$t('myApp.article')}`"
        :page-size="pageSize"
        :page-size-options="pageSizeOptions"
        v-model:current="current_page"
        @change="PageCurrent"
        @showSizeChange="handleSizeChange"
      ></a-pagination>
    </div>

    <!-- 添加应用 -->
    <a-modal
      v-model:visible="visible"
      :getContainer="()=>$refs.application"
      :title="$t('myApp.addApp')"
      :width="700"
      class="addApplication"
      :footer="null"
    >
      <AddApp v-if="visible" ref="addAppRef" @addAppModalClose="onAddAppModalClose" app-info=""></AddApp>
    </a-modal>
    
    <!-- 添加/编辑广告单元 -->
    <a-modal
      v-model:visible="adshow"
      :getContainer="()=>$refs.application"
      class="adunits"
      :width="700"
      :title="iscompile?$t('myApp.editAdUnit'):$t('myApp.addAdUnit')"
      @ok="adUnit"
      @cancel="adClose"
    >
      <adUnitSetting v-if="adshow" ref="adunits" @advertisingUnit="advertisingUnit" :compile="compile"></adUnitSetting>
    </a-modal>
  </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>
import store from "@/store";
import { mapGetters, useStore } from "vuex";
import { defineComponent, ref, reactive ,computed} from "vue";
import { message} from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import adUnitSetting from "./adUnitSetting"; //添加编辑广告单元组件
import AddApp from "./AddApp"; //添加app组件
import {
  RightOutlined,
  DownOutlined,
  UpOutlined,
  ExclamationCircleOutlined,
  AppleOutlined,
  AndroidOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  QuestionCircleFilled,
  AndroidFilled,
  AppleFilled,
  DiffOutlined
} from "@ant-design/icons-vue";
export default defineComponent({
  name: "Apptable",
  components: {
    RightOutlined,
    DownOutlined,
    adUnitSetting,
    UpOutlined,
    ExclamationCircleOutlined,
    AppleOutlined,
    AndroidOutlined,
    SearchOutlined,
    QuestionCircleOutlined,
    QuestionCircleFilled,
    AndroidFilled,
    AppleFilled,
    DiffOutlined,
    AddApp
  },
  computed: {
    ...mapGetters({
      userInfo: "User/getUser",
      spinning: "Util/spinning"
    })
  },
  setup() {
    const { t } = useI18n();
    const showMasking = computed(() => {
      return useStore().getters["Util/getSpinning"];
    });
    let validatorurl = async (rule, value) => {
      let rex = new RegExp(
        "(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]"
      );
      if (!value) {
        return Promise.reject(t('myApp.ContentEmpty'));
      }
      if (!rex.test(value)) {
        return Promise.reject(t('myApp.correctAddress'));
      } else {
        return Promise.resolve();
      }
    };
    const formState = reactive({
      Platform: "0",
      appurl: ""
    });
    const rules = {
      appurl: [{ required: true, validator: validatorurl, trigger: "blur" }]
    };
    return {
      validatorurl,
      rules,
      formState,
      showMasking,
    };
  },
  // inject:['reload'],
  data() {
    return {
      visible: false,
      footer: null,
      expandindex: 3,
      adshow: false,
      Platforms: undefined,
      platforms:"",
      current_page: 1,
      pageSize: 10,
      loading1: false,
      searcAppId: [],
      searchAppName: [],
      total: 0,
      list: [],
      app_id: "",
      app_names: [],
      compile: "", //广告位ID
      iscompile: false,
      features: {},
      showTips:false,
      showPlacement:false,
      pageSizeOptions: ["10", "20", "50"],
      expand:this.$t('myApp.expand'),
      collect:this.$t('myApp.collect'),
      colors:"red",
      maxWidth:this.$t('myApp.maxWidth'),
      arrows:this.$t('myApp.arrows'),
      triangles:this.$t('myApp.triangles'),
      PlacementNote:this.$t('myApp.PlacementNote'),
      appLoading:false,
      value1:undefined,
      expandRow:[],
      addLoading:false,
      isAppBtn:false
    };
  },
  watch: {
    '$store.state.Util.language'(newVal,oldVal){
        console.log(newVal,oldVal);
        this.expand=this.$t('myApp.expand');
        this.collect=this.$t('myApp.collect');
        this.maxWidth=this.$t('myApp.maxWidth');
        this.arrows=this.$t('myApp.arrows');
        this.triangles=this.$t('myApp.triangles');
        this.PlacementNote=this.$t('myApp.PlacementNote')
    }
  },
  created() {

    store.dispatch("Util/Loading", true);
    this.$req.getUserInfo().then(res=>{
      
      if(res.data.code==200){
          res.data.data.feature_sets.map((_)=>{
              _.features.map((item)=>{
                  this.features[item.name] = item.value
              })
          });
          res.data.data.features.map((item) => {
              this.features[item.name] = item.value
          });
          console.log(this.features,"权限");
        if (this.features.ALLOW_ACCESS_TO_APP) {
          store.dispatch("Util/OpenKeys",['/hl/app']);
          store.dispatch("Util/OpenMenuKey",['/hl/app']);
          console.log(store.state.User.openKeys,store.state.Util.openMenuKey);
          // this.features = useStore().state["User"].userAccessControl;
          
          this.maxWidth=this.$t('myApp.maxWidth');
          this.arrows=this.$t('myApp.arrows');
          this.triangles=this.$t('myApp.triangles');
          this.PlacementNote=this.$t('myApp.PlacementNote');
          store.dispatch("Util/Loading", false);
          this.getAppList("app"); 
          this.getApp("app");
        } else if (this.features.ALLOW_ACCESS_TO_EXCHANGE_ACTIVITIES) {
          store.dispatch("Util/Loading", false);
            this.$router.push("/hl/buyer")
        } else {
          store.dispatch("Util/Loading", false);
          this.$router.push("/hl/buyerReport")
        }
      }else {
        store.dispatch("Util/Loading", false);
      }
    })
  },
  methods: {
    //复制应用ID
    copyUuid(e){
      console.log(e);
       var input = document.createElement("input");   // js创建一个input输入框
        input.value = e.uuid;  // 将需要复制的文本赋值到创建的input输入框中，this.ruleForm.url这个是我要复制的内容
        document.body.appendChild(input);    // 将输入框暂时创建到实例里面
        input.select();   // 选中输入框中的内容
        document.execCommand("Copy");   // 执行复制操作
        document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作
        message.success(this.$t('myApp.copySuccessful'));
    },
    //展开收起广告单元
    expandLine(row){
      console.log(row);
      
      let $table = this.$refs.source;
        this.list.map((item) => {
          if (row.id != item.id) {
            console.log(item,'item');
            
            $table.toggleRowExpansion(item, false);
          }
        })
        $table.toggleRowExpansion(row);
      
      console.log(this.expandRow);
      
    },
    expandChange(e,i){
      console.log(e,i);
      this.expandRow=i;
      this.app_id=i.id?i.id:'';
      
      // if(i.length){
      //     setTimeout(()=>{
      //       let emptys=document.getElementsByClassName("el-table__empty-text");
      //       console.log(emptys);
      //       if(emptys.length){
      //         for(var i=0;i<emptys.length;i++){
      //           emptys[i].innerHTML="+t('myApp.noData')+<p class='empty_p'>${t('myApp.click')}<i class='purple'>+${t('myApp.addAdUnit')}</i></p>";
      //           console.log(emptys[i]);
      //           emptys[i].addEventListener('click',(e)=>{
      //             console.log(e.target.nodeName);
      //             if(e.target.nodeName=="I"){
      //               this.adshow = true;
      //             }
      //           })
      //         }
      //       }
      //     },0)
      // }
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.visible = false;
    },
    handleChange(value) {
      this.platforms = value;
    },
    adClose() {
      if (this.iscompile) {
        this.compile = "";
      }
      this.iscompile = false;
    },
    changeSearch(e, b) {
      this.searcAppId = [];
      b.forEach(v => {
        this.searcAppId.push(v.key);
      });
    },
    handleEdit(e) {
      this.adshow = true;
      this.iscompile = true;
      this.compile = e;
      this.list.forEach((item, index) => {
        item.appPlacements.forEach((v, i) => {
          if (v.placement_ID == e) {
            this.app_id = item.id;
          }
        });
      });
    },
    //删除广告单元
    handleDelete(e) {
      console.log(this.$t("myApp.title"));
      let placementId = "";
      this.list.forEach((item, index) => {
        item.appPlacements.forEach((v, i) => {
          if (v.placement_ID == e) {
            placementId = item.id;
          }
        });
      });
      //var _that = this;
      this.loading1=true;
      let opt = {
        app_id: placementId,
        placement_ids: e
      };
      this.$req.Deleteplacement(opt).then(res => {
        if (res.data.code === 200) {
          message.success(this.$t("myApp.deleteSuccessful"));
          this.loading1=false;
          this.getAppList();
        } else {
          message.error(this.$t("myApp.unknownError"));
          this.loading1=false;
        } 
      });
      /* this.$confirm({
        title: this.$t("myApp.deleteAdUnit"),
        icon: <ExclamationCircleOutlined  />,
        content: this.$t("myApp.deleteAdUnitContent"),
        cancelText:this.$t('myApp.cancel'),
        okText:this.$t('myApp.enter'),
        onOk:()=> {
          this.loading1=true;
          let opt = {
            app_id: placementId,
            placement_ids: e
          };
          _that.$req.Deleteplacement(opt).then(res => {
            if (res.data.code === 200) {
              message.success(_that.$t("myApp.deleteSuccessful"));
              this.loading1=false;
              _that.getAppList();
            } else {
              message.error(_that.$t("myApp.unknownError"));
              this.loading1=false;
            }
          });
        },
        onCancel() {}
      }); */
    },

    // 获取所有APP
    getApp() {
      let opt = { name: "" };
      this.$req.appNameList(opt).then(res => {
        if (res.data.code === 200) {
          console.log(res.data.data);
          if (res.data.data) {
            this.app_names = res.data.data;
          } else {
            this.app_names = [];
          }
        }
      });
    },
    // 搜索应用的方法
    appSearch() {
      console.log(this.userInfo);
      this.current_page = 1;
      this.getAppList();
    },
    // 页码改变的事件
    PageCurrent(page) {
      this.current_page = page;
      console.log(this.platforms);
      this.getAppList();
    },
    //每页的条数
    handleSizeChange(val, page) {
      this.pageSize = page;
      this.currentPage = 1;
      this.getAppList();
    },
    focus(e) {
      console.log("focus", e);
    },
    onAddAppModalClose(isGetAppList) {
      //this.$refs.validation.resetFields();
      if(isGetAppList){
        this.getAppList();
      }
      this.visible=false;
    },
    addApp() {
      
      console.log("[][][][][]");
      console.log(this.$refs.addAppRef.formState);

      this.$refs.addAppRef.onSubmit();

      console.log(this.$refs.addAppRef.isSuccess);

      /* if(this.$refs.addAppRef.isSuccess){
        store.dispatch("Util/Loading", true);
        let opt = {
          platform: this.$refs.addAppRef.formState.platform,
          app_store: this.$refs.addAppRef.formState.appUrl,
          timezone: this.userInfo.timezone
        };
        this.$req.CreateApp(opt).then(res => {
            if (res.data.code === 200) {
              store.dispatch("Util/Loading", false);
              this.visible = false;
              message.success(this.$t("myApp.addSuccessful"));
              this.$refs.validation.resetFields();
              this.getAppList();
            } else {
              store.dispatch("Util/Loading", false);
              message.error(this.$t("myApp.addFailed"));
            }
          })
          .catch(err => {
            message.error(this.$t("myApp.unknownError"));
            store.dispatch("Util/Loading", false);
          });
      }else{
        store.dispatch("Util/Loading", false);
      } */
    },
    // 关闭添加/编辑广告单元弹窗
    adUnit() {
      this.$refs.adunits.advertisingUnit();
    },
    // 打开添加/编辑广告单元弹窗
    addAdvertising(e) {
      this.adshow = true;
      this.app_id = e;
    },
    // 添加编辑广告单元
    advertisingUnit(e) {
      if (!this.iscompile) {
        store.dispatch("Util/Loading", true);
        //添加广告单元
        console.log(e);
        let opt = {
          app_id: this.app_id,
          media_type: e.adTypen == 1 ? "banner" :e.adTypen==2?"other":e.adTypen==3?"interstitial":"stimulate",
          name: e.adName.trim(),
          width:e.adTypen == 1?e.placementWidth:"",
          height:e.adTypen == 1?e.placementHeight:"",
          add_size:e.addSizeList?1:0,
          state: e.active == 1 ? "active" : "inactive",
          placement_imps: e.count_radio == 1 ? 0 : e.count.trim(),
          placement_usage: e.count_radio == 2 && e.constant ? 1 : 0,
          // language_ids: e.language_id.join(","),
          // premium_user_type: e.paid == "全部" ? 2 : e.paid == "付费" ? 1 : 0
        };
        this.$req
          .Addplacement(opt)
          .then(res => {
            if (res.data.code == 200) {
              message.success(this.$t("myApp.addSuccessful"));
              this.adshow = false;
              store.dispatch("Util/Loading", false);
              
              this.getAppList();
            } else {
              message.success(this.$t("myApp.addFailed"));
              store.dispatch("Util/Loading", false);
            }
          })
          .catch(err => {
            store.dispatch("Util/Loading", false);
          });
      } else {
        //编辑广告单元
        store.dispatch("Util/Loading", true);
        let opt1 = {
          app_id: this.app_id,
          media_type: e.adTypen == 1 ? "banner" :e.adTypen==2?"other":e.adTypen==3?"interstitial":"stimulate",
          name: e.adName.trim(),
          id: this.compile,
          width:e.adTypen == 1?e.placementWidth:"",
          height:e.adTypen == 1?e.placementHeight:"",
          add_size:e.addSizeList?1:0,
          state: e.active == 1 ? "active" : "inactive",
          placement_imps: e.count_radio == 1 ? 0 : e.count.trim(),
          placement_usage: e.count_radio == 2 && e.constant ? 1 : 0,
          // language_ids: e.language_id.join(","),
          // premium_user_type: e.paid == "全部" ? 2 : e.paid == "付费" ? 1 : 0
        };
        this.$req
          .EditPlacement(opt1)
          .then(res => {
            if (res.data.code == 200) {
              message.success(this.$t("myApp.editSuccessful"));
              this.iscompile = false;
              this.adshow = false;
              let opt = {
                num_elements: this.pageSize,
                page: this.current_page,
                app_ids: this.searcAppId.length ? this.searcAppId.toString() : "",
                platform: this.platforms ? Number(this.platforms) : ""
              };
              let newPlacement = "";
              this.$req
                .getAppInfo(opt)
                .then(res => {
                  if (res.data.code == 200) {
                    res.data.data.app_list.forEach((item, index) => {
                      item.appPlacements.forEach((v, i) => {
                        if (v.placement_ID == this.compile) {
                          newPlacement = v;
                        }
                      });
                    });
                    this.list.forEach((item, index) => {
                      item.appPlacements.forEach((v, i) => {
                        if (v.placement_ID == this.compile) {
                          v.state = newPlacement.state;
                          v.daily_budget_imps = newPlacement.daily_budget_imps;
                          v.average_daily_usage =
                            newPlacement.average_daily_usage;
                          v.placement_Name = newPlacement.placement_Name;
                          v.media_Type = newPlacement.media_Type;

                          this.compile = "";
                        }
                      });
                    });
                    store.dispatch("Util/Loading", false);
                  } else {
                    message.error(this.$t("myApp.unknownError"));
                    store.dispatch("Util/Loading", false);
                  }
                })
                .catch(err => {
                  message.error(this.$t("myApp.unknownError"));
                  store.dispatch("Util/Loading", false);
                });
            } else {
              message.error(this.$t("myApp.unknownError"));
              store.dispatch("Util/Loading", false);
            }
          })
          .catch(err => {
            store.dispatch("Util/Loading", false);
          });
      }
    },
    //应用详情
    goDetail(e) {
      this.$router.push(`/hl/appDetail?id=${e}&close=1`);
    },
    // 获取应用列表
    getAppList(e) {
      e=='app'?store.dispatch("Util/Loading", true):!e?this.appLoading=true:'';
      // !e?this.appLoading=true:store.dispatch("Util/Loading", true);
      let opt = {
        num_elements: this.pageSize,
        page: this.current_page,
        app_ids: this.searcAppId.length ? this.searcAppId.toString() : "",
        platform: this.platforms ? Number(this.platforms) : ""
      };
      this.$req
        .getAppInfo(opt)
        .then(res => {
          if (res.data.code == 200) {
            if(res.data.data.app_list.length){
              this.list=[];
              this.showTips=false;
              this.list = res.data.data.app_list;
              this.total = Number(res.data.data.total);
              this.list.map(item => {
                item.active_count = 0;
              });
              let arr=this.list.filter(val=>{
                return val.appPlacements.length>0;
              })
              console.log(arr);
              
              if(arr.length){
                this.showPlacement=false;
              }else{
                this.showPlacement=true;
              }
            }else {
              this.showTips=true;
              this.list=[];
              if(Number(res.data.data.total)!=0){
                this.current_page=this.current_page-1;
                this.getAppList();
              }
              // setTimeout(()=>{
              //   let empty=document.querySelector(".el-table__empty-text");
              //   console.log(empty);
              //   empty.innerHTML='<div class="icon-div"><i class="iconfont application-icon">&#xe635;</i></div>'+
              //                   "暂无数据<br>点击<i class='purple'>+添加应用</i>，上传您的应用，完成换量活动需要上传两个及以上应用";
              //   empty.addEventListener('click',(e)=>{
              //     console.log(e.target.nodeName);
              //     if(e.target.nodeName=="I"){
              //       this.visible = true;
              //     }
              //   })
              // },0)
            }
            e=='app'?store.dispatch("Util/Loading", false):!e?this.appLoading=false:'';
            // !e?this.appLoading=false:store.dispatch("Util/Loading", false);
          } else {
            this.list = [];
            e=='app'?store.dispatch("Util/Loading", false):!e?this.appLoading=false:'';
            // !e?this.appLoading=false:store.dispatch("Util/Loading", false);
          }
          
        })
      
    },
    //判断用户下有没有广告单元
    judGment(){
      let opt = { name: "" };
      this.$req.appNameList(opt).then(res => {
        if (res.data.code === 200) {
          console.log(res.data.data);
          if(res.data.data.length){
            this.showTips=false;
            res.data.data.forEach(item=>{
              // if(item.)
            })
          }else {
            this.showTips=true;
            this.showPlacement=true;
          }
        }
      });
    },
    //删除APP
    del_app(e) {
      console.log(e);
      var _that = this;
      this.loading1=true;
      this.$req.DeleteApp({ app_id: e }).then(res => {
        console.log(res.data.code);
        if (res.data.code === 200) {
          message.success(this.$t("myApp.deleteSuccessful"));
          this.loading1=false;
          this.getApp()
          this.getAppList();
        } else {
          message.error(this.$t("myApp.unknownError"));
          this.loading1=false;
        }
      });

      /* this.$confirm({
        title: this.$t("myApp.deleteApp"),
        icon:  <ExclamationCircleOutlined  />,
        content: this.$t("myApp.deleteAdUnitContent"),
        cancelText:this.$t('myApp.cancel'),
        okText:this.$t('myApp.enter'),
        onOk: () => {
          this.loading1=true;
          _that.$req.DeleteApp({ app_id: e }).then(res => {
            console.log(res.data.code);
            if (res.data.code === 200) {
              message.success(this.$t("myApp.deleteSuccessful"));
              this.loading1=false;
              this.getApp()
              this.getAppList();
            } else {
              message.error(this.$t("myApp.unknownError"));
              this.loading1=false;
            }
          });
        },
        onCancel() {}
      }); */
    },
    //切换广告单元状态
    switchPlacement(e) {
      let appId = "";
      this.loading1=true;
      this.list.forEach((item, index) => {
        item.appPlacements.forEach((v, i) => {
          if (v.placement_ID == e[0]) {
            appId = item.id;
          }
        });
      });
      let opt = {
        app_id: appId,
        placement_ids: e[0],
        state: e[1] == "active" ? "inactive" : "active"
      };
      this.$req
        .SwitchPlacement(opt)
        .then(res => {
          if (res.data.code == 200) {
            message.success(this.$t("myApp.switchingStatusSuccessful"));
            
            this.getAppList("switch");
            // this.$req
            // .getAppInfo(opt)
            // .then(res => {
            //   if (res.data.code == 200) {
            //     if(res.data.data.app_list.length){
            //       this.list=[];
            //       this.showTips=false;
            //       this.list = res.data.data.app_list;
            //       this.total = Number(res.data.data.total);
            //       this.list.map(item => {
            //         item.active_count = 0;
            //       });
            //       let arr=this.list.filter(val=>{
            //         return val.appPlacements.length>0;
            //       })
            //       console.log(arr);
                  
            //       if(arr.length){
            //         this.showPlacement=false;
            //       }else{
            //         this.showPlacement=true;
            //       }
            //     }
            //   }
              
            // })
            
            this.loading1=false;
          } else {
            message.error(this.$t("myApp.switchingStatusFailed"));
            
            this.loading1=false;
          }
        })
        .catch(err => {
          message.error(this.$t("myApp.switchingStatusFailed"));
          
          this.loading1=false;
        });
    },
    goBuyer(appId,appName){
      console.log(appId,appName);
      store.dispatch("Util/AppInfo",[appId,appName]);
      this.$router.push({path:'/hl/buyer'})
      store.dispatch("Util/OpenMenuKey",['/hl/buyer']);
      store.dispatch("Util/OpenKeys",['/hl/buyer']);
    },
    goPolyMerization(appId){
      console.log(appId);
      store.dispatch("Util/AppInfo",[appId]);
      this.$router.push({path:'/hl/polyMerization'})
      store.dispatch("Util/OpenMenuKey",['/hl/polyMerization']);
      store.dispatch("Util/OpenKeys",['/hl/polyMerization']);
    },
    goCreateBuyer(appId){

      //console.log(this.app_names);
      var appInfo = this.app_names.find((item) => (item.app_id == appId));
      store.dispatch("Util/AppInfo",[appId,appInfo.publisher_id,appInfo.member_id]);

      /* http://hl.com/hl/buyer */

      this.$router.push({path:"/hl/createBuyer",query:{
          close:2,
        }})
      store.dispatch("Util/OpenMenuKey",['/hl/buyer']);
      store.dispatch("Util/OpenKeys",['/hl/buyer']);
    }
  }
});

</script>

<style >
  .application .application-icon{
    font-size: 64px;
    color:#909399;
    margin: 0;
  }
  .application .icon-div{
    margin-top: 30px;
    height: 64px;
  }
  /* .application .el-table::before{
    background-color: #fff !important;
  } */
  .application .empty-div{
      height: 30px;
      line-height: 30px;
  }
  .application .purples{
      margin-right: 0 !important;
      color: #6577c8;
      font-style:normal;
  }
  .application .div--margin{
      margin-bottom: 20px;
  }
  /* .application .btn-radius{
    height: 35px;
    min-width: 80px;
    border-radius: 17px;
    font-size: 12px;
  } */

</style>

<style lang="less" scoped>
/deep/.ant-popover-placement-right{
  max-width: 300px;
  z-index: 900!important;
}
.application {
  // --expand:"ewef";
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  .addApplication{
    .ant-form{
      margin-top: 8px;
    }
  }
  /deep/.ant-modal {
    .ant-modal-header {
      .ant-modal-title {
        font-size: 16px;
      }
    }
    // .ant-form-item-required::before{
    //     display: none!important;
    // }
    // .ant-form-item-required::after{
    //     display: inline-block;
    //     content: "*";
    //     color: red;
    //     margin-left: 4px;
    // }
    // .ant-modal-content {
    //   .ant-modal-body {
    //     .ant-form-vertical {
    //       .ant-radio-checked {
    //         .ant-radio-inner {
    //           border-color: #6475c7;
    //         }
    //         .ant-radio-inner::after {
    //           background-color: #6475c7;
    //         }
    //       }
    //     }
    //   }
    // }
  }
  .app-header {
    width: 100%;
    box-sizing: border-box;
    .applicationBtn{
      position: relative;
        .appNote{
        width: 1000px;
        position: absolute;
        border-radius: 50% 80px;
        top: -80px;
        left: 122px;
        padding: 20px;
        background-color: #fff;
        box-shadow: #aaa 3px 3px 8px;
        max-width: v-bind(maxWidth);
        z-index: 999;
        p{
          margin-bottom: 0;
        }
        .triangles{
          position: absolute;
          top: 94px;
          left: -19px;
          border-left: 40px solid;
          border-bottom: 15px solid;
          border-color: transparent transparent #fff transparent;
          transform: rotate(-43deg);
          filter: drop-shadow(#bbb -2px 3px 3px);
        }
        .arrows{
          position: absolute;
          top: 116px;
          left: -27px;
          display: inline-block;
          width: 24px;
          height: 18px;
          background: url("//console-style.hl.com/images/dspcom/u117.svg") no-repeat;
          background-size: 24px 18px;
          animation: fade 1.8s infinite;
        }
        @keyframes fade {
          from {display: inline-block;}
          to {display: none;}
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
      .PlacementNote{
        width: 1000px;
        position: absolute;
        border-radius: 50% 80px;
        top: v-bind(PlacementNote);
        right: 88px;
        padding: 20px;
        background-color: #fff;
        box-shadow: #aaa 3px 3px 8px;
        max-width: 300px;
        z-index: 999;
        p{
          margin-bottom: 0;
        }
        .triangles{
          position: absolute;
          top: v-bind(triangles);
          right: 108px;
          transform: rotate(267deg);
          border-left: 40px solid;
          border-bottom: 15px solid;
          border-color: transparent transparent #fff transparent;
          filter: drop-shadow(#bbb -2px 3px 3px);
        }
        .arrows{
          position: absolute;
          top: v-bind(arrows);
          right: 105px;
          display: inline-block;
          width: 24px;
          height: 18px;
          background: url("//console-style.hl.com/images/dspcom/u117.svg") no-repeat;
          background-size: 24px 18px;
          animation: fade 1.8s infinite;
        }
        @keyframes fade {
          from { display: inline-block;}
          to {display: none;}
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
    }
    /deep/.ant-table-thead > tr > th {
      background-color: #f2f2f2;
    }
    /deep/.ant-table-tbody {
      .ant-table-row {
        td {
          padding: 10px;
          padding-left: 20px;
          padding-right: 20px;
        }
      }
    }
    /deep/.ant-table-wrapper {
      margin: 2px;
    }
    /deep/.el-table__expanded-cell{
      .el-table__empty-block{
          .empty_p{
          line-height: 25px;
          i{
            font-style: normal;
          }
        }
          .el-table__empty-text{
          line-height: normal;
        }
      }
    }
    /deep/.ant-table-expanded-row {
      .ant-table-thead > tr > th {
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
        color: #000;
      }
      td {
        padding-right: 70px;
        padding-left: 70px;
      }
      .ant-table-placeholder {
        display: none;
      }
      .ant-table-body {
        padding-left: 5px;
        padding-right: 5px;
        background-color: #fbfbfb;
        td {
          padding-left: 20px;
          padding-right: 20px;
        }
      
      
      }
      .el-table__empty-block{
          .el-table__empty-text{
          line-height: normal;
          i{
            font-style: normal;
          }
        }
      }
      table {
        margin-top: 20px;
        margin-bottom: 20px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: #aaa 3px 3px 8px;
        .ant-table-thead > tr > th {
          background-color: #fff;
          font-weight: 400;
        }
        td {
          padding: 20px;
        }
      }
    }
    /deep/.images {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      overflow: hidden;
      margin-right: 10px;
    }
    .appName {
      margin-left: 10px;
    }
    .min {
        margin-left: 10px;
        display: inline-block;
        overflow:hidden; //超出的隐藏
        text-overflow:ellipsis;//省略号
        white-space:nowrap;//强制一行显示
    }
    .mins {
        overflow:hidden; //超出的隐藏
        text-overflow:ellipsis;//省略号
        white-space:nowrap;//强制一行显示
    }
    // /deep/.ant-input-search {
    //   width: 400px;
    //   border-radius: 10px;
    //   height: 35px;
    //   background-color: #eaf5ff;
    //   border-color: #eaf5ff;
    //   margin-right: 20px;
    //   &:hover {
    //     border-color: #827af3;
    //   }
    //   &:focus {
    //     border-color: #827af3;
    //   }
    //   .ant-input {
    //     background-color: #eaf5ff;
    //     color: rgb(117, 117, 117);
    //   }
    //   .ant-input-suffix {
    //     .ant-input-search-icon {
    //       color: #6d73f6;
    //     }
    //   }
    // }
    /deep/.el-table {
      .el-table__expand-column{
        pointer-events: none;
        .el-icon{
          visibility: hidden;
        }
      }
    //   th.is-sortable {
    //     .cell {
    //       .caret-wrapper {
    //         display: none;
    //         .sort-caret.ascending {
    //           border-bottom-color: #f0f0f0;
    //         }
    //         .sort-caret.descending {
    //           border-top-color: #f0f0f0;
    //         }
    //       }
    //     }
    //     &:hover {
    //       background-color: #aaaaaa;
    //       color: #f0f0f0;
    //       .cell {
    //         .caret-wrapper {
    //           display: inline-flex;
    //         }
    //       }
    //     }
    //   }
    //   th.descending.is-sortable {
    //     .cell {
    //       .caret-wrapper {
    //         display: inline-flex;
    //         .sort-caret.descending {
    //           border-top-color: #409eff;
    //         }
    //       }
    //     }
    //   }
    //   th.ascending.is-sortable {
    //     .cell {
    //       .caret-wrapper {
    //         display: inline-flex;
    //         .sort-caret.ascending {
    //           border-bottom-color: #409eff;
    //         }
    //       }
    //     }
    //   }
    //   .el-table__expanded-cell {
    //     .el-table {
    //       border-radius: 10px !important;

    //     }
    //     .el-table__header {
    //       th {
    //         .cell {
    //           font-weight: 400 !important;
    //           color: #000 !important;
    //         }
    //       }
    //     }
    //   }
    }
    // /deep/.el-table tbody .el-table__expand-column .cell::before {
    //   content: v-bind(expand);
    //   float: left;
    //   font-size: 12px;
    //   position: relative;
    //   top: 0.025rem;
    //   color: #6577c8;
    // }
    // /deep/.el-table tbody .el-table__expand-column .cell .el-table__expand-icon i {
    //   color:  #6577c8;
    // }
    // /deep/.el-table tbody .el-table__expand-column .cell:hover::before {
    //   content: v-bind(expand);
    //   float: left;
    //   font-size: 12px;
    //   position: relative;
    //   top: 0.025rem;
    //   color: #827af3;
    //   text-decoration: underline;
    //   i {
    //     color: #827af3;
    //   }
    // }
    // /deep/.el-table tbody .el-table__expand-column .cell:active::before {
    //   content: v-bind(expand);
    //   float: left;
    //   font-size: 12px;
    //   position: relative;
    //   top: 0.025rem;
    //   color: #475ab8;
    //   text-decoration: underline;
    //   i {
    //     color: #475ab8;
    //   }
    // }
    // /deep/.el-table tbody .expanded .el-table__expand-column .cell::before {
    //   content: v-bind(collect);
    //   float: left;
    //   font-size: 12px;
    //   position: relative;
    //   top: 0.03rem;
    //   color: #6577c8;
    // }
    // /deep/.el-table tbody .expanded .el-table__expand-column .cell:hover::before {
    //   content: v-bind(collect);
    //   float: left;
    //   font-size: 12px;
    //   position: relative;
    //   top: 0.03rem;
    //   color: #827af3;
    //   text-decoration: underline;
    // }
    // /deep/.el-table tbody .expanded .el-table__expand-column .cell:active::before {
    //   content: v-bind(collect);
    //   float: left;
    //   font-size: 12px;
    //   position: relative;
    //   top: 0.03rem;
    //   color: #475ab8;
    //   text-decoration: underline;
    // }

    // /deep/.el-table tbody .el-table__expand-column .cell {
    //   line-height: normal;
    //   height: 25px;
    //   padding-right: 0;
    //   padding-left: 0;
    //   i {
    //     font-weight: 700;
    //   }
    //   // i:before {
    //   //   content: "\e6e0";
    //   // }
    // }
    // /deep/.el-table tbody .expanded .el-table__expand-column .cell {
    //   line-height: normal;
    //   i {
    //     font-weight: 700;
    //     // width: .2rem;
    //     // height: 1rem;
    //   }
    // }
    // /deep/.el-table .el-table_1_column_3 {
    //   text-align: center;
    // }
    // // .el-table__expand-icon > .el-icon {
    // //   margin-left: -20px;
    // // }
    // /deep/.el-table__expand-icon .el-icon-arrow-right {
    //   transform: rotate(90deg);
    //   // width: 60px;
    //   // height: 30px;
    // }
    // /deep/.el-table tbody .el-table__expand-icon {
    //   transform: rotate(0deg);
    // }
    // /deep/.el-table tbody .expanded .el-table__expand-icon {
      
    //   height: 22px;
    // }
    // /deep/.el-table__expand-icon>.el-icon{
    //   margin-left: 0!important;
    // }
    // /deep/.el-table tbody .expanded .el-table__expand-icon .el-icon-arrow-right {
    //   transform: rotate(-90deg);
    //   //  width: 100px;
    //   // height: 22px;
    //   i {
    //     font-weight: 700;
    //     // width: .2rem;
    //     // height: .2rem;
    //   }
    // }

    /deep/.ant-select {
      
      /* margin-right: 16px; */
      // .ant-select-selector {
      //   background-color: #eaf5ff;
      //   border-color: #eaf5ff;
      //   border-radius: 10px;
      //   height: 35px;
        // .ant-select-selection-overflow-item {
        //   max-width: 125px;
        // }
      //   &:hover {
      //     border-color: #827af3;
      //   }
      //   &:focus {
      //     border-color: #827af3;
      //     box-shadow: none;
      //   }
      //   .ant-select-selection-placeholder {
      //     color: #757575;
      //     line-height: 34px;
      //   }
      // }
    }
    /deep/.search {
      width: 0.7rem;
      height: 0.35rem;
      border-radius: 10px;
      border: none;
      background-color: #6577c8;
    }
    .uid{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .oneLine{
        overflow:hidden; //超出的隐藏
        text-overflow:ellipsis;//省略号
        white-space:nowrap;//强制一行显示
      }
      .editor{
        display: inline-block;
        padding: 3px 8px;
      }
    }
    
    /deep/.add-app-btn {
      width: 120px;
      // height: 35px;
      // border-radius: 10px;
      // border: none;
      margin: 20px 0;
      // background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
      // &:hover {
      //   background-image: linear-gradient(to right, #79b8f1 0%, #6577c8 100%);
      // }
    }
  }
  .app_title {
    font-size: 0.18rem;
    .app_option {
      display: flex;
      align-items: center;
    }
  }

  .expand {
    color: #6475c7;
    &:hover {
      color: #8b9ade;
    }
    &:active {
      color: #475ab8;
    }
  }
  .purple {
    margin-right: 0px;
    // color: #6475c7;
    // cursor: pointer;
    font-style: normal;
    // &:hover {
    //   color: #8b9ade;
    //   text-decoration: underline;
    // }
    // &:active {
    //   color: #475ab8;
    //   text-decoration: underline;
    // }
  }
  .positioning{
    position: relative;
      .PlacementNote{
        width: 1000px;
        position: absolute;
        border-radius: 50% 80px;
        top: -65px;
        left: 120px;
        padding: 20px;
        background-color: #fff;
        box-shadow: #aaa 3px 3px 8px;
        max-width: 300px;
        p{
          margin-bottom: 0;
        }
        .triangles{
          position: absolute;
          top: 75px;
          left: -14px;
          border-left: 40px solid;
          border-bottom: 15px solid;
          border-color: transparent transparent #fff transparent;
          transform: rotate(-43deg);
          filter: drop-shadow(#bbb -2px 3px 3px);
        }
        .arrows{
          position: absolute;
          top: 105px;
          left: -27px;
          display: inline-block;
          width: 24px;
          height: 18px;
          background: url("//console-style.hl.com/images/dspcom/u117.svg") no-repeat;
          background-size: 24px 18px;
          animation: fade 1.5s infinite;
        }
        @keyframes fade {
          from {opacity: 1;}
          to {opacity: 0;}
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
  }

  /* /deep/.ant-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
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
    }
  } */

  /deep/.ant-modal .ant-modal-body .ant-form-item-label{
    max-width: 20%;
  }

  .open {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url("//console-style.hl.com/images/dspcom/normal_u420.svg")
      no-repeat;
    background-size: 20px 20px;
  }
  .pause {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url("//console-style.hl.com/images/dspcom/normal_u419.svg")
      no-repeat;
    background-size: 20px 20px;
  }
  .doubt {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-left: 8px;
      vertical-align:baseline;
      padding-top: 1px;
      background: url("//console-style.hl.com/images/dspcom/normal_u109.svg") no-repeat ;
      background-size: 14px 14px;
  }
  .doubt:hover {
      background: url("//console-style.hl.com/images/dspcom/normal_u110.svg") no-repeat ;
      background-size: 14px 14px;
  }
}


</style>