<template>
    <div class="ReportForm clearfix" >
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
            <a-select
                v-if="type === 1"
                mode="multiple"
                v-model:value="searchAppName"
                style="width:230px;margin-left:8px;"
                :placeholder="$t('report.appName')"
                showArrow
                :maxTagCount="1"
                @change="changeSearch"
            >
                <template #suffixIcon>
                    <SearchOutlined style="color:#6577c8"/>
                </template>
                <a-select-option v-for="item in AppData" :value="item.appInfo.app_official_name" :key="item.appInfo.id">
                    <span>
                        <AppleOutlined style="margin-right:5px;" v-if="item.appInfo.platform==1"/>
                        <AndroidOutlined style="margin-right:5px;" v-else/>
                        {{item.appInfo.app_official_name}}
                    </span>
                </a-select-option>
            </a-select>
            <a-select
                v-if="type === 1"
                mode="multiple"
                v-model:value="PlatForm"
                style="width: 220px;"
                :placeholder="$t('report.appPlatform')"
                :showSearch="false"
                showArrow
            >
                <a-select-option :key="1">
                    <span><AppleOutlined style="margin-right:5px;"/>iOS</span>
                </a-select-option>
                <a-select-option :key="0">
                    <span><AndroidOutlined style="margin-right:5px;"/>Android</span>
                </a-select-option>
            </a-select>
            <a-input
                class="CreativeSearch"
                v-model:value="CreativeId"
                :placeholder="$t('report.creativeID')"
                style="width:230px;"
                type="number"
            />
            <a-input
                v-if="type === 2"
                allowClear
                class="CreativeSearch"
                v-model:value="MaterialName"
                :placeholder="$t('report.sourceMaterial')"
                style="width:230px;"
            />
            <span v-if="type === 2" style="margin:0 20px">
                <span>{{$t('report.Ctr')}}</span>
                <a-input class="ctrImpsNum" style="margin-right:0.05rem;margin-left:0.1rem" :placeholder="$t('report.notLower')" type="number" v-model:value="ctr.less" @blur="InputBlur" @change="CtrChange" ></a-input>
                <span>%  -  </span>
                <a-input class="ctrImpsNum" style="margin-right:0.05rem" :placeholder="$t('report.notHigher')" type="number" v-model:value="ctr.more"  @blur="InputBlur" @change="CtrChange"></a-input>
                <span>%</span>
            </span>
            <span v-if="type === 2">
                <span>{{$t('report.Imps')}}</span>
                <a-input class="ctrImpsNum" style="margin-left:0.1rem" :placeholder="$t('report.notLower')" type="number" v-model:value="ShowNum.less" @blur="InputBlur"></a-input>
                <span>  -  </span>
                <a-input class="ctrImpsNum"  :placeholder="$t('report.notHigher')" type="number" v-model:value="ShowNum.more" @blur="InputBlur"></a-input>
            </span>
            <div style="padding: .07rem 0rem 0.15rem;">
                <span style="margin: 0px 0.45rem 0 0.35rem;">{{$t('report.dimensions')}}</span>
                <a-checkbox-group v-model:value="dimensionList" name="checkboxgroup" :options="dimension"/>
            </div>
            <div>
                <span style="margin: 0px 0.45rem 0 0.35rem;">{{$t('report.metrics')}}</span>
                <a-checkbox-group v-model:value="indicatorsList" name="checkboxgroup" :options="indicators"/>
                <a-button type="primary"  @click="searchList" class="Confirm" style="float: right;">{{$t('report.submit')}}</a-button>
            </div>
        </div>
    </div>
    <a-divider style="height: 1px; background-color:#f2f2f2" />
    <div class="ReportContent">
        <a-button @click="exportToExcel" style="float:right;margin-bottom:0.18rem;z-index:999" class="export-button">{{$t('report.export')}}</a-button>
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
            <el-table-column
                prop="icon"
                :label="$t('report.sourceMaterial')"
                width="160"
                show-overflow-tooltip
                v-if="type === 2">
                <!--插入图片链接的代码-->
                <template  #default="scope">
                    <div class="creative_img">
                        <a-image
                            class="images"
                            :src="scope.row.material_url"
                            fallback="data:image/png;base64,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"
                        />
                    </div>
                </template>
            </el-table-column>
            <el-table-column :sort-orders="sortOrders" :label="$t('report.sourceMaterialID')"  prop='material_id' sortable='custom' width="150" align="left" v-if="type === 2" show-overflow-tooltip :v-show="false"></el-table-column>
            <el-table-column  :label="$t('report.sourceMaterialType')"  prop='material_type'  width="150" align="left" v-if="type === 2" show-overflow-tooltip :v-show="false"></el-table-column>
            <el-table-column :sort-orders="sortOrders" :label="$t('report.associatedApp')" width="120"  prop='app_name' sortable='custom' align="left" v-if="type === 2" show-overflow-tooltip :v-show="false"></el-table-column>
            <!-- <el-table-column
                v-for="item in columns"
                :key="item.label"
                :label="item.label"
                :prop="item.value"
                :sortable="item.sorter"
                :v-show="false"
                :sort-orders="sortOrders"
                show-overflow-tooltip
            >
            </el-table-column> -->
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
                    v-else-if="item.value=='placement_type'&&type !== 2">
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
                            <p v-if="type !== 2">{{scope.row.creative_type=='banner'?$t('report.banner'):scope.row.creative_type=='other'?$t('report.vastVideo'):scope.row.creative_type=='interstitial'?$t('report.insertion'):$t('report.motivationalVideos')}}</p>
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
        <el-table
            :data="exportData"
            id="table"
            style="width: 100%;display:none;"
            row-class-name="row_border"
            :default-sort="{ order: 'descending'}"
            @sort-change="SortChange"
            border
        >
            <el-table-column
                prop="icon"
                :label="$t('report.sourceMaterial')"
                width="160"
                show-overflow-tooltip
                v-if="type === 2">
                <!--插入图片链接的代码-->
                <template  #default="scope">
                    <div class="creative_img">
                        <a-image
                            class="images"
                            :src="scope.row.material_url"
                            fallback="data:image/png;base64,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"
                        />
                    </div>
                </template>
            </el-table-column>
            <el-table-column  :sort-orders="sortOrders" :label="$t('report.sourceMaterialID')"  prop='material_id' width="150" sortable='custom' align="left" v-if="type === 2" show-overflow-tooltip :v-show="false"></el-table-column>
            <el-table-column  :label="$t('report.sourceMaterialType')"  prop='material_type'  width="150" align="left" v-if="type === 2" show-overflow-tooltip :v-show="false"></el-table-column>
            <el-table-column :sort-orders="sortOrders" :label="$t('report.associatedApp')"  width="120" prop='app_name' sortable='custom' align="left" v-if="type === 2" show-overflow-tooltip :v-show="false"></el-table-column>
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
                    show-overflow-tooltip
                    :width="item.width"
                    :sort-orders="sortOrders"
                    v-else-if="item.value=='placement_type'&&type !== 2">
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
                            <p v-if="type !== 2">{{scope.row.creative_type=='banner'?$t('report.banner'):scope.row.creative_type=='video'?$t('report.vastVideo'):scope.row.creative_type=='interstitial'?$t('report.insertion'):$t('report.motivationalVideos')}}</p>
                        </div>
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </div>
  </div>
</template>

<script >
import {CalendarOutlined,DownOutlined,AppleOutlined,AndroidOutlined,SearchOutlined} from '@ant-design/icons-vue';
import moment from 'moment';
import XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { useI18n } from 'vue-i18n';
import {defineComponent,reactive,ref,toRefs} from "vue";
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
        console.log(t('report.report'));
        
        const buyerColumn = {
            indicators:[
                {label: t('report.Imps'), value: 'imps',sorter:'custom',isSelect:true, field:'imps',width:100},
                {label: t('report.Clicks'), value: 'clicks',sorter:'custom',isSelect:true, field:'clicks',width:100},
                {label: t('report.Ctr'), value: 'ctr',sorter:'custom',isSelect:true,field:'ctr',width:100},
                {label: t('report.servingCreativeAmount'), value: 'creative_count',sorter:'custom',isSelect:true,field:'creative_count',width:185},
            ],
            dimension:[
                {label:t('report.month'),  value: 'ym',sorter:'custom',isSelect:true,group_by:'month',width:100},
                {label:t('report.date'),  value: 'ymd',sorter:'custom',isSelect:true,group_by:'date',width:130},
                {label:t('report.advertisingApp'),  value: 'buyer_app_name',sorter:'custom',isSelect:true,group_by:'buyer_app_name',width:135},
                {label:t('report.advertisingCampaign'),  value: 'campaign_name',sorter:'custom',isSelect:true,group_by:'buyer_campaign',width:160},
                {label:t('report.creative'),value: 'creative_name',sorter:'custom',isSelect:true,group_by:'creative',width:144},
                {label:t('report.promotionApp'),value: 'seller_app_name',sorter:'custom',isSelect:true,group_by:'seller_app_name',width:165},
                {label:t('report.adType'),value: 'placement_type',sorter:'custom',isSelect:true,group_by:'placement_type',width:100},
                {label:t('report.adUnit'), value: 'placement_name',sorter:'custom',isSelect:true,group_by:'seller_placement',width:144},
            ]
        }
        const MaterialColumn = {
            indicators:[
                {label: t('report.Imps'),value: 'imps',sorter:'custom',isSelect:true, field:'imps',width:100},
                {label: t('report.Clicks'),value: 'clicks',sorter:'custom',isSelect:true, field:'clicks',width:100},
                {label: t('report.Ctr'),value: 'ctr',sorter:'custom',isSelect:true,field:'ctr',width:100},
            ],
            dimension:[
                {label:t('report.month'),value: 'ym',sorter:'custom',isSelect:true,group_by:'month',width:100},
                {label:t('report.date'),value: 'dh',sorter:'custom',isSelect:true,group_by:'date',width:130},
                {label:t('report.servingApp'), value: 'app_name_launch',sorter:'custom',isSelect:true,group_by:'app_launch'},
                {label:t('report.servingAdUnit'), value: 'placement_name',sorter:'custom',width:130,isSelect:true,group_by:'placement_launch'},
                {label:t('report.creative'), value: 'creative_name',sorter:'custom',isSelect:true,group_by:'creative_name'},
                {label:t('report.language'), value: 'language',isSelect:true,group_by:'language',width:100},
            ]
        }
        let indicators= [];
        let dimension =[];
        let indicatorsList =[];
        let dimensionList =[];
        switch(props.type){
            case 1:
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
            break;
            case 2:
                indicators = MaterialColumn.indicators;
                dimension = MaterialColumn.dimension;
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
            break;
        }
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
            MaterialColumn,
            
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
        this.GetData()
    },
    methods:{
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
            this.appIds=[];
            b.forEach(v=>{
                this.appIds.push(v.key);
            })
        },
        searchList(){
            this.currentPage=1;
            this.GetData();
        },
        GetData(){
            let opt={
                app_platform:this.PlatForm.join(",") || null,
                page: this.currentPage,
                element_num:this.pageSize,
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
            
            switch(this.type){
                case 1:
                    this.GetBuyer(opt);
                break;
                case 2:
                    this.GetMaterial(opt);
                break;
            }
        },
        GetBuyer(opt){
            if(opt.page && opt.element_num){
                store.dispatch("Util/Loading",true)
                this.formdata=[]
                this.$req.GetBuyer(opt).then(res=>{
                    if(res.data.code === 200){
                        store.dispatch("Util/Loading",false)
                        this.total =res.data.data.total
                        let data = res.data.data.buyerReport
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
        GetMaterial(opt){
            if(opt.page && opt.element_num){
                store.dispatch("Util/Loading",true)
                this.formdata=[]
                this.$req.GetCreative(opt).then(res=>{
                    if(res.data.code === 200){
                        store.dispatch("Util/Loading",false)
                        this.total =res.data.data.total
                        let data = res.data.data.creative_report
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
                this.$req.GetCreative(opt).then(res => {
                    if(res.data.code === 200){
                        let data = res.data.data.creative_report
                        if(data.length !== 0){
                            data.map((item,index)=>{
                                item.key = index
                            })
                            this.exportData = data
                        } else{
                            this.exportData = []
                        }
                    } else{
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
            if(this.$props.type === 1){
                this.GetBuyer(opt)
            }else if(this.$props.type === 2){
                this.GetMaterial(opt)
            }
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
.ReportHeader{
    box-sizing: border-box;
    .ant-calendar-picker-input {
        border-radius: 10px;
        height: 35px;
        background-color: #eaf5ff;
        border-color: #eaf5ff;
        &:focus{
            border-color: #827af3;
            box-shadow: none;
        }
    }
    .CreativeSearch{
        vertical-align: middle;
    }
    .CreativeSearch,.ctrImpsNum{
        border-radius: 10px;
        height: 35px;
        background-color: #eaf5ff;
        border-color: #eaf5ff;
        margin-left:8px;
        .ant-input{
            background-color: transparent;
        }
        &:hover {
            border-color: #827af3;
        }
        &:focus {
            border-color: #827af3;
            box-shadow: none;
        }
    }
    .ctrImpsNum{
        width: 85px;
        margin-left:0px;
        text-align: center;
    }
    .ant-input-search {
        vertical-align: middle;
        border-radius: 10px;
        height: 35px;
        background-color: #eaf5ff;
        border-color: #eaf5ff;
        &:hover {
            border-color: #827af3;
        }
        &:focus {
            border-color: #827af3;
            box-shadow: none;
        }
        .ant-input {
            background-color: #eaf5ff;
            color: rgb(117, 117, 117);
        }
        .ant-input-suffix {
            .ant-input-search-icon {
                color: #6d73f6;
            }
        }
    }
    .ant-select{
        vertical-align: middle;
        margin-left: 8px;
        .ant-select-selector{
            background-color: #eaf5ff;
            border-color: #eaf5ff;
            border-radius: 10px;
            height: 35px;
            .ant-select-selection-overflow-item{
                max-width: 125px;
            } 
            &:hover {
                border-color: #827af3;
            }
            &:focus {
                border-color: #827af3;
                box-shadow: none;
            }
            .ant-select-selection-placeholder{
                color:#757575;
                line-height: 34px;
            }
        }
    }
    .Confirm{
        background-color: #6577c8;
        border: none;
        border-radius: 0.1rem;
        margin-top:-.1rem;
        height: .3rem;
        padding: 0.05rem 0.15rem;
    }
}
.ReportContent{
    .creative_img{
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
    .export-button{
        background: #3f414d;
        color:#fff;
        border: #3f414d;
        border-radius: 10px;
    }
    .row_border td{
        border-right: none;
        border-bottom: 1px solid #f0f0f0;
    }
    .el-table--border{
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
    .el-table{
        font-size: 12px;
        th{
            background:#f2f2f2;
            color: #7f7f7f;
        }
        .caret-wrapper{
            width: auto;
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
        .adcreative{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p{
                margin-bottom: 0;
            }
        }

    }
    .el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #e6f7ff;
    }
}
</style>