<template>
    <div class="dirCusCampaign">
        <div class="title margin--bottom">
            <h1>{{$t('DirCusCampaign.DirectCustomerCampaignsList')}}</h1>
        </div>
        <div class="inputData margin--bottom">
            <a-space :size="8">
                <a-input-search class="hover--color" v-model:value="campaign_id" :placeholder="$t('DirCusCampaign.DirectCustomerCampaignsNameID')" style="width: 200px"/> <!-- @search="onSearch" -->
                <a-select class="hover--color" ref="select" 
                    v-model:value="campaign_group_id" 
                    style="width: 150px"
                    @change="onGetDirectCampaign"
                    :allowClear='true'
                    :placeholder="$t('DirCusGroup.DirectCustomerGroup')"
                >
                    <a-select-option :value="item.campaign_group_id" v-for="(item) in state.directNameList" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
                <a-range-picker 
                    :allowClear="false" 
                    class="hover--color" 
                    v-model:value="state.formatTime" 
                    style="width: 320px">
                    <template #suffixIcon>
                        <a-popover title="" placement="top">
                            <template #content>
                                <div>{{$t('campaign.noteSelectTime')}}</div>
                            </template>
                            <QuestionCircleFilled class="iconNote" />
                        </a-popover>
                    </template>
                </a-range-picker>
                <a-button type="primary" @click="onSearch">{{$t('DirCusGroup.Search')}}</a-button>
            </a-space>
        </div>
        <div class="operation margin--bottom">
            <a-space :size="8">
                <a-button type="primary" @click="goCreateDirCusCampaign(-1)">{{$t('DirCusCampaign.NewDirectCustomerCampaigns')}}</a-button>
                <a-dropdown class="hover--color" :disabled="state.selectionData.length<=0">
                    <template #overlay>
                        <a-menu @click="onOperation">
                            <a-menu-item key="1">
                                {{$t('DirCusCampaign.Open')}}
                            </a-menu-item>
                            <a-menu-item key="2">
                                {{$t('DirCusCampaign.close')}}
                            </a-menu-item>
                            <a-menu-item key="3">
                                {{$t('DirCusCampaign.delete')}}
                            </a-menu-item>
                        </a-menu>
                    </template>
                    <a-button>
                        {{$t('DirCusGroup.Actions')}}
                        <DownOutlined />
                    </a-button>
                </a-dropdown>
            </a-space>
        </div>
        <div class="table">
            <a-spin :spinning="campaignLoading">
            <el-table
                ref="multipleTable"
                :data="state.dirCusCamTabData"
                tooltip-effect="dark"
                style="width: 100%"
                @sort-change="onListSort"
                @selection-change="onSelectionData">
                <el-table-column type="selection" min-width="50">
                </el-table-column>
                <el-table-column :label="$t('DirCusGroup.State')" min-width="100" prop="status" sortable="custom" :sort-orders="sortOrders">
                    <template #header>
                        <span>{{$t('campaign.status')}}</span>
                            <a-popover title="" placement="right" class="iconPopover">
                                <template #content>
                                    <div style="margin-bottom:3px;display:flex">
                                        <a-image
                                        :width="20"
                                        src="//console-style.hl.com/images/dspcom/running.svg"
                                        />
                                        <span style="vertical-align: middle;margin-left:10px;">{{$t('campaign.campaignActive')}}</span>
                                    </div>
                                    <div style="margin-bottom:3px;display:flex"> 
                                        <a-image
                                        :width="20"
                                        src="//console-style.hl.com/images/dspcom/warning.svg"
                                        />
                                        <span style="vertical-align: middle;margin-left:10px;">{{$t('campaign.anomalies')}}</span>
                                    </div>
                                    <div style="margin-bottom:3px;display:flex">
                                        <a-image
                                        :width="20"
                                        src="//console-style.hl.com/images/dspcom/stop.svg"
                                        />
                                        <span style="vertical-align: middle;margin-left:10px;">{{$t('campaign.stop')}}</span>
                                    </div>
                                    <div>
                                        <a-image
                                        :width="20"
                                        src="//console-style.hl.com/images/dspcom/done.svg"
                                        />
                                        <span style="vertical-align: middle;margin-left:10px;">{{$t('campaign.notStarted')}}</span>
                                    </div>
                                </template>
                            <QuestionCircleFilled class="iconNote" />
                        </a-popover>
                    </template>
                    <template #default="scope">
                        <a-popover v-if="scope.row.status==1" placement="topLeft" title="">
                            <template #content>
                                <span>{{$t('campaign.activityNotes')}}</span>
                            </template>
                            <i class="red"></i>
                        </a-popover>
                        <a-popover v-if="scope.row.status==2" placement="topLeft" title="">
                            <template #content>
                                <span>{{$t('campaign.activityNotes')}}</span>
                            </template>
                            <i class="red"></i>
                        </a-popover>
                        <a-popover v-if="scope.row.status==3" placement="topLeft" title="">
                            <template #content>
                                <span>{{$t('campaign.activityActive')}}</span>
                            </template>
                            <i class="activity"></i>
                        </a-popover>
                        <a-popover v-if="scope.row.status==4" placement="topLeft" title="">
                            <template #content>
                                <span>{{$t('campaign.activityNotStarted')}}</span>
                            </template>
                            <i class="finish"></i>
                        </a-popover>
                        <a-popover v-if="scope.row.status==5" placement="topLeft" title="">
                            <template #content>
                                <span>{{$t('campaign.activityClosed')}}</span>
                            </template>
                            <i class="finish"></i>
                        </a-popover>
                        <a-popover v-if="scope.row.status==6" placement="topLeft" title="" >
                            <template #content>
                                <span>{{$t('campaign.activityStop')}}</span>
                            </template>
                            <i class="pause"></i>
                        </a-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="id" :label="$t('DirCusCampaign.DirectCustomerCampaignID')" min-width="115" sortable="custom" :sort-orders="sortOrders">
                </el-table-column>
                <el-table-column prop="app_official_name" :label="$t('DirCusGroup.DirectCustomerGroup')" min-width="90">
                    <template #default="scope">
                        <el-tooltip  effect="dark" :content="scope.row.app_official_name" placement="top" :open-delay="200" :enterable="false">
                            <span class="mins">{{scope.row.app_official_name}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="name" :label="$t('DirCusGroup.DirectCustomerCampaigns')" min-width="90">
                    <template #default="scope">
                        <el-tooltip  effect="dark" :content="scope.row.name" placement="top" :open-delay="200" :enterable="false">
                            <span class="mins">{{scope.row.name}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="start_date" :label="$t('DirCusGroup.StartData')"  sortable="custom" :sort-orders="sortOrders" min-width="130">
                    <template #default="scope">
                        <el-tooltip  effect="dark" :content="scope.row.start_date" placement="top" :open-delay="200" :enterable="false">
                            <span class="mins">{{scope.row.start_date}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="end_date" :label="$t('DirCusGroup.EndData')"  sortable="custom" :sort-orders="sortOrders" min-width="130">
                    <template #default="scope">
                        <el-tooltip  effect="dark" :content="scope.row.end_date" placement="top" :open-delay="200" :enterable="false">
                            <span class="mins">{{scope.row.end_date}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('DirCusGroup.AdGoalProgress')" min-width="180">
                    <template #default="scope">
                        <a-progress :percent="scope.row.target_proportion" size="small" />
                        <div class="table_targetProgress">
                            <span>{{$t('DirCusGroup.Goal')}}</span>
                            <span>{{scope.row.target}}{{scope.row.target_type=='1'?'$':scope.row.target_type=='2'?'imps':''}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('DirCusGroup.Bid')" min-width="130">
                    <template #default="scope">
                        <span>{{scope.row.revenue_type_name}}</span>
                        {{scope.row.revenue_value}}
                        <span>$</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('DirCusGroup.Cost')" min-width="80">
                    <template #default="scope">
                        {{scope.row.post_view_revenue}}
                        <span>$</span>
                    </template>
                </el-table-column>
                <el-table-column prop="imps" :label="$t('index.Imps')" sortable="custom" :sort-orders="sortOrders"  min-width="100">
                </el-table-column>
                <el-table-column prop="clicks" :label="$t('index.Clicks')"  sortable="custom" :sort-orders="sortOrders"  min-width="100">
                </el-table-column>
                <el-table-column prop="ctr" :label="$t('index.Ctr')"  sortable="custom" :sort-orders="sortOrders"  min-width="90">
                </el-table-column>
                <el-table-column prop="creative_num" :label="$t('campaign.creatvie')" min-width="80">
                </el-table-column>
                <el-table-column :label="$t('campaign.operation')" min-width="50">
                    <template #default="scope">
                        <a-button type="link" class="padding--none" @click="goCreateDirCusCampaign(scope.row.id)">{{$t('campaign.edit')}}</a-button>
                    </template>
                </el-table-column>

                <el-table-column type="expand">
                    <template #default="scope" class="child_tabel">
                        <el-table :data="scope.row.creative_list"  style="width: auto;boxShadow:0 0 0.05rem rgba(0,0,0,.117647058823529); margin:0.2rem; border-radius: 0.05rem;"
                            :header-cell-style="{background: '#fff' }"
                        >
                            <el-table-column :label="$t('campaign.status')" align="center" width="80">
                                <template #default="scope">
                                    <span :class="scope.row.status=='1'?'open':'pauses'"></span>
                                </template>
                            </el-table-column>
                            <el-table-column label="ID" prop="creative_id" > </el-table-column>
                            <el-table-column :label="$t('campaign.creatvieName')" prop="creative_name" min-width="100" show-overflow-tooltip> </el-table-column>
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
                                    <a-button type="link" class="padding_left--none" @click="switchStatus(scope.row,'active')">{{scope.row.status=='1'?$t('campaign.inActive'):$t('campaign.active')}}</a-button>
                                    <a-button type="link" class="padding_left--none" @click="editCreative(scope.row.creative_id)">{{$t('campaign.edit')}}</a-button>
                                </template>
                            </el-table-column>
                            <template v-slot:empty >
                                <div class="icon-div"><i class="iconfont icon application-icon">&#xe635;</i></div>  
                                <div class="empty-div">{{$t('campaign.noData')}}</div>
                            </template>
                        </el-table>
                    </template>
                </el-table-column>

                <template v-slot:empty >
                    <div class="icon-div"><i class="iconfont icon application-icon">&#xe635;</i></div>
                    <div class="empty-div" style="margin-bottom:0">{{$t('myApp.noData')}}</div>
                    <div class="empty-div div--margin">{{$t('myApp.click')}}<span class='purples' @click="goCreateDirCusCampaign(-1)">+{{$t('DirCusCampaign.NewDirectCustomerCampaigns')}}</span></div>
                </template>

            </el-table>
            </a-spin>
            <a-pagination show-quick-jumper v-model:current="currentPage" v-model:pageSize="pageSize" :total="total"  @change="onChangePage" @showSizeChange="onChangeShowSize"/>
        </div>
    </div>
</template>

<script>

    import request from "@/utils/request.js";
    import router from '@/router';
    import moment from 'moment';
    import store from "@/store";
    import { message , Modal } from 'ant-design-vue';
    import { useI18n } from 'vue-i18n';
    import {
        DownOutlined,
        ExclamationCircleOutlined,
        QuestionCircleFilled
    } from "@ant-design/icons-vue";

    import { defineComponent, ref , reactive , onMounted , watch} from 'vue';
    export default defineComponent({
        components: {
            DownOutlined,
            ExclamationCircleOutlined,
            QuestionCircleFilled
        },

        props: ['directId'],

        setup(props) {

            const { t } = useI18n();

        /* -------------------------------ref---------------------------- */
            const date = ref([]);
            const currentPage = ref(1);
            const pageSize = ref(10);
            const total = ref(0);
            const campaign_id = ref('');
            const campaign_group_id = ref(null);
            const campaignLoading=ref(false);
            const sortOrders = ref(['descending', 'ascending', null]);
            const sort = ref(null);
            
        /* -----------------------------reactive------------------------- */

            const state = reactive({
                dirCusCamTabData:[],
                selectionData:[],
                formatTime:[],
                directNameList:[],
                direct:'',
            });

        /* -----------------------------function------------------------- */

            watch(props, val => {
                campaign_group_id.value=props.directId;
                onSearch();
            });

            onMounted(() => {
                let startTime= moment().subtract(30, "days").format('YYYY-MM-DD');
                let endTime =  moment().format('YYYY-MM-DD');
                state.formatTime = [moment(startTime),moment(endTime)];
                campaign_group_id.value=props.directId;
                getDirectNameList();
                onGetDirectCampaign("campaign");
            });

            const goCreateDirCusCampaign = (tag)=>{
                if(tag==-1){
                    router.push({path:'/hl/CreateDirCusCampaign',query:{keyWord:'-1',close:'-1'}});
                }else{
                    router.push({path:'/hl/EditDirCusCampaign',query:{keyWord:tag,tag:'-1',activeKey:'1',close:'-1'}});
                }
            };

            const getDirectNameList = ()=>{
                request.directNameList().then(res=>{
                    state.directNameList=res.data.data;
                }).catch(err => {
                    message.warning(t('DirCusCampaign.FaiToGetDirCusNameList'));
                })
            };

            const onSearch =()=>{
                currentPage.value=1;
                onGetDirectCampaign();
            };

            const onGetDirectCampaign = (e)=>{
                let data={
                    page:currentPage.value,
                    num_elements:pageSize.value,
                    start_time:state.formatTime.length==0?null:moment(state.formatTime[0]).format("YYYY-MM-DD"),
                    end_time:state.formatTime.length==0?null:moment(state.formatTime[1]).format("YYYY-MM-DD"),
                    sort:sort.value,
                    campaign_id:campaign_id.value,
                    campaign_group_id:campaign_group_id.value
                }
                e=="campaign"?store.dispatch("Util/Loading", true):campaignLoading.value=true;
                request.getDirectCampaign(data).then(res=>{
                    console.log(res);
                    total.value=res.data.data.total;
                    state.dirCusCamTabData=res.data.data.campaigns;
                    e=="campaign"?store.dispatch("Util/Loading", false):campaignLoading.value=false;
                }).catch(err => {
                    e=="campaign"?store.dispatch("Util/Loading", false):campaignLoading.value=false;
                    message.warning(t('DirCusCampaign.FaiToGetTheDirCusCamList'));
                })
            };

            const onSelectionData = (selection)=>{
                console.log(selection);
                state.selectionData=selection;
            };

            const onChangePage = (pageNumber)=>{
                currentPage.value=pageNumber;
                onGetDirectCampaign();
            };

            const onChangeShowSize = (number)=>{
                pageSize.value=number;
                onGetDirectCampaign();
            };

            // 排序
            const onListSort = (e)=>{
                console.log(e);
                if(e.order){
                    if(e.order==="descending"){//升序排列
                        sort.value= e.prop+'.desc';
                    }else{
                        sort.value= e.prop+'.asc';
                    }
                }else {
                    sort.value=null;
                }
                onGetDirectCampaign();
            };

            const onOperation = ({ key })=>{
                console.log(key);
                let idData=[];
                state.selectionData.forEach(item => {
                    idData.push(item.id);
                });
                
                switch(key){
                    case '1':
                    case '2':{
                        let state='active';
                        if(key==2){
                            state='inactive';
                        }
                        let data={
                            campaign_ids:idData.join(","),
                            state:state
                        }
                        request.switchCampaign(data).then(res=>{
                            message.success(t('appDetails.switchingStatusSuccessful'));
                            onGetDirectCampaign();
                        }).catch(err => {
                            message.warning(t('appDetails.switchingStatusFailed'));
                        })
                        break;
                    }
                    case '3':{
                        showDeleteConfirm(idData);
                    }
                }
            };

            const showDeleteConfirm = (idData) => {
                Modal.confirm({
                    title: t('DirCusCampaign.DelDirCusActivity'),
                    content: t('appMaterial.deleteMaterialContent'),
                    okText: t('appMaterial.enter'),
                    cancelText: t('appMaterial.cancel'),
                    icon: <ExclamationCircleOutlined  />,
                    onOk:()=>{
                        let data={
                            campaign_ids:idData.join(",")
                        }
                        request.DelCampaign(data).then(res=>{
                            message.success(t('appMaterial.deleteSuccessful'));
                            onGetDirectCampaign();
                        }).catch(err => {
                            message.warning(t('appMaterial.deleteFailed'));
                        })
                    }
                });
            };

            const onGetDirectCampaignList = ()=>{
                let data ={
                    campaign_group_id:campaign_group_id.value,
                    num_elements:pageSize.value,
                }
                request.directCampaignList(data).then(res=>{
                    total.value=res.data.data.total;
                    state.dirCusCamTabData=res.data.data.campaigns;
                    console.log(state.dirCusCamTabData);
                }).catch(err => {
                    message.warning(t('DirCusCampaign.FTGTDCAUTSDCG'));
                })
            };

            // 切换创意状态
            const switchStatus = (row)=>{
                store.dispatch("Util/Loading",true);
                let opt={
                    id:row.creative_id,
                    active:row.status=="1"?"0":"1",
                }
                request.changeCreativeStatus(opt).then(res=>{
                    if(res.data.code === 200){
                        message.success(t('campaign.switchingStatusSuccessful'));
                        console.log(res);
                        store.dispatch("Util/Loading",false);
                        row.status==="1"?row.status = "0":row.status = "1";
                        //onGetDirectCampaign();
                    }else{
                        message.error(t('campaign.switchingStatusFailed'));
                        store.dispatch("Util/Loading",false);
                    }
                }).catch(err=>{
                    message.error(t('campaign.unknownError'));
                    store.dispatch("Util/Loading",false);
                })
            };

            // 编辑创意
            const editCreative = (id)=>{
                let data=""
                state.dirCusCamTabData.forEach(item=>{
                    item.creative_list.forEach(v=>{
                        if(v.creative_id==id){
                            data=item.id;
                        }
                    })
                })
                if(data!=""){
                    router.push({path:'/hl/EditDirCusCampaign',query:{keyWord:data,tag:id,activeKey:'2',close:'-1'}});
                }
            };

            return {
            /* -------ref------- */
                date,currentPage,pageSize,total,campaign_id,campaign_group_id,campaignLoading,sortOrders,
            /* -----reactive---- */
                state,
            /* -----function---- */
                goCreateDirCusCampaign,onSelectionData,onOperation,onGetDirectCampaign,onGetDirectCampaignList,
                switchStatus,editCreative,onListSort,onChangePage,onChangeShowSize,onSearch
            }
        }
    });
</script>

<style scoped>
    @import "../../assets/css/index.css";
</style>

<style lang="less">

    .dirCusCampaign{
        background-color: #fff;
        border-radius: 0 0 10px 10px;
        padding: 20px;

        .padding_left--none{
            padding-left: 0;
        }

        .icon{
            font-size: 64px;
            color:#909399;
            margin: 0;
        }

        .icon-div{
            margin-top: 20px;
            height: 64px;
        }

        .empty-div{
            height: 30px;
            line-height: 30px;
            margin-bottom: 20px;
        }

    }
</style>