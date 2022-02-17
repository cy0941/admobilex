<template>
    <div class="ReportForm clearfix"  ref="comprehensive">
    <div class="ReportHeader clearfix">
        <div style="float:left;" class="clearfix">
            <span style="margin: 0px 0.45rem 0 0.35rem;line-height:32px;vertical-align: top;">{{$t('report.filters')}}</span>
            <div style="display: inline-block;">
                <a-range-picker 
                separator="-"
                style="width:320px;"
                format="YYYY-MM-DD"
                v-model:value="date"
                inputReadOnly
                :allowClear="false"
            >
                <template #suffixIcon>
                    <CalendarOutlined />
                </template>
            </a-range-picker>
            <a-select
                mode="multiple"
                v-model:value="PlatForm"
                style="width: 220px;"
                :placeholder="$t('fullReport.appPlatform')"
                :showSearch="false"
                showArrow
                @change="platFormChange"
            >
                <a-select-option :key="1">
                    <span><AppleFilled style="margin-right:5px;"/>iOS</span>
                </a-select-option>
                <a-select-option :key="2">
                    <span><AndroidFilled style="margin-right:5px;"/>Android</span>
                </a-select-option>
            </a-select>
            <a-select
                mode="multiple"
                v-model:value="searchAppName"
                style="width:230px;"
                :placeholder="$t('report.appName')"
                option-label-prop="label"
                showArrow
                :maxTagCount="1"
                
                @change="changeSearch"
            >
                <template #suffixIcon>
                    <SearchOutlined />
                </template>
                <a-select-option v-for="item in AppData" :value="item.id" :label="item.app_official_name" :key="item.id">
                    <span>
                        <AppleFilled style="margin-right:5px;" v-if="item.platform==1"/>
                        <AndroidFilled style="margin-right:5px;" v-else/>
                        {{item.app_official_name}}
                    </span>
                </a-select-option>
            </a-select>
            <a-select
                v-model:value="adFormat"
                style="width: 230px"
                :placeholder="$t('fullReport.AdFormat')"
                ref="select"
                allowClear
                @change="adFormatChange"
            >
                <a-select-option value="banner">{{$t('fullReport.banner')}}</a-select-option>
                <a-select-option value="interstitial">{{$t('fullReport.insertion')}}</a-select-option>
                <a-select-option value="stimulate">{{$t('fullReport.motivationalVideos')}}</a-select-option>
                <a-select-option value="other">{{$t('fullReport.vastVideo')}}</a-select-option>
            </a-select>
            <a-select
            mode="multiple"
            v-model:value="adUnitName"
            style="width:230px;"
            :placeholder="$t('aggregate.adUnit')"
            showArrow
            :maxTagCount="1"
            option-label-prop="label"
            :maxTagTextLength="320"
            @change="adUnitChange"
            
            >
                <template #suffixIcon>
                    <SearchOutlined />
                </template>
                <a-select-option v-for="item in placements" :label="item.placement_Name"  :key="item.placement_id">
                    <span>{{item.placement_Name}}</span>
                </a-select-option>
            </a-select>
            <br />
            <a-select
            mode="multiple"
            v-model:value="adPlatform"
            style="width:230px;margin-left:0;margin-top:20px;"
            :placeholder="$t('fullReport.network')"
            showArrow
            show-search
            option-label-prop="label"
            @change="adPlatformChange"
            >
                <!-- <template #suffixIcon>
                    <DownOutlined style="color:#6577c8"/>
                </template> -->
                <a-select-option v-for="item in networkList" :value="item.name" :key="item.id">
                </a-select-option>
            </a-select>
            
            <a-select
            mode="multiple"
            option-label-prop="label"
            v-model:value="adSourceName"
            style="width:230px;margin-top:20px;"
            :placeholder="$t('fullReport.adSoureces')"
            showArrow
            show-search
            @change="adSourceChange"
            >
                <a-select-option v-for="item in adSourceList" :value="item.name" :key="item.id">
                    <!-- <span  >
                        {{item.media_Type=='banner'?`${$t('aggregate.banner')} ${item.placement_name}`:item.media_Type=='interstitial'?`${$t('aggregate.insertion')} ${item.placement_name}`:item.media_Type=='stimulate'?`${$t('aggregate.motivationalVideos')} ${item.placement_name}`:`${$t('aggregate.vastVideo')} ${item.placement_name}`}}
                    </span> -->
                    <span>
                        {{item.name}}
                    </span>
                </a-select-option>
            </a-select>
            <a-select
                v-model:value="timeZone"
                style="width: 220px;margin-top:20px;"
                placeholder="选择时区"
                showArrow
                @change="timeZoneChange"
            >
                <a-select-option v-for="item in timeZones" :key="item.value" :value="item.value">
                    <span>{{item.label}}</span>
                </a-select-option>
            </a-select>
            </div>
            <div style="padding: .07rem 0rem 0.15rem;margin-top:10px;">
                <span style="margin: 0px 0.45rem 0 0.35rem;">{{$t('report.dimensions')}}</span>
                <a-checkbox-group v-model:value="dimensionList" name="checkboxgroup" :options="dimension"/>
                <a-button type="primary"  @click="searchList" class="Confirm" style="float: right;">{{$t('report.submit')}}</a-button>
            </div>
            <!-- <div>
                <span style="margin: 0px 0.45rem 0 0.35rem;">{{$t('report.metrics')}}</span>
                <a-checkbox-group v-model:value="indicatorsList" name="checkboxgroup" :options="indicators"/>
                
            </div> -->
        </div>
    </div>
    <a-divider style="height: 1px; background-color:#f2f2f2" />
    <div class="ReportContent">
        <div style="text-align:right;margin-bottom:20px;">
            <a-popconfirm placement="bottomRight" 
            :visible="visibleMetrics" 
            trigger="click" 
            class="popconfirmMetrics"
            ok-text="" 
            :footer="null"
            :getPopupContainer="()=>$refs.comprehensive"
            cancel-text=""
            :maskClosable="false">
                <template #title>
                    <div class="customized_metrics">
                        <p>{{$t('fullReport.CustomizedMetrics')}}</p>
                        <div class="selectRight">
                            <a-button type="link" size="small" class="purple shisu_text_btn" @click="checkAll">{{$t('fullReport.selectAll')}}</a-button>/
                            <a-button type="link" size="small" class="purple shisu_text_btn" @click="counterElection">{{$t('fullReport.counterElection')}}</a-button>/
                            <a-button type="link" size="small" class="purple shisu_text_btn" @click="defaultCheckChange">{{$t('fullReport.Default')}}</a-button>/
                            <a-button class="enterBtn" @click="closeSelectMetrics">{{$t('fullReport.enter')}}</a-button>
                        </div>
                    </div>
                    <a-checkbox-group class="select_metrics" @change="indicatorsListChange" v-model:value="indicatorsList" name="checkboxgroup" :options="indicators"/>
                    <div style="margin-top:16px">
                        <a-checkbox v-model:checked="crossPromotion">{{$t('fullReport.corssPromotion')}}</a-checkbox>
                    </div>
                </template>
                <a-button @click="openCustomized" style="margin-right:20px;z-index:999" class="export-buttons">{{$t('fullReport.CustomizedMetrics')}}</a-button>
            </a-popconfirm>
            <a-button @click="exportToExcel" style="z-index:999" class="export-buttons">{{$t('report.export')}}</a-button>
        </div>
        <a-spin :spinning="compreHensiveLoading">
            <el-table
                :data="formdata"
                style="width: 100%;"
                row-class-name="row_border"
                @sort-change="SortChange"
                border
            >
                <template #empty>
                    <a-empty :image="EmptyImage"/>
                </template>
                <template v-for="item in columns">
                    <el-table-column
                        :key="item.label"
                        :label="item.label"
                        :prop="item.value"
                        :sortable="item.sorter"
                        :width="item.width"
                        :v-show="false"
                        show-overflow-tooltip
                        :sort-orders="sortOrders"
                        v-if="item.value!='creative_name'&&item.value!='placement_type'"
                    >
                    </el-table-column>
                    <el-table-column
                        prop=""
                        :sortable="item.sorter"
                        :v-show="false"
                        :key="item.label"
                        :label="item.label"
                        :width="item.width"
                        show-overflow-tooltip
                        :sort-orders="sortOrders"
                        v-else-if="item.value=='placement_type'">
                        <template #default="scope">
                            <div  class="adcreative">
                                <p>{{scope.row.placement_type=='banner'?$t('report.banner'):scope.row.placement_type=='other'?$t('report.vastVideo'):scope.row.placement_type=='interstitial'?$t('report.insertion'):$t('report.motivationalVideos')}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop=""
                        :sortable="item.sorter"
                        :v-show="false"
                        :key="item.label"
                        :label="item.label"
                        show-overflow-tooltip
                        :width="item.width"
                        :sort-orders="sortOrders"
                        v-if="item.value=='creative_name'">
                        <template #default="scope">
                            <div  class="adcreative">
                                <p>{{scope.row.creative_name}}</p>
                                <p >{{scope.row.creative_type=='banner'?$t('report.banner'):scope.row.creative_type=='other'?$t('report.vastVideo'):scope.row.creative_type=='interstitial'?$t('report.insertion'):$t('report.motivationalVideos')}}</p>
                            </div>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </a-spin>
        <a-pagination 
            :total="total"
            v-model:current="currentPage"
            :defaultPageSize="10"
            v-model:page-size="pageSize"
            :show-total="total => `${$t('myApp.total')} ${total} ${$t('myApp.article')}`" 
            show-size-changer 
            show-quick-jumper
            style="margin-top:15px;float:right"
            @change="PageSizeChange"
            @showSizeChange="PageSizeChange(1)"
        />
        <el-table
            :data="exportData"
            id="table"
            style="width: 100%;display:none;"
            row-class-name="row_border"
            :default-sort="{ order: 'descending'}"
            @sort-change="SortChange"
            border
        >
            <template v-for="item in columns">
                <el-table-column
                    :key="item.label"
                    :label="item.label"
                    :prop="item.value"
                    :sortable="item.sorter"
                    :v-show="false"
                    :width="item.width"
                    show-overflow-tooltip
                    :sort-orders="sortOrders"
                    v-if="item.value!='creative_name'&&item.value!='placement_type'"
                >
                </el-table-column>
                <el-table-column
                    prop=""
                    :sortable="item.sorter"
                    :v-show="false"
                    :key="item.label"
                    :label="item.label"
                    :width="item.width"
                    show-overflow-tooltip
                    :sort-orders="sortOrders"
                    v-else-if="item.value=='placement_type'">
                    <template #default="scope">
                        <div  class="adcreative">
                            <p>{{scope.row.placement_type=='banner'?$t('report.banner'):scope.row.placement_type=='other'?$t('report.vastVideo'):scope.row.placement_type=='interstitial'?$t('report.insertion'):$t('report.motivationalVideos')}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop=""
                    :sortable="item.sorter"
                    :v-show="false"
                    :key="item.label"
                    :width="item.width"
                    :label="item.label"
                    show-overflow-tooltip
                    :sort-orders="sortOrders"
                    v-if="item.value=='creative_name'">
                    <template #default="scope">
                        <div  class="adcreative">
                            <p>{{scope.row.creative_name}}</p>
                            <p >{{scope.row.creative_type=='banner'?$t('report.banner'):scope.row.creative_type=='video'?$t('report.vastVideo'):scope.row.creative_type=='interstitial'?$t('report.insertion'):$t('report.motivationalVideos')}}</p>
                        </div>
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </div>
  </div>
</template>
<style scoped>
    @import "../../../assets/css/index.css";
</style>
<script >
import {AppleFilled,AndroidFilled,CalendarOutlined,DownOutlined,AppleOutlined,AndroidOutlined,SearchOutlined,LinkedinOutlined,} from '@ant-design/icons-vue';
import moment from 'moment';
import XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { useI18n } from 'vue-i18n';
import timezone from "../../../utils/timeZine.json"
import {defineComponent,reactive,ref,toRefs} from "vue";
import { Empty } from 'ant-design-vue';
import store from "@/store";
import { message} from 'ant-design-vue';

export default defineComponent ({
    name:"comprehensive",
    props:{type:Number},
    components:{
        CalendarOutlined,
        DownOutlined,
        AppleOutlined,
        AndroidOutlined,
        SearchOutlined,
        LinkedinOutlined,
        AppleFilled,
        AndroidFilled
    },
    setup(props){
        const { t } = useI18n();
        const buyerColumn = {
            indicators:[
                {label: t('fullReport.DAU'), value: 'dau',sorter:'custom',isSelect:false,field:'dau',width:100},
                // {label: t('fullReport.ARPU'), value: 'revenue',sorter:'custom',isSelect:false,field:'ctr',width:100},
                {label: t('fullReport.newUsers'), value: 'new_user',sorter:'custom',isSelect:false,field:'new_user',width:100},
                {label: t('fullReport.newUsersDAU'), value: 'new_user_rate',sorter:'custom',isSelect:false,field:'new_user_rate',width:100},
                {label: t('fullReport.day2Retention'), value: 'retention',sorter:'custom',isSelect:false,field:'retention',width:100},
                {label: t('fullReport.DEU'), value: 'DEU',sorter:'deu',isSelect:false,field:'deu',width:100},
                {label: t('fullReport.DEUDAU'), value: 'permeate_rate',sorter:'custom',isSelect:false,field:'permeate_rate',width:100},
                {label: t('fullReport.ImpsDAU'), value: 'pre_imps',sorter:'custom',isSelect:false,field:'pre_imps',width:100},
                {label: t('fullReport.ImpsDEU'), value: 'imps_deu',sorter:'custom',isSelect:false,field:'imps_deu',width:100},
                // {label: "询价", value: 'inquiry',sorter:'custom',isSelect:false,field:'ctr',width:100},
                // {label: "询价响应率", value: 'RFQResponseRate',sorter:'custom',isSelect:false,field:'ctr',width:100},
                // {label: "询价响应eCPM", value: 'RFQResponseRateCPM',sorter:'custom',isSelect:false,field:'ctr',width:100},
                // {label: t('fullReport.EstimateRevenue'), value: 'estimated',sorter:'custom',isSelect:true,field:'ctr',width:100},
                // {label: t('fullReport.EstimateECPM'), value: 'estimatedECPM',sorter:'custom',isSelect:true,field:'ctr',width:100},
                {label: t('fullReport.Requests'), value: 'traffic_request',sorter:'custom',isSelect:true,field:'traffic_request',width:100},
                {label: t('fullReport.RequestsFillRate'), value: 'traffic_request_rate',sorter:'custom',isSelect:true,field:'traffic_request_rate',width:120},
                {label: t('report.Imps'), value: 'imps',sorter:'custom',isSelect:true, field:'imps',width:100},
                {label: t('fullReport.ImpsDate'), value: 'imps_rate',sorter:'custom',isSelect:true, field:'imps_rate',width:100},
                // {label: "eCPM", value: 'ecpm',sorter:'custom',isSelect:false, field:'imps',width:100},
                {label: t('report.Clicks'), value: 'clicks',sorter:'custom',isSelect:true, field:'clicks',width:100},
                {label: t('report.Ctr'), value: 'ctr',sorter:'custom',isSelect:true,field:'ctr',width:100},
                {label: t('fullReport.AdRequest'), value: 'mediation_requests',sorter:'custom',isSelect:true, field:'mediation_requests',width:100},
                {label: t('fullReport.AdRequestRate'), value: 'ad_request_rate',sorter:'custom',isSelect:true, field:'ad_request_rate',width:120},
                // {label: t('fullReport.ImpsGap'), value: 'impsGap',sorter:'custom',isSelect:true, field:'imps',width:100},
                // {label: t('fullReport.clickGap'), value: 'clickGap',sorter:'custom',isSelect:true, field:'imps',width:100},
                // {label: "isReady 调用次数", value: 'isReadyCalls',sorter:'custom',isSelect:false, field:'imps',width:100},
                // {label: "isReady 成功率", value: 'isReadySuccessRate',sorter:'custom',isSelect:false, field:'imps',width:100},
                // {label: t('fullReport.Revenue'), value: 'earnings',sorter:'custom',isSelect:false,field:'ctr',width:100},
                // {label: t('fullReport.ImpsAPI'), value: 'ImpsAPI',sorter:'custom',isSelect:false,field:'ctr',width:100},
                // {label: t('fullReport.eCPMAPI'), value: 'eCPMAPI',sorter:'custom',isSelect:false,field:'ctr',width:100},
                // {label: t('fullReport.ClickAPI'), value: 'clickAPI',sorter:'custom',isSelect:false,field:'ctr',width:100},
                // {label: t('fullReport.CTRAPI'), value: 'ctrAPI',sorter:'custom',isSelect:false,field:'ctr',width:100},
                // {label: t('fullReport.AttemptsAPI'), value: 'requestAPI',sorter:'custom',isSelect:false,field:'ctr',width:100},
                // {label: t('fullReport.AttemptFillRate'), value: 'fillingAPI',sorter:'custom',isSelect:false,field:'ctr',width:100},
            ],
            dimension:[
                {label:t('report.month'),  value: 'ym',sorter:'custom',isSelect:true,group_by:'month',width:100},
                {label:t('report.date'),  value: 'ymd',sorter:'custom',isSelect:true,group_by:'date',width:130},
                {label:t('fullReport.appPlatform'),value: 'platform',sorter:'custom',isSelect:true,group_by:'app_platform',width:165},
                {label:t('report.advertisingApp'),  value: 'mediate_app_name',sorter:'custom',isSelect:true,group_by:'app_name',width:135},
                {label:t('report.adUnit'), value: 'placement_name',sorter:'custom',isSelect:true,group_by:'placement_name',width:144},
                {label:t('report.adType'),value: 'media_type',sorter:'custom',isSelect:true,group_by:'placement_type',width:100},
                {label:t('fullReport.network'),  value: 'network_name',sorter:'custom',isSelect:true,group_by:'network',width:160},
                {label:t('fullReport.adSoureces'),value: 'mediation_name',sorter:'custom',isSelect:true,group_by:'mediation',width:144},
                
            ]
        }
        let indicators= [];
        let dimension =[];
        let indicatorsList =[];
        let dimensionList =[];
    
        indicators = buyerColumn.indicators;
        dimension = buyerColumn.dimension;
        indicators.forEach(item=>{
            if(item.isSelect){
                indicatorsList.push(item.value)
            }
        })
        dimension.forEach(item=>{
            if(item.isSelect){
                dimensionList.push(item.value)
            }
        })
        const date = ref([moment().subtract(30,"days"),moment()]);
        const state = reactive({
            appIds:[],
            searchAppName:[],
            PlatForm:[],
            CreativeId:"",
            MaterialName:"",
            dimensionList,
            indicatorsList,
            AppData:[],
            formdata:[],
            exportData:[],
            indicators,
            dimension,
            sortOrders:['descending', 'ascending', null],
            ctr:{ // 点击率
                less:null,
                more:null
            },
            ShowNum:{ //  展示次数
                less:null,
                more:null
            },
        })
        return{
            ...toRefs(state),
            date,
            currentPage:ref(1),
            pageSize:ref(10),
            total:ref(0),
            sort:ref(undefined),
            EmptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
            buyerColumn,
            
        }
    },
    data(){
        return {
            visibleMetrics:false,
            adUnitName:[],
            AppData:[],
            placements:[],
            adFormat:undefined,
            adPlatform:[],
            adSourceName:[],
            networkList:[],
            timeZone:undefined,
            crossPromotion:false,
            defaultCheck:[],
            adSourceList:[],
            placementIds:[],
            adPlatformIds:[],
            adSourceIds:[],
            compreHensiveLoading:false,
            timeZones:[],
        }
    },
    computed:{
        columns(){
            let arr = [];
            return arr.concat(this.dimension.filter(item=>item.isSelect),this.indicators.filter(item=>item.isSelect))
        }
    },
    mounted(){
        const { t } = useI18n();

        let sort=[];
        let final=[];
        let arr=[...this.buyerColumn.dimension,...this.buyerColumn.indicators];
        arr=arr.filter(item=>{
            return item.isSelect
        })
        arr.forEach(item=>{
            sort.push(item.value);
        })
        sort.map(val=>{
            val=val+' desc';
            final.push(val);
        })
        
        this.sort=final.toString();
        console.log(this.sort);
        
        this.timeZones=timezone;
        console.log(store.state["User"].userInfo.timezone);
        setTimeout(()=>{
            
            this.timeZone=store.state["Util"].comprehensiveFormTimeZone?store.state["Util"].comprehensiveFormTimeZone:store.state["User"].userInfo.timezone;
                this.timeZones=this.timeZones.filter(val=>{
                return val.value!=store.state["User"].userInfo.timezone
            });
            this.timeZones.unshift({
                value:store.state["User"].userInfo.timezone,
                label:t("fullReport.accountTimeZone")
            })
            this.GetData("one");
        },100)
        this.defaultCheck=JSON.parse(JSON.stringify(this.buyerColumn.indicators));
        
        // this.GetAppList();
        
        // this.getNetworkList();
    },
    methods:{
        indicatorsListChange(e){
            console.log(this.indicatorsList,e);
            
        },
        defaultCheckChange(){
            this.buyerColumn.indicators=JSON.parse(JSON.stringify(this.defaultCheck));
            this.indicatorsList=[];
            this.buyerColumn.indicators.map(item=>{
                if(item.isSelect){
                    this.indicatorsList.push(item.value)
                }
            })
        },
        platFormChange(e){
            console.log(e);
            this.searchAppName=undefined;
            this.adUnitName=[];
            this.appIds=[];
            this.placementIds=[];
            this.adPlatform=[];
            this.adPlatformIds=[];
            this.adSourceName=[];
            this.$req.getPlatformApp({platform:e.length?e.toString():''}).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.AppData=res.data.data.apps;
                }else{
                    this.AppData=[];
                }
            })
        },
        adFormatChange(e){
            this.adUnitName=[];
            this.placementIds=[];
            this.adPlatform=[];
            this.adPlatformIds=[];
            this.adSourceName=[];
            let opt={
                platform:this.PlatForm.toString(),
                app_id:this.appIds.toString(),
                media_type:this.adFormat,
            }
            this.$req.getPlatformApp(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.placements=res.data.data.placements;
                }else{
                    this.placements=[];
                }
            })
        },
        adUnitChange(e,b){
            this.placementIds=[];
            console.log(this.adUnitName);
            b.forEach(v=>{
                this.placementIds.push(v.key);
            })
            this.adPlatform=[];
            this.adSourceName=[];
            let opt={
                platform:this.PlatForm.toString(),
                app_id:this.appIds.toString(),
                media_type:this.adFormat,
                placement_id:this.placementIds.toString()
            }
            this.$req.getPlatformApp(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.networkList=res.data.data.networks;
                }else{
                    this.networkList=[];
                }
            })
        },
        adPlatformChange(e,b){
            this.adPlatformIds=[];
            b.forEach(v=>{
                this.adPlatformIds.push(v.key);
            })
            this.adSourceName=[];
            let opt={
                platform:this.PlatForm.toString(),
                app_id:this.appIds.toString(),
                media_type:this.adFormat,
                placement_id:this.placementIds.toString(),
                network_id:this.adPlatformIds.toString()
            }
            console.log(this.adPlatform,"广告平台");
            
            this.$req.getPlatformApp(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.adSourceList=res.data.data.mediates;
                }else{
                    this.adSourceList=[];
                }
            })
        },
        adSourceChange(e,b){
            this.adSourceIds=[];
            b.forEach(v=>{
                this.adSourceIds.push(v.key);
            })
        },
        checkAll(){
            console.log(this.buyerColumn.indicators);
            this.indicatorsList=[];
            this.buyerColumn.indicators.map(item=>{
                item.isSelect=true;
                if(item.isSelect){
                    this.indicatorsList.push(item.value)
                }
            })
        },
        counterElection(){
            this.indicatorsList=[];
            this.buyerColumn.indicators.map(item=>{
                item.isSelect=!item.isSelect;
                if(item.isSelect){
                    this.indicatorsList.push(item.value)
                }
            })
        },
        timeZoneChange(e){
            store.dispatch("Util/SetComprehensiveFormTimeZone",e);
        },
        closeSelectMetrics(){
            this.visibleMetrics=false;
        },
        openCustomized(){
            this.visibleMetrics=!this.visibleMetrics;
            console.log(this.visibleMetrics);
            
        },
        GetAppList(){
            let opt = {name:""}
            this.$req.appNameList(opt).then(res=>{
                if(res.data.code === 200){
                    console.log(res.data.data);
                    if(res.data.data){
                        this.AppData= res.data.data
                    } else{
                        this.AppData = []
                    }
                }
            })
        },
        changeSearch(e,b){
            console.log(this.searchAppName);
            
            this.adUnitName=[];
            this.placementIds=[];
            this.adPlatform=[];
            this.adPlatformIds=[];
            this.adSourceName=[];
            this.appIds=[];
            b.forEach(v=>{
                this.appIds.push(v.key);
            })
            this.$req.getPlatformApp({app_id:this.appIds.toString(),platform:this.PlatForm.toString()}).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.placements=res.data.data.placements;
                }else {
                    this.placements=[];
                }
            })
        },
        searchList(){
            this.currentPage=1;
            this.GetData();
        },
        getNetworkList(){
            store.dispatch("Util/Loading", true);
            this.$req.getPlatformList().then(res=>{
                console.log(res);
                if(res.data.code==200){
                    store.dispatch("Util/Loading", false);
                    
                    if(res.data.data.length){
                        this.networkList=res.data.data;
                        // this.rowDrop();
                    }else{
                        this.networkList=[];
                    }
                    if(this.networkList.length){
                            this.networkList.map(val=>{
                            val.active=val.active=="1"?true:false;
                        })
                    }
                }else {
                    message.error(this.$t('adPlatform.unknownError'));
                    store.dispatch("Util/Loading", false);
                }
            })
        },
        GetData(e){
            let opt={
                app_platform:this.PlatForm.join(",") || null,
                page: this.currentPage,
                element_num:this.pageSize,
                app_id:this.appIds.join(",") || null,
                group_by:{},field:{},
                start_time:this.date[0].format("YYYY-MM-DD"),
                end_time:this.date[1].format("YYYY-MM-DD"),
                sort:null||this.sort,
                // media_name:this.MaterialName || null,
                // ctr_low:this.ctr.less || null,
                // ctr_high:this.ctr.more || null,
                // imps_low:this.ShowNum.less || null,
                // imps_high:this.ShowNum.more || null,
                // creative_id:this.CreativeId || null,
                timezone:this.timeZone,
                placement_type:this.adFormat|| null,
                placement_ids:this.placementIds.join(",")||null,
                network_ids:this.adPlatformIds.join(",")||null,
                mediation_ids:this.adSourceIds.join(",")||null,
                campaign_direct:this.crossPromotion?1:0,
            }
            
            this.dimension.filter(item => item.isSelect = this.dimensionList.indexOf(item.value) > -1?true:false);
            this.indicators.filter(item =>item.isSelect = this.indicatorsList.indexOf(item.value) > -1 ? true : false);
            this.dimension.forEach(item=>{
                if(item.isSelect){
                    opt.group_by[item.group_by] = 1
                }
            })
            this.indicators.forEach(item=>{
                if(item.isSelect){
                    opt.field[item.field] = 1
                }
            })
            console.log(opt.group_by,opt.field);
            
            
            this.GetBuyer(opt,e);
        },
        GetBuyer(opt,e){
            if(opt.page && opt.element_num){
                e?store.dispatch("Util/Loading",true):this.compreHensiveLoading=true;
                this.formdata=[]
                this.$req.getSyntheticalReport(opt).then(res=>{
                    if(res.data.code === 200){
                        console.log(res.data.data.total);
                        
                        this.total =res.data.data.total;
                        let data = res.data.data.buyerReport;
                        if(data.length !== 0){ //表格数据
                            data.map((item,index)=>{
                                item.key = index
                            })
                            this.formdata=data
                        }else{
                            this.formdata=[]
                        }
                        e?store.dispatch("Util/Loading",false):this.compreHensiveLoading=false;
                    }else{
                        message.error(res.data.msg)
                        e?store.dispatch("Util/Loading",false):this.compreHensiveLoading=false;
                    }
                }).catch(err=>{
                    e?store.dispatch("Util/Loading",false):this.compreHensiveLoading=false;
                })
            }else{
                this.exportData = []
                this.$req.GetBuyer(opt).then(res => {
                    if(res.data.code === 200){
                        let data = res.data.data.buyerReport
                        if(data.length !== 0){
                            data.map((item,index)=>{
                                item.key = index
                            })
                            this.exportData = data
                        } else{
                            this.exportData = []
                        }
                    }else{
                        this.exportData = []
                    }
                })
            }
        },
        PageSizeChange(val){
            console.log(val);
            
            if(val === 1){
                this.currentPage = 1;
            }
            this.GetData()
        },
        CtrChange(){
            console.log(this.ctr.less);
            
            if(this.ctr.less > 100){
                this.ctr.less = 100;
            }else if(this.ctr.less < 0){
                this.ctr.less = 0;
            }else if(this.ctr.more > 100){
                this.ctr.more = 100;
            }else if(this.ctr.more < 0){
                this.ctr.more = 0
            }
        },
        InputBlur(){
            if(this.ctr.more && Number(this.ctr.less) > Number(this.ctr.more)){
                this.ctr.less = this.ctr.more
            }
            if(this.ShowNum.more && Number(this.ShowNum.less) > Number(this.ShowNum.more)){
                this.ShowNum.less = this.ShowNum.more
            }
        },
        SortChange(e){
            console.log(e);
            let sort=[];
            let final=[];
            let arr=[...this.buyerColumn.dimension,...this.buyerColumn.indicators];
            arr=arr.filter(item=>{
                return item.isSelect
            })
            arr.forEach((val,index)=>{
                if(val.value==e.prop){
                    arr=arr.slice(index);
                }
            })
            arr.forEach((item=>{
                sort.push(item.value)
            }))
            console.log(sort);
            
            if(e.order){
                if(e.order==="descending"){//升序排列
                    sort.map(val=>{
                        val=val+' desc';
                        console.log(val);
                        final.push(val);
                    })
                    console.log(final);
                    
                    this.sort= final.toString();
                }else{
                    sort.map(val=>{
                        val=val+' asc';
                        console.log(val);
                        final.push(val);
                        
                    })
                    this.sort= final.toString();
                }
            }else{
                sort.map(val=>{
                    val=val+' desc';
                    console.log(val);
                    final.push(val);
                })
                this.sort= final.toString();
            }
            console.log(this.sort);
            
            this.GetData();
        },
        export(){
            let opt={
                app_platform:this.PlatForm.join(",") || null,
                page: this.currentPage,
                element_num:this.pageSize,
                app_id:this.appIds.join(",") || null,
                group_by:{},field:{},
                start_time:this.date[0].format("YYYY-MM-DD"),
                end_time:this.date[1].format("YYYY-MM-DD"),
                sort:null||this.sort,
                // media_name:this.MaterialName || null,
                // ctr_low:this.ctr.less || null,
                // ctr_high:this.ctr.more || null,
                // imps_low:this.ShowNum.less || null,
                // imps_high:this.ShowNum.more || null,
                // creative_id:this.CreativeId || null,
                timezone:this.timeZone,
                placement_type:this.adFormat|| null,
                placement_ids:this.placementIds.join(",")||null,
                network_ids:this.adPlatformIds.join(",")||null,
                mediation_ids:this.adSourceIds.join(",")||null,
                campaign_direct:this.crossPromotion?1:0,
            }
            this.dimension.map(item=>{
                if(item.isSelect===true){
                    opt.group_by[item.group_by] = 1
                }
            })
            this.indicators.map(item=>{
                if(item.isSelect===true){
                    opt.field[item.field] = 1
                }
            })
            this.GetBuyer(opt)
        },
        exportToExcel(){
            this.export()
            setTimeout(function(){
                let et = XLSX.utils.table_to_book(document.getElementById('table')); //此处传入table的DOM节点
                let etout = XLSX.write(et, {
                    bookType: 'xlsx',
                    bookSST: true,
                    type: 'array'
                });
                try {
                    FileSaver.saveAs(new Blob([etout], {
                        type: 'application/octet-stream'
                    }), '报表.xlsx');   //trade-publish.xlsx 为导出的文件名
                } catch (e) {
                }
                return etout;
            },1000)
        },
    }
})
</script>
<style lang="less" scoped>
.ReportForm{
    /deep/.ant-popover-placement-bottomRight {
        .ant-popover-content{
            width: 600px;
        }
        .customized_metrics{
            display: flex;
            justify-content: space-between;
            .selectRight{
                .selectBtn{
                    display: inline-block;
                    cursor: pointer;
                    color: #6577c8;
                }
                .enterBtn{
                    margin-left: 8px;
                }
            }
            
        }
        .select_metrics{
            display: flex;
            // justify-content: space-betwee;
            flex-wrap: wrap;
            margin-top: 8px;
            .ant-checkbox-wrapper{
                width: 141px;
                margin: 8px 0 0;
            }
        }
        .purple {
            margin-right:0;
        }
        .ant-popover-message > .anticon{
            display: none;
        }
        .ant-popover-message-title{
            padding-left: 0;
        }
        .ant-popover-buttons{
            display: none;
            
        }

    }
    /deep/.ant-select {
        // margin-right: 16px;
        .ant-select-selector {
            .ant-select-selection-overflow-item {
            max-width: 125px;
            }
        
        }
    }

.ReportHeader{

    box-sizing: border-box;
    
    
    // /deep/.ant-input-search {
    //     vertical-align: middle;
    // }
    /deep/.ant-select{
        // vertical-align: middle;
        margin-left: 8px;
    }
    /deep/.Confirm{
        margin-top:-.1rem;
    }
}
.ReportContent{
    /deep/.creative_img{
        height: 54px;
        width: 96px;
        line-height: 54px;
        text-align: center;
        background: #eee;
        .images {
            height: 54px;
            width: 96px;
            object-fit: contain;
        }
    }
    .row_border td{
        border-right: none;
        border-bottom: 1px solid #f0f0f0;
    }
    /deep/.el-table--border{
        border: none;
        &::after{
            display: none;
            content:"";
        }
        .has-gutter{
            tr{
                th{
                    border-right-color:#fff;
                    &:last-child{
                        border-right: none;
                    }
                }
            }
        }
    }
    /deep/.el-table{
        .adcreative{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p{
                margin-bottom: 0;
            }
        }

    }
    /deep/.el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #e6f7ff;
    }
}
}
</style>