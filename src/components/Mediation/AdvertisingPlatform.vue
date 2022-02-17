<template>
    <div class="advertisement" ref="advertisement">
        <h1>{{$t('adPlatform.network')}}</h1>
        <div class="adHead">
            <a-space :size="8">
                <a-select
                    mode="multiple"
                    v-model:value="adName"
                    style="width:350px;"
                    :placeholder="$t('adPlatform.network')"
                    showArrow
                    show-search
                    :maxTagCount="1"
                    class="searchName"
                    @change="changeSearch"
                    >
                        <template #suffixIcon>
                            <SearchOutlined />
                        </template>
                        <a-select-option v-for="item in platformList" :value="item.name" :key="item.id">
                            <span>
                                {{item.name}}
                            </span>
                        </a-select-option>
                </a-select>
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
                                <div>{{$t('adPlatform.noteSelectTime')}}</div>
                            </template>
                            <QuestionCircleFilled class="iconNote" />
                            <!-- <span class="doubt"></span> -->
                        </a-popover>
                    </template>
                </a-range-picker>
                <a-button type="primary" class="search_primary" @click="appSearch">{{$t('adPlatform.search')}} </a-button>
            </a-space>
        </div>
        <div class="newAdPlatform">
            <div>
                <a-space :size="8">
                    <a-button type="primary" class="create_adPlatform" @click="createAdPlatform"> {{$t('adPlatform.addANetwork')}} </a-button>

                    <!-- <a-select
                            v-model:value="operations"
                            style="width: 120px"
                            ref="selectOperation"
                            :placeholder="$t('adPlatform.actions')"
                            class="batchOperation"
                            :disabled="!isStatus"
                            @change="operation"
                        >
                        <a-select-option value="1">{{$t('adPlatform.active')}}</a-select-option>
                        <a-select-option value="2">{{$t('adPlatform.inActive')}}</a-select-option>
                        <a-select-option value="3">{{$t('adPlatform.delete')}}</a-select-option>
                    </a-select> -->

                    <a-dropdown ref="selectOperation" class="batchOperation" :disabled="!isStatus">
                        <template #overlay>
                            <a-menu @click="operation">
                                <a-menu-item key="1">
                                {{$t('adPlatform.active')}}
                                </a-menu-item>
                                <a-menu-item key="2">
                                {{$t('adPlatform.inActive')}}
                                </a-menu-item>
                                <a-menu-item key="3">
                                {{$t('adPlatform.delete')}}
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
            
            <!-- <a-button type="primary" class="SelectItem" @click="settingsItems">选择列表项</a-button> -->
        </div>
        <div class="tableAd">
            <a-spin :spinning="spinning">
            <el-table border :data="list" ref="waterfalls" style="width: 100%;min-height:5rem; margin-bottom:.2rem;"   @selection-change="choose">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column :label="$t('adPlatform.network')" prop="partner_name" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('adPlatform.networkName')" prop="name" >
                    <template #default="scope">
                        <el-tooltip  effect="dark" :content="scope.row.name" placement="top" :open-delay="200" :enterable="false">
                            <span class="min">{{scope.row.name}}</span>
                        </el-tooltip>
                    </template> 
                </el-table-column>
                <el-table-column :label="$t('adPlatform.state')" prop="active">
                    <template #default="scope">
                        <a-switch v-model:checked="scope.row.active" @change="activeChange(scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column prop :label="$t('adPlatform.actions')">
                <template #default="scope">
                    <a-button type="link" size="small" class="shisu_text_btn" @click="goNetwork([scope.row.id,scope.row.creative_custom_request_partner_id])">{{$t('adPlatform.edit')}}</a-button>
                </template>
                </el-table-column>
                <el-table-column  :label="$t('adPlatform.adSoureces')" prop="app_placement_bids_count">
                <template #default="scope">
                    <a-button size="small" class="general_btn"  @click="gobids(scope.row)">{{scope.row.app_placement_bids_count}}</a-button>
                </template>
                </el-table-column>
                <el-table-column :label="$t('adPlatform.revenue')" prop="revenue">
                
                </el-table-column>
                <el-table-column :label="$t('adPlatform.requests')" prop="mediation_requests">
                    
                </el-table-column>
                <el-table-column :label="$t('adPlatform.impAPI')" prop="app_launch_num">
                    <template #default="scope">
                        <span>{{scope.row.app_launch_num?scope.row.app_launch_num:"(-)"}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('adPlatform.clickAPI')" prop="app_launch_num">
                    <template #default="scope">
                        <span>{{scope.row.app_launch_num?scope.row.app_launch_num:"(-)"}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('adPlatform.fillRate')" prop="ad_request_rate">
                    
                </el-table-column>
                <template v-slot:empty >
                    <div class="icon-div"><i class="iconfont icon">&#xe635;</i></div>
                    <div class="empty-div">{{$t('adPlatform.noData')}}</div>
                    <div class="empty-div div--margin">
                        {{$t('adPlatform.click')}}
                        <a-button type="link" class="shisu_btn--notPadding" @click="createAdPlatform">+{{$t('adPlatform.addANetwork')}}</a-button>
                    </div>
                </template>
            </el-table>
            </a-spin>
        </div>
        <!-- 新建广告平台 -->
        <a-modal
            v-model:visible="adshow"
            :getContainer="()=>$refs.advertisement"
            class="adunits"
            :maskClosable="false"
            :width="600"
            :title="network_id?$t('adPlatform.editNetwork'):$t('adPlatform.addANetwork')"
            @ok="adUnit"
            @cancel="adClose"
            >
            <AdPlatform v-if="adshow" ref="network" @advertisingPlatform="advertisingPlatform" :network_id="network_id" :partner_id="partner_id"></AdPlatform>
        </a-modal>
        <!-- 选择列表项 -->
            <a-modal
                v-model:visible="selectListItems"
                :getContainer="()=>$refs.advertisement"
                class="selectListItems"
                :footer="footer"
                :width="600"
                title="选择列表项"
                >
                <div class="selectCheck">
                    <a-checkbox
                    v-model:checked="checkAll"
                    :indeterminate="indeterminate"
                    @change="onCheckAllChange"
                    >
                    所有
                    </a-checkbox>
                    <a-checkbox-group v-model:value="checkedList" :options="plainOptions" />
                    <div class="saveListItem">
                        <a-button type="primary" class="saves" @click="editListItem">保存</a-button>
                    </div>
                    
                </div>
            </a-modal>
    </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>
import { useI18n } from 'vue-i18n';
import {SearchOutlined,ExclamationCircleOutlined,DownOutlined,QuestionCircleFilled} from "@ant-design/icons-vue";
import AdPlatform from "./AdPlatform";
import { message} from 'ant-design-vue';
import moment from 'moment';
import store from '@/store';
import Sortable from "sortablejs"
export default {
    components:{
        AdPlatform,
        SearchOutlined,
        ExclamationCircleOutlined,
        DownOutlined,
        QuestionCircleFilled
    },
    data(){
        return {
            adName:[],
            advertisementList:[],
            formatTime:"",
            operations:undefined,
            isStatus:false,
            platformList:[],
            list:[],
            optimizationChecked:false,
            adshow:false,
            footer:false,
            iscompile: false,
            selectListItems:false,
            checkedList:[],
            indeterminate: false,
            checkAll: false,
            selectTable:[],
            startTime:"",
            formatTime:[],
            network_id:"",
            spinning:false,
            adSources_id:"",
            partner_id:"",
            endTime:"",
            plainOptions:[
            {value:'waterfall',label:"标签"},
            {value:'Size',label:"尺寸"}, 
            {value:'Bid Optimization',label:"出价优化"},
            {value:'Imp Requests',label:'请求'},
            {value:'Imps',label:'展示'},
            {value:'third-party imps',label:'第三方展示'},
            {value:'discrepancy',label:'差异率'},
            {value:'Fill rate',label:'填充率'},
            {value:'adjusted eCPM',label:'调整后ecpm'},
            {value:'third-party eCPM',label:'第三方ecpm'},
            {value:'third-party revenue',label:'第三方收益'},
            {value:'ID',label:'广告源ID'}
            ],
            features:{},
        }
    },
    watch:{
        checkedList(val){
            console.log(val);
            this.indeterminate = !!val.length && val.length < this.plainOptions.length;
            this.checkAll = val.length === this.plainOptions.length;
        }
    },
    mounted(){

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
            
                if (this.features.ALLOW_ACCESS_TO_MEDIATION) {
                
                    store.dispatch("Util/Loading", false);
                    this.startTime= moment().subtract(30, "days").format('YYYY-MM-DD');
                    this.endTime =  moment().format('YYYY-MM-DD');
                    this.formatTime = ([moment(this.startTime),moment(this.endTime)]);
                    this.getNetworks("adPlatform");
                    this.getAdList("adPlatform");
                
                } else {
                    store.dispatch("Util/Loading", false);
                    this.$router.push("/getlogin/login")
                
                }
            }else {
                store.dispatch("Util/Loading", false);
            }
        })
        
    },
    methods:{
        //筛选广告平台
        appSearch(){
            this.getAdList();
        },
        //跳转到管理广告源
        gobids(e){
            this.$router.push({
                path:"/hl/manageAdFeeds",
                query:{
                    network_id:e.id,
                    close:3,
                    name:e.name,
                    partner_name:e.partner_name
                }
            })
        },
        //打开编辑广告平台窗口
        goNetwork(e){
            this.network_id=e[0];
            this.partner_id=e[1];
            this.adshow=true;
        },

        changeSearch(e,b){
            console.log(e,b);
            this.adSources_id=b[0].key;
        },
        //打开新建广告平台窗口
        createAdPlatform(){
            this.adshow=true;
        },
        //列表选择变化监听
        choose(e){   
            this.selectTable=[];
            this.selectTable=e;
            if(e.length){
                this.isStatus=true;
            }else{
                this.isStatus=false;
            }
        },
        //废弃的
        rowDrop(){
            var tableTooby=document.querySelector(".el-table__body-wrapper tbody");
            console.log(tableTooby);
            Sortable.create(tableTooby, {
                ghostClass: 'sortable-ghost',
                onEnd: ({newIndex, oldIndex}) => {
                
                    const currRow = this.list.splice(oldIndex, 1)[0]
                    this.list.splice(newIndex, 0, currRow)
                }
            });
        },
        //批量操作
        operation({key}){
            console.log(key);
            switch(key){
                case "1":
                //  开启
                case "2":
                
                    this.spinning=true;
                    var arr=[];
                    this.selectTable.forEach(val=>{
                        arr.push(val.id)
                    })
                    let opt={
                        mediation_ids:arr.toString(),
                        action:key==1?"active":"inactive"
                    }
                    this.$req.switchNetworkActive(opt).then(res=>{
                        console.log(res);
                        if(res.data.code==200){
                            this.spinning=false;
                            message.success(this.$t('adPlatform.switchingStatusSuccessful'));
                            this.selectTable=[];
                            this.$refs.waterfalls.clearSelection();
                            this.operations=undefined;
                            this.getAdList();
                        }else{
                            message.error(this.$t('adPlatform.switchingStatusFailed'));
                            this.spinning=false;
                            this.operations=undefined;
                        }
                        
                    })
                
                break;
                case "3":
                    this.$confirm({
                        title: this.$t('adPlatform.deleteAdSoureces'),
                        content: this.$t('adPlatform.deleteAdUnitContent'),
                        cancelText:this.$t('adPlatform.cancel'),
                        okText:this.$t('adPlatform.enter'),
                        icon: <ExclamationCircleOutlined  />,
                        onOk:()=> {
                            this.spinning=true;
                            var arr=[];
                            this.selectTable.forEach(val=>{
                                arr.push(val.id)
                            })
                            let opt={
                                mediation_ids:arr.toString()
                            }
                            this.$req.delNetworkItem(opt).then(res=>{
                                console.log(res);
                                if(res.data.code==200){
                                    this.spinning=false;
                                    this.selectTable=[];
                                    this.$refs.waterfalls.clearSelection();
                                    this.operations=undefined;
                                    message.success(this.$t('adPlatform.deleteSuccessful'));
                                    this.getAdList();
                                }else {
                                    this.spinning=false;
                                    this.operations=undefined;
                                    message.error(this.$t('adPlatform.deleteFailed'));
                                }
                            })
                        },
                        onCancel:()=> {
                            this.operations=undefined;
                        }
                    });
                break;
            }
        },
        //切换广告平台状态
        activeChange(e){
            console.log(e);
            this.spinning=true;
            let opt={
                mediation_ids:e.id,
                action:e.active?"active":"inactive"
            }
            this.$req.switchNetworkActive(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.spinning=false;
                    message.success(this.$t('adPlatform.switchingStatusSuccessful'));
                    this.getAdList();
                }else{
                    message.error(this.$t('adPlatform.switchingStatusFailed'));
                    this.spinning=false;
                    this.getAdList();
                }
                
            })
        },
        //获取广告平台
        getNetworks(e){
            e=="adPlatform"?store.dispatch("Util/Loading", true):"";
            this.$req.getNetwork().then(res=>{
                console.log(res);
                if(res.data.code==200){
                    e=="adPlatform"?store.dispatch("Util/Loading", false):"";
                    this.platformList=res.data.data;
                    console.log(this.platformList);
                    
                }else{
                    
                    e=="adPlatform"?store.dispatch("Util/Loading", false):"";  
                }
            })
        },
        //创建广告平台
        advertisingPlatform(e){
            console.log(e);
            store.dispatch("Util/Loading", true);
            this.$req.addPlatform(e).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.adshow=false;
                    store.dispatch("Util/Loading", false);
                    if(e.id!=""){
                        message.success(this.$t('adPlatform.editSuccessful'));
                    }else{
                        message.success(this.$t('adPlatform.addSuccessful'));
                    }
                    this.network_id="";
                    this.partner_id="";
                    this.getAdList();
                }else {
                    message.error(res.data.message);
                    store.dispatch("Util/Loading", false);
                }
            })
        },
        //获取广告平台列表
        getAdList(e){
            let opt ={
                creative_custom_request_partner_id:this.adSources_id,
                start_time:this.formatTime[0].format("YYYY-MM-DD"),
                end_time:this.formatTime[1].format("YYYY-MM-DD"),
            }
            e=="adPlatform"?store.dispatch("Util/Loading", true):this.spinning=true;
            this.$req.getPlatformList(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    e=="adPlatform"?store.dispatch("Util/Loading", false):this.spinning=false;
                    
                    if(res.data.data.length){
                        this.list=res.data.data;
                        // this.rowDrop();
                    }else{
                        this.list=[];
                    }
                    if(this.list.length){
                            this.list.map(val=>{
                            val.active=val.active=="1"?true:false;
                        })
                    }
                }else {
                    message.error(this.$t('adPlatform.unknownError'));
                    e=="adPlatform"?store.dispatch("Util/Loading", false):this.spinning=false;
                }
            })
        },
        adUnit() {
            this.$refs.network.adPlatformSave();
        },
        settingsItems(){
            this.selectListItems=true;
        },
        onCheckAllChange(e){
                console.log(e);
                if(e.target.checked){
                    this.checkedList=[];
                    this.plainOptions.map(val=>{
                        this.checkedList.push(val.value);
                    })
                }else{
                    this.checkedList=[];
                }
                this.indeterminate=false;
        },
        adClose() {
            this.network_id="";
            this.partner_id="";
        },
        editListItem(){
            this.selectListItems=false;
            console.log(this.checkedList);
            
        }
    }
}
</script>
<style>
    .advertisement .icon{
        font-size: 64px;
        color:#909399;
        margin: 0;
    }
    .advertisement .icon-div{
        margin-top: 30px;
        height: 64px;
    }
    .advertisement .empty-div{
        height: 30px;
        line-height: 30px;
    }
    .advertisement .purple{
        margin-right: 0 !important;
    }
    .advertisement .div--margin{
        margin-bottom: 20px;
    }
</style>
<style lang="less" scoped>
    .advertisement{
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;
        /* .ant-switch-checked{
            background-color: #6577c8;
        } */
        .adHead{
            margin-bottom: 16px;
            /deep/.searchName{
                vertical-align: middle;
            }
            .search_primary{
                width: 100px;
            }
            .doubt {
                display: inline-block;
                width: 16px;
                height: 16px;
                margin-left: 8px;
                line-height: 16px;
                vertical-align: sub;
                background: url("//console-style.hl.com/images/dspcom/normal_u109.svg") no-repeat ;
                background-size: 16px 16px;
            }
            .doubt:hover {
                background: url("//console-style.hl.com/images/dspcom/normal_u110.svg") no-repeat ;
                background-size: 16px 16px;
            }
        }
        .newAdPlatform{
            display: flex;
            justify-content: space-between;
            .SelectItem{
                margin-right: 20px;
                background-color: #6577c8;
                float: right;
                border: none;
                height: 35px;
                border-radius: 0.1rem;
            }
            /deep/.batchOperation{
                width: 120px;
            }
        }
        .min{
            overflow:hidden; //超出的隐藏
            text-overflow:ellipsis;//省略号
            white-space:nowrap;//强制一行显示
        }
        .tableAd{
            /deep/.el-table {
                min-height: 150px!important;
                margin-bottom: 0!important;
                margin-top: 16px;
            }
        }
        // /deep/.ant-modal-content{
        //     border-radius: 10px;
        //     .ant-modal-close{
        //         font-size: 18px;
        //     }
        //     .ant-modal-header{
        //         border-top-left-radius: 10px;
        //         border-top-right-radius: 10px;
        //         .ant-modal-title{
        //             font-size: 18px;
        //         }
        //     }
        //     .ant-modal-body{
        //         padding: 0 20px;
        //         .selectCheck{
        //             margin-top: 10px;
        //             .ant-checkbox-group{
        //                 display: flex;
        //                 flex-wrap: wrap;
        //                 margin-left: 20px;
        //                 .ant-checkbox-wrapper{
        //                     width: 48%;
        //                     margin-top: 6px;
        //                 }
        //             }
        //             .saveListItem{
        //                 display: flex;
        //                 justify-content: center;
        //                 margin-top: 20px;
        //                 .saves{
        //                     width: 160px;
        //                     height: 35px;
        //                     border: none;
        //                     border-radius: 10px;
        //                     margin-bottom: 20px;
        //                     background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
        //                 }
        //             }
        //             }
        //     }
        // }
    }
</style>