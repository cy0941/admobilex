<template>
    <div class="createDirCusCampaign" ref="dirCusCampaign">
        <h1>{{$t('DirCusGroup.DirectCustomerGroup')}}</h1>
        <a-select
            class="dirCus-select"
            ref="select"
            @change="getSingleDirect"
            v-model:value="state.data.campaign_group_id"
            :disabled="!isNew"
            >
            <a-select-option :value="item.campaign_group_id" v-for="(item) in state.directNameList" :key="item.id">{{item.name}}</a-select-option>
        </a-select>
        <a-divider />
        <h1>{{$t('DirCusGroup.BasicSettings')}}</h1>
        <a-form
            class="content_body"
            ref="formRef"
            :model="state"
            :rules="formRules"
        >
            <a-form-item :label="$t('DirCusCampaign.Name')" :name="['data','name']">
                <a-input v-model:value="state.data.name" :placeholder="$t('DirCusCampaign.DirectCustomerCampaignsName')" style="width:230px"/>
            </a-form-item>
            <a-form-item :label="$t('DirCusGroup.State')">
                <a-radio-group  name="radioGroup" v-model:value="state.data.state">
                    <a-radio value="active">{{$t('DirCusGroup.Active')}}</a-radio>
                    <a-radio value="inactive">{{$t('DirCusGroup.Inactive')}}</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item :label="$t('DirCusCampaign.PriorityConsume')">
                <a-radio-group  name="radioGroup" v-model:value="state.data.priority">
                    <a-radio value='6'>{{$t('DirCusCampaign.Open')}}</a-radio>
                    <a-radio value='5'>{{$t('DirCusCampaign.close')}}</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item :label="$t('DirCusGroup.StartData')" :name="['data','start_time']">
                <a-date-picker v-model:value="state.data.start_time" @change="startTimes" show-time :placeholder="$t('DirCusGroup.StartData')" />
            </a-form-item>
            <a-form-item :label="$t('DirCusGroup.EndData')">
                <a-radio-group name="radioGroup" v-model:value="endTime" @change="onEndTime">
                    <a-radio value="1">{{$t('DirCusGroup.Unlimited')}}</a-radio>
                    <a-radio value="2">
                        <a-form-item :name="['data','end_time']" ref="end_time">
                        <a-date-picker :disabled-date="disabledEndDate" :disabled="endTime!='2'" v-model:value="state.data.end_time" show-time :placeholder="$t('DirCusGroup.EndData')"/>
                        </a-form-item>
                    </a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item :label="$t('DirCusGroup.Budget')">
                <div class="body_budget">
                    <a-radio-group v-model:value="adTarget">
                        <a-radio value="1">{{$t('DirCusGroup.Unlimited')}}</a-radio>
                        <a-radio v-if="state.features.ALLOW_ACCESS_TO_DIRECT_CUSTOMER_SPENDING" value="2">{{$t('DirCusGroup.cost')}}</a-radio>
                        <a-radio value="3">{{$t('DirCusGroup.Impression')}}</a-radio>
                    </a-radio-group> 
                    <div v-if="adTarget=='2'&&state.features.ALLOW_ACCESS_TO_DIRECT_CUSTOMER_SPENDING">
                        <a-form-item :label="$t('DirCusGroup.Lifetime')">
                            <div class="budget_item-children">
                                <a-select
                                    ref="select"
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
                                    ref="select"
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
                                    ref="select"
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
                                    ref="select"
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
        </a-form>
        <a-divider />
        <h1>
            {{$t('newCampaign.selectAdUnit')}}<sup>*</sup>
        </h1>
        <div class="content_selectAd">
            <div v-if="state.adunit.length<=0" class="content_selectAd--before">
                <a-button type="primary" @click="isShowAdUnit=true">{{$t('newCampaign.selectAdUnit')}}</a-button>
            </div>
            <div v-else class="content_selectAd--after">
                <a-space :size="16">
                    <a-button type="primary" @click="isShowAdUnit=true">{{$t('newCampaign.selectAdUnit')}}</a-button>
                    <a-button type="primary" danger @click="onDelAdUnit" :disabled="state.selectionData.length<=0">{{$t('newCampaign.delete')}}</a-button>
                </a-space>

                <a-table
                    :data-source="state.adunit"
                    :row-selection="{ selectedRowKeys: state.selectionData, onChange: onSelectChange }"
                    :rowKey="record => record.id"
                    class="margin--top"
                >
                    <a-table-column key="name" :title="$t('newCampaign.appName')" data-index="name" />
                    <a-table-column key="id" title="ID" data-index="id" />
                    <a-table-column
                        key="placement_Name"
                        :title="$t('newCampaign.AdUnitName')"
                        data-index="placement_Name"
                        ellipsis
                    />
                </a-table>
            </div>
        </div>
        <a-divider v-show="state.adunit.length<=0"/>
        <a-collapse expandIconPosition='right'>
            <a-collapse-panel key="1" :header="$t('newCampaign.advanced')">
                <div>
                    <div>{{$t("newCampaign.language")}}</div>
                    <p>{{$t('newCampaign.targetedLanguage')}}：{{state.language_arr.length!=0?state.language_arr.toString():$t('newCampaign.noLanguageSelected')}}</p>
                    <a-button v-if="!selectLanguage" type="primary" @click="isShowLanguages=true">{{$t('newCampaign.edit')}}</a-button>
                    <span v-else class="dircusAppoint" type="text"><CheckCircleOutlined :style="{color: '#0f0'}"/>{{$t('DirCusCampaign.DCGL')}}</span>
                </div>
                <div>
                    <div>{{$t('newCampaign.demographics')}}</div>
                    <div>
                        <p>{{$t('newCampaign.targetedGender')}}：{{state.selectGender=="male"?$t('newCampaign.male'):state.selectGender=="female"?$t('newCampaign.female'):$t('newCampaign.all')}}</p>
                        <p>{{$t('newCampaign.targetedAge')}}：{{state.selectAge.toString()=="全部"?$t('newCampaign.all'):state.selectAge.toString()}}</p>
                    </div>
                    <a-button v-if="!selectGenderAge" type="primary" @click="isShowAdvanceSettings=true">{{$t('newCampaign.edit')}}</a-button>
                    <span v-else class="dircusAppoint" type="text"><CheckCircleOutlined :style="{color: '#0f0'}"/>{{$t('DirCusCampaign.DCGL')}}</span>
                </div>
                <div>
                    <div>{{$t('newCampaign.paidUsers')}}</div>
                    <a-radio-group name="radioGroup" v-model:value="paidUsers" @change="onPaidChange" :disabled="selectPaidUsers">
                        <a-radio value="1">{{$t('newCampaign.all')}}</a-radio>
                        <a-radio value="2">{{$t('newCampaign.paid')}}</a-radio>
                        <a-radio value="3">{{$t('newCampaign.nonPaying')}}</a-radio>
                    </a-radio-group>
                    <span v-if="selectPaidUsers" class="dircusAppoint" type="text"><CheckCircleOutlined :style="{color: '#0f0'}"/>{{$t('DirCusCampaign.DCGL')}}</span>
                </div>
            </a-collapse-panel>
        </a-collapse>
        <div class="content_foot">
            <a-space :size="16">
                <a-button class="saveBtn" type="primary" @click="onSave" :disabled="state.data.campaign_group_id==''">{{$t('newCampaign.SaveAndContinue')}}</a-button>
                <a-button class="cancelBtn" @click="cancelCreativity">{{$t('newCampaign.cancels')}}</a-button>
            </a-space>
        </div>
        <a-modal
            v-model:visible="isShowLanguages"
            :title="$t('newCampaign.selectLanguage')"
            :width="700"
            :getContainer="()=>$refs.dirCusCampaign"
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
            :getContainer="()=>$refs.dirCusCampaign"
            @ok="showAdvanceOk"
        >
            <AdvanceSettings
                ref="featuresBox"
                v-if="isShowAdvanceSettings"
                @changeFeatures="changeFeatures"
                :gender_targets_M="state.gender_targets"
                :age_targets_M="state.age_targets"
                :selectAge="state.selectAge"
                :campaignInfo="state.campaignInfo"
            ></AdvanceSettings>
        </a-modal>
        <a-modal
            v-model:visible="isShowAdUnit"
            :title="$t('newCampaign.selectAdUnit')"
            :width="700"
            :getContainer="()=>$refs.dirCusCampaign"
            @ok="showAdUnitOk"
        >
            <SelectAdUnit
                ref="adUnitBox"
                v-if="isShowAdUnit"
                :searchappID="state.searchappID"
                :platform="state.platform"
                :adunit="state.adunit"
                :showAdUnit="isShowAdUnit"
                @editLanguages="editLanguages"
            ></SelectAdUnit>
        </a-modal>
    </div>
</template>

<script>
    import request from "@/utils/request.js";
    import router from '@/router';
    import { useRoute } from 'vue-router'
    import store from "@/store";
    import { message , Modal} from 'ant-design-vue';
    import moment from 'moment';
    import LanguageEdit from "../Action/LanguageEdit";
    import AdvanceSettings from "../Action/advanceSettings";
    import SelectAdUnit from "../Action/selectAdUnit";
    import { defineComponent , ref , watch , reactive , onMounted } from 'vue';
    import { useI18n } from 'vue-i18n';
    import {
        CheckCircleOutlined,
        ExclamationCircleOutlined,
    } from "@ant-design/icons-vue";
    export default defineComponent({
        components: {
            CheckCircleOutlined,
            LanguageEdit,
            AdvanceSettings,
            SelectAdUnit,
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
                        {   type:"any",
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
            const isShowAdUnit = ref(false);
            const paidUsers = ref('1');
            const endTime = ref('1');
            const isNew = ref(true);
            const direct_id = ref();
            const selectGenderAge= ref(false);
            const selectLanguage= ref(false);
            const selectPaidUsers= ref(false);
            const formRef = ref();
            /* -----------------------------reactive------------------------- */
            const state = reactive({
                data:{
                    campaign_group_id:'',
                    profile_id:"",
                    start_time:"",
                    end_time:null,
                    name:"",
                    state:"active",
                    placement_targets:[],
                    priority:'6',
                    enable_pacing:false,
                    lifetime_pacing:false,
                    daily_budget:null,
                    lifetime_budget:null,
                    daily_budget_imps:null,
                    lifetime_budget_imps:null,
                },
                directNameList:[],
                formatTime:'',
                language_targets:[],
                language_arr:[],
                language_action:'',
                gender_targets: { gender: null, allow_unknown: false },
                selectGender: "全部",
                age_targets: { ages: null, allow_unknown: false },
                selectAge: ["全部"],
                campaignInfo: "",
                kv_expression:{},
                statusFrom: false,
                adunit: [],
                searchappID:[0],
                platform: "",
                selectionData:[],
                features:{},
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
                state.features=store.state.User.userAccessControl;
                console.log(state.features,"features");
                
                state.data.start_time = moment();
                if(route.query.keyWord!='-1'){
                    isNew.value=false;
                    getSingleDirectCampaign(route.query.keyWord);
                }
                getDirectNameList();
            });
                // store.state.Util.language;
            const getDirectNameList = ()=>{
                store.dispatch("Util/Loading", true);
                request.directNameList().then(res=>{

                    if(res.data.code!=200){
                        return;
                    }

                    if(res.data.data.length>0){
                        state.directNameList=res.data.data;
                        state.data.campaign_group_id=state.directNameList[0].campaign_group_id;   
                        store.dispatch("Util/Loading", false);
                        getSingleDirect();
                    }
                    store.dispatch("Util/Loading", false);
                })
            };

            const onChange = (value, dateString) => {
                console.log('Selected Time: ', value);
                console.log('Formatted Selected Time: ', dateString);
            };

            const getSingleDirect = async ()=>{
                let data={
                    campaign_group_id:state.data.campaign_group_id
                }
                store.dispatch("Util/Loading", true);
                const res = await request.getSingleDirect(data);
                if(res.data.code==200){
                    console.log(res);
                    state.language_targets = [];
                    state.language_arr = [];
                    state.language_action='';

                    state.gender_targets= { gender: null, allow_unknown: false };
                    state.selectGender= "全部";
                    state.age_targets= { ages: null, allow_unknown: false };
                    state.selectAge= ["全部"];

                    advancedSetting(res);
                    store.dispatch("Util/Loading", false);
                }else{
                    message.warning(t('DirCusCampaign.FaiToCreDirCusCampaign'));
                    store.dispatch("Util/Loading", false);
                }
                return res;
            };

            const createDirectCampaign = (profile_id)=>{
                store.dispatch("Util/Loading", true);
                judgeData(profile_id);
                request.createDirectCampaign(state.data).then(res=>{

                    store.dispatch("Util/Loading", false);

                    if(res.data.code!=200){
                        message.error(t('DirCusCampaign.FaiToCreDirCusCampaign'));
                        return;
                    }

                    message.success(t('DirCusCampaign.CreDirCusCamsuccessfully'));
                    router.push({path:'/hl/CreateProduction',query:{keyWord:res.data.data.campaign_id,tag:'-1'}});
                }).catch(err => {
                    message.warning(t('DirCusCampaign.FaiToCreDirCusCampaign'));
                    store.dispatch("Util/Loading", false);
                })
            };

            const updateDirectCampaign = ()=>{
                judgeData(state.data.profile_id);
                state.data['campaign_id']=route.query.keyWord;
                state.data['campaign_group_id']=state.data.campaign_group_id;
                request.updateDirectCampaign(state.data).then(res=>{

                    if(res.data.code!=200){
                        message.error(t('DirCusCampaign.FaiToModDirCusCompaign'));
                        return;
                    }

                    message.success(t('DirCusCampaign.ModDirCusCamSuccessfully'));
                    router.push('/hl/DirectCustomer');
                }).catch(err => {
                    message.warning(t('DirCusCampaign.FaiToModDirCusCompaign'));
                })
            };

            const profile = () =>{
                let data = {
                    app_id: '0',
                    language_action: state.language_action,
                    language_targets: state.language_targets,
                    age_targets: state.age_targets,
                    placement_targets: state.data.placement_targets,
                    gender_targets: state.gender_targets,
                    kv_expression: state.kv_expression,
                    module_type: 2
                };
                request.Addprofile(data).then(res=>{

                    if(res.data.code!=200){
                        message.error(t('DirCusCampaign.FaiToCreDirCusCampaign'));
                        return;
                    }

                    createDirectCampaign(res.data.data.profile_id);
                }).catch(err => {
                    console.log(err);
                    message.warning(t('DirCusCampaign.FaiToCreDirCusCampaign'));
                })
            };

            const putProfile = () =>{
                let data = {
                    profile_id:state.data.profile_id,
                    language_action: state.language_action,
                    language_targets: state.language_targets,
                    age_targets: state.age_targets,
                    placement_targets: state.data.placement_targets,
                    gender_targets: state.gender_targets,
                    kv_expression: state.kv_expression,
                };
                request.Putprofile(data).then(res=>{

                    if(res.data.code!=200){
                        message.error(t('DirCusCampaign.FaiToCreDirCusCampaign'));
                        return;
                    }

                    console.log(res);
                    updateDirectCampaign();
                }).catch(err => {
                    console.log(err);
                    message.warning(t('DirCusCampaign.FaiToCreDirCusCampaign'));
                })
            };

            const onSave = ()=>{
                
                if(state.data.campaign_group_id==''||state.data.campaign_group_id==null){
                    message.warning(t('DirCusGroup.FaiToObtDirCusGroup'));
                    return;
                }
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

                    if(state.adunit.length<=0){
                        message.warning(t('DirCusCampaign.AdUnitCannotBeEmpty'));
                        return;
                    }
                    placement();
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

            const placement = ()=>{
                state.adunit.forEach(item => {
                    state.data.placement_targets.push({
                        id:item.id,
                        action:"include"
                    })
                });
            };

            //选中广告单元
            const editLanguages = (e)=> {
                state.adunit = e;
                if (e.length) {
                    state.statusFrom = true;
                } else {
                    state.statusFrom = false;
                }
                isShowAdUnit.value = false;
            };

            //语言选择组件LanguageEdit方法
            const languageChange = (val)=> {
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
                isShowLanguages.value= false;
            };

            //受众特征选择
            const changeFeatures = (age, gender, data)=> {
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
                isShowAdvanceSettings.value = false;
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
                
                console.log(state.data);

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

            const onPaidChange = (e)=>{
                console.log(e);
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

            const getLanguageList = (languageInfo) =>{
                request.Language().then(res=>{

                    console.log(res);
                    res.data.data.map((el) => {
                        if (languageInfo.find(item => item.language_id == el.id)) {
                            state.language_arr.push(el.zh_name);
                            state.language_targets.push({id:el.id});
                        }
                    })
                    console.log(state.language_arr);
                    console.log(state.language_targets);
                }).catch(err => {
                    message.warning(t('DirCusGroup.FaiToGetLanguage'));
                })
            };

            const onSelectChange = (selectedRowKeys) => {
                console.log(selectedRowKeys);
                state.selectionData = selectedRowKeys;
            };

            const onDelAdUnit = ()=>{
                console.log(state.selectionData);
                state.adunit = state.adunit.filter(
                    item => !state.selectionData.some(ele => ele == item.id)
                );
                state.selectionData=[];
                console.log(state.selectionData);
                console.log(state.adunit);
            };

            const getSingleDirectCampaign = (campaign_id)=>{
                let data={
                    campaign_id	
                };
                store.dispatch("Util/Loading", true);
                request.getSingleDirectCampaign(data).then(res=>{

                    console.log(res);
                    if(res.data.code!=200){
                        store.dispatch("Util/Loading", false);
                        message.error(t('DirCusCampaign.FaiToCreDirCusCampaign'));
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

                    res.data.data.placementInfo.forEach(item => {
                        state.adunit.push({
                            id:item.placement_id,
                            name:item.app_name,
                            placement_Name:item.placement_name
                        })
                    });

                    if (res.data.data.commonProfile.age_allow_unknown == 1) {
                        state.age_targets.allow_unknown = true;
                    }
                    if (res.data.data.commonProfile.gender_allow_unknown == 1) {
                        state.gender_targets.allow_unknown = true;
                    }

                    if(res.data.data.budget_allocation.lifetime_pacing=='1'){
                        state.lifetime_pacing=true;
                        everydayImps.value='2';
                        everydaySpend.value='2';
                    }

                    direct_id.value=res.data.data.direct_id;

                    state.data.campaign_group_id=res.data.data.campaign_group_id;
                    state.data.name=res.data.data.name;
                    state.data.state=res.data.data.state;
                    state.data.start_time=moment(res.data.data.start_date);
                    state.data.profile_id=res.data.data.profile_id;
                    state.data.priority=res.data.data.priority;
                    state.daily_budget=res.data.data.budget_allocation.daily_budget;
                    state.daily_budget_imps=res.data.data.budget_allocation.daily_budget_imps;
                    //state.enable_pacing=res.data.data.budget_allocation.enable_pacing=='0'?false:true;
                    state.lifetime_budget=res.data.data.budget_allocation.lifetime_budget;
                    state.lifetime_budget_imps=res.data.data.budget_allocation.lifetime_budget_imps;
                    state.enable_pacing=res.data.data.budget_allocation.enable_pacing=='0'?false:true;

                    getSingleDirect().then(request=>{
                        
                        if(!selectGenderAge.value){
                            if(res.data.data.genderInfo.length>0){
                                state.selectGender=res.data.data.genderInfo[0].gender;
                                state.gender_targets.gender=res.data.data.genderInfo[0].gender;
                            }
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
                        }

                        if(!selectLanguage.value){
                            if(res.data.data.languageInfo.length==0){
                                state.language_action = "exclude";
                                state.language_targets = [];
                            }else{
                                state.language_action = "include";
                                getLanguageList(res.data.data.languageInfo);
                            }
                        }
                        
                        if(!selectPaidUsers.value){
                            paidUsers.value=res.data.data.kvInfo==null?'1':res.data.data.kvInfo.json_expression.kv_expression.exp.vsa[0]=='1'?'2':'3';
                        }

                    }).catch(err => {
                        message.warning(t('DirCusCampaign.FaiToCreDirCusCampaign'));
                        store.dispatch("Util/Loading", false);
                    });

                    store.dispatch("Util/Loading", false);

                }).catch(err => {
                    message.warning(t('DirCusCampaign.FTODGAI'));
                    store.dispatch("Util/Loading", false);
                })  
            };

            const advancedSetting = (res)=>{

                console.log(res);

                if(res.data.data.languageInfo.length==0){
                    selectLanguage.value=false;
                    state.language_action = "exclude";
                    state.language_targets = [];
                }else{
                    selectLanguage.value=true;
                    state.language_action = "include";
                    getLanguageList(res.data.data.languageInfo);
                }

                if(res.data.data.kvInfo==null){
                    selectPaidUsers.value=false;
                    paidUsers.value='1';
                }else{
                    selectPaidUsers.value=true;
                    paidUsers.value=res.data.data.kvInfo.json_expression.kv_expression.exp.vsa[0]=='1'?'2':'3';
                }

                if(res.data.data.genderInfo.length>0){
                    state.selectGender=res.data.data.genderInfo[0].gender;
                    state.gender_targets.gender=res.data.data.genderInfo[0].gender;
                }
                
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

                if(res.data.data.ageInfo.length>0||res.data.data.genderInfo.length>0){
                    selectGenderAge.value=true;
                }else{
                    selectGenderAge.value=false;
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

            return {
                formRules,
                /* -------ref------- */
                date,totalImps,everydayImps,totalSpend,everydaySpend,adTarget,isShowLanguages,isShowAdvanceSettings,isShowAdUnit,
                paidUsers,endTime,isNew,selectGenderAge,selectLanguage,selectPaidUsers,formRef,
                /* -----reactive---- */
                state,
                /* -----function---- */
                onChange,languageChange,changeFeatures,onPaidChange,onTotalSpend,onTotalImps,editLanguages,onDelAdUnit,
                onSelectChange,onSave,onEndTime,cancelCreativity,startTimes,disabledEndDate,getSingleDirect
            }
        },
        methods:{
            showAdUnitOk(){
                this.$refs.adUnitBox.editLanguages();
            },
            showAdvanceOk(){
                this.$refs.featuresBox.editFeatures();
            },
            languageOk(){
                this.$refs.languageBox.editLanguage();
            }
        }
    });
</script>

<style scoped>
    @import "../../assets/css/index.css";
</style>

<style lang="less">

    .createDirCusCampaign{
        /* background: transparent; */
        display: flex;
        flex-direction: column;
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;

        .dirCus-select{
            height: 35px;
            width: 400px;
            border-radius: 10px !important;            
        }

        sup{
            color: #f00;
        }

        .content_body{
            list-style: none;
            margin: 0 0 0 10px;

            li{
                display: flex;
                margin-bottom: 15px;

                & > div:nth-child(1){
                    width: 130px;
                    line-height: 32px;
                    text-align: right;  
                    margin-right: 20px;
                }

                & > .ant-calendar-picker{
                    display: flex;
                    align-items: center;
                    min-width: 230px !important;

                }

                .ant-radio-group{
                    display: flex;
                    align-items: center;

                    .ant-radio-wrapper{
                        margin-right: 50px;
                    }
                }
            }

            li:nth-child(6){
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
                        & > button{                        
                            width: 100px;
                        }
                    }

                    & > div:nth-child(2){
                        margin: 20px 0;
                    }
                }
            }
        }
        .content_selectAd{
            .content_selectAd--before{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 250px;
            }
            .content_selectAd--after{

                .margin--top{
                    margin-top: 16px;
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

        .dircusAppoint{
            line-height: 14px;

            .anticon{
                margin-right: 5px;
            }
        }

    }

</style>