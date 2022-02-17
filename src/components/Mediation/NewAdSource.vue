<template>
    <div class="newAdSource" ref="newAdSource">
        <div class="sourcesList">
            <a-form
                ref="formRef"
                :model="data"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
            >
                <div class="sourcesItem" v-for="(value,index) in data" :key="index+'s'">
                    <h1>{{$t('newMediation.adSoureces')}}</h1>
                    <div v-if="!isSources" class="sourcesContent">
                        <div class="fixeds">
                            <div>
                                <a-form-item 
                                    :label="$t('aggregate.TrafficGroup')"
                                >
                                    <a-input class="sourceInput" disabled v-model:value="tableData[dataIndex].name"/>
                                </a-form-item>
                            </div>
                        </div>
                    </div>
                    <div class="head">
                        <div>
                            <a-form-item 
                                :label="$t('aggregate.network')"
                            >
                                <a-select
                                    v-model:value="value.sourcesName"
                                    style="width:300px;"
                                    :placeholder="$t('newMediation.selectANetwork')"
                                    showArrow
                                    class="sourcesSelect"
                                    :disabled="selectDisbaled"
                                    @change="(...event) =>{changeNetwork(event, index)}"
                                >
                                    <a-select-option  v-for="item in sourcesList" :value="item.name" :key="item.id" >
                                        <span>
                                            {{item.name}}
                                        </span>
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                        <span v-if="index!=0" @click="closeSources(index)"><CloseOutlined /></span>
                    </div>
                
                    <div class="sourcesContent" v-if="value.sourcesName">
                        <div class="fixeds">
                            <!-- <div>
                                <p>{{$t('newMediation.adSourecesName')}}<span>*</span></p>
                                <a-input class="sourceInput"  v-model:value="value.adSourceName" :placeholder="$t('newMediation.adSourecesName')" />
                            </div> -->
                            <a-form-item 
                                :label="$t('newMediation.adSourecesName')" 
                                :name="[ index , 'adSourceName']"
                                :rules="{
                                    required: true,
                                    message: this.$t('newMediation.pleaseEnterNetwork'),
                                    trigger: 'blur',
                                }">
                                <a-input v-model:value="value.adSourceName" :placeholder="$t('newMediation.adSourecesName')"/>
                            </a-form-item>
                        </div>
                        <div class="events" >
                            <div v-for="(v,i) in value.credentials" :key="v.id">
                                
                                <!-- <p v-if="v.name!='NETWORKNAME'">{{v.name}}<span>*</span></p>
                                <a-input class="sourceInput" v-if="v.name!='NETWORKNAME'" v-model:value="v[v.name]" :placeholder="v.name" /> -->

                                <a-form-item 
                                    v-if="v.name!='NETWORKNAME'"
                                    :label="v.name" 
                                    :name="[ index , 'credentials' , i , v.name]"
                                    :rules="{
                                        required: true,
                                        message: this.$t('Message.NotEmpty'),
                                        trigger: 'blur',
                                    }"
                                >
                                    <a-input class="sourceInput" v-model:value="v[v.name]" :placeholder="v.name" />
                                </a-form-item>

                            </div>
                        </div>
                        <div v-if="!isSources" class="fixeds">
                            <a-form
                                ref="formTableRef"
                                :model="tableData"
                                :label-col="labelCol"
                                :wrapper-col="wrapperCol"
                            >
                                <div>
                                    <!-- <p>{{$t('newMediation.bids')}}<span>*</span></p>
                                    <a-input class="bidInput" type="number"  v-model:value="tableData[dataIndex].revenue_value" :placeholder="$t('newMediation.bids')" @blur="bidChange([value.bids,index])"/> -->
                                    <a-form-item 
                                        :label="$t('newMediation.bids')" 
                                        :name="[ dataIndex , 'revenue_value']"
                                        :rules="{
                                            required: true,
                                            message: this.$t('newMediation.pleaseBids'),
                                            trigger: 'blur',
                                        }"
                                    >
                                        <a-input class="bidInput" type="number" @change="onBlurBids"  v-model:value="tableData[dataIndex].revenue_value" :placeholder="$t('newMediation.bids')" @blur="bidChange([value.bids,index])"/>
                                    </a-form-item>
                                </div>
                                <div>
                                    <!-- <p>{{$t('aggregate.state')}}<span>*</span></p>
                                    <a-radio-group v-model:value="tableData[dataIndex].state">
                                        <a-radio value="1">{{$t('aggregate.active')}}</a-radio>
                                        <a-radio value="0">{{$t('aggregate.inActive')}}</a-radio>
                                    </a-radio-group> -->

                                    <a-form-item 
                                        :label="$t('aggregate.state')" 
                                    >
                                        <a-radio-group v-model:value="tableData[dataIndex].state">
                                            <a-radio value="1">{{$t('aggregate.active')}}</a-radio>
                                            <a-radio value="0">{{$t('aggregate.inActive')}}</a-radio>
                                        </a-radio-group>
                                    </a-form-item>
                                </div>
                            </a-form>
                        </div>
                    </div>
                </div>
            </a-form>
            <!-- <a-button  type="primary" v-if="!adSource_id" class="create_Sources" @click="createAdSources">{{$t('newMediation.addMoreAdSoureces')}}</a-button> -->
        </div>
        <a-divider />
        <div class="advancedSettings">
            <a-collapse v-model:activeKey="advanced" accordion expandIconPosition="right" :bordered="false">
                <a-collapse-panel key="1" :header="$t('newMediation.advanced')">
                    <div class="tags">
                        <p>{{$t('newMediation.label')}}</p>
                        <a-input class="tagsInput"  v-model:value="tags" :placeholder="$t('newMediation.label')" />
                    </div>
                    <div class="optimization">
                        <p>{{$t('newMediation.bidOptimization')}}</p>
                        <a-switch class="optimization_switch" v-model:checked="optimizationChecked" />
                    </div>
                    <div class="displays">
                        <p>
                            {{$t('newMediation.dailyImpsLimit')}}
                        </p>
                        <div class="div">
                            <a-radio-group name="radioGroup" class="uniform" v-model:value="displayTimes" @change="radioChange">
                                <a-radio value="1">{{$t('newMediation.noLimit')}}</a-radio>
                                <a-radio value="2">
                                    <a-input
                                        class="displayTimes"
                                        type="Member"
                                        v-model:value="displayCount"
                                        :disabled="displayTimes!='2'"
                                        :placeholder="$t('newMediation.dailyImpsLimit')"
                                    />
                                    <br />
                                    <a-checkbox v-model:checked="uniformSpeed" :disabled="displayTimes!='2'">{{$t('newMediation.uniformConsumption')}}</a-checkbox>
                                    <a-popover title placement="right">
                                    <template #content>
                                        <p>{{$t('newMediation.averageDstribution')}}</p>
                                    </template>
                                    <QuestionCircleFilled class="iconNote" />
                                    <!-- <span class="note doubt"></span> -->
                                    </a-popover>
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <div class="frequency">
                        <p>{{$t('newMediation.frequency')}}</p>
                        <div class="backs">
                            <div class="item">
                                <a-checkbox v-model:checked="lifeTime" @change="lifeTimeChange">{{$t('newMediation.showImpsOverLifetime')}}</a-checkbox>
                                <a-input class="frequencyInput" type="number"  v-model:value="lifeTimeCount" placeholder="" @change="lifeTimeCountChange"/>
                                {{$t('newMediation.times')}}
                            </div>
                            <div class="item">
                                <a-checkbox v-model:checked="daily" @change="dailyChange">{{$t('newMediation.showImpsPerUserPerDay')}}</a-checkbox>
                                <a-input class="frequencyInput" type="number" v-model:value="dailyCount" placeholder="" @change="dailyCountChange"/>
                                {{$t('newMediation.times')}}
                            </div>
                            <div class="single ">
                                <a-checkbox v-model:checked="dailyInterval" @change="dailyIntervalChange">{{$t('newMediation.showImpressionPerUserPer')}}</a-checkbox>
                                <a-input class="frequencyInput" type="number"  v-model:value="intervalCount" placeholder="" @change="intervalCountChange"/>
                                <a-select
                                    v-model:value="intervalTime"
                                    style="width: 120px"
                                    ref="selectOperation"
                                    :placeholder="$t('newMediation.time')"
                                    class="batchOperation"
                                    @change="intervalTimeChange"
                                >
                                    <a-select-option value="1">{{$t('newMediation.minutes')}}</a-select-option>
                                    <a-select-option value="2">{{$t('newMediation.hours')}}</a-select-option>
                                    <a-select-option value="3">{{$t('newMediation.days')}}</a-select-option>
                                </a-select>
                            </div>
                        </div>
                    </div>
                    <div class="effective">
                        <p>{{$t('newMediation.daypart')}}</p><a-button type="primary" class="effectivePeriod" @click="effectivePeriod">{{$t('newMediation.edit')}}</a-button>
                    </div>
                </a-collapse-panel>
                <template #expandIcon="{ isActive }">
                    <DownOutlined :rotate="isActive ? 180 : 0" />
                </template>
            </a-collapse>
        </div>
        <!-- 流量分组出价 -->
        <div v-if="isSources" class="traGroBid_center" ref="traGroBid_center">
            <a-divider />
            <h1>{{$t('aggregate.TrafficGroupingBid')}}</h1>
            <p>{{$t('aggregate.Note')}}</p>
            <a-dropdown :disabled='!selectedRows.length'>
                <template #overlay>
                    <a-menu @click="onMenuClick">
                    <a-menu-item key="1">
                        {{$t('adPlatform.active')}}
                    </a-menu-item>
                    <a-menu-item key="0">
                        {{$t('adPlatform.inActive')}}
                    </a-menu-item>
                    <a-popover class="popModifyPrice" placement="bottom" :getPopupContainer="()=>$refs.newAdSource">
                        <template #content>
                            {{$t('aggregate.BatchModifyPrice')}}：<a-input :placeholder="$t('aggregate.BatchModifyPrice')" type="Number" v-model:value="modifyRevenueValue" /><a-button type="primary" @click="onModifyPriceAll">{{$t('aggregate.enter')}}</a-button>
                        </template>
                        <a-menu-item key="3">
                            {{$t('aggregate.ModifyBid')}}
                        </a-menu-item>
                    </a-popover>
                    </a-menu>
                </template>
                <a-button>
                    {{$t('DirCusGroup.Actions')}}
                    <DownOutlined />
                </a-button>
            </a-dropdown>

            <a-table 
                :columns="tableColumns" 
                :data-source="tableData"
                :row-selection="{ selectedRowKeys: selectedRowKeys,selectedRows: selectedRows ,onChange: onSelectChange }"
                :loading="tableLoading"
            >
                <template #state="{ record }">
                    <a-switch v-model:checked="record.state" checkedValue="1" unCheckedValue="0" />
                </template>
                <template #revenue_value="{ record }">
                    <a-input type="Number" style="width:80px"  @change="onBlurRevenueValue(record)" v-model:value="record.revenue_value" :placeholder="record.mediation_group_id==tableData[0].mediation_group_id?$t('aggregate.Required'):$t('Message.OptionalFilling')" />
                </template>
            </a-table>
        </div>

        <div class="footers">
            <a-button type="primary" class="saves" :disabled="!data[0].sourcesName" @click="adSource">{{$t('newMediation.save')}}</a-button>
            <a-button class="cancellation" @click="Cancellation">{{$t('newMediation.cancels')}}</a-button>
        </div>

        <!-- 生效时段 -->
        <a-modal
            v-model:visible="showPeriod"
            :getContainer="()=>$refs.newAdSource"
            class="period"
            :maskClosable="false"
            :width="750"
            :title="$t('newMediation.daypart')"
            @ok="periodOk"
            @cancel="periodClose"
            >
            <EffectivePeriod ref="period" :showPeriod="showPeriod" :userInfo="userInfo" :effectiveTime="selectEffective" :timeZone="timeZone" @triggertime="triggertime" v-if="showPeriod">
            </EffectivePeriod>
        </a-modal>
    </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>
import {CloseOutlined,DownOutlined,SearchOutlined,ExclamationCircleOutlined,QuestionCircleFilled} from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import { useI18n } from 'vue-i18n';
import { message} from 'ant-design-vue';
import EffectivePeriod from "./EffectivePeriod.vue"
import { useStore } from "vuex";
import store from '@/store';

export default {
    data(){
        return{
            tableColumns:[
                {
                    title: this.$t('aggregate.TrafficGroup'),
                    dataIndex: 'name',
                    key:'name',
                    slots: { customRender: 'name' },
                },
                {
                    title: this.$t('aggregate.state'),
                    dataIndex: 'state',
                    key:'state',
                    slots: { customRender: 'state' },
                },
                {
                    title: this.$t('aggregate.bids')+'(￥)',
                    dataIndex: 'revenue_value',
                    key:'revenue_value',
                    slots: { customRender: 'revenue_value' },
                }
            ],
            tableData:[
                {
                    mediation_group_id: '0', 
                    name: '', 
                    state: '0',
                    revenue_value: '',
                    priority:"1"
                }
            ],
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            dataIndex:0,
            isNew:false,
            sourcesList:[],
            customMacrosData:[],
            selectedRows:[],
            modifyRevenueValue:'',
            selectedRowKeys:'',
            tableLoading:false,
            firsthandRevValue:"",
            state:'1',
            data:[
                {sourcesName:undefined,adSourceName:"",template_id:"",advertiser_id:"",network_id:"",bids:"0.01",credentials:[]}
            ],
            advanced:"",
            effectiveTime:[],
            showPeriod:false,
            footer:false,
            tags:'',
            displayTimes:"1",
            displayCount:"",
            uniformSpeed:false,
            intervalTime:"1",
            dailyInterval:"",
            optimizationChecked:false,
            lifeTime:false,
            lifeTimeCount:"",
            daily:false,
            dailyCount:"",
            dailyInterval:false,
            intervalCount:"",
            placement_id:'',
            advertiser_id:"",
            template_id:"",
            network_id:"",
            platformList:[],
            adSource_id:"",
            timeZone:"",
            Sources:[],
            mediationBid_id:"",
            selectDisbaled:false,
            isSources:false,
            timeString:"",
            userInfo:"",
            grouping_id:"",
            weekList:["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],
            selectEffective:[],
            creative_template_id:"",
        }
    },
    components:{
        CloseOutlined,
        DownOutlined,
        SearchOutlined,
        EffectivePeriod,
        ExclamationCircleOutlined,
        QuestionCircleFilled
    },
    watch:{
        
        '$store.state.Util.language'(newVal,oldVal){
            console.log(newVal,oldVal);
            this.tableData.forEach((item,index)=>{
                if(item.priority=="0"){
                    item.name=this.$t('aggregate.defaultGroup');
                }
            })
        }
    },

    mounted(){
        // if (store.state.User.userAccessControl.ALLOW_ACCESS_TO_MEDIATION) {
        const { t } = useI18n();
        this.userInfo = useStore().state["User"].userInfo;
        console.log(this.userInfo);
        if(this.$route.query.isManAd=='1'){
            this.tableLoading=true;
            if(this.$route.query.newAdSource=='1'){
                this.$req.getGroupingList({placement_id:this.$route.query.placement_id,exclude_default:0}).then(res=>{
                    //console.log(res);
                    this.tableData=[];

                    res.data.data.forEach(item => {
                        if(item.priority=="0"){
                            item.name=this.$t('aggregate.defaultGroup');
                        }
                        this.tableData.push(
                            {
                                mediation_group_id: item.id, 
                                name: item.name, 
                                state: '0',
                                revenue_value: '',
                                priority:item.priority
                            }
                        )

                    });
                    this.tableData[0].state='1';
                    this.tableLoading=false;
                    this.selectDisbaled=true;
                    console.log(this.tableData[0],"name");
                    
                    this.onStar()
                    this.getNetworks();
                }).catch(err => {
                    message.warning(this.$t('aggregate.unknownError'));
                })
            }else{
                this.getMediationBidGroupList(true);
            }
            this.isSources=true;
        }else{
            this.getNetworks();
            this.onStar();
        }
            
        // } else {
        //     this.$router.push("/getlogin/login")
            
        // }    
        
    },
    methods:{
        onStar(){
            if(this.$route.query.placement_id&&this.$route.query.placement_id!=""){
                this.placement_id=this.$route.query.placement_id;
                this.app_id=this.$route.query.app_id?this.$route.query.app_id:"";

                if(this.$route.query.isManAd=='1'){
                    this.grouping_id=this.tableData[0].mediation_group_id;
                }else{
                    this.grouping_id=this.$route.query.grouping_id;
                }

                this.mediationBid_id=this.$route.query.network_id?this.$route.query.network_id:"";
                /* if(this.$route.query.isSources){
                    this.isSources=true;
                } */
                this.$req.Getplacement({placement_id:this.placement_id}).then(res=>{
                    console.log(res);
                    if(res.data.code==200){
                        this.creative_template_id=res.data.data.placement_type;
                    }   
                })
                console.log(this.placement_id);
            }
            if(this.$route.query.adSource_id&&this.$route.query.adSource_id!=""){
                this.adSource_id=this.$route.query.adSource_id;
                console.log(this.selectDisbaled,"67676");
                this.selectDisbaled=true;
                if(this.$route.query.isManAd=='0'){
                    this.getMediationBidGroupList(false);
                }
                this.getMediationList();
            }else{
                if(this.$route.query.isManAd=='0'){
                    this.isNew=true;
                    this.$req.getGroupingList({placement_id:this.$route.query.placement_id,exclude_default:0}).then(res=>{
                        let d;
                        this.tableData=[];
                        
                        res.data.data.sort((a,b)=>{return a.id-b.id});

                        console.log("qqqqqqqqqqqqqqqqqqqq");
                        console.log(res.data.data);

                        res.data.data.forEach((item,index) => {
                            if(item.priority=="0"){
                                item.name=this.$t('aggregate.defaultGroup');
                            }
                            this.tableData.push(
                                {
                                    mediation_group_id: item.id, 
                                    name: item.name, 
                                    state: '0',
                                    revenue_value: '0.01',
                                    priority:item.priority
                                }
                            )
                            if(item.id==this.$route.query.grouping_id){
                                this.dataIndex=index;
                            }
                            
                        });
                        console.log(this.dataIndex);
                        //this.tableData[0].state='1';
                        console.log(this.tableData);
                    })
                }
            }
        },

        onBlurBids() {
            let data=this.tableData[this.dataIndex].revenue_value;
            if (data.indexOf('.')!=-1&&data.length-data.indexOf('.')>3) {
                this.tableData[this.dataIndex].revenue_value=data.slice(0, data.indexOf('.')+3);
            }
        },

        onBlurRevenueValue(e){
            let data=e.revenue_value;
            if (data.indexOf('.')!=-1&&data.length-data.indexOf('.')>3&&this.tableData.indexOf(e)!=-1) {
                this.tableData[this.tableData.indexOf(e)].revenue_value=data.slice(0, data.indexOf('.')+3);
            }
        },

        onMenuClick({ key }){
            if(key=='1'||key=='0'){
                this.selectedRows.forEach(item => {
                    let index=this.tableData.indexOf(item);
                    console.log(index);
                    if(index!=-1){
                        this.tableData[index].state=key;
                        console.log(this.tableData[index].state);
                    }
                });
                //message.success(this.$t('aggregate.switchingStatusSuccessful'));
                this.selectedRows=[];
                this.selectedRowKeys='';
            }
        },
        onModifyPriceAll(){
            if(this.modifyRevenueValue==''){
                message.warning(this.$t('aggregate.DefaultisRequired'));
                return;
            }
            if(Number(this.modifyRevenueValue)>10000||Number(this.modifyRevenueValue)<0){
                message.warning(this.$t('DirCusGroup.TPRCBGTALT'));
                return;
            }
            this.selectedRows.forEach(item => {
                let index=this.tableData.indexOf(item);
                console.log(index);
                if(index!=-1){
                    this.tableData[index].revenue_value=this.modifyRevenueValue;
                }
            });
            //message.success('修改价格成功');
            this.selectedRows=[];
            this.selectedRowKeys='';
            this.modifyRevenueValue='';
        },
        onSelectChange(selectedRowKeys, selectedRows){
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.selectedRows=selectedRows;
            this.selectedRowKeys=selectedRowKeys;
        },
        effectivePeriod(){
            this.showPeriod=true;
        },
        getMediationBidGroupList(tag){
            this.$req.getMediationBidGroupList({mediation_bid_id:this.$route.query.adSource_id}).then(res=>{
                console.log(res);
                this.tableData=[];
                res.data.data.forEach((item,index) => {
                    this.tableData.push(
                        {
                            mediation_group_id: item.mediation_group_id, 
                            name: item.name, 
                            state: item.state,
                            revenue_value: Number(item.revenue_value).toFixed(2)
                        }
                    )
                    
                });
                this.tableData.push(this.tableData.shift());
                this.tableData.forEach((item,index)=>{
                    if(!tag){
                        if(item.mediation_group_id==this.$route.query.grouping_id){
                            this.dataIndex=index;
                        }
                    }
                })
                if(tag){
                    this.tableLoading=false;
                    this.onStar();
                }
            }).catch(err => {
                message.warning(this.$t('aggregate.unknownError'));
            })
        },
        triggertime(e){
            console.log(e);
            this.selectEffective=[];
            this.effectiveTime= e[0].filter(val=>{
                return val.isSelect==true;
            })
            if(e[1]==1){
                this.timeZone=this.userInfo.timezone;
            }else{
                this.timeZone=e[2];
            }
            var monday=[],tuesday=[],wednesday=[],thursday=[],friday=[],saturday=[],sunday=[];
            
            for(var i=0;i<this.weekList.length;i++){
                switch (i) {
                    case 0:
                        this.circulation(monday,i)
                        break;
                    case 1:
                        this.circulation(tuesday,i)
                        break;
                    case 2:
                        this.circulation(wednesday,i)
                        break;
                    case 3:
                        this.circulation(thursday,i)
                        break;
                    case 4:
                        this.circulation(friday,i)
                        break;
                    case 5:
                        this.circulation(saturday,i)
                        break;
                    case 6:
                        this.circulation(sunday,i)
                        break;
                }
            }
            console.log(this.selectEffective);
            this.showPeriod=false;
            
        },
        circulation(e,b){
            e=this.effectiveTime.filter((value,index)=>{
                    return value.day==this.weekList[b];
                })
                let id=[];
                if(e.length){
                    for(var i=0;i<e.length-1;i++){
                        if(e[i+1].start_hour-e[i].end_hour==1){
                            e[i+1].start_hour=e[i].start_hour;
                            id.push(e[i].id);
                        }
                    }
                }
                if(id.length){
                    e=e.filter(val=>{
                        return id.indexOf(val.id)<0;
                    })
                }
                console.log(e);
                this.selectEffective.push(...e);
        },
        periodOk(){
            this.$refs.period.effectiveSave();
            this.showPeriod=false;
        },
        periodClose(){
            this.showPeriod=false;
        },
        intervalTimeChange(e){
            console.log(e);
            
        },
        bidChange(e){
            console.log(e[0]);
            if(Number(e[0])<0.01){
                this.data[e[1]].bids="0.01";
            }
        },
        lifeTimeChange(e){
            if(!this.lifeTime){
                console.log(this.lifeTime);
                this.lifeTimeCount="";
            }
        },
        lifeTimeCountChange(){
            if(this.lifeTimeCount){
                this.lifeTime=true;
            }else {
                this.lifeTime=false;
            }
        },
        dailyChange(){
            if(!this.daily){
                this.dailyCount="";
            }
        },
        dailyCountChange(){
            if(this.dailyCount){
                this.daily=true;
            }else {
                this.daily=false;
            }
        },
        dailyIntervalChange(){
            if(!this.dailyInterval){
                this.intervalCount="";
            }
        },
        intervalCountChange(){
            if(this.intervalCount){
                this.dailyInterval=true;
            }else{
                this.dailyInterval=false; 
            }
        },
        radioChange(){
            if(this.displayTimes=="1"){
                this.uniformSpeed=false;
            }
        },
        Cancellation(){
            this.$confirm({
                title: this.$t('newMediation.cancelEdit'),
                content: this.$t('newMediation.cancelEditContent'),
                cancelText:this.$t('aggregate.cancel'),
                okText:this.$t('aggregate.enter'),
                icon: <ExclamationCircleOutlined  />,
                onOk: () => {
                    this.$route.params = {
                        app_id:this.app_id,
                        placement_id:this.placement_id,
                        network_id:this.mediationBid_id,
                        grouping_id:this.grouping_id
                    };
                    this.$router.back();
                },
                onCancel: () => {}
            });
        },
        getNetworks(){
            store.dispatch("Util/Loading", true);
            this.$req.getNetwork().then(res=>{
                console.log(res);
                if(res.data.code==200){
                    store.dispatch("Util/Loading", false);
                    this.platformList=res.data.data;
                    this.getAdList();
                }else{
                    store.dispatch("Util/Loading", false);  
                }
            })
        },
        getMediationList(){
            store.dispatch("Util/Loading", true);
            let opt ={
                placement_id:this.placement_id,
                active:"all",
                mediation_group_id:this.grouping_id
            }
            this.$req.getMediationBidsList(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    store.dispatch("Util/Loading", false);
                    
                    if(res.data.data.length){

                        console.log(this.data);

                        this.Sources=res.data.data;
                        var item=this.Sources.filter(val=>{
                            return val.id==this.adSource_id;
                        })
                        console.log(item);
                        this.data[0].sourcesName=item[0].mediated_network_name;
                        this.data[0].adSourceName=item[0].name;
                        this.data[0].network_id=item[0].mediated_network_id;
                        this.data[0].bids=Number(item[0].revenue_value);
                        this.data[0].advertiser_id=item[0].advertiser_id;
                        this.template_id=item[0].template_id;
                        this.dailyCount=item[0].max_day_imps?item[0].max_day_imps:"";
                        this.lifeTimeCount=item[0].max_lifetime_imps?item[0].max_lifetime_imps:"";
                        this.intervalCount=item[0].min_minutes_per_imp?Number(item[0].min_minutes_per_imp):"";
                        this.displayCount=item[0].daily_budget_imps?Number(item[0].daily_budget_imps):"";
                        this.uniformSpeed=item[0].enable_pacing=="1"?true:false;
                        this.displayTimes=item[0].daily_budget_imps?"2":"1";
                        this.tags=item[0].label_name;
                        this.optimizationChecked=item[0].cadence_modifier_enabled=="1"?true:false;
                        console.log(item[0].custom_macros);
                        if(item[0].daypart_targets){
                            this.selectEffective=item[0].daypart_targets;
                        }
                        this.timeZone=item[0].daypart_timezone;
                        console.log(this.effectiveTime);

                        this.state=item[0].active;

                        item[0].custom_macros.map((element,index)=>{
                            this.data[0].credentials.push(
                                {
                                    name:element.code,
                                    id:index
                                }
                            )
                        })
                        
                        console.log('0-0-0-0-0-0-0-');
                        console.log(this.data[0].credentials);

                        console.log(this.data);
                        console.log(this.data[0].credentials[0].APPID)
                        
                        item[0].custom_macros.forEach((element,index) => {
                            this.data[0].credentials[index][element.code]=element.value;
                            console.log(this.data[0].credentials[index][element.code]);
                            console.log(this.data[0].credentials);
                        });
                        
                        /* this.data[0].credentials.map((v,i)=>{
                            console.log(v);
                            console.log(v,item[0].custom_macros[i]);
                            console.log(item[0].custom_macros[i].value);
                            v[v.name]=item[0].custom_macros[i].value;
                        }) */
                        console.log(this.data,"fjowefjow");

                        console.log(this.data[0]);
                        
                    }else{
                        this.Sources=[];
                    }
                }else {
                    console.log("未知");
                    message.error(this.$t('newMediation.unknownError'));
                    store.dispatch("Util/Loading", false);
                }
            })
        },
        changeNetwork(b,i,id){
            console.log(b,i,id);
            this.data[i].credentials=[];
            var net_id="";
            this.sourcesList.forEach(value=>{
                if(value.id==b[1].key){
                    net_id=value.creative_custom_request_partner_id;
                    this.data[i].advertiser_id=value.advertiser_id;
                }
            })
            let keys=[];
            console.log(this.platformList);
            
            let arr=this.platformList.filter(val=>{
                return val.id==net_id;
            })
            this.data[i].network_id=b[1].key;
            console.log(this.data,arr);
            arr[0].partnerTemplate.map(v=>{
                this.data[i].template_id=v.id;
                if(v.templateMacro.length){
                    v.templateMacro.forEach((value,index)=>{
                        this.data[i].credentials.push({name:value.code,id:index});
                        keys=Object.keys(this.data[i].credentials);
                    })
                }
            })
            console.log(this.data[i].credentials);
            this.data[i].credentials.map((e,b)=>{
                e[e.name]="";
                console.log(e);
                console.log(this.data[i].credentials);
            })
        },
        closeSources(e){
            this.data.splice(e,1);
        },
        createAdSources(){
            if(this.isSources){
                this.data.push(
                    // {sourcesName:this.data[0].sourcesName,adSourceName:"",network_id:"",advertiser_id:"",template_id:"",bids:"0.01",credentials:JSON.parse(JSON.stringify(this.data[0].credentials))}
                    {sourcesName:undefined,adSourceName:"",network_id:"",advertiser_id:"",template_id:"",bids:"0.01",credentials:[]}
                )
                let arr=this.sourcesList.filter(val=>{
                    return val.id==this.mediationBid_id;
                })
                console.log(arr);
                this.data[this.data.length-1].sourcesName=arr[0].name;
                this.selectDisbaled=true;
                this.changeNetwork([arr[0].name,{key:arr[0].id}],this.data.length-1);
            }else{
                this.data.push(
                    {sourcesName:undefined,adSourceName:"",network_id:"",advertiser_id:"",template_id:"",bids:"0.01",credentials:[]}
                )
            }
            
        },
        getAdList(){
            store.dispatch("Util/Loading", true);
            this.$req.getPlatformList().then(res=>{
                console.log(res);
                if(res.data.code==200){
                    store.dispatch("Util/Loading", false);
                    if(res.data.data!={}){
                        this.sourcesList=res.data.data;
                    }
                    if(this.sourcesList.length){
                            this.sourcesList.map(val=>{
                            val.active=val.active=="1"?true:false;
                        })
                        if(this.isSources){
                            let arr=this.sourcesList.filter(val=>{
                                return val.id==this.mediationBid_id;
                            })
                            console.log(arr);
                            this.data[0].sourcesName=arr[0].name;
                            this.selectDisbaled=true;
                            this.changeNetwork([arr[0].name,{key:arr[0].id}],0);
                        }
                    }
                }else {
                    console.log("报错");
                    
                    message.error(this.$t('newMediation.unknownError'));
                    store.dispatch("Util/Loading", false);
                }
            })
        },
        adSource(){
            if(!this.data[0].sourcesName){
                message.error(this.$t('newMediation.pleaseSelectNetwork'));
                return;
            }
            this.$refs.formRef.validate().then(()=>{
                if(!this.isSources){
                    this.$refs.formTableRef.validate().then(()=>{
                        this.addAdSource();
                    }).catch(error => {
                        console.log('error', error);
                    });
                }else{
                    this.addAdSource();
                }
            }).catch(error => {
                console.log('error', error);
            });
        },
        addAdSource(){
            for(var i=0;i<this.data.length;i++){

                if(!this.data[i].sourcesName){
                    message.error(this.$t('newMediation.pleaseSelectNetwork'));
                    return;
                }else if(this.data[i].adSourceName.trim()==""){
                    message.error(this.$t('newMediation.pleaseEnterNetwork'));
                    return;
                }else if(this.data[i].bids==""){
                    message.error(this.$t('newMediation.pleaseBids'));
                    return;
                }else if(this.data[i].bids.toString().indexOf("e")!=-1){
                    message.error(this.$t('newMediation.bidsNumber'));
                }else {
                    for(var b=0;b<this.data[i].credentials.length;b++){
                        // console.log(this.data[i].credentials[b]);
                        
                        var str=this.data[i].credentials[b].name;
                        var xhr=/[^\u4e00-\u9fa5\u0000-\u00ff]/g;
                        var demo=/%/g;
                        let name=this.data[i].credentials[b][str];
                        var doc=name.match(xhr);
                        console.log(doc);
                        
                        var two=name.match(demo);
                        // let xhr=/^[\da-zA-Z\u4E00-\u9FA5\uF900-\uFA2D]+$/;
                        if(str!='NETWORKNAME'&&name==""){
                            message.error(`${this.$t('newMediation.pleaseEnter')}${str}`);
                            return;
                        }else if(str!='NETWORKNAME'&&doc||str!='NETWORKNAME'&&two){
                            //xhr.test(this.data[i].credentials[b][str])
                            //str!='NETWORKNAME'&&doc||str!='NETWORKNAME'&&b
                            message.error(`${str}${this.$t('newMediation.cannotContainFeatureCharacters')}`);
                            return;
                        }
                    }
                }
            }
            if(this.tableData[0].revenue_value==''){
                message.warning(this.$t('Message.bidNotEmpty'));
                return;
            }
            if(Number(this.tableData[0].revenue_value)>10000||Number(this.tableData[0].revenue_value)<0){
                message.warning(this.$t('DirCusGroup.TPRCBGTALT'));
                return;
            }
            if(this.displayTimes==2&&this.displayCount==""){
                message.error(this.$t('newMediation.pleaseEnterDailyImpsLimit'));
                return;
            }

            let mediation_group_bids=[];
            var revenue_value;
            console.log(this.tableData,"状态");
            
            this.tableData.forEach(item => {
                if(item.revenue_value!=''&&Number(item.revenue_value)>10000||Number(item.revenue_value)<0){
                    message.warning(this.$t('DirCusGroup.TPRCBGTALT'));
                    return;
                }

                /* if(this.isNew){
                    revenue_value=this.tableData[this.dataIndex].revenue_value;
                }else{
                    revenue_value=item.revenue_value==''?this.tableData[0].revenue_value:item.revenue_value;
                } */

                mediation_group_bids.push({
                    mediation_group_id: item.mediation_group_id, 
                    state: item.state,
                    revenue_value: item.revenue_value==''?this.tableData[0].revenue_value:item.revenue_value
                })

            });

            console.log(mediation_group_bids);

            store.dispatch("Util/Loading", true);
            let newArr=[];
            /* var revenueValue=this.tableData[0].revenue_value;
            if(this.$route.query.isManAd=='0'){
                if(this.$route.query.adSource_id&&this.$route.query.adSource_id!=""){
                    revenueValue=this.tableData[0].;
                }
            } */
            this.data.forEach((val,index)=>{
                console.log(val);
                newArr.push({
                    revenue_value:mediation_group_bids[0].revenue_value, 
                    name:val.adSourceName,
                    networkName:val.sourcesName,
                    advertiser_id:val.advertiser_id,
                    brand_id:"1309",
                    id:this.adSource_id?this.adSource_id:"",
                    creative_custom_request_template_id:this.creative_template_id=="1"?'37':this.creative_template_id=="5"?'60':this.creative_template_id=="50"?'61':this.creative_template_id=="65"?'59':"",
                    mediated_network_id:val.network_id,
                    custom_macros:JSON.parse(JSON.stringify(val.credentials))
                })
            })
            for(var i=0;i<newArr.length;i++){
                for(var j=0;j<newArr[i].custom_macros.length;j++){
                    newArr[i].custom_macros[j]={code:newArr[i].custom_macros[j].name,value:newArr[i].custom_macros[j][newArr[i].custom_macros[j].name]}
                }
            }
            // newArr.map(val=>{
            //     val.custom_macros[val.custom_macros.length-1].value=val.networkName;
            // })

            console.log(newArr);
            let opt ={
                placement_id:this.placement_id,
                app_id:this.app_id,
                max_day_imps:Number(this.dailyCount),
                max_lifetime_imps:Number(this.lifeTimeCount),
                min_minutes_per_imp:this.intervalTime=="1"?Number(this.intervalCount):this.intervalTime=="2"?Number(this.intervalCount)*60:this.intervalTime=="3"?Number(this.intervalCount)*60*24:"",
                daily_budget_imps:this.displayTimes=="1"?0:this.displayCount,
                enable_pacing:this.displayTimes=="2"&&this.uniformSpeed?1:0,
                label:this.tags,
                cadence_modifier_enabled:this.optimizationChecked?1:0,
                mediation_bids:newArr,
                daypart_targets:this.selectEffective,
                daypart_timezone:this.timeZone,
                mediation_group_bids:mediation_group_bids
            }
            console.log(this.data,"656565");
            
            this.$req.addMediation(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    store.dispatch("Util/Loading", false);
                    if(this.adSource_id){
                        message.success(this.$t('newMediation.editSuccessful'));
                    }else {
                        message.success(this.$t('newMediation.createdAdSoureces'));
                    }
                    this.$route.params = {
                        app_id:this.app_id,
                        placement_id:this.placement_id,
                        network_id:this.mediationBid_id,
                        grouping_id:this.grouping_id
                    };
                    this.$router.back();
                }else {
                    message.error(res.data.msg);
                    console.log(this.data);
                    store.dispatch("Util/Loading", false);
                }
                
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .newAdSource{
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;
        /deep/.ant-popover-placement-bottom{
            .ant-popover-inner-content{
                display: inline-flex;
                align-items: center;

                .ant-input{
                    margin: 0 8px;
                    width: 150px;
                }
            }
        }
        .model_Masking{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1500;
            background-color: rgba(0, 0, 0, .5);
            .model{
                width: 750px;
                position: absolute;
                background-color: #fff;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
                border-radius: 10px;
                z-index: 1600;
                .model_header{
                    display: flex;
                    justify-content: space-between;
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                }
                .model_content{
                    padding: 20px;
                }
            }
        }
        /deep/.period{
            .ant-modal-header{
                font-size: 16px;
            }
            .ant-modal-body{
                padding: 5px 20px 20px;
            }
        }
        .sourcesList{
            background-color: #fff;
            // border-radius: 10px;
            // padding: 20px;
            h1 {
                height: 35px;
                margin-bottom: 0;
            }
            .sourcesItem{
                // border: 1px solid #ccc;
                //padding: 16px 16px 0;
                min-height: 160px;
                .head{
                    //display: flex;
                    width: 49%;
                    //justify-content: space-between;
                    &>span{
                        font-size: 16px;
                        display: inline-block;
                        width: 40px;
                        line-height: 30px;
                        cursor: pointer;
                        &:hover{
                            color: #aaa;
                        }
                        &:active{
                            color: #000;
                        }
                    }
                    p{
                        display: inline-block;
                        min-width: 130px;
                        text-align: right;
                        margin-right: 16px;
                        span{
                            color: red;
                        }
                    }
                    /deep/.sourcesSelect{
                        vertical-align: middle;
                        margin-right: 15px;
                    }
                }
                .sourcesContent{
                    display: flex;
                    //margin-top: 16px;
                    flex-direction: column;
                    .fixeds{
                        display: flex;
                        width: 49%;
                        flex-direction: column;
                        div{
                            height: 32px;
                            margin-bottom: 22px;
                            line-height: 32px;
                            p{
                                display: inline-block;
                                min-width: 130px;
                                text-align: right;
                                margin-right: 16px;
                                span{
                                    color: red;
                                }
                            }
                            .sourceInput,.bidInput{
                                width: 300px;
                            }
                            .bidInput{
                                width: 100px;
                            }
                        }
                    }
                    .events{
                        display: flex;
                        width: 49%;
                        flex-direction: column;
                        div{
                            //margin-bottom: 22px;
                            height: 54px;
                            p{
                                display: inline-block;
                                min-width: 130px;
                                text-align: right;
                                margin-right: 16px;
                                span{
                                    color: red;
                                }
                            }
                            .sourceInput{
                                width: 300px;
                            }
                        }
                    }
                }
            }
            .create_Sources{
                /* margin: 16px 0; */
            }
        }
        .ant-divider-horizontal{
            margin: 20px 0;
            border-top: 1px solid #ccc;
        }
        .advancedSettings{
            background-color: #fff;
            // border-radius: 10px;
            // padding: 20px;
            /deep/.ant-collapse {
                background-color: #fff;
                .ant-collapse-item{
                    border: none;
                    .ant-collapse-content-box{
                        padding-left: 16px;
                    }
                    .ant-collapse-header{
                        font-size: 16px;
                        padding:10px  0 10px 0;
                        width: 130px;
                        .anticon-down{
                            font-weight: 700;
                            font-size: 16px;
                        }
                    }

                    .tags,.optimization,.displays,.frequency,.effective{
                        display: flex;
                        margin-bottom: 8px;
                        line-height: 32px;
                        p{
                            min-width: 130px;
                            text-align: right;
                            margin-right: 16px;
                        }
                        .tagsInput{
                            width: 200px;
                        }
                        .frequencyInput{
                            width: 100px;
                        }
                        .batchOperation{
                            width: 80px;
                        }
                    }
                    .displays{
                        line-height: px;
                        .div{
                            .uniform{
                                display: flex;
                                align-items: baseline;
                                .ant-checkbox-wrapper{
                                    margin-left: 24px;
                                }
                            } 
                        }
                    }
                    .tags{
                        
                        p{
                            margin-bottom: 0;
                            
                        }
                    }
                    .optimization{
                        align-items: center;
                        p{
                            margin-bottom: 0;
                        }
                        .optimization_switch{
                            line-height: 32px;
                        }
                    }
                    .frequency{
                        line-height: 35px;
                        .backs{
                            .item{
                                margin-bottom: 8px;
                            }
                            .batchOperation{
                                margin-left: 8px;
                            
                            }
                            .single{
                                margin-bottom: 0;
                                height: 32px;
                            }
                        }
                        
                    }
                    .effective{
                        line-height: 32px;
                        .effectivePeriod{
                            width: 100px;
                        }
                    }
                }
            }
        }

        .traGroBid_center{
            h1{
                margin-bottom: 0;
            }
            p{
                color: #ccc;
                margin-bottom: 8px;
            }
            .ant-table-wrapper{
                margin-top: 8px;
            }
        }



        .footers{
            display: flex;
            justify-content: center;
            width:100%;
            margin-top: 16px;
            .saves{
                width: 160px;
            
            }
            .cancellation {
                width: 100px;
                margin-left: 16px;
            }
        }

    }
</style>