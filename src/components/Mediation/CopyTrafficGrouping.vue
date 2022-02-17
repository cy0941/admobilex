<template>
    <div class="CopyTrafficGrouping">
        <div class="selectItem">
            <p>{{$t('trafficGrouping.app')}}</p>
            <a-select
                v-model:value="selectApp"
                class="selectApp"
                :placeholder="$t('trafficGrouping.app')"
                @change="changeApp"
                >
                <a-select-option
                    v-for="item in app_names"
                    :value="item.appInfo.id"
                    :key="item.appInfo.id"
                >
                    <span>
                        <AppleOutlined style="margin-right:5px;" v-if="item.appInfo.platform==1" />
                        <AndroidOutlined style="margin-right:5px;" v-else />
                        {{item.appInfo.app_official_name}}
                    </span>
                </a-select-option>
            </a-select>
        </div>
        <div class="selectItem">
            <p>{{$t('trafficGrouping.AdvertisingUnit')}}</p>
            <a-select
                v-model:value="selectAdUnit"
                :placeholder="$t('trafficGrouping.AdvertisingUnit')"
                @change="changePlacement"
                class="selectAdUnit"
                >
                <a-select-option
                    v-for="item in placements"
                    :value="item.placement_id"
                    :key="item.placement_id"
                >
                    <span>
                    
                        {{item.media_Type=='banner'?`${$t('aggregate.banner')} ${item.placement_name}`:item.media_Type=='interstitial'?`${$t('aggregate.insertion')} ${item.placement_name}`:item.media_Type=='stimulate'?`${$t('aggregate.motivationalVideos')} ${item.placement_name}`:`${$t('aggregate.vastVideo')} ${item.placement_name}`}}
                        
                    </span>
                </a-select-option>
            </a-select>
        </div>
        <p class="copy_title">{{$t('trafficGrouping.copyGroup')}}</p>
        <a-spin :spinning="copyGroupingLoading">
            <a-table
                :data-source="grouping"
                :rowSelection="rowSelection"
                :rowKey="record => record.id"
                >
                <a-table-column key="name" :title="$t('trafficGrouping.trafficGrouping')" data-index="name" />
                <a-table-column key="id" :title="$t('trafficGrouping.trafficGroupingSettings')" data-index="id">
                    <template #default="{record}">
                        <div>
                            <span style="margin-right:8px;" v-if="record.select.languageSelect.selectLanguage.length">{{$t('trafficGrouping.language')}} {{record.select.languageSelect.languageContains}} {{record.select.languageSelect.selectLanguage.toString()}}</span>
                            <span style="margin-right:8px;" v-if="record.select.ageSelect.selectAge.length">{{$t('trafficGrouping.age')}} {{record.select.ageSelect.ageContains}} {{record.select.ageSelect.selectAge.toString()}}</span>
                            <span style="margin-right:8px;" v-if="record.select.genderSelect.selectGender.length">{{$t('trafficGrouping.gender')}} {{record.select.genderSelect.genderContains}} {{record.select.genderSelect.selectGender.toString()}}</span>
                            <span style="margin-right:8px;" v-if="record.select.paidSelect.selectPaid.length">{{$t('trafficGrouping.paid')}} {{record.select.paidSelect.paidContains}} {{record.select.paidSelect.selectPaid.toString()}}</span>
                            <span style="margin-right:8px;" v-if="record.select.installTime.time.length">{{$t('trafficGrouping.installationTime')}} {{record.select.installTime.time.toString()}}</span>
                            <span style="margin-right:8px;" v-if="record.select.networkType.selectNetworkType">{{$t('trafficGrouping.networkType')}} {{record.select.networkType.networkTypeContains}} {{record.select.networkType.selectNetworkType}}</span>
                            <span style="margin-right:8px;" v-if="record.select.systemVersion.selectSystemVersion">{{$t('trafficGrouping.systemVersion')}} {{record.select.systemVersion.systemVersionContains}} {{record.select.systemVersion.selectSystemVersion}}</span>
                            <span style="margin-right:8px;" v-if="record.select.appVersion.selectAppVersion">{{$t('trafficGrouping.applicationVersion')}} {{record.select.appVersion.appVersionContains}} {{record.select.appVersion.selectAppVersion}}</span>
                            <span style="margin-right:8px;" v-if="record.select.sdkVersion.selectSdkVersion">{{$t('trafficGrouping.sdkVersion')}} {{record.select.sdkVersion.sdkVersionContains}} {{record.select.sdkVersion.selectSdkVersion}}</span>
                            <span style="margin-right:8px;" v-if="record.select.deviceId.selectDeviceId">{{$t('trafficGrouping.deviceID')}} {{record.select.deviceId.deviceIdContains}} {{record.select.deviceId.selectDeviceId}}</span>
                            <span style="margin-right:8px;" v-if="record.select.deviceType.selectDeviceType">{{$t('trafficGrouping.deviceType')}} {{record.select.deviceType.deviceTypeContains}} {{record.select.deviceType.selectDeviceType}}</span>
                            <span style="margin-right:8px;" v-if="record.select.deviceBrand.selectDeviceBrand">{{$t('trafficGrouping.equipmentBrand')}} {{record.select.deviceBrand.deviceBrandContains}} {{record.select.deviceBrand.selectDeviceBrand}}</span>
                            <span style="margin-right:8px;" v-if="record.select.channel.selectChannel">{{$t('trafficGrouping.channels')}} {{record.select.channel.channelContains}} {{record.select.channel.selectChannel}}</span>
                            <span style="margin-right:8px;" v-if="record.select.idfa.selectidfa">IDFA  {{record.select.idfa.selectidfa}}</span>
                            <span style="margin-right:8px;" v-if="record.select.kvExpression.length">{{$t('trafficGrouping.customizationKV')}} <span style="margin-right:8px;" v-for="item in record.select.kvExpression" :key="item.key">{{item.contains}} key:{{item.key}} value:{{item.value}}</span></span>
                        </div>
                    </template>
                </a-table-column>
                
            </a-table>
        </a-spin>
    </div>
</template>

<script>
import {AppleOutlined,AndroidOutlined} from "@ant-design/icons-vue";
import { message} from 'ant-design-vue';
import store from '@/store';
export default {
    components:{
        AppleOutlined,
        AndroidOutlined
    },
    props:["placement_id","app_id"],
    data(){
        return {
            app_names:[],
            selectApp:undefined,
            placements:[],
            selectAdUnit:undefined,
            grouping:[],
            selectGrouping: [],
            rowSelection: {
                onChange: (selectedRowKeys, selectedRows) => {
                this.rowSelection.selectedRowKeys = selectedRowKeys;
                this.selectGrouping = selectedRows;
                console.log(
                    `selectedRowKeys: ${selectedRowKeys}`,
                    "selectedRows: ",
                    selectedRows
                );
                },
                getCheckboxProps: record => ({
                disabled: record.name === "Disabled User", // Column configuration not to be checked
                name: record.name
                }),
                selectedRowKeys: []
            },
            copyGroupingLoading:false,
            languages:[],
            languageEn:[],
            languageType:"",
        }
    },
    mounted(){
        this.languageType=store.state.Util.language;
        this.getLangage();
        this.getApp();
        
    },
    methods:{
        // 获取所有APP
        getApp() {
            let opt = { name: "" };
            this.$req.appNameList(opt).then(res => {
                if (res.data.code === 200) {
                    console.log(res.data.data);
                    if (res.data.data) {
                        this.app_names = res.data.data;
                        this.selectApp=this.app_id;
                        this.changeApp(this.selectApp);
                    } else {
                        this.app_names = [];
                    }
                }
            });
        },
        onSelectChange(e){
            console.log(e);
            
        },
        //获取语言列表
        getLangage(){
            this.$req.Language().then(res=>{
                if(res.data.code === 200){
                    res.data.data.map(value=>{
                        this.languages.push({
                            value: value.id,
                            label: value.zh_name,
                        });
                        this.languageEn.push({
                            value: value.id,
                            label: value.name,
                        })
                    })
                    console.log(this.languages);
                    
                    store.dispatch("Util/Loading",false); 
                }else if(res.data.code !== 200){
                    message.error(res.data.msg);
                    store.dispatch("Util/Loading",false);
                }
            })
        },
        //根据流量分组信息渲染流量分组选择的定位
        groupingContent(e){
            console.log(e);
                let select={
                    languageSelect:{
                        selectLanguage:[],
                        languageContains:"",
                    },
                    ageSelect:{
                        ageContains:"",
                        selectAge:[],
                    },
                    genderSelect:{
                        genderContains:"",
                        selectGender:[],
                    },
                    paidSelect:{
                        selectPaid:[],
                        paidContains:"",
                    },
                    installTime:{
                        time:[]
                    },
                    networkType:{
                        networkTypeContains:"",
                        selectNetworkType:"",
                    },
                    systemVersion:{
                        systemVersionContains:"",
                        selectSystemVersion:"",
                    },
                    appVersion:{
                        appVersionContains:"",
                        selectAppVersion:"",
                    },
                    sdkVersion:{
                        sdkVersionContains:"",
                        selectSdkVersion:"",
                    },
                    deviceId:{
                        deviceIdContains:"",
                        selectDeviceId:"",
                    },
                    deviceType:{
                        deviceTypeContains:"",
                        selectDeviceType:"",
                    },
                    deviceBrand:{
                        deviceBrandContains:"",
                        selectDeviceBrand:"",
                    },
                    channel:{
                        channelContains:"",
                        selectChannel:"",
                    },
                    idfa:{
                        selectidfa:"",
                    },
                    kvExpression:[],
                }

                if(e.language){
                    let arr=e.language.language_ids.split(",");
                    console.log(arr);
                    select.languageSelect.languageContains=e.language.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    let b=[];
                    if(this.languageType=="zh"){
                        b=this.languages.filter(val=>{
                            return arr.includes(val.value);
                        })
                    }else{
                        b=this.languageEn.filter(val=>{
                            return arr.includes(val.value);
                        })
                    }
                    
                    b.forEach(item=>{
                        select.languageSelect.selectLanguage.push(item.label)
                    })
                    console.log(select.languageSelect.selectLanguage);
                    
                } 
                if(e.age.length){
                    select.ageSelect.ageContains=e.age[0].action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    e.age.forEach(v => {
                        switch (v.low) {
                            case "13":
                                select.ageSelect.selectAge.push("<18");
                                break;
                            case "18":
                                select.ageSelect.selectAge.push("18-24");
                                break;
                            case "25":
                                select.ageSelect.selectAge.push("25-34");
                                break;
                            case "35":
                                select.ageSelect.selectAge.push("35-44");
                                break;
                            case "45":
                                select.ageSelect.selectAge.push("45-54");
                                break;
                            case "55":
                                select.ageSelect.selectAge.push("55-64");
                                break;
                            case "65":
                                select.ageSelect.selectAge.push("≥65");
                                break;
                        }
                    });
                    console.log(select.selectAge);
                    
                }
                if(e.gender){
                    select.genderSelect.genderContains=e.gender.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    let str=e.gender.gender.split(",");
                    str.forEach(item=>{
                        if(item=="male"){
                            select.genderSelect.selectGender.push(this.$t('demographics.male'))
                        }else if(item=="female"){
                            select.genderSelect.selectGender.push(this.$t('demographics.female'))
                        }else if(item=="unknown"){
                            select.genderSelect.selectGender.push(this.$t('demographics.allowUnknown'))
                        }
                    })
                }
                if(e.premium){
                    select.paidSelect.paidContains=e.premium.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                
                    e.premium.premium=='1'?select.paidSelect.selectPaid.push(this.$t('trafficGrouping.paid')):select.paidSelect.selectPaid.push(this.$t('trafficGrouping.nonPaying'))
                    
                    console.log(this.paidSelect);
                    
                }
                if(e.install.length){
                    e.install.forEach(item=>{
                        select.installTime.time.push(`${item.action_type} ${item.value} ${item.value_type=="1"?this.$t('trafficGrouping.hours'):item.value_type=="2"?this.$t('trafficGrouping.days'):this.$t('trafficGrouping.week')}`)
                    })
                }
                if(e.network){
                    select.networkType.networkTypeContains=e.network.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    select.networkType.selectNetworkType=e.network.network_type;
                }
                if(e.system){
                    select.systemVersion.systemVersionContains=e.system.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    select.systemVersion.selectSystemVersion=e.system.operating_system;
                }
                if(e.appVersion){
                    select.appVersion.appVersionContains=e.appVersion.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    select.appVersion.selectAppVersion=e.appVersion.app_version;
                }
                if(e.sdkVersion){
                    select.sdkVersion.sdkVersionContains=e.sdkVersion.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    select.sdkVersion.selectSdkVersion=e.sdkVersion.sdk_version;
                }
                if(e.deviceId){
                    select.deviceId.deviceIdContains=e.deviceId.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    select.deviceId.selectDeviceId=e.deviceId.device_id;
                }
                if(e.deviceType){
                    select.deviceType.deviceTypeContains=e.deviceType.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    select.deviceType.selectDeviceType=e.deviceType.device_type;
                }
                if(e.deviceBrand){
                    select.deviceBrand.deviceBrandContains=e.deviceBrand.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    select.deviceBrand.selectDeviceBrand=e.deviceBrand.device_brand;
                }
                if(e.channel){
                    select.channel.channelContains=e.channel.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    select.channel.selectChannel=e.channel.channel;
                }
                if(e.idfa){
                    select.idfa.selectidfa=e.idfa.idfa_status=='1'?this.$t("trafficGrouping.thereAreIDFA"):this.$t("trafficGrouping.noneIDFA");
                }
                if(e.kvExpression.length){
                    e.kvExpression.forEach(item=>{
                        select.kvExpression.push({
                            contains:item.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion'),
                            key:item.key,
                            value:item.value
                        })
                    })
                }
                return select;
        },
        changeApp(e){
            console.log(e);
            let opt={
                app_id: e,
                page: 1,
                num_elements: 10,
                no_paginate: 1,
            }
            this.grouping=[];
            this.placements=[];
            this.selectAdUnit=undefined,
            this.$req.AppPlacement(opt).then(res=>{
                console.log(res);
                if(res.data.code=='200'){
                    this.placements=res.data.data.placement_list;
                    this.placements=this.placements.filter(item=>{
                        return item.placement_id!=this.placement_id;
                    })
                    if(this.placements.length){
                        this.selectAdUnit=this.placements[0].placement_id;
                        this.changePlacement(this.selectAdUnit)
                    }
                }

            })
        },
        changePlacement(e){
            console.log(e);
            this.copyGroupingLoading=true;
            if(e){
                this.$req.getGroupingList({placement_id:e,exclude_default:0}).then(res=>{
                    console.log(res);
                    if(res.data.code==200){
                        this.copyGroupingLoading=false;
                        if(JSON.stringify(res.data.data)=="{}"){
                            this.grouping=[];
                        }else{
                            this.grouping=res.data.data;
                            this.grouping=this.grouping.filter(item=>{
                                return item.priority!="0"
                            })
                            this.grouping.map((item,index)=>{
                                item.select=this.groupingContent(item);
                            })
                        }
                        
                        console.log(this.grouping);
                        
                    }else{
                        this.copyGroupingLoading=false;
                        this.grouping=[];
                    }
                })
            }else{
                this.copyGroupingLoading=false;
                this.grouping=[];
            }
            
        },
        //复制流量分组
        copyGrouping(){
            console.log(this.selectGrouping);
            if(this.selectGrouping.length){
                this.$emit("copyGrouping",[this.selectGrouping,this.selectAdUnit])
            }else{
                message.error(this.$t('trafficGrouping.noGroupSelected'));
            }
            
        }
    }
}
</script>

<style lang="less" scoped>
    .CopyTrafficGrouping{
        .selectItem{
            display: flex;
            height: 40px;
            align-items: center;
            margin-bottom: 8px;
            p{
                width: 150px;
                margin-bottom: 0;
                margin-right: 16px;
                text-align: right;
            }
            .selectApp,.selectAdUnit{
                flex: 1;
                max-width: 636px;
            }
        }
        .copy_title{
            margin: 8px 0;
        }
    }
</style>