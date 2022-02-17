<template>
  <div class="boxs" ref="boxs">
    <a-tabs type="card" v-model:activeKey="tabKey" @tabClick="tabChange">
      <a-tab-pane key="1" :tab="$t('newCampaign.crossPromotion')" class="exchangeActivities">
        <div class="events">
          <div class="promotion">
            <h1>{{$t('newCampaign.promotedApp')}}</h1>
            <a-select
              showSearch
              v-model:value="searchappID"
              style="width:400px;"
              :placeholder="$t('newCampaign.selectPromotedApp')"
              showArrow
              :maxTagCount="2"
              :disabled="statusFrom"
              @change="selectAPP"
              v-show="isShowApp"
              :notFoundContent="$t('Message.NoAppStoreAppData')"
            >
              <template #suffixIcon>
                <SearchOutlined  />
              </template>
              <a-select-option v-for="item in app_names" :key="item.appInfo.id">
                <span>
                  <AppleFilled style="margin-right:5px;" v-if="item.appInfo.platform==1" />
                  <AndroidFilled style="margin-right:5px;" v-else />
                  <!-- <AppleOutlined style="margin-right:5px;" v-if="item.appInfo.platform==1" />
                  <AndroidOutlined style="margin-right:5px;" v-else /> -->
                  {{item.appInfo.app_official_name}}
                </span>
              </a-select-option>
            </a-select>
            <div class="Information" v-show="!isShowApp">
              <a-image
                class="shisu_icon_image"
                :src="campaignInfo.app_icon_url"
                fallback="data:image/png;base64,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"
              />
              <div class="description">
                <div class="app_title">{{campaignInfo.app_official_name}}</div>
                <div class="app_platform">
                  <p>{{campaignInfo.app_platform=="1"?"iOS":"Android"}}</p>
                  <div>
                    <a-popover title placement="top" :mouseEnterDelay="0.2" :mouseLeaveDelay="0">
                      <template #content>
                        <p>{{$t('newCampaign.storePopover')}}</p>
                      </template>
                      <a-button type="link"  class="shisu_text_btn" @click="goShopping(campaignInfo.app_store)">{{$t('newCampaign.store')}}</a-button>
                    </a-popover>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a-divider v-if="searchappID.length!=0" />
          <div class="eventContent" v-if="searchappID.length!=0">
            <h1>{{$t('newCampaign.basicSettings')}}</h1>
            <a-form 
              ref="buyerFormRef"
              :rules="buyerFormRules"
              :model="buyerForm"
            >
            <a-form-item :label="$t('newCampaign.crossPromotionName')" name="promotionName">
              <a-input class="hlpromotion" v-model:value="buyerForm.promotionName" :placeholder="$t('newCampaign.crossPromotionName')" style="width:230px"/>
            </a-form-item>
            <!-- <div class="promotionName">
              <p>
                {{$t('newCampaign.priority')}}
                <span>*</span>
              </p>
              <div class="div">
                <a-select
                  v-model:value="promotionPriority"
                  style="width: 120px"
                  ref="selectStatus"
                  :placeholder="$t('newCampaign.priority')"
                  class="selectPriority"
                >
                  <a-select-option :value="item.value" v-for="item in Prioritys" :key="item">{{item.label}}</a-select-option>
                </a-select>
              </div>
            </div> -->
            <a-form-item :label="$t('newCampaign.startTime')" class="promotionName">
              <a-date-picker
                show-time
                inputReadOnly
                :allowClear="false"
                placeholder="开始时间"
                v-model:value="startTime"
                format="YYYY:MM:DD HH:mm:ss"
                @change="startTimes"
                @ok="startTimeOk"
                style="width:200"
              />
              <span class="timeZones">{{timeZone}}</span>
            </a-form-item>
            <a-form-item :label="$t('newCampaign.endTime')" class="promotionName">
              <a-radio-group name="radioGroup" v-model:value="time" @change="onChangeEndTime">
                <a-radio value="1">{{$t('newCampaign.noLimit')}}</a-radio>
                <a-radio value="2">
                  <a-form-item name="endingTime">
                    <a-date-picker
                      show-time
                      :placeholder="$t('newCampaign.endTime')"
                      :disabled-date="disabledEndDate"
                      v-model:value="buyerForm.endingTime"
                      format="YYYY:MM:DD HH:mm:ss"
                      :disabled="time!='2'"
                      style="width:200"
                    />
                  </a-form-item>
                  <span class="timeZones">{{timeZone}}</span>
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item :label="$t('newCampaign.dailyImpsLimit')" class="promotionName">
              <a-radio-group name="radioGroup" class="uniform" v-model:value="displayTimes" @change="onChangeDisplayTimes">
                <a-radio style="vertical-align: top;" value="1">{{$t('newCampaign.noLimit')}}</a-radio>
                <a-radio value="2">
                  <a-form-item name="displayCount">
                  <a-input
                    class="displayTimes"
                    type="Member"
                    v-model:value="buyerForm.displayCount"
                    :disabled="displayTimes!='2'"
                    :placeholder="$t('newCampaign.dailyImpsLimit')"
                  />
                  </a-form-item>
                  <br />
                  <a-checkbox v-model:checked="uniformSpeed" :disabled="displayTimes!='2'">{{$t('newCampaign.uniformConsumption')}}</a-checkbox>
                  <a-popover title placement="right">
                    <template #content>
                      <p>{{$t('newCampaign.averageDstribution')}}</p>
                    </template>
                    <QuestionCircleFilled class="iconNote" />
                    <!-- <span class="note doubt">1</span> -->
                  </a-popover>
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item :label="$t('newCampaign.bids')" name="promotionPrice" class="promotionName">
              <a-input class="campaignPrice" @change="onBlurRevenueValue" v-model:value="buyerForm.promotionPrice" :placeholder="$t('newCampaign.bids')" style="width:230px"/>
            </a-form-item>
          </a-form>
          </div>
          <a-divider v-if="searchappID.length!=0" />
          <div class="selectAdUnit" v-if="searchappID.length!=0">
            <h1>
              {{$t('newCampaign.selectAdUnit')}}
              <span>*</span>
            </h1>
            <div class="selectBtn" v-if="!statusFrom">
              <a-button type="primary" class="select" @click="selectAdUnits">{{$t('newCampaign.selectAdUnit')}}</a-button>
            </div>
            <div class="adList" v-if="statusFrom">
              <div class="adBtn">
                <a-button type="primary" class="select" @click="selectAdUnits">{{$t('newCampaign.selectAdUnit')}}</a-button>
                <a-button
                  type="primary"
                  danger
                  class="dangers"
                  :disabled="amendStatus.length==0"
                  @click="delAd"
                >{{$t('newCampaign.delete')}}</a-button>
              </div>
              <a-table
                :data-source="adunit"
                :rowSelection="rowSelection"
                :rowKey="record => record.id"
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
          <a-divider class="dividingLine" v-if="searchappID.length!=0" />
          <div
            class="advancedPositioning"
            v-if="searchappID.length!=0&&features.IS_POSITIONING_SETTING"
          >
            <a-collapse v-model:activeKey="activeKey" :bordered="false" expandIconPosition="right">
              <a-collapse-panel key="1" :header="$t('newCampaign.advanced')">
                <div class="language" v-if="features.IS_LANGUAGE_RESTRICTION">
                  <p>{{$t('newCampaign.language')}}</p>
                  <p>{{$t('newCampaign.targetedLanguage')}}: {{language_arr.length!=0?language_arr.toString():$t('newCampaign.noLanguageSelected')}}</p>
                  <a-button type="primary" class="selectLanguage" @click="selectLanguage">{{$t('newCampaign.edit')}}</a-button>
                </div>
                <div class="audienceCharacteristics" v-if="features.IS_AUDIENCE_RESTRICTION">
                  <p>{{$t('newCampaign.demographics')}}</p>
                  <div class="selected">
                    <p>{{$t('newCampaign.targetedGender')}}: {{selectGender=="male"?$t('newCampaign.male'):selectGender=="female"?$t('newCampaign.female'):$t('newCampaign.all')}}</p>
                    <p>{{$t('newCampaign.targetedAge')}}: {{selectAge.toString()=="全部"?$t('newCampaign.all'):selectAge.toString()}}</p>
                  </div>
                  <a-button type="primary" class="selectCharacteristics" @click="selectFeatures">{{$t('newCampaign.edit')}}</a-button>
                </div>
                <div class="paidUsers" v-if="features.IS_PAY_RESTRICTION">
                  <p>{{$t('newCampaign.paidUsers')}}</p>
                  <a-radio-group name="radioGroup" v-model:value="paidUsers" @change="paidChange">
                    <a-radio value="1">{{$t('newCampaign.all')}}</a-radio>
                    <a-radio value="2">{{$t('newCampaign.paid')}}</a-radio>
                    <a-radio value="3">{{$t('newCampaign.nonPaying')}}</a-radio>
                  </a-radio-group>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
          <!-- <a-divider v-if="searchappID.length!=0" /> -->
          <div class="bottoms" v-if="searchappID.length!=0">
            <a-button type="primary" class="continue" @click="saveCampaign">{{$t('newCampaign.SaveAndContinue')}}</a-button>
            <a-button  class="cancellation" @click="Cancellation">{{$t('newCampaign.cancels')}}</a-button>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('newCampaign.creatives')" class="advertisingCreative">
        <div class="creativity" v-show="!showCreative">
          <h1>{{$t('newCampaign.creative')}}</h1>
          <a-button type="primary" class="productionIdeas" @click="openCreative">{{$t('newCampaign.addCreative')}}</a-button>
          <!-- <a-select
                v-model:value="operations"
                style="width: 120px"
                ref="selectOperation"
                placeholder="制作创意"
                class="batchOperation"
                @change="operation"
              >
              <a-select-option v-if="features.ALLOW_ACCESS_ADD_BANNER_CREATIVE" value="1">横幅创意</a-select-option>
              <a-select-option value="2">VAST视频</a-select-option>
              <a-select-option v-if="features.ALLOW_ACCESS_ADD_INTERSTITIAL_CREATIVE" value="3">插页创意</a-select-option>
              <a-select-option value="4">激励视频</a-select-option>
          </a-select> -->
          <a-table :data-source="Creative_url" :rowKey="record => record.id">
            <a-table-column key="state" :title="$t('newCampaign.state')" data-index="state">
              <template #default="props">
                <span class="open" v-if="props.record.state=='1'"></span>
                <span class="pause" v-else></span>
              </template>
            </a-table-column>
            <a-table-column key="id" :title="$t('newCampaign.creativeID')" data-index="id" />
            <a-table-column key="name" :title="$t('newCampaign.creativeName')" data-index="name" />
            <a-table-column key="type" :title="$t('newCampaign.creativeForamt')" data-index="type" >
              <template #default="props">
                <span>{{props.record.type=="banner"?$t('newCampaign.banner'):props.record.type=="interstitial"?$t('newCampaign.insertion'):props.record.type=="stimulate"?$t('newCampaign.motivationalVideos'):$t('newCampaign.vastVideo')}}</span>
              </template>
            </a-table-column>
            <a-table-column key="address" :title="$t('newCampaign.operation')" data-index="address" ellipsis>
              <template #default="props">
                <a-button type="link" size="small" class="shisu_text_btn" @click="clickActive({All:props.record,type:props.record.state=='1'?'0':'1'})">{{props.record.state=="1"?$t('newCampaign.inActive'):$t('newCampaign.active')}}</a-button>
                <a-button type="link" size="small" class="shisu_text_btn"
                  @click="clickAction_video({id:props.record.id,type:props.record.type})"
                  v-if="props.record.type=='banner'&&features.ALLOW_ACCESS_ADD_BANNER_CREATIVE||props.record.type=='interstitial'&&features.ALLOW_ACCESS_ADD_INTERSTITIAL_CREATIVE||props.record.type=='stimulate'&&features.ALLOW_ACCESS_ADD_MOTIVATIONAl_VIDEOS_REATIVE||props.record.type=='video'&&features.ALLOW_ACCESS_ADD_VAST_CREATIVE"
                  >{{$t('newCampaign.edit')}}
                </a-button>
                <a-button type="link" danger size="small" class="shisu_text_btn" @click="deleteVideo({ids:props.record.id,advertiser_id:props.record.advertiser_id})"> {{$t('newCampaign.delete')}}</a-button>
              </template>
            </a-table-column>
            <!-- <template v-slot:empty >
              <div class="icon-div"><i class="iconfont icon">&#xe635;</i></div>
              <div class="empty-div">暂无数据</div>
              <div class="empty-div div--margin">点击<i class='purple' @click="openCreative">+制作创意</i></div>
            </template> -->
            <template v-slot:empty >
                <div class="icon-div"><i class="iconfont icon">&#xe635;</i></div>
                <div class="empty-div">{{$t('newCampaign.noData')}}</div>
                <div class="empty-div div--margin">{{$t('newCampaign.click')}}<i class='purples' @click="openCreative">+{{$t('newCampaign.addCreative')}}</i></div>
            </template>
          </a-table>
          <!-- <a-divider /> -->
          <div class="footerbottom" v-show="!showCreative">
            <a-button type="primary" class="saves" @click="goChangeVolume">{{$t('newCampaign.done')}}</a-button>
          </div>
        </div>
        <div class="productionIdeas" v-show="showCreative">
              <div class="creativeContent" >
                  <div class="creativekOption">
                    <h1>{{$t('newCampaign.newCreative')}}</h1>
                      <a-radio-group class="creativeType" v-model:value="size" @change="creativeTypeChange" button-style="solid">
                        <a-radio-button value="1" v-if="features.ALLOW_ACCESS_ADD_BANNER_CREATIVE" :disabled="isCreative&&size!='1'">{{$t('newCampaign.banner')}}</a-radio-button>
                        <a-radio-button value="3" v-if="features.ALLOW_ACCESS_ADD_INTERSTITIAL_CREATIVE" :disabled="isCreative&&size!='3'">{{$t('newCampaign.insertion')}}</a-radio-button>
                        <a-radio-button value="4" v-if="features.ALLOW_ACCESS_ADD_MOTIVATIONAl_VIDEOS_REATIVE" :disabled="isCreative&&size!='4'">{{$t('newCampaign.motivationalVideos')}}</a-radio-button>
                        <a-radio-button value="2" v-if="features.ALLOW_ACCESS_ADD_VAST_CREATIVE" :disabled="isCreative&&size!='2'">{{$t('newCampaign.vastVideo')}}</a-radio-button>
                      </a-radio-group>
                    <a-form
                      ref="creativity"
                      layout="horizontal"
                      :model="formCreative"
                      :rules="rules"
                      :label-col="labelCol"
                      :colon="false"
                    >
                      <a-form-item :label="$t('newCampaign.selectMaterial')" :name="selectMaterialType=='1'?'materialSelection':''">
                        <div v-if="!formCreative.materialSelection">
                          <a-radio-group class="materialType" v-model:value="selectMaterialType" @change="materialTypeChange" button-style="solid">
                            <a-radio-button value="1"  >{{$t('DirCusCampaign.LocalUpload')}}</a-radio-button>
                            <a-radio-button value="2"  >{{$t('DirCusCampaign.ThirdPartyURL')}}</a-radio-button>
                          </a-radio-group>
                            <a-upload-dragger
                            v-if="isMaterialType&&selectMaterialType=='1'"
                            v-model:fileList="formCreative.fileList"
                            :data="imageData"
                            accept='.jpg,.gif,.png,.swf,.jpeg'
                            :action="upimageUrl"
                            :beforeUpload="imageBeforeUpload"
                            @change="handleChange"
                          >
                            <!-- <p class="ant-upload-drag-icon">
                              <inbox-outlined></inbox-outlined>
                            </p> -->
                            <p >{{$t('newCampaign.uploadMaterial')}}<a-button type="link" class="shisu_text_btn">{{$t('newCampaign.uploadMaterials')}}</a-button></p>
                            <p class="ant-upload-hint" v-if="size!='1'">
                              ({{$t('newCampaign.scale')}}：3:2/2:3)
                            </p>
                          </a-upload-dragger>
                          <a-upload-dragger
                            v-if="!isMaterialType&&selectMaterialType=='1'"
                            v-model:fileList="formCreative.fileList"
                            :data="videodata"
                            accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'
                            :action="uploadUrl"
                            :beforeUpload="beforeUpload"
                            @change="handleChange"
                          >
                            <!-- <p class="ant-upload-drag-icon">
                              <inbox-outlined></inbox-outlined>
                            </p> -->
                            <p >{{$t('newCampaign.uploadMaterial')}}<a-button type="link" class="shisu_text_btn">{{$t('newCampaign.uploadMaterials')}}</a-button></p>
                            <p class="ant-upload-hint">({{$t('newCampaign.scale')}}：16:9/9:16,{{$t('newCampaign.duration')}}：5s~60s)</p>
                          </a-upload-dragger>
                          <div class="thirdParty" v-show="selectMaterialType=='2'">
                            <div class="mainBody">
                              <div class="headerLinks">
                                <div class="topHalf"></div>
                                <div class="middleImage"><DisconnectOutlined class="linkIcon"/></div>
                                <div class="secondHalf"></div>
                              </div>
                              <div class="content_Third_Party">
                                  <a-form
                                    ref="third_Party_URL"
                                    layout="vertical"
                                    class="third_Party_URL"
                                    :model="thirdPartyURL"
                                    :rules="rules"
                                    :label-col="labelCol"
                                    labelAlign="left"
                                    :colon="false"
                                    
                                  >
                                  <a-form-item :label="$t('DirCusCampaign.NonSecureLink')" name="insecureUrl">
                                    <a-input
                                      v-model:value="thirdPartyURL.insecureUrl"
                                      class="creativeName"
                                      placeholder="http://"
                                      style="border-radius: 5px;"
                                      autoComplete="off"
                                    />
                                  </a-form-item>
                                  <a-form-item :label="$t('DirCusCampaign.SecureLink')" name="securityUrl">
                                    <a-input
                                      v-model:value="thirdPartyURL.securityUrl"
                                      class="creativeName"
                                      placeholder="https://"
                                      style="border-radius: 5px;"
                                      autoComplete="off"
                                    />
                                  </a-form-item>
                                  </a-form>
                              </div>
                            </div>
                            <div class="continues">
                                <a-button type="primary" class="continueBtn" @click="continueThirdParty">{{$t('DirCusCampaign.Continue')}}</a-button>
                            </div>
                          </div>
                        </div>
                        <div class="previewMaterial" v-if="formCreative.materialSelection">

                                <video
                                v-if="sources.mediaType=='video'"
                                controls
                                  autoplay
                                  id="video"
                                  style="width:4rem;height:225px;vertical-align: middle;background-color:#000;"
                                  :src="sources.cdn_secure_url"
                                >
                                </video>
                                <div class="typeImages" v-show="sources.mediaType=='image'">
                                    <a-image
                                    class="typeImage"
                                    :src="sources.cdn_secure_url"
                                    fallback="data:image/png;base64,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"
                                    />
                                </div>
                                <span class="materialClose" @click="delMaterial"><CloseCircleOutlined /></span>
                                

                        </div>
                        <a-input
                          v-model:value="formCreative.materialSelection"
                          disabled
                          class="materialSelection"
                          :placeholder="$t('newCampaign.selectMaterial')"
                          style="border-radius: 5px;"
                          v-show="ismaterial"
                        />
                        <!-- <a-button type="primary" class="selection" @click="selectMaterial">{{$t('newCampaign.materialLibrary')}}</a-button> -->
                        <a-button type="link" v-if="selectMaterialType=='1'" @click="selectMaterial">{{$t('newCampaign.materialLibrary')}}</a-button>
                      </a-form-item>

                      <a-form-item :label="$t('newCampaign.creativeName')" name="creativeName">
                        <a-input
                          v-model:value="formCreative.creativeName"
                          class="creativeName"
                          :placeholder="$t('newCampaign.creativeName')"
                          style="border-radius: 5px;"
                          autoComplete="off"
                        />
                      </a-form-item>
                      <a-form-item :label="$t('newCampaign.headline')" v-if="motivationalVideos" name="creativeTitle">
                        <a-input
                          v-model:value="formCreative.creativeTitle"
                          class="creativeTitle"
                          :maxlength="25"
                          :placeholder="$t('newCampaign.headline')"
                          style="border-radius: 5px;"
                        />
                      </a-form-item>
                      <a-form-item :label="$t('newCampaign.description')" v-if="motivationalVideos" name="advertisingSlogan">
                        <a-input
                          v-model:value="formCreative.advertisingSlogan"
                          class="advertisingSlogan"
                          :maxlength="70"
                          :placeholder="$t('newCampaign.description')"
                          style="border-radius: 5px;"
                        />
                      </a-form-item>
                      <a-form-item :label="$t('newCampaign.dailyImpsLimit')" name="maximumNumber">
                        <a-input
                          v-model:value="formCreative.maximumNumber"
                          class="maximumNumber"
                          type="Number"
                          :maxlength="8"
                          :placeholder="$t('newCampaign.dailyImpsLimit')"
                          style="border-radius: 5px;"
                        />
                      </a-form-item>
                      
                      <a-form-item  :label="$t('newCampaign.creativeTemplate')" name="creativeTemplate" v-if="size!=2">
                          <a-select v-model:value="formCreative.creativeTemplate" :placeholder="$t('newCampaign.creativeTemplate')" class="creativeSizeSelect templateSelect" @change="creativeTemplateChange" >
                              <a-select-option v-for="(item,index) in creativeTemplateList" :value="item.id" :key="index+'sdf'">{{item.name}}</a-select-option>
                          </a-select>
                          <!-- <a-select
                              v-model:value="formCreative.creativeTemplate"
                              style="width:350px;"
                              placeholder="广告单元"
                              showArrow
                              show-search
                              class="creativeSizeSelect templateSelect"
                              @change="creativeTemplateChange"
                              >
                                  <a-select-option v-for="item in creativeTemplateList" :value="item.name" :key="item.id">
                                      <span  >
                                          {{item.name}}
                                      </span>
                                  </a-select-option>
                              </a-select> -->
                      </a-form-item>
                      <a-form-item v-if="creativeBannerSize" :label="$t('newCampaign.creativeSize')" name="creativeSize">
                          <a-select v-model:value="formCreative.creativeSize" :placeholder="$t('newCampaign.creativeSize')" class="creativeSizeSelect" @change="creativeSizeChange" >
                              <a-select-option v-for="(item,index) in creativeSizeList" :value="item" :key="index+'sdf'">{{item}}</a-select-option>
                          </a-select>
                          <a-input v-if="formCreative.creativeSize==$t('newCampaign.Customization')" type="Number" style="width:80px;height:35px;margin-left:10px;border-radius:5px;" v-model:value="formCreative.leftSize" :placeholder="$t('newCampaign.width')" @change="leftSizeChange" />&nbsp;<span style="display:inline-block;margin:0 5px" v-if="formCreative.creativeSize==$t('newCampaign.Customization')">x</span>&nbsp;<a-input v-if="formCreative.creativeSize==$t('newCampaign.Customization')" @change="rightSizeChange" style="width:80px;height:35px;border-radius:5px;margin-right:5px;" type="Number" v-model:value="formCreative.rightSize" :placeholder="$t('newCampaign.height')" /><a-checkbox  v-if="formCreative.creativeSize==$t('newCampaign.Customization')" class="addSizeList" v-model:checked="formCreative.addSizeList" >{{$t('newCampaign.addToSizeList')}}</a-checkbox>
                          <!-- <div class="Customization" v-if="formCreative.creativeSize=='自定义'">
                              
                          </div> -->
                      </a-form-item>
                      <a-form-item :wrapper-col="{ span: 14, offset: 8 }" class="footerbtn">
                        <a-button type="primary" class="saves" @click="addCreativity">{{$t('newCampaign.save')}}</a-button>
                        <a-button
                          class="cancellation"
                          @click="cancelLations"
                        >{{isCreative?$t('newCampaign.cancels'):$t('newCampaign.cancels')}}</a-button>
                      </a-form-item>
                    </a-form>
                  </div>
                  <div class="creativePreview">
                    <h1>{{$t('newCampaign.creativePreview')}}</h1>
                    <div class="preview" v-show="showPreview">
                      <p>{{$t('newCampaign.checkCreative')}}</p>
                      <br />
                      <a-button type="primary" class="previewbtn" @click="openPreview">{{$t('newCampaign.preview')}}</a-button>
                    </div>
                    <div v-show="!showPreview">
                      <div class="refreshPreview">
                        <a-button type="primary" class="refresh" @click="refreshPreview">{{$t('newCampaign.refreshPreview')}}</a-button>
                      </div>
                      <a-spin :spinning="iframeLoading">
                        <div class="materialPreview_cont">
                          <!-- <div  v-html="videoContent">

                          </div> -->
                          <iframe
                            :class="[changevw ? 'changevw' : 'Stylechange']"
                            scrolling="no"
                            ref="previews"
                            width="100%"
                            height="100%"
                            v-if="motivationalVideoUrl"
                            :key="motivationalVideoUrl"
                            :src="motivationalVideoUrl"
                            allowFullScreen="true"
                            webkitallowfullscreen="true"
                            mozallowfullscreen="true"
                            style="
                              border: none;
                              overflow: hidden;
                              border: 1px solid #e5e5e5;
                              background-color: #fff;
                            "
                          >
                          </iframe>
                          
                        </div>
                      </a-spin>
                      <div class="div-foot" v-show="!showPreview">
                          <a-radio-group v-model:value="changevw" button-style="solid">
                              <a-radio-button :value="true">{{$t('DirCusCampaign.Landscape')}}</a-radio-button>
                              <a-radio-button :value="false">{{$t('DirCusCampaign.PorTrait')}}</a-radio-button>
                          </a-radio-group>
                      </div>
                    </div>
                  </div>
            </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      v-model:visible="showLanguages"
      class="languageBox"
      :getContainer="()=>$refs.boxs"
      @ok="languageOk"
      :title="$t('newCampaign.selectLanguage')"
      :width="700"
    >
      <LanguageEdit
        ref="languageBox"
        v-if="showLanguages"
        @languageChange="languageChange"
        :language_targets="language_targets"
      ></LanguageEdit>
    </a-modal>
    <a-modal
      v-model:visible="showFeatures"
      class="featuresBox"
      :getContainer="()=>$refs.boxs"
      @ok="featuresOk"
      :title="$t('newCampaign.demographics')"
      :width="700"
    >
      <advanceSettings
        ref="featuresBox"
        v-if="showFeatures"
        @changeFeatures="changeFeatures"
        :gender_targets_M="gender_targets"
        :age_targets_M="age_targets"
        :selectAge="selectAge"
        :campaignInfo="campaignInfo"
      ></advanceSettings>
    </a-modal>
    <a-modal
      v-model:visible="showAdUnit"
      class="adUnitBox"
      :getContainer="()=>$refs.boxs"
      @ok="editLanguagesOk"
      :title="$t('newCampaign.selectAdUnit')"
      :width="700"
    >
      <selectAdUnit
        v-if="showAdUnit"
        ref="adUnitBox"
        :searchappID="searchappID"
        :platform="platform"
        :adunit="adunit"
        :showAdUnit="showAdUnit"
        @editLanguages="editLanguages"
      ></selectAdUnit>
    </a-modal>
    <a-modal
      v-model:visible="showMaterial"
      class="materialBox"
      :footer="false"
      @ok="selectSourcesOk"
      :getContainer="()=>$refs.boxs"
      :title="$t('newCampaign.selectMaterial')"
      :width="1000"
    >
      <SourceList
        ref="materialBox"
        v-if="showMaterial"
        :iconIndex="iconIndex"
        :app_id="searchappID"
        @selectSources="selectSources"
        :advertiser_id="advertiser_id"
        :size="size"
        :publisher_id="publisher_id"
        :member_id="member_id"
        :materialType="materialType"
      ></SourceList>
    </a-modal>
  </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script >
import store from "@/store";
import { useI18n } from 'vue-i18n';
import { mapGetters, useStore } from "vuex";
import { message} from 'ant-design-vue';
import { defineComponent, ref, reactive, getCurrentInstance } from "vue";
import LanguageEdit from "../Action/LanguageEdit";
import advanceSettings from "../Action/advanceSettings";
import selectAdUnit from "../Action/selectAdUnit";
import SourceList from "../APP/sourceList"; //素材列表组件
import moment from "moment";
import {
  RightOutlined,
  DownOutlined,
  UpOutlined,
  ReloadOutlined,
  SearchOutlined,
  AppleOutlined,
  AndroidOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  DisconnectOutlined,
  ExclamationCircleOutlined,
  QuestionCircleFilled,
  AppleFilled,
  AndroidFilled
} from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    RightOutlined,
    DownOutlined,
    UpOutlined,
    ReloadOutlined,
    LanguageEdit,
    advanceSettings,
    selectAdUnit,
    SearchOutlined,
    AppleOutlined,
    AndroidOutlined,
    SourceList,
    CloseCircleOutlined,
    InboxOutlined,
    DisconnectOutlined,
    ExclamationCircleOutlined,
    QuestionCircleFilled,
    AppleFilled,
    AndroidFilled
  },
  computed: {
    ...mapGetters({
      userInfo: "User/getUser"
    })
  },
  created() {
    // if (store.state.User.userAccessControl.ALLOW_ACCESS_TO_EXCHANGE_ACTIVITIES) {
        this.features = useStore().state["User"].userAccessControl;
    //     const { t } = useI18n();
    // } else {
    //   this.$router.push("/hl/buyerReport")
    // }
    store.dispatch("Util/OpenMenuKey",['/hl/buyer']);
    store.dispatch("Util/OpenKeys",['5']);
    
  },
  watch: {
    tabKey(val) {
      var videos = document.querySelector("#video");
      if (videos) {
        videos.pause();
      }
      this.size=undefined;
      this.showCreative = false;
      // this.motivationalVideoUrl="";
      // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl)
    }
  },
  setup() {
    const _data = getCurrentInstance();
    const { t } = useI18n();
    const formCreative = reactive({
      creativeName: "",
      creativeTitle: "",
      advertisingSlogan: "",
      maximumNumber: "",
      materialSelection: "",
      creativeSize:undefined,
      leftSize:"",
      rightSize:"",
      addSizeList:false,
      creativeWidth:"",
      creativeHeight:"",
      creativeTemplate:undefined,
      fileList:[],
    });
    const thirdPartyURL=reactive({
      insecureUrl:"",
      securityUrl:""
    })
    let validatorurl = async (rule, value) => {
      let rex = new RegExp("^[0-9]*$");
      if (value && value.lenght > 8) {
        return Promise.reject(t('newCampaign.maxPosition'));
      } else if (value && !rex.test(value)) {
        return Promise.reject(t('newCampaign.pleaseNumber'));
      } else {
        return Promise.resolve();
      }
    };
    let insecureUrl = async (rule, value) => {
      let rex = new RegExp(
        "(http)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]"
      );
      if (!value) {
        return Promise.reject(t('DirCusCampaign.PFITNSA'));
      }
      if (!rex.test(value)) {
        return Promise.reject(t('myApp.correctAddress'));
      } else {
        return Promise.resolve();
      }
    };
    let securityUrl = async (rule, value) => {
      let rex = new RegExp(
        "(https)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]"
      );
      if (!value) {
        return Promise.reject(t('DirCusCampaign.PFITSA'));
      }
      if (!rex.test(value)) {
        return Promise.reject(t('myApp.correctAddress'));
      } else {
        return Promise.resolve();
      }
    };
    const end_time = async (rule, value) => {
      console.log("bbbbb");
      console.log(value);
      console.log(_data.data.time);
      if(_data.data.time=='2'&&(value==null||value=='')){
        return Promise.reject(t('Message.EndTime'));
      }else{
        return Promise.resolve();
      }
    };
    const displayCount = async (rule, value) => {
      console.log("aaaa");
      console.log(value);
      console.log(_data.data.displayTimes);
      if(_data.data.displayTimes=='2'&&(value==null||value=='')){
        return Promise.reject(t('Message.NotEmpty'));
      }else{
        return Promise.resolve();
      }
    };

    const rules = {
      insecureUrl:[
        { required: true, validator:insecureUrl, trigger: ["blur","change"] }
      ],
      securityUrl:[
        { required: true, validator:securityUrl, trigger: ["blur","change"] }
      ],
      creativeName: [
        { required: true, message: t('newCampaign.pleaseCreativeName'), trigger: ["blur","change"] }
      ],
      creativeTitle: [
        { required: true, message: t('newCampaign.pleaseHeadline'), trigger: ["blur","change"] }
      ],
      advertisingSlogan: [
        { required: true, message:t('newCampaign.pleaseDescription'), trigger: ["blur","change"] }
      ],
      maximumNumber: [
        { required: false, validator: validatorurl, trigger: ["blur","change"] }
      ],
      materialSelection: [
        { required: true, message: t('newCampaign.pleaseSelectMaterial'), trigger:"blur" }
      ],
      creativeSize:[
        { required: true, message: t('newCampaign.pleaseSelectScale'), trigger: ["blur","change"] }
      ],
      creativeTemplate:[
        { required: true, message: t('newCampaign.pleaseSelectTemplate'), trigger: ["blur","change"] }
      ]
    };

    const buyerFormRules = {
      promotionName: [
        { required: true, message: t('Message.Name'), trigger: ["blur","change"] }
      ],
      endingTime: [
        { required: true, validator:end_time, trigger: ["blur","change"], type:"any" }
      ],
      displayCount: [
        { required: true, validator:displayCount, trigger: ["blur","change"] }
      ],
      promotionPrice: [
        { required: true, message: t('Message.NotEmpty'), trigger: ["blur","change"] }
      ],

    };

    return {
      rules,
      buyerFormRules,
      formCreative,
      thirdPartyURL,
    };
  },
  data() {
    return {
      isMaterialType:true,
      size:"1",
      ismaterial:false,
      upimageUrl:`/creative/hosted-creative-upload`,
      uploadUrl:"/creative-ui/api/creative-upload",
      imageData:{},
      videoData:{},
      operations:undefined,
      isCreative: false,
      languageData: [],
      campaignInfo: "",
      searchappID: [],
      app_names: [],
      promotionName: "",
      buyerForm:{
        promotionName:'',
        endingTime:'',
        displayCount:'',
        promotionPrice:''
      },
      promotionPriority: 5,
      labelCol:{span:5},
      Prioritys: [
        {
          value: 20,
          label: `20(${this.$t('campaign.max')})`
        }
      ],
      promotionPrice:"",
      creative_id: "",
      userAppInfo: "",
      publisher_id: "",
      member_id: "",
      materialType:"",
      uniformSpeed: false,
      isShowApp: true,
      showMaterial: false,
      iconIndex: 6,
      startTime: "",
      endingTime: "",
      time: "1",
      timeZone: "",
      displayTimes: "1",
      displayCount: "",
      statusFrom: false,
      adunit: [],
      isdDcide: false,
      paidUsers: "1",
      tabKey: "1",
      language_targets: [],
      language_action: "exclude",
      language_arr: [],
      languageID: [],
      showCreative: false,
      showPreview: true,
      showLanguages: false,
      footer: false,
      showFeatures: false,
      showAdUnit: false,
      platform: "",
      Creative_url: [],
      campaign_id: "",
      kv_expression: {},
      sources: {},
      advertiser_id: "",
      advertiser_id_delete: "",
      Creative_ids: [],
      selectGender: "全部",
      selectAge: ["全部"],
      amendStatus: [],
      app_id:"",
      motivationalVideos:false,
      creativeBannerSize:false,
      creativeSizeList:[],
      creativeTemplateList:[],
      placement_id:"",
      creativeTemplate_id:"",
      // resignation: [],
      features: {},
      preview: {
        app_name: "",
        app_image: "",
        app_store: "",
        video_url: "",
        title: "",
        content: ""
      },
      age_targets: { ages: null, allow_unknown: false },
      gender_targets: { gender: null, allow_unknown: false },
      app_store: "",
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.rowSelection.selectedRowKeys = selectedRowKeys;
          this.amendStatus = selectedRows;
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
      adlist: [],
      activeKey: [],
      isSizes:"",
      changevw:true,
      motivationalVideoUrl:"",
      language:"",
      materialWidth:"",
      materialHeight:"",
      appID:"",
      selectMaterialType:"1",
      iframeLoading:false,
    };
  },
  watch:{
    size(val){
      
      if(val=="1"||val=="3"){
        this.isMaterialType=true;
      }else{
        this.isMaterialType=false;
      }
      this.showPreview=true;
      this.motivationalVideoUrl="";
      // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl)
    },
    '$store.state.Util.language'(newVal,oldVal){
        console.log(newVal,oldVal);
        this.language=newVal;
        this.Prioritys[0].label=`20(${this.$t('campaign.max')})`;
        this.creativeSizeList[this.creativeSizeList.length-1]=this.$t('newCampaign.Customization');
        if(this.formCreative.creativeSize=="自定义"||this.formCreative.creativeSize=="Customization"){
          this.formCreative.creativeSize=undefined;
        }
        this.getLanguageList();
    }
  },
  methods: {
    selectSourcesOk(){
      this.$refs.selectSourcesOk.selectSources();
    },
    editLanguagesOk(){
      this.$refs.adUnitBox.editLanguages();
    },
    featuresOk(){
      this.$refs.featuresBox.editFeatures();
    },
    languageOk(){
      this.$refs.languageBox.editLanguage();
    },
    materialTypeChange(e){
      console.log(e);
    },
    onChangeEndTime(){
      this.$refs.buyerFormRef.validateFields('endingTime');
    },
    onChangeDisplayTimes(){
      this.$refs.buyerFormRef.validateFields('displayCount');
    },
    //第三方url继续
    continueThirdParty(e){
      this.$refs.third_Party_URL.validate()
        .then(() => {
          this.formCreative.materialSelection=this.thirdPartyURL.securityUrl;
          this.sources.cdn_secure_url=this.thirdPartyURL.insecureUrl;
          this.sources.cdn_url=this.thirdPartyURL.securityUrl;
          // this.sources.file_name=this.thirdPartyURL.insecureUrl;
          this.sources.mediaType=this.size=='1'||this.size=='3'?'image':'video';
          console.log(this.sources.cdn_secure_url,this.sources.cdn_url);
          
        })
    },
    //创建创意类型切换
    creativeTypeChange(e){
      console.log(e.target.value);
      // if(this.formCreative.creativeName||this.formCreative.creativeTitle||this.formCreative.creativeHeight||this.formCreative.creativeTemplate||this.formCreative.fileList||this.formCreative.advertisingSlogan||this.formCreative.maximumNumber||this.formCreative.materialSelection||this.formCreative.creativeSize||this.formCreative.leftSize||this.formCreative.rightSize||this.formCreative.addSizeList){
            if(e.target.value==2){
              this.motivationalVideos=true;
              this.materialType="video";
              this.creativeBannerSize=false;
              this.getTemplate(50);
            }else if(e.target.value==1){
                this.motivationalVideos=false;
                this.materialType="image";
                this.creativeBannerSize=true;
                this.getTemplate(1)
            }else if(e.target.value==3) {
              this.motivationalVideos=false;
              this.materialType="image";
              this.creativeBannerSize=false;
              this.getTemplate(5)
            }else {
              this.motivationalVideos=true;
              this.materialType="video";
              this.creativeBannerSize=false;
              this.getTemplate(65);
            }
            this.$refs.creativity.resetFields();
            this.formCreative.creativeSize=undefined;
            this.formCreative.creativeTitle="";
            this.formCreative.advertisingSlogan="";
      // }
        
    },
    //活动和创意切换
    tabChange(e){
        console.log(e);
        // if(e==2){
        //   this.showCreative=false;
        // }
        var videos = document.querySelector("#video");
          if (videos) {
            videos.pause();
          }
        if(this.showCreative){
          if(!this.showPreview){
            this.motivationalVideoUrl="";
            // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl)
          }
          
          this.showCreative=false;

          this.size=undefined;

          this.thirdPartyURL.insecureUrl='';
          this.thirdPartyURL.securityUrl='';
          this.selectMaterialType='1';
        }
    },
    //制作创意删除选择的素材
    delMaterial(){
      // this.sources={
      //   type:this.sources.type
      // },
      this.sources.cdn_secure_url="";
      this.sources.cdn_url="";
      this.sources.duration_ms="";
      this.sources.file_name="";
      this.sources.media_asset_id="";
      this.sources.mime_type_id="";
      this.sources.size_in_bytes="";
      this.sources.mediaType="";
      
      this.formCreative.materialSelection="";
    },
    //获取banner创意尺寸
    getPlacementSize(){
      this.creativeSizeList=[];
      this.creativeSizeList.push(`320*50`);
        /* this.$req.getPlacementSize().then(res=>{
            console.log(res);
            if(res.data.code==200){
                this.creativeSizeList=[];
                res.data.data.forEach(val=>{
                    this.creativeSizeList.push(`${val.width}*${val.height}`)
                })
                this.creativeSizeList.push(this.$t('newCampaign.Customization'));
            }else{
                message.error(this.$t('newCampaign.unknownError'));
            }
        }) */
    },
    //素材上传后的处理
    handleChange  (info) {
        let res=info.file.response;
        if (info.file.status === 'done') {
            console.log(res);
            if (res.response&&res.response.status === "OK") {
                if(res.response['media-asset'][0]){
                    let mediAasset_id=res.response['media-asset'][0].id
                    let opt={
                        id:mediAasset_id
                    }
                    this.$req.MediaAsset(opt).then(res=>{
                        console.log(res);
                        if(res.data&&res.data.response&&res.data.response.status==="OK"){
                            console.log('1');
                            let data = res.data.response['media-asset'][0];
                            console.log(data);
                            
                                let opts={
                                    advertiser_id:this.advertiser_id||this.userInfo.advertiser_id,
                                    publisher_id:this.publisher_id,
                                    member_id: this.member_id,
                                    media_asset_id:data.asset_type=="video"?data.media_asset_video.media_asset_id:data.media_asset_image.media_asset_id,
                                    app_id:this.app_id,
                                    type:data.asset_type,
                                    width:this.materialWidth,
                                    height:this.materialHeight
                                }
                                this.$req.AddSourceRelation(opts).then(res=>{
                                    if(res.data.code === 200){
                                        message.success(this.$t('newCampaign.uploadMaterialSuccessful'));
                                        store.dispatch("Util/Loading",false);
                                        this.sources.cdn_secure_url=data.cdn_secure_url;
                                        this.sources.cdn_url=data.cdn_url;
                                        this.sources.duration_ms=data.media_asset_video?data.media_asset_video.duration_ms:"";
                                        this.sources.file_name=data.file_name;
                                        this.sources.media_asset_id=data.id;
                                        this.sources.mime_type_id=data.mime_type_id;
                                        this.sources.size_in_bytes=data.size_in_bytes;
                                        setTimeout(()=>{
                                          this.sources.mediaType=data.asset_type;
                                          this.formCreative.materialSelection = data.file_name;
                                        },200)
                                        this.materialWidth="";
                                        this.materialHeight="";
                                        console.log(this.sources);
                                        
                                    }else if (res.data.code !== 200){
                                        message.error(res.data.msg)
                                        store.dispatch("Util/Loading",false);
                                        this.materialWidth="";
                                        this.materialHeight="";
                                    }
                                }).catch(err=>{
                                    message.error(this.$t('newCampaign.uploadMaterialFailed'))
                                    store.dispatch("Util/Loading",false);
                                    this.materialWidth="";
                                    this.materialHeight="";
                                })
                            
                        }else{
                            console.log("2");
                            message.error(this.$t('newCampaign.uploadMaterialFailed'));
                            store.dispatch("Util/Loading",false);
                            this.materialWidth="";
                            this.materialHeight="";
                        }
                    })
                    .catch(err=>{
                        message.error(this.$t('newCampaign.uploadMaterialFailed'));
                        store.dispatch("Util/Loading",false);
                        this.materialWidth="";
                        this.materialHeight="";
                    })
                }
            } else {
                message.error(this.$t('newCampaign.uploadMaterialFailed'));
                store.dispatch("Util/Loading",false);
                this.materialWidth="";
                this.materialHeight="";
            }
        } else if (info.file.status === 'error') {
            message.error(this.$t('newCampaign.uploadMaterialFailed'));
            store.dispatch("Util/Loading",false);
            this.materialWidth="";
            this.materialHeight="";
        }
    },
    //视频素材上传前处理
    beforeUpload(file){
            console.log(file);
              let _that=this;
              store.dispatch("Util/Loading",true);
            return new Promise(function(resolve,resject){
                console.log(name);
                let str=/[^\u4e00-\u9fa5\u0000-\u00ff]/g;
                let s=/%/g;
                let xhr=file.name.match(str);
                let doc=file.name.match(s);
                if(xhr||doc){
                    message.error(_that.$t('newCampaign.videoName'));
                    store.dispatch("Util/Loading",false);
                    return resject(false)
                }
                const isLt10M = file.size / 1024 / 1024 <= 10;
                console.log(file.type);
                
                let isType=['video/mp4','video/MPEG','video/flv','video/F4V','video/AVI','video/wmv','video/rmvb','video/mov','video/3gpp'].indexOf(file.type) == -1;
                if (isType) {
                    message.error(_that.$t('newCampaign.videoForamt'));
                    store.dispatch("Util/Loading",false);
                    return resject(false)
                }
                if (!isLt10M) {
                    message.error(_that.$t('newCampaign.videoSize'));
                    store.dispatch("Util/Loading",false);
                    return resject(false)
                }
                let _URL=window.URL || window.webkitURL;
                var videoObj=document.createElement("video");
                var videoUrl=_URL.createObjectURL(file);
                console.log(videoObj);
                videoObj.addEventListener("loadedmetadata",function(evt){
                  let valid=videoObj.videoWidth/videoObj.videoHeight==16/9||videoObj.videoWidth/videoObj.videoHeight==9/16;
                  _that.materialWidth=videoObj.videoWidth;
                    _that.materialHeight=videoObj.videoHeight;
                  if(videoObj.duration<5||videoObj.duration>60){
                    message.error(_that.$t('newCampaign.videoLength'));
                    store.dispatch("Util/Loading",false);
                    return resject(false)
                  }else if(!valid){
                    message.error(_that.$t('newCampaign.videoRatio'));
                    store.dispatch("Util/Loading",false);
                    return resject(false)
                  }else {
                    return resolve(true);
                  }
                    // valid?resolve():resject();
                })
                videoObj.src=videoUrl;
                return !xhr&&!isType&&isLt10M
            })
            
    },
    //图片素材上传前处理
    imageBeforeUpload(file){
            console.log(file);
              
            let _that=this;
            store.dispatch("Util/Loading",true);
            return new Promise(function(resolve,resject){
              let name=file.name.slice(0,file.name.length-4);
              console.log(name);
              
              _that.upimageUrl=_that.uploadUrl+"?qqfile="+file.name;
              // console.log(this.upimageUrl);
              let s=/%/g;
              let str=/[^\u4e00-\u9fa5\u0000-\u00ff]/g;
                let xhr=file.name.match(str);
                let doc=file.name.match(s);
              if(xhr||doc){
                  message.error(_that.$t('newCampaign.imageName'));
                  store.dispatch("Util/Loading",false);
                  return resject(false);
              }
              const isType=['image/png','image/jpg','image/gif','image/swf','image/jpeg'].indexOf(file.type) == -1;
                if (isType) { 
                    message.error(_that.$t('newCampaign.imageForamt'));
                    store.dispatch("Util/Loading",false);
                    return resject(false);
                }
                const isLt10M = file.size / 1024 / 1024 <= 10;
                if (!isLt10M) {
                    message.error(_that.$t('newCampaign.imageSize'));
                    store.dispatch("Util/Loading",false);
                    return resject(false);
                }
              let reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload=()=>{
                const image=new Image();
                image.src=reader.result;
                image.onload=()=>{
                  _that.materialWidth=image.width;
                    _that.materialHeight=image.height;
                    console.log("宽高：",_that.materialWidth,_that.materialHeight);
                    if(_that.size=="3"){
                      if(image.width/image.height==1.5||image.height/image.width==1.5){
                        return resolve(true);
                      }else{
                        message.error(_that.$t('newCampaign.imageRatio'));
                        store.dispatch("Util/Loading",false);
                        return resject(false);
                      }
                    }else {
                      return resolve(true);
                    }
                }
              }
              
              return !xhr&&!isType&&isLt10M
            })
            
          
    },
    //banner创意尺寸变化
    creativeSizeChange(e){
      console.log(e);
      if(this.formCreative.creativeSize!=this.$t('newCampaign.Customization')){
        this.formCreative.leftSize="";
        this.formCreative.rightSize="";
        this.formCreative.addSizeList=false;
        console.log();
        
        let arr=this.formCreative.creativeSize.split("*");
            console.log(arr);
            this.formCreative.creativeWidth=arr[0];
            this.formCreative.creativeHeight=arr[1];
      }else{
        this.formCreative.creativeWidth=this.formCreative.leftSize;
        this.formCreative.creativeHeight=this.formCreative.rightSize;
      }
    },
    rightSizeChange(){
      this.formCreative.creativeHeight=this.formCreative.rightSize;
    },
    leftSizeChange(){
      this.formCreative.creativeWidth=this.formCreative.leftSize;
    },
    //获取创意模板
    getTemplate(e){
      console.log(e);
      store.dispatch("Util/Loading", true);
      let opt={
        media_subtype:e
      }
      this.$req.getTemplateList(opt).then(res=>{
        console.log(res);
        if(res.data.code==200){
          this.creativeTemplateList=res.data.data.length?res.data.data:[];
          this.creativeTemplateList.map((val,index)=>{
            // if(val.name==""){
            //   this.creativeTemplateList.splice(index,1);
            // }
            return val.name !="";
          })
          let obj = {}
          this.creativeTemplateList.map(item => {
            obj[item.name] = item
          })
          this.creativeTemplateList = Object.values(obj);
          if(e==65){
            this.creativeTemplateList.map((v,i)=>{
              if(v.name=="Reward Video_direct"){
                this.creativeTemplateList.splice(i,1);
              }
            })
          };
          if(this.size=='1'){
            console.log("1");
            
            this.creativeTemplateList.map((v,i)=>{
                if(v.name==""){
                  this.creativeTemplateList.splice(i,1);
                }
            })
          }
          console.log(this.creativeTemplateList);
          console.log(this.formCreative.creativeTemplate);
          
          // if(this.creativeTemplate_id){
          //   let arr= this.creativeTemplateList.filter(val=>{
          //     return val.id=this.creativeTemplate_id;
          //   })
          //   this.formCreative.creativeTemplate=arr[0].id;
          // }
          store.dispatch("Util/Loading", false);
        }else{
          store.dispatch("Util/Loading", false);
        }
      })
    },
    creativeTemplateChange(e,b){
      console.log(e,b);
      if(b.key){
        this.creativeTemplate_id=b.key;
      }
    },
    //开始时间变化
    startTimes(e) {
      console.log(Date.parse(this.buyerForm.endingTime));
      if(this.buyerForm.endingTime&&Date.parse(this.buyerForm.endingTime)<Date.parse(this.startTime)){
        this.buyerForm.endingTime="";
      }
    },
    startTimeOk(e) {
      console.log(e);
    },
    uniformChange() {
      console.log(this.uniformSpeed);
    },
    //结束时间可以选择的区间
    disabledEndDate(e) {
      
      if (this.startTime) {
        return e < this.startTime;
      } else {
        return false;
      }
    },
    selectAdUnits() {
      this.showAdUnit = true;
    },
    goApp_store(e) {
      window.open(e, "_blank");
    },
    goShopping(e) {
      window.open(e, "_blank");
    },
    // cancelAd() {
    //   console.log(this.resignation);
    //   this.adunit = this.resignation;
    // },
    //取消编辑换量活动
    Cancellation() {
      this.$confirm({
        title: this.$t('newCampaign.cancelEdit'),
        content: this.$t('newCampaign.cancelContent'),
        cancelText:this.$t('newCampaign.cancel'),
        okText:this.$t('newCampaign.enter'),
        icon: <ExclamationCircleOutlined  />,
        onOk: () => {
          this.$route.params = {
              app_id:this.appID,
              placement_id:this.placement_id,
          };
          this.$router.back();
          
        },
        onCancel: () => {}
      });
    },
    //选择素材
    selectSources(e) {
      console.log(e,this.sources);
      this.sources.cdn_secure_url=e.cdn_secure_url;
      this.sources.cdn_url=e.cdn_url;
      this.sources.duration_ms=e.duration_ms;
      this.sources.file_name=e.file_name;
      this.sources.media_asset_id=e.media_asset_id;
      this.sources.mime_type_id=e.mime_type_id;
      this.sources.size_in_bytes=e.size_in_bytes;
      this.formCreative.materialSelection = e.file_name;
      // this.sources.type=e.type;
      this.showMaterial = false;
      this.sources.mediaType=e.type;
      console.log(this.formCreative.materialSelection);
      console.log(this.sources);
    },
    //打开选择素材窗口
    selectMaterial() {
      var videos = document.querySelector("#video");
          if (videos) {
            videos.pause();
          }
      this.motivationalVideoUrl="";
      // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl)
      this.showMaterial = true;
      this.showPreview = true;
    },
    // 完成按钮
    goChangeVolume() {
      console.log(this.isdDcide);
      
      if(!this.isdDcide){
        console.log("新建");
        
        message.success(this.$t('newCampaign.addCrossPromotionSuccessful'));
        this.$router.push("/hl/buyer");
      }else{
        console.log("编辑");
        message.success(this.$t('newCampaign.editCrossPromotionSuccessful'));
        this.$router.go(-1);
      }
      this.$route.params = {
            app_id:this.appID,
            placement_id:this.placement_id,
        
        };
    },
    //删除创意
    deleteVideo(e) {
      this.advertiser_id_delete = e.advertiser_id;
      this.$confirm({
        title: this.$t('newCampaign.deleteCreative'),
        content: this.$t('newCampaign.deleteCreativeContent'),
        cancelText:this.$t('newCampaign.cancel'),
        okText:this.$t('newCampaign.enter'),
        icon: <ExclamationCircleOutlined  />,
        onOk: () => {
          store.dispatch("Util/Loading", true);
          let newArr = this.Creative_url.filter(item => item.id == e.ids);
          newArr.map(ele => {
            this.Creative_ids.push(ele.id);
          });
          this.Creative_url.splice(e.index, 1);
          this.Creative_url.filter(item => {
            return item.id != e.ids;
          });
          this.delete_fun();
        },
        onCancel: () => {}
      });
    },
    delete_fun() {
      if (this.Creative_ids.length) {
        let opt = {
          ids: this.Creative_ids,
          advertiser_id: this.advertiser_id_delete
        };
        this.$req
          .deleteCreative(opt)
          .then(res => {
            if (res.data.code == 200) {
              store.dispatch("Util/Loading", false);
              message.success(this.$t('newCampaign.deleteSuccessful'));
            } else {
              store.dispatch("Util/Loading", false);
              message.error(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
            store.dispatch("Util/Loading", false);
          });
      }
    },
    //修改创意状态
    clickActive(e) {
      if (e.All.state === "1" && e.type === "1") {
        message.warning("已是开启状态");
      } else if (e.All.state === "0" && e.type === "0") {
        message.warning("已是暂停状态");
      } else {
        store.dispatch("Util/Loading", true);
        let opt = {
          id: e.All.id,
          active: e.type === "1" ? "1" : "0"
        };
        this.$req
          .changeCreativeStatus(opt)
          .then(res => {
            if (res.data.code === 200) {
              message.success(this.$t('newCampaign.editSuccessful'));
              this.Creative_url.map(item => {
                if (item.id == e.All.id) {
                  item.state =
                    e.type === "1" ? (item.state = "1") : (item.state = "0");
                }
              });
              store.dispatch("Util/Loading", false);
            } else {
              message.error(this.$t('newCampaign.editFailed'));
              store.dispatch("Util/Loading", false);
            }
          })
          .catch(err => {
            message.error(this.$t('newCampaign.unknownError'));
            store.dispatch("Util/Loading", false);
          });
      }
    },
    // 编辑创意
    clickAction_video(e) {
      console.log(e.type);
      this.isCreative = true;
      this.showCreative = true;
      this.showPreview = true;
      this.size=undefined;
      this.$refs.creativity.resetFields();
      let params = {
        id: e.id
      };
      this.creative_id = e.id;
      store.dispatch("Util/Loading", true);
      this.$req
        .GetCreativeDetail(params)
        .then(res => {
          console.log(res.data.code);
          if (res.data.code == 200) {
            let data = res.data.data.creative;
            console.log(data);
            this.sources = {};
            this.sources.mediaType=data.template.media_subtype_id=="65"||data.template.media_subtype_id=="50"?"video":"image";
            this.sources.type=data.template.media_subtype_id;
            this.sources.last_modified=data.last_modified;
            this.sources.size_in_bytes=data.size_in_bytes;
            this.sources.duration_ms=data.video_attribute.duration_ms;
            this.sources.cdn_secure_url = data.media_url_secure;
            this.sources.cdn_url = data.media_url;
            this.sources.store = data.app_store;
            this.sources.media_asset_id = data.media_asset_id;
            this.app_store = data.app_info[0];
            this.formCreative.creativeName = data.name;
            this.formCreative.creativeTemplate=data.template.id;
            // this.selectMaterialType=data.media_type=="third-party"?'1':'2';
            if(data.media_type=='third-party'){
              this.selectMaterialType='2';
              console.log(this.selectMaterialType);
              
              this.thirdPartyURL.insecureUrl=data.media_url_secure;
              this.thirdPartyURL.securityUrl=data.media_url;
            }else{
              this.selectMaterialType='1';
            }
            console.log(this.selectMaterialType);
            
            this.getTemplate(data.template.media_subtype_id);

            if(data.template.media_subtype_id=="1"){
              this.size="1";
              this.motivationalVideos=false;
              this.materialType="image";
              this.creativeBannerSize=true;
              this.formCreative.creativeTitle =
              data.custom_macros["CREATIVE_TITLE"];
              this.formCreative.advertisingSlogan =
                data.custom_macros["CREATIVE_DEC"];
              this.formCreative.creativeSize=`${data.width}*${data.height}`;
            }else if(data.template.media_subtype_id=="50"){
              this.size="2";
              this.motivationalVideos=true;
              this.creativeBannerSize=false;
              this.materialType="video";
              this.formCreative.creativeTitle =
              data.custom_macros["ADSLOGAN"];
              this.formCreative.advertisingSlogan =
                data.custom_macros["ADTITLE"];
            }else if(data.template.media_subtype_id=="5"){
              this.size="3";
              this.creativeBannerSize=false;
              this.motivationalVideos=false;
              this.materialType="image";
            }else if(data.template.media_subtype_id=="65"){
              this.size="4";
              this.motivationalVideos=true;
              this.creativeBannerSize=false;
              this.materialType="video";
              console.log(data.custom_macros["CREATIVE_TITLE"]);
              this.formCreative.creativeTitle =data.custom_macros["CREATIVE_TITLE"];
              this.formCreative.advertisingSlogan =data.custom_macros["CREATIVE_DEC"];
            }
            this.formCreative.maximumNumber =
              Number(data.daily_budget_imps) == 0
                ? null
                : Number(data.daily_budget_imps);
            this.formCreative.materialSelection = data.file_name;
            store.dispatch("Util/Loading", false);
          } else {
            message.error(this.$t('newCampaign.unknownError'));
            store.dispatch("Util/Loading", false);
          }
        })
        .catch(err => {
          message.error(this.$t('newCampaign.unknownError'));
          store.dispatch("Util/Loading", false);
        });
    },
    //取消创意制作
    cancelLations() {
      this.$confirm({
        title: this.$t('newCampaign.cancelEdit'),
        content: this.$t('newCampaign.cancelContent'),
        cancelText:this.$t('newCampaign.cancel'),
        okText:this.$t('newCampaign.enter'),
        icon: <ExclamationCircleOutlined  />,
        onOk: () => {
          var videos = document.querySelector("#video");
          if (videos) {
            videos.pause();
          }
          this.$refs.creativity.resetFields();
          this.showPreview = false; 
          this.showCreative = false;
          this.size=undefined;
          this.motivationalVideoUrl="";
          this.thirdPartyURL.insecureUrl='';
          this.thirdPartyURL.securityUrl='';
          this.selectMaterialType='1';
        },
        onCancel: () => {}
      });
    },
    //制作banner,插页，激励视频创意
    createCreative(){
        let opt ={
          app_id:this.searchappID.toString(),
          advertiser_id:this.advertiser_id,
          creative_name:this.formCreative.creativeName.trim(),
          media_url:this.sources.cdn_url,
          daily_budget_imps:this.formCreative.maximumNumber,
          duration_ms:this.sources.duration_ms,
          media_url_secure:this.sources.cdn_secure_url,
          media_asset_id:this.sources.media_asset_id,
          click_url:this.app_store.app_store,
          type:this.size=="1"?"creative-banner":this.size=="3"?"creative-inter":"creative-stimulate",
          file_name: this.formCreative.materialSelection.trim(),
          width:this.formCreative.creativeWidth?this.formCreative.creativeWidth:"",
          height:this.formCreative.creativeHeight?this.formCreative.creativeHeight:"",
          add_size:this.formCreative.addSizeList?1:0,
          template_id:this.formCreative.creativeTemplate,
          creative_title: this.size=='4'?this.formCreative.creativeTitle.trim():"",
          creative_description: this.size=='4'?this.formCreative.advertisingSlogan.trim():"",
          media_type:this.selectMaterialType=='1'?'native':"third-party"
        }
        console.log(this.sources);
        
        this.$req
        .BannerCreative(opt)
        .then(res => {
          if (res.data.code === 200) {
            // this.saveCampaignDisable=true
            let data = res.data.data;
            console.log(res, "素材ID");
            this.Creative_url.push({
              url: data["creative-vast"].media_url.replace(
                "http:",
                window.location.protocol
              ),
              id: data.id,
              name: data["creative-vast"].name,
              state: "1",
              advertiser_id: data["creative-vast"].advertiser_id,
              type: data["creative-vast"].type
            });
            let opt = {
              campaign_id: this.campaign_id,
              creatives: this.Creative_url
            };
            this.$req
              .campaignBindCreative(opt)
              .then(res => {
                if (res.data.code == 200) {
                  var videos = document.querySelector("#video");
                  if (videos) {
                    videos.pause();
                  }
                  this.showCreative = false;
                  this.motivationalVideoUrl="";
                  store.dispatch("Util/Loading", false);
                  message.success(this.$t('newCampaign.createCreativeSuccessful'));
                  this.size=undefined;
                  this.thirdPartyURL.insecureUrl='';
                  this.thirdPartyURL.securityUrl='';
                  this.selectMaterialType='1';
                  this.getPlacementSize();
                } else {
                  message.error(this.$t('newCampaign.createCreativeFailed'));
                }
              })
              .catch(err => {
                store.dispatch("Util/Loading", false);
                message.error(this.$t('newCampaign.createCreativeFailed'));
              });
          } else {
            message.error(this.$t('newCampaign.unknownError'));
            store.dispatch("Util/Loading", false);
          }
        })
        .catch(res => {
          // message.error(res.data.msg);
          store.dispatch("Util/Loading", false);
        });
    },
    //制作VAST视频创意
    createVAST(){
      let data ={
        advertiser_id:this.advertiser_id,
        member_id:this.member_id,
        app_id:this.searchappID.toString(),
        media_asset_id:this.sources.media_asset_id?this.sources.media_asset_id:0,
        duration_ms:this.sources.duration_ms?this.sources.duration_ms:0,
        size_in_bytes:this.sources.size_in_bytes?this.sources.size_in_bytes:0,
        ad_title:this.formCreative.creativeName.trim(),
        daily_budget_imps:this.formCreative.maximumNumber,
        click_url:this.app_store.app_store,
        media_url_secure:this.sources.cdn_secure_url,
        media_url:this.sources.cdn_url,
        creative_title: this.formCreative.creativeTitle.trim(),
        creative_description: this.formCreative.advertisingSlogan.trim(),
        file_name: this.formCreative.materialSelection.trim()?this.formCreative.materialSelection.trim():0,
        template_id:'1435',
        media_type:this.selectMaterialType=='1'?'native':"third-party"
      }
      console.log(1, data);
      this.$req
        .AddcreateCreative(data)
        .then(res => {
          if (res.data.code === 200) {
            // this.saveCampaignDisable=true
            let data = res.data.data;
            console.log(res, "素材ID");
            this.Creative_url.push({
              url: data["creative-vast"].media_url.replace(
                "http:",
                window.location.protocol
              ),
              id: data.id,
              name: data["creative-vast"].name,
              state: "1",
              advertiser_id: data["creative-vast"].advertiser_id,
              type: data["creative-vast"].type
            });
            let opt = {
              campaign_id: this.campaign_id,
              creatives: this.Creative_url
            };
            this.$req
              .campaignBindCreative(opt)
              .then(res => {
                if (res.data.code == 200) {
                  var videos = document.querySelector("#video");
                  if (videos) {
                    videos.pause();
                  }
                  this.showCreative = false;
                  this.motivationalVideoUrl="";
                  store.dispatch("Util/Loading", false);
                  message.success(this.$t('newCampaign.createCreativeSuccessful'));
                  this.size=undefined;
                  this.thirdPartyURL.insecureUrl='';
                  this.thirdPartyURL.securityUrl='';
                  this.selectMaterialType='1';
                } else {
                  message.error(this.$t('newCampaign.createCreativeFailed'));
                }
              })
              .catch(err => {
                store.dispatch("Util/Loading", false);
                message.error(this.$t('newCampaign.createCreativeFailed'));
              });
          } else {
            message.error(this.$t('newCampaign.unknownError'));
            store.dispatch("Util/Loading", false);
          }
        })
        .catch(res => {
          message.error(this.$t('newCampaign.unknownError'));
          // message.error(res.data.msg);
          store.dispatch("Util/Loading", false);
        });
    },
    //修改VAST视频创意
    editVAST(){
        let data={
          id: this.creative_id,
          advertiser_id: this.advertiser_id,
          member_id:this.member_id,
          ad_title:this.formCreative.creativeName.trim(),
          daily_budget_imps:this.formCreative.maximumNumber,
          duration_ms:this.sources.duration_ms,
          size_in_bytes:this.sources.size_in_bytes,
          click_url:this.app_store.app_store,
          media_url:this.sources.cdn_url,
          media_url_secure:this.sources.cdn_secure_url,
          creative_title: this.formCreative.creativeTitle.trim(),
          creative_description: this.formCreative.advertisingSlogan.trim(),
          media_asset_id: this.sources.media_asset_id,
          last_modified:this.sources.last_modified,
          file_name: this.formCreative.materialSelection.trim(),
          type:"creative_vast",
          template_id:"1435",
          media_type:this.selectMaterialType=='1'?'native':"third-party"
        }
        console.log(2, data);
        this.$req
        .PutBannerCreative(data)
        .then(res => {
          if (res.data.code == "200") {
            let data = res.data.data;
            this.Creative_url.map(item => {
              if (item.id === this.creative_id) {
                (item.url = this.sources.cdn_secure_url.replace(
                  "https:",
                  window.location.protocol
                )),
                  (item.id = this.creative_id);
                item.name = this.formCreative.creativeName.trim();
                item.advertiser_id = this.advertiser_id;
                // item.type=this.Video_type
              } else {
                return false;
              }
            });
            let opt = {
              campaign_id: this.campaign_id,
              creatives: this.Creative_url
            };
            this.$req
              .campaignBindCreative(opt)
              .then(res => {
                if (res.data.code == 200) {
                  message.success(this.$t('newCampaign.editSuccessful'));
                  store.dispatch("Util/Loading", false);
                  var videos = document.querySelector("#video");
                  if (videos) {
                    videos.pause();
                  }
                  this.showCreative = false;
                  this.motivationalVideoUrl="";
                  this.thirdPartyURL.insecureUrl='';
                  this.thirdPartyURL.securityUrl='';
                  this.selectMaterialType='1';
                } else {
                  store.dispatch("Util/Loading", false);
                  message.error(this.$t('newCampaign.editFailed'));
                }
              })
              .catch(err => {
                store.dispatch("Util/Loading", false);
                message.error(this.$t('newCampaign.editFailed'));
              });
          } else {
            message.error(this.$t('newCampaign.editFailed'));
            store.dispatch("Util/Loading", false);
          }
        })
        .catch(err => {
          message.error(this.$t('newCampaign.unknownError'));
          store.dispatch("Util/Loading", false);
        });
    },
    //修改banner,插页，激励视频创意
    editCreative(){
      let opt ={
          creative_id:this.creative_id,
          app_id:this.searchappID.toString(),
          advertiser_id:this.advertiser_id,
          creative_name:this.formCreative.creativeName.trim(),
          media_url:this.sources.cdn_url,
          click_url:this.app_store.app_store,
          daily_budget_imps:this.formCreative.maximumNumber,
          media_url_secure:this.sources.cdn_secure_url,
          media_asset_id:this.sources.media_asset_id,
          type:this.sources.type=="1"?"creative-banner":this.sources.type=="5"?"creative-inter":"creative-stimulate",
          file_name: this.formCreative.materialSelection.trim(),
          width:this.formCreative.creativeWidth?this.formCreative.creativeWidth:"",
          height:this.formCreative.creativeHeight?this.formCreative.creativeHeight:"",
          add_size:this.formCreative.addSizeList?1:0,
          template_id:this.formCreative.creativeTemplate,
          creative_title: this.sources.type=='65'?this.formCreative.creativeTitle.trim():"",
          creative_description: this.sources.type=='65'?this.formCreative.advertisingSlogan.trim():"",
          media_type:this.selectMaterialType=='1'?'native':"third-party",
          duration_ms:this.sources.duration_ms,
        }
      this.$req
      .BannerCreative(opt)
      .then(res => {
        if (res.data.code == "200") {
          let data = res.data.data;
          this.Creative_url.map(item => {
            if (item.id === this.creative_id) {
              (item.url = this.sources.cdn_secure_url.replace(
                "https:",
                window.location.protocol
              )),
                (item.id = this.creative_id);
              item.name = this.formCreative.creativeName.trim();
              item.advertiser_id = this.advertiser_id;
              // item.type=this.Video_type
            } else {
              return false;
            }
          });
          let opt = {
            campaign_id: this.campaign_id,
            creatives: this.Creative_url
          };
          this.$req
            .campaignBindCreative(opt)
            .then(res => {
              if (res.data.code == 200) {
                message.success(this.$t('newCampaign.editSuccessful'));
                store.dispatch("Util/Loading", false);
                var videos = document.querySelector("#video");
                if (videos) {
                  videos.pause();
                }
                this.showCreative = false;
                this.motivationalVideoUrl="";
                this.thirdPartyURL.insecureUrl='';
                this.thirdPartyURL.securityUrl='';
                this.selectMaterialType='1';
                this.getPlacementSize();
              } else {
                store.dispatch("Util/Loading", false);
                message.error(this.$t('newCampaign.editFailed'));
              }
            })
            .catch(err => {
              store.dispatch("Util/Loading", false);
              message.error(this.$t('newCampaign.editFailed'));
            });
        } else {
          message.error(this.$t('newCampaign.editFailed'));
          store.dispatch("Util/Loading", false);
        }
      })
      .catch(err => {
        message.error(this.$t('newCampaign.unknownError'));
        store.dispatch("Util/Loading", false);
      });
    },
    //判断是制作创意还是编辑创意
    creative(){
      this.$refs.creativity
          .validate()
          .then(() => {
            if (!this.isCreative) {
              if(this.formCreative.creativeSize==this.$t('newCampaign.Customization')&&this.formCreative.leftSize==""||this.formCreative.creativeSize==this.$t('newCampaign.Customization')&&this.formCreative.rightSize==""){
                message.error(this.$t('newCampaign.pleaseCustomizationSize'));
              }else{
                console.log(this.formCreative);
                store.dispatch("Util/Loading", true);
                console.log(this.userInfo, this.sources);
                switch(this.size){
                  case "1":
                  case "3":
                  case "4":

                    this.createCreative();
                    break;
                  case "2":
                    console.log(this.sources);

                    this.createVAST();
                    
                }
              }
            } else {
              if(this.formCreative.creativeSize==this.$t('newCampaign.Customization')&&this.formCreative.leftSize==""||this.formCreative.creativeSize==this.$t('newCampaign.Customization')&&this.formCreative.rightSize==""){
                message.error(this.$t('newCampaign.pleaseCustomizationSize'));
              }else{
                if(this.sources.type=="1"&&this.formCreative.creativeSize!=this.$t('newCampaign.Customization')){
                    let arr=this.formCreative.creativeSize.split("*");
                    console.log(arr);
                    this.formCreative.creativeWidth=arr[0];
                    this.formCreative.creativeHeight=arr[1];
                }
                store.dispatch("Util/Loading", true);
                console.log(this.sources.type);
                switch(this.sources.type){
                    case "50":
                      this.editVAST();
                      break;
                    case "1":
                    case "5":
                    case "65":
                      this.editCreative();
                }
              
              }
            }
          })
          .catch(error => {
            console.log("error", error);
            store.dispatch("Util/Loading", false);
          });
    },
    // 保存创意
    addCreativity() {
      if(!this.formCreative.materialSelection.trim()&&this.selectMaterialType=='2'){
        this.$refs.third_Party_URL.validate().then(()=>{
          this.formCreative.materialSelection=this.thirdPartyURL.securityUrl;
          this.sources.cdn_secure_url=this.thirdPartyURL.insecureUrl;
          this.sources.cdn_url=this.thirdPartyURL.securityUrl;
          // this.sources.file_name=this.thirdPartyURL.insecureUrl;
          this.sources.mediaType=this.size=='1'||this.size=='3'?'image':'video';
          console.log(this.formCreative.materialSelection);
          let _that=this;
          new Promise(function(resolve,resject){
            if(_that.size=='2'||_that.size=='4'){
                var videoObj=document.createElement("video");
                videoObj.addEventListener("loadedmetadata",function(evt){
                  console.log(videoObj.duration);
                    _that.sources.duration_ms=videoObj.duration;
                    _that.creative();
                })
                videoObj.src=_that.thirdPartyURL.insecureUrl;
                // $t('newCampaign.invalidAddress')
                
            }else {
                _that.creative();
            }
            
                console.log(_that.sources.duration_ms);
              // return resolve(true);
          
          })
          
        }).catch(error => {
          console.log("error", error);
          return;
        })
      }else{
        this.creative();
        
      }
    
    },
    delAd() {
      console.log(this.amendStatus);
      this.adunit = this.adunit.filter(
        item => !this.amendStatus.some(ele => ele.id == item.id)
      );
      this.rowSelection.selectedRowKeys = [];
      if (this.adunit.length == 0) {
        this.statusFrom = false;
      }
    },
    paidChange(e) {
      console.log(e);
      if (this.paidUsers == 2) {
        this.kv_expression = {
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
      } else if (this.paidUsers == 3) {
        this.kv_expression = {
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
    },
    editLanguages(e) {
      this.adunit = e;
      if (e.length) {
        this.statusFrom = true;
      } else {
        this.statusFrom = false;
      }
      this.showAdUnit = false;

      console.log(this.adunit);
    },
    addPriority() {
      for (var i = 1; i < 20; i++) {
        this.Prioritys.push({
          value: i,
          label: i
        });
      }
    },
    //创建换量活动
    createCampaign(){
      let arr = [];
          this.adunit.forEach(v => {
            arr.push({ id: v.id, action: "include" });
          });
          let opt = {
            app_id: this.searchappID.toString(),
            language_action: this.language_action,
            language_targets: this.language_targets,
            age_targets: this.age_targets,
            placement_targets: arr,
            gender_targets: this.gender_targets,
            kv_expression: this.kv_expression,
          };
          
          this.$req
            .Addprofile(opt)
            .then(res => {
              console.log(res.data, res.data.data, this.uniformSpeed);
              if (res.data.code == 200) {
                if (res.data && res.data.data) {
                  let profile_id = res.data.data.profile_id;
                  let data = {
                    profile_id: profile_id,
                    app_id: this.searchappID.toString(),
                    start_time: this.startTime.format("YYYY:MM:DD HH:mm:ss"),
                    end_time: this.time=='1'?null:this.buyerForm.endingTime.format("YYYY:MM:DD HH:mm:ss"),
                    name: this.buyerForm.promotionName.trim(),
                    click_url: this.app_store.app_store,
                    placement_targets: arr,
                    show_num: this.displayTimes == 1 ? "" : this.buyerForm.displayCount,
                    average_daily_usage:
                      this.displayTimes == 2 && this.uniformSpeed ? 1 : 0,
                    priority: this.promotionPriority,
                    revenue_value:Number(this.buyerForm.promotionPrice).toFixed(2)
                  };
                  this.$req
                    .Addcampaign(data)
                    .then(res => {
                      if (res.data.code === 200) {
                        this.tabKey = "2";
                        message.success(this.$t('newCampaign.createSuccessful'));
                        this.campaign_id = res.data.data.campaign_id;
                        store.dispatch("Util/Loading", false);
                      } else {
                        message.error(this.$t('newCampaign.createFailed'));
                        store.dispatch("Util/Loading", false);
                      }
                    })
                    .catch(err => {
                      message.error(this.$t('newCampaign.unknownError'));
                      store.dispatch("Util/Loading", false);
                    });
                } else {
                  tore.dispatch("Util/Loading", false);
                  message.error(this.$t('newCampaign.createFailed'));
                }
              } else {
                store.dispatch("Util/Loading", false);
                message.error(this.$t('newCampaign.createFailed'));
              }
            })
            .catch(err => {
              store.dispatch("Util/Loading", false);
              message.error(this.$t('newCampaign.unknownError'));
            });
    },
    //编辑换量活动
    editCampaign(){
        let arr = [];
          this.adunit.forEach(v => {
            arr.push({ id: v.id, action: "include" });
          });
          let opt = {
            profile_id: this.campaignInfo.profile_id,
            app_id: this.campaignInfo.app_id,
            language_action:
            this.language_targets.length != 0 ? "include" : "exclude",
            language_targets: this.language_targets,
            age_targets: this.age_targets,
            placement_targets: arr,
            gender_targets: this.gender_targets,
            kv_expression: this.kv_expression,
          };
          this.$req.Putprofile(opt).then(res => {
            if (res.data.code === 200) {
              if (res.data && res.data.data) {
                let profile_id = res.data.data.profile_id;
                console.log(this.buyerForm.endingTime,this.startTime);
                
                let data = {
                  campaign_id: this.campaignInfo.id,
                  profile_id: profile_id,
                  app_id: this.campaignInfo.app_id,
                  start_time: typeof(this.startTime)=="string"?this.startTime:this.startTime.format("YYYY:MM:DD HH:mm:ss"),
                  end_time: this.time=='1'?null:typeof(this.buyerForm.endingTime)=="string"?this.buyerForm.endingTime:this.buyerForm.endingTime.format("YYYY:MM:DD HH:mm:ss"),
                  creatives: this.Creative_url,
                  name: this.buyerForm.promotionName.trim(),
                  // show_num:this.imps,
                  click_url: this.campaignInfo.app_store,
                  placement_targets: arr,
                  show_num: this.displayTimes == 1 ? "" : this.buyerForm.displayCount,
                  average_daily_usage:
                    this.displayTimes == 2 && this.uniformSpeed ? 1 : 0,
                  priority: this.promotionPriority,
                  revenue_value:Number(this.buyerForm.promotionPrice).toFixed(2)
                };
                this.$req
                  .EditCampaign(data)
                  .then(res => {
                    if (res.data.code === 200) {
                      store.dispatch("Util/Loading", false);
                      message.success(this.$t('newCampaign.editSuccessful'));
                      this.tabKey = "2";
                    } else {
                      message.error(this.$t('newCampaign.editFailed'));
                      store.dispatch("Util/Loading", false);
                    }
                  })
                  .catch(err => {
                    message.error(this.$t('newCampaign.unknownError'));
                    store.dispatch("Util/Loading", false);
                  });
              } else {
                message.error(this.$t('newCampaign.editFailed'));
                store.dispatch("Util/Loading", false);
              }
            } else {
              message.error(this.$t('newCampaign.editFailed'));
              store.dispatch("Util/Loading", false);
            }
          });
    },
    // 保存换量活动
    saveCampaign() {
      this.$refs.buyerFormRef.validate().then(()=>{
        if (this.searchappID.length == 0) {
          message.error(this.$t('newCampaign.pleaseSelectPromotedApp'));
        } else if (this.buyerForm.promotionName == "") {
          message.error(this.$t('newCampaign.pleaseEnterCrossPromotionName'));
        } else if (this.time == "2" && this.buyerForm.endingTime == "") {
          message.error(this.$t('newCampaign.pleaseSelectendTime'));
        } else if (this.displayTimes == 2 && this.buyerForm.displayCount == "") {
          message.error(this.$t('newCampaign.pleaseEnterdailyImpsLimit'));
        }else if(this.displayTimes == 2 &&Number(this.buyerForm.displayCount).toString()=="NaN"||this.displayTimes == 2 &&this.buyerForm.displayCount.length>8){
          message.error(this.$t('adUnit.dailyImpsDigitalMessage'));
        }
        else if (this.buyerForm.promotionPrice==""){
          message.error(this.$t('newCampaign.pleaseEnterBids'));
        }else if (Number(this.buyerForm.promotionPrice).toString()=="NaN"){
            message.error(this.$t('newCampaign.bidsNumber'));
        }
        else if (this.adunit.length == 0) {
          message.error(this.$t('newCampaign.pleaseselectAdUnit'));
        } else {
          store.dispatch("Util/Loading", true);
          if (!this.isdDcide) {
             //新建换量活动
            this.createCampaign();
          }
          else{
            // 编辑换量活动
            this.editCampaign();
          }
        }
      }).catch(error => {
        console.log("error", error);
      })
    },
    selectAPP(e) {
      console.log(e,this.app_names);
      this.app_names.forEach(value => {
        if (value.appInfo.id == e) {
          this.publisher_id = value.publisher_id;
          this.member_id = value.member_id;
          this.platform = value.appInfo.platform;
          this.app_store = value.appInfo;
          this.advertiser_id=value.advertiser_id;
          console.log(value, this.advertiser_id, this.member_id);
        }
      });
      this.app_id=e;
      console.log(this.platform, this.searchappID);
    },
    // 打开新建创意
    openCreative() {
      console.log(this.features);
      
      if(this.features.ALLOW_ACCESS_ADD_BANNER_CREATIVE){
        this.size="1";
        this.getTemplate(1)
        this.materialType="image";
        this.motivationalVideos=false;
        this.creativeBannerSize=true;
      }else if(this.features.ALLOW_ACCESS_ADD_INTERSTITIAL_CREATIVE){
        this.size="3";
        this.getTemplate(5);
        this.materialType="image";
        this.motivationalVideos=false;
        this.creativeBannerSize=false;
      }else if(this.features.ALLOW_ACCESS_ADD_MOTIVATIONAl_VIDEOS_REATIVE){
        this.size="4";
        this.getTemplate(65);
        this.materialType="video";
        this.motivationalVideos=true;
        this.creativeBannerSize=false;
      }else if(this.features.ALLOW_ACCESS_ADD_VAST_CREATIVE){
        this.size="2";
        this.getTemplate(50);
        this.materialType="video";
        this.motivationalVideos=true;
        this.creativeBannerSize=false;
      }
      this.isCreative = false;
      this.showCreative = true;
      this.showPreview = true;
      
      console.log(this.showPreview);
      // this.size="1";
      this.$refs.creativity.resetFields();
      // this.motivationalVideos=false;
      
      
      
      
    },
    replays() {
      var videos = document.querySelector("#video");
      var replay = document.querySelector(".replay");
      videos.play();
      replay.style.display = "none";
    },
    iframeLoad(){
      this.iframeLoading=true;
      const iframes= this.$refs.previews;
      console.log(iframes,"iframe");
      
      if(iframes.attachEvent){
        iframes.attachEvent("onload",()=>{this.iframeLoading=false;console.log("load");
        })
      }else{
        iframes.onload=()=>{this.iframeLoading=false;console.log("loads");}
      }
    },
    // 刷新预览
    refreshPreview() {
      this.motivationalVideoUrl="";
      // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl)
      this.openPreview();
    },
    // 创意预览
    openPreview() {
      if(this.selectMaterialType=='2'&&!this.formCreative.materialSelection.trim()){
        this.$refs.third_Party_URL.validate().then(()=>{
          this.formCreative.materialSelection=this.thirdPartyURL.securityUrl;
          this.sources.cdn_secure_url=this.thirdPartyURL.insecureUrl;
          this.sources.cdn_url=this.thirdPartyURL.securityUrl;
          // this.sources.file_name=this.thirdPartyURL.insecureUrl;
          this.sources.mediaType=this.size=='1'||this.size=='3'?'image':'video';
          console.log(this.formCreative.materialSelection);
          this.$nextTick(()=>{
            var videos = document.querySelector("#video");
            console.log(videos);
            
            if(videos){
              videos.pause();
            }
          })
        }).catch(error => {
          console.log("error", error);
          return;
        })
      }
      this.$refs.creativity
        .validate()
        .then(() => {
          console.log(this.app_store);
          var videos = document.querySelector("#video");
          if(videos){
            videos.pause();
          }
          this.showPreview = false;
          console.log(this.size);
          console.log(videos);
          
          if(this.size=="4"){
            // let opt={
            //   video_url:this.sources.cdn_secure_url,
            //   creative_title:this.formCreative.creativeTitle.trim(),
            //   creative_dec:this.formCreative.advertisingSlogan.trim(),
            //   app_id:this.searchappID.toString()
            // }
            // console.log(opt);

          
            this.motivationalVideoUrl = `/ex/api/ex/creativeOnlinePreview?app_id=${this.searchappID.toString()}&video_url=${this.sources.cdn_secure_url}&creative_title=${this.formCreative.creativeTitle.trim()}&creative_dec=${this.formCreative.advertisingSlogan.trim()}&type=creative-stimulate`;
            this.$nextTick(()=>{
              this.iframeLoad();
            })
            // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl)
          }else if(this.size=="1"){
            // 横幅
          
            this.motivationalVideoUrl = `/ex/api/ex/creativeOnlinePreview?app_id=${this.searchappID.toString()}&video_url=${this.sources.cdn_secure_url}&type=creative-banner`;
            this.$nextTick(()=>{
              this.iframeLoad();
            })
            // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl)
          }else if(this.size=="2"){
            // vast视频creative-vast
          
            this.motivationalVideoUrl = `/ex/api/ex/creativeOnlinePreview?app_id=${this.searchappID.toString()}&video_url=${this.sources.cdn_secure_url}&type=creative-vast`;
            this.$nextTick(()=>{
              this.iframeLoad();
            })
            // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl)
          }else if(this.size=="3"){
            // 插页
            
            this.motivationalVideoUrl = `/ex/api/ex/creativeOnlinePreview?app_id=${this.searchappID.toString()}&video_url=${this.sources.cdn_secure_url}&type=creative-inter`;
            this.$nextTick(()=>{
              this.iframeLoad();
            })
            // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl)
          }
      
          
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    // 打开语言选择框
    selectLanguage() {
      this.showLanguages = true;
    },
    selectFeatures() {
      this.showFeatures = true;
    },
    //受众特征选择
    changeFeatures(age, gender, data) {
      this.age_targets = age;
      this.gender_targets = gender;
      console.log(age, gender);
      this.selectGender = gender.gender == null ? this.$t('newCampaign.all') : gender.gender;
      console.log(data.length > 0);
      if (data.lenght == 0) {
        this.selectAge = [this.$t('newCampaign.all')];
        console.log(1);
      } else {
        this.selectAge = data;
        console.log(2);
      }
      console.log(this.selectAge);

      this.showFeatures = false;
    },
    //语言选择组件LanguageEdit方法
    languageChange(val) {
      this.language_targets = [];
      this.language_arr = [];
      if (val.length !== 0) {
        this.language_action = "include";
        val.map((item, index) => {
          this.language_targets.push({ id: item.key });
          this.language_arr.push(item.label);
        });
      } else {
        this.language_action = "exclude";
        this.language_targets = [];
      }
      this.showLanguages = false;
    },
    // 获取所有语言
    getLanguageList() {
      this.$req
        .Language()
        .then(res => {
          if (res.data.code === 200) {
            this.languageData=[];
            res.data.data.map(value => {
            
                this.languageData.push({
                  key: value.id,
                  label:this.language=="zh"?value.zh_name:value.name
                });
            
            });
            if(this.language_targets){
              this.language_arr=[];
                for (var i = 0; i < this.languageData.length; i++) {
                for (var j = 0; j < this.language_targets.length; j++) {
                  if (this.languageData[i].key == this.language_targets[j].id) {
                    this.language_arr.push(this.languageData[i].label);
                  }
                }
              }
            }
            console.log(this.languageData);
            
          } 
        })
        .catch(err => {});
    },
    // 获取所有APP
    getAppList() {
      store.dispatch("Util/Loading", true);
      let opt = {name:"",is_up:1};
      this.$req.appNameList(opt).then(res => {
        if (res.data.code === 200) {
          if (res.data.data) {
            this.app_names = res.data.data;
            // this.app_names.forEach(value => {
            //   this.advertiser_id = value.advertiser_id;
            // });
          } else {
            this.app_names = [];
          }

          console.log(this.advertiser_id,"advertiser");
          
          store.dispatch("Util/Loading", false);
        }
        store.dispatch("Util/Loading", false);
      });
    },
    //获取换量活动信息渲染页面
    getCampaigns(e) {
      store.dispatch("Util/Loading", true);
      this.$req
        .GetCampaign({ campaign_id: e })
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            let data = res.data.data;
            this.app_id=data.app_id;
            this.advertiser_id=data.advertiser_id;
            this.campaignInfo = res.data.data;
            this.app_store=res.data.data;
            this.app_store.app_name=this.app_store.app_official_name;
            this.searchappID[0] = data.app_id;
            this.buyerForm.promotionName = data.name;
            this.campaign_id = data.id;
            this.platform = data.app_platform;
            this.publisher_id = data.publisher_id;
            this.member_id = data.member_id;
            this.promotionPriority = Number(data.priority);
            this.startTime = moment(data.start_date);
            this.buyerForm.promotionPrice=Number(data.campaignGroupInfo.revenue_value).toFixed(2);
            if (data.languageInfo.length > 0) {
              // 语言
              this.language_targets = [];
              this.language_action = "include";
              this.languageID = data.languageInfo;
              data.languageInfo.forEach(v => {
                this.language_targets.push({ id: v.language_id });
              });
              for (var i = 0; i < this.languageData.length; i++) {
                for (var j = 0; j < data.languageInfo.length; j++) {
                  if (
                    this.languageData[i].key == data.languageInfo[j].language_id
                  ) {
                    this.language_arr.push(this.languageData[i].label);
                  }
                }
              }
            } else {
              this.language_arr = [];
            }

            if (data.end_date) {
              // 结束时间
              this.time = "2";
              this.buyerForm.endingTime = data.end_date;
            } else {
              this.time = "1";
            }
            if (data.show_num) {
              // 展示次数上限
              this.displayTimes = "2";
              this.buyerForm.displayCount = Number(data.show_num);
              if (data.average_daily_usage) {
                this.uniformSpeed =
                  data.average_daily_usage == "1" ? true : false;
              }
            } else {
              this.displayTimes = "1";
            }

            if (data.placementInfo.length) {
              // 广告单元
              this.statusFrom = true;
              data.placementInfo.map(v => {
                v.id = v.placement_id;
                v.placement_Name = v.placement_name;
                v.name = v.app_name;
              });
              this.adunit = data.placementInfo;
              console.log(this.adunit);
            } else {
              this.statusFrom = false;
            }
            if (data.kvInfo) {
              // 付费用户
              this.paidUsers =data.kvInfo.json_expression.kv_expression.exp.vsa[0] == "1"? "2": "3";
            } else {
              this.paidUsers = "1";
            }
            if (data.ageInfo.length !== 0) {
              //年龄
              this.selectAge = [];
              this.age_targets.ages = [];
              data.ageInfo.map(item => {
                this.age_targets.ages.push({
                  low: item.low,
                  high: item.high
                });
              });
              data.ageInfo.forEach(v => {
                switch (v.low) {
                  case "13":
                    this.selectAge.push("<18");
                    break;
                  case "18":
                    this.selectAge.push("18-24");
                    break;
                  case "25":
                    this.selectAge.push("25-34");
                    break;
                  case "35":
                    this.selectAge.push("35-44");
                    break;
                  case "45":
                    this.selectAge.push("45-54");
                    break;
                  case "55":
                    this.selectAge.push("55-64");
                    break;
                  case "65":
                    this.selectAge.push("≥65");
                    break;
                }
              });
              console.log(this.selectAge);
            }
            // 性别
            if (data.genderInfo.length) {
              this.gender_targets.gender = null;
              res.data.data.genderInfo.map(item => {
                this.gender_targets.gender = item.gender;
              });
              this.selectGender = this.gender_targets.gender;
            } else {
              this.gender_targets.gender = null;
            }
            // 是否未知
            if (data.commonProfile.age_allow_unknown == 1) {
              this.age_targets.allow_unknown = true;
            }
            if (data.commonProfile.gender_allow_unknown == 1) {
              this.gender_targets.allow_unknown = true;
            }
            // 创意
            if (data.creativeInfo.length) {
              this.Creative_url = [];
              console.log(data.creativeInfo);

              data.creativeInfo.map(v => {
                console.log(v.creativeDetail.active);
                v.creativeDetail.state = v.creativeDetail.active;
                v.creativeDetail.type=v.creativeDetail.media_subtypes=="1"?"banner":v.creativeDetail.media_subtypes=="5"?"interstitial":v.creativeDetail.media_subtypes=="50"?"video":"stimulate";
                v.creativeDetail.name = v.creativeDetail.description;
              });
              data.creativeInfo.forEach(v => {
                this.Creative_url.push(v.creativeDetail);
              });
              console.log(this.Creative_url, "创意列表");
            } else {
              this.Creative_url = [];
            }
            store.dispatch("Util/Loading", false);
          } else {
            message.error(this.$t('newCampaign.unknownError'));
            store.dispatch("Util/Loading", false);
          }
        })
        .catch(err => {
          message.error(this.$t('newCampaign.unknownError'));
          store.dispatch("Util/Loading", false);
        });
    },
    onBlurRevenueValue(){
      let data=this.buyerForm.promotionPrice;
      if (data.indexOf('.')!=-1&&data.length-data.indexOf('.')>3) {
        this.buyerForm.promotionPrice=data.slice(0, data.indexOf('.')+3);
      }
    },
  },
  mounted() {

            this.language=store.state.Util.language;
            let appInfo=store.state.Util.appInfo;
            console.log(appInfo);
            if(appInfo.length!=0){
                this.searchappID=appInfo[0];
                this.app_id=appInfo[0];
                this.publisher_id=appInfo[1];
                this.member_id=appInfo[2];
                store.dispatch("Util/AppInfo",[]);
            }
            this.addPriority();
            this.getAppList();
            this.getPlacementSize();
            if(this.userInfo){
                  this.videodata={
                      type: 'video',
                      member_id:this.userInfo.entity_id
                  }
                  this.imageData={
                      type: 'image',
                      member_id:this.userInfo.entity_id
                  }
            }
            this.timeZone = useStore().state["User"].userInfo.timezone;
            if (this.$route.query.campaign_id) {
              this.app_id=this.$route.query.app_id;
              console.log(this.app_id);
              this.appID=this.$route.query.app_id;
              this.placement_id=this.$route.query.placement_id;
              this.isShowApp = false;
              this.getLanguageList();
              this.getCampaigns(this.$route.query.campaign_id);
              this.isdDcide = true;
              console.log(this.$route.query.activeName);
              if (this.$route.query.activeName == 1) {
                this.tabKey = "1";
              } else if (this.$route.query.activeName == 2) {
                this.tabKey = "2";
              }
            } else {
              var tabs = document.getElementsByClassName("ant-tabs-top-bar");
              var con = document.getElementsByClassName("ant-tabs-card-content");
              con[0].style.borderRadius = "10px";
              con[0].style.overflow = "hidden";
              tabs[0].style.opacity = "0";
              tabs[0].style.display="none";
              tabs[0].style.height = "0px";
              this.startTime = moment();
            }
            
    
  }
});
</script>
<style>
  .boxs .icon{
      font-size: 64px;
      color:#909399;
      margin: 0;
  }
  .boxs .icon-div{
      margin-top: 20px;
      height: 64px;
  }
  .boxs .empty-div{
      height: 30px;
      line-height: 30px;
      margin-bottom: 20px;
  }
  .boxs .purples{
      margin-right: 0 !important;
  }
  .boxs .div--margin{
      margin-bottom: 20px;
  }
</style>
<style lang="less" >
p {
  margin-bottom: 0;
}
.purple {
  margin-right: 0px;
}
.reds {
  color: #ff4d4f;
  cursor: pointer;
}
.reds:hover {
  color: #ff7875;
  text-decoration: underline;
}
.reds:active {
  color: #d93631;
  text-decoration: underline;
}

.boxs{
  .ant-collapse-icon-position-right{
    .ant-collapse-item{
      .ant-collapse-header{
        .ant-collapse-arrow{
          right: auto !important;
          left: 100px !important;
        }
      }
    }
  }
}

.ant-tabs-card {
  /* .ant-tabs-bar {
    margin-bottom: 0;
  }
  .ant-tabs-nav-animated {
    border-top-left-radius: 5px;
    .ant-tabs-tab {
      margin-right: 0 !important;
      color: #757575;
    }
    .ant-tabs-tab:hover {
      color: #757575;
    }
    .ant-tabs-tab:nth-child(1) {
      border-top-left-radius: 5px;
    }
    .ant-tabs-tab:nth-child(2) {
      border-top-right-radius: 5px;
    }
    .ant-tabs-tab-active {
      color: #fff !important;
      margin-right: 0 !important;
      background-image: linear-gradient(
        90deg,
        #6577c8 0%,
        #79b8f1 100%
      ) !important;
    }
  } */
  .exchangeActivities {
    background-color: #fff;
    border-radius: 10px;
    border-top-left-radius: 0;
    padding: 20px;
    overflow: hidden;
    .ant-table-wrapper {
      margin-top: 20px;
    }
  }
  .advertisingCreative {
    background-color: #fff;
    border-radius: 10px;
    border-top-left-radius: 0;
    padding: 20px;

    .creativity,.productionIdeas {
      .creativeType{
        width: 95%;
        // height: 40px;
        // line-height: 40px;
        display: flex;
        .ant-radio-button-wrapper{
          flex: 1;
          // height: 40px;
          // line-height: 40px;
          text-align: center;
        }
        /* & .ant-radio-button-wrapper:first-child{
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }
        & .ant-radio-button-wrapper:last-child{
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }
        .ant-radio-button-wrapper:hover{
          color: #000;
        }
        .ant-radio-button-wrapper-disabled:hover {
          color: rgba(0, 0, 0, 0.25);
        }
        .ant-radio-button-wrapper-checked{
          background-color: #6577c8;
          color: #fff;
          border-color: #6577c8;
        } */
      }
      .materialType {
        width: 90%;
        display: flex;
        .ant-radio-button-wrapper{
          flex: 1;
          // height: 35px;
          // line-height: 35px;
          text-align: center;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
        /* .ant-radio-button-wrapper:hover {
          color: #000;
        }
        .ant-radio-button-wrapper-checked {
          color: #fff;
          background-color: #6577c8;
          border-color: #6577c8;
        }
        .ant-radio-button-wrapper-checked:hover {
          color: #fff;
        } */
      }
      .thirdParty{
        width: 90%;
        border: 1px solid #d9d9d9;
        border-top: none;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        padding: 20px;
        padding-top: 0;
        .mainBody{
          display: flex;
            .headerLinks{
              margin-top: 50px;
              .topHalf{
                width: 15px;
                height: 30px;
                border: 1px solid #d9d9d9;
                border-bottom: none;
                border-right: none;
              }
              .middleImage{
                position: relative;
                width: 20px;
                height: 16px;
                margin: 5px 0;
                color: #6577c8;
                .linkIcon{
                  position: absolute;
                  left: -6px;
                }

              }
              .secondHalf{
                width: 15px;
                height: 30px;
                border: 1px solid #d9d9d9;
                border-top: none;
                border-right: none;
              }
            }
            .content_Third_Party{
              flex: 1;
              .third_Party_URL{
                margin-top: 0;
                .ant-form-item{
                  margin-top: 10px;
                  margin-bottom: 10px;
                  .ant-form-item-label{
                    white-space: nowrap;
                  }
                  .ant-form-item-control{
                    flex: 1;
                  }
                  .ant-input{
                    width: 100%;
                  }
                }
              }
            }
        }
        .continues{
          display: flex;
          justify-content: right;
        }
      }
      .ant-select-single.ant-select-show-arrow .ant-select-selection-item {
              color: #fff;
            }
      .ant-select {
          // height: 35px;
          // line-height: 35px;
          margin-bottom: 16px;
          // border: none;
          .ant-select-selector{
            // height: 35px;
            // line-height: 35px;
            // border-radius: 5px;
            // border: none;
            // background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
            // color: #fff;
            // &:hover{
            // border-color: #827af3;
            // }
            // &:focus{
            //     border-color: #827af3;
            // }
            // .ant-select-selection-item{
            //   line-height: 35px;
            // }
            // .ant-select-selection-placeholder{
            //     color: #fff;
            //     line-height: 35px;
            // }
            // .ant-select-arrow{
            //     .ant-select-suffix{
            //         color: #fff;
            //     }
                
            // }
            // .anticon{
            //   color: #fff!important;
            // }
        }
      
        // .anticon{
        //       color: #fff!important;
        //     }
      }
      
      h1 {
        font-size: 16px;
      }

      .productionIdeas {
        width: 150px;
        // height: 35px;
        // background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
        // border: none;
        // border-radius: 0.1rem;
        margin-bottom: 16px;
      }
      .creativeContent {
        display: flex;
        justify-content: space-between;
        .creativekOption {
          width: 50%;
          padding-right: 16px;
          .ant-form {
            margin-left: 20px;
            margin-top: 30px;
            .ant-form-item {
              margin-top: 5px;
              .Customization{
                display: flex;
                align-items: center;
                margin-top: 8px;
                .addSizeList{
                    margin-left: 8px;
                }
            }
              .ant-form-item-label {
                margin-right: 16px;
              }
              .ant-form-item-required::before{
                  display: none!important;
              }
              .ant-form-item-required::after{
                  display: inline-block;
                  content: "*";
                  color: red;
                  margin-left: 4px;
              }
              .ant-upload-list-item {
                display: none;
            }
              .ant-upload.ant-upload-drag{
                width: 90%;
                margin-bottom: 10px;
                height: 225px;
                border: 1px solid #d9d9d9;
                border-top: none;
                border-top-left-radius: 0px;
                border-top-right-radius: 0px;
                // border-radius: 10px;
              }
              .ant-input {
                width: 90%;
                // height: 40px;
              
              }
              .previewMaterial{
                width: 90%;
                height: 245px;
                border: 1px solid #d9d9d9;
                border-radius: 10px;
                margin-bottom: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                .typeImages{
                  height: 2.25rem;
                  width: 4rem;
                  background-color: #000;
                  .typeImage{
                    height: 2.25rem;
                    width: 4rem;
                    object-fit: contain;
                  }
                }
                .materialClose{
                  display: inline-block;
                  width: 20px;
                  height: 20px;
                  line-height: 20px;
                  background-color: #fff;
                  text-align: center;
                  position: absolute;
                  border-radius: 50%;
                  top: 0px;
                  right: 44px;
                  font-size: 16px;
                  color: #ff4d4f;
                }
                
              }
              .materialSelection {
                width: 70%;
              }
              .selection {
                
                height: 35px;
                background-color: #3f414d;
                border: none;
                border-radius: 0.1rem;
              }
              .saves {
                width: 160px;
                // height: 40px;
              }
              .cancellation {
                width: 100px;
                // height: 40px;
                margin-left: 16px;
              }
            }
            .footerbtn {
              margin-top: 40px;
            }
          }
          .creativeSizeSelect.ant-select-show-arrow .ant-select-selection-item{
            color: #333!important;
          }
          .creativeSizeSelect{
              width: 70%;
              margin-bottom: 0;
            //   .ant-select-selector {
            //       // border-radius: 17px;
            //       color: #333;
            //       height: 35px;
            //       align-items: center;
            //       line-height: 35px;
            //       border: 1px solid #d9d9d9;
            //       background-image: none;
            // }
            
          }
          .templateSelect{
            width: 70%!important;
          }
        }
        .creativePreview {
          width: 50%;
          height: 680px;
          background-color: #eaf5ff;
          padding: 20px;
          margin-top: 37px;
          .preview {
            display: flex;
            width: 100%;
            height: 100%;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            .previewbtn {
              width: 100px;
              height: 30px;
            }
          }
          .refreshPreview {
            display: inline-block;
            vertical-align: middle;
            .refresh {
              margin-right: 60px;
            }
          }
          .div-foot{
              display: flex;
              justify-content: center;
              align-items: center;
          }
          .materialPreview_cont {
            height: 550px;
            position: relative;
            .images{
              width: 5rem;
              height: 2.8125rem;
              background-color: #000;
              display: flex;
              justify-content: center;
              img{
                object-fit: contain;
              }
            }
            .changevw{
              width: 5rem;
              height: 2.8125rem;
              position: absolute;
              top:50%;
              left: 50%;
              transform: translateX(-50%) translateY(-50%);
            }
            .Stylechange{
              width: 2.8125rem;
              height: 5rem;
              position: absolute;
              top:50%;
              left: 50%;
              transform: translateX(-50%) translateY(-50%);
            }
            .above {
              border-top-right-radius: 5px;
              border-top-left-radius: 5px;
              box-shadow: #aaa 0px 0px 8px;
              box-sizing: border-box;
              height: 0.7rem;
              width: 4rem;
              padding: 0 0.1rem;
              background-color: #fff;
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: relative;
              .seconds {
                position: absolute;
                right: 0.2rem;
                bottom: -0.4rem;
                display: inline-block;
                color: #fff;
                font-weight: bold;
                font-size: 18px;
              }
              #mute {
                z-index: 999;
                color: white;
                position: absolute;
                left: 0.2rem;
                bottom: -0.4rem;
                display: inline-block;
                font-weight: bold;
                font-size: 18px;
              }
              .title {
                display: flex;
                justify-content: left;
                .ant-image {
                  width: 0.5rem;
                  height: 0.5rem;
                  margin-right: 0.1rem;
                  border-radius: 10px;
                  overflow: hidden;
                }
                div {
                  max-width: 2.2rem;
                  overflow-wrap: break-word;
                  font-weight: 700;
                }
              }
              .downloadBut {
                height: 0.3rem !important;
                width: 1rem !important;
                line-height: 0rem !important;
                text-align: center;
                background-color: #6577c8;
                border-radius: 5px;
                border: none;
              }
            }
            .below {
              box-shadow: #aaa 0px 0px 8px;
              border-bottom-left-radius: 5px;
              border-bottom-right-radius: 5px;
              box-sizing: border-box;
              min-height: 0.6rem;
              width: 4rem;
              padding: 0.1rem;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              background-color: #fff;
              align-items: flex-start;
              .belowTitle {
                width: 3.8rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 700;
              }
              .belowText {
                width: 3.8rem;
                margin-top: 0.05rem;
                overflow-wrap: break-word;
              }
            }

            p {
              margin-bottom: 0.24rem;
              font-weight: bold;
            }
            .el-button--success {
            }
            .replay {
              position: absolute;
              left: 50%;
              top: 80%;
              transform: translateX(-50%) translateY(-50%);
              width: 0.3rem;
              height: 0.3rem;
              line-height: 0.3rem;
              text-align: center;
              font-size: 0.22rem;
              border-radius: 50%;
              background-color: rgba(255, 255, 255, 0.5);
              display: none;
              color: #fff;
            }
          }
        }
      }
      .footerbottom {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        .saves {
          width: 180px;
          // height: 40px;
        }
      }
    }
  }
}
.events {
  background-color: #fff;
  .dividingLine {
    margin-bottom: 0px;
  }
  // .ant-radio-checked {
  //   .ant-radio-inner {
  //     border-color: #6475c7;
  //   }
  //   .ant-radio-inner::after {
  //     background-color: #6475c7;
  //   }
  // }
  .promotion {
    h1 {
      font-size: 18px;
    }
    .ant-select-selector {
      // border-radius: 8px!important;
      // height: 35px;
      align-items: center;
      // line-height: 35px;
      // background-color: #eaf5ff!important;
      // border-color: #eaf5ff!important;
      // .ant-select-selection-placeholder {
      //   color: #757575;
      // }
      // &:hover {
      //   border-color: #827af3;
      // }
      // &:focus {
      //   border-color: #827af3;
      // }
      // .ant-select-selection-overflow {
      //   height: 35px;
      //   .ant-select-selection-overflow-item {
      //     align-self: unset;
      //   }
      // }
    }
    .Information {
      display: flex;
      justify-content: left;
      align-items: center;
      width: fit-content;
      padding: 20px;
      border-radius: 10px;
      min-width: 450px;
      max-width: 700px;
      box-shadow: #aaa 3px 3px 8px;
      // .ant-image-img {
      //   border-radius: 10px;
      // }
      .description {
        display: flex;
        height: 50px;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 15px;
        min-width: 400px;
        max-width: 500px;
        .app_title{
          white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .app_platform {
          display: flex;
          justify-content: space-between;
          min-width: 200px;
          p{
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
  .eventContent {
    h1 {
      font-size: 18px;
    }
    .ant-radio-wrapper {
      margin-right: 50px;
    }
    .promotionName {
      /* display: flex;
      justify-content: left;
      align-items: flex-start;
      flex-wrap: wrap;
      margin-bottom: 20px;
      margin-left: 16px;
      p {
        width: 125px;
        margin-bottom: 0 !important;
        text-align: right;
        span {
          color: red;
        }
      }
      .div {
        margin-left: 16px;
        .hlpromotion,.campaignPrice {
          width: 350px;
        }
        .campaignPrice{
          width: 120px;
        }
      }
      .ant-radio-wrapper{
        line-height: 32px;
      }
      .timeZones {
        display: inline-block;
        margin-left: 8px;
        color: #ccc;
      } */
    }
    .uniformSpeed {
      display: flex;
      justify-content: left;
      align-items: unset;
      flex-wrap: wrap;
      margin-bottom: 16px;
      margin-left: 16px;
      p {
        width: 125px;
        margin-bottom: 0 !important;
        text-align: left;
        margin-top: 5px;
        span {
          color: red;
        }
      }
      .div {
        margin-left: 16px;
        .displayTimes {
          width: 195px;
        }
        .uniform {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          .note {
            color: transparent;
          }
          .doubt {
            display: inline-block;
            width: 14px;
            height: 14px;
            line-height: 20px;
            vertical-align: middle;
            background: url("//console-style.hl.com/images/dspcom/normal_u109.svg")
              no-repeat;
            background-size: 14px 14px;
          }
          .doubt:hover {
            background: url("//console-style.hl.com/images/dspcom/normal_u110.svg")
              no-repeat;
            background-size: 14px 14px;
          }
          .ant-radio-input {
            width: 20px;
          }
          .ant-checkbox {
            margin-left: 24px;
          }
        }
      }
    }

    .ant-col-5{
      align-self: flex-start;
      flex: 0 0 125px;
      margin-right: 16px;
    }

    /* .ant-radio-group{
      display: flex;
    } */

    .ant-form-horizontal .ant-form-item-label{
      width: 125px;
      margin-right: 16px;
    }

    .ant-form label{
      height: 32px;
      line-height: 32px;
    }

    .ant-radio-wrapper{
      .ant-row{
          display: inline-block;
      }
    }

    .ant-radio-wrapper .ant-row{
      margin-bottom: 0;
    }

    .timeZones {
      margin-left: 8px;
    }
  }
  .selectAdUnit {
    h1 {
      font-size: 18px;
      span {
        color: red;
      }
    }
    .selectBtn {
      height: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .adList {
      .adBtn {
        display: flex;
        justify-content: left;
        margin-bottom: 20px;
        .select {
          margin-right: 16px;
        }
        .dangers {
          width: 120px;
        }
      }
    }
  }
  .advancedPositioning {
    .ant-collapse {
      // background-color: #fff;
      // .ant-collapse-item {
      //   border: none;
      // }
      // .ant-collapse-header {
      //   padding-left: 0;
      //   .anticon-down {
      //     font-size: 16px;
      //     font-weight: 700;
      //   }
      // }
      // .ant-collapse-content-box {
      //   padding-bottom: 25px;
      // }
      .language {
        display: flex;
        justify-content: left;
        p:nth-child(1) {
          width:120px;
          margin-right: 40px;
          margin-bottom: 0;
        }
        p:nth-child(2) {
          margin-bottom: 0;
          max-width: 250px;
          min-width: 250px;
          word-break:break-all;
        }
        .selectLanguage {
          width: 100px;
          margin-right: 16px;
        }
      }
      .audienceCharacteristics {
        display: flex;
        justify-content: left;
        margin-top: 20px;
        
        & > p {
          width:120px;
          margin-right: 40px;
          margin-bottom: 0;
        }
        .selected {
          display: flex;
          align-items: center;
          max-width: 250px;
          flex-wrap: wrap;
          p {
            max-width: 250px;
            min-width: 250px;
            margin-bottom: 0;
          }
        }
        .selectCharacteristics {
          width: 100px;
          margin-right: 16px;
          
        }
      }
      .paidUsers {
        display: flex;
        justify-content: left;
        margin-top: 20px;
        p {
          width:120px;
          margin-right: 40px;
        }
      }
    }
  }
  .bottoms {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    .continue {
      width: 250px;
      // height: 40px;
    }
    .cancellation {
      width: 150px;
      // height: 40px;
      margin-left: 16px;
    }
  }
}

.open {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url("//console-style.hl.com/images/dspcom/normal_u420.svg")
    no-repeat;
  background-size: 20px 20px;
}
.pause {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url("//console-style.hl.com/images/dspcom/normal_u419.svg")
    no-repeat;
  background-size: 20px 20px;
}
</style>