<template>
    <div class="dirCusGroup">
        <div class="title margin--bottom">
            <h1>{{$t('DirCusGroup.DirectCustomerGroupList')}}</h1>
        </div>
        <div class="inputData margin--bottom">
            <a-space :size="8">
                <a-input-search class="hover--color" v-model:value="dirCusName" :placeholder="$t('DirCusGroup.DirectCustomerGroupNameID')" style="width: 200px"/> <!-- @search="onSearch" -->
                <a-range-picker 
                    class="hover--color" 
                    v-model:value="state.formatTime" 
                    format="YYYY-MM-DD" 
                    separator="--" 
                    :allowClear="false"
                    style="width: 320px">
                    <template #suffixIcon>
                        <a-popover title="" placement="top">
                            <template #content>
                                <div>{{$t('campaign.noteSelectTime')}}</div>
                            </template>
                            <QuestionCircleFilled class="iconNote" />
                            <!-- <span class="doubt"></span> -->
                        </a-popover>
                    </template>
                </a-range-picker>
                <a-button type="primary" @click="onSearch">{{$t('DirCusGroup.Search')}}</a-button>
            </a-space>
        </div>
        <div class="operation margin--bottom">
            <a-space :size="8">
                <a-button type="primary" @click="goCreateDirCusGroup(-1)">{{$t('DirCusGroup.NewDirectCustomerGroup')}}</a-button>
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
            <a-spin :spinning="groupLoading">
            <el-table
                ref="multipleTable"
                :data="state.dirCusTabData"
                tooltip-effect="dark"
                style="width: 100%"
                @sort-change="onListSort"
                @selection-change="onSelectionData">
                <el-table-column type="selection" min-width="50">
                </el-table-column>
                <el-table-column :label="$t('DirCusGroup.State')" min-width="90" prop="status" sortable="custom" :sort-orders="sortOrders">
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
                            <!-- <span class="doubt"></span> -->
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
                <el-table-column prop="id" :label="$t('DirCusGroup.DirectCustomerGroupID')" sortable="custom" :sort-orders="sortOrders" min-width="110">
                </el-table-column>
                <el-table-column prop="name" :label="$t('DirCusGroup.DirectCustomerGroup')" min-width="100">
                    <template #default="scope">
                        <el-tooltip  effect="dark" :content="scope.row.name" placement="top" :open-delay="200" :enterable="false">
                            <span class="mins">{{scope.row.name}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="campaign_num" :label="$t('DirCusGroup.DirectCustomerCampaigns')" min-width="100">
                    <template #default="scope">
                        <a-button class="btn-radius" @click="goDirCusCampaign(scope.row.id)">{{scope.row.campaign_num}}</a-button>
                    </template>
                </el-table-column>
                <el-table-column prop="start_date" :label="$t('DirCusGroup.StartData')"  sortable="custom" :sort-orders="sortOrders" min-width="140">
                    <template #default="scope">
                        <el-tooltip  effect="dark" :content="scope.row.start_date" placement="top" :open-delay="200" :enterable="false">
                            <span class="mins">{{scope.row.start_date}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="end_date" :label="$t('DirCusGroup.EndData')"  sortable="custom" :sort-orders="sortOrders" min-width="140">
                    <template #default="scope">
                        <el-tooltip  effect="dark" :content="scope.row.end_date" placement="top" :open-delay="200" :enterable="false">
                            <span class="mins">{{scope.row.end_date}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="target_proportion" :label="$t('DirCusGroup.AdGoalProgress')" min-width="210" >
                    <template #default="scope">
                        <!-- <a-progress :percent="scope.row.targetProgress" :show-info="false"/> -->
                        <a-progress :percent="scope.row.target_proportion" size="small" />
                        <div class="table_targetProgress">
                            <span>{{$t('DirCusGroup.Goal')}}</span>
                            <span>{{scope.row.target}}{{scope.row.target_type=='1'?'$':scope.row.target_type=='2'?'imps':''}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="revenue_value" :label="$t('DirCusGroup.Bid')" min-width="120">
                    <template #default="scope">
                        <span>CMP {{scope.row.revenue_value}} $</span>
                    </template>
                </el-table-column>
                <el-table-column prop="post_view_revenue" :label="$t('DirCusGroup.Cost')" min-width="100">
                    <template #default="scope">
                        {{scope.row.post_view_revenue}}
                        <span>$</span>
                    </template>
                </el-table-column>
                <el-table-column prop="imps" :label="$t('report.Imps')" sortable="custom" :sort-orders="sortOrders" min-width="100">
                </el-table-column>
                <el-table-column prop="clicks" :label="$t('report.Clicks')" sortable="custom" :sort-orders="sortOrders" min-width="100">
                </el-table-column>
                <el-table-column prop="ctr" :label="$t('report.Ctr')" sortable="custom" :sort-orders="sortOrders" min-width="100">
                </el-table-column>
                <el-table-column :label="$t('myApp.operation')" min-width="80">
                    <template #default="scope">
                        <a-button type="link" class="padding--none" @click="goCreateDirCusGroup(scope.row.id)">{{$t('myApp.edit')}}</a-button>
                    </template>
                </el-table-column>
                <template v-slot:empty >
                    <div class="icon-div"><i class="iconfont icon application-icon">&#xe635;</i></div>
                    <div class="empty-div">{{$t('myApp.noData')}}</div>
                    <div class="empty-div div--margin">{{$t('myApp.click')}}
                        <a-button type="link" class="shisu_btn--notPadding" @click="goCreateDirCusGroup(-1)">+{{$t('DirCusGroup.NewDirectCustomerGroup')}}</a-button>
                    </div>
                </template>
            </el-table>
            </a-spin>
            <a-pagination show-quick-jumper v-model:current="currentPage" v-model:pageSize="pageSize" :total="total" @change="onChangePage" @showSizeChange="onChangeShowSize"/>
        </div>
        <!-- <a-modal v-model:visible="visible" title="删除直客组" @ok="onOperation">
            <p>Some contents...</p>
        </a-modal> -->
    </div>
</template>

<style scoped>
    @import "../../assets/css/index.css";
</style>

<script>

    import request from "@/utils/request.js";
    import router from '@/router';
    import moment from 'moment';
    import store from "@/store";
    import { useI18n } from 'vue-i18n';
    import { message , Modal} from 'ant-design-vue';
    import {
        DownOutlined,
        ExclamationCircleOutlined,
        QuestionCircleFilled
    } from "@ant-design/icons-vue";

    import { defineComponent , ref , reactive , onMounted } from 'vue';
    export default defineComponent({
        components: {
            DownOutlined,
            ExclamationCircleOutlined,
            QuestionCircleFilled
        },
        emits:['onChageActiveKey'],
        setup(props,{emit}) {

            const { t } = useI18n();

            /* -------------------------------ref---------------------------- */
            const currentPage = ref(1);
            const pageSize = ref(10);
            const total = ref(0);
            const dirCusName = ref('');
            const date = ref([]);
            const startTime = ref('');
            const endTime = ref('');
            const groupLoading = ref(false);
            const sortOrders = ref(['descending', 'ascending', null]);
            const sort = ref(null);
            /* -----------------------------reactive------------------------- */
            const state = reactive({
                date:[],
                dirCusTabData:[],
                selectionData:[],
                formatTime:[],
            });
            
            /* -----------------------------function------------------------- */
            onMounted(() => {
                startTime.value = moment().subtract(30, "days").format('YYYY-MM-DD');
                endTime.value =  moment().format('YYYY-MM-DD');
                state.formatTime = [moment(startTime.value),moment(endTime.value)];

                onGetDirect("group");
            });

            const goCreateDirCusGroup = (tag)=>{
                if(tag==-1){
                    router.push({path:'/hl/CreateDirCusGroup',query:{keyWord:'新建',close:'-1'}});
                }else{
                    router.push({path:'/hl/EidtCreateDirCusGroup',query:{keyWord:tag,close:'-1'}});
                }
            };

            const onOk = (value) => {
                console.log('onOk: ', value);
            };

            const onSelectionData = (selection)=>{
                console.log(selection);
                state.selectionData=selection;
            };

            const onChangePage = (pageNumber)=>{
                currentPage.value=pageNumber;
                onGetDirect();
            };

            const onChangeShowSize = (number)=>{
                pageSize.value=number;
                onGetDirect();
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
                            campaign_group_ids:idData.join(","),
                            state:state
                        }
                        request.switchDirect(data).then(res=>{
                            message.success(t('adPlatform.switchingStatusSuccessful'));
                            onGetDirect();
                        }).catch(err => {
                            message.warning(t('adPlatform.switchingStatusFailed'));
                        })
                        break;
                    }
                    case '3':{
                        showDeleteConfirm(idData);
                    }
                }
            }

            const showDeleteConfirm = (idData) => {
                Modal.confirm({
                    title: t('DirCusGroup.DelDirCusGroup'),
                    icon: <ExclamationCircleOutlined  />,
                    content: t('myApp.deleteAdUnitContent'),
                    okText: t('myApp.enter'),
                    cancelText:  t('myApp.cancel'),
                    onOk:()=>{
                        let data={
                            campaign_group_ids:idData.join(",")
                        }
                        request.deleteDirect(data).then(res=>{
                            message.success(t('myApp.deleteSuccessful'));
                            onGetDirect();
                        }).catch(err => {
                            message.warning(t('myApp.deleteFailed'));
                        })
                    }
                });
            };

            const onSearch =()=>{
                currentPage.value=1;
                onGetDirect();
            };

            const onGetDirect = (e)=>{
                //console.log(date.value[0].format("YYYY-MM-DD"));
                //console.log(data[0].value.format("YYYY-MM-DD"));
                e=="group"?store.dispatch("Util/Loading", true):groupLoading.value=true;
                let data={
                    page:currentPage.value,
                    num_elements:pageSize.value,
                    start_time:state.formatTime.length==0?null:state.formatTime[0].format("YYYY-MM-DD"),
                    end_time:state.formatTime.length==0?null:state.formatTime[1].format("YYYY-MM-DD"),
                    sort:sort.value,
                    campaign_group_id:dirCusName.value
                };
                request.getDirect(data).then(res=>{
                    console.log(res);
                    total.value=res.data.data.total;
                    state.dirCusTabData=res.data.data.campaign_groups;
                    e=="group"?store.dispatch("Util/Loading", false):groupLoading.value=false;
                }).catch(err => {
                    message.warning(t('DirCusGroup.FaiToObtDirCusGroup'));
                    e=="group"?store.dispatch("Util/Loading", false):groupLoading.value=false;
                })
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
                console.log(sort.value);
                onGetDirect();
            };

            const goDirCusCampaign = (id)=>{
                emit("onChageActiveKey",id);
            };

            return {
                /* -------ref------- */
                currentPage,pageSize,total,dirCusName,date,startTime,endTime,groupLoading,sortOrders,

                /* -----reactive---- */
                state,

                /* -----function---- */
                goCreateDirCusGroup,onSelectionData,onChangePage,onChangeShowSize,onGetDirect,onOk,onOperation,onListSort,
                onSearch,goDirCusCampaign
            };
        },
    });
</script>

<style lang="less">

    .dirCusGroup{
        background-color: #fff;
        border-radius: 0 0 10px 10px;
        padding: 20px;

        .table{
            .btn-radius{
                height: 24px;
                min-width: 60px;
                padding: 0 7px;

            }
        }
    }

</style>