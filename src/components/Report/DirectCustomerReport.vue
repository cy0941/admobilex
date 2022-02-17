<template>
    <div class="ReportForm clearfix"  ref="crossPromotion" >
    <div class="ReportHeader clearfix">
        <div style="float:left;" class="clearfix">
            <span style="margin: 0px 0.45rem 0 0.35rem;line-height:35px;">{{$t('report.filters')}}</span>
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
            <!-- <a-select
                
                mode="multiple"
                v-model:value="searchAppName"
                style="width:230px;margin-left:15px;"
                :placeholder="$t('DirCusCampaign.appName')"
                showArrow
                :maxTagCount="1"
                @change="changeSearch"
            >
                <template #suffixIcon>
                    <SearchOutlined style="color:#6577c8"/>
                </template>
                <a-select-option v-for="item in AppData" :value="item.appInfo.app_official_name" :key="item.appInfo.id">
                </a-select-option>
            </a-select> -->
            <!-- <a-input
                class="CreativeSearch"
                v-model:value="directCampaign"
                :placeholder="$t('DirCusCampaign.DirectCustomerCampaignsNameID')"
                style="width:230px;"
            /> -->
            <a-select
                
                mode="multiple"
                v-model:value="group"
                style="width:230px;margin-left:8px;"
                :placeholder="$t('DirCusGroup.DirectCustomerGroup')"
                showArrow
                :maxTagCount="1"
                @change="changeSearch"
                optionFilterProp="label"
            >
                <template #suffixIcon>
                    <SearchOutlined />
                </template>
                <a-select-option v-for="item in directNameList" :value="item.campaign_group_id" :key="item.id" :label="item.name">{{item.name}}
                </a-select-option>
            </a-select>
            <a-input
                class="CreativeSearch"
                v-model:value="CreativeId"
                :placeholder="$t('report.creativeID')"
                style="width:230px;"
                type="number"
            />
            <a-select
                v-model:value="timeZone"
                style="width: 220px;"
                placeholder="选择时区"
                showArrow
                @change="timeZoneChange"
            >
                <a-select-option v-for="item in timeZones" :key="item.value" :value="item.value">
                    <span>{{item.label}}</span>
                </a-select-option>
            </a-select>
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
            :getPopupContainer="()=>$refs.crossPromotion"
            cancel-text=""
            :maskClosable="false">
                
                <template #title>
                    <div class="customized_metrics">
                        <p>{{$t('fullReport.CustomizedMetrics')}}</p>
                        <a-button class="enterBtn" @click="closeSelectMetrics">{{$t('fullReport.enter')}}</a-button>
                    </div>
                    <a-checkbox-group class="select_metrics" v-model:value="indicatorsList" name="checkboxgroup" :options="indicators"/>
                </template>
                <a-button @click="openCustomized" style="margin-right:20px;z-index:999" class="export-buttons">{{$t('fullReport.CustomizedMetrics')}}</a-button>
            </a-popconfirm>
            <a-button @click="exportToExcel" style="z-index:999" class="export-buttons">{{$t('report.export')}}</a-button>
        </div>
        
        <el-table
            :data="formdata"
            style="width: 100%;"
            id="table"
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
    </div>
</div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script >
import {CalendarOutlined,DownOutlined,AppleOutlined,AndroidOutlined,SearchOutlined} from '@ant-design/icons-vue';
import moment from 'moment';
import XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { useI18n } from 'vue-i18n';
import {defineComponent,reactive,ref,toRefs} from "vue";
import timezone from "../../utils/timeZine.json"
import { Empty } from 'ant-design-vue';
import store from "@/store";
import { message} from 'ant-design-vue';

export default defineComponent ({
    name:"ReportForm",
    props:{type:Number},
    components:{
        CalendarOutlined,
        DownOutlined,
        AppleOutlined,
        AndroidOutlined,
        SearchOutlined
    },
    setup(props){
        const { t } = useI18n();
        const buyerColumn = {
            indicators:[
                {label: "eCPM", value: 'ecpm',sorter:'custom',isSelect:true,field:'ecpm',},
                {label: t('fullReport.Revenue'), value: 'revenue',sorter:'custom',isSelect:true,field:'revenue',},
                {label: t('report.Imps'), value: 'imps',sorter:'custom',isSelect:true, field:'imps',},
                {label: t('report.Clicks'), value: 'clicks',sorter:'custom',isSelect:true, field:'clicks',},
                {label: t('report.Ctr'), value: 'ctr',sorter:'custom',isSelect:true,field:'ctr',},
                {label: t('report.servingCreativeAmount'), value: 'creative_count',sorter:'custom',isSelect:true,field:'creative_count',},
            ],
            dimension:[
                {label:t('report.month'),  value: 'ym',sorter:'custom',isSelect:true,group_by:'month',},
                {label:t('report.date'),  value: 'ymd',sorter:'custom',isSelect:true,group_by:'date',},
                {label:t('DirCusGroup.DirectCustomerGroup'),  value: 'direct_campaign_group_name',sorter:'custom',isSelect:true,group_by:'direct_campaign_group',},
                {label:t('fullReport.DirectCustomer'),  value: 'direct_campaign_name',sorter:'custom',isSelect:true,group_by:'direct_campaign',},
                {label:t('report.creative'),value: 'creative_name',sorter:'custom',isSelect:true,group_by:'creative',},
                {label:t('report.adType'),value: 'placement_type',sorter:'custom',isSelect:true,group_by:'creative_type',},
                {label:t('report.adUnit'), value: 'placement_name',sorter:'custom',isSelect:true,group_by:'seller_placement',},
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
            directCampaign:"",
            directCustomerGroup:[],
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
            directNameList:[],
            group:[],
            timeZone:undefined,
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
        switch(this.type){
            case  1:   
                this.GetAppList();
            break;
        }
        this.getDirectCustomer();
        this.timeZones=timezone;
        this.timeZones=this.timeZones.filter(val=>{
            return val.value!=store.state["User"].userInfo.timezone
        });
        this.timeZones.unshift({
            value:store.state["User"].userInfo.timezone,
            label:t("fullReport.accountTimeZone")
        })
        this.timeZone=store.state["Util"].directCustomerReportTimeZone?store.state["Util"].directCustomerReportTimeZone:store.state["User"].userInfo.timezone;
        console.log(this.timeZone,'时区');
        this.GetData()
    },
    methods:{
        timeZoneChange(e){
            store.dispatch("Util/SetDirectCustomerReportTimeZone",e);
        },
        getDirectCustomer(){
            this.$req.directNameList().then(res=>{
            
                if(res.data.data.length>0){
                    this.directNameList=res.data.data;
                
                    store.dispatch("Util/Loading", false);
                }else{
                    this.directNameList=[]
                }
                store.dispatch("Util/Loading", false);
            })
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
            this.directCustomerGroup=[];
            console.log(b);
            
            b.forEach(v=>{
                this.directCustomerGroup.push(v.value);
            })
        },
        searchList(){
            this.currentPage=1;
            this.GetData();
        },
        GetData(){
            let opt={
                // direct_campaign_id:this.directCampaign || null,
                page: this.currentPage,
                element_num:this.pageSize,
                direct_campaign_group_id:this.directCustomerGroup.join(",") || null,
                group_by:{},field:{},
                start_time:this.date[0].format("YYYY-MM-DD"),
                end_time:this.date[1].format("YYYY-MM-DD"),
                sort:null||this.sort,
                media_name:this.MaterialName || null,
                ctr_low:this.ctr.less || null,
                ctr_high:this.ctr.more || null,
                imps_low:this.ShowNum.less || null,
                imps_high:this.ShowNum.more || null,
                creative_id:this.CreativeId || null,
                timezone:this.timeZone,
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
            
        
            this.GetBuyer(opt);
        },
        GetBuyer(opt){
            if(opt.page && opt.element_num){
                store.dispatch("Util/Loading",true)
                this.formdata=[]
                this.$req.getDirectReport(opt).then(res=>{
                    if(res.data.code === 200){
                        store.dispatch("Util/Loading",false)
                        this.total =res.data.data.total
                        let data = res.data.data.directReport
                        if(data.length !== 0){ //表格数据
                            data.map((item,index)=>{
                                item.key = index
                            })
                            this.formdata=data
                        }else{
                            this.formdata=[]
                        }
                    }else{
                        message.error(res.data.msg)
                        store.dispatch("Util/Loading",false)
                    }
                }).catch(err=>{
                    store.dispatch("Util/Loading",false)
                })
            }else{
                this.exportData = []
                this.$req.getDirectReport(opt).then(res => {
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
            if(e.order){
                if(e.order==="descending"){//升序排列
                    this.sort= e.prop+'.desc'
                }else{
                    this.sort= e.prop+'.asc'
                }
            }else{
                this.sort = undefined
            }
            this.GetData();
        },
        export(){
            let opt={
                app_platform:this.PlatForm.join(",") || null,
                app_id:this.appIds.join(",") || null,
                group_by:{},field:{},
                start_time:this.date[0].format("YYYY-MM-DD"),
                end_time:this.date[1].format("YYYY-MM-DD"),
                sort:null||this.sort,
                media_name:this.MaterialName || null,
                ctr_low:this.ctr.less || null,
                ctr_high:this.ctr.more || null,
                imps_low:this.ShowNum.less || null,
                imps_high:this.ShowNum.more || null,
                creative_id:this.CreativeId || null
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
            // this.export()
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
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    border-top-left-radius: 0;
    /deep/.ant-popover-placement-bottomRight {
        .ant-popover-content{
            width: 450px;
        }
        .customized_metrics{
            display: flex;
            justify-content: space-between;
        }
        .select_metrics{
            display: flex;
            // justify-content: space-betwee;
            flex-wrap: wrap;
            margin-top: 10px;
            .ant-checkbox-wrapper{
                width: 139px;
                margin: 8px 0 0;
            }
        }
        .ant-popover-message-title{
            padding-left: 0;
        }
        .ant-popover-message > .anticon{
            display: none;
        }
        .ant-popover-buttons{
            display: none;
        }

    }
.ReportHeader{

    box-sizing: border-box;
    .CreativeSearch{
        vertical-align: middle;
    }
    /deep/.CreativeSearch,/deep/.ctrImpsNum{
        margin-left:8px;
    }
    /deep/.ctrImpsNum{
        width: 85px;
        margin-left:0px;
        text-align: center;
    }
    /deep/.ant-input-search {
        vertical-align: middle;
    }
    /deep/.ant-select{
        vertical-align: middle;
        margin-left: 8px;
    }
}
.ReportContent{
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