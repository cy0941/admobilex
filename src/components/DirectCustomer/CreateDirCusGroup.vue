<template>
    <div class="createDirCusGroup" ref="dirCusGroup">
        <h1>{{$t('DirCusGroup.BasicSettings')}}</h1>
        <a-form
            class="content_body"
            ref="formRef"
            :model="state"
            :rules="formRules"
        >
            <a-form-item :label="$t('DirCusGroup.Name')" :name="['data','name']" :colon="false">
                <a-input v-model:value="state.data.name" :placeholder="$t('DirCusGroup.DirectCustomerGroupName')" style="width:230px"/>
            </a-form-item>
            <a-form-item :label="$t('DirCusGroup.State')">
                <a-radio-group name="radioGroup" v-model:value="state.data.state">
                    <a-radio value="active">{{$t('DirCusGroup.Active')}}</a-radio>
                    <a-radio value="inactive">{{$t('DirCusGroup.Inactive')}}</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item :label="$t('DirCusGroup.StartData')" :name="['data','start_time']">
                <a-date-picker 
                    show-time
                    @change="startTimes" 
                    v-model:value="state.data.start_time" 
                    :placeholder="$t('DirCusGroup.StartData')" 
                    format="YYYY:MM:DD HH:mm:ss" 
                    :allowClear="false" />
            </a-form-item>
            <a-form-item :label="$t('DirCusGroup.EndData')">
                <a-radio-group name="radioGroup" v-model:value="endTime" @change="onEndTime">
                    <a-radio value="1">{{$t('DirCusGroup.Unlimited')}}</a-radio>
                    <a-radio value="2">
                        <a-form-item :name="['data','end_time']" ref="end_time">
                        <a-date-picker
                            :disabled-date="disabledEndDate"
                            :disabled="endTime!='2'" 
                            v-model:value="state.data.end_time" 
                            :allowClear="false"
                            format="YYYY:MM:DD HH:mm:ss" show-time 
                            :placeholder="$t('DirCusGroup.EndData')" />
                        </a-form-item>
                    </a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item :label="$t('DirCusGroup.Budget')">
                <div class="body_budget">
                    <a-radio-group v-model:value="adTarget">
                        <a-radio value="1">{{$t('DirCusGroup.Unlimited')}}</a-radio>
                        <a-radio value="2">{{$t('DirCusGroup.cost')}}</a-radio>
                        <a-radio value="3">{{$t('DirCusGroup.Impression')}}</a-radio>
                    </a-radio-group>
                    <div v-if="adTarget=='2'">
                        <a-form-item :label="$t('DirCusGroup.Lifetime')">
                            <div class="budget_item-children">
                                <a-select
                                    v-model:value="totalSpend"
                                    @change="onTotalSpend"
                                    >
                                    <a-select-option value="1">{{$t('DirCusGroup.customBudget')}}</a-select-option>
                                    <a-select-option value="2">{{$t('DirCusGroup.Unlimited')}}</a-select-option>
                                </a-select>
                            </div>
                            <a-form-item v-if="totalSpend=='1'" class="budget_item-children" name="lifetime_budget">
                                <a-input type="Number" v-model:value="state.lifetime_budget" suffix="￥"/>
                            </a-form-item>
                        </a-form-item>
                        <a-divider/>
                        <a-form-item :label="$t('DirCusGroup.Daily')">
                            <div class="budget_item-children">
                                <a-select
                                    v-model:value="everydaySpend"
                                    >
                                    <a-select-option value="1">{{$t('DirCusGroup.customBudget')}}</a-select-option>
                                    <a-select-option value="2" :disabled="totalSpend=='2'||endTime=='1'">{{$t('DirCusGroup.PaceLifetimeBudget')}}</a-select-option>
                                    <a-select-option value="3">{{$t('DirCusGroup.Unlimited')}}</a-select-option>
                                </a-select>
                            </div>
                            <a-form-item v-if="everydaySpend=='1'" class="budget_item-children" name="daily_budget">
                                <a-input type="Number" v-model:value="state.daily_budget" suffix="￥"/>
                            </a-form-item>
                            <div v-show="everydaySpend=='1'" class="budget_item-children">
                                <a-radio-group name="radioGroup" v-model:value="state.enable_pacing">
                                    <a-radio :value='false'>{{$t('DirCusGroup.SAFAP')}}</a-radio>
                                    <a-radio :value='true'>{{$t('DirCusGroup.PETD')}}</a-radio>
                                </a-radio-group>
                            </div>
                        </a-form-item>
                    </div>
                    <div v-if="adTarget=='3'">
                        <a-form-item :label="$t('DirCusGroup.impression')">
                            <div class="budget_item-children">
                                <a-select
                                    v-model:value="totalImps"
                                    @change="onTotalImps"
                                    >
                                    <a-select-option value="1">{{$t('DirCusGroup.customBudget')}}</a-select-option>
                                    <a-select-option value="2">{{$t('DirCusGroup.Unlimited')}}</a-select-option>
                                </a-select>
                            </div>
                            <a-form-item v-if="totalImps=='1'"  class="budget_item-children" name="lifetime_budget_imps">
                                <a-input type="Number" v-model:value="state.lifetime_budget_imps" suffix="imps"/>
                            </a-form-item>
                        </a-form-item>
                        <a-divider/>
                        <a-form-item :label="$t('DirCusGroup.DailyImps')">
                            <div class="budget_item-children">
                                <a-select
                                    v-model:value="everydayImps"
                                    >
                                    <a-select-option value="1">{{$t('DirCusGroup.customBudget')}}</a-select-option>
                                    <a-select-option value="2" :disabled="totalImps=='2'||endTime=='1'">{{$t('DirCusGroup.PaceLifetimeBudget')}}</a-select-option>
                                    <a-select-option value="3">{{$t('DirCusGroup.Unlimited')}}</a-select-option>
                                </a-select>
                            </div>
                            <a-form-item v-if="everydayImps=='1'" class="budget_item-children" name="daily_budget_imps">
                                <a-input type="Number" v-model:value="state.daily_budget_imps" suffix="imps"/>
                            </a-form-item>
                            <div v-show="everydayImps=='1'" class="budget_item-children">
                                <a-radio-group name="radioGroup" v-model:value="state.enable_pacing">
                                    <a-radio :value='false'>{{$t('DirCusGroup.SAFAP')}}</a-radio>
                                    <a-radio :value='true'>{{$t('DirCusGroup.PETD')}}</a-radio>
                                </a-radio-group>
                            </div>
                        </a-form-item>
                    </div>
                </div>
            </a-form-item>
            <a-form-item :label="$t('DirCusGroup.PaymentMethod')">
                <a-select
                    v-model:value="state.data.revenue_type_id"
                    style="width: 230px"
                    >
                    <a-select-option v-for="value in state.revenueType" :value="value.id" :key="value.id">{{value.name}}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="$t('DirCusGroup.Bid')" :name="['data','revenue_value']">
                <a-input type="Number" @change="onBlurRevenueValue" v-model:value="state.data.revenue_value" suffix="￥" style="width:150px"/>
            </a-form-item>   
        </a-form>
        <a-divider/>
        <a-collapse expandIconPosition='right'>
            <a-collapse-panel key="1" :header="$t('newCampaign.advanced')">
                <div>
                    <div>{{$t('newCampaign.language')}}</div>
                    <p>{{$t('newCampaign.targetedLanguage')}}：{{state.language_arr.length!=0?state.language_arr.toString():$t('newCampaign.noLanguageSelected')}}</p>
                    <a-button type="primary" @click="isShowLanguages=true">{{$t('newCampaign.edit')}}</a-button>
                </div>
                <div>
                    <div>{{$t('newCampaign.demographics')}}</div>
                    <div>
                        <p>{{$t('newCampaign.targetedGender')}}：{{state.selectGender=="male"?$t('newCampaign.male'):state.selectGender=="female"?$t('newCampaign.female'):$t('newCampaign.all')}}</p>
                        <p>{{$t('newCampaign.targetedAge')}}：{{state.selectAge.toString()=="全部"?$t('newCampaign.all'):state.selectAge.toString()}}</p>
                    </div>
                    <a-button type="primary" @click="isShowAdvanceSettings=true">{{$t('newCampaign.edit')}}</a-button>
                </div>
                <div>
                    <div>{{$t('newCampaign.paidUsers')}}</div>
                    <a-radio-group name="radioGroup" v-model:value="paidUsers"  @change="onPaidChange">
                        <a-radio value="1">{{$t('newCampaign.all')}}</a-radio>
                        <a-radio value="2">{{$t('newCampaign.paid')}}</a-radio>
                        <a-radio value="3">{{$t('newCampaign.nonPaying')}}</a-radio>
                    </a-radio-group>
                </div>
            </a-collapse-panel>
        </a-collapse>
        <div class="content_foot">
            <a-space :size="16">
                <a-button class="saveBtn" type="primary" @click="onSave">{{$t('newCampaign.SaveAndContinue')}}</a-button>
                <a-button class="cancelBtn" @click="cancelCreativity">{{$t('newCampaign.cancel')}}</a-button>
            </a-space>
        </div>
        <a-modal
            v-model:visible="isShowLanguages"
            :title="$t('newCampaign.selectLanguage')"
            :width="700"
            :getContainer="()=>$refs.dirCusGroup"
            @ok="languageOk"
        >
            <LanguageEdit
                ref="languageBox"
                v-if="isShowLanguages"
                @languageChange="languageChange"
                :language_targets="state.language_targets"
            >
            </LanguageEdit>
        </a-modal>
        <a-modal
            v-model:visible="isShowAdvanceSettings"
            :title="$t('newCampaign.demographics')"
            :width="700"
            :getContainer="()=>$refs.dirCusGroup"
            @ok="showAdvanceOk"
        >
            <advanceSettings
                ref="featuresBox"
                v-if="isShowAdvanceSettings"
                @changeFeatures="changeFeatures"
                :gender_targets_M="state.gender_targets"
                :age_targets_M="state.age_targets"
                :selectAge="state.selectAge"
                :campaignInfo="state.campaignInfo"
            ></advanceSettings>
        </a-modal>
    </div>
</template>

<script>
    import request from "@/utils/request.js";
    import router from '@/router';
    import { useRoute } from 'vue-router'
    import store from "@/store";
    import moment from 'moment';
    import { message , Modal} from 'ant-design-vue';
    import {
        ExclamationCircleOutlined,
    } from "@ant-design/icons-vue";
    import LanguageEdit from "../Action/LanguageEdit";
    import advanceSettings from "../Action/advanceSettings";
    import { defineComponent , ref , watch , reactive , onMounted } from 'vue';
    import { useI18n } from 'vue-i18n';

    export default defineComponent({
        components: {
            LanguageEdit,
            advanceSettings,
            ExclamationCircleOutlined
        },
        setup() {

            const route = useRoute();
            const { t } = useI18n();
            
            const end_time = async (rule, value) => {
                console.log("bbbbb");
                console.log(value);
                console.log(state.data.end_time);
                if(endTime.value=='2'&&state.data.end_time==null){
                    return Promise.reject(t('Message.EndTime'));
                }else{
                    return Promise.resolve();
                }
            };

            const judge_budget = async (rule, value) => {
                console.log('pppppppppppppppppp');
                if(value==''||value==null){
                    return Promise.reject(t('Message.NotEmpty'));
                }
                if(Number(value)>0){
                    if(Number(value)>1000000){
                        return Promise.reject(t('Message.Less1000000'));
                    }
                    return Promise.resolve();
                }else{
                    return Promise.reject(t('Message.Greater0'));
                }
                    
            };

            const formRules = {
                data:{
                    name: [
                        {
                            required: true,
                            message: t('Message.Name'),
                            trigger: ["blur","change"]
                        }
                    ],
                    start_time: [
                        {   
                            type:"any",
                            required: true,
                            message: t('Message.StartTime'),
                            trigger: ["blur","change"]
                        }
                    ],
                    end_time: [
                        {
                            required: true,
                            validator: end_time,
                            trigger: ["blur","change"]
                        }
                    ],
                    revenue_value: [
                        {
                            required: true,
                            validator: judge_budget,
                            trigger: ["blur","change"]
                        }
                    ],
                },
                lifetime_budget: [
                    {
                        required: true,
                        validator: judge_budget,
                        trigger: ["blur","change"]
                    }
                ],
                lifetime_budget_imps: [
                    {
                        required: true,
                        validator: judge_budget,
                        trigger: ["blur","change"]
                    }
                ],
                daily_budget: [
                    {
                        required: true,
                        validator: judge_budget,
                        trigger: ["blur","change"]
                    }
                ],
                daily_budget_imps: [
                    {
                        required: true,
                        validator: judge_budget,
                        trigger: ["blur","change"]
                    }
                ]
            };

        /* -------------------------------ref---------------------------- */
            const date = ref([]);
            const totalImps = ref('1');
            const everydayImps = ref('1');
            const totalSpend = ref('1');
            const everydaySpend = ref('1');
            const adTarget = ref('1');
            const isShowLanguages = ref(false);
            const isShowAdvanceSettings = ref(false);
            const paidUsers = ref('1');
            const endTime = ref('1');
            const isNew = ref(true);
            const direct_id = ref();
            const formRef = ref();
        /* -----------------------------reactive------------------------- */
            const state = reactive({
                data:{
                    name:'',
                    state:'active',
                    start_time:null,
                    end_time:null,
                    profile_id:'',
                    revenue_value:'',
                    revenue_type_id:null,
                    
                    lifetime_pacing:false,
                    lifetime_budget_imps:null,
                    enable_pacing:false,
                    daily_budget_imps:null,
                    lifetime_budget:null,
                    daily_budget:null
                },
                formatTime:'',
                revenueType:[],
                language_targets:[],
                language_arr:[],
                language_action:'',
                gender_targets: { gender: null, allow_unknown: false },
                selectGender: "全部",
                age_targets: { ages: null, allow_unknown: false },
                selectAge: ["全部"],
                campaignInfo: "",
                kv_expression:{},

                daily_budget:null,
                daily_budget_imps: null,
                enable_pacing: false,
                lifetime_budget: null,
                lifetime_budget_imps: null,
                lifetime_pacing: false
            });

        /* -----------------------------function------------------------- */

            onMounted(() => {
                console.log(route.query.keyWord);
                state.data.start_time = moment();
                if(route.query.keyWord!='新建'){
                    isNew.value=false;
                    getSingleDirect(route.query.keyWord);
                }
                getRevenueType();
            });

            const getSingleDirect = (campaign_group_id)=>{
                let data={
                    campaign_group_id
                }
                store.dispatch("Util/Loading", true);
                request.getSingleDirect(data).then(res=>{

                    if(res.data.code!=200){
                        message.error(t('DirCusGroup.FaiToObtDirCusGroup'));
                        store.dispatch("Util/Loading", false);
                        return;
                    }

                    if(res.data.data.end_date==null){
                        endTime.value='1';
                    }else{
                        endTime.value='2';
                        state.data.end_time=moment(res.data.data.end_date);
                    }

                    if(res.data.data.budget_allocation.daily_budget_imps!=null||res.data.data.budget_allocation.lifetime_budget_imps!=null){
                        adTarget.value='3';
                        if(res.data.data.budget_allocation.daily_budget_imps==null){
                            everydayImps.value='3';
                        }
                        if(res.data.data.budget_allocation.lifetime_budget_imps==null){
                            totalImps.value='2';
                        }
                    }else 
                        if(res.data.data.budget_allocation.daily_budget!=null||res.data.data.budget_allocation.lifetime_budget!=null){
                            adTarget.value='2';
                            if(res.data.data.budget_allocation.daily_budget==null){
                                everydaySpend.value='3';
                            }
                            if(res.data.data.budget_allocation.lifetime_budget==null){
                                totalSpend.value='2';
                            }
                        }else{
                            adTarget.value='1';
                        }
                    
                    if(res.data.data.languageInfo.length==0){
                        state.language_action = "exclude";
                        state.language_targets = [];
                    }else{
                        state.language_action = "include";
                        getLanguageList(res.data.data.languageInfo);
                    }

                    paidUsers.value=res.data.data.kvInfo==null?'1':res.data.data.kvInfo.json_expression.kv_expression.exp.vsa[0]=='1'?'2':'3';

                    if(res.data.data.ageInfo.length>0){
                        state.age_targets.ages=[];
                        state.selectAge=[];

                        res.data.data.ageInfo.forEach(item => {
                            state.age_targets.ages.push({
                                high:item.high,
                                low:item.low
                            });
                            if(item.low==13){
                                state.selectAge.push('<'+item.high);
                            }else if(item.low==65){
                                    state.selectAge.push('≥'+item.low);
                                }else{
                                    state.selectAge.push(item.low+'-'+item.high);
                                }
                        });
                    }

                    if(res.data.data.genderInfo.length>0){
                        state.selectGender=res.data.data.genderInfo[0].gender;
                        state.gender_targets.gender=res.data.data.genderInfo[0].gender;
                    }

                    if (res.data.data.commonProfile.age_allow_unknown == 1) {
                        state.age_targets.allow_unknown = true;
                    }
                    if (res.data.data.commonProfile.gender_allow_unknown == 1) {
                        state.gender_targets.allow_unknown = true;
                    }
                    //state.enable_pacing=res.data.data.budget_allocation.enable_pacing=='0'?false:true;
                    if(res.data.data.budget_allocation.lifetime_pacing=='1'){
                        state.lifetime_pacing=true;
                        everydayImps.value='2';
                        everydaySpend.value='2';
                    }

                    direct_id.value=res.data.data.direct_id;

                    state.data.name=res.data.data.name;
                    state.data.state=res.data.data.state;
                    state.data.start_time=moment(res.data.data.start_date);
                    state.data.profile_id=res.data.data.profile_id;
                    state.data.revenue_value=res.data.data.revenue_value;
                    state.data.revenue_type_id=res.data.data.revenue_type_id;

                    state.daily_budget=res.data.data.budget_allocation.daily_budget;
                    state.daily_budget_imps=res.data.data.budget_allocation.daily_budget_imps;
                    
                    state.lifetime_budget=res.data.data.budget_allocation.lifetime_budget;
                    state.lifetime_budget_imps=res.data.data.budget_allocation.lifetime_budget_imps;
                    state.enable_pacing=res.data.data.budget_allocation.enable_pacing=='0'?false:true;

                    store.dispatch("Util/Loading", false);

                }).catch(err => {
                    message.error(t('DirCusGroup.FaiToObtDirCusGroup'));
                    store.dispatch("Util/Loading", false);
                })  
            };

            const getRevenueType = ()=>{
                request.getRevenueType().then(res=>{

                    if(res.data.code!=200){
                        message.error(t('DirCusGroup.FaiToObtPayMetInfo'));
                        return;
                    }

                    state.revenueType=res.data.data;
                    if(state.revenueType.length!=0){
                        state.data.revenue_type_id=state.revenueType[0].id;
                        console.log(state.data.revenue_type_id);
                        console.log(state.revenueType);
                    }
                }).catch(err => {
                    message.error(t('DirCusGroup.FaiToObtPayMetInfo'));
                })
            };

            const onSave = () =>{
                console.log(state.data);
                formRef.value.validate().then(() => {
                        if(adTarget.value=='2'){
                            if(totalSpend.value=='1'){
                                if(state.lifetime_budget==''||state.lifetime_budget==null){
                                    message.warning(t('DirCusGroup.TotExpIsRequired'));
                                    return;
                                }
                                if(Number(state.lifetime_budget)<0){
                                    message.warning(t('DirCusGroup.TotExpMusBePositive'));
                                    return;
                                }
                            }
                            if(everydaySpend.value=='1'){
                                if(state.daily_budget==''||state.daily_budget==null){
                                    message.warning(t('DirCusGroup.DaiExpIsRequired'));
                                    return;
                                }
                                if(Number(state.daily_budget)<0){
                                    message.warning(t('DirCusGroup.DaiExpMustBePositive'));
                                    return;
                                }
                            }
                        }
                        if(adTarget.value=='3'){
                            if(totalImps.value=='1'){
                                if(state.lifetime_budget_imps==''||state.lifetime_budget_imps==null){
                                    message.warning(t('DirCusGroup.TotDisIsRequired'));
                                    return;
                                }
                                if(Number(state.lifetime_budget_imps)<0){
                                    message.warning(t('DirCusGroup.TotDisMustBePositive'));
                                    return;
                                }
                            }
                            if(everydayImps.value=='1'){
                                if(state.daily_budget_imps==''||state.daily_budget_imps==null){
                                    message.warning(t('DirCusGroup.DaiDisIsRequired'));
                                    return;
                                }
                                if(Number(state.daily_budget_imps)<0){
                                    message.warning(t('DirCusGroup.DaiDisMusBePositive'));
                                    return;
                                }
                            }
                        }
                        if(Number(state.data.revenue_value).toString()=="NaN"){
                            message.warning(t('DirCusGroup.PriIsNumeric'));
                            return;
                        }
                        if(Number(state.data.revenue_value)>1000000||Number(state.data.revenue_value)<0){
                            message.warning(t('DirCusGroup.TPRCBGTALT'));
                            return;
                        }
                        onPaidChange();
                        if(isNew.value){
                            profile();
                        }else{
                            putProfile();
                        }
                    }).catch(error => {
                        console.log("error", error);
                    });
            };

            const judgeData = (profile_id)=>{
                if(adTarget.value=='3'){
                    if(totalImps.value=='1'){
                        state.data.lifetime_budget_imps=state.lifetime_budget_imps;
                    }
                    if(everydayImps.value=='1'){
                        state.data.daily_budget_imps=state.daily_budget_imps;
                        state.data.enable_pacing= state.enable_pacing;
                    }else if(everydayImps.value=='2'){
                            state.data.lifetime_pacing=true;
                        }
                }else if(adTarget.value=='2'){
                    if(totalSpend.value=='1'){
                        state.data.lifetime_budget=state.lifetime_budget;
                    }
                    if(everydaySpend.value=='1'){
                        state.data.daily_budget=state.daily_budget;
                        state.data.enable_pacing=state.enable_pacing;
                    }else if(everydaySpend.value=='2'){
                            state.data.lifetime_pacing=true;
                        }
                }
                state.data.profile_id=profile_id;
                //state.data.start_time=state.data.start_time.format("YYYY:MM:DD HH:mm:ss");
                state.data.start_time=moment(state.data.start_time).format("YYYY:MM:DD HH:mm:ss");
                state.data.end_time=endTime.value=='1'?null:moment(state.data.end_time).format("YYYY:MM:DD HH:mm:ss");
                state.data.revenue_value=Number(state.data.revenue_value).toFixed(2)
            };

            const addDirect = (profile_id)=>{
                judgeData(profile_id);
                store.dispatch("Util/Loading", true);
                request.addDirect(state.data).then(res=>{

                    store.dispatch("Util/Loading", false);

                    if(res.data.code!=200){
                        message.error(t('DirCusGroup.FaiToCreDirCusGroup'));
                        return;
                    }

                    message.success(t('DirCusGroup.CreDirCusGroupsuccessfully'));
                    router.push('/hl/DirectCustomer');
                }).catch(err => {
                    message.error(t('DirCusGroup.FaiToCreDirCusGroup'));
                    store.dispatch("Util/Loading", false);
                })
            };

            const updateDirect = ()=>{
                console.log(state.data);
                judgeData(state.data.profile_id);
                state.data['direct_id']=direct_id.value;
                state.data['campaign_group_id']=route.query.keyWord;
                store.dispatch("Util/Loading", true);
                request.updateDirect(state.data).then(res=>{
                    if(res.data.code==200){
                        message.success(t('DirCusGroup.ModDirCusGroSuccessfully'));
                        router.push('/hl/DirectCustomer');
                    }else{
                        message.error(t('DirCusGroup.FaiToModDirCusGroup'));
                    }
                    store.dispatch("Util/Loading", false);
                }).catch(err => {
                    message.error(t('DirCusGroup.FaiToModDirCusGroup'));
                    store.dispatch("Util/Loading", false);
                })
                
            };

            const onPaidChange = (e)=>{
                console.log(paidUsers.value);
                if (paidUsers.value == 2) {
                    state.kv_expression = {
                        exp: {
                            key: "is_premium_user",
                            typ: "in",
                            vsa: ["1"],
                            vtp: "sta"
                        },
                        header: {
                            an_version: "1.0",
                            client_version: "1.0"
                        }
                    };
                } else if (paidUsers.value == 3) {
                    state.kv_expression = {
                        exp: {
                            key: "is_premium_user",
                            typ: "in",
                            vsa: ["0"],
                            vtp: "sta"
                        },
                        header: {
                            an_version: "1.0",
                            client_version: "1.0"
                        }
                    };
                }
            };

            const profile = () =>{
                let data = {
                    app_id: '0',
                    language_action: state.language_action,
                    language_targets: state.language_targets,
                    age_targets: state.age_targets,
                    placement_targets: [],
                    gender_targets: state.gender_targets,
                    kv_expression: state.kv_expression,
                    module_type: 2
                };
                request.Addprofile(data).then(res=>{
                    console.log(res);
                    if(res.data.code==200){
                        addDirect(res.data.data.profile_id);
                    }else{
                        message.error(t('DirCusGroup.FaiToCreDirCusGroup'));
                    }
                }).catch(err => {
                    message.error(t('DirCusGroup.FaiToCreDirCusGroup'));
                })
            };

            const putProfile = () =>{
                let data = {
                    profile_id:state.data.profile_id,
                    language_action: state.language_action,
                    language_targets: state.language_targets,
                    age_targets: state.age_targets,
                    placement_targets: [],
                    gender_targets: state.gender_targets,
                    kv_expression: state.kv_expression,
                };
                request.Putprofile(data).then(res=>{
                    console.log(res);
                    if(res.data.code==200){
                        updateDirect();
                    }else{
                        message.error(t('DirCusGroup.FaiToCreDirCusGroup'));
                    }
                }).catch(err => {
                    message.error(t('DirCusGroup.FaiToCreDirCusGroup'));
                })
            };

            const getLanguageList = (languageInfo) =>{
                request.Language().then(res=>{
                    console.log(res);
                    if(res.data.code==200){
                        res.data.data.map((el) => {
                            if (languageInfo.find(item => item.language_id == el.id)) {
                                state.language_arr.push(el.zh_name);
                                state.language_targets.push({id:el.id});
                            }
                        })
                    }else{
                        message.error(t('DirCusGroup.FaiToGetLanguage'));
                    }
                    console.log(state.language_arr);
                    console.log(state.language_targets);
                }).catch(err => {
                    message.error(t('DirCusGroup.FaiToGetLanguage'));
                })
            };

            //语言选择组件LanguageEdit方法
            const languageChange = (val)=> {
                console.log(val);
                state.language_targets = [];
                state.language_arr = [];
                if (val.length !== 0) {
                    state.language_action = "include";
                    val.map((item, index) => {
                        state.language_targets.push({ id: item.key });
                        state.language_arr.push(item.label);
                    });
                } else {
                    state.language_action = "exclude";
                    state.language_targets = [];
                }
                console.log(state.language_targets);
                console.log(state.language_arr);
                isShowLanguages.value= false;
            };

            //受众特征选择
            const changeFeatures = (age, gender, data)=> {
                console.log(age,gender,data);
                if(gender.gender=="null"){
                    gender.gender=null;
                }
                state.age_targets = age;
                state.gender_targets = gender;
                console.log(age, gender, data);
                state.selectGender = gender.gender == null ? '全部' : gender.gender;
                console.log(data.length > 0);
                if (data.lenght == 0) {
                    state.selectAge = ["全部"];
                    console.log(1);
                } else {
                    state.selectAge = data;
                    console.log(2);
                }
                console.log(state.selectAge);
                console.log(state.gender_targets);
                if(state.gender_targets)
                isShowAdvanceSettings.value = false;
            };

            const onTotalSpend = ()=>{
                if(totalSpend.value=='2'){
                    everydaySpend.value='1';
                }
                console.log(everydaySpend.value);
            };

            const onTotalImps = ()=>{
                if(totalImps.value=='2'){
                    everydayImps.value='1';
                }
                console.log(everydayImps.value);
            };

            const onEndTime = ()=>{
                formRef.value.validateFields([['data','end_time']]);
                if(endTime.value=='1'){
                    if(everydaySpend.value=='2'){
                        everydaySpend.value='1';
                    }
                    if(everydaySpend.value=='2'){
                        everydaySpend.value='1';
                    }
                }
            };

            const cancelCreativity = ()=>{
                Modal.confirm({
                    title: t('newMediation.cancelEdit'),
                    content: t('newMediation.cancelEditContent'),
                    okText: t('newMediation.enter'),
                    cancelText: t('newMediation.cancels'),
                    icon: <ExclamationCircleOutlined  />,
                    onOk:()=>{
                        router.push('/hl/DirectCustomer');
                    }
                });
            };

            const startTimes = (e)=> {
                console.log(Date.parse(state.data.end_time));
                if(state.data.end_time&&Date.parse(state.data.end_time)<Date.parse(state.data.start_time)){
                    state.data.end_time=null;
                }
            };

            const disabledEndDate = (e)=>{
                if (state.data.start_time) {
                    return e < state.data.start_time;
                } else {
                    return false;
                }
            };

            const onBlurRevenueValue = ()=>{
                let data=state.data.revenue_value;
                if (data.indexOf('.')!=-1&&data.length-data.indexOf('.')>3) {
                    state.data.revenue_value=data.slice(0, data.indexOf('.')+3);
                }
            };

            return {
                formRules,
            /* -------ref------- */
                date,totalImps,everydayImps,totalSpend,everydaySpend,adTarget,isShowLanguages,isShowAdvanceSettings,
                paidUsers,endTime,formRef,
            /* -----reactive---- */
                state,
            /* -----function---- */
                onSave,languageChange,changeFeatures,onPaidChange,onTotalSpend,onTotalImps,onEndTime,cancelCreativity,
                startTimes,disabledEndDate,onBlurRevenueValue
            }
        },
        methods:{
            showAdvanceOk(){
                this.$refs.featuresBox.editFeatures();
            },
            languageOk(){
                this.$refs.languageBox.editLanguage();
            },
        }
    });
</script>

<style scoped>
    @import "../../assets/css/index.css";
</style>

<style lang="less">

    .createDirCusGroup{
        display: flex;
        flex-direction: column;
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;

        .content_body{
            list-style: none;
            margin-left: 10px !important;

            li{
                display: flex;
                margin-bottom: 15px;

                & > div:nth-child(1){
                    width: 130px;
                    line-height: 32px;
                    text-align: right;
                    margin-right: 20px;

                    sup{
                        color: #f00;
                    }
                }

                & > .ant-calendar-picker{
                    display: flex;
                    align-items: center;
                    min-width: 230px !important;
                    & > div{
                        width: 100%;
                    }
                }

                .ant-radio-group{
                    display: flex;
                    align-items: center;

                    .ant-radio-wrapper{
                        margin-right: 50px;
                        line-height: 32px;

                    }
                }
            }

            li:nth-child(5){
                .ant-radio-group{
                    flex-direction: column;

                    .ant-radio-wrapper{
                        min-width: 100px;
                        line-height: 32px;
                        margin-right: 24px;
                    }
                }
            }

            .ant-form-item-label{
                width: 125px;
                margin-right: 16px;
            }

            .body_budget{
                display: flex;

                & > .ant-radio-group{
                    width: 100px;
                    line-height: 32px;
                }

                .budget_item-children{
                    margin-bottom: 8px !important;
                    width: 192px;

                    .ant-radio-wrapper{
                        margin-bottom: 8px;
                    }

                }

                .ant-form-item{
                    margin: 0;
                }
                
                .ant-divider-horizontal{
                    margin: 8px 0;
                }
            }

            label{
                line-height: 32px;
                height: 32px;
            }

            .ant-radio-wrapper{
                .ant-row{
                    display: inline-block;
                }
            }

        }
        .ant-collapse{
            border: none;
            background-color: #fff;

            .ant-collapse-item{

                .ant-collapse-header{
                    .ant-collapse-arrow{
                        right: auto;
                        left: 100px;
                    }
                }
            }

            .ant-collapse-content{
                border: none;

                .ant-collapse-content-box{
                    & > div{
                        display: flex;
                        
                        & > div:nth-child(1){
                            width: 130px;
                        }
                        & > div{
                            width: 400px;
                            p{
                                width: 100%;
                            }
                        }
                        & > p{
                            width: 400px;
                        }
                    }

                    & > div:nth-child(2){
                        margin: 20px 0;
                    }
                }
            }
        }
        .content_foot{
            display: flex;
            justify-content: center;
            margin-top: 24px;
            .saveBtn{
                width: 250px;
            }
            .cancelBtn{
                width: 150px;
            }
        }

        .ant-modal-content{
            padding: 10px 0;
        }

    }

</style>