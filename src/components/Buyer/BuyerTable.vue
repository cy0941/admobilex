<template>
  <div class="app">
    <h1>{{$t('campaign.crossPromotion')}}</h1>
    <div class="search_app">
      <a-space :size="8">
        <a-select
              mode="multiple"
              v-model:value="searchAppName"
              style="width:250px;"
              :placeholder="$t('campaign.promotedAppName')"
              showArrow
              :maxTagCount="1"
              :maxTagTextLength="320"
              class="searchName"
              @change="changeSearch"
              :notFoundContent="$t('Message.NoAppStoreAppData')"
            >
            <template #suffixIcon>
                <SearchOutlined />
            </template>
            <a-select-option v-for="item in app_names" :value="item.appInfo.app_official_name" :key="item.appInfo.id">
                <span>
                    <AppleFilled style="margin-right:5px;" v-if="item.appInfo.platform==1" />
                    <AndroidFilled style="margin-right:5px;" v-else />
                    <!-- <AppleOutlined style="margin-right:5px;" v-if="item.appInfo.platform==1"/>
                    <AndroidOutlined style="margin-right:5px;" v-else/> -->
                    {{item.appInfo.app_official_name}}
                </span>
            </a-select-option>
            <a-select-option v-if="app_names">

            </a-select-option>
        </a-select>

        <a-select
          v-model:value="platforms"
          style="width: 120px"
          :placeholder="$t('campaign.appPlatform')"
          ref="select"
          allowClear
        >
          <a-select-option value="1">IOS</a-select-option>
          <a-select-option value="2">Android</a-select-option>
        </a-select>

        <a-input
          class="CreativeSearch"
          v-model:value="campaign_id"
          :placeholder="$t('campaign.crossPromotionNameID')"
          style="width:200px;"
          allowClear
        />

        <!-- type="number" -->

        <a-range-picker
          style="width: 320px"
          v-model:value="formatTime"
          :allowClear="false"
          format="YYYY-MM-DD"
          separator="--"
        >
          <template #suffixIcon>
              <!-- <SmileOutlined /> -->
              <a-popover title="" placement="top">
                  <template #content>
                      <div>{{$t('campaign.noteSelectTime')}}</div>
                  </template>
                  <QuestionCircleFilled class="iconNote" />
                  <!-- <span class="doubt"></span> -->
              </a-popover>
          </template>
        </a-range-picker>
        <!-- <p class="note" >根据时间窗口，展示对应时间段内的指标数据</p> -->
        <a-button type="primary" class="search_primary" @click="appSeerch">{{$t('campaign.search')}}</a-button>
      </a-space>
    </div>
    <div class="create_buyer">
      <a-space :size="8">
        <a-button type="primary" class="create_primary" @click="createBuyer">{{$t('campaign.newCrossPromotion')}}</a-button>

        <!-- <a-select
              v-model:value="operations"
              style="width: 120px"
              ref="selectOperation"
              :placeholder="$t('campaign.batchOperation')"
              class="batchOperation"
              :disabled="!isStatus"
              @change="operation"
            >
            <a-select-option value="1">{{$t('campaign.active')}}</a-select-option>
            <a-select-option value="2">{{$t('campaign.inActive')}}</a-select-option>
            <a-select-option value="3">{{$t('campaign.delete')}}</a-select-option>
        </a-select> -->

        <a-dropdown ref="selectOperation" style="width: 120px" class="batchOperation" :disabled="!isStatus">
          <template #overlay>
              <a-menu @click="operation">
                  <a-menu-item key="1">
                    {{$t('campaign.active')}}
                  </a-menu-item>
                  <a-menu-item key="2">
                    {{$t('campaign.inActive')}}
                  </a-menu-item>
                  <a-menu-item key="3">
                    {{$t('campaign.delete')}}
                  </a-menu-item>
              </a-menu>
          </template>
          <a-button>
              {{$t('campaign.batchOperation')}}
              <DownOutlined />
          </a-button>
        </a-dropdown>
      </a-space>

    </div>
      <!-- 新表格 -->
      <a-spin :spinning="buyerLoading">
      <el-table :data="tableData" style="width: 100%"
          ref="table"
          row-key="id"
          @selection-change="choose"
          @sort-change="listSort"
        >
        <el-table-column
          type="selection"
          width="55">
          </el-table-column>
          <el-table-column sortable="custom" :sort-orders="sortOrders" prop="status" width="100" header-align="left" align="left">
            <template #header>
              <span>{{$t('campaign.status')}}</span>
              <a-popover title="" placement="right" class="iconPopover">
                  <template #content>
                      <div style="margin-bottom:3px;display:flex">
                        <a-image
                          :width="20"
                          src="//console-style.hl.com/images/dspcom/running.svg"
                        />
                        <span style="vertical-align: middle;margin-left:10px;">{{$t('campaign.campaignActive')}}</span></div>
                      <div style="margin-bottom:3px;display:flex"> <a-image
                          :width="20"
                        
                          src="//console-style.hl.com/images/dspcom/warning.svg"
                        />
                        <span style="vertical-align: middle;margin-left:10px;">{{$t('campaign.anomalies')}}</span></div>
                      <div style="margin-bottom:3px;display:flex"> <a-image
                          :width="20"
                          src="//console-style.hl.com/images/dspcom/stop.svg"
                        />
                        <span style="vertical-align: middle;margin-left:10px;">{{$t('campaign.stop')}}</span></div>
                      <div>
                        <a-image
                          :width="20"
                          src="//console-style.hl.com/images/dspcom/done.svg"
                        />
                        <span style="vertical-align: middle;margin-left:10px;">{{$t('campaign.notStarted')}}</span></div>
                  </template>
                  <QuestionCircleFilled class="iconNote" />
                  <!-- <span class="doubt"></span> -->
              </a-popover>
            </template>
          <template #default="scope">
          <a-popover
            v-if="scope.row.status==1"
            placement="topLeft"
            title=""
          >
            <template #content>
              <span>{{$t('campaign.activityNotes')}}</span>
            </template>
              <i slot="reference" class="red"></i>
          </a-popover>
          <a-popover
            v-if="scope.row.status==2"
            placement="topLeft"
            title=""
          >
            <template #content>
              <span>{{$t('campaign.activityNotes')}}</span>
            </template>
              <i slot="reference" class="red"></i>
          </a-popover>
          <a-popover
            v-if="scope.row.status==3"
            placement="topLeft"
            title=""
          
            >
            <template #content>
              <span>{{$t('campaign.activityActive')}}</span>
            </template>
              <i slot="reference"  class="activity"></i>
          </a-popover>
          <a-popover
            v-if="scope.row.status==4"
            placement="topLeft"
            title=""
          
            >
            <template #content>
              <span>{{$t('campaign.activityNotStarted')}}</span>
            </template>
              <i slot="reference" class="finish"></i>
          </a-popover>
          <a-popover
            v-if="scope.row.status==5"
            placement="topLeft"
            title=""
          
          >
            <template #content>
              <span>{{$t('campaign.activityClosed')}}</span>
            </template>
              <i slot="reference" class="finish"></i>
          </a-popover>
          <a-popover
            v-if="scope.row.status==6"
            placement="topLeft"
            title=""
            >
            <template #content>
              <span>{{$t('campaign.activityStop')}}</span>
            </template>
              <i slot="reference" class="pause"></i>
          </a-popover>
        </template>
        </el-table-column>
        <el-table-column :label="$t('campaign.crossPromotionID')" sortable="custom" :sort-orders="sortOrders" prop="id" width="160" header-align="left" align="left"></el-table-column>
        <el-table-column :label="$t('campaign.crossPromotionName')" prop="name"  width="275">
            <template #default="scope">
                <el-tooltip  effect="dark" :content="scope.row.name" placement="top" :open-delay="200" :enterable="false">
                  <span class="mins">{{scope.row.name}}</span>
                </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column
          prop="app_icon"
          :label="$t('campaign.promotedApp')"
          width="220"
          >
          <!--插入图片链接的代码-->
          <template #default="scope">
            <div class="app_imgs">
                <a-image
                    class="shisu_table_image"
                    :src="scope.row.app_icon_url"
                    fallback="data:image/png;base64,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"
                />
                <div class="app_names">
                  <!-- <span class="min">{{scope.row.app_official_name}}</span> -->
                  <el-tooltip  effect="dark" :content="scope.row.app_official_name" placement="top" :open-delay="200" :enterable="false">
                    <span class="min">{{scope.row.app_official_name}}</span>
                  </el-tooltip>
                  <span>{{scope.row.platform==1?"iOS":"Android"}}</span>
                </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('campaign.startTime')" sortable="custom" :sort-orders="sortOrders" prop="start_date" width="125" header-align="left" align="left"></el-table-column>
        <el-table-column :label="$t('campaign.endTime')" sortable="custom" :sort-orders="sortOrders" prop="end_date" width="125" header-align="left" align="left">
          <template #default="scope">
            <span>{{scope.row.end_date=="无限期"?$t('campaign.indefinite'):scope.row.end_date}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('campaign.imps')" sortable="custom" :sort-orders="sortOrders" prop="imps" header-align="right" align="right" width="90"> </el-table-column>
        <el-table-column :label="$t('campaign.clicks')" sortable="custom" :sort-orders="sortOrders" prop="clicks" header-align="right"  align="right" width="90"> </el-table-column>
        <el-table-column :label="$t('campaign.ctr')" sortable="custom" :sort-orders="sortOrders" prop="ctr" header-align="right" align="right" width="80">
          <template #default="scope">
            <span>{{(Number(scope.row.ctr)*100).toFixed(2)}}%</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('campaign.creatvie')" prop="creative_num" header-align="right" align="right" width="120">
          <template #default="scope">
            <span>{{scope.row.creative_num}}&emsp;{{$t('campaign.creatvies')}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="" class-name="priority" sortable="custom" :sort-orders="sortOrders"  header-align="left" prop="priority" align="center" width="120">
          <template #header>
            <span>{{$t('campaign.priority')}}</span>
            <a-popover title="" placement="top">
                <template #content>
                    <div>{{$t('campaign.notepriority')}}</div>
                    <div>{{$t('campaign.notepriority1')}}</div>
                    <div>{{$t('campaign.notepriority2')}}</div>
                </template>
                <span class="doubt"></span>
            </a-popover>
          </template>
          <template #default="scope">
            <a-select
              v-model:value="scope.row.priority"
              style="width: 120px"
              ref="selectStatus"
              :placeholder="$t('campaign.priority')"
              class="selectPriority"
              @change="priorityChange(scope.row)"
            >
              <a-select-option :value="item.value" v-for="item in Prioritys" :key="item.value">{{item.label}}</a-select-option>
            </a-select>
          </template>
        </el-table-column> -->
        <el-table-column  :label="$t('campaign.operation')" header-align="right" align="right" width="80">
            <template #default="scope">
                <a-button type="link" size="small" class="shisu_text_btn purple" @click="editingActivity([scope.row.id,scope.row])">{{$t('campaign.edit')}}</a-button>
            </template>
        </el-table-column>
        <el-table-column type="expand">
        <template #default="scope" class="child_tabel">
          <a-spin :spinning="loading2">
          <el-table :data="scope.row.creative_list"  style="width: auto;boxShadow:0 0 0.05rem rgba(0,0,0,.117647058823529); margin:0.2rem; border-radius: 0.05rem;"
            :header-cell-style="{background: '#fff' }"
          >
            <el-table-column :label="$t('campaign.status')" align="center" width="80">
              <template #default="scope">
                <span :class="scope.row.status=='1'?'open':'pauses'"></span>
              </template>
            </el-table-column>
            <el-table-column label="ID" prop="creative_id" > </el-table-column>
            <el-table-column :label="$t('campaign.creatvieName')" prop="creative_name" min-width="100" > 
                <template #default="scope">
                  <el-tooltip  effect="dark" :content="scope.row.creative_name" placement="top" :open-delay="200" :enterable="false">
                    <span class="mins">{{scope.row.creative_name}}</span>
                  </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column :label="$t('campaign.creatvieForamt')" prop="creative_type" >
                <template #default="scope">
                  <span>{{scope.row.creative_type == "banner"?$t('campaign.banner'):scope.row.creative_type == "interstitial"?$t('campaign.insertion'):scope.row.creative_type == 'stimulate'?$t('campaign.motivationalVideos'):$t('campaign.vastVideo')}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('campaign.imps')" prop="creative_imps" align="right"> </el-table-column>
            <el-table-column :label="$t('campaign.clicks')" prop="creative_clicks" align="right"> </el-table-column>
            <el-table-column :label="$t('campaign.ctr')"   prop="creative_ctr" align="right">
              <template #default="scope">
                <span>{{(Number(scope.row.creative_ctr)*100).toFixed(2)}}%</span>
              </template>
            </el-table-column>
            <el-table-column  :label="$t('campaign.operation')" align="left">
                <template #default="scope">
                  <a-button type="link" size="small" class="shisu_text_btn " @click="switchStatus(scope.row,'active')">{{scope.row.status=='1'?$t('campaign.inActive'):$t('campaign.active')}}</a-button>
                  <a-button type="link" size="small" class="shisu_text_btn purple" @click="editCreative(scope.row)">{{$t('campaign.edit')}}</a-button>
                </template>
            </el-table-column>
            <template v-slot:empty >
              <div class="icon-div"><i class="iconfont icon application-icon">&#xe635;</i></div>  
              <div class="empty-div">{{$t('campaign.noData')}}</div>
            </template>
          </el-table>
          </a-spin>
        </template>
      </el-table-column>
        <template v-slot:empty >
          <div class="icon-div"><i class="iconfont icon application-icon">&#xe635;</i></div>
          <div class="empty-div" style="margin:0">{{$t('campaign.noData')}}</div>
          <div class="empty-div">{{$t('campaign.click')}}
            <a-button type="link" class="shisu_btn--notPadding" @click="createBuyer">+{{$t('campaign.newCrossPromotion')}}</a-button>
          </div>
        </template>
      </el-table>
      </a-spin >
      <a-pagination
          :total="total"
          show-quick-jumper
          show-size-changer
          :show-total="total => `${$t('campaign.total')} ${total} ${$t('campaign.article')}`"
          :page-size="pageSize"
          :page-size-options="pageSizeOptions"
          v-model:current="currentPage"
          @change="PageCurrent"
          @showSizeChange="handleSizeChange"
        >
        </a-pagination>
  </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script >

import { defineComponent, ref } from "vue";
import { mapGetters,useStore,} from "vuex";
import { message} from 'ant-design-vue';
import store from '@/store';
import { useI18n } from 'vue-i18n';
import {AppleFilled,AndroidFilled,UserOutlined,DownOutlined,QuestionOutlined,UpOutlined,SearchOutlined,AppleOutlined,AndroidOutlined,QuestionCircleFilled,ExclamationCircleOutlined,} from "@ant-design/icons-vue";
import moment from 'moment';
export default {
  components: {
    QuestionOutlined,
    UserOutlined,
    DownOutlined,
    UpOutlined,
    SearchOutlined,
    AndroidOutlined,
    AppleOutlined,
    QuestionCircleFilled,
    ExclamationCircleOutlined,
    AppleFilled,
    AndroidFilled
  },
  data(){
    return{
      appName:"",
      formatTime:[],
      operations:undefined,
      pageSize:10,
      isStatus:false,
      startTime:"",
      endTime:"",
      total:null,
      sortOrders:['descending', 'ascending', null],
      pageSizeOptions:["10","20", "50"],
      currentPage:1,
      Prioritys:[{
        value:20,
        label:`20(${this.$t('campaign.max')})`
      }],
      campaign_id:"",
      platforms:undefined,
      sortDirections:['descend', 'ascend'],
      searchAppId:[],
      searchAppName:[],
      app_names:[],
      tableData:[],
      priority:5,
      amendStatus:[],
      rowSelection:{
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRowKeys,selectedRows);
              this.rowSelection.selectedRowKeys = selectedRowKeys;
              this.amendStatus=selectedRows;
              if(selectedRows.length!=0) {
                  this.isStatus=true;
              }else {
                  this.isStatus=false;
              }
          },
          getCheckboxProps: (record) => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
          }),
          selectedRowKeys:[]
      },
      buyerLoading:false,
      features:{},
      loading2:false,
    }
  },
  watch: {
    '$store.state.Util.language'(newVal,oldVal){
        console.log(newVal,oldVal);
        this.Prioritys[0].label=`20(${this.$t('campaign.max')})`;
    }
  },
  created(){

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
          
        if (this.features.ALLOW_ACCESS_TO_EXCHANGE_ACTIVITIES) {
            store.dispatch("Util/OpenMenuKey",['/hl/buyer']);
            store.dispatch("Util/OpenKeys",['5']);
            store.dispatch("Util/Loading", false);
            // this.addPriority();
            this.getAppList();
            this.startTime= moment().subtract(30, "days").format('YYYY-MM-DD');
            this.endTime =  moment().format('YYYY-MM-DD');
            this.formatTime = ref([moment(this.startTime),moment(this.endTime)]);

            let appInfo=store.state.Util.appInfo;
            if(appInfo.length!=0){
              this.searchAppId.push(appInfo[0]);
              this.searchAppName.push(appInfo[1]);
              store.dispatch("Util/AppInfo",[]);
            }

            this.SellercampaignList("campaign");
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
    //跳转新建换量活动
    createBuyer() {
        this.$router.push({path:"/hl/createBuyer",query:{
          close:2,
        }})
    },
     // 选择列表项
    choose(e) {
      console.log(e);
      if(e.length>0) {
        this.isStatus=true;
      }else {
        this.isStatus=false;
        this.$refs.selectOperation.value=undefined;
      }
      this.amendStatus=e;
    },
    changeSearch(e,b){
      this.searchAppId=[];
      b.forEach(v=>{
        this.searchAppId.push(v.key);
      })
    },
    //编辑换量活动
    editingActivity(e){
      window.localStorage.setItem("CreativePage",this.currentPage)
      this.$router.push({
          path:"/hl/createBuyers",
          query:{
              activeName:"1",
              campaign_id:e[0],
              data:e[1],
              close:2,
          }
      })
    },
    // 编辑创意
    editCreative(e){
      window.localStorage.setItem("CreativePage",this.currentPage)
      let data="";
      this.tableData.forEach((item,index)=>{
        item.creative_list.forEach((v,i)=>{
          if(v.creative_id==e.creative_id){
            data=item;
          }
        })
      })
      if(data) {
          this.$router.push({
            path:"/hl/createBuyers",
            query:{
                activeName:"2",
                campaign_id:data.id,
                data:data,
                close:2,
            }
        })
      }
    },
    onChange () {
      console.log("12");
    },
    //页码变化
    PageCurrent(val){
      this.currentPage = val;
      this.SellercampaignList();
    },
    //每页条数变化
    handleSizeChange(e,p){
      this.pageSize = p;
      this.currentPage = 1;
      this.SellercampaignList();
    },
    // 切换创意状态
    switchStatus(row){
      this.loading2=true;
      let opt={
        id:row.creative_id,
        active:row.status=="1"?"0":"1",
      }
      this.$req.changeCreativeStatus(opt).then(res=>{
        if(res.data.code === 200){
            message.success(this.$t('campaign.switchingStatusSuccessful'));
            this.loading2=false;
            row.status==="1"?row.status = "0":row.status = "1";
            this.SellercampaignList('switch');
        }else{
          message.error(this.$t('campaign.switchingStatusFailed'));
          this.loading2=false;
        }
      }).catch(err=>{
          message.error(this.$t('campaign.unknownError'));
          this.loading2=false;
      })
    },
    // 搜索
    appSeerch(){
      this.currentPage=1;
      this.SellercampaignList();
    },
    expandIcon(props) {
        // console.log(props);
        if (props.expanded) {//有数据-展开时候图标
            return (
                <a
                    style="color: '#000',margin-right:0px"
                    onClick={(e) => {
                    props.onExpand(props.record, e);
                    }}
                >
                <UpOutlined />
                        
                </a>
            );
        } else {//有数据-未展开时候图标
            return (
                <a
                    style="color: '#000' ,margin-right:0px"
                    onClick={(e) => {
                    props.onExpand(props.record, e);
                    }}
                >
                <DownOutlined />
                </a>
            );
        }
    },
    //优化级功能废弃
    addPriority(){
      for (var i=1;i<20;i++){
        this.Prioritys.push({
          value:i,
          label:i,
        })
      }
    },
    // 批量操作
    operation({ key }){
      console.log(this.$t('campaign.deleteCrossPromotion'));
      console.log(key);
      switch(key){
          case "1":
        //  开启
          case "2":
        //  关闭  
          this.buyerLoading=true;
          // 开始
          let arr =[];
          this.amendStatus.forEach((item)=>{
            arr.push(item.id)
          });
          let opt={
            campaign_ids:arr.join(","),
            state:key==1?"active":"inactive",
          }
          this.$req.switchCampaign(opt).then(res=>{
            this.operations=undefined;
            this.$refs.selectOperation.value=undefined;
              if(res.data.code==200) {
                  message.success(this.$t('campaign.switchingStatusSuccessful'));
                  // this.rowSelection.selectedRowKeys=[];
                  this.$refs.table.clearSelection();
                  this.SellercampaignList();
                  this.buyerLoading=false;
                  
              }else {
                  message.error(this.$t('campaign.switchingStatusFailed'))
                  this.buyerLoading=false;
                  
              }
          }).catch((err)=>{
              this.operations=undefined;
              this.$refs.selectOperation.value=undefined;
              this.buyerLoading=false;
              message.error(this.$t('campaign.unknownError'))
          }) 
      break;
      case "3":
        //  删除
          this.$confirm({
              title:this.$t('campaign.deleteCrossPromotion'),
              content:this.$t('campaign.deleteCrossPromotionContent'),
              cancelText:this.$t('campaign.cancel'),
              okText:this.$t('campaign.enter'),
              icon: <ExclamationCircleOutlined  />,
              onOk:()=> {
                  this.operations=undefined;
                  this.$refs.selectOperation.value=undefined;
                  this.buyerLoading=true; 
                    let app_campaigns=""
                    let data={num_elements: this.pageSize,page:this.currentPage,}
                      let arr = [];
                      this.amendStatus.map((item,index)=>{
                        arr.push(item.id)
                      })
                      app_campaigns=arr.join(",") //处理此应用下得所有换量id并得到一组字符串
                    
                      let opt={
                      campaign_ids:app_campaigns,
                      }
                  this.$req.DelCampaign(opt).then(res=>{
                        if(res.data.code === 200){
                          message.success(this.$t('campaign.deleteSuccessful'));
                          // this.rowSelection.selectedRowKeys=[];
                          this.$refs.table.clearSelection();
                          this.SellercampaignList();
                          this.buyerLoading=true;
                        }else{
                          message.error(this.$t('campaign.deleteFailed'));
                          this.buyerLoading=true;
                        }
                  }).catch(err=>{
                        message.error(this.$t('campaign.unknownError'));
                        this.buyerLoading=true;

                  })
                  
              },
              onCancel:()=> {
                  this.operations=undefined;
                  this.$refs.selectOperation.value=undefined;
              },
          });
          break;
      }
    },
    // 获取所有APP
    getAppList(){
        let opt = {name:"",is_up:1}
        this.$req.appNameList(opt).then(res=>{
            if(res.data.code === 200){
                if(res.data.data){
                    this.app_names= res.data.data
                } else{
                    this.app_names = []
                }
            }
        })
    },
    // 排序
    listSort(e){
      if(e.order){
        if(e.order==="descending"){//升序排列
          this.sort= e.prop+'.desc';
          this.SellercampaignList();
        }else{
          this.sort= e.prop+'.asc';
          this.SellercampaignList();
        }
      }else {
        this.sort="";
        this.SellercampaignList();
      }
      
    },
    //获取换量列表数据
    SellercampaignList(e){
      this.$refs.selectOperation.value="";
      let data={
          num_elements: this.pageSize,
          page:this.currentPage||1,
          app_ids:null||this.searchAppId.join(','),
          start_time:null||this.formatTime[0].format("YYYY-MM-DD"),
          end_time:null||this.formatTime[1].format("YYYY-MM-DD"),
          sort:this.sort,
          campaign_id:this.campaign_id,
      }
      if(this.platforms){
        data.platform=this.platforms==1?"1":"0";
      }
      e=="campaign"?store.dispatch("Util/Loading",true):!e?this.buyerLoading=true:'';
      this.$req.SellercampaignList(data).then(res=>{
        if(res.data.code=200){
          console.log("999",res.data.data.campaigns);
          
          if(res.data.data.campaigns.length){
            console.log("sfds");
              let data=res.data
              this.total = data.data.total;//总条数
              this.tableData = data.data.campaigns
              this.tableData.map((val,index)=>{
                val.Activenum =0;
                val.priority=Number(val.priority);
              })
          }else{
            console.log("6666");
            this.total = 0;//总条数
            this.tableData=[];
            if(Number(res.data.data.total)!=0){
              this.currentPage=this.currentPage-1;
              this.SellercampaignList();
            }
            // setTimeout(()=>{
            //     let empty=document.querySelector(".el-table__empty-text");
            //     console.log(empty);
            //     empty.innerHTML="<div class='icon-div'><i class='iconfont icon'>&#xe635;</i></div>暂无数据<br />点击<i class='purple'>新建换量活动</i>,开启应用推广";
            //     empty.addEventListener('click',(e)=>{
            //       console.log(e.target.nodeName);
            //       if(e.target.nodeName=="I"){
            //         this.$router.push({path:"/hl/createBuyer",query:{
            //             close:2,
            //           }})
            //       }
            //     })
            //   },0)
          }
          e=="campaign"?store.dispatch("Util/Loading",false):!e?this.buyerLoading=false:'';
          // e=="campaign"?store.dispatch("Util/Loading",false):this.buyerLoading=false;
        }else {
          message.error(res.data.msg)
          e=="campaign"?store.dispatch("Util/Loading",false):!e?this.buyerLoading=false:'';
          // e=="campaign"?store.dispatch("Util/Loading",false):this.buyerLoading=false;
        }
      }).catch(err=>{
        e=="campaign"?store.dispatch("Util/Loading",false):!e?this.buyerLoading=false:'';
        // e=="campaign"?store.dispatch("Util/Loading",false):this.buyerLoading=false;
      })
    },
    // 修改优先级
    priorityChange(e){
      console.log(e);
      this.buyerLoading=true;
      let opt ={
        campaign_id:e.id,
        app_id:e.app_id,
        priority:e.priority,
      }
      this.$req.EditPriority(opt).then(res=>{
        if(res.data.code==200){
          this.buyerLoading=false;
          message.success(this.$t('campaign.editSuccessful'));
        
          this.SellercampaignList();
        }else {
          this.buyerLoading=false;
          message.success(this.$t('campaign.editFailed'))
          
          this.SellercampaignList();
        }
      }).catch(err=>{
          this.buyerLoading=false;
          message.success(this.$t('campaign.unknownError'));
          
          this.SellercampaignList();
      })
    }
  },
};
</script>
<style>
  .app .icon{
    font-size: 64px;
    color:#909399;
    margin: 0;
  }
  .app .icon-div{
    margin-top: 20px;
    height: 64px;
  }
  .app .empty-div{
    height: 30px;
    line-height: 30px;
    margin-bottom: 20px;
  }
</style>
<style lang="less" scoped>
/deep/.ant-popover-placement-right{
  width: 350px!important;
  .ant-popover-inner-content{
    width: 350px!important;
  }
}
.app {
  h1 {
    font-size:16px;
  }
  .purple {
    margin-right: 0;
  }
  .editPurple{
    margin: 0;
  }
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  // animation: fold-lef-in;
  // animation-direction: 0.3s;
  
  /deep/.ant-calendar-picker-input {
    // border-radius: 10px;
    // height: 35px;
    // background-color: #eaf5ff;
    // border-color: #eaf5ff;
    margin-right: 16px;
    // .ant-calendar-range-picker-input:last-child::after{
    //   content: "2143";
    // }
    // .ant-calendar-picker-icon{
    //   background: url("//console-style.hl.com/images/dspcom/normal_u109.svg") no-repeat ;
    //   background-size: 14px 14px;
    //   &:hover{
    //     background: url("//console-style.hl.com/images/dspcom/normal_u110.svg") no-repeat ;
    //   background-size: 14px 14px;
    //   }
    // }

    
    // &:focus {
    //   border-color: #827af3;
    //   box-shadow: none;
    // }
    // .ant-input {
    //   background-color: #eaf5ff;
    //   color: rgb(117, 117, 117);
    // }
    // .ant-input-suffix {
    //   .ant-input-search-icon {
    //     color: #6d73f6;
    //   }
    // }
  }
  .search_app {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    position: relative;
    .note{
      position: absolute;
      top: -45px;
      left: 760px;
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      padding-right: 20px;
      margin-bottom: 0;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: #ddd 0px 0px 5px;
      display: none;
    }
    /deep/.searchName{
      /* margin-right: 20px; */
      // .ant-select-selector {
      //   border-radius: 10px;
      //   height: 35px;
      //   align-items: center;
      //   line-height: 35px;
      //   background-color: #eaf5ff;
      //   border-color: #eaf5ff;
      //   &:hover {
      //     border-color: #827af3;
      //   }
      //   &:focus {
      //     border-color: #827af3;
          
      //   }
      //   .ant-select-selection-placeholder{
      //     color: #757575;
      //   }
      //   .ant-select-selection-overflow{
      //     height: 35px;
      //     .ant-select-selection-overflow-item{
      //       height: 32px;
      //       .ant-select-selection-item{
      //         height: 22px;
      //       }
      //       .ant-select-selection-search{
      //         height: 22px;
      //         display: flex;
      //         align-items: center;
      //       }
      //     }
      //     .ant-select-selection-overflow-item-rest{
      //       .ant-select-selection-item{
      //         margin-top: 4px;
      //       }
      //     }
      //   }
      
      // }
    
    }
    /deep/.ant-select {
      // vertical-align: middle;
      /* margin-right: 16px; */
      .ant-select-selector {
        // background-color: #eaf5ff;
        // border-color: #eaf5ff;
        // border-radius: 10px;
        // height: 35px;
        .ant-select-selection-overflow-item {
          max-width: 125px;
        }
        // &:hover {
        //   border-color: #827af3;
        // }
        // &:focus {
        //   border-color: #827af3;
        //   box-shadow: none;
        // }
        // .ant-select-selection-placeholder {
        //   color: #757575;
        //   line-height: 34px;
        // }
      }
    }
    /deep/.CreativeSearch{
        // border-radius: 10px;
        // height: 35px;
        // background-color: #eaf5ff;
        // border-color: #eaf5ff;
        //margin-right:16px;
        // .ant-input{
        //     background-color: transparent;
        // }
        // &:hover {
        //     border-color: #827af3;
        // }
        // &:focus {
        //     border-color: #827af3;
        //     box-shadow: none;
        // }
    }
  }
  .create_buyer {
    margin-bottom: 20px;
    /deep/.batchOperation{
      .ant-select-selector {
          // border-radius: 10px;
          // height: 35px;
          align-items: center;
          // line-height: 35px;
          // background-color: #eaf5ff;
          // border-color: #eaf5ff;
          // .ant-select-selection-placeholder {
          //   color: #757575;
          // }
          // input {
          //   color: #757575;
          // }
          // &:hover {
          //   border-color: #827af3;
          // }
          // &:focus {
          //   border-color: #827af3;
            
          // }
    }
    
  }
  }

  /deep/.search_primary {
    /* margin-left: 16px; */
  
    // &:after {
    //   content: "";
    //   display: none;
    // }
  
  
  }
  /deep/.create_primary {
    /* margin-right: 16px; */
    // background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
    // border: none;
    // border-radius: 0.1rem;
    // &:after {
    //   content: "";
    //   display: none;
    // }
    // &:hover {
    //   background-image: linear-gradient(to right, #79b8f1 0%, #6577c8 100%);
    // }
    // &:active {
    //   background-color: #827af3;
    //   background: #827af3;
    // }
  }
  // /deep/.action_primary {
  //   border-radius: 0.1rem;
  //   background-color: #eaf5ff;
  //   border-color: #eaf5ff;
  // }
  .mins{
    overflow:hidden; //超出的隐藏
    text-overflow:ellipsis;//省略号
    white-space:nowrap;//强制一行显示
  }
  .app_imgs {
      display: flex;
      justify-content: left;
      overflow:hidden; //超出的隐藏
      text-overflow:ellipsis;//省略号
      white-space:nowrap;//强制一行显示
    /deep/.images{
      width: 30px;
      height: 30px;
      border-radius: 5px;
    }
    .app_names {
      display: flex;
      vertical-align: middle;
      flex-direction: column;
      justify-content: space-between;
      line-height: 0.16rem;
      margin-left: 10px;
      overflow:hidden; //超出的隐藏
      text-overflow:ellipsis;//省略号
      white-space:nowrap;//强制一行显示
      span {
        display: block;

      }
      .min {
        overflow:hidden; //超出的隐藏
        text-overflow:ellipsis;//省略号
        white-space:nowrap;//强制一行显示
      }
    }
  }
  // /deep/.selectPriority{
  //   width: 100px!important;
  //   .ant-select-selector {
  //         border-radius: 17px;
  //         height: 35px;
  //         align-items: center;
  //         line-height: 35px;
  //         font-size: 12px;
  //         input {
  //           color: #757575;
  //         }
  //         &:hover {
  //           border-color: #827af3;
  //         }
  //         &:focus {
  //           border-color: #827af3;
            
  //         }
  //   }
  // }
    /deep/.tablist{
      .ant-table-thead > tr > th{
        padding-left: 10px;
        padding-right: 10px;
        background-color: #f2f2f2;
      }
      .ant-table-tbody{
        .ant-table-row {
          td {
            padding: 10px;
          }
        }

      }
      .ant-table-wrapper{
        margin: 2px;
      }
      .ant-table-expanded-row{
        .ant-table-thead > tr > th{
          padding-left: 20px;
          padding-right: 20px;
          background-color: #fff;
          color: #000;
        }
          td{
            padding-right: 70px;
            padding-left: 70px;
          }
          .ant-table-placeholder{
            display: none;
          }
          .ant-table-body{
            padding-left: 5px;
            padding-right: 5px;
            background-color: #fbfbfb;
          }
          table{
          margin-top: 20px;
          margin-bottom: 20px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: #aaa 3px 3px 8px;
          .ant-table-thead > tr > th{
            background-color: #fff;
            font-weight: 400;
          }
          .ant-table-row {
            td {
              padding-right: 20px;
              padding-left: 20px;
            }
        }
          td{
            padding: 20px;
          }
        }
      }
      
    }

    /deep/.el-table{
      font-size: 12px;
        th{
            background:#f2f2f2;
            color: #7f7f7f;
        }
        .caret-wrapper{
            width: 15px;
        }
        th.is-sortable{
            .cell{
                .caret-wrapper{
                    display: none;
                    .sort-caret.ascending {
                        border-bottom-color: #f0f0f0;
                    }
                    .sort-caret.descending{
                        border-top-color: #f0f0f0;
                    }
                }
            }
            &:hover{
                background-color: #aaaaaa;
                color: #f0f0f0;
                .cell{
                    .caret-wrapper{
                        display:inline-flex;
                    }
                }
            }
        }
        th.descending.is-sortable{
            .cell{
                .caret-wrapper{
                    display:inline-flex;
                    .sort-caret.descending{
                        border-top-color: #409EFF;
                    }
                }
            }
        }
        th.ascending.is-sortable{
            .cell{
                .caret-wrapper{
                    display:inline-flex;
                    .sort-caret.ascending{
                        border-bottom-color: #409EFF;
                    }
                }
            }
        }
        .el-table__expanded-cell{
          .el-table{
            border-radius: 10px!important;
          }
          .el-table__header{
            th{
              .cell {
                font-weight: 400!important;
                color: #000!important;
              }
            }
          }
        }
       
        .el-table-column--selection{
            .is-checked{
                .el-checkbox__inner{
                    background-color: #6577c8;
                    border-color:#6577c8;
                }
            }
            .el-checkbox__inner:hover{
                    border-color:#6577c8;
            }
            .is-indeterminate .el-checkbox__inner{
               background-color: #6577c8;
                    border-color:#6577c8;
            }
            
        }
    }

    /deep/.el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #e6f7ff;
    }
    /deep/.el-table__expand-icon>.el-icon{
      font-weight: 700;
      transform: rotate(90deg);
    }
    /deep/.el-table__expand-icon--expanded{
      transform: rotate(180deg);
    }
    /deep/.el-table th>.cell{
      vertical-align: middle;
    }
  .purple {
    margin-right: 0;
  }
  .doubt {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-left: 8px;
      line-height: 20px;
      vertical-align: middle;
      // background: url("//console-style.hl.com/images/dspcom/normal_u109.svg") no-repeat ;
      // background-size: 14px 14px;
  }
  // .doubt:hover {
  //     background: url("//console-style.hl.com/images/dspcom/normal_u110.svg") no-repeat ;
  //     background-size: 14px 14px;
  // }
  .pause {
    display: inline-block;
      width: 20px;
      height: 20px;
      background: url("//console-style.hl.com/images/dspcom/stop.svg") no-repeat ;
      background-size: 20px 20px;
  }
  .finish {
    display: inline-block;
      width: 20px;
      height: 20px;
      background: url("//console-style.hl.com/images/dspcom/done.svg") no-repeat ;
      background-size: 20px 20px;
  }
  .activity {
    display: inline-block;
      width: 20px;
      height: 20px;
      background: url("//console-style.hl.com/images/dspcom/running.svg") no-repeat ;
      background-size: 20px 20px;

  }
  .red {
    display: inline-block;
      width: 20px;
      height: 20px;
      background: url("//console-style.hl.com/images/dspcom/warning.svg") no-repeat ;
      background-size: 20px 20px;
  }
  .open {
      display: inline-block;
      width: 20px;
      margin-left: 4px;
      height: 20px;
      background: url("//console-style.hl.com/images/dspcom/normal_u420.svg") no-repeat ;
      background-size: 20px 20px;
  }
  .pauses {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url("//console-style.hl.com/images/dspcom/normal_u419.svg") no-repeat ;
      background-size: 20px 20px;
  }
}
</style>
