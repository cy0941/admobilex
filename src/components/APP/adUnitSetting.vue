<template>
<div>
    <a-spin :spinning="loading">
    <div class="adunitsetting">
        <div class="left">
            <div class="title">
                <h1>{{$t('adUnit.basicSettings')}}</h1>
            </div>
            <a-form ref="validations"  :model="formState" :rules="rules"  :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                <a-form-item :label="$t('adUnit.AdFormat')" name="adTypen" class="adTypen">
                    <a-select v-model:value="formState.adTypen" :placeholder="$t('adUnit.AdFormat')" @change="typeChange">
                        <a-select-option v-if="features.ALLOW_ACCESS_ADD_BANNER_PLACEMENT" value="1">{{$t('adUnit.banner')}}</a-select-option>
                        <a-select-option v-if="features.ALLOW_ACCESS_ADD_VAST_PLACEMENT" value="2">{{$t('adUnit.vastVideo')}}</a-select-option>
                        <a-select-option v-if="features.ALLOW_ACCESS_ADD_INTERSTITIAL_PLACEMENT" value="3">{{$t('adUnit.insertion')}}</a-select-option>
                        <a-select-option v-if="features.ALLOW_ACCESS_ADD_MOTIVATIONAl_VIDEOS_PLACEMENT" value="4">{{$t('adUnit.motivationalVideos')}}</a-select-option>
                    </a-select>
                </a-form-item>
                <!-- <a-form-item label="每日展示次数上限" name="count_radio" class="upperLimit">
                    <a-radio-group v-model:value="formState.count_radio" class="restrictions">
                        <a-radio value="1" >无限制</a-radio>
                        <a-radio value="2">
                            <a-input v-model:value="formState.count" placeholder="每日展示次数上限" type="Number" :maxlength="8" prop="count" autofocus :disabled="formState.count_radio!=2" /><br />
                            <a-checkbox v-model:checked="formState.constant" :disabled="formState.count_radio!=2">匀速消耗</a-checkbox>
                            <a-popover title="" placement="right">
                                <template #content>
                                    <p>将展示次数均匀分布到一天的时间中。</p>
                                </template>
                                    <span class="note doubt">1</span>
                            </a-popover>
                        </a-radio>
                    </a-radio-group>
                </a-form-item> -->
                <a-form-item :label="$t('adUnit.adSize')" name="adSize" class="adSize" v-if="formState.adTypen=='1'">
                    <a-select v-model:value="formState.adSize" :placeholder="$t('adUnit.adSize')" @change="sizeChange" >
                        <a-select-option v-for="(item,index) in placementSizeList" :value="item" :key="index+'sdf'">{{item}}</a-select-option>
                    </a-select>
                    <div class="Customization" v-if="formState.adSize==$t('adUnit.Customization')">
                        <a-input type="Number" v-model:value="formState.leftSize" :placeholder="$t('adUnit.width')" @change="leftSizeChange"/>&nbsp;x&nbsp;<a-input type="Number" v-model:value="formState.rightSize" :placeholder="$t('adUnit.height')" @change="rightSizeChange"/><a-checkbox class="addSizeList" v-model:checked="formState.addSizeList" >{{$t('adUnit.addsize')}}</a-checkbox>
                    </div>
                </a-form-item>
                <a-form-item ref="name" :label="$t('adUnit.AdUnitName')" name="adName" class="adName">
                    <a-input v-model:value="formState.adName" :placeholder="$t('adUnit.AdUnitName')" autoComplete="off"/>
                </a-form-item>
                <!-- <a-form-item label="付费用户" name="paid">
                    <a-radio-group v-model:value="formState.paid">
                        <a-radio value="全部">全部</a-radio>
                        <a-radio value="付费">付费</a-radio>
                        <a-radio value="非付费">非付费</a-radio>
                    </a-radio-group>
                </a-form-item> -->
                <a-form-item :label="$t('adUnit.state')" class="adStatus" name="active">
                    <a-radio-group v-model:value="formState.active">
                        <a-radio value="1">{{$t('adUnit.active')}}</a-radio>
                        <a-radio value="2">{{$t('adUnit.inActive')}}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <!-- <a-form-item label="语言限制"  name="language" class="language">
                    <a-select mode="multiple" v-model:value="formState.language" placeholder="选择语言">
                        <a-select-option :value="v.value" v-for="(v) in languages" :key="v.value">{{v.label}}</a-select-option>
                    </a-select>
                </a-form-item> -->
            </a-form>
        </div>
        <div class="right">
            <h1>{{$t('adUnit.restrictionOptions')}}</h1>
            <a-form ref="validation"  :model="formState" :rules="rules"  :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" >
                <!-- <a-form-item label="广告格式" name="adTypen" class="adTypen">
                    <a-select v-model:value="formState.adTypen" placeholder="广告格式" >
                        <a-select-option value="1">VAST视频</a-select-option>
                        <a-select-option value="2">other</a-select-option>
                    </a-select>
                </a-form-item> -->
                <a-form-item :label="$t('adUnit.dailyImpsLimit')" name="count_radio" class="upperLimit">
                    <a-radio-group v-model:value="formState.count_radio" class="restrictions">
                        <a-radio value="1" >{{$t('adUnit.noLimit')}}</a-radio>
                        <a-radio value="2">
                            <a-input v-model:value="formState.count" :placeholder="$t('adUnit.dailyImpsLimit')" type="Number" :maxlength="8" prop="count" autofocus :disabled="formState.count_radio!=2" /><br />
                            <a-checkbox v-model:checked="formState.constant" :disabled="formState.count_radio!=2">{{$t('adUnit.uniformConsumption')}}</a-checkbox>
                            <a-popover title="" placement="right">
                                <template #content>
                                    <p>{{$t('adUnit.averageDstribution')}}</p>
                                </template>
                                <span class="note doubt"></span>
                            </a-popover>
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
                <!-- <a-form-item ref="name" label="广告单元名称" name="adName" class="adName">
                    <a-input v-model:value="formState.adName" placeholder="请输入广告单元名称"/>
                </a-form-item> -->

                <!-- <a-form-item :label="$t('adUnit.paidUsers')" name="paid">
                    <a-radio-group v-model:value="formState.paid">
                        <a-radio value="全部">{{$t('adUnit.all')}}</a-radio>
                        <a-radio value="付费">{{$t('adUnit.paid')}}</a-radio>
                        <a-radio value="非付费">{{$t('adUnit.nonPaying')}}</a-radio>
                    </a-radio-group>
                </a-form-item> -->
                
                <!-- <a-form-item label="广告单元状态" class="adStatus" name="active">
                    <a-radio-group v-model:value="formState.active">
                        <a-radio value="1">开启</a-radio>
                        <a-radio value="2">关闭</a-radio>
                    </a-radio-group>
                </a-form-item> -->

                <!-- <a-form-item :label="$t('adUnit.languageRestrictions')"  name="language" class="language">
                    <a-select mode="multiple" v-model:value="formState.language" :placeholder="$t('adUnit.selectLanguage')" @change="languAge">
                        <a-select-option :value="v.label" v-for="(v) in languageType=='zh'?languages:languageEn" :key="v.value">{{v.label}}</a-select-option>
                    </a-select>
                    <a-radio-group name="radioGroup" v-model:value="isContain" style="margin-top:4px;">
                        <a-radio :value="true">{{$t('adUnit.contains')}}</a-radio>
                        <a-radio :value="false">{{$t('adUnit.exclusion')}}</a-radio>
                    </a-radio-group>
                </a-form-item> -->

                <!-- <a-form-item :wrapper-col="{ span: 14, offset: 8 }" class="advertisingUnit">
                    <a-button type="primary" class="saves" @click="advertisingUnit">保存</a-button>
                </a-form-item> -->
            </a-form>
        </div>
        <!-- <div class="footer">
            <a-button type="primary" class="saves" @click="advertisingUnit">{{$t('adUnit.save')}}</a-button>
        </div> -->
    </div>
    </a-spin>
</div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>
import store from '@/store';
import { mapGetters, useStore } from "vuex";
import { message} from 'ant-design-vue';
import { defineComponent, ref, reactive } from "vue";
import { useI18n } from 'vue-i18n';
export default {
    name:"adunitsetting",
    props:["compile"],
    setup(){
        const { t } = useI18n();
        const formState=reactive({
            adTypen:'4',
            adName:"",
            active:"1",
            count:"",
            count_radio:"1",
            constant:false,
            paid:"全部",
            language:[],
            language_id:[],
            adSize:undefined,
            leftSize:"",
            rightSize:"",
            addSizeList:false,
            placementWidth:"",
            placementHeight:"",
            features:"",
        });
        let validatorSize=async (rule,value)=>{
            let rex = new RegExp("/[^\d]/g")
            if (value.lenght==0) {
                return Promise.reject(t('adUnit.customSize'))
            }
            if (!rex.test(value)) {
                return Promise.reject(t('adUnit.digital'))
            } else {
                return Promise.resolve();
            }
        };
        const rules={
            adName: [{ required: true,message: t('adUnit.adUnitNameMessage'), trigger: ['change', 'blur'] }],
            adSize: [{ required: true,message: t('adUnit.selectAdSizeMessage'), trigger: ['change', 'blur'] }],
            adTypen:[{ required: true,message: t('adUnit.selectAdUnit'), trigger: ['change', 'blur'] }],
        }
        return {
            formState,
            validatorSize,
            rules
        }
    },
    data(){
        return{
            languages:[],
            languageEn:[],
            loading:false,
            placementSizeList:[],
            isContain:true,
            languageType:"",
        }
    },
    created() {
        this.languageType=store.state.Util.language;
        this.features = useStore().state["User"].userAccessControl;
        const { t } = useI18n();
    },
    methods:{
        languAge(e,b){
            console.log(e,b);
            console.log(b.length)
            if(b.length){
                this.formState.language_id=[]
                b.forEach(val=>{
                    this.formState.language_id.push(val.key);
                })
            }
            console.log(this.formState.language_id);
            
        },
        rightSizeChange(e){
            console.log(this.formState.rightSize);
            
            this.formState.placementHeight=this.formState.rightSize;
        },
        leftSizeChange(e){
            console.log(this.formState.leftSize);
            
            this.formState.placementWidth=this.formState.leftSize;
        },
        advertisingUnit(){

            if(!this.isContain){
                let data=[];
                this.languages.forEach(item => {
                    if(this.formState.language_id.indexOf(item.value)==-1){
                        data.push(item.value);
                    }
                });
                this.formState.language_id=data;
            }
            this.$refs.validation
            .validate()
            this.$refs.validations
            .validate()
            .then(() => {
                let xhr=/^[0-9]*$/;
                console.log(this.formState.count.length);
                if(this.formState.count_radio==2&&this.formState.count.trim()==""){
                    message.error(this.$t('adUnit.dailyImpsMessage'));
                }else if(this.formState.count_radio==2&&xhr.test(this.formState.count)==false||this.formState.count.length>8){
                    message.error(this.$t('adUnit.dailyImpsDigitalMessage'));
                }else if(this.formState.adTypen=='1'&&this.formState.adSize==this.$t('adUnit.Customization')&&this.formState.leftSize==""||this.formState.adTypen=='1'&&this.formState.adSize==this.$t('adUnit.Customization')&&this.formState.rightSize==""){
                    message.error(this.$t('adUnit.customSize'));
                }else {
                    console.log(this.formState);
                    this.$emit("advertisingUnit",this.formState)
                }
            })
            .catch(error => {
                console.log('error', error);
            }); 
        },
        getPlacementSize(){
            this.$req.getPlacementSize().then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.placementSizeList=[];
                    res.data.data.forEach(val=>{
                        this.placementSizeList.push(`${val.width}*${val.height}`)
                    })
                    this.placementSizeList.push(this.$t('adUnit.Customization'));
                }else{
                    message.error(this.$t('adUnit.unknownError'));
                }
            })
        },
        typeChange(){
            
            if(this.formState.adTypen !="1"){
                this.formState.adSize="600*100";
                this.formState.addSizeList=false;
                this.formState.leftSize="";
                this.formState.rightSize="";
            }
            this.formState.language=[];
        },
        sizeChange () {
            if(this.formState.adSize!=this.$t('adUnit.Customization')){
                this.formState.addSizeList=false;
                this.formState.leftSize="";
                this.formState.rightSize="";
                let arr=this.formState.adSize.split("*");
                console.log(arr);
                this.formState.placementWidth=arr[0];
                this.formState.placementHeight=arr[1];
            }else if(this.formState.adSize==this.$t('adUnit.Customization')){
                this.formState.placementWidth=this.formState.leftSize;
                this.formState.placementHeight=this.formState.rightSize;
            }   
            
        },
        getPlacementDetails (){
            if(this.compile){
                store.dispatch("Util/Loading",true);
                let opt= {
                    placement_id:this.compile,
                }
                // 获取广告位详情
                this.$req.Getplacement(opt).then(res=>{
                    if(res.data.code==200) {
                        console.log(res.data);
                        this.formState.adName=res.data.data.placement_name;
                        this.formState.active=res.data.data.state=='inactive'?"2":"1";
                        this.formState.adTypen=res.data.data.placement_type=="50"?'2':res.data.data.placement_type=="5"?"3":res.data.data.placement_type=="1"?"1":"4";
                        
                        this.formState.constant=res.data.data.placement_usage=="1"?true:false;
                        this.formState.count_radio=res.data.data.placement_imps=='0'?"1":"2";
                        this.formState.count=res.data.data.placement_imps!='0'?res.data.data.placement_imps:'';
                        this.formState.language_id=res.data.data.language_ids==""?[]:res.data.data.language_ids.split(',');
                        console.log(this.formState.language_id.length);
                        if(this.formState.language_id.length){
                            for (let i = 0; i < this.formState.language_id.length; i++) {
                                for (let j = 0;j< this.languages.length; j++) {
                                    if(this.formState.language_id[i]==this.languages[j].value){
                                    
                                        this.formState.language.push(this.languageType=="zh"?this.languages[j].label:this.languageEn[j].label)
                                    
                                    }
                                    
                                }
                                
                            }
                        }
                        this.formState.paid=res.data.data.premium_user_type=='0'?'非付费':res.data.data.premium_user_type=='1'?'付费':'全部';
                        this.formState.placementWidth=res.data.data.width;
                        this.formState.placementHeight=res.data.data.height;
                        if(res.data.data.placement_type=='1'){
                            this.formState.adSize=`${res.data.data.width}*${res.data.data.height}`
                        }
                        store.dispatch("Util/Loading",false);
                    }else{
                        store.dispatch("Util/Loading",false);
                    }
                }).catch(err=>{
                    store.dispatch("Util/Loading",false);
                })
            }
        }
    },
    destroyed(){
        this.$refs.validations.resetFields();
    },
    mounted() {
        this.$refs.validations.resetFields();
        this.getPlacementSize();
        store.dispatch("Util/Loading",true);
        this.$req.Language().then(res=> {
            if (res.data.code === 200) {
                res.data.data.map(value=> {
                    this.languages.push({
                        value: value.id,
                        label: value.zh_name,
                    });
                    this.languageEn.push({
                        value: value.id,
                        label: value.name,
                    })
                })
                store.dispatch("Util/Loading",false); 
                this.getPlacementDetails();
            }else if(res.data.code !== 200){
                message.error(res.data.msg);
                store.dispatch("Util/Loading",false);
            }
        })
        
    }
}
</script>

<style lang="less" >
    .adunitsetting{
        display: flex;
        box-sizing: border-box;
        flex-wrap: wrap;
        .left{
            width: 100%;
            .ant-form{
                margin-left: 16px;
                // .ant-form-item:last-child{
                //     margin-bottom: 0;
                // }
                .adName{
                    
                    .ant-form-item-control{
                        .ant-form-item-control-input{
                            // width: 80%;
                            // .ant-form-item-control-input-content{
                            //     input{
                            //         border-radius: 5px;
                            //         &:hover{
                            //             border-color: #827af3;
                            //         }
                            //         &:focus{
                            //             border-color: #827af3;
                            //         }
                                
                            //     }
                            // }
                        
                        }
                    }
                }
                // .ant-form-item-required::before{
                //     display: none;
                // }
                // .ant-form-item-required::after{
                //     display: inline-block;
                //     content: "*";
                //     color: red;
                //     margin-left: 4px;
                // }
                // .adTypen,.adSize{
                        // .ant-select {
                            // width: 200px;
                            // height: 35px;
                            // line-height: 35px;
                            // .ant-select-selector{
                            //     border-radius: 5px;
                            //     &:hover{
                            //     border-color: #827af3;
                            //     }
                            //     &:focus{
                            //         border-color: #827af3;
                            //     }
                            // }
                        // }
                    // }
                    .Customization{
                        display: flex;
                        align-items: center;
                        margin-top: 5px;
                        .ant-input{
                            // width: 60px;
                            // border-radius: 5px;
                            // &:hover{
                            //     border-color: #827af3;
                            // }
                            // &:focus{
                            //     border-color: #827af3;
                            // }
                        }
                        .addSizeList{
                            margin-left: 8px;
                        }
                    }
                .adStatus{
                    margin-top: 12px;
                }
            }
        }
        .right{
            width: 100%;
            h1{
                margin-top: 8px;
            }
            .ant-form{
                margin-left: 16px;
                // .ant-form-item:last-child{
                //         margin-bottom: 0;
                //     }
                .upperLimit{
                    
                    margin-bottom: 5px;
                    .restrictions {
                        display: flex;
                        align-items: baseline;
                        .ant-radio-wrapper{
                            line-height: 32px;
                        }
                        // .note{
                        //     color: transparent; 
                        // }
                        .doubt {
                            display: inline-block;
                            width: 14px;
                            height: 14px;
                            line-height: 14px;
                            vertical-align: middle;
                            background: url("//console-style.hl.com/images/dspcom/normal_u109.svg") no-repeat ;
                            background-size: 14px 14px;
                        }
                        .doubt:hover {
                            background: url("//console-style.hl.com/images/dspcom/normal_u110.svg") no-repeat ;
                            background-size: 14px 14px;
                        }
                        .ant-radio-input{
                            width: 20px;
                        }
                        // input{
                            // width: 180px;
                            // border-radius: 5px;
                            // &:hover{
                            //     border-color: #827af3;
                            // }
                            // &:focus{
                            //     border-color: #827af3;
                            // }
                        // }
                        .ant-checkbox{
                            margin-left: 24px;
                            margin-top: 3px;
                            .ant-checkbox-input{
                                width: 80px;
                            }
                        }
                    
                    }
                }
                // .ant-radio-checked{
                //     .ant-radio-inner {
                //         border-color: #6475C7;
                //     }
                //     .ant-radio-inner::after{
                //         background-color: #6475C7;
                //     }
                // }
                // .language{
                    // margin-top: 13px;
                    // .ant-select-selector{
                        // width: 300px;
                        // border-radius: 5px;
                        // &:hover{
                        //     border-color: #827af3;
                        // }
                        // &:focus{
                        //     border-color: #827af3;
                        // }
                    // }
                // }
            }
        }
    }
    // .footer{
    //     display: flex;
    //     justify-content: center;
    //     width: 100%;
    //     .saves{
    //         margin-bottom: 10px;
    //         width: 160px;
    //         height: 35px;
    //         border: none;
    //         border-radius: 10px;
    //         background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
    //     }
    // }
</style>