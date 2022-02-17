    <template>
    <div class="merization" ref="merization">
        <div class="merization_top">
        <h1>{{$t('aggregate.mediation')}}</h1>
        <div class="head">
            <a-space :size="8">
                <a-image
                    class="shisu_icon_image"
                    :src="appIconUrl"
                />
                <a-select
                    v-model:value="searchAppName"
                    style="width:350px; margin-left: 8px;"
                    :placeholder="$t('aggregate.appName')"
                    showArrow
                    show-search
                    :maxTagCount="1"
                    class="searchName"
                    option-label-prop="label"
                    @change="changeSearch"
                >
                    <!-- <template #suffixIcon>
                        <DownOutlined style="color:#6577c8"/>
                    </template> -->
                    <a-select-option v-for="item in app_names" :label="item.appInfo.app_official_name" :value="item.appInfo.id" :key="item.appInfo.id">
                        <span>
                            <AppleFilled style="margin-right:5px;" v-if="item.appInfo.platform==1" />
                            <AndroidFilled style="margin-right:5px;" v-else />
                            <!-- <AppleOutlined style="margin-right:5px;" v-if="item.appInfo.platform==1"/>
                            <AndroidOutlined style="margin-right:5px;" v-else/> -->
                            {{item.appInfo.app_official_name}}
                        </span>
                    </a-select-option>
                </a-select>
                <a-select
                v-model:value="adUnitName"
                style="width:350px;"
                :placeholder="$t('aggregate.adUnit')"
                showArrow
                show-search
                :maxTagCount="1"
                class="searchName"
                @change="placementChange"
                optionFilterProp="label"
                >
                    <!-- <template #suffixIcon>
                        <DownOutlined style="color:#6577c8"/>
                    </template> -->
                    <a-select-option v-for="item in placements"  :value="item.placement_id" :key="item.placement_id" :label="item.media_Type=='banner'?`${$t('aggregate.banner')} ${item.placement_name}`:item.media_Type=='interstitial'?`${$t('aggregate.insertion')} ${item.placement_name}`:item.media_Type=='stimulate'?`${$t('aggregate.motivationalVideos')} ${item.placement_name}`:`${$t('aggregate.vastVideo')} ${item.placement_name}`">
                        <span  >
                            {{item.media_Type=='banner'?`${$t('aggregate.banner')} ${item.placement_name}`:item.media_Type=='interstitial'?`${$t('aggregate.insertion')} ${item.placement_name}`:item.media_Type=='stimulate'?`${$t('aggregate.motivationalVideos')} ${item.placement_name}`:`${$t('aggregate.vastVideo')} ${item.placement_name}`}}
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
                                <div>{{$t('aggregate.noteSelectTime')}}</div>
                            </template>
                            <QuestionCircleFilled class="iconNote" />
                            <!-- <span class="doubt"></span> -->
                        </a-popover>
                    </template>
                </a-range-picker>
                <a-button type="primary" class="search_primary" @click="appSeerch(1)">{{$t('aggregate.submit')}} </a-button>
            </a-space>
        </div>
        <a-divider  class="dividers"/>
        <div class="eventList">
            <a-collapse v-model:activeKey="eventList" accordion expandIconPosition="right">
                <a-collapse-panel key="1" header="">
                    <template #extra>
                        <div v-if="eventList==1">{{$t('aggregate.crossPromotion')}}</div>
                        <div v-else>{{list.length}} {{$t('aggregate.relatedCrossPromotion')}}</div>
                    </template>
                    <a-spin :spinning="campaignLoading">
                    <el-table :data="list" ref="sources" style="width: 100%;min-height:5rem; margin-bottom:.2rem;">
                        <el-table-column :label="$t('aggregate.crossPromotionName')" prop="name" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="app_official_name" :label="$t('aggregate.promotedAppName')" >
                        <template #default="scope">
                            <!-- <a-image
                            :width="50"
                            :height="50"
                            class="images"
                            :src="scope.row.app_icon"
                            fallback="data:image/png;base64,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"
                            />
                            <span class="appName">{{scope.row.app_official_name}}</span> -->
                            <div class="app_imgs">
                                <a-image
                                    class="shisu_table_image"
                                    :src="scope.row.app_icon_url"
                                    fallback="data:image/png;base64,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"
                                />
                                <div class="app_names">
                                    <el-tooltip  effect="dark" :content="scope.row.app_official_name" placement="top">
                                        <span class="min">{{scope.row.app_official_name}}</span>
                                    </el-tooltip>
                                    <span>{{scope.row.platform==1?"iOS":"Android"}}</span>
                                </div>
                            </div>
                        </template>
                        </el-table-column>
                        <el-table-column :label="$t('aggregate.state')" prop="active">
                            <template #default="scope">
                                <a-switch v-model:checked="scope.row.active" @change="CampaignActiveChange(scope.row)"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="" prop="revenue_value">
                            <template #header>
                                <span>{{$t('aggregate.bids')}}</span>
                                <a-popover title="" placement="top">
                                    <template #content>
                                        <div>{{$t('aggregate.forWaterfallStreamSequence')}}</div>
                                    </template>
                                    <QuestionCircleFilled class="iconNote" />
                                    <!-- <span class="doubt"></span> -->
                                </a-popover>
                            </template>
                            <template #default="scope">
                                <span>{{Number(scope.row.revenue_value).toFixed(2)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('aggregate.Imps')" prop="imps"></el-table-column>
                        <el-table-column :label="$t('aggregate.requests')" prop="requests">
                            <template #default="">
                                <span>0</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('aggregate.clicks')" prop="clicks"></el-table-column>
                        <el-table-column prop :label="$t('aggregate.actions')">
                        <template #default="scope">
                            <a-button type="link" size="small" class="shisu_text_btn"  @click="goEditCampaign(scope.row.id)">{{$t('aggregate.edit')}}</a-button>
                            
                        </template>
                        </el-table-column>
                        <template v-slot:empty >
                            <div class="icon-div"><i class="iconfont icon">&#xe635;</i></div>
                            <div class="empty-div div--margin">{{$t('aggregate.noData')}}</div>
                        </template>
                    </el-table>
                    </a-spin>
                </a-collapse-panel>
                <template #expandIcon="{ isActive }">
                    <DownOutlined :rotate="isActive ? 180 : 0" />
                </template>
            </a-collapse>
        </div>
        </div>
        <div class="waterfall">
            <!-- <h1>{{$t('aggregate.adSourecesWaterfallStream')}}</h1> -->
            <div class="trafficGrouping">
                <div class="addtrafficGrouping_box">
                    <a-dropdown-button :trigger="['click']" class="addtrafficGrouping_btn" @click="handleButtonClick">
                    {{$t('trafficGrouping.addingTrafficGroups')}}
                    <template #overlay>
                        <a-menu @click="handleMenuClick">
                        <a-menu-item key="1">
                            {{$t('trafficGrouping.copyAnExistingGroup')}}
                        </a-menu-item>
                        <a-menu-item key="2">
                            {{$t('trafficGrouping.reprioritization')}}
                        </a-menu-item>
                        </a-menu>
                    </template>
                    <template #icon><DownOutlined /></template>
                    </a-dropdown-button>
                </div>
                <!-- <a-radio-group v-model:value="grouping" class="grouping">
                    <a-radio-button v-for="item in trafficGrouping" :value="item.value" :key="item.value">{{item.label}}</a-radio-button>
                </a-radio-group> -->
                <a-tabs
                    tab-position="top"
                    class="tabGrouping"
                    type="card"
                    @prevClick="callback"
                    @nextClick="callback"
                    :tabBarGutter="0"
                    v-model:activeKey="selectGrouping"
                    @change="groupingChange"
                    >
                    <a-tab-pane v-for="val in grouping" :key="val.id">
                        <template #tab>
                            <span>
                            {{val.name}}
                            <a-dropdown :trigger="['click']" v-if="selectGrouping==val.id&&val.priority!='0'">
                                <a class="ant-dropdown-link" @click.prevent>
                                <MoreOutlined />
                                </a>
                                <template #overlay>
                                <a-menu @click="changeGrouping">
                                    <a-menu-item key="1">
                                        {{$t('aggregate.edit')}}
                                    </a-menu-item>
                                    <a-menu-item key="2">
                                        {{$t('aggregate.delete')}}
                                    </a-menu-item>
                                </a-menu>
                                </template>
                            </a-dropdown>
                            
                            </span>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            
            <div class="sourcesHead">
                <div style="margin-bottom:16px;display:flex;">
                    <span style="margin-right:50px;display:inline-block;width:150px;">
                        {{$t('trafficGrouping.trafficGroupID')}}：{{currentGrouping.id}}
                    </span>
                    <span style="margin-right:50px;display:inline-block;width:200px;">
                        {{$t('trafficGrouping.trafficGroupingPriority')}}：{{currentGrouping.priority}}
                    </span>
                    <span style="display:inline-block;flex:1;" >
                        {{$t('trafficGrouping.selected')}}：
                        <span style="margin-right:8px;" v-if="languageSelect.selectLanguage.length">{{$t('trafficGrouping.language')}} {{languageSelect.languageContains}} {{languageSelect.selectLanguage.toString()}} &</span>
                        <span style="margin-right:8px;" v-if="ageSelect.selectAge.length">{{$t('trafficGrouping.age')}} {{ageSelect.ageContains}} {{ageSelect.selectAge.toString()}} &</span>
                        <span style="margin-right:8px;" v-if="genderSelect.selectGender.length">{{$t('trafficGrouping.gender')}} {{genderSelect.genderContains}} {{genderSelect.selectGender.toString()}} &</span>
                        <span style="margin-right:8px;" v-if="paidSelect.selectPaid.length">{{$t('trafficGrouping.paid')}} {{paidSelect.paidContains}} {{paidSelect.selectPaid.toString()}} &</span>
                        <span style="margin-right:8px;" v-if="installTime.time.length">{{$t('trafficGrouping.installationTime')}} {{installTime.time.toString()}} &</span>
                        <span style="margin-right:8px;" v-if="networkType.selectNetworkType">{{$t('trafficGrouping.networkType')}} {{networkType.networkTypeContains}} {{networkType.selectNetworkType}} &</span>
                        <span style="margin-right:8px;" v-if="systemVersion.selectSystemVersion">{{$t('trafficGrouping.systemVersion')}} {{systemVersion.systemVersionContains}} {{systemVersion.selectSystemVersion}} &</span>
                        <span style="margin-right:8px;" v-if="appVersion.selectAppVersion">{{$t('trafficGrouping.applicationVersion')}} {{appVersion.appVersionContains}} {{appVersion.selectAppVersion}} &</span>
                        <span style="margin-right:8px;" v-if="sdkVersion.selectSdkVersion">{{$t('trafficGrouping.sdkVersion')}} {{sdkVersion.sdkVersionContains}} {{sdkVersion.selectSdkVersion}} &</span>
                        <span style="margin-right:8px;" v-if="deviceId.selectDeviceId">{{$t('trafficGrouping.deviceID')}} {{deviceId.deviceIdContains}} {{deviceId.selectDeviceId}} &</span>
                        <span style="margin-right:8px;" v-if="deviceType.selectDeviceType">{{$t('trafficGrouping.deviceType')}} {{deviceType.deviceTypeContains}} {{deviceType.selectDeviceType}} &</span>
                        <span style="margin-right:8px;" v-if="deviceBrand.selectDeviceBrand">{{$t('trafficGrouping.equipmentBrand')}} {{deviceBrand.deviceBrandContains}} {{deviceBrand.selectDeviceBrand}} &</span>
                        <span style="margin-right:8px;" v-if="channel.selectChannel">{{$t('trafficGrouping.channels')}} {{channel.channelContains}} {{channel.selectChannel}} &</span>
                        <span style="margin-right:8px;" v-if="idfa.selectidfa">IDFA  {{idfa.selectidfa}} &</span>
                        <span style="margin-right:8px;" v-if="kvExpression.length">{{$t('trafficGrouping.customizationKV')}} <span style="margin-right:8px;" v-for="item in kvExpression" :key="item.key">{{item.contains}} key:{{item.key}} value:{{item.value}}</span></span>
                    </span>
                </div>
                <a-button type="primary" class="create_Sources" @click="createAdSources">{{$t('aggregate.newAdSoureces')}}</a-button>
                <a-select
                    v-model:value="Classification"
                    style="width: 120px"
                    :placeholder="$t('aggregate.batchOperation')"
                    ref="select"
                    @change="handleChange"
                    class="waterfallSelect"
                    >
                    <a-select-option value="1">{{$t('aggregate.all')}}</a-select-option>
                    <a-select-option value="2">{{$t('aggregate.active')}}</a-select-option>
                    <a-select-option value="3">{{$t('aggregate.inActive')}}</a-select-option>
                </a-select>
                <a-select
                    mode="multiple"
                    v-model:value="tags"
                    style="width:350px;"
                    :placeholder="$t('aggregate.labels')"
                    showArrow
                    :show-search="true"
                    :maxTagCount="1"
                    class="waterfallSelect"
                    @change="tagsCahnge"
                    >
                    <template #suffixIcon>
                        <SearchOutlined @click="seachBidList" />
                    </template>
                    <a-select-option v-for="item in labelList" :value="item" :key="item">
                        <span>
                            {{item}}
                        </span>
                    </a-select-option>
                </a-select>
                <!-- <a-button type="primary" class="SelectItem" @click="settingsItems">选择列表项</a-button> -->
            </div>
            <a-spin :spinning="mediationLoading">
                <el-table border :data="data" ref="waterfall" style="width: 100%;min-height:5rem; margin-bottom:.2rem;" row-key="id">
                    <el-table-column  label="" prop="" width="100">
                        <template #default>
                            <span class="MenuOutlined"><MenuOutlined /></span>
                        </template>
                    </el-table-column>
                    <el-table-column  :label="$t('aggregate.priority')" prop="priority" ></el-table-column>
                    <el-table-column  :label="$t('aggregate.adSoureces')" prop="name" >
                        <template #default="scope">
                            <a-popover title="" placement="topLeft" :getPopupContainer="()=>$refs.merization" :mouseEnterDelay="0.2" :mouseLeaveDelay="0">
                                <template #content>
                                    <div class="AdSourcesNote">
                                        <div class="leftNote">
                                            <div>{{$t('aggregate.network')}}：<p>{{scope.row.mediated_network_name}}</p></div>
                                            <div>{{$t('aggregate.Imps')}}：<p>{{scope.row.daily_budget_imps?scope.row.daily_budget_imps:$t('aggregate.noLimit')}}</p></div>
                                            <div v-if="scope.row.max_lifetime_imps||scope.row.max_day_imps||scope.row.min_minutes_per_imp">{{$t('aggregate.frequency')}}：
                                                <p v-if="scope.row.max_lifetime_imps">{{$t('aggregate.showImpsOverLifetime')}} {{scope.row.max_lifetime_imps}}</p>
                                                <p v-if="scope.row.max_day_imps">{{$t('aggregate.showImpsPerUserPerDay')}} {{scope.row.max_day_imps}}</p>
                                                <p v-if="scope.row.min_minutes_per_imp">{{$t('aggregate.showImpressionPerUserPer')}} {{scope.row.min_minutes_per_imp}}</p>
                                            </div>
                                            <div>{{$t('aggregate.adSourecesID')}}：<p>{{scope.row.id}}</p></div>
                                        </div>
                                        <div class="rightNote">
                                            <div v-if="scope.row.label_name">{{$t('aggregate.labels')}}：<p>{{scope.row.label_name}}</p></div>
                                            <div>{{$t('aggregate.bidOptimization')}}：<p>{{scope.row.cadence_modifier_enabled=="0"?$t('aggregate.inActive'):$t('aggregate.active')}}</p></div>
                                            <div>{{$t('campaign.crossPromotionID')}}：<p>{{scope.row.campaign_id}}</p></div>
                                        </div>
                                    </div>
                                </template>
                                <div class="bidsName">
                                    <a-image
                                        class="shisu_table_image"
                                        src="//console-style.hl.com/images/dspcom/Google_AdMob.png"
                                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                                    />
                                    <span>{{scope.row.name}}</span>
                                </div>
                            </a-popover>
                        </template>
                    </el-table-column>
                    <el-table-column  :label="$t('aggregate.labels')"  prop="label_name">
                        <template #default="scope">
                            <span>{{scope.row.label_name}}</span>
                            <a-popconfirm placement="right"  :getPopupContainer="()=>$refs.merization" :ok-text="$t('aggregate.enter')" :cancel-text="$t('aggregate.cancel')" @confirm="confirmTags" @cancel="cancellationsTags">
                                <template #icon><LinkedinOutlined /></template>
                                <template #title>
                                    <a-input  v-model:value="newTags" :placeholder="$t('aggregate.labels')"/>
                                </template>
                                <a-button type="link" size="small" class="shisu_text_btn editor"  @click="editorTags(scope.row)"><FormOutlined /></a-button>
                                <!-- <span class="editor" @click="editorTags(scope.row)"><FormOutlined /></span> -->
                            </a-popconfirm>
                        </template>
                    </el-table-column>
                    <el-table-column  label=""  prop="revenue_value">
                        <template #header>
                            <span>{{$t('aggregate.bids')}}</span>
                            <a-popover title="" placement="top">
                                <template #content>
                                    <div>{{$t('aggregate.forWaterfallStreamSequence')}}</div>
                                </template>
                                <QuestionCircleFilled class="iconNote" />
                                <!-- <span class="doubt"></span> -->
                            </a-popover>
                        </template>
                        <template #default="scope">
                            <span>{{scope.row.revenue_value}}</span>
                            <a-popconfirm placement="right"  :ok-text="$t('aggregate.enter')" :getPopupContainer="()=>$refs.merization" :cancel-text="$t('aggregate.cancel')" @visibleChange="visibleChange" @cancel="priceCancel" @confirm="confirmPrice">
                                <template #icon><LinkedinOutlined /></template>
                                <template #title>
                                    <a-input type="number" v-model:value="newBid" :placeholder="$t('aggregate.bids')"/>
                                </template>
                                <a-button type="link" size="small" class="shisu_text_btn editor  clicks"  @click="editorPrice(scope.row)"><FormOutlined /></a-button>
                                <!-- <span class="editor  clicks" @click="editorPrice(scope.row)"><FormOutlined /></span> -->
                            </a-popconfirm>
                        </template>
                    </el-table-column>
                    <el-table-column  :label="$t('aggregate.state')" prop="active">
                        <template #default="scope">
                            <a-switch v-model:checked="scope.row.active" @change="activeChange(scope.row)"/>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column  label="点击" prop="app_launch_num"></el-table-column> -->
                    <el-table-column  prop :label="$t('aggregate.actions')">
                        <template #default="scope">
                            <a-button type="link" size="small" class="shisu_text_btn"  style="vertical-align: text-bottom;"  @click="goEditBids(scope.row.id)">{{$t('aggregate.edit')}}</a-button>
                            <a-dropdown>
                                <a class="shisu_fontSize-middling" @click.prevent>
                                    <MoreOutlined />
                                </a>
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item>
                                            <a-popconfirm
                                                :title="$t('aggregate.deleteAdSoureces')"
                                                :ok-text="$t('aggregate.enter')"
                                                :cancel-text="$t('aggregate.cancel')"
                                                @confirm="delMediationBids(scope.row.id)"
                                            >
                                                <a-button type="link" size="small" danger class="shisu_text_btn">{{$t('aggregate.delete')}}</a-button>
                                            </a-popconfirm>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="revenue" :label="$t('aggregate.Revenue')">
                        
                    </el-table-column>
                    <el-table-column  prop="mediation_requests" :label="$t('aggregate.request')">
                        
                    </el-table-column>
                    <el-table-column  prop :label="$t('aggregate.ImpAPI')">
                        <span>(-)</span>
                    </el-table-column>
                    <el-table-column  prop :label="$t('aggregate.ClickAPI')">
                        <span>(-)</span>
                    </el-table-column>
                    <el-table-column  prop="ad_request_rate" :label="$t('aggregate.FillRate')">
                        
                    </el-table-column>
                    <template v-slot:empty >
                        <div class="icon-div"><i class="iconfont icon">&#xe635;</i></div>
                        <div class="empty-div">{{$t('aggregate.noData')}}</div>
                        <div class="empty-div div--margin">
                            {{$t('aggregate.click')}}
                            <a-button type="link" class="shisu_btn--notPadding" @click="createAdSources">+{{$t('aggregate.newAdSoureces')}}</a-button>
                        </div>
                    </template>
                    <!-- <el-table-column
                        v-for="item in columns"
                        :key="item.label"
                        :label="item.label"
                        :prop="item.value"
                        :sortable="item.sorter"
                        :v-show="false"
                        :sort-orders="sortOrders"
                        show-overflow-tooltip
                    >
                    </el-table-column> --> 
                </el-table>
            </a-spin>
            <!-- <a-pagination
            :total="total"
            show-quick-jumper
            show-size-changer
            :show-total="total => `共 ${total} 条`"
            :page-size="pageSize"
            :page-size-options="pageSizeOptions"
            v-model:current="currentPage"
            @change="PageCurrent"
            @showSizeChange="handleSizeChange"
            >
            </a-pagination> -->
            <!-- 选择列表项 -->
            <a-modal
                v-model:visible="selectListItems"
                :getContainer="()=>$refs.merization"
                class="selectListItems"
                :footer="footer"
                :width="600"
                title="选择列表项"
                @cancel="adClose"
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
            <a-modal
                v-model:visible="showAddTrafficGrouping"
                :getContainer="()=>$refs.merization"
                class="addTrafficGrouping"
                :width="!switchStatus?900:690"
                :maskClosable="false"
                :title="!switchStatus?$t('trafficGrouping.addingTrafficGroups'):$t('trafficGrouping.editingTrafficGroups')"
                @cancel="adClose"
                @ok="groupingOk"
                >
                <TrafficGrouping ref="grouping" :switchStatus="switchStatus" :currentGrouping="currentGrouping" :app_id="app_id" :placement_id='placement_id' @addGrouping="addGrouping"  v-if="showAddTrafficGrouping">
                </TrafficGrouping>
            </a-modal>
            <a-modal
                v-model:visible="showCopyTrafficGrouping"
                :getContainer="()=>$refs.merization"
                class="copyTrafficGrouping"
                :width="850"
                :maskClosable="false"
                :title="$t('trafficGrouping.copyAnExistingGroup')"
                @ok="copyGroupingOk"
                >
                <CopyTrafficGrouping ref="copyGroup" :placement_id='placement_id' :app_id="app_id" v-if="showCopyTrafficGrouping" @copyGrouping="copyGrouping">
                </CopyTrafficGrouping>
            </a-modal>
            <a-modal
                v-model:visible="showPriorityTrafficGrouping"
                :getContainer="()=>$refs.merization"
                class="copyTrafficGrouping"
                :footer="false"
                :width="750"
                :maskClosable="false"
                :title="$t('trafficGrouping.reprioritization')"
                @cancel="priorityClose"
                >
                <PriorityTrafficGrouping  v-if="showPriorityTrafficGrouping" :placement_id='placement_id'>
                </PriorityTrafficGrouping>
            </a-modal>
        </div>
    </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>
import {AppleFilled,AndroidFilled,MoreOutlined,ExclamationCircleOutlined,UserOutlined,DownOutlined,MenuOutlined,LinkedinOutlined,QuestionOutlined,UpOutlined,SearchOutlined,AppleOutlined,AndroidOutlined,QuestionCircleFilled,FormOutlined} from "@ant-design/icons-vue";
import moment from 'moment';
import TrafficGrouping from "./TrafficGrouping.vue"
import CopyTrafficGrouping from "./CopyTrafficGrouping.vue"
import PriorityTrafficGrouping from "./PriorityTrafficGrouping.vue"
import store from '@/store';
import { useI18n } from 'vue-i18n';
import { message} from 'ant-design-vue';
import { defineComponent, ref } from "vue";
import Sortable from "sortablejs"
let previousRouterName;
let selectUser;
export default {
    components: {
        QuestionOutlined,
        UserOutlined,
        DownOutlined,
        UpOutlined,
        SearchOutlined,
        AndroidOutlined,
        AppleOutlined,
        FormOutlined,
        LinkedinOutlined,
        MenuOutlined,
        ExclamationCircleOutlined,
        TrafficGrouping,
        MoreOutlined,
        CopyTrafficGrouping,
        PriorityTrafficGrouping,
        QuestionCircleFilled,
        AppleFilled,
        AndroidFilled
    },
    data(){
        return{
            appIconUrl:'',
            searchAppName:undefined,
            adUnitName:undefined,
            placement_id:"",
            app_names:[],
            formatTime:[],
            endTime:"",
            startTime:"",
            eventList:"",
            visible:false,
            advertiser_id:"",
            data:[],
            mediationLoading:false,
            list:[],
            campaignLoading:false,
            Classification:"1",
            tags:[],
            newTags:"",
            app_id:"",
            currentPage:1,
            total:0,
            pageSize:10,
            pageSizeOptions:["10","20", "50"],
            selectListItems:false,
            footer:false,
            checkedList:[],
            indeterminate: false,
            checkAll: false,
            selectTable:[],
            placements:[],
            network_id:"",
            labelList:[],
            isEdit:false,
            newBid:"",
            newIndex:"",
            oldIndex:"",
            plainOptions:[
                {value:'waterfall',label:"标签"},
                {value:'Size',label:"尺寸"}, 
                {value:'Bid_Optimization',label:"出价优化"},
                {value:'Imp_Requests',label:'请求'},
                {value:'Imps',label:'展示'},
                {value:'third-party_imps',label:'第三方展示'},
                {value:'discrepancy',label:'差异率'},
                {value:'Fill_rate',label:'填充率'},
                {value:'adjusted eCPM',label:'调整后ecpm'},
                {value:'third-party_eCPM',label:'第三方ecpm'},
                {value:'third-party_revenue',label:'第三方收益'},
                {value:'ID',label:'广告源ID'}
            ],
            dimension:[
                {label:'广告源ID', value: 'ID',isSelect:true,group_by:'ID'},
                {label:'标签',value: 'waterfall',isSelect:true,group_by:'waterfall'},
                {label:'尺寸',value: 'Size',isSelect:true,group_by:'Size'},
                {label:'出价优化', value: 'Bid_Optimization',isSelect:true,group_by:'Bid_Optimization'},
                {label:'请求', value: 'imp_Requests',isSelect:true,group_by:'imp_Requests'},
                {label:'展示', value: 'imps',isSelect:true,group_by:'imps'},
                {label:'第三方展示', value: 'third-party_imps',isSelect:true,group_by:'third-party_imps'},
                {label:'差异率', value: 'discrepancy',isSelect:true,group_by:'discrepancy'},
                {label:'填充率', value: 'Fill_rate',isSelect:true,group_by:'Fill_rate'},
                {label:'调整后ecpm', value: 'adjusted_eCPM',isSelect:true,group_by:'adjusted_eCPM',},
                {label:'第三方ecpm', value: 'third-party_eCPM',isSelect:true,group_by:'third-party_eCPM',},
                {label:'第三方收益', value: 'third-party_revenue',isSelect:true,group_by:'third-party_revenue',},
            ],
            features:{},
            grouping:[],
            showAddTrafficGrouping:false,
            selectGrouping:"",
            showCopyTrafficGrouping:false,
            showPriorityTrafficGrouping:false,
            switchStatus:false,
            group_id:"",
            currentGrouping:"",
            languageSelect:{
                selectLanguage:[],
                languageContains:"",
            },
            ageSelect:{
                ageContains:"",
                selectAge:[],
            },
            languages:[],
            languageEn:[],
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
    },
    beforeRouteEnter(to, from, next) {
        previousRouterName = from.name;
        console.log(previousRouterName);
        
        if (from.name === "home.newAdSoureces"||from.name ==="home.editCrossPromotion"||from.name === "home.editAdSoureces") {
        selectUser = from.params;
        console.log(selectUser,"4et4");
        
        }
        next();
    },
    watch:{
        checkedList(val){
            console.log(val);
            this.indeterminate = !!val.length && val.length < this.plainOptions.length;
            this.checkAll = val.length === this.plainOptions.length;
        },
        '$store.state.Util.language'(newVal,oldVal){
            console.log(newVal,oldVal);
            this.languageType=newVal;
            this.grouping.forEach((item,index)=>{
                if(item.priority=="0"){
                    item.name=this.$t('aggregate.defaultGroup');
                }
            })
            this.groupingContent(this.currentGrouping)
        }
    },
    computed:{
        columns(){
            return this.dimension.filter(item=>item.isSelect)
        }
    },
    created(){
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
                    store.dispatch("Util/OpenKeys",['4']);
                    store.dispatch("Util/OpenMenuKey",['/hl/polyMerization']);
                    
                    if(previousRouterName=="home.newAdSoureces"||previousRouterName=="home.editAdSoureces"||previousRouterName=="home.editCrossPromotion"&&selectUser.app_id){
                        if(selectUser.app_id){
                            console.log(selectUser);
                            this.app_id=selectUser.app_id;
                            this.placement_id=selectUser.placement_id;
                            this.selectGrouping=selectUser.grouping_id;
                            this.isEdit=true;
                        }
                    }
                    let appInfo=store.state.Util.appInfo;
                    if(appInfo.length!=0){
                        this.app_id=appInfo[0];
                        store.dispatch("Util/AppInfo",[]);
                    }
                    store.dispatch("Util/Loading", false);
                    this.getLangage();
                    this.languageType=store.state.Util.language;
                    this.getAppList("mediation");
                    this.getBidsLabel();
                    this.startTime= moment().subtract(30, "days").format('YYYY-MM-DD');
                    this.endTime =  moment().format('YYYY-MM-DD');
                    this.formatTime = ([moment(this.startTime),moment(this.endTime)]);
                    console.log(this.formatTime);
                    this.rowDrop();
                    
                
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
        copyGroupingOk(){
            this.$refs.copyGroup.copyGrouping();
        },
        //复制流量分组
        copyGrouping(e){
            store.dispatch("Util/Loading", true);
            console.log(e);
            let arr=[];
            e[0].forEach(item=>{
                arr.push(item.id)
            })
            let opt ={
                mediation_group_ids:arr.toString(),
                placement_id:e[1],
                copy_to_placement_id:this.placement_id
            }
            this.$req.copyGrouping(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    message.success(this.$t('trafficGrouping.copyTrafficGroupingSuccessfully'));
                    store.dispatch("Util/Loading", false);
                    this.showCopyTrafficGrouping=false;
                    this.getMediationList();
                }else{
                    store.dispatch("Util/Loading", false);
                    message.error(this.$t('trafficGrouping.failedToCopyTrafficGrouping'));
                }
                
            }).catch(error=>{
                store.dispatch("Util/Loading", false);
                message.error(this.$t('trafficGrouping.failedToCopyTrafficGrouping'));
            })
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
                    
                    // store.dispatch("Util/Loading",false); 
                }else if(res.data.code !== 200){
                    message.error(res.data.msg);
                    // store.dispatch("Util/Loading",false);
                }
            })
        },
        //关闭拖动改变流量分组优先级窗口
        priorityClose(){
            this.getMediationList();
        },
        groupingOk(e){
            this.$refs.grouping.addGrouping();
        },
        //添加流量分组
        addGrouping(e){
            e.placement_id=this.placement_id;
            console.log(e);
            store.dispatch("Util/Loading", true);
            if(!this.switchStatus){
                    this.$req.addGrouping(e).then(res=>{
                    if(res.data.code==200){
                        console.log(res.data);
                        store.dispatch("Util/Loading", false);
                        this.showAddTrafficGrouping=false;
                        message.success(this.$t('trafficGrouping.addTrafficGroupingSuccessfully'));
                        this.getMediationList();
                        
                    }else{
                        store.dispatch("Util/Loading", false);
                        message.error(this.$t('trafficGrouping.failedToAddATrafficGroup'));
                    }
                })
            }else{
                this.$req.editGrouping(e).then(res=>{
                    console.log(res);
                    if(res.data.code==200){
                        store.dispatch("Util/Loading", false);
                        this.showAddTrafficGrouping=false;
                        message.success(this.$t('trafficGrouping.modifyTrafficGroupingSuccessfully'));
                        this.getMediationList("mediation");
                    }else {
                        store.dispatch("Util/Loading", false);
                        message.error(this.$t('trafficGrouping.failureToModifyTrafficGrouping'));
                    }
                })
            }
        
        },
        //切换流量分组
        groupingChange(e){
            console.log(e,this.selectGrouping);
            this.grouping.forEach(val=>{
                if(val.id==e){
                    this.currentGrouping=val;
                    this.groupingContent(this.currentGrouping)
                }
            })
            this.getGroupingBidList();
            
            
        },
        //处理流量分组已选定位
        groupingContent(e){
                console.log(e);
                this.languageSelect.languageContains="";
                this.languageSelect.selectLanguage=[];

                this.ageSelect.ageContains='';
                this.ageSelect.selectAge=[];

                this.genderSelect.genderContains="";
                this.genderSelect.selectGender=[];

                this.paidSelect.selectPaid=[];
                this.paidSelect.paidContains="";

                this.installTime.time=[];
                
                this.networkType.networkTypeContains="";
                this.networkType.selectNetworkType="";
                

                this.systemVersion.systemVersionContains="";
                this.systemVersion.selectSystemVersion="";

                this.appVersion.appVersionContains="";
                this.appVersion.selectAppVersion="";

                this.sdkVersion.sdkVersionContains="";
                this.sdkVersion.selectSdkVersion="";

                this.deviceId.deviceIdContains="";
                this.deviceId.selectDeviceId="";

                this.deviceType.deviceTypeContains="";
                this.deviceType.selectDeviceType="";

                this.deviceBrand.deviceBrandContains="";
                this.deviceBrand.selectDeviceBrand="";

                this.channel.channelContains="";
                this.channel.selectChannel="";

                this.idfa.selectidfa="";

                this.kvExpression=[];
                if(e.language){
                    let arr=e.language.language_ids.split(",");
                    console.log(arr);
                    this.languageSelect.languageContains=e.language.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
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
                        this.languageSelect.selectLanguage.push(item.label)
                    })
                    console.log(this.languageSelect.selectLanguage);
                    
                } 
                if(e.age.length){
                    this.ageSelect.ageContains=e.age[0].action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    e.age.forEach(v => {
                        switch (v.low) {
                            case "13":
                                this.ageSelect.selectAge.push("<18");
                                break;
                            case "18":
                                this.ageSelect.selectAge.push("18-24");
                                break;
                            case "25":
                                this.ageSelect.selectAge.push("25-34");
                                break;
                            case "35":
                                this.ageSelect.selectAge.push("35-44");
                                break;
                            case "45":
                                this.ageSelect.selectAge.push("45-54");
                                break;
                            case "55":
                                this.ageSelect.selectAge.push("55-64");
                                break;
                            case "65":
                                this.ageSelect.selectAge.push("≥65");
                                break;
                        }
                    });
                    console.log(this.selectAge);
                    
                }
                if(e.gender){
                    this.genderSelect.genderContains=e.gender.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    let str=e.gender.gender.split(",");
                    str.forEach(item=>{
                        if(item=="male"){
                            this.genderSelect.selectGender.push(this.$t('demographics.male'))
                        }else if(item=="female"){
                            this.genderSelect.selectGender.push(this.$t('demographics.female'))
                        }else if(item=="unknown"){
                            this.genderSelect.selectGender.push(this.$t('demographics.allowUnknown'))
                        }
                    })
                }
                if(e.premium){
                    this.paidSelect.paidContains=e.premium.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                
                    e.premium.premium=='1'?this.paidSelect.selectPaid.push(this.$t('trafficGrouping.paid')):this.paidSelect.selectPaid.push(this.$t('trafficGrouping.nonPaying'))
                    
                    console.log(this.paidSelect);
                    
                }
                if(e.install.length){
                    e.install.forEach(item=>{
                        this.installTime.time.push(`${item.action_type} ${item.value} ${item.value_type=="1"?this.$t('trafficGrouping.hours'):item.value_type=="2"?this.$t('trafficGrouping.days'):this.$t('trafficGrouping.week')}`)
                    })
                }
                if(e.network){
                    this.networkType.networkTypeContains=e.network.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    this.networkType.selectNetworkType=e.network.network_type;
                }
                if(e.system){
                    this.systemVersion.systemVersionContains=e.system.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    this.systemVersion.selectSystemVersion=e.system.operating_system;
                }
                if(e.appVersion){
                    this.appVersion.appVersionContains=e.appVersion.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    this.appVersion.selectAppVersion=e.appVersion.app_version;
                }
                if(e.sdkVersion){
                    this.sdkVersion.sdkVersionContains=e.sdkVersion.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    this.sdkVersion.selectSdkVersion=e.sdkVersion.sdk_version;
                }
                if(e.deviceId){
                    this.deviceId.deviceIdContains=e.deviceId.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    this.deviceId.selectDeviceId=e.deviceId.device_id;
                }
                if(e.deviceType){
                    this.deviceType.deviceTypeContains=e.deviceType.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    this.deviceType.selectDeviceType=e.deviceType.device_type;
                }
                if(e.deviceBrand){
                    this.deviceBrand.deviceBrandContains=e.deviceBrand.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    this.deviceBrand.selectDeviceBrand=e.deviceBrand.device_brand;
                }
                if(e.channel){
                    this.channel.channelContains=e.channel.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion');
                    this.channel.selectChannel=e.channel.channel;
                }
                if(e.idfa){
                    this.idfa.selectidfa=e.idfa.idfa_status=='1'?this.$t("trafficGrouping.thereAreIDFA"):this.$t("trafficGrouping.noneIDFA");
                }
                if(e.kvExpression.length){
                    e.kvExpression.forEach(item=>{
                        this.kvExpression.push({
                            contains:item.action_type=='include'?this.$t('trafficGrouping.contains'):this.$t('trafficGrouping.exclusion'),
                            key:item.key,
                            value:item.value
                        })
                    })
                }
        },
        //修改删除流量分组
        changeGrouping(e){
            console.log(e);
            if(e.key=='1'){
                this.showAddTrafficGrouping=true;
                this.switchStatus=true;
            }else if(e.key=='2'){
                this.$confirm({
                    title: this.$t('aggregate.deleteTrafficGroups'),
                    content: this.$t('aggregate.deleteAdUnitContent'),
                    cancelText:this.$t('aggregate.cancel'),
                    okText:this.$t('aggregate.enter'),
                    icon: <ExclamationCircleOutlined  />,
                    onOk:()=> {
                        this.$req.delGrouping({mediation_group_id:this.selectGrouping}).then(res=>{
                            console.log(res);
                            if(res.data.code==200){
                                message.success(this.$t('aggregate.deleteSuccessful'));
                                this.selectGrouping="";
                                this.getMediationList();
                            }else{
                                message.error(this.$t('aggregate.deleteFailed'));
                            }
                        })
                    },
                    onCancel:()=> {
                        
                    },
                });
            }
            
        },
        callback(e){
            console.log(e);
            
        },
        //打开新建流量分组
        handleButtonClick(){
            if(this.grouping.length>=50){
                message.error(this.$t('aggregate.maxiMum'));
            }else if(this.placement_id){
                this.showAddTrafficGrouping=true;
                this.switchStatus=false;
            }else{
                message.error(this.$t('aggregate.pleaseSelectAdUnit'));
            }
            
        },
        handleMenuClick(e){
            console.log(e);
            if(this.placement_id){
                if(e.key=='1'){
                    this.showCopyTrafficGrouping=true;
                }else if(e.key=='2'){
                    this.showPriorityTrafficGrouping=true;
                }
            }else{
                message.error(this.$t('aggregate.pleaseSelectAdUnit'));
            }
            
        },
        seachBidList(){
            console.log(1);
            console.log(this.tags.toString());
            if(this.placement_id){
                this.getMediationList();
            }else {
                message.error(this.$t('aggregate.pleaseSelectAdUnit'));
            }
            
        },
        //广告位切换
        placementChange(){
            if(this.adUnitName){
                this.appSeerch();
            }
        },
        tagsCahnge(){
            this.seachBidList();
        },
        //修改价格
        editorPrice(e){
            console.log(e);
            this.newBid=Number(e.revenue_value);
            this.network_id=e.id;
        },
        //修改标签
        editorTags(e){
            this.newTags=e.label_name;
            this.network_id=e.id;
        },
        //修改标签确认
        confirmTags(){
            console.log(this.newTags);
            this.mediationLoading=true;
            let opt ={
                mediation_bid_id:this.network_id,
                label:this.newTags,
                mediation_group_id:this.selectGrouping
            }
            this.$req.editMediationBidPrice(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.mediationLoading=false;
                    message.success(this.$t('aggregate.editSuccessful'));
                    this.getGroupingBidList();
                }else {
                    this.mediationLoading=false;
                    message.error(this.$t('aggregate.editFailed'));
                }
                
            })
        },
        cancellationsTags(){
            this.newTags="";
        },
        priceCancel(){
            this.newBid="";
            console.log(this.isDragging);
            this.isDragging=false;
            
        },
        //修改价格确认
        confirmPrice(e){
            console.log(e);
            console.log(this.newBid);
            if(this.newBid==""){
                message.error(this.$t('aggregate.pleaseBids'));
                this.getGroupingBidList();
            }else if(Number(this.newBid)<0.01){
                message.error(this.$t('aggregate.theMinimum'));
                this.getGroupingBidList();
            }else{
                this.mediationLoading=true;
                let opt ={
                    mediation_bid_id:this.network_id,
                    revenue_value:this.newBid,
                    mediation_group_id:this.selectGrouping
                }
                this.$req.editMediationBidPrice(opt).then(res=>{
                    console.log(res);
                    if(res.data.code==200){
                        this.mediationLoading=false;
                        message.success(this.$t('aggregate.editSuccessful'));
                        this.getGroupingBidList();
                    }else {
                        this.mediationLoading=false;
                        message.error(this.$t('aggregate.editFailed'));
                    }
                    
                })
            }
        },
        //监听修改价格弹窗显示和隐藏
        visibleChange(e){
            console.log(e);
            if(!e){
                console.log(this.isDragging,this.newIndex);
                if(this.isDragging&&this.newIndex>=0){
                    console.log(this.data);
                    
                    const currRow = this.data.splice(this.newIndex, 1)[0];
                    console.log(currRow,this.oldIndex);
                    this.data.splice(this.oldIndex, 0, currRow);
                    console.log(this.newIndex);
                    console.log(this.data);
                    this.newIndex="";
                    this.oldIndex="";
                    
                }
                
            }
            
            console.log(this.isDragging);
            
        },
        //获取标签列表
        getBidsLabel (e) {
            e=="mediation"?'store.dispatch("Util/Loading", true)':this.mediationLoading=true;
            
            this.$req.getBidLabel().then(res=>{
                console.log(res);
                if(res.data.code==200){
                    if(res.data.data.length){
                        this.labelList=res.data.data;
                    }else {
                        this.labelList=[];
                    }
                    e=="mediation"?'store.dispatch("Util/Loading",false)':this.mediationLoading=false;
                }else{
                    e=="mediation"?'store.dispatch("Util/Loading", false)':this.mediationLoading=false;
                    message.error(this.$t('aggregate.editFailed'));
                }
            })
        },
        //切换广告源状态
        activeChange(e){
            console.log(e);
            this.mediationLoading=true;
            let opt={
                mediation_bid_id:e.id,
                state:e.active?1:0,
                mediation_group_id:this.selectGrouping
            }
            this.$req.switchMediationBidActive(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.mediationLoading=false;
                    message.success(this.$t('aggregate.switchingStatusSuccessful'));
                    this.getGroupingBidList();
                }else{
                    message.error(this.$t('aggregate.switchingStatusFailed'));
                    this.mediationLoading=false;
                    this.getGroupingBidList();
                }
                
            })
        },
        //切换活动状态
        CampaignActiveChange(e){
            console.log(e);
            this.campaignLoading=true;
            let opt ={
                campaign_id:e.id,
                placement_ids:this.placement_id,
                active:e.active?1:0
            }
            this.$req.switchPlacementCampaignActive(opt).then(res=>{
                if(res.data.code==200){
                    this.campaignLoading=false;
                    message.success(this.$t('aggregate.switchingStatusSuccessful'));
                    this.getCampaignList();
                }else {
                    this.campaignLoading=false;
                    message.error(this.$t('aggregate.switchingStatusFailed'));
                    this.getCampaignList();
                }
            })


        },
        //跳转到编辑换量活动
        goEditCampaign(e){
            console.log(this.placement_id,this.app_id);
            
            this.$router.push({
                path:"/hl/createBuyers",
                query:{
                    activeName:"1",
                    campaign_id:e,
                    close:2,
                    app_id:this.app_id,
                    placement_id:this.placement_id
                }
            })
        },
        //跳转到编辑广告源
        goEditBids(e){
            this.$router.push({path:"/hl/EidtAdSource",query:{
                close:3,
                placement_id:this.placement_id,
                adSource_id:e,
                app_id:this.app_id,
                grouping_id:this.selectGrouping,
                isManAd:0,
            }})
        },
        //获取广告源列表
        getMediationList(e){
            e=="mediation"?store.dispatch("Util/Loading", true):this.mediationLoading=true;
            console.log(this.placement_id,"流量分组");
            
            this.$req.getGroupingList({placement_id:this.placement_id,exclude_default:0}).then(res=>{
                if(res.data.code==200){
                    console.log(res.data,"流量分组");
                    if(res.data.data instanceof Array){
                        
                        this.grouping=res.data.data;
                        this.grouping.push(this.grouping.shift());
                        this.grouping.forEach((item,index)=>{
                            if(item.priority=="0"){
                                item.name=this.$t('aggregate.defaultGroup');
                            }
                        })
                        if(e=="mediation"&&this.selectGrouping){
                            this.grouping.forEach(item=>{
                                if(item.id==this.selectGrouping){
                                    this.currentGrouping=item;
                                    this.groupingContent(this.currentGrouping)
                                }
                            })
                        }else{
                            this.selectGrouping=this.grouping[0].id;
                            this.currentGrouping=this.grouping[0];
                            this.groupingContent(this.currentGrouping)

                        }
                        let opt ={
                            placement_id:this.placement_id,
                            active:this.Classification=="1"?"all":this.Classification=="2"?"true":"false",
                            label:this.tags.length?this.tags.toString():"",
                            mediation_group_id:this.selectGrouping,
                        }
                        this.$req.getMediationBidsList(opt).then(res=>{
                            console.log(res);
                            if(res.data.code==200){
                                e=="mediation"?store.dispatch("Util/Loading", false):this.mediationLoading=false;
                                this.getBidsLabel();
                                if(res.data.data.length){
                                    this.data=res.data.data;
                                    this.data.map(val=>{
                                        val.active=val.active==1?true:false;
                                    })
                                }else{
                                    this.data=[];
                                }
                                console.log(this.data);
                            }else {
                                message.error(this.$t('aggregate.unknownError'));
                                e=="mediation"?store.dispatch("Util/Loading", false):this.mediationLoading=false;
                            }
                        })
                    }else{
                        e=="mediation"?store.dispatch("Util/Loading", false):this.mediationLoading=false;
                    }
                }else{
                    message.error(this.$t('aggregate.unknownError'));
                    e=="mediation"?store.dispatch("Util/Loading", false):this.mediationLoading=false;
                }
            })
        
        },
        //获取流量分组下的广告源列表
        getGroupingBidList(){
            this.mediationLoading=true;
            let opt ={
                placement_id:this.placement_id,
                active:this.Classification=="1"?"all":this.Classification=="2"?"true":"false",
                label:this.tags.length?this.tags.toString():"",
                mediation_group_id:this.selectGrouping,
            }
            this.$req.getMediationBidsList(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.mediationLoading=false;
                    this.getBidsLabel();
                    if(res.data.data.length){
                        this.data=res.data.data;
                        this.data.map(val=>{
                            val.active=val.active==1?true:false;
                        })
                    }else{
                        this.data=[];
                    }
                    console.log(this.data);
                }else {
                    message.error(this.$t('aggregate.unknownError'));
                    this.mediationLoading=false;
                }
            })
        },
        //删除广告源
        delMediationBids(e){
            this.mediationLoading=true;
            this.$req.delMediationBid({mediation_bid_id:e}).then(res=>{
                if(res.data.code==200){
                    this.mediationLoading=false;
                    message.success(this.$t('aggregate.deleteSuccessful'));
                    this.getMediationList();
                }else{
                    message.error(this.$t('aggregate.deleteFailed'));
                    this.mediationLoading=false;
                }
            })
        },
        //获取活动列表
        getCampaignList(e){
            e=="mediation"?store.dispatch("Util/Loading", true):this.campaignLoading=true;
            let opt={
                placement_id:this.placement_id,
                start_time:this.formatTime[0].format("YYYY-MM-DD"),
                end_time:this.formatTime[1].format("YYYY-MM-DD"),
            }
            this.$req.getPlacementCampaign(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    if(res.data.data.length){
                        this.list=res.data.data;
                        this.eventList="1";
                        this.list.map(val=>{
                            val.active=val.active==1?true:false;
                        })
                        console.log(this.eventList);
                    }else{
                        this.list=[]
                    }
                    e=="mediation"?store.dispatch("Util/Loading", false):this.campaignLoading=false;
                }else {
                    e=="mediation"?store.dispatch("Util/Loading", false):this.campaignLoading=false;
                }
            })
        },
        //搜索广告位下的广告源和活动
        appSeerch(e){
            console.log(1);
            console.log(this.placements);
            if(this.placements.length){
                
                let arr=this.placements.filter(val=>{
                    return val.placement_id==this.adUnitName;
                })
                console.log(arr);
                this.placement_id=arr[0].placement_id;
                e==1?this.getGroupingBidList():this.getMediationList();
                this.getCampaignList();
            }else {
                message.error(this.$t('aggregate.pleaseSelectAdUnit'));
            }
        },
        //广告源拖动排序  
        rowDrop(){
            var tableTooby=document.querySelector(".waterfall .el-table__body-wrapper tbody");
            console.log(tableTooby);
            Sortable.create(tableTooby, {
                ghostClass: 'sortable-ghost',
                onEnd: ({newIndex, oldIndex,item}) => {
                    const currRow = this.data.splice(oldIndex, 1)[0];
                    this.data.splice(newIndex, 0, currRow);
                    console.log(newIndex, oldIndex,item);
                    this.$nextTick(()=>{
                        if(newIndex!=oldIndex){
                            this.newIndex=newIndex;
                            this.oldIndex=oldIndex;
                            this.isDragging=true;
                            let price=document.querySelector(".waterfall .el-table__body-wrapper tbody").children[newIndex].querySelector(".clicks");
                                price.click();
                            if(newIndex==0){
                                let s=Number(this.data[1].revenue_value)+1;
                                s=s.toFixed(2);
                                this.newBid=s;
                            }else if(newIndex==this.data.length-1){
                                let s=Number(this.data[newIndex-1].revenue_value)-1;
                                s=s.toFixed(2);
                                this.newBid=s<0.01?0.01:s;
                            }else {
                                let s=(Number(this.data[newIndex+1].revenue_value)+Number(this.data[newIndex-1].revenue_value))/2;
                                s=s.toFixed(2);
                                this.newBid=s;
                            }
                            
                        }
                        
                    })
                    
                    
                },
            });
        },
         // 获取所有APP
        getAppList(e){
            e=="mediation"?store.dispatch("Util/Loading", true):this.mediationLoading=true;
            this.$req.appNameList().then(res=>{
                if(res.data.code === 200){
                    if(res.data.data.length){
                        this.app_names= res.data.data;
                        console.log(this.app_names);
                        
                        if(this.app_id){
                            var arr=this.app_names.filter(val=>{
                                return val.app_id==this.app_id
                            })
                            this.searchAppName=arr[0].appInfo.app_official_name;
                            this.appIconUrl=arr[0].appInfo.app_icon_url;
                        }else {
                            this.searchAppName=this.app_names[0].appInfo.app_official_name;
                            this.appIconUrl=this.app_names[0].appInfo.app_icon_url;
                            this.app_id=this.app_names[0].appInfo.id;
                        }
                        this.app_names.forEach(value => {
                            this.advertiser_id = value.advertiser_id;
                        });
                        console.log(res.data.data);
                        this.changeSearch("mediation");
                    } else{
                        this.app_names = []
                    }
                    // e=="mediation"?store.dispatch("Util/Loading", false):this.mediationLoading=false;
                }else {
                    
                    e=="mediation"?store.dispatch("Util/Loading", true):this.mediationLoading=true;
                    message.error(this.$t('aggregate.unknownError'));
                }
            }).catch(error=>{
                e=="mediation"?store.dispatch("Util/Loading", true):this.mediationLoading=true;
                message.error(this.$t('aggregate.unknownError'));
            })
        },
        //获取应用下广告单元根据广告单元获取下面的活动和广告源列表
        changeSearch(e,b){
            console.log(e,b,this.searchAppName);
            if(b){
                this.app_id=b.key;
                let items=this.app_names.filter(item=>{
                    return item.appInfo.id==b.key;
                })
                
                this.appIconUrl=items[0].appInfo.app_icon_url;
            }
            console.log(this.app_id,"appid");
            if(e=="mediation"){
                store.dispatch("Util/Loading", true)
            }else {
                this.campaignLoading=true;
                this.mediationLoading=true;
            }
            this.$req
            .AppPlacement({app_id:this.app_id,page:1,num_elements:10,no_paginate:1})
            .then(res => {
                if (res.data.code == 200) {
                    // this.mediationLoading=false;
                    this.placements = res.data.data.placement_list.length
                    ? res.data.data.placement_list
                    : [];
                    // this.placementTotal = res.data.data.total;

                    console.log(this.placements);

                    if(this.placements.length){
                        if(this.isEdit){
                            this.isEdit=false;
                            var arr =this.placements.filter(val=>{
                                return val.placement_id==this.placement_id
                            })
                            this.adUnitName=arr[0].placement_id;
                        }else {
                            this.adUnitName=this.placements[0].placement_id;
                            this.placement_id=this.placements[0].placement_id;
                        }

                        this.getMediationList(e);
                        this.getCampaignList(e);
                    }else {
                        this.campaignLoading=false;
                        this.mediationLoading=false;
                        this.adUnitName=undefined;
                        this.selectGrouping="";
                        this.grouping=[];
                        this.currentGrouping="";
                        this.data=[];
                        this.list=[];
                        this.placement_id="";
                        if(e=="mediation"){
                            store.dispatch("Util/Loading", false)
                        }else {
                            this.campaignLoading=false;
                            this.mediationLoading=false;
                        }
                    }
                } else {
                    if(e=="mediation"){
                        store.dispatch("Util/Loading", false)
                    }else {
                        this.campaignLoading=false;
                        this.mediationLoading=false;
                    }
                }
            })
            .catch(err => {
                if(e=="mediation"){
                    store.dispatch("Util/Loading", false)
                }else {
                    this.campaignLoading=false;
                    this.mediationLoading=false;
                }
            });
        },  
        choose(e){   
            this.selectTable=[];
            this.selectTable=e;
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
        //切换到新建广告源页面
        createAdSources(){
            if(this.placement_id){
                this.$router.push({path:"/hl/newAdSource",query:{
                    close:3,
                    placement_id:this.placement_id,
                    app_id:this.app_id,
                    grouping_id:this.selectGrouping,
                    isManAd:0
                }})
            }else {
                message.error(this.$t('aggregate.pleaseSelectAdUnit'));
            }
        
        },
        //切换不同状态下的广告源
        handleChange(e){
            console.log(e);
            switch(e){
                case "1":
                //  开启
                case "2":
                case "3":
                    if(this.placement_id){
                        this.getMediationList();
                    }else {
                        message.error(this.$t('aggregate.pleaseSelectAdUnit'));
                    }
                break;
            }
        },
        settingsItems(){
            this.selectListItems=true;
        },
        adClose(){
            this.selectListItems=false
        },
        PageCurrent(){

        },
        handleSizeChange(){

        },
        editListItem(){
            this.selectListItems=false;
            console.log(this.checkedList);
            
        }
    }
}
</script>
<style>
    .merization .icon{
        font-size: 64px;
        color:#909399;
        margin: 0;
    }
    .merization .icon-div{
        margin-top: 30px;
        height: 64px;
    }
    .merization .empty-div{
        height: 30px;
        line-height: 30px;
    }
    .merization .purples{
        margin-right: 0 !important;
        color: #6475c7;
        cursor: pointer;
    }
    .merization .div--margin{
        margin-bottom: 20px;
    }
</style>
<style lang="less" scoped>
    .merization{
        // background-color: #fff;
        // border-radius: 10px;
        // padding: 20px;
        .merization_top{
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
        }
        /deep/.addTrafficGrouping{
            .ant-modal-body{
                padding-top: 0!important;
                padding-bottom: 0!important;
            }
        }
        .AdSourcesNote{
            display: flex;
            width: 300px;
            .leftNote{
                width: 50%;
            }
            .rightNote{
                width: 50%;
            }
            p {
                margin-left: 30px;
            }
        }
        /deep/.ant-popover-placement-right{
            width: 210px!important;
            .ant-popover-inner-content{
                width: 200px!important;
            }
        }
        /* .ant-switch-checked{
            background-color: #6577c8;
        } */
        .doubt {
            display: inline-block;
            width: 14px;
            height: 14px;
            margin-left: 8px;
            line-height: 14px;
            vertical-align: sub;
            background: url("//console-style.hl.com/images/dspcom/normal_u109.svg") no-repeat ;
            background-size: 14px 14px;
        }
        .doubt:hover {
            background: url("//console-style.hl.com/images/dspcom/normal_u110.svg") no-repeat ;
            background-size: 14px 14px;
        }
        /deep/.selectListItems{
                .ant-modal-content{
                // border-radius: 10px;
                // .ant-modal-close{
                //     font-size: 16px;
                // }
                // .ant-modal-header{
                //     border-top-left-radius: 10px;
                //     border-top-right-radius: 10px;
                //     .ant-modal-title{
                //         font-size: 18px;
                //     }
                // }
                .ant-modal-body{
                    padding: 0 20px;
                    .selectCheck{
                        margin-top: 10px;
                        .ant-checkbox-group{
                            display: flex;
                            flex-wrap: wrap;
                            margin-left: 16px;
                            .ant-checkbox-wrapper{
                                width: 48%;
                                margin-top: 8px;
                            }
                        }
                        .saveListItem{
                            display: flex;
                            justify-content: center;
                            margin-top: 20px;
                            .saves{
                                width: 160px;
                                margin-bottom: 16px;
                                
                            }
                        }
                    }
                    
                }
            }
        }
        .head{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            /deep/.searchName{
                vertical-align: middle;
            }
            .search_primary{
                width: 100px;
            }
        }
        .edit_btn{
            vertical-align: middle;
        }
        .eventList{
            /deep/.ant-collapse {
                .app_imgs {
                    display: flex;
                    justify-content: left;
                    overflow:hidden; //超出的隐藏
                    text-overflow:ellipsis;//省略号
                    white-space:nowrap;//强制一行显示
                    .app_names {
                    display: flex;
                    vertical-align: middle;
                    flex-direction: column;
                    justify-content: space-between;
                    line-height: 0.16rem;
                    margin-left: 10px;
                    overflow:hidden; //超出的隐藏
                    text-overflow:ellipsis;//省略号
                    white-space:nowrap;//强制一行显示
                    span {
                        display: block;
                    }
                    .min {
                        overflow:hidden; //超出的隐藏
                        text-overflow:ellipsis;//省略号
                        white-space:nowrap;//强制一行显示
                    }
                    }
                }
            }
            
        }
        .dividers{
            margin-bottom: 0;
        }
        .waterfall{
            margin-top: 20px;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            h1{
                margin-top: 10px;
            }
            .trafficGrouping{
                margin-bottom: 16px;
                display: flex;
                /deep/.tabGrouping{
                    display: inline-block;
                    width: 100%;
                    height: 48px;
                    .ant-tabs-bar,.ant-tabs-nav-wrap,.ant-tabs-tab,.ant-tabs-nav-container{
                        height: 48px;
                    }
                    .ant-tabs-tab{
                        border-bottom: 2px solid #f0f0f0!important;
                    }
                    .ant-tabs-tab-active{
                        border-top: 2px solid;
                        border-bottom: 1px solid #fff!important;
                    }
                    .ant-tabs-tab{
                        border-radius: 0;
                        line-height: 48px;
                        min-width: 120px;
                        span{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                    }
                    .ant-tabs-tab .anticon{
                        margin-right: 0;
                    }
                    .ant-dropdown-link{
                        color: #666;
                        &:hover{
                            color: #3c56cc;
                        }
                    }
                    .ant-tabs-tab-prev,.ant-tabs-tab-next{
                        margin-top: 1px;
                        border: 1px solid #f0f0f0;
                        border-bottom: none;
                    }
                    // .ant-tabs-tab-next{
                    //     border-top: 1px solid #f0f0f0;
                    //     border-right: 1px solid #f0f0f0;
                    // }
                }
                .addtrafficGrouping_box{
                    padding-right: 8px;
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    align-items: center;
                    // .addtrafficGrouping_btn{
                    //     padding: 5px 12px;
                    // }
                }
                
                .grouping{
                    margin-left: 16px;
                    border-radius: 0;
                }
            }
            
            .sourcesHead{
                margin-bottom: 16px;
                .create_Sources{
                    margin-right: 16px;
                }
                .SelectItem{
                    margin-right: 16px;
                    float: right;
                }
                /deep/.waterfallSelect{
                    vertical-align: middle;
                    margin-right: 15px;
                }
            }
            /deep/.el-table {
                .el-table__body tr {
                    cursor: move;
                }
            }
        }
            /deep/.el-table {
                min-height: 144px!important;
                margin-bottom: 0!important;
                font-size: 12px;
                th {
                    background: #f2f2f2;
                    color: #7f7f7f;
                }
                .sortable-ghost{
                    opacity: .8;
                    color: #fff!important;
                    background: #ccc!important;
                }
                .MenuOutlined{
                    font-size: 27px;
                }
                
                // th.is-sortable {
                //     .cell {
                //     .caret-wrapper {
                //         display: none;
                //         .sort-caret.ascending {
                //         border-bottom-color: #f0f0f0;
                //         }
                //         .sort-caret.descending {
                //         border-top-color: #f0f0f0;
                //         }
                //     }
                //     }
                //     &:hover {
                //     background-color: #aaaaaa;
                //     color: #f0f0f0;
                //     .cell {
                //         .caret-wrapper {
                //         display: inline-flex;
                //         }
                //     }
                //     }
                // }
                // th.descending.is-sortable {
                //     .cell {
                //     .caret-wrapper {
                //         display: inline-flex;
                //         .sort-caret.descending {
                //         border-top-color: #409eff;
                //         }
                //     }
                //     }
                // }
                // th.ascending.is-sortable {
                //     .cell {
                //     .caret-wrapper {
                //         display: inline-flex;
                //         .sort-caret.ascending {
                //         border-bottom-color: #409eff;
                //         }
                //     }
                //     }
                // }
                // .el-table__expanded-cell {
                //     .el-table {
                //     border-radius: 10px !important;
                //     }
                //     .el-table__header {
                //     th {
                //         .cell {
                //         font-weight: 400 !important;
                //         color: #000 !important;
                //         }
                //     }
                //     }
                // }
                // .el-table-column--selection{
                //     .is-checked{
                //         .el-checkbox__inner{
                //             background-color: #6577c8;
                //             border-color: #6577c8;
                //         }
                //     }
                //     .is-indeterminate .el-checkbox__inner {
                //         background-color: #6577c8;
                //         border-color: #6577c8;
                //     }
                // }
                // .el-checkbox__input.is-indeterminate .el-checkbox__inner{
                //     background-color: #6577c8;
                //     border-color: #6577c8;
                // }
                .el-table__body tr {
                
                    .show{
                        display: none;
                    }
                }
                .el-table__body tr:hover {
                    .show{
                        display: inline-block;
                    }
                }
                .bidsName{
                    cursor: pointer;
                    // .ant-image{
                    //     display: inline-block;
                    //     border-radius: 5px;
                    //     margin-right: 5px;
                    // }
                    // .images{
                    //     border-radius: 5px;
                    // }
                }
                .purple {
                    margin-right:0px;
                
                }
            }
            /deep/.el-table--border{
                border: none;
            }
            /deep/.el-table--border th{
                border-color: #fff;
            }
            /deep/.el-table--border td{
                border: none;
            }
            /deep/.ant-popover{
                .ant-popover-content{
                    .ant-popover-inner-content{
                        .ant-popover-message-title{
                        margin-left: 0;
                        padding-left: 0;
                        }
                    }
                }
                
            }
            .editor{
                cursor: pointer;
            }
            
    }
    
</style>