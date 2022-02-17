<template>
    <div class="createProduction" ref="createProduction">
        <div class="creativity" v-show="!showCreative">
            <h1>{{$t('newCampaign.creative')}}</h1>
            <a-button type="primary" class="btn-bgColor" style="margin-bottom:10px;width:150px" @click="openCreative">{{$t('newCampaign.addCreative')}}</a-button>
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
                        <a-button type="link" size="small" @click="clickActive({All:props.record,type:props.record.state=='1'?'0':'1'})">
                            {{props.record.state=="1"?$t('newCampaign.inActive'):$t('newCampaign.active')}}
                        </a-button>
                        <a-button type="link" size="small" @click="clickAction_video({id:props.record.id,type:props.record.type})"
                            v-if="props.record.type=='banner'&&features.ALLOW_ACCESS_ADD_BANNER_CREATIVE||props.record.type=='interstitial'&&features.ALLOW_ACCESS_ADD_INTERSTITIAL_CREATIVE||props.record.type=='stimulate'&&features.ALLOW_ACCESS_ADD_MOTIVATIONAl_VIDEOS_REATIVE||props.record.type=='video'&&features.ALLOW_ACCESS_ADD_VAST_CREATIVE"
                        >
                            {{$t('newCampaign.edit')}}
                        </a-button>
                        <a-button type="link" size="small" danger @click="deleteVideo({ids:props.record.id,advertiser_id:props.record.advertiser_id})">
                            {{$t('newCampaign.delete')}}
                        </a-button>
                    </template>
                </a-table-column>
                <template v-slot:empty >
                    <div class="icon-div"><i class="iconfont icon">&#xe635;</i></div>
                    <div class="empty-div">{{$t('newCampaign.noData')}}</div>
                    <div class="empty-div div--margin">{{$t('newCampaign.click')}}<i class='purples' @click="openCreative">+{{$t('newCampaign.addCreative')}}</i></div>
                </template>
            </a-table>
            <div class="footerbottom">
                <a-button type="primary" class="saves btn-bgColor" @click="onDone">{{$t('newCampaign.done')}}</a-button>
            </div>
        </div>
        <h1 v-show="showCreative">{{$t('newCampaign.addCreative')}}</h1>
        <div class="content" v-show="showCreative">
            <div class="content_left">
                <a-radio-group v-model:value="size" @change="creativeTypeChange" button-style="solid">
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
                    :label-col="state.labelCol"
                    labelAlign="left"
                    :colon="false"
                >
                    <a-form-item :label="$t('newCampaign.selectMaterial')" :name="selectMaterialType=='1'?'materialSelection':''">
                        <div v-if="!formCreative.materialSelection">
                            <a-radio-group class="materialType" v-model:value="selectMaterialType" button-style="solid">
                                <a-radio-button value="1">{{$t('DirCusCampaign.LocalUpload')}}</a-radio-button>
                                <a-radio-button value="2">{{$t('DirCusCampaign.ThirdPartyURL')}}</a-radio-button>
                            </a-radio-group>
                            <a-upload-dragger
                                v-if="isMaterialType&&selectMaterialType=='1'"
                                v-model:fileList="formCreative.fileList"
                                :data="imageData"
                                accept='.jpg,.gif,.png,.swf,.jpeg'
                                :action="upimageUrl"
                                :beforeUpload="imageBeforeUpload"
                                @change="handleChange"
                                :showUploadList="false"
                            >
                                <p class="ant-upload-text">
                                    {{$t('newCampaign.uploadMaterial')}}<a-button class="shisu_btn--notPadding" type="link">{{$t('newCampaign.uploadMaterials')}}</a-button>
                                </p>
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
                                :showUploadList="false"
                            >
                                <p class="ant-upload-text">{{$t('newCampaign.uploadMaterial')}}<a-button class="shisu_btn--notPadding" type="link">{{$t('newCampaign.uploadMaterials')}}</a-button></p>
                                <p class="ant-upload-hint">({{$t('newCampaign.scale')}}：16:9/9:16,{{$t('newCampaign.duration')}}：5s~60s)</p>
                            </a-upload-dragger>
                            <div class="thirdParty" v-show="selectMaterialType=='2'">
                                <div class="mainBody">
                                    <div class="headerLinks">
                                        <div class="topHalf"></div>
                                        <div class="middleImage">
                                            <DisconnectOutlined class="linkIcon"/>
                                        </div>
                                        <div class="secondHalf"></div>
                                    </div>
                                    <div class="content_Third_Party">
                                        <a-form
                                            ref="third_Party_URL"
                                            layout="vertical"
                                            class="third_Party_URL"
                                            :model="thirdPartyURL"
                                            :rules="rules"
                                            :label-col="state.labelCol"
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
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
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
                        <a-button type="link" @click="selectMaterial">{{$t('newCampaign.materialLibrary')}}</a-button>
                    </a-form-item>

                    <a-form-item ref="name" :label="$t('newCampaign.creativeName')" name="creativeName">
                        <a-input v-model:value="formCreative.creativeName" autoComplete="off"/>
                    </a-form-item>

                    <a-form-item ref="logoFileList" :label="$t('DirCusCampaign.BrandLogo')" v-if="size=='4'" name="logoFileList">
                        <a-upload
                            v-model:value="formCreative.logoFileList"
                            accept='.jpg,.gif,.png,.swf,.jpeg'
                            :data="imageData"
                            list-type="picture-card"
                            class="avatar-uploader"
                            :show-upload-list="false"
                            :action="upimageUrl"
                            :beforeUpload="imageBeforeUpload"
                            @change="logoHandleChange"
                        >
                            <img v-if="formCreative.logoImageUrl" :src="formCreative.logoImageUrl" style="height:72px;width:72px;object-fit:cover;"/>
                            <div v-else>
                                <LoadingOutlined v-if="logoLoading"/>
                                <PlusOutlined v-else/>
                            </div>
                        </a-upload>
                        <div class="logo">
                            <p>{{$t('DirCusCampaign.CTUTBL')}}</p>
                            <p>{{$t('DirCusCampaign.RSOSMA')}}</p>
                            <a-button type="link" @click="showMaterialLogo=true">{{$t('newCampaign.materialLibrary')}}</a-button>
                        </div>
                    </a-form-item>

                    <a-form-item ref="name" :label="$t('newCampaign.headline')" name="creativeTitle" v-if="motivationalVideos">
                        <a-input v-model:value="formCreative.creativeTitle" />
                    </a-form-item>

                    <a-form-item ref="name" :label="$t('newCampaign.description')" name="advertisingSlogan" v-if="motivationalVideos">
                        <a-input v-model:value="formCreative.advertisingSlogan"/>
                    </a-form-item>

                    <a-form-item :label="$t('DirCusCampaign.ButtonText')" v-if="size=='4'" name="buttonText">
                        <a-select class="creativeSizeSelect templateSelect" v-model:value="formCreative.buttonText">
                            <a-select-option v-for="(value,index) in buttonTextList" :value="value" :key="index">{{value}}</a-select-option>
                        </a-select>
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
                    </a-form-item>

                    <a-form-item v-if="creativeBannerSize" :label="$t('newCampaign.creativeSize')" name="creativeSize">
                        <a-select v-model:value="formCreative.creativeSize" :placeholder="$t('newCampaign.creativeSize')" class="creativeSizeSelect" @change="creativeSizeChange" :disabled="size=='1'" >
                            <a-select-option value="320*50" >{{'320*50'}}</a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item ref="click_url" :label="$t('DirCusCampaign.LandingPageURL')" name="click_url">
                        <a-input v-model:value="formCreative.click_url"/>
                    </a-form-item>
                    
                    <a-form-item class="form_footerBtn" :wrapper-col="{ span: 14, offset: 8 }">
                        <a-button type="primary" @click="addCreativity">{{$t('newCampaign.save')}}</a-button>
                        <a-button @click="cancelCreativity">{{$t('newCampaign.cancels')}}</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div class="content_right">
                <h1>{{$t('newCampaign.creativePreview')}}</h1>
                <a-button v-show="!showPreview"  @click="refreshPreview">{{$t('newCampaign.refreshPreview')}}</a-button> 
                <a-spin :spinning="iframeLoading">   
                    <div class="div-iframe" v-show="!showPreview">
                        <iframe
                            :class="[!changevw&&size=='1' ? 'Stylechange-banner' :  changevw ? 'changevw' : 'Stylechange']"
                            scrolling="no"
                            ref="previews"
                            v-if="motivationalVideoUrl"
                            :key="motivationalVideoUrl"
                            :src="motivationalVideoUrl"
                            width="100%"
                            height="100%"
                            allowFullScreen="true"
                            webkitallowfullscreen="true"
                            mozallowfullscreen="true"
                            style="
                                border: none;
                                overflow: hidden;
                                border: 1px solid #e5e5e5;
                            "
                            >
                        </iframe>
                    </div>
                </a-spin>
                <div class="div-btn" v-show="showPreview">
                    <p>{{$t('newCampaign.checkCreative')}}</p>
                    <a-button type="primary" @click="openPreview">{{$t('newCampaign.preview')}}</a-button>
                </div>
                <div class="div-foot" v-show="!showPreview">
                    <a-radio-group v-model:value="changevw" button-style="solid">
                        <a-radio-button :value="true">{{$t('DirCusCampaign.Landscape')}}</a-radio-button>
                        <a-radio-button :value="false">{{$t('DirCusCampaign.PorTrait')}}</a-radio-button>
                    </a-radio-group>
                </div>
            </div>
        </div>
        <a-modal
            :getContainer="()=>$refs.createProduction"
            v-model:visible="showMaterial"
            class="materialBox"
            :footer="false"
            :title="$t('newCampaign.selectMaterial')"
            :width="1000"
        >
            <SourceList
                v-if="showMaterial"
                :iconIndex="iconIndex"
                :app_id="app_id"
                @selectSources="selectSources"
                :advertiser_id="advertiser_id"
                :size="size"
                :publisher_id="publisher_id"
                :member_id="member_id"
                :materialType="materialType"
                :module_type="2"
            ></SourceList>
        </a-modal>
        <a-modal
            :getContainer="()=>$refs.createProduction"
            v-model:visible="showMaterialLogo"
            class="materialBox"
            :footer="false"
            :title="$t('newCampaign.selectMaterial')"
            :width="1000"
        >
            <SourceList
                v-if="showMaterialLogo"
                :iconIndex="iconIndex"
                :app_id="app_id"
                @selectSources="selectLogoSources"
                :advertiser_id="advertiser_id"
                :size="size"
                :publisher_id="publisher_id"
                :member_id="member_id"
                materialType="image"
                :module_type="2"
            ></SourceList>
        </a-modal>
    </div>
</template>

<script>
    import store from "@/store";
    import { defineComponent, reactive, ref, toRaw } from 'vue';
    import { mapGetters, useStore } from "vuex";
    import { message } from 'ant-design-vue';
    import { useI18n } from 'vue-i18n';
    import SourceList from "../APP/sourceList"; //素材列表组件
    import {
        CloseCircleOutlined,
        PlusOutlined,
        DisconnectOutlined,
        LoadingOutlined,
        ExclamationCircleOutlined,
    } from "@ant-design/icons-vue";

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    export default defineComponent({
        components: {
            SourceList,
            CloseCircleOutlined,
            PlusOutlined,
            DisconnectOutlined,
            LoadingOutlined,
            ExclamationCircleOutlined
        },
        setup() {

            const { t } = useI18n()

        /* -------------------------------ref---------------------------- */
            const formRef = ref();
            const creativeType = ref('a');
            const changevw = ref(true);
        /* -----------------------------reactive------------------------- */
            const formCreative = reactive({
                creativeName: "",
                creativeTitle: "",
                advertisingSlogan: "",
                maximumNumber: "",
                materialSelection: "",
                creativeSize:'320*50',
                leftSize:"",
                rightSize:"",
                addSizeList:false,
                creativeWidth:"320",
                creativeHeight:"50",
                creativeTemplate:undefined,
                fileList:[],
                click_url:'',
                logoImageUrl:null,
                buttonText:'View Details',
                logoFileList:null,
            });
            const state = reactive({
                labelCol: {span: 5},
                wrapperCol: {span: 14},
                other: '',
            })

            const thirdPartyURL=reactive({
                insecureUrl:"",
                securityUrl:""
            })

            const validatorurl = async (rule, value) => {
                let rex = new RegExp("^[0-9]*$");
                if (value && value.lenght > 8) {
                    return Promise.reject(t('newCampaign.maxPosition'));
                } else if (value && !rex.test(value)) {
                    return Promise.reject(t('newCampaign.pleaseNumber'));
                } else {
                    return Promise.resolve();
                }
            };

            const validatorUrl = async (rule, value) => {
                let rex = new RegExp(
                    "(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]"
                );
                if (!value) {
                    return Promise.reject(t('myApp.ContentEmpty'));
                }
                if (!rex.test(value)) {
                    return Promise.reject(t('myApp.correctAddress'));
                } else {
                    return Promise.resolve();
                }
            };

            const insecureUrl = async (rule, value) => {
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

            const securityUrl = async (rule, value) => {
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

            const imgURL = async (rule, value) => {
                console.log('------------');
                if (formCreative.logoImageUrl==null) {
                    console.log('909090');
                    return Promise.reject(t('DirCusCampaign.PleaseSelectBrandLogo'));
                } else {
                    console.log("80808080");
                    return Promise.resolve();
                }
            };

            const rules = {
                /* logoFileList:[
                    { required: true, message: t('DirCusCampaign.PleaseSelectBrandLogo'), trigger: ["blur","change"], type:"any" }
                ], */
                logoFileList:[
                    { required: true, validator:imgURL, trigger: ["blur","change"], type:"any" }
                ],
                buttonText:[
                    { required: true, message: t('DirCusCampaign.PleaseSelectButtonText'), trigger: ["blur","change"] }
                ],
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
                ],
                click_url:[
                    { required: true, validator: validatorUrl, trigger: ["blur","change"] }
                ]
            };
        /* -----------------------------function------------------------- */

            const resetForm = () => {
                formRef.value.resetFields();
            };

            return {
                imgURL,
            /* -------ref------- */
                formRef,creativeType,changevw,
            /* -----reactive---- */
                state,formCreative,rules,thirdPartyURL,
            /* -----function---- */
                resetForm
            }
        },
        data(){
            return{
                isMaterialType:true,
                size:"1",
                ismaterial:false,
                upimageUrl:`/creative/hosted-creative-upload`,
                uploadUrl:"/creative-ui/api/creative-upload",
                imageData:{},
                videoData:{},
                motivationalVideos:false,
                creativeTemplateList:[],
                creativeSizeList:[],
                creativeBannerSize:true,
                features: "",
                isCreative: false,
                motivationalVideoUrl:"",
                sources: {},
                logoSources:{},
                materialType:"",
                showPreview: true,
                iconIndex: 6,
                showMaterial:false,
                showCreative: false,
                Creative_url: [],
                app_id:'',
                advertiser_id:'',
                member_id:'',
                publisher_id:'',
                creative_id:'',
                campaign_id:'',
                preview: {
                    app_name: "",
                    app_image: "",
                    app_store: "",
                    video_url: "",
                    title: "",
                    content: ""
                },
                app_store: "",
                Creative_ids: [],
                advertiser_id_delete: "",
                buttonTextList:[
                    'View Details',
                    'Registation',
                    'Buy Now',
                    'Download',
                    'Learn More',
                    'Experience'
                ],
                selectMaterialType:"1",
                materialHeight:'',
                materialWidt:'',
                logoLoading:false,
                showMaterialLogo:false,
                iframeLoading:false,
            };
        },
        computed: {
            ...mapGetters({
                userInfo: "User/getUser"
            })
        },
        created() {
            this.features = useStore().state["User"].userAccessControl;
            const { t } = useI18n();
            this.thirdPartyURL.insecureUrl="";
            this.thirdPartyURL.securityUrl="";
            this.campaign_id=this.$route.query.keyWord;
            this.getPlacementSize();
            this.getTemplate(1);
            this.getSingleDirectCampaign(this.campaign_id);
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
        },
        mounted(){
            if(this.campaign_id=='-1'){
                this.openCreative();
            }else{
                if(this.$route.query.tag!='-1'){
                    console.log(this.$route.query.tag);
                    this.clickAction_video({id:this.$route.query.tag})
                }
            }
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
            }
        },
        methods: {
            continueThirdParty(e){
                this.$refs.third_Party_URL.validate().then(() => {
                    this.formCreative.materialSelection=this.thirdPartyURL.insecureUrl;
                    this.sources.cdn_secure_url=this.thirdPartyURL.securityUrl;
                    this.sources.cdn_url=this.thirdPartyURL.insecureUrl;
                    this.sources.file_name=this.thirdPartyURL.insecureUrl;
                    this.sources.mediaType=this.size=='1'||this.size=='3'?'image':'video';
                    console.log(this.sources.cdn_secure_url,this.sources.cdn_url);
                })
            },
            creativeTypeChange(e){
                console.log(e.target.value);
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
                /* this.formCreative.creativeSize=undefined;   */ 
                this.formCreative.creativeTitle="";
                this.formCreative.advertisingSlogan="";
                // }
                this.delMaterial();
                this.showPreview=true; 
            },
            onDone(){
                this.$router.push('/hl/DirectCustomer');
            },
            delMaterial(){
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
            getSingleDirectCampaign (campaign_id){
                let data={
                    campaign_id	
                };
                store.dispatch("Util/Loading", true);
                this.$req.getSingleDirectCampaign(data).then(res=>{
                    console.log(res);
                    this.app_id=res.data.data.direct_id;
                    this.advertiser_id=res.data.data.advertiser_id;
                    this.member_id=res.data.data.member_id;
                    this.publisher_id=res.data.data.publisher_id;
                    this.Creative_url = [];
                    if (res.data.data.creativeInfo.length) {
                        console.log(res.data.data.creativeInfo);
                        res.data.data.creativeInfo.map(v => {
                            console.log(v.creativeDetail.active);
                            v.creativeDetail.state = v.creativeDetail.active;
                            v.creativeDetail.type=v.creativeDetail.media_subtypes=="1"?"banner":v.creativeDetail.media_subtypes=="5"?"interstitial":v.creativeDetail.media_subtypes=="50"?"video":"stimulate";
                            v.creativeDetail.name = v.creativeDetail.description;
                        });
                        res.data.data.creativeInfo.forEach(v => {
                            this.Creative_url.push(v.creativeDetail);
                        });
                        this.app_store=res.data.data.creativeInfo[0].creativeDetail.click_url;
                    }
                    store.dispatch("Util/Loading", false);
                }).catch(err=>{
                    store.dispatch("Util/Loading", false);
                });
            },
            handleChange (info) {
                let res=info.file.response;
                if (info.file.status === 'done') {
                    console.log(res);
                    if (res.response&&res.response.status === "OK") {
                        if(res.response['media-asset'][0]){
                            let mediAasset_id=res.response['media-asset'][0].id;
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
                                        height:this.materialHeight,
                                        module_type:2
                                    };
                                    this.$req.AddSourceRelation(opts).then(res=>{
                                        if(res.data.code === 200){
                                            this.$message.success(this.$t('newCampaign.uploadMaterialSuccessful'));
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
                                            this.$message.error(res.data.msg)
                                            this.materialWidth="";
                                            this.materialHeight="";
                                        }
                                        store.dispatch("Util/Loading",false);
                                    }).catch(err=>{
                                        this.$message.error(this.$t('newCampaign.uploadMaterialFailed'))
                                        store.dispatch("Util/Loading",false);
                                        this.materialWidth="";
                                        this.materialHeight="";
                                    })  
                                }else{
                                    console.log("2");
                                    this.$message.error(this.$t('newCampaign.uploadMaterialFailed'));
                                    store.dispatch("Util/Loading",false);
                                    this.materialWidth="";
                                    this.materialHeight="";
                                }
                            })
                            .catch(err=>{
                                this.$message.error(this.$t('newCampaign.uploadMaterialFailed'));
                                store.dispatch("Util/Loading",false);
                                this.materialWidth="";
                                this.materialHeight="";
                            })
                        }
                    } else {
                        this.$message.error(this.$t('newCampaign.uploadMaterialFailed'));
                        store.dispatch("Util/Loading",false);
                        this.materialWidth="";
                        this.materialHeight="";
                    }
                } else if (info.file.status === 'error') {
                    this.$message.error(this.$t('newCampaign.uploadMaterialFailed'));
                    store.dispatch("Util/Loading",false);
                    this.materialWidth="";
                    this.materialHeight="";
                }
            },
            logoHandleChange (info) {
                let res=info.file.response;
                console.log(res);
                console.log(this.formCreative.logoFileList);
                console.log(info);
                if (info.file.status === 'done') {
                    console.log(res);
                    if (res.response&&res.response.status === "OK") {
                        if(res.response['media-asset'][0]){
                            let mediAasset_id=res.response['media-asset'][0].id;
                            let opt={
                                id:mediAasset_id
                            };
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
                                        height:this.materialHeight,
                                        module_type:2
                                    };
                                    this.$req.AddSourceRelation(opts).then(res=>{
                                        if(res.data.code === 200){
                                            this.$message.success(this.$t('newCampaign.uploadMaterialSuccessful'));
                                            this.logoSources.cdn_secure_url=data.cdn_secure_url;
                                            this.logoSources.cdn_url=data.cdn_url;
                                            this.logoSources.duration_ms=data.media_asset_video?data.media_asset_video.duration_ms:"";
                                            this.logoSources.file_name=data.file_name;
                                            this.logoSources.media_asset_id=data.id;
                                            this.logoSources.mime_type_id=data.mime_type_id;
                                            this.logoSources.size_in_bytes=data.size_in_bytes;
                                            this.logoSources.mediaType=data.asset_type;
                                            this.formCreative.logoImageUrl=data.cdn_secure_url;
                                            this.imgURL();
                                            console.log(this.logoSources);
                                        }else if (res.data.code !== 200){
                                            this.$message.error(res.data.msg)
                                        }
                                        this.$refs.creativity.validateFields('logoFileList');
                                        store.dispatch("Util/Loading",false);
                                        this.materialWidth="";
                                        this.materialHeight="";
                                    }).catch(err=>{
                                        this.$message.error(this.$t('newCampaign.uploadMaterialFailed'))
                                        store.dispatch("Util/Loading",false);
                                        this.materialWidth="";
                                        this.materialHeight="";
                                    })  
                                }else{
                                    console.log("2");
                                    this.$message.error(this.$t('newCampaign.uploadMaterialFailed'));
                                    store.dispatch("Util/Loading",false);
                                    this.materialWidth="";
                                    this.materialHeight="";
                                }
                            }).catch(err=>{
                                this.$message.error(this.$t('newCampaign.uploadMaterialFailed'));
                                store.dispatch("Util/Loading",false);
                                this.materialWidth="";
                                this.materialHeight="";
                            })
                        }
                    } else {
                        this.$message.error(this.$t('newCampaign.uploadMaterialFailed'));
                        store.dispatch("Util/Loading",false);
                        this.materialWidth="";
                        this.materialHeight="";
                    }
                } else if (info.file.status === 'error') {
                    this.$message.error(this.$t('newCampaign.uploadMaterialFailed'));
                    store.dispatch("Util/Loading",false);
                    this.materialWidth="";
                    this.materialHeight="";
                }
            },
            imageBeforeUpload(file){
                console.log(file);                
                let _that=this;
                store.dispatch("Util/Loading",true);
                return new Promise(function(resolve,resject){
                    let name=file.name.slice(0,file.name.length-4);
                    console.log(name);
                    
                    _that.upimageUrl=_that.uploadUrl+"?qqfile="+name;
                    // console.log(this.upimageUrl);
                    let s=/%/g;
                    let str=/[^\u4e00-\u9fa5\u0000-\u00ff]/g;
                    let xhr=file.name.match(str);
                    let doc=file.name.match(s);
                    if(xhr||doc){
                        _that.$message.error(_that.$t('newCampaign.imageName'));
                        store.dispatch("Util/Loading",false);
                        return resject(false);
                    }
                    const isType=['image/png','image/jpg','image/gif','image/swf','image/jpeg'].indexOf(file.type) == -1;
                    if (isType) { 
                        _that.$message.error(_that.$t('newCampaign.imageForamt'));
                        store.dispatch("Util/Loading",false);
                        return resject(false);
                    }
                    const isLt10M = file.size / 1024 / 1024 <= 10;
                    if (!isLt10M) {
                        _that.$message.error(_that.$t('newCampaign.imageSize'));
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
                                    _that.$message.error(_that.$t('newCampaign.imageRatio'));
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
                        _that.$message.error(_that.$t('newCampaign.videoName'));
                        store.dispatch("Util/Loading",false);
                        return resject(false)
                    }
                    const isLt10M = file.size / 1024 / 1024 <= 10;
                    console.log(file.type);
                    
                    let isType=['video/mp4','video/MPEG','video/flv','video/F4V','video/AVI','video/wmv','video/rmvb','video/mov','video/3gpp'].indexOf(file.type) == -1;
                    if (isType) {
                        _that.$message.error(_that.$t('newCampaign.videoForamt'));
                        store.dispatch("Util/Loading",false);
                        return resject(false)
                    }
                    if (!isLt10M) {
                        _that.$message.error(_that.$t('newCampaign.videoSize'));
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
                            _that.$message.error(_that.$t('newCampaign.videoLength'));
                            store.dispatch("Util/Loading",false);
                            return resject(false)
                        }else if(!valid){
                            _that.$message.error(_that.$t('newCampaign.videoRatio'));
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
            addCreativity() {
                /* if(!this.isURL(this.formCreative.click_url)){
                    this.$message.error(this.$t('DirCusCampaign.CheWheTheLanPageIsAWeb'));
                    return;
                } */
                if(!this.formCreative.materialSelection.trim()&&this.selectMaterialType=='2'){
                    this.$refs.third_Party_URL.validate().then(()=>{
                        this.formCreative.materialSelection=this.thirdPartyURL.insecureUrl;
                        this.sources.cdn_secure_url=this.thirdPartyURL.securityUrl;
                        this.sources.cdn_url=this.thirdPartyURL.insecureUrl;
                        this.sources.file_name=this.thirdPartyURL.insecureUrl;
                        this.sources.mediaType=this.size=='1'||this.size=='3'?'image':'video';
                        console.log(this.formCreative.materialSelection);
                    }).catch(error => {
                        console.log("error", error);
                        return;
                    })
                }
                this.$refs.creativity.validate().then(() => {
                    if (!this.isCreative) {
                        if(this.formCreative.creativeSize==this.$t('newCampaign.Customization')&&this.formCreative.leftSize==""||this.formCreative.creativeSize==this.$t('newCampaign.Customization')&&this.formCreative.rightSize==""){
                            this.$message.error(this.$t('newCampaign.pleaseCustomizationSize'));
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
                                    this.createVAST();
                            }
                        }
                    }else{
                        if(this.formCreative.creativeSize==this.$t('newCampaign.Customization')&&this.formCreative.leftSize==""||this.formCreative.creativeSize==this.$t('newCampaign.Customization')&&this.formCreative.rightSize==""){
                            this.$message.error(this.$t('newCampaign.pleaseCustomizationSize'));
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
                }).catch(error => {
                    console.log("error", error);
                    store.dispatch("Util/Loading", false);
                });
            },
            cancelCreativity(){
                this.$confirm({
                    title: this.$t('newCampaign.cancelEdit'),
                    content: this.$t('newCampaign.cancelContent'),
                    okText: this.$t('newCampaign.enter'),
                    cancelText: this.$t('aggregate.cancel'),
                    icon: <ExclamationCircleOutlined  />,
                    onOk:()=>{
                        this.$refs.creativity.resetFields();
                        this.showPreview = false; 
                        this.showCreative = false;
                        this.size=undefined;
                        this.motivationalVideoUrl="";
                    }
                });
            },
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
                    if(this.size=='1'){
                        console.log("1");
                        
                        this.creativeTemplateList.map((v,i)=>{
                            if(v.name==""){
                                this.creativeTemplateList.splice(i,1);
                            }
                        })
                    }
                    if(this.size=='4'){
                        this.creativeTemplateList.map((v,i)=>{
                            if(v.id=="1788"){
                                this.creativeTemplateList.splice(i,1);
                            }
                        })
                    }
                    console.log(this.creativeTemplateList)
                        store.dispatch("Util/Loading", false);
                    }else{
                        store.dispatch("Util/Loading", false);
                    }
                }).catch(error => {
                    this.$message.error(this.$t('newCampaign.unknownError'));
                    store.dispatch("Util/Loading", false);
                });
            },
            getPlacementSize(){
                this.$req.getPlacementSize().then(res=>{
                    console.log(res);
                    if(res.data.code==200){
                        this.creativeSizeList=[];
                        res.data.data.forEach(val=>{
                            this.creativeSizeList.push(`${val.width}*${val.height}`)
                        })
                        this.creativeSizeList.push(this.$t('newCampaign.Customization'));
                    }else{
                        this.$message.error(this.$t('newCampaign.unknownError'));
                    }
                }).catch(error => {
                    this.$message.error(this.$t('newCampaign.unknownError'));
                    store.dispatch("Util/Loading", false);
                });
            },
            replays() {
                var videos = document.querySelector("#video");
                var replay = document.querySelector(".replay");
                videos.play();
                replay.style.display = "none";
            },
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
            creativeTemplateChange(e,b){
                console.log(e,b);
                if(b.key){
                    this.creativeTemplate_id=b.key;
                }
            },
            createCreative(){
                let opt ={
                    module_type:2,
                    app_id:this.app_id,
                    advertiser_id:this.advertiser_id,
                    creative_name:this.formCreative.creativeName.trim(),
                    media_url:this.sources.cdn_url,
                    daily_budget_imps:this.formCreative.maximumNumber,
                    media_url_secure:this.sources.cdn_secure_url,
                    media_asset_id:this.sources.media_asset_id,
                    click_url:this.formCreative.click_url,
                    type:this.size=="1"?"creative-banner":this.size=="3"?"creative-inter":"creative-stimulate",
                    file_name: this.formCreative.materialSelection.trim(),
                    width:this.formCreative.creativeWidth?this.formCreative.creativeWidth:"",
                    height:this.formCreative.creativeHeight?this.formCreative.creativeHeight:"",
                    add_size:this.formCreative.addSizeList?1:0,
                    template_id:this.formCreative.creativeTemplate,
                    creative_title: this.size=='4'?this.formCreative.creativeTitle.trim():"",
                    creative_description: this.size=='4'?this.formCreative.advertisingSlogan.trim():"",
                    media_type:this.selectMaterialType=='1'?'native':"third-party",
                    brand_icon:this.size=='4'?this.logoSources.cdn_secure_url:null,
                    button_text:this.size=='4'?this.formCreative.buttonText:null
                }
                console.log(this.sources);
                store.dispatch("Util/Loading", true);
                this.$req.BannerCreative(opt).then(res => {
                    if (res.data.code === 200) {
                        // this.saveCampaignDisable=true
                        //this.$message.success(this.$t('newCampaign.createCreativeSuccessful'));
                        let data = res.data.data;
                        console.log(res, "素材ID");
                        this.Creative_url.push({
                            url: data["creative-vast"].media_url.replace("http:",window.location.protocol),
                            id: data.id,
                            name: data["creative-vast"].name,
                            state: "1",
                            advertiser_id: data["creative-vast"].advertiser_id,
                            type: data["creative-vast"].type
                        });
                        let data2=[];
                        this.Creative_url.forEach(item => {
                            data2.push({
                                id:item.id
                            })
                        });
                        let opt = {
                            campaign_id: this.campaign_id,
                            creatives: data2
                        };
                        this.$req.directCampaignBindCreative(opt).then(res => {
                            if (res.data.code == 200) {
                                var videos = document.querySelector("#video");
                                if (videos) {
                                    videos.pause();
                                }
                                this.showCreative = false;
                                this.motivationalVideoUrl="";
                                store.dispatch("Util/Loading", false);
                                this.$message.success(this.$t('newCampaign.createCreativeSuccessful'));
                                this.size=undefined;
                                this.getPlacementSize();
                            } else {
                                this.$message.error(this.$t('newCampaign.createCreativeFailed'));
                            }
                        })
                        .catch(err => {
                            store.dispatch("Util/Loading", false);
                            this.$message.error(this.$t('newCampaign.createCreativeFailed'));
                        });
                    } else {
                        this.$message.error(this.$t('newCampaign.unknownError'));
                        store.dispatch("Util/Loading", false);
                    }
                }).catch(res => {
                    // this.$message.error(res.data.msg);
                    this.$message.error(this.$t('newCampaign.unknownError'));
                    store.dispatch("Util/Loading", false);
                });
            },
            createVAST(){
                let data ={
                    module_type:2,
                    advertiser_id:this.advertiser_id,
                    member_id:this.member_id,
                    app_id:this.app_id,
                    media_asset_id:this.sources.media_asset_id?this.sources.media_asset_id:0,
                    duration_ms:this.sources.duration_ms?this.sources.duration_ms:0,
                    size_in_bytes:this.sources.size_in_bytes?this.sources.size_in_bytes:0,
                    ad_title:this.formCreative.creativeName.trim(),
                    daily_budget_imps:this.formCreative.maximumNumber,
                    click_url:this.formCreative.click_url,
                    media_url_secure:this.sources.cdn_secure_url,
                    media_url:this.sources.cdn_url,
                    creative_title: this.formCreative.creativeTitle.trim(),
                    creative_description: this.formCreative.advertisingSlogan.trim(),
                    file_name: this.formCreative.materialSelection.trim()?this.formCreative.materialSelection.trim():0,
                    type:"creative_vast",
                    template_id:"1435",
                    media_type:this.selectMaterialType=='1'?'native':"third-party"
                }
                console.log(1, data);
                store.dispatch("Util/Loading", true);
                this.$req.AddcreateCreative(data).then(res => {
                    if (res.data.code === 200) {
                        //this.$message.success(this.$t('newCampaign.createCreativeSuccessful'));
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
                        let data2=[];
                        this.Creative_url.forEach(item => {
                            data2.push({
                                id:item.id
                            })
                        });
                        let opt = {
                            campaign_id: this.campaign_id,
                            creatives: data2
                        };
                        this.$req.directCampaignBindCreative(opt).then(res => {
                            if (res.data.code == 200) {
                                var videos = document.querySelector("#video");
                                if (videos) {
                                    videos.pause();
                                }
                                this.showCreative = false;
                                this.motivationalVideoUrl="";
                                store.dispatch("Util/Loading", false);
                                this.$message.success(this.$t('newCampaign.createCreativeSuccessful'));
                                this.size=undefined;
                            } else {
                                this.$message.error(this.$t('newCampaign.createCreativeFailed'));
                            }
                        })
                        .catch(err => {
                            store.dispatch("Util/Loading", false);
                            this.$message.error(this.$t('newCampaign.createCreativeFailed'));
                        });
                    } else {
                        this.$message.error(this.$t('newCampaign.unknownError'));
                        store.dispatch("Util/Loading", false);
                    }
                }).catch(res => {
                    this.$message.error(this.$t('newCampaign.unknownError'));
                    // this.$message.error(res.data.msg);
                    store.dispatch("Util/Loading", false);
                });
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
                this.$refs.creativity.validate().then(() => {
                    console.log(this.app_store);
                    var videos = document.querySelector("#video");
                    if(videos){
                        videos.pause();
                    }
                    this.showPreview = false;
                    console.log(this.size,this.sources.cdn_secure_url);

                    console.log(this.app_id);
                    
                    let url=this.sources.cdn_secure_url;

                    console.log(this.sources.cdn_secure_url);

                    if(this.selectMaterialType=='2'){
                        url=this.thirdPartyURL.securityUrl;
                    }
                    
                    if(this.size=="4"){                        
                        this.motivationalVideoUrl = `/ex/api/ex/creativeOnlinePreview?app_id=${this.app_id}&module_type=2&click_url=${this.formCreative.click_url}&video_url=${url}&creative_title=${this.formCreative.creativeTitle.trim()}&creative_dec=${this.formCreative.advertisingSlogan.trim()}&type=creative-stimulate&brand_icon=${this.formCreative.logoImageUrl}&button_text=${this.formCreative.buttonText}`;
                        // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl);
                        this.$nextTick(()=>{
                            this.iframeLoad();
                        })
                    }else if(this.size=="1"){
                        // 横幅
                        this.motivationalVideoUrl = `/ex/api/ex/creativeOnlinePreview?app_id=${this.app_id}&module_type=2&click_url=${this.formCreative.click_url}&video_url=${url}&type=creative-banner`;
                        // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl);
                        this.$nextTick(()=>{
                            this.iframeLoad();
                        })
                    }else if(this.size=="2"){
                        // vast视频creative-vast
                        this.motivationalVideoUrl = `/ex/api/ex/creativeOnlinePreview?app_id=${this.app_id}&module_type=2&click_url=${this.formCreative.click_url}&video_url=${url}&type=creative-vast`;
                        // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl);
                        this.$nextTick(()=>{
                            this.iframeLoad();
                        })
                    }else if(this.size=="3"){
                        // 插页
                        this.motivationalVideoUrl = `/ex/api/ex/creativeOnlinePreview?app_id=${this.app_id}&module_type=2&click_url=${this.formCreative.click_url}&video_url=${url}&type=creative-inter`;
                        // this.$refs.previews.contentWindow.location.replace(this.motivationalVideoUrl);
                        this.$nextTick(()=>{
                            this.iframeLoad();
                        })
                    }
                }).catch(error => {
                    console.log("error", error);
                });
            },
            openCreative() {
                this.formCreative.logoImageUrl=null;
                this.formCreative.buttonText='View Details';
                this.sources.cdn_secure_url=null;
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
                /* this.formCreative.creativeSize='320*50'; */
                console.log(this.showPreview);
                // this.size="1";
                this.$refs.creativity.resetFields();
                // this.motivationalVideos=false;
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
                    this.$req.deleteCreative(opt).then(res => {
                        if (res.data.code == 200) {
                            store.dispatch("Util/Loading", false);
                            this.$message.success(this.$t('newCampaign.deleteSuccessful'));
                        } else {
                            store.dispatch("Util/Loading", false);
                            this.$message.error(res.data.msg);
                        }
                    }).catch(err => {
                        console.log(err);
                        this.$message.error(this.$t('newCampaign.unknownError'));
                        store.dispatch("Util/Loading", false);
                    });
                }
            },
            //修改创意状态
            clickActive(e) {
                if (e.All.state === "1" && e.type === "1") {
                    this.$message.warning(this.$t('DirCusCampaign.IsAlreadyOn'));
                } else if (e.All.state === "0" && e.type === "0") {
                    this.$message.warning(this.$t('DirCusCampaign.IsSuspended'));
                } else {
                    store.dispatch("Util/Loading", true);
                    let opt = {
                        id: e.All.id,
                        active: e.type === "1" ? "1" : "0"
                    };
                    this.$req.changeCreativeStatus(opt).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success(this.$t('newCampaign.editSuccessful'));
                            this.Creative_url.map(item => {
                                if (item.id == e.All.id) {
                                item.state =
                                    e.type === "1" ? (item.state = "1") : (item.state = "0");
                                }
                            });
                            store.dispatch("Util/Loading", false);
                        } else {
                            this.$message.error(this.$t('newCampaign.editFailed'));
                            store.dispatch("Util/Loading", false);
                        }
                    }).catch(err => {
                        this.$message.error(this.$t('newCampaign.unknownError'));
                        store.dispatch("Util/Loading", false);
                    });
                }
            },
            // 编辑创意
            clickAction_video(e) {
                //console.log(e.type);
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
                this.$req.GetCreativeDetail(params).then(res => {
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
                        //this.app_store = data.app_info[0];
                        this.app_store = data.click_url;
                        this.formCreative.creativeName = data.name;
                        this.formCreative.creativeTemplate=data.template.id;
                        this.formCreative.click_url=data.click_url;
                        this.formCreative.logoImageUrl=data.custom_macros.APP_ICON;
                        this.formCreative.buttonText=data.custom_macros.BUTTON_TEXT;
                        this.getTemplate(data.template.media_subtype_id);
                        if(data.template.media_subtype_id=="1"){
                            this.size="1";
                            this.motivationalVideos=false;
                            this.materialType="image";
                            this.creativeBannerSize=true;
                            this.formCreative.creativeTitle = data.custom_macros["CREATIVE_TITLE"];
                            this.formCreative.advertisingSlogan = data.custom_macros["CREATIVE_DEC"];
                            this.formCreative.creativeSize = `${data.width}*${data.height}`;
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
                        this.formCreative.maximumNumber = data.daily_budget_imps;
                        Number(data.daily_budget_imps) == 0? null: Number(data.daily_budget_imps);
                        this.formCreative.materialSelection = data.file_name;
                        store.dispatch("Util/Loading", false);
                    } else {
                        this.$message.error(this.$t('newCampaign.unknownError'));
                        store.dispatch("Util/Loading", false);
                    }
                }).catch(err => {
                    this.$message.error(this.$t('newCampaign.unknownError'));
                    store.dispatch("Util/Loading", false);
                });
            },
            editVAST(){
                console.log('editVAST');
                let data={
                    id: this.creative_id,
                    module_type:2,
                    advertiser_id:this.advertiser_id,
                    member_id:this.member_id,
                    app_id:this.app_id,
                    media_asset_id:this.sources.media_asset_id,
                    duration_ms:this.sources.duration_ms,
                    size_in_bytes:this.sources.size_in_bytes,
                    ad_title:this.formCreative.creativeName.trim(),
                    daily_budget_imps:this.formCreative.maximumNumber,
                    click_url:this.formCreative.click_url,
                    media_url_secure:this.sources.cdn_secure_url,
                    media_url:this.sources.cdn_url,
                    creative_title: this.formCreative.creativeTitle.trim(),
                    creative_description: this.formCreative.advertisingSlogan.trim(),
                    file_name: this.formCreative.materialSelection.trim(),
                    last_modified:this.sources.last_modified,
                    type:"creative_vast",
                    template_id:"1435",
                    media_type:'native'
                }
                store.dispatch("Util/Loading", true);
                console.log(2, data);
                this.$req.PutBannerCreative(data).then(res => {
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
                                item.click_url=this.formCreative.click_url;
                                // item.type=this.Video_type
                            } else {
                                return false;
                            }
                        });
                        let data2=[];
                        this.Creative_url.forEach(item => {
                            data2.push({
                                id:item.id
                            })
                        });
                        let opt = {
                            campaign_id: this.campaign_id,
                            creatives: data2
                        };
                        this.$req.directCampaignBindCreative(opt).then(res => {
                            if (res.data.code == 200) {
                                this.$message.success(this.$t('newCampaign.editSuccessful'));
                                store.dispatch("Util/Loading", false);
                                var videos = document.querySelector("#video");
                                if (videos) {
                                    videos.pause();
                                }
                                this.showCreative = false;
                                this.motivationalVideoUrl="";
                            } else {
                                store.dispatch("Util/Loading", false);
                                this.$message.error(this.$t('newCampaign.editFailed'));
                            }
                        }).catch(err => {
                            store.dispatch("Util/Loading", false);
                            this.$message.error(this.$t('newCampaign.editFailed'));
                        });
                    } else {
                        this.$message.error(this.$t('newCampaign.editFailed'));
                        store.dispatch("Util/Loading", false);
                    }
                }).catch(err => {
                    this.$message.error(this.$t('newCampaign.unknownError'));
                    store.dispatch("Util/Loading", false);
                });
            },
            editCreative(){
                console.log('editCreative');
                let opt ={
                    module_type:2,
                    creative_id:this.creative_id,
                    app_id:this.app_id,
                    advertiser_id:this.advertiser_id,
                    creative_name:this.formCreative.creativeName.trim(),
                    media_url:this.sources.cdn_url,
                    click_url:this.formCreative.click_url,
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
                    media_type:'native',
                    brand_icon:this.size=='4'?this.logoSources.cdn_secure_url:null,
                    button_text:this.size=='4'?this.formCreative.buttonText:null
                }
                this.$req.BannerCreative(opt).then(res => {
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
                                item.click_url=this.formCreative.click_url;
                            // item.type=this.Video_type
                            } else {
                                return false;
                            }
                        });
                        let data2=[];
                        this.Creative_url.forEach(item => {
                            data2.push({
                                id:item.id
                            })
                        });
                        let opt = {
                            campaign_id: this.campaign_id,
                            creatives: data2
                        };
                        this.$req.directCampaignBindCreative(opt).then(res => {
                            if (res.data.code == 200) {
                                this.$message.success(this.$t('newCampaign.editSuccessful'));
                                store.dispatch("Util/Loading", false);
                                var videos = document.querySelector("#video");
                                if (videos) {
                                    videos.pause();
                                }
                                this.showCreative = false;
                                this.motivationalVideoUrl="";
                                this.getPlacementSize();
                            } else {
                                store.dispatch("Util/Loading", false);
                                this.$message.error(this.$t('newCampaign.editFailed'));
                            }
                        }).catch(err => {
                            store.dispatch("Util/Loading", false);
                            this.$message.error(this.$t('newCampaign.editFailed'));
                        });
                    } else {
                        this.$message.error(this.$t('newCampaign.editFailed'));
                        store.dispatch("Util/Loading", false);
                    }
                }).catch(err => {
                    this.$message.error(this.$t('newCampaign.unknownError'));
                    store.dispatch("Util/Loading", false);
                });
            },

            selectLogoSources(e) {
                console.log(e,this.logoSources);

                this.formCreative.logoFileList=e;

                this.logoSources.cdn_secure_url=e.cdn_secure_url;
                this.logoSources.cdn_url=e.cdn_url;
                this.logoSources.duration_ms=e.duration_ms;
                this.logoSources.file_name=e.file_name;
                this.logoSources.media_asset_id=e.media_asset_id;
                this.logoSources.mime_type_id=e.mime_type_id;
                this.logoSources.size_in_bytes=e.size_in_bytes;
                //this.sources.type=e.type;
                this.logoSources.mediaType=e.type;
                this.formCreative.logoImageUrl=e.cdn_url;
                this.showMaterialLogo=false;
                console.log(this.logoSources);


                this.$refs.creativity.validateFields('logoFileList');
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
                //this.sources.type=e.type;
                this.sources.mediaType=e.type;
                this.formCreative.materialSelection = e.file_name;
                this.showMaterial = false;
                console.log(this.formCreative.materialSelection);
                console.log(this.sources);
            },
        }

    });
</script>

<style scoped>
    @import "../../assets/css/index.css";
</style>

<style lang="less">

    .createProduction{
        background-color: #fff;
        border-radius: 0 0 10px 10px;
        padding: 20px;

        .ant-form-item-control-input-content{
           .ant-radio-button-wrapper{
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            } 
        }

        .ant-upload-text{
            font-size: 14px;
        }

        .creativity{
            .purple {
                margin-right: 0px;
            }
            .footerbottom{
                display: flex;
                justify-content:center;
                margin-top: 16px;

                .saves{
                    width: 180px;
                }
            }
        }

        .content{
            display: flex;
            margin: 0 !important;

            h1{
                font-size: 18px;
            }

            .content_left{
                width: 50%;

                .ant-radio-group{
                    display: flex;
                    margin-bottom: 20px;    

                    .ant-radio-button-wrapper{
                        flex-grow: 1;
                        text-align: center;
                    }
                }

                .ant-upload-drag{
                    height: 225px;
                    margin-bottom: 10px;
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                }

                .ant-form-horizontal {

                    .ant-form-item-label{
                        text-align: right;
                        margin-right: 16px;
                    }
                }

                .ant-select{
                    width: 40%;
                }

                .form_footerBtn{
                    width: 480px;
                    margin: 0 auto 20px auto;
                    color: #79b8f1;

                    .ant-btn {
                        width: 100px;
                    }
                    .ant-btn-primary{
                        width: 160px;
                        margin-right: 20px;
                    }
                }

                .previewMaterial{
                    width: 100%;
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
                    right: 90px;
                    font-size: 16px;
                    color: #ff4d4f;
                }

                .ant-upload-select-picture-card{
                    height: 90px !important;
                    width: 90px !important;
                }

                .ant-upload-picture-card-wrapper{
                    width: auto;
                }

                .logo{
                    float: right;
                    width: calc(100% - 98px);

                    p{
                        margin-left: 16px;
                        color: rgba(0, 0, 0, 0.45);
                    }

                    .ant-btn-link{
                        margin-top: 10px;
                    }
                }

                .materialType{
                    margin-bottom: 0;
                }

                .thirdParty{
                    width: 100%;
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
                            margin-right: 16px;
                            .topHalf{
                                width: 15px;
                                height: 35px;
                                border: 1px solid #d9d9d9;
                                border-bottom: none;
                                border-right: none;
                            }
                            .middleImage{
                                position: relative;
                                width: 20px;
                                height: 20px;
                                margin: 5px 0;
                                /* color: #6577c8; */
                                .linkIcon{
                                    position: absolute;
                                    left: -6px;
                                }

                            }
                            .secondHalf{
                                width: 15px;
                                height: 35px;
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
                                .ant-form-item-label-left{
                                    text-align: left;
                                }
                            }
                        }
                        
                    }
                    .continues{
                        display: flex;
                        justify-content: right;
                    }
                }

            }
            
            .content_right{
                width: 45%;
                height: 680px;
                margin-left: 5%;
                background-color: #eaf5ff;
                padding: 20px;

                .div-iframe{
                    position: relative;
                    height: 550px;

                    iframe{
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translateX(-50%) translateY(-50%);
                        background-color: #fff;
                    }

                    .changevw{
                        width: 500px;
                        height:300px;
                    }
                    .Stylechange{
                        width: 300px;
                        height: 500px;
                    }

                    .Stylechange-banner{
                        width: 253px;
                        height:450px;
                    }

                }

                .div-btn{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 550px;

                    .ant-btn-primary{
                        width: 100px;
                        height: 30px;
                    }
                }

                .div-foot{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }

        .open {
            display: inline-block;
            width: 0.2rem;
            height: 0.2rem;
            background: url("//console-style.hl.com/images/dspcom/normal_u420.svg")
                no-repeat;
            background-size: 0.2rem 0.2rem;
        }
        .pause {
            display: inline-block;
            width: 0.2rem;
            height: 0.2rem;
            background: url("//console-style.hl.com/images/dspcom/normal_u419.svg")
                no-repeat;
            background-size: 0.2rem 0.2rem;
        }
        .ant-modal-content{
            padding: 10px 0;
        }

    }
</style>