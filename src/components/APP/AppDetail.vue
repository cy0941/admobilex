<template>
  <div class="app_detail" ref="detail">
    <div class="app_option">
      <div class="app_info">
        <h1 class="app_h1">
          {{$t('appDetails.appDetails')}}
          <a-button @click="isEditAppModal=true">{{$t('AddApp.Edit')}}</a-button>
        </h1>
        <!-- <div class="applications">
          <a-image
            :src="appInfo.app_icon_url"
            class="shisu_icon_image"
            fallback="data:image/png;base64,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"
          />
          <div class="description">
            <div class="app_title">{{appInfo.app_official_name}}</div>
            <div class="app_platform">
              <p>{{appInfo.platform=="1"?"iOS":"Android"}}</p>
              <div>
                <a-popover title placement="top" :mouseEnterDelay="0.2" :mouseLeaveDelay="0">
                  <template #content>
                    <p>{{$t('appDetails.storePopover')}}</p>
                  </template>
                  <a-button type="link"  class="shisu_text_btn" @click="goShopping(appInfo.app_store)">{{$t('appDetails.store')}}</a-button>
                </a-popover>
              </div>
            </div>
          </div>
        </div> -->
        <ul class="appInfo_content">
          <li>
            <span>{{$t('AddApp.AppIcon')}}：</span>
            <a-image
              :src="appInfo.app_icon_url"
              class="shisu_icon_image"
              fallback="data:image/png;base64,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"
            />
          </li>
          <li>
            <span>{{$t('AddApp.Status')}}：</span><span>{{appInfo.is_up=='0'?$t('AddApp.No'):$t('AddApp.Yes')}}</span>
          </li>
          <li>
            <span>{{$t('AddApp.SystemPlatform')}}：</span><span>{{appInfo.platform=="1"?"iOS":"Android"}}</span>
          </li>
          <li>
            <span>{{$t('AddApp.AppName')}}：</span>
            <a-tooltip>
              <template #title>{{appInfo.app_official_name}}</template>
              <div class="appInfo_text">{{appInfo.app_official_name}}</div>
            </a-tooltip>
          </li>
          <li v-if="appInfo.is_up=='1'">
            <span>{{$t('AddApp.AppStoreURL')}}：</span>
            <a-tooltip>
              <template #title>{{appInfo.app_store}}</template>
              <div class="appInfo_text">{{appInfo.app_store}}</div>
            </a-tooltip>
          </li>
          <li>
            <span>{{$t('AddApp.BundleID')}}：</span><span>{{appInfo.bundle_id}}</span>
          </li>
          <li>
            <span>{{$t('AddApp.AppId')}}：</span><span>{{appInfo.uuid}}</span>
          </li>
        </ul>
      </div>
      <!-- <div class="app_filtering" v-if="features.IS_APP_FILTER">
        <h1>{{$t('appDetails.categoryFitter')}}</h1>
        <div class="settings">
          <p>{{$t('appDetails.bannedCategory')}}：{{selected.toString()}}</p>
          <a-button type="primary" class="saves" @click="filters">{{$t('appDetails.edit')}}</a-button>
        </div>
      </div> -->
    </div>
    <div class="app_relevance"> 
      <a-tabs type="card" v-model:activeKey="activeKey" class="shisu_tabs_card">
        <a-tab-pane key="1" :tab="$t('appDetails.AdvertisingUnit')" class="advertisingUnits">
          <div class="unit_title">
            <a-button
              type="primary"
              class="addUnits"
              @click="addAdvertising('a')"
              v-if="features.IS_ADD_AD_UNIT"
            >{{$t('appDetails.addAdUnit')}}</a-button>

            <!-- <a-select
              v-model:value="operation"
              style="width: 120px"
              :placeholder="$t('appDetails.batchOperation')"
              notFoundContent="批量操作"
              ref="selects"
              :disabled="!isStatus"
              allowClear
              @change="aenderungsstand"
            >
              <a-select-option value="1">{{$t('appDetails.active')}}</a-select-option>
              <a-select-option value="2">{{$t('appDetails.inActive')}}</a-select-option>
              <a-select-option value="3">{{$t('appDetails.delete')}}</a-select-option>
            </a-select> -->

            <a-dropdown ref="selects" style="width: 120px" :disabled="!isStatus">
              <template #overlay>
                <a-menu @click="aenderungsstand">
                  <a-menu-item key="1">
                    {{$t('appDetails.active')}}
                  </a-menu-item>
                  <a-menu-item key="2">
                    {{$t('appDetails.inActive')}}
                  </a-menu-item>
                  <a-menu-item key="3">
                    {{$t('appDetails.delete')}}
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                {{$t('appDetails.batchOperation')}}
                <DownOutlined />
              </a-button>
            </a-dropdown>

          </div>
          <a-spin :spinning="detailLoading">
          <el-table
            :data="placements"
            ref="tables"
            @sort-change="PlacementSort"
            @selection-change="choose"
          >
            <el-table-column prop label type="selection"></el-table-column>
            <el-table-column prop="state" :label="$t('appDetails.status')" width="80" align="center">
              <template #default="scope">
                <span class="open" v-if="scope.row.state=='active'"></span>
                <span class="pause" v-else></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="placement_id"
              :label="$t('appDetails.AdUnitID')"
              :sort-orders="sortOrders"
              sortable="custom"
            ></el-table-column>
            <el-table-column prop="placement_name" :label="$t('appDetails.AdUnitName')" class="placement_names">
              <template #default="scope">
                <el-tooltip  effect="dark" :content="scope.row.placement_name" placement="top" :open-delay="200" :enterable="false">
                  <span class="min">{{scope.row.placement_name}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="media_Type" :label="$t('appDetails.AdFormat')">
              <template #default="scope">
                <span>{{scope.row.media_Type=='other'?$t('appDetails.vastVideo'):scope.row.media_Type=='banner'?$t('appDetails.banner'):scope.row.media_Type=="interstitial"?$t('appDetails.insertion'):$t('appDetails.motivationalVideos')}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="daily_budget_imps" :label="$t('appDetails.dailyImpsLimit')">
              <template #default="scope">
                <span>{{scope.row.daily_budget_imps==0?$t('appDetails.noLimit'):scope.row.daily_budget_imps}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('appDetails.operation')">
              <template #default="scope">
                <a-button type="link" size="small"
                  class="purple shisu_text_btn"
                  @click="handleEdit(scope.row.placement_id)"
                  v-if="scope.row.media_Type=='other'&&features.ALLOW_ACCESS_ADD_VAST_PLACEMENT||scope.row.media_Type=='banner'&&features.ALLOW_ACCESS_ADD_BANNER_PLACEMENT||scope.row.media_Type=='interstitial'&&features.ALLOW_ACCESS_ADD_INTERSTITIAL_PLACEMENT||scope.row.media_Type=='stimulate'&&features.ALLOW_ACCESS_ADD_MOTIVATIONAl_VIDEOS_PLACEMENT"
                  >{{$t('appDetails.edit')}}</a-button>
              </template>
            </el-table-column>
            <template v-slot:empty >
              <div class="icon-div"><i class="iconfont icon">&#xe635;</i></div>
              <div class="empty-div">{{$t('appDetails.noData')}}</div>
              <div class="empty-div div--margin">{{$t('appDetails.click')}}<span class='purple' @click="addAdvertising('a')">+{{$t('appDetails.addAdUnit')}}</span></div>
            </template>
          </el-table>
          </a-spin >
          <a-pagination
            :total="placementTotal"
            show-quick-jumper
            show-size-changer
            :show-total="total => `${$t('appDetails.total')} ${total} ${$t('appDetails.article')}`"
            :page-size="pageSize"
            :page-size-options="pageSizeOptions"
            v-model:current="placementPage"
            @change="PageCurrent"
            @showSizeChange="handleSizeChange"
          ></a-pagination>
        </a-tab-pane>
        <a-tab-pane v-if="appInfo.is_up=='1'" key="2" :tab="$t('appDetails.sourceMaterial')" class="materialList">
          <SourceList
            v-if="activeKey==2"
            :app_id="app_id"
            :member_id="member_id"
            :publisher_id="publisher_id"
            :advertiser_id="advertiser_id"
            :iconIndex="iconIndex"
          ></SourceList>
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-modal
      v-model:visible="category"
      class="categorys"
      :getContainer="()=>$refs.detail"
      :title="$t('appDetails.categoryFitter')"
      @ok="filtersOk"
      @cancel="filtersClose"
    >
      <FiltrationCategory v-if="category" @filtrSetting="filtrSetting" ref="categorys" :appInfo="appInfo"></FiltrationCategory>
    </a-modal>
    <a-modal
      v-model:visible="adSetting"
      :getContainer="()=>$refs.detail"
      :title="iscompile?$t('appDetails.editAdUnit'):$t('appDetails.addAdUnit')"
      @ok="adSettingOk"
      :width="700"
      @cancel="adClose"
      @afterClose="filtersClose"
    >
      <adUnitSetting v-if="adSetting" ref="adSetting" @advertisingUnit="advertisingUnit" :compile="compile"></adUnitSetting>
    </a-modal>
    <!-- 添加应用 -->
    <a-modal
      v-model:visible="isEditAppModal"
      :getContainer="()=>$refs.detail"
      :title="$t('AddApp.EditApp')"
      :width="700"
      class="addApplication"
      :footer="null"
    >
      <AddApp v-if="isEditAppModal" ref="editAppRef" :app-info="appInfo" @addAppModalClose='onEditAppModalClose'></AddApp>
    </a-modal>
  </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>
import store from "@/store";
import { useStore } from "vuex";
import { message} from 'ant-design-vue';
import FiltrationCategory from "./FiltrationCategory"; //类别过滤组件
import adUnitSetting from "./adUnitSetting"; //添加广告单元组件
import SourceList from "./sourceList"; //素材列表组件
import AddApp from "./AddApp"; //添加app组件
import { useI18n } from 'vue-i18n';
import {  ExclamationCircleOutlined,DownOutlined} from "@ant-design/icons-vue";
export default {
  name: "Appdetail",
  components: {
    FiltrationCategory,
    SourceList,
    adUnitSetting,
    ExclamationCircleOutlined,
    DownOutlined,
    AddApp
  },
  data() {
    return {
      isEditAppModal:false,
      category: false,
      footer: false,
      adSetting: false,
      iscompile: false,
      compile: "",
      selected: [],
      filtrationListZh: [],
      filtrationListEn: [],
      activeKey: "1",
      iconIndex: 5,
      operation: undefined,
      app_id: "",
      appInfo: "",
      advertiser_id: "",
      member_id: "",
      publisher_id: "",
      sortDirections: ["descend", "ascend"],
      placements: [],
      placementTotal: 0,
      placementPage: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "50"],
      sort: null,
      placement_id: [],
      isStatus: false,
      sortOrders: ["descending", "ascending", null],
      features: {},
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.placement_id = selectedRows;
          this.rowSelection.selectedRowKeys = selectedRowKeys;
          if (selectedRows.length != 0) {
            this.isStatus = true;
          } else {
            this.isStatus = false;
          }
          console.log(selectedRows, this.placement_id, this.isStatus);
        },
        getCheckboxProps: record => ({
          disabled: record.name === "Disabled User", // Column configuration not to be checked
          name: record.name
        }),
        selectedRowKeys: []
      }
      ,
      language:"",
      detailLoading:false,
    };
    
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
          
        if (this.features.ALLOW_ACCESS_TO_APP) {
          this.language=store.state.Util.language;
          this.getAppDetail();
          this.getAppPlacement("detail");
          store.dispatch("Util/Loading", false);
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
  watch: {
    activeKey(val) {
      var videos = document.querySelector("video");
      if (videos) {
        videos.pause();
      }
    },
    '$store.state.Util.language'(newVal,oldVal){
        console.log(newVal,oldVal);
        this.language=newVal;
        this.getlist();
    }
  },
  methods: {
    onEditAppModalClose(isGetAppInfo){
      this.isEditAppModal=false;
      if(isGetAppInfo){
        this.getAppDetail();
      }
    },
    adSettingOk(){
      this.$refs.adSetting.advertisingUnit();
    },
    filtersOk(e) {
      this.$refs.categorys.filtrSetting();
    },
    filters() {
      this.category = true;
    },
    filtersClose() {
      console.log(111);
      this.category = false;
      // store.dispatch("Util/Loading", false);
    },
    // 选择列表项
    choose(e) {
      console.log(e);
      if (e.length > 0) {
        this.isStatus = true;
      } else {
        this.isStatus = false;
        this.$refs.selects.value = undefined;
      }
      this.placement_id = e;
    },

    adClose() {
      if (this.iscompile) {
        this.compile = "";
      }
      this.iscompile = false;
    },
    goShopping(e) {
      window.open(e, "_blank");
    },
    //设置应用过滤
    filtrSetting(e) {
      console.log(e);
      store.dispatch("Util/Loading", true);
      let opt = {
        app_id: this.appInfo.id,
        filter_categories: e.toString()
      };
      this.$req
        .appFitterCategories(opt)
        .then(res => {
          if (res.data.code == 200) {
            message.success(this.$t('appDetails.setUpSuccessfully'));
            store.dispatch("Util/Loading", false);
            this.category = false;
            this.selected = [];
            console.log(e, this.filtrationListZh);
            for (var i = 0; i < this.filtrationListZh.length; i++) {
              for (var j = 0; j < e.length; j++) {
                if (this.filtrationListZh[i].id == e[j]) {
                  
                    this.selected.push(this.language=="zh"?this.filtrationListZh[i].name:this.filtrationListEn[i].name);
                  
                }
              }
            }
            console.log(this.selected);
          } else {
            message.error(this.$t('appDetails.setUpFailed'));
            store.dispatch("Util/Loading", false);
          }
        })
        .catch(err => {
          message.error(this.$t('appDetails.unknownError'));
          store.dispatch("Util/Loading", false);
        });
    },
    //广告单元排序
    PlacementSort(obj) {
      if (obj.order) {
        if (obj.order === "descending") {
          //升序排列
          this.sort="placement_id.desc";
          this.getAppPlacement();
        } else {
          this.sort="placement_id.asc"
          this.getAppPlacement();
        }
      } else {
        this.sort=""
        this.getAppPlacement();
      }
    },
    //广告单元批量操作
    aenderungsstand({ key }) {
      console.log(key);
      switch (key) {
        case "1":
        //  开启
        case "2":
          //  关闭
              
              this.detailLoading=true;
              let arr = [];
              this.placement_id.forEach((item, index) => {
                arr.push(item.placement_id);
              });
              let opt = {
                app_id: this.app_id,
                placement_ids: arr.toString(),
                state: key == 1 ? "active" : "inactive"
              };
              this.$req
                .SwitchPlacement(opt)
                .then(res => {
                  this.operation = undefined;
                  this.$refs.selects.value = undefined;
                  if (res.data.code == 200) {
                    message.success(this.$t('appDetails.switchingStatusSuccessful'));
                    this.placement_id = [];
                    this.getAppPlacement(this.sort);
                    this.$refs.tables.clearSelection();
                    this.detailLoading=false;
                  } else {
                    message.error(this.$t('appDetails.switchingStatusFailed'));
                    this.detailLoading=false;
                  }
                })
                .catch(err => {
                  this.operation = undefined;
                  this.$refs.selects.value = undefined;
                  this.detailLoading=false;
                  message.error(this.$t('appDetails.unknownError'));
                });
          break;
        case "3":
          //  删除
          // this.operation = undefined;
          this.$confirm({
            title: this.$t('appDetails.deleteAdUnit'),
            content: this.$t('appDetails.deleteAdUnitContent'),
            cancelText:this.$t('appDetails.cancel'),
            okText:this.$t('appDetails.enter'),
            icon: <ExclamationCircleOutlined  />,
            onOk: () => {
              this.operation = undefined;
              this.$refs.selects.value = undefined;
              this.detailLoading=true;
              let arr = [];
              this.placement_id.forEach((item, index) => {
                arr.push(item.placement_id);
              });
              let opt = {
                app_id: this.app_id,
                placement_ids: arr.toString()
              };
              this.$req
                .Deleteplacement(opt)
                .then(res => {
                  if (res.data.code === 200) {
                    message.success(this.$t('appDetails.deleteSuccessful'));
                    this.placement_id = [];
                    this.$refs.tables.clearSelection();
                    this.detailLoading=false;
                    this.getAppPlacement(this.sort);
                  } else {
                    this.detailLoading=false;
                    message.error(this.$t('appDetails.deleteFailed'));
                  }
                })
                .catch(err => {
                  this.detailLoading=false;
                  message.error(this.$t('appDetails.unknownError'));
                });
            },
            onCancel: () => {
              console.log("23");
              
              this.operation = undefined;
              this.$refs.selects.value = undefined;
            }
          });
          break;
      }
    },
    //编辑广告单元
    handleEdit(e) {
      this.adSetting = true;
      this.iscompile = true;
      this.compile = e;
    },
    //打开添加广告单元窗口
    addAdvertising(e) {
      this.adSetting = true;
      if (e == "a") {
        this.witch = true;
      } else {
        this.witch = false;
      }
    },
    // 添加编辑广告单元
    advertisingUnit(e) {
      console.log(e);
      if (!this.iscompile) {
        store.dispatch("Util/Loading", true);
        //添加广告单元
        let opt = {
          app_id: this.app_id,
          media_type: e.adTypen == 1 ? "banner" :e.adTypen==2?"other":e.adTypen==3?"interstitial":"stimulate",
          name: e.adName.trim(),
          width:e.adTypen == 1?e.placementWidth:"",
          height:e.adTypen == 1?e.placementHeight:"",
          add_size:e.addSizeList?1:0,
          state: e.active == 1 ? "active" : "inactive",
          placement_imps: e.count_radio == 1 ? 0 : e.count.trim(),
          placement_usage: e.constant ? 1 : 0,
          // language_ids: e.language_id.join(","),
          // premium_user_type: e.paid == "全部" ? 2 : e.paid == "付费" ? 1 : 0
        };
        this.$req
          .Addplacement(opt)
          .then(res => {
            if (res.data.code == 200) {
              message.success(this.$t('appDetails.addSuccessful'));
              this.adSetting = false;
              
              this.getAppPlacement(this.sort);
            } else {
              message.success(res.msg);
              
            }
            store.dispatch("Util/Loading", false);
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
          placement_usage: e.constant ? 1 : 0,
          // language_ids: e.language_id.join(","),
          // premium_user_type: e.paid == "全部" ? 2 : e.paid == "付费" ? 1 : 0
        };
        this.$req
          .EditPlacement(opt1)
          .then(res => {
            if (res.data.code == 200) {
              message.success(this.$t('appDetails.editSuccessful'));
              this.iscompile = false;
              this.adSetting = false;
              this.getAppPlacement(this.sort);
            } else {
              message.error(this.$t('appDetails.editFailed'));
            }
            store.dispatch("Util/Loading", false);
          })
          .catch(err => {
            message.error(this.$t('appDetails.unknownError'));
            store.dispatch("Util/Loading", false);
          });
        this.compile = "";
      }
    },
    // 获取单个APP下的广告位
    getAppPlacement(sort) {
      let opt = {
        app_id: this.$route.query.id,
        page: this.placementPage,
        num_elements: this.pageSize,
        sort:this.sort?this.sort:""
      };
      sort=="detail"?store.dispatch("Util/Loading", true):this.detailLoading=true;
      this.$req
        .AppPlacement(opt)
        .then(res => {
          if (res.data.code == 200) {
            sort=="detail"?store.dispatch("Util/Loading", false):this.detailLoading=false;
            this.placements = res.data.data.placement_list.length
              ? res.data.data.placement_list
              : [];
            this.placementTotal = res.data.data.total;
            console.log(this.placements);
          } else {
            sort=="detail"?store.dispatch("Util/Loading", false):this.detailLoading=false;
          }
        })
        .catch(err => {
          sort=="detail"?store.dispatch("Util/Loading", false):this.detailLoading=false;
        });
    },
    //获取应用过滤列表
    getlist(e) {
      e=="detail"?store.dispatch("Util/Loading", true):this.detailLoading=true;
      this.$req
        .appCategoryList({
          platform: this.appInfo.platform == "1" ? 1 : 0,
          app_id: this.appInfo.id
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            this.selected = [];
            this.filtrationListZh = res.data.data.map((value, index) => {
              return {
                name: value.cn_value,
                id: value.id
              };
            });
            this.filtrationListEn = res.data.data.map((value, index) => {
              return {
                name: value.en_value,
                id: value.id
              };
            });
            res.data.data.forEach((value, index) => {
              if (value.status != "trusted") {
                
                  this.selected.push(this.language=="zh"?value.cn_value:value.en_value);
                
              }
            });
            e=="detail"?store.dispatch("Util/Loading", false):this.detailLoading=false;
          } else {
            e=="detail"?store.dispatch("Util/Loading", false):this.detailLoading=false;
            message.error(this.$t('appDetails.unknownError'));
          }
        })
        .catch(err => {
          e=="detail"?store.dispatch("Util/Loading", false):this.detailLoading=false;
          message.error(this.$t('appDetails.unknownError'));
        });
    },
    // 页码改变的事件
    PageCurrent(page) {
      this.placementPage = page;
      this.getAppPlacement(this.sort);
    },
    //每页的条数
    handleSizeChange(val, page) {
      this.pageSize = page;
      this.placementPage = 1;
      this.getAppPlacement(this.sort);
    },
    //获取应用详情数据
    getAppDetail(){
      let opt = {
        app_id: this.$route.query.id
      };

      this.app_id = this.$route.query.id;
      store.dispatch("Util/Loading", true);
      
      this.$req.GetAppDetail(opt).then(res => {
        if (res.data.code === 200) {
          store.dispatch("Util/Loading", false);
          if (res.data.data && res.data.data.SelectAppDetail) {
            this.appInfo = res.data.data.SelectAppDetail;
            let data = res.data.data.SelectAppDetail;
            console.log(this.appInfo);
            this.advertiser_id = data.appCommon.advertiser_id;
            this.member_id = data.appCommon.member_id;
            this.publisher_id = data.appCommon.publisher_id;
            window.localStorage.setItem(
              "app",
              JSON.stringify(res.data.data.SelectAppDetail)
            );
            this.getlist("detail");
          } else {
            message.error(this.$t('appDetails.unknownError'));
            store.dispatch("Util/Loading", false);
          }
        } else {
          store.dispatch("Util/Loading", false);
          message.error(res.message);
        }
      });
    }
  },
};
</script>

<style>
  .app_detail .icon{
      font-size: 64px;
      color:#909399;
      margin: 0;
  }
  .app_detail .icon-div{
      margin-top: 20px;
      height: 64px;
  }
  .app_detail .empty-div{
      height: 30px;
      line-height: 30px;
      margin-bottom: 20px;
  }
  .app_detail .purple{
      margin-right: 0 !important;
  }
  .app_detail .div--margin{
      margin-bottom: 20px;
  }
</style>

<style lang="less" scoped>
p {
  margin-bottom: 0;
}
.app_detail {
  background-color: transparent;
  .app_option {
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 20px;
    .app_info {
      width: 100%;
      background-color: #ffffff;
      .app_h1 {
        font-size: 18px;
        .ant-btn{
          height: 28px;
          line-height: 28px;
          margin-left: 8px;
          padding-bottom: 0;
          padding-top: 0;
        }
      }
      .applications {
        display: flex;
        justify-content: left;
        align-items: center;
        width: fit-content;
        padding: 20px;
        border-radius: 10px;
        box-shadow: #aaa 3px 3px 8px;
        max-width: 5rem;
        /deep/.images {
          border-radius: 10px;
        }
        .description {
          display: flex;
          height: 50px;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 15px;
          min-width: 3rem;
          max-width: 4rem;
          .app_title {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .app_platform {
            display: flex;
            justify-content: space-between;
            height: 22px;
            min-width: 2rem;
            
          }
        }
      }

      /* 新版本 */
      .appInfo_content{
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        margin: 0;

        li{
          display: inline-flex;
          align-items: center;
          width: 30%;
          padding: 8px;

          .appInfo_text{
            max-width: 350px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

        };

      }

    }
    .app_filtering {
      width: 50%;
      h1 {
        font-size: 18px;
      }
      .settings {
        display: flex;
        width: fit-content;
        justify-content: space-between;
        align-items: baseline;
        padding-left: 20px;
        font-size: 16px;
        p {
          margin: 0;
          max-width: 300px;
          min-width: 300px;
          font-size: 14px;
          // overflow: hidden;
          word-break:break-all;
          // white-space: nowrap;
          // text-overflow: ellipsis;
        }
        .saves {
          width: 120px;
          margin-left: 20px;
          // background-color: #6577c8;
          // border-radius: 10px;
          // border: none;
        }
      }
    }
  }
  .app_relevance {
    margin-top: 20px;
    .min {
        overflow:hidden; //超出的隐藏
        text-overflow:ellipsis;//省略号
        white-space:nowrap;//强制一行显示
    }
    /deep/.shisu_tabs_card {
      // .ant-tabs-bar {
      //   margin-bottom: 0;
      // }
      // .ant-tabs-nav-animated {
      //   border-top-left-radius: 5px;
      //   .ant-tabs-tab {
      //     margin-right: 0;
      //     color: #757575;
      //     border-top-right-radius: 0;
      //     border-top-left-radius: 0;
      //   }
      //   // .ant-tabs-tab:hover {
      //   //   color: #757575;
      //   // }
      //   .ant-tabs-tab:nth-child(1) {
      //     border-top-left-radius: 8px;
      //   }
      //   .ant-tabs-tab:last-child {
      //     border-top-right-radius: 8px;
      //   }
      //   .ant-tabs-tab-active {
      //     color: #fff;
      //     margin-right: 0;
      //     background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
      //   }
      // }
      .advertisingUnits {
        background-color: #fff;
        // border-radius: 10px;
        border-top-left-radius: 0;
        padding: 20px;
        .unit_title {
          margin-bottom: 20px;
          .addUnits {
            width: 120px;
            margin-right: 16px;
            // height: 35px;
            // border: none;
            // border-radius: 10px;
            // background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
          }
          // .ant-select {
          //   width: 120px!important;
          //   height: 35px;
          //   line-height: 35px;
          //   margin-left: 20px;
          //   .ant-select-selector {
          //     height: 35px;
          //     align-items: center;
          //     border-radius: 10px;
          //     &:hover {
          //       border-color: #827af3;
          //     }
          //     &:focus {
          //       border-color: #827af3;
          //     }
          //   }
          // }
        }

        .ant-table-wrapper {
          margin-top: 20px;
        }
      }
      .materialList {
        background-color: #fff;
        // border-radius: 10px;
        border-top-left-radius: 0;
        padding: 20px;
      }
      // .ant-pagination {
      //   display: flex;
      //   justify-content: flex-end;
      //   margin-top: 20px;
      //   .ant-pagination-prev,
      //   .ant-pagination-next {
      //     width: 30px;
      //     height: 30px;
      //     line-height: 30px;
      //     .ant-pagination-item-link {
      //       border-radius: 8px;
      //       background-color: #eaf5ff;
      //       border: none;
      //       .anticon-left,
      //       .anticon-right {
      //         color: #6577c8;
      //       }
      //     }
      //   }
      //   .ant-pagination-options-size-changer {
      //     margin-top: 0;
      //     .ant-select-selector {
      //       height: 30px;
      //       background-color: #fff;
      //     }
      //   }
      //   .ant-pagination-options-quick-jumper {
      //     height: 30px;
      //     line-height: 30px;
      //     input {
      //       border-radius: 5px;
      //       height: 30px;
      //       &:hover {
      //         border-color: #6577c8;
      //       }
      //       &:focus {
      //         border-color: #6577c8;
      //       }
      //     }
      //   }
      //   .ant-pagination-item {
      //     width: 30px;
      //     height: 30px;
      //     line-height: 30px;
      //     border-radius: 8px;
      //   }
      //   .ant-pagination-item-active {
      //     width: 30px;
      //     height: 30px;
      //     line-height: 30px;
      //     border-radius: 8px;
      //     background-color: #6577c8;
      //     border: none;
      //     a {
      //       color: #fff;
      //     }
      //   }
      // }
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
    }
  }
  /deep/.ant-modal .ant-modal-body .ant-form-item-label{
    max-width: 20%;
  }
}
/deep/.categorys {
  .ant-modal-header {
    .ant-modal-title {
      font-size: 18px;
    }
  }
  .ant-modal-content {
    width: 750px;
    border-radius: 10px !important;
    .ant-modal-header {
      border-top-left-radius: 10px !important;
      border-top-right-radius: 10px !important;
    }
    .ant-modal-body {
      padding-top: 15px;
      padding-bottom: 15px;
    }
  }
}
// /deep/.el-table {
//   font-size: 12px;
//   th {
//     background: #f2f2f2;
//     color: #7f7f7f;
    
//     .is-indeterminate {
//       .el-checkbox__inner {
//         background-color: #6577c8;
//         border-color: #6577c8;
//       }
//     }
//     .el-checkbox__inner:hover {
//       border-color: #6577c8;
//     }
//   }
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
//   .el-table-column--selection {
//     .is-checked {
//       .el-checkbox__inner {
//         background-color: #6577c8;
//         border-color: #6577c8;
//       }
//     }
//     .el-checkbox__inner:hover {
//       border-color: #6577c8;
//     }
//   }
// }

/deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #e6f7ff;
}

</style>