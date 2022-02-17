<template>
    <div class="AdPlatform">
        <div class="selectItem">
            <p>{{$t('newAdPlatform.network')}}<span>*</span></p>
            <a-select
            v-model:value="formState.adPlatform"
            style="width:350px;"
            :placeholder="$t('newAdPlatform.selectANetwork')"
            showArrow
            :maxTagCount="1"
            class="searchName"
            @change="changeNetwork"
            :disabled="isShowNetwork"
            >
                <!-- <template #suffixIcon>
                    <SearchOutlined style="color:#6577c8"/>
                </template> -->
                <a-select-option v-for="item in platformList" :value="item.name" :key="item.id">
                    <span>
                        {{item.name}}
                    </span>
                </a-select-option>
            </a-select>
        </div>
        <div class="selectItem">
            <p>{{$t('newAdPlatform.currency')}}<span>*</span></p>
            <a-select
                v-model:value="formState.currencyType"
                style="width:350px;"
                :placeholder="$t('newAdPlatform.selectCurrency')"
                showArrow
                :maxTagCount="1"
                class="searchName"
                >
                    <!-- <template #suffixIcon>
                        <SearchOutlined style="color:#6577c8"/>
                    </template> -->
                    <a-select-option v-for="item in currencyList" :value="item.value" :key="item.label">
                        <span>
                            {{item.label}}
                        </span>
                    </a-select-option>
            </a-select>
        </div>
        <div class="selectItem">
            <p>{{$t('newAdPlatform.networkName')}}<span>*</span></p>
            <a-input v-model:value="formState.adPlatformName" :placeholder="$t('newAdPlatform.pleaseEnterNetwork')"/>
        </div>
        <div class="selectItem" v-if="formState.adPlatform">
            <p>{{$t('newAdPlatform.reportSync')}}</p>
            <a-switch v-model:checked="formState.reportSync" @change="editReportSync"/>
        </div>
        <div class="selectItem" v-if="formState.reportSync&&formState.adPlatform" v-for="value in formState.formCredent" :key="value.id">
            <p>{{value.names}}<span>*</span></p>
            <a-input v-model:value="value[value.name]" :placeholder="value.name"/>
        </div>
        <!-- <div class="selectBtn">
            <a-button type="primary" class="saves" @click="adPlatformSave">{{$t('newAdPlatform.save')}}</a-button>
        </div> -->
    </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>
import { useI18n } from 'vue-i18n';
import { message} from 'ant-design-vue';
import { defineComponent, ref,reactive} from "vue";
import {SyncOutlined} from "@ant-design/icons-vue";
import store from '@/store';
export default {
    components: {
        SyncOutlined
    },
    props:["network_id","partner_id"],
    data(){
        return{
            credentials:[],
            platformList:[],
            currencyList:[],
            syncShow:false,
            isShowNetwork:false,
            // formCredent:{},
            adPlatformId:"",
            formState:{
            adPlatform:undefined,
            adPlatformName:"",
            currencyType:"USD",
            reportSync:false,
            formCredent:[],
            },
            bidList:[],
        }
    },
    mounted(){
        const { t } = useI18n();
        this.getNetworks();
        this.getCurrencys();
        // if(this.network_id){
        //     this.getAdList();
        // }
    },
    methods:{
        getNetworks(){
            store.dispatch("Util/Loading", true);
            this.$req.getNetwork().then(res=>{
                console.log(res);
                if(res.data.code==200){
                    if(res.data.data.length){
                        this.platformList=res.data.data;
                        if(this.network_id){
                            var arr=this.platformList.filter(val=>{
                                return val.id=this.partner_id;
                            })
                            this.adPlatformId=this.partner_id;
                            console.log(arr);
                            this.formState.adPlatform=arr[0].name;
                            this.isShowNetwork=true;
                            if(arr[0].partnerCredential.length){
                                this.formState.formCredent=[];
                                arr[0].partnerCredential.map(item=>{
                                    item.names=item.name=="publisher_id"?this.$t('newAdPlatform.publisherId'):item.name=="access_token"?this.$t('newAdPlatform.accessToken'):"";
                                })
                                this.credentials=arr[0].partnerCredential;
                                console.log(this.credentials);
                                this.credentials.map(val=>{
                                    console.log(val,"55");
                                    this.formState.formCredent.push({name:val.name,names:val.names,id:val.id})
                                })
                                this.formState.formCredent.map(value=>{
                                    value[value.name]="";
                                })
                                this.getAdList();
                                console.log(this.formState.formCredent);
                            }
                            
                        }
                    }else{
                        this.platformList=[];
                    }
                    store.dispatch("Util/Loading", false);
                }else{
                    store.dispatch("Util/Loading", false);  
                }
            })
        },
        getCurrencys(){
            this.$req.getCurrency().then(res=>{
                console.log(res);
                if(res.status==200){
                    this.currencyList=res.data.data.map((item,index)=>{
                            return item={
                                value:item.code,
                                label:item.name
                            }
                    })
                    console.log(this.defaultCurrencys);
                }else {
                    console.log("获取默认货币列表失败");
                }
                
            })
        },
        editReportSync(){
            console.log(this.formState.reportSync);
        },
        getAdList(){
            store.dispatch("Util/Loading", true);
            this.$req.getPlatformList().then(res=>{
                console.log(res);
                if(res.data.code==200){
                    if(res.data.data.length){
                        this.bidList=res.data.data;
                        console.log(this.bidList);
                        var arr=this.bidList.filter(val=>{
                            return val.id==this.network_id;
                        })
                        console.log(arr);
                        this.formState.currencyType=arr[0].default_bid_currency;
                        this.formState.adPlatformName=arr[0].name;
                        console.log(JSON.parse(arr[0].credentials));
                        let str=arr[0].credentials;
                        let b=JSON.parse(str);
                        var arr = []
                        for (let i in b) {
                            let o = {};
                            o[i] = b[i];
                            arr.push(o)
                        }
                        console.log(arr);
                        if(arr.length){
                            this.formState.reportSync=true;
                            // for(var i=0;i<arr.length;i++){
                            //     this.formState.formCredent.push({name:Object.keys(arr[i]).toString(),id:i})
                            // }
                            console.log(this.formState.formCredent);
                            this.formState.formCredent.map((val,index)=>{
                                val[val.name]=arr[index][val.name];
                                // val.names=val.name=="username"?"用户名":val.name=="password"?"密码":"";
                            })
                            console.log(this.formState.formCredent);
                        }

                        
                    }else {
                        this.bidList=[];
                    }
                    store.dispatch("Util/Loading", false);
                }else {
                    message.error(this.$t('newAdPlatform.unknownError'));
                    store.dispatch("Util/Loading", false);
                }
            })
        },
        changeNetwork(e,b){
                console.log(e,b);
                this.adPlatformId=b.key;
                let arr=this.platformList.filter(val=>{
                    return val.id=b.key;
                })
                console.log(arr);
                if(arr[0].partnerCredential.length){
                    this.syncShow=true;
                    this.formState.formCredent=[];
                    arr[0].partnerCredential.map(item=>{
                        item.names=item.name=="publisher_id"?this.$t('newAdPlatform.publisherId'):item.name=="access_token"?this.$t('newAdPlatform.accessToken'):"";
                    })
                    this.credentials=arr[0].partnerCredential;
                    console.log(this.credentials);
                    
                    this.credentials.map(val=>{
                        console.log(val,"55");
                        this.formState.formCredent.push({name:val.name,names:val.names,id:val.id})
                    })
                    this.formState.formCredent.map(value=>{
                        value[value.name]="";
                    })
                    console.log(this.formState.formCredent);
                }
                
            },
            adPlatformSave(){
                let arr={};
                if(!this.formState.adPlatform||this.formState.adPlatform==""){
                        message.error(this.$t('newAdPlatform.pleaseSelectNetwork'));
                        return;
                }else if(this.formState.currencyType==""){
                    message.error(this.$t('newAdPlatform.pleaseSelectCurrency'));
                    return;
                }
                else  if(this.formState.adPlatformName.trim()==""){
                    message.error(this.$t('newAdPlatform.pleaseEnterNetwork'));
                    return;
                }else if(this.formState.reportSync){
                    for(var i=0;i<this.formState.formCredent.length;i++){
                        var str= this.formState.formCredent[i].name;
                        if(this.formState.formCredent[i][str]==""){
                            message.error(`${this.$t('newAdPlatform.pleaseEnter')} ${this.formState.formCredent[i].names}`);
                            return;
                        }else {
                            arr[this.formState.formCredent[i].name]=this.formState.formCredent[i][str];
                        }
                    }
                }
                let opt={
                    adPlatform:this.formState.adPlatform,
                    name:this.formState.adPlatformName,
                    id:this.network_id?this.network_id:"",
                    currencyType:this.formState.currencyType,
                    is_data_integration_active:this.formState.reportSync?1:0,
                    creative_custom_request_partner_id:this.adPlatformId,
                    brand_id:"1309",
                    credentials:arr
                }
                this.$emit("advertisingPlatform",opt);
            }

    }
}
</script>

<style lang="less" scoped>
    .AdPlatform{
        padding-left: 16px;
        /deep/.ant-form{
            .ant-form-item{
                .ant-form-item-label{
                    width: 130px;
                    margin-right: 16px;
                }
                .ant-form-item-control-input{
                    width: 350px;
                    
                }
            }
        }
        .selectItem{
            display: flex;
            align-items: center;
            margin-top: 15px;
            p {
                width: 130px;
                text-align: right;
                margin-bottom: 0;
                margin-right: 16px;
                span{
                    color: red;
                }
            }
        
            /deep/ .ant-input{
                width: 350px;
            }         
            
        }
        // .selectBtn {
        //     display: flex;
        //     justify-content: center;
        //     margin-top: 20px;
        //     .saves {
        //             width: 160px;
        //             height: 35px;
        //             border: none;
        //             border-radius: 10px;
        //             margin-bottom: 20px;
        //             background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
        //         }
        // }
    }
</style>>
