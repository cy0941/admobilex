<template>
    <div class="trafficGrouping">
        <div class="groupingList" v-if="!switchStatus">
            <div class="fastTitle">
                <span>{{$t('trafficGrouping.quickAdd')}}</span>
                <a-select
                v-model:value="selectAdUnit"
                style="width:150px;"
                :placeholder="$t('trafficGrouping.AdvertisingUnit')"
                showArrow
                :maxTagCount="1"
                class="groupingAdUnit"
                @change="changeAdUnit"
            >
                <!-- <a-select-option v-for="item in adList" :value="item.value" :key="item.id">
                    <span>
                        {{item.label}}
                    </span>
                </a-select-option> -->
                <a-select-option v-for="item in adList"  :value="item.placement_id" :key="item.placement_id" :label="item.media_Type=='banner'?`${$t('aggregate.banner')} ${item.placement_name}`:item.media_Type=='interstitial'?`${$t('aggregate.insertion')} ${item.placement_name}`:item.media_Type=='stimulate'?`${$t('aggregate.motivationalVideos')} ${item.placement_name}`:`${$t('aggregate.vastVideo')} ${item.placement_name}`">
                    <a-tooltip placement="top" :mouseEnterDelay="0.2" :mouseLeaveDelay="0">
                        <template #title>
                            <span  v-if="item.placement_id!='全部'">
                                {{item.media_Type=='banner'?`${$t('aggregate.banner')} ${item.placement_name}`:item.media_Type=='interstitial'?`${$t('aggregate.insertion')} ${item.placement_name}`:item.media_Type=='stimulate'?`${$t('aggregate.motivationalVideos')} ${item.placement_name}`:`${$t('aggregate.vastVideo')} ${item.placement_name}`}}
                            </span>
                            <span v-else>{{item.placement_name}}</span>
                        </template>
                        <span  v-if="item.placement_id!='全部'">
                            {{item.media_Type=='banner'?`${$t('aggregate.banner')} ${item.placement_name}`:item.media_Type=='interstitial'?`${$t('aggregate.insertion')} ${item.placement_name}`:item.media_Type=='stimulate'?`${$t('aggregate.motivationalVideos')} ${item.placement_name}`:`${$t('aggregate.vastVideo')} ${item.placement_name}`}}
                        </span>
                        <span v-else>{{item.placement_name}}</span>
                    </a-tooltip>
                </a-select-option>
            </a-select>
            </div>
            <div class="adItem" v-for="(val,index) in groupingList" :key="val.id" @click="selectGrouping([val,index])">
                <span class="point" v-if="val.placement_id==placement_id"></span>
                <a-tooltip placement="top" :mouseEnterDelay="0.2" :mouseLeaveDelay="0">
                    <template #title>
                    {{val.name}}
                    </template>
                    <span class="groupingName">{{val.name}}</span>
                </a-tooltip>
                
            </div>
        </div>
        <div class="groupingOptions">
            <div class="positioning">
                <a-form   ref="groupingForm" :model="formState" :rules="rules"  :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" >
                    <a-form-item :label="$t('trafficGrouping.trafficGroupingName')" name="groupingName" >
                        <a-input  v-model:value="formState.groupingName" allowClear :placeholder="$t('trafficGrouping.trafficGroupingName')" />
                    </a-form-item>
                    <a-form-item  name=""  v-if="positioningList[0].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.language')}}<span style="color:red;"> *</span>
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.languageContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" name="selectLanguage" style="display:inline-block;margin-bottom:0;">
                            <a-select
                                mode="multiple"
                                v-model:value="formState.selectLanguage"
                                :placeholder="$t('trafficGrouping.language')"
                                style="width: 280px;"
                                :maxTagCount="1"
                                showArrow
                                allowClear
                                @change="changeLanguage"
                                >
                                <a-select-option
                                    v-for="item in languageType=='zh'?languages:languageEn"
                                    :value="item.label"
                                    :key="item.value"
                                >
                                    <span>
                                    {{item.label}}
                                    </span>
                                </a-select-option>
                            </a-select>
                            
                        </a-form-item>
                        <div class="close" @click="delPositioning(0)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="" v-if="positioningList[1].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.age')}}<span style="color:red;"> *</span>
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.ageContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                            
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" name="selectAge" style="display:inline-block;margin-bottom:0;">
                            <a-select
                                mode="multiple"
                                v-model:value="formState.selectAge"
                                style="width:280px;"
                                :placeholder="$t('trafficGrouping.age')"
                                :maxTagCount="1"
                                showArrow
                                allowClear
                                @change="changeAge"
                                >
                                <a-select-option
                                    v-for="item in ageList"
                                    :value="item.value"
                                    :key="item.id"
                                >
                                    <span>
                                    {{item.label}}
                                    </span>
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        
                        <div class="close" @click="delPositioning(1)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="contain" v-if="positioningList[2].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.gender')}}<span style="color:red;"> *</span>
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.genderContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                            
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" name="gender" style="display:inline-block;margin-bottom:0;">
                            <a-radio-group class="radioAge" v-model:value="formState.gender" >
                                <a-radio value="male">{{$t('demographics.male')}}</a-radio>
                                <a-radio value="female">{{$t('demographics.female')}}</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-checkbox v-model:checked="gender_targets.allow_unknown">{{$t('demographics.allowUnknown')}}</a-checkbox>
                        <div class="close" @click="delPositioning(2)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="contain" v-if="positioningList[3].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.paid')}}<span style="color:red;"> *</span>
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.paidContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                            
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" name="paid" style="display:inline-block;margin-bottom:0;">
                            <a-select
                                v-model:value="formState.paid"
                                style="width:280px;"
                                :placeholder="$t('trafficGrouping.paid')"
                                allowClear
                                >
                                
                                <a-select-option value="1">{{$t('trafficGrouping.paid')}}</a-select-option>
                                <a-select-option value="2">{{$t('trafficGrouping.nonPaying')}}</a-select-option>
                            </a-select>
                        </a-form-item>
                        
                        <div class="close" @click="delPositioning(3)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="installationContains" v-if="positioningList[4].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.installationTime')}}
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.installationContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                            
                        >
                            <a-select-option value="1">&lt;</a-select-option>
                            <a-select-option value="2">&lt;=</a-select-option>
                            <a-select-option value="3">&gt;</a-select-option>
                            <a-select-option value="4">&gt;=</a-select-option>
                        </a-select>
                        <a-form-item label="" name="installationTime" style="display:inline-block;margin-bottom:0;">
                            <a-input style="width: 172px;margin-right:8px;"  v-model:value="formState.installationTime" allowClear :placeholder="$t('trafficGrouping.installationTime')" />
                        </a-form-item>
                        
                        <a-select
                            v-model:value="installationPeriodicity"
                            style="width: 100px;"
                            placeholder=""
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.hours')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.days')}}</a-select-option>
                            <a-select-option value="3">{{$t('trafficGrouping.week')}}</a-select-option>
                        </a-select>
                        <div class="close" @click="delPositioning(4)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="installationGtContains" v-if="positioningList[15].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.installationTime')}}
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.installationGtContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                        >   
                            <a-select-option value="1">&lt;</a-select-option>
                            <a-select-option value="2">&lt;=</a-select-option>
                            <a-select-option value="3">&gt;</a-select-option>
                            <a-select-option value="4">&gt;=</a-select-option>
                        </a-select>
                        <a-form-item label="" name="installationGtTime" style="display:inline-block;margin-bottom:0;">
                            <a-input style="width: 172px;margin-right:8px;"  v-model:value="formState.installationGtTime" allowClear :placeholder="$t('trafficGrouping.installationTime')" />
                        </a-form-item>
                        
                        <a-select
                            v-model:value="installationGtPeriodicity"
                            style="width: 100px;"
                            placeholder=""
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.hours')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.days')}}</a-select-option>
                            <a-select-option value="3">{{$t('trafficGrouping.week')}}</a-select-option>
                        </a-select>
                        <div class="close" @click="delPositioning(15)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="contain" v-if="positioningList[5].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.networkType')}}<span style="color:red;"> *</span>
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.networkTypeContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" name="networkType" style="display:inline-block;margin-bottom:0;">
                            <a-select
                                mode="multiple"
                                v-model:value="formState.networkType"
                                style="width:280px;"
                                :placeholder="$t('trafficGrouping.networkType')"
                                :maxTagCount="1"
                                showArrow
                                allowClear
                                @change="changeNetwork"
                                >
                                
                                <a-select-option
                                    v-for="item in networkList"
                                    :value="item.value"
                                    :key="item.id"
                                >
                                    <span>
                                    {{item.label}}
                                    </span>
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        
                        <div class="close" @click="delPositioning(5)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="contain" v-if="positioningList[6].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.systemVersion')}}<span style="color:red;"> *</span>
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.systemVersionContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" name="systemVersion" style="display:inline-block;margin-bottom:0;">
                            <a-input v-model:value="formState.systemVersion" style="width: 280px" allowClear :placeholder="$t('trafficGrouping.fillIn')" />
                        </a-form-item>
                        <div class="close" @click="delPositioning(6)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="contain" v-if="positioningList[7].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.applicationVersion')}}<span style="color:red;"> *</span>
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.appVersionContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" name="appVersion" style="display:inline-block;margin-bottom:0;">
                            <a-input v-model:value="formState.appVersion" style="width: 280px" allowClear :placeholder="$t('trafficGrouping.fillIn')" />
                        </a-form-item>
                        <div class="close" @click="delPositioning(7)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="contain" v-if="positioningList[8].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.sdkVersion')}}<span style="color:red;"> *</span>
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.sdkVersionContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" name="sdkVersion" style="display:inline-block;margin-bottom:0;">
                            <a-input v-model:value="formState.sdkVersion" style="width: 280px" allowClear :placeholder="$t('trafficGrouping.fillIn')" />
                        </a-form-item>
                        <div class="close" @click="delPositioning(8)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="contain" v-if="positioningList[9].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.deviceID')}}<span style="color:red;"> *</span>
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.deviceIdContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" name="deviceId" style="display:inline-block;margin-bottom:0;">
                            <a-input v-model:value="formState.deviceId" style="width: 280px" allowClear :placeholder="$t('trafficGrouping.deviceMessage')" />
                        </a-form-item>
                        
                        <div class="close" @click="delPositioning(9)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="contain" v-if="positioningList[10].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.deviceType')}}<span style="color:red;"> *</span>
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.deviceTypeContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" name="deviceType" style="display:inline-block;margin-bottom:0;">
                            <a-select
                                v-model:value="formState.deviceType"
                                style="width:280px;"
                                :placeholder="$t('trafficGrouping.deviceType')"
                                :maxTagCount="1"
                                showArrow
                                allowClear
                                >
                                
                                <a-select-option
                                    v-for="item in deviceTypeList"
                                    :value="item.value"
                                    :key="item.id"
                                >
                                    <span>
                                    {{item.label}}
                                    </span>
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        
                        <div class="close" @click="delPositioning(10)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="contain" v-if="positioningList[11].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.equipmentBrand')}}<span style="color:red;"> *</span>
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.equipmentBrandContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" name="equipmentBrand" style="display:inline-block;margin-bottom:0;">
                            <a-select
                                mode="multiple"
                                v-model:value="formState.equipmentBrand"
                                style="width:280px;"
                                :placeholder="$t('trafficGrouping.equipmentBrand')"
                                :maxTagCount="1"
                                showArrow
                                allowClear
                                
                                >
                                
                                <a-select-option
                                    v-for="item in equipmentBrandList"
                                    :value="item.value"
                                    :key="item.id"
                                >
                                    <span>
                                    {{item.label}}
                                    </span>
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        
                        <div class="close" @click="delPositioning(11)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item  name="contain" v-if="positioningList[12].select" :colon="false">
                        <template #label>
                            <span>
                                {{$t('trafficGrouping.channels')}}<span style="color:red;"> *</span>
                            </span>
                        </template>
                        <a-select
                            v-model:value="formState.channelsContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" name="channels" style="display:inline-block;margin-bottom:0;">
                            <a-input v-model:value="formState.channels" style="width: 280px" allowClear :placeholder="$t('trafficGrouping.channelsMessage')" />
                        </a-form-item>
                        
                        <div class="close" @click="delPositioning(12)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item label="IDFA" name="idfa" v-if="positioningList[13].select">
                        <a-select
                            v-model:value="formState.idfa"
                            placeholder="IDFA"
                            style="width:396px;"
                            allowClear
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.thereAreIDFA')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.noneIDFA')}}</a-select-option>
                        </a-select>
                        <div class="close" @click="delPositioning(13)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                    <a-form-item :label="$t('trafficGrouping.customizationKV')"  :name="['keyValue',index,'customizationContains']" 
                        :rules="{
                            required: true,
                            message:'',
                            trigger: 'blur'
                        }" 
                        v-for="(item,index) in formState.keyValue"  :key="index+'foee'"
                    >
                        
                        <a-select
                            v-model:value="item.customizationContains"
                            style="width: 100px;margin-right:16px;"
                            placeholder=""
                        >
                            <a-select-option value="1">{{$t('trafficGrouping.contains')}}</a-select-option>
                            <a-select-option value="2">{{$t('trafficGrouping.exclusion')}}</a-select-option>
                        </a-select>
                        <a-form-item label="" :name="['keyValue',index,'customizationKey']" style="display:inline-block;margin-bottom:0;"
                            :rules="{
                                validator:customizationKey,
                                trigger: ['change','blur']
                            }"
                        >
                            <a-input v-model:value="item.customizationKey" style="width: 100px;margin-right:8px;" allowClear :placeholder="$t('trafficGrouping.key')" />
                        </a-form-item>
                        <a-form-item label="" :name="['keyValue',index,'customizationValue']" style="display:inline-block;margin-bottom:0;"
                            :rules="{
                                validator:customizationValue,
                                trigger: ['change','blur']
                            }"
                        >
                            <a-input v-model:value="item.customizationValue" style="width: 172px" allowClear :placeholder="$t('trafficGrouping.valueMessage')" />
                        </a-form-item>
                        <div class="close" @click="delKeyValue(index)">
                            <CloseOutlined />
                        </div>
                    </a-form-item>
                </a-form>
                <div class="addPositioning">
                    <a-dropdown :trigger="['click']">
                        <a class="ant-dropdown-link" @click.prevent>
                        {{$t('trafficGrouping.addLocation')}}
                        <DownOutlined />
                        </a>
                        <template #overlay>
                        <a-menu>
                            <template v-for="item in positioningList">
                            <a-menu-item  v-if="item.id=='16'?!item.select&&positioningList[4].select:!item.select"   :key="item.id"  @click="openPositioning(item.id)">
                                {{item.label}}
                            </a-menu-item>
                            </template>
                        </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {CloseOutlined,SearchOutlined,DownOutlined} from "@ant-design/icons-vue";
import { defineComponent, ref, reactive } from "vue";
import store from '@/store';
import { useI18n } from 'vue-i18n';
import { message} from 'ant-design-vue';
export default {
    setup(){
        const { t } = useI18n();
        const formState=reactive({
            groupingName:"",
            regionContains:"1",
            ageContains:"1",
            languageContains:"1",
            selectAge:undefined,
            genderContains:"1",
            gender:"male",
            paid:undefined,
            paidContains:"1",
            deviceTypeContains:"1",
            installationContains:"1",
            installationGtContains:"3",
            installationGtTime:"",
            installationTime:"",
            timeUnit:"1",
            networkTypeContains:"1",
            networkType:undefined,
            sdkVersionContains:"1",
            sdkVersion:"",
            deviceIdContains:"1",
            deviceId:"",
            systemVersionContains:"1",
            systemVersion:"",
            appVersionContains:"1",
            appVersion:"",
            deviceId:"",
            deviceType:undefined,
            equipmentBrandContains:"1",
            equipmentBrand:undefined,
            channelsContains:'1',
            channels:"",
            idfa:undefined,
            keyValue:[],
            selectLanguage:[],
            // customizationKVList:[],
            // customizationKV:undefined,
            customizationList:[],
        });
        let customizationKey=async (rule,value)=>{
            let str=/["=!+~;^，/\\<>#$()&[\]]/gi;
            
            if (value.trim()=='') {
                return Promise.reject(t('trafficGrouping.required'))
            }else if(str.test(value)){
                return Promise.reject(t('trafficGrouping.keyContains'))
            }
            let b=0;
            for (let i = 0; i < formState.keyValue.length; i++) {

                if(value.toLowerCase()==formState.keyValue[i].customizationKey.toLowerCase()){
                    b+=1;
                    if(b>1){
                        return Promise.reject(t('trafficGrouping.keyMessage'));
                    }
                }
                
            }
            if (value.length>50) {
                return Promise.reject(t('trafficGrouping.keyLength'));
            }else if(value.toLowerCase().indexOf("installedtime") != -1||value.toLowerCase().indexOf("applicationverison") != -1||value.toLowerCase().indexOf("channel") != -1||value.toLowerCase().indexOf("sdkver") != -1||value.toLowerCase().indexOf("device_type") != -1||value.toLowerCase().indexOf("connectiontype") != -1||value.toLowerCase().indexOf("make") != -1||value.toLowerCase().indexOf("device_id") != -1||value.toLowerCase().indexOf("is_premium_user") != -1||value.toLowerCase().indexOf("age") != -1||value.toLowerCase().indexOf("gender") != -1||value.toLowerCase().indexOf("language") != -1){
                return Promise.reject(t('trafficGrouping.keyAlreadyExists'));
            }else {
                return Promise.resolve();
            }
        };
        let customizationValue=async (rule,value)=>{
            let str=/["=!+~;^，/\\<>#$()&[\]]/gi;
            
            if (value.trim()=='') {
                return Promise.reject(t('trafficGrouping.required'))
            }else if(str.test(value)){
                return Promise.reject(t('trafficGrouping.keyContains'))
            }
            if (value.length>50) {
                return Promise.reject(t('trafficGrouping.valueLength'))
            } else {
                return Promise.resolve();
            }
        };
        let installationTime=async (rule,value)=>{
            if (value.trim()=='') {
                return Promise.reject(t('trafficGrouping.required'))
            }
            if(Number(value)<0){
                return Promise.reject(t('trafficGrouping.installationTimes'))
            }
            if(Number(value)%1!=0||value.indexOf(".") != -1){
                return Promise.reject(t('trafficGrouping.integer'))
            }else {
                return Promise.resolve();
            }
        }
        let groupingNameValidator=async (rule,value)=>{
            if (value.trim()=='') {
                return Promise.reject(t('trafficGrouping.required'))
            }else if(value.trim()==="默认分组"||value.trim()==="Default group"||value.trim()==="default group"){
                return Promise.reject(t('trafficGrouping.groupingNameMessage'))
            }else{
                return Promise.resolve();
            }
        }
        let installationGtContainsValidator=async (rule,value)=>{
            if (value.trim()=='') {
                return Promise.reject(t('trafficGrouping.required'))
            }else if(value==formState.installationContains){
                return Promise.reject(t('trafficGrouping.installationContains'))
            }else{
                return Promise.resolve();
            }
        }
        let systemVersionValidator=async (rule,value)=>{
            let str=/[/\\]/gi;
            if(value.trim()==""){
                return Promise.reject(t('trafficGrouping.required'))
            }else if(str.test(value)){
                return Promise.reject(t('trafficGrouping.valueContains'))
            }else{
                return Promise.resolve();
            }
        }
        let appVersionValidator=async (rule,value)=>{
            let str=/[/\\]/gi;
            if(value.trim()==""){
                return Promise.reject(t('trafficGrouping.required'))
            }else if(str.test(value)){
                return Promise.reject(t('trafficGrouping.valueContains'))
            }else{
                return Promise.resolve();
            }
        }
        let sdkVersionValidator=async (rule,value)=>{
            let str=/[/\\]/gi;
            if(value.trim()==""){
                return Promise.reject(t('trafficGrouping.required'))
            }else if(str.test(value)){
                return Promise.reject(t('trafficGrouping.valueContains'))
            }else{
                return Promise.resolve();
            }
        }
        let deviceIdValidator=async (rule,value)=>{
            let str=/[/\\]/gi;
            if(value.trim()==""){
                return Promise.reject(t('trafficGrouping.required'))
            }else if(str.test(value)){
                return Promise.reject(t('trafficGrouping.valueContains'))
            }else{
                return Promise.resolve();
            }
        }
        let channelsValidator=async (rule,value)=>{
            let str=/[/\\]/gi;
            if(value.trim()==""){
                return Promise.reject(t('trafficGrouping.required'))
            }else if(str.test(value)){
                return Promise.reject(t('trafficGrouping.valueContains'))
            }else{
                return Promise.resolve();
            }
        }
            // 
        const rules = {
            installationContains:[
                { required: true, message: t('trafficGrouping.required'), trigger: ["blur","change"] }
            ],
            installationGtContains:[
                { required: true, validator:installationGtContainsValidator, trigger: ["blur","change"] }
            ],
            groupingName:[
                { required: true, validator:groupingNameValidator, trigger: ["blur","change"] }
            ],
            selectLanguage:[
                {type:"array", required: true, message: t('trafficGrouping.required'), trigger: ["blur","change"] }
            ],
            selectAge:[
                { type:"array",required: true, message: t('trafficGrouping.required'), trigger: ["blur","change"] }
            ],
            gender:[
                { required: true, message: t('trafficGrouping.required'), trigger: ["blur","change"] }
            ],
            paid:[
                { type:"any",required: true, message: t('trafficGrouping.required'), trigger: ["blur","change"] }
            ],
            installationTime:[
                { required: true, validator:installationTime, trigger: ["blur","change"] }
            ],
            installationGtTime:[
                { required: true, validator:installationTime, trigger: ["blur","change"] }
            ],
            networkType:[
                { type:"any",required: true, message: t('trafficGrouping.required'), trigger: ["blur","change"] }
            ],
            systemVersion:[
                { required: true, validator: systemVersionValidator, trigger: ["blur","change"] }
            ],
            appVersion:[
                { required: true, validator: appVersionValidator, trigger: ["blur","change"] }
            ],
            sdkVersion:[
                { required: true, validator: sdkVersionValidator, trigger: ["blur","change"] }
            ],
            deviceId:[
                { required: true, validator: deviceIdValidator, trigger: ["blur","change"] }
            ],
            deviceType:[
                { type:"any",required: true, message: t('trafficGrouping.required'), trigger: ["blur","change"] }
            ],
            equipmentBrand:[
                { type:"any",required: true, message: t('trafficGrouping.required'), trigger: ["blur","change"] }
            ],
            channels:[
                { required: true, validator: channelsValidator, trigger: ["blur","change"] }
            ],
            idfa:[
                { required: true, message: t('trafficGrouping.required'), trigger: ["blur","change"] }
            ],
        };
        return {
            formState,
            customizationKey,
            customizationValue,
            installationTime,
            rules
        }
    },
    props:["switchStatus","placement_id","app_id","currentGrouping"],
    components:{
        CloseOutlined,SearchOutlined,DownOutlined
    },
    data(){
        return {
            groupingName:"",
            // languageContains:"1",
            // selectLanguage:[],
            ageContains:"1",
            ages:[],
            // selectAge:[],
            genderContains:"1",
            gender:"male",
            paid:undefined,
            paidContains:"1",
            deviceTypeContains:"1",
            installationContains:"1",
            installationTime:"",
            timeUnit:"1",
            languageType:"",
            networkTypeContains:"1",
            networkType:[],
            sdkVersionContains:"1",
            sdkVersion:"",
            deviceIdContains:"1",
            deviceId:"",
            systemVersionContains:"1",
            systemVersion:"",
            appVersionContains:"1",
            appVersion:"",
            deviceId:"",
            deviceType:undefined,
            equipmentBrandContains:"1",
            equipmentBrand:undefined,
            channelsContains:'1',
            channels:"",
            idfa:undefined,
            customizationKVList:[],
            customizationKV:undefined,
            customizationList:[],
            languageIds:[],
            selectAdUnit:undefined,
            // customizationKey:"",
            // customizationValue:"",
            customizationContains:"1",
            installationPeriodicity:"1",
            installationGtContains:"1",
            installationGtTime:"",
            installationGtPeriodicity:"1",
            gender_targets:{
                allow_unknown:false,
            },
            adList:[],
            groupingList:[],
            languages:[],
            languageEn:[],
            mediation_group_id:"",
            ageList:[
                {
                    value:"<18",
                    id:1,
                    label:"<18"
                },
                {
                    value:"18-24",
                    id:2,
                    label:"18-24"
                }
                ,
                {
                    value:"25-34",
                    id:3,
                    label:"25-34"
                },
                {
                    value:"35-44",
                    id:4,
                    label:"35-44"
                },
                {
                    value:"45-54",
                    id:5,
                    label:"45-54"
                },
                {
                    value:"55-64",
                    id:6,
                    label:"55-64"
                }
                ,
                {
                    value:"≥65",
                    id:7,
                    label:"≥65"
                }
            ],
            
            genderList:[
                {
                    id:1,
                    value:'1',
                    label:"男"
                }
            ],
            
            networkList:[
                {
                    id:1,
                    value:"wifi",
                    label:"wifi"
                },
                {
                    id:2,
                    value:"5g",
                    label:"5g"
                },
                {
                    id:3,
                    value:"4g",
                    label:"4g"
                },
                {
                    id:4,
                    value:"3g",
                    label:"3g"
                },
                {
                    id:5,
                    value:"2g",
                    label:"2g"
                }

            ],
            
            
            deviceTypeList:[
                {
                    id:1,
                    value:"phone",
                    label:"phone"
                },
                {
                    id:2,
                    value:"pad",
                    label:"pad"
                }
            ],
            equipmentBrandList:[
                {
                    id:1,
                    value:'Huawei',
                    label:"Huawei"
                },
                {
                    id:2,
                    value:'Xiaomi',
                    label:"Xiaomi"
                },
                {
                    id:3,
                    value:'Oppo',
                    label:"Oppo"
                },
                {
                    id:4,
                    value:'Vivo',
                    label:"Vivo"
                },
                {
                    id:5,
                    value:'Apple',
                    label:"Apple"
                }
            ],
            
            keyValue:[],
            positioningList:[
                {
                    id:1,
                    value:"langage",
                    label:this.$t('trafficGrouping.language'),
                    select:false,
                },
                {
                    id:2,
                    value:"age",
                    label:this.$t('trafficGrouping.age'),
                    select:false,
                },
                {
                    id:3,
                    value:"gender",
                    label:this.$t('trafficGrouping.gender'),
                    select:false,
                },
                {
                    id:4,
                    value:"paid",
                    label:this.$t('trafficGrouping.paid'),
                    select:false,
                },
                {
                    id:5,
                    value:"installationTime",
                    label:this.$t('trafficGrouping.installationTime'),
                    select:false,
                },
                {
                    id:6,
                    value:"networkType",
                    label:this.$t('trafficGrouping.networkType'),
                    select:false,
                },
                {
                    id:7,
                    value:"systemVersion",
                    label:this.$t('trafficGrouping.systemVersion'),
                    select:false,
                },
                {
                    id:8,
                    value:"appVersion",
                    label:this.$t('trafficGrouping.applicationVersion'),
                    select:false,
                },
                {
                    id:9,
                    value:"sdkVersion",
                    label:this.$t('trafficGrouping.sdkVersion'),
                    select:false,
                },
                {
                    id:10,
                    value:"deviceId",
                    label:this.$t('trafficGrouping.deviceID'),
                    select:false,
                },
                {
                    id:11,
                    value:"deviceType",
                    label:this.$t('trafficGrouping.deviceType'),
                    select:false,
                },
                {
                    id:12,
                    value:"equipmentBrand",
                    label:this.$t('trafficGrouping.equipmentBrand'),
                    select:false,
                },
                {
                    id:13,
                    value:"channels",
                    label:this.$t('trafficGrouping.channels'),
                    select:false,
                },
                {
                    id:14,
                    value:"idfa",
                    label:"IDFA",
                    select:false,
                },
                {
                    id:15,
                    value:"CustomizedKV",
                    label:this.$t('trafficGrouping.customizationKV'),
                    select:false,
                },
                {
                    id:16,
                    value:"installationGtTime",
                    label:this.$t('trafficGrouping.installationTime'),
                    select:false,
                },
            ],
            
        }
    },
    mounted(){
        this.languageType=store.state.Util.language;
        this.getLangage();
        if(!this.switchStatus){
            this.getPlacement();
            
        }else{
            this.mediation_group_id=this.currentGrouping.id;
        }
        
        
    },
    methods:{
        //获取应用下广告单元
        getPlacement(){
            store.dispatch("Util/Loading", true);
            this.$req
            .AppPlacement({app_id:this.app_id,page:1,num_elements:10,no_paginate:1})
            .then(res => {
                if (res.data.code == 200) {
                    // this.mediationLoading=false;
                    this.adList = res.data.data.placement_list.length
                    ? res.data.data.placement_list
                    : [];
                    // this.placementTotal = res.data.data.total;
                    console.log(this.adList);
                    this.adList.unshift({
                        placement_id:"全部",
                        placement_name:this.$t("trafficGrouping.all"),
                        media_Type:"jfowirfw3oar434"
                    })
                    this.selectAdUnit="全部";
                    this.getGroupingList(this.selectAdUnit);
                    store.dispatch("Util/Loading", false)
                } else {
                    store.dispatch("Util/Loading", false)
                }
            })
        },
        //选中流量分组样式改变
        selectGrouping(e){
            console.log(e);
            let a=e[1]+1;
            var parents=document.querySelector(".groupingList").children;
            for(var i=0;i<parents.length;i++){
                parents[i].classList.remove("selectStyle")
            }
            var parent=document.querySelector(".groupingList").children[a];
            parent.classList.add("selectStyle");
            this.getGroupingDetails([e[0]]);
            
        },
        //点击左边流量分组获取流量分组信息渲染到右边
        getGroupingDetails(e){
            this.$refs.groupingForm.resetFields();
            this.formState.groupingName="";
            this.formState.selectLanguage=[];
            this.formState.languageContains="1";
            this.formState.ageContains="1";
            this.formState.selectAge=[];
            this.formState.genderContains="1";
            this.formState.gender="male";
            this.formState.paidContains="1";
            this.formState.paid=undefined;
            this.formState.installationContains="1";
            this.formState.installationTime="";
            this.formState.networkTypeContains="1";
            this.formState.networkType=undefined;
            this.formState.systemVersionContains="1";
            this.formState.systemVersion="";
            this.formState.appVersionContains="1";
            this.formState.appVersion="";
            this.formState.sdkVersionContains="1";
            this.formState.sdkVersion="";
            this.formState.deviceIdContains="1";
            this.formState.deviceId="";
            this.formState.deviceTypeContains="1";
            this.formState.deviceType=undefined;
            this.formState.equipmentBrandContains="1";
            this.formState.equipmentBrand=undefined;
            this.formState.channelsContains="1";
            this.formState.channels="";
            this.formState.idfa=undefined;
            this.formState.installationGtContains="3";
            this.formState.installationGtTime="";
            this.languageIds=[];
            this.ages=[];
            this.gender_targets.allow_unknown=false;
            this.installationPeriodicity="1";
            this.installationGtPeriodicity="1";
            this.formState.keyValue=[];
            this.positioningList.map(item=>{
                item.select=false;
            })
            this.formState.groupingName=e[0].name;
            
            if(e[0].language){
                this.positioningList[0].select=true;
                this.languageIds=e[0].language.language_ids.split(",");
                let arr=e[0].language.language_ids.split(",");
                this.formState.languageContains=e[0].language.action_type=='include'?"1":"2";
                let b=[];
                if(this.languageType=='zh'){
                    b=this.languages.filter(val=>{
                        return arr.includes(val.value);
                    })
                }else{
                    b=this.languageEn.filter(val=>{
                        return arr.includes(val.value);
                    })
                }
                b.forEach(item=>{
                    this.formState.selectLanguage.push(item.label)
                })
                
            } 
            if(e[0].age.length){
                this.positioningList[1].select=true;
                this.formState.ageContains=e[0].age[0].action_type=='include'?"1":"2";
                e[0].age.forEach(v => {
                    this.ages.push({
                        low: v.low,
                        high: v.high
                    })
                    switch (v.low) {
                        case "13":
                            this.formState.selectAge.push("<18");
                            break;
                        case "18":
                            this.formState.selectAge.push("18-24");
                            break;
                        case "25":
                            this.formState.selectAge.push("25-34");
                            break;
                        case "35":
                            this.formState.selectAge.push("35-44");
                            break;
                        case "45":
                            this.formState.selectAge.push("45-54");
                            break;
                        case "55":
                            this.formState.selectAge.push("55-64");
                            break;
                        case "65":
                            this.formState.selectAge.push("≥65");
                            break;
                    }
                });
                console.log(this.selectAge);
                
            }
            if(e[0].gender){
                this.positioningList[2].select=true;
                this.formState.genderContains=e[0].gender.action_type=='include'?"1":"2";
                let str=e[0].gender.gender.split(",");
                str.forEach(item=>{
                    if(item=="male"||item=="female"){
                        this.formState.gender=item;
                    }else if(item=="unknown"){
                        this.gender_targets.allow_unknown=true;
                    }
                })
            }
            if(e[0].premium){
                this.positioningList[3].select=true;
                this.formState.paidContains=e[0].premium.action_type=='include'?"1":"2";
                
                    this.formState.paid=e[0].premium.premium=='1'?"1":"2";
                
                
            }
            if(e[0].install.length){
                e[0].install.forEach((item,index)=>{
                    if(index==0){
                        this.positioningList[4].select=true;
                        this.formState.installationContains=item.action_type=="<"?"1":item.action_type=="<="?"2":item.action_type==">"?"3":"4";
                        this.formState.installationTime=item.value;
                        this.installationPeriodicity=item.value_type;
                    }
                    if(index==1){
                        this.positioningList[15].select=true;
                        this.formState.installationGtContains=item.action_type=="<"?"1":item.action_type=="<="?"2":item.action_type==">"?"3":"4";
                        this.formState.installationGtTime=item.value;
                        this.installationGtPeriodicity=item.value_type;
                    }
                    
                })
            }
            if(e[0].network){
                this.positioningList[5].select=true;
                this.formState.networkTypeContains=e[0].network.action_type=='include'?"1":"2";
                this.formState.networkType=e[0].network.network_type.split(",");
            }
            if(e[0].system){
                this.positioningList[6].select=true;
                this.formState.systemVersionContains=e[0].system.action_type=='include'?"1":"2";
                this.formState.systemVersion=e[0].system.operating_system;
            }
            if(e[0].appVersion){
                this.positioningList[7].select=true;
                this.formState.appVersionContains=e[0].appVersion.action_type=='include'?"1":"2";
                this.formState.appVersion=e[0].appVersion.app_version;
            }
            if(e[0].sdkVersion){
                this.positioningList[8].select=true;
                this.formState.sdkVersionContains=e[0].sdkVersion.action_type=='include'?"1":"2";
                this.formState.sdkVersion=e[0].sdkVersion.sdk_version;
            }
            if(e[0].deviceId){
                this.positioningList[9].select=true;
                this.formState.deviceIdContains=e[0].deviceId.action_type=='include'?"1":"2";
                this.formState.deviceId=e[0].deviceId.device_id;
            }
            if(e[0].deviceType){
                this.positioningList[10].select=true;
                this.formState.deviceTypeContains=e[0].deviceType.action_type=='include'?"1":"2";
                this.formState.deviceType=e[0].deviceType.device_type;
            }
            if(e[0].deviceBrand){
                this.positioningList[11].select=true;
                this.formState.equipmentBrandContains=e[0].deviceBrand.action_type=='include'?"1":"2";
                this.formState.equipmentBrand=e[0].deviceBrand.device_brand.split(",");
            }
            if(e[0].channel){
                this.positioningList[12].select=true;
                this.formState.channelsContains=e[0].channel.action_type=='include'?"1":"2";
                this.formState.channels=e[0].channel.channel;
            }
            if(e[0].idfa){
                this.positioningList[13].select=true;
                this.formState.idfa=e[0].idfa.idfa_status=='1'?"1":"2";
            }
            if(e[0].kvExpression.length){
                e[0].kvExpression.forEach(item=>{
                    this.formState.keyValue.push({
                        customizationContains:item.action_type=='include'?"1":"2",
                        customizationKey:item.key,
                        customizationValue:item.value
                    })
                })
            }
        },
        //获取语言列表
        getLangage(){
            store.dispatch("Util/Loading", true)
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
                    if(this.switchStatus){
                        this.getGroupingDetails([this.currentGrouping])
                    }
                    
                    console.log(this.languages);
                    
                    store.dispatch("Util/Loading",false); 
                }else if(res.data.code !== 200){
                    message.error(res.data.msg);
                    store.dispatch("Util/Loading",false);
                }
            })
        },
        changeAdUnit(e){
            console.log(e);
            if(e){
                this.getGroupingList(e)
            
            }else{
                this.groupingList=[];
            }
        },
        //获取广告位下的流量分组
        getGroupingList(e){
            this.$req.getGroupingList({placement_id:e=='全部'?this.placement_id:e,exclude_default:0,all:e=='全部'?1:0}).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.groupingList=res.data.data;
                    console.log(this.groupingList);
                    
                    this.groupingList=this.groupingList.filter(item=>{
                        return item.priority!="0"
                    })
                }else{
                    this.groupingList=[];
                }
                
            })
        },
        changeLanguage(e,b){
            this.languageIds=[];
            console.log(e,b,this.formState.selectLanguage);
            b.forEach(v=>{
                this.languageIds.push(v.key);
            })
            this.formState.selectLanguage=e;
            // this.selectLanguage=e;

        },
        changeAge(e){
            console.log(e,this.formState.selectAge);

            this.ages = [];
            if (e.length > 0) {
                for (var i = 0; i < e.length; i++) {
                this.switch__core(e[i]);
                }
            }
        },
        //公共年龄判断的方法
        switch__core(dt) {
            console.log(dt);
            
            switch (dt) {
                case "<18":
                case "18":
                this.ages.push({
                    low: 13,
                    high: 18
                });
                console.log(this.ages);
                
                break;
                case "18-24":
                case "24":
                
                this.ages.push({
                    low: 18,
                    high: 24
                });
                break;
                case "25-34":
                case "34":
                
                this.ages.push({
                    low: 25,
                    high: 34
                });
                break;
                case "35-44":
                case "44":
                
                this.ages.push({
                    low: 35,
                    high: 44
                });
                break;
                case "45-54":
                case "54":
                
                this.ages.push({
                    low: 45,
                    high: 54
                });
                break;
                case "55-64":
                case "64":
                
                this.ages.push({
                    low: 55,
                    high: 64
                });
                break;
                case "≥65":
                case "100":
                
                this.ages.push({
                    low: 65,
                    high: 100
                });
                break;
            }
        },
        changeNetwork(e){
            console.log(e);
            
        },
        //添加定位选项
        openPositioning(e){
            console.log(e);
            
            if(e=='15'){
                this.formState.keyValue.push({
                    customizationContains:'1',
                    customizationKey:"",
                    customizationValue:"",
                })
            }else {
                if(e=='5'&&this.positioningList[4].select){
                    this.positioningList[15].select=true;
                }else {
                    this.positioningList.map(item=>{
                        if(item.id==e){
                            item.select=true;
                        }
                    })
                } 
                
            }
            console.log(this.keyValue);
            
        },
        //删除定位选项
        delPositioning(e){
            this.positioningList[e].select=false;
            switch (e) {
                case 0:
                    this.formState.selectLanguage=[];
                    this.formState.languageContains="1";
                break;
                case 1:
                    this.formState.ageContains="1";
                    this.formState.selectAge=[];
                break;

                case 2:
                    this.formState.genderContains="1";
                    this.formState.gender="male";
                break;
                case 3:
                    this.formState.paidContains="1";
                    this.formState.paid=undefined;
                break;
                case 4:
                    this.formState.installationContains="1";
                    this.formState.installationTime="";
                break;
                
                case 5:
                    this.formState.networkTypeContains="1";
                    this.formState.networkType=undefined;
                break;
                
                case 6:
                    this.formState.systemVersionContains="1";
                    this.formState.systemVersion="";
                break;
                case 7:
                    this.formState.appVersionContains="1";
                    this.formState.appVersion="";
                break;
                case 8:
                    this.formState.sdkVersionContains="1";
                    this.formState.sdkVersion="";
                break;
                case 9:
                    this.formState.deviceIdContains="1";
                    this.formState.deviceId="";
                break;
                case 10:
                    this.formState.deviceTypeContains="1";
                    this.formState.deviceType=undefined;
                break;
                case 11:
                    this.formState.equipmentBrandContains="1";
                    this.formState.equipmentBrand=undefined;
                break;
                case 12:
                    this.formState.channelsContains="1";
                    this.formState.channels="";
                break;
                case 13:
                    this.formState.idfa=undefined;
                break;
                case 15:
                    this.formState.installationGtContains="3";
                    this.formState.installationGtTime="";
                break;
            }
        },
       //删除自定义KV定位
        delKeyValue(e){
            this.formState.keyValue.splice(e, 1);
        },
        //添加流量分组
        addGrouping(){
            let data={};
            this.$refs.groupingForm.validate().then(()=>{
                console.log(this.formState.selectAge,"年龄");
                
                data.name=this.formState.groupingName.trim();
                data.mediation_group_id=this.switchStatus?this.mediation_group_id:null;
                for(var i=0;i<this.positioningList.length;i++){
                    if(this.positioningList[i].select&&i=='0'){
                        data.language_targets={
                            action:this.formState.languageContains=='1'?'include':'exclude',
                            ids:this.languageIds.toString()
                        }
                    }else if(this.positioningList[i].select&&i=='1'){
                        
                        data.age_targets={
                            action:this.formState.ageContains=='1'?'include':'exclude',
                            ages:this.ages
                        }
                        console.log(data.age_targets);

                    }else if(this.positioningList[i].select&&i=='2'){
                        
                        data.gender_targets={
                            action:this.formState.genderContains=='1'?'include':'exclude',
                            genders:`${this.formState.gender},${this.gender_targets.allow_unknown?'unknown':''}`
                        }
                        
                    }else if(this.positioningList[i].select&&i=='3'){
                        
                        data.premium_targets={
                            action:this.formState.paidContains=='1'?'include':'exclude',
                            premiums:this.formState.paid=='2'?'0':'1',
                        }
                    }else if(this.positioningList[i].select&&i=='4'||this.positioningList[i].select&&i=='15'){
            
                        data.install_targets=[];
                        if(this.positioningList[4].select){
                            console.log("4");
                            
                            data.install_targets.push({
                                action:this.formState.installationContains=='1'?"<":this.formState.installationContains=='2'?"<=":this.formState.installationContains=='3'?">":">=",
                                value:this.formState.installationTime,
                                value_type:this.installationPeriodicity
                            })
                        }
                        if(this.positioningList[15].select){
                            console.log("15");
                            data.install_targets.push({
                                action:this.formState.installationGtContains=='1'?"<":this.formState.installationGtContains=='2'?"<=":this.formState.installationGtContains=='3'?">":">=",
                                value:this.formState.installationGtTime,
                                value_type:this.installationGtPeriodicity
                            })
                        }
                    // }else if(this.positioningList[i].select&&i=='15'){
                    //     data.install_targets=[];
                        
                    }else if(this.positioningList[i].select&&i=='5'){
                        
                        data.network_targets={
                            action:this.formState.networkTypeContains=='1'?'include':'exclude',
                            networks:this.formState.networkType.toString()
                        }
                    }else if(this.positioningList[i].select&&i=='6'){
                    
                        data.system_targets={
                            action:this.formState.systemVersionContains=='1'?'include':'exclude',
                            systems:this.formState.systemVersion
                        }
                    }else if(this.positioningList[i].select&&i=='7'){
                    
                        data.app_version_targets={
                            action:this.formState.appVersionContains=='1'?'include':'exclude',
                            app_versions:this.formState.appVersion
                        }
                    }else if(this.positioningList[i].select&&i=='8'){
                        
                        data.sdk_version_targets={
                            action:this.formState.sdkVersionContains=='1'?'include':'exclude',
                            sdks:this.formState.sdkVersion
                        }
                    }else if(this.positioningList[i].select&&i=='9'){
                        
                        data.device_id_targets={
                            action:this.formState.deviceIdContains=='1'?'include':'exclude',
                            device_ids:this.formState.deviceId
                        }
                    }else if(this.positioningList[i].select&&i=='10'){
                        
                        data.device_type_targets={
                            action:this.formState.deviceTypeContains=='1'?'include':'exclude',
                            device_types:this.formState.deviceType.toString()
                        }
                    }else if(this.positioningList[i].select&&i=='11'){
                        
                        data.device_brand_targets={
                            action:this.formState.equipmentBrandContains=='1'?'include':'exclude',
                            device_brands:this.formState.equipmentBrand.toString()
                        }
                    }else if(this.positioningList[i].select&&i=='12'){
                        
                        data.channel_targets={
                            action:this.formState.channelsContains=='1'?'include':'exclude',
                            channels:this.formState.channels
                        }
                    }else if(this.positioningList[i].select&&i=='13'){
                        
                        data.idfa_targets={
                            idfa_status:this.formState.idfa=='1'?1:0
                        }
                    }
                }

                if(this.formState.keyValue.length>0){
                    data.kv_targets=[];
                    
                    this.formState.keyValue.forEach((val,index)=>{
                        
                        data.kv_targets[index]={
                            action:val.customizationContains=='1'?'include':'exclude',
                            key:val.customizationKey,
                            value:val.customizationValue
                        }
                        
                    })
                }
                this.$emit("addGrouping",data)
            }).catch(error => {
                console.log('error', error);
            }); 
            
        }

    }
}
</script>

<style lang="less" scoped>
    .trafficGrouping{
        display: flex;
        
        .groupingList{
            width: 230px;
            min-height: 400px;
            // overflow-y: auto;
            // overflow-x: hidden;
            // max-height: 500px;
            border-right: 1px solid #d9d9d9;
            .fastTitle{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 5px;
                height: 40px;
                border-bottom: 1px solid #d9d9d9;
            }
            .adItem{
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #d9d9d9;
                align-items: center;
                cursor: pointer;
                height: 40px;
                padding: 0 5px;
                .point{
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: #70b603;
                }
                .groupingName{
                    overflow:hidden; //超出的隐藏
                    text-overflow:ellipsis;//省略号
                    white-space:nowrap;//强制一行显示
                }
            }
            .selectStyle{
                background-color: #eee;
            }
        }
        .groupingOptions{
            flex: 1;
            padding-left: 16px;
            /deep/.ant-form-item-label > label::after {
                margin-right: 0;
            }
            .close{
                float: right;
                display: inline-block;
                width: 32px;
                // display: flex;
                height: 32px;
                line-height: 32px;
                text-align: center;
                cursor: pointer;
                // justify-content: center;
                // align-items: center;
                // cursor: pointer;
            }
            .positioning{
                // max-height: 500px;
                // overflow-y: auto;
                // overflow-x: hidden;
                padding-top: 16px;
                .positioningItem{
                    display: flex;
                    height: 40px;
                    align-items: center;
                    position: relative;
                    p {
                        margin-bottom: 0;
                        width: 120px;
                        text-align: right;
                        margin-right: 16px;
                    }
                    .groupingName{
                        width: 390px;
                    }
                    
                }
            }
            .addPositioning{
                text-align: right;
                line-height: 30px;
                .ant-dropdown-link{
                    margin-right: 40px;
                }
            }
        }
        
    }
</style>