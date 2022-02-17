<template>
    <div class="materialList" ref="materialList">
        <h1>{{$t('MaterialList.MaterialLibrary')}}</h1>
        <div class="content_input">
            <a-space :size="8">
                <a-input-search
                    v-model:value="searchData.search"
                    :placeholder="$t('MaterialList.NameId')"
                    style="width: 200px"
                    :allowClear='true'  
                />
                <a-select
                    :placeholder="$t('MaterialList.AppOfAffiliation')"
                    ref="select"
                    v-model:value="app_id"
                    style="width: 200px"
                    :allowClear='true'
                >
                    <a-select-option v-if="state.directInfo.direct_id!=null" value="-1">{{$t('MaterialList.DirCus')}}</a-select-option>
                    <a-select-option :value="item.app_id" v-for="item in state.appNameList" :key="item.app_id">{{item.appInfo.app_name}}</a-select-option>
                </a-select>
                <a-select
                    :placeholder="$t('MaterialList.MaterialType')"
                    ref="select"
                    v-model:value="searchData.source_type"
                    style="width: 200px"
                    :allowClear='true'
                >
                    <a-select-option value="image">{{$t('MaterialList.Image')}}</a-select-option>
                    <a-select-option value="video">{{$t('MaterialList.Video')}}</a-select-option>
                </a-select>
                <a-select
                    :placeholder="$t('MaterialList.Tag')"
                    ref="select"
                    v-model:value="searchData.tag"
                    style="width: 200px"
                    :allowClear='true'
                >
                    <a-select-option :value="item" v-for="item in state.sourceTagList" :key="item">{{item}}</a-select-option>
                </a-select>
                <a-button type="primary" @click="onSearch">{{$t('MaterialList.Search')}}</a-button>
            </a-space>
        </div>
        <div class="content_btn">
            <a-space :size="8">
                <a-dropdown :disabled="state.appNameList.length<=0&&state.directInfo.direct_id==null">
                    <template #overlay>
                        <a-menu @click="onShowUploadMaterial">
                            <a-menu-item key="1">
                                {{$t('MaterialList.Image')}}
                            </a-menu-item>
                            <a-menu-item key="2">
                                {{$t('MaterialList.Video')}}
                            </a-menu-item>
                        </a-menu>
                    </template>
                    <a-button type="primary">{{$t('MaterialList.UploadMaterial')}}<DownOutlined /></a-button>
                </a-dropdown>
                <a-button type="primary" danger @click="delBatch" :disabled="state.delList.length<=0">{{$t('MaterialList.Remove')}}</a-button>
            </a-space>
        </div>
        <a-spin :spinning="materialLoading">
        <ul class="content_body">
            <a-checkbox-group v-if="state.sourceList.length>0" v-model:value="state.delList">
                <li v-for="(item,index) in state.sourceList" :key="item.media_asset_id">
                    <div class="content_body_top">
                        <span v-if="item.type=='video'" class="tag-time">{{(item.duration_ms%(1000*60))/1000}}s</span>
                        <a-checkbox class="tag-check" :value="item.media_asset_id"/>
                        <span class="tag-type">{{item.type=='image'?$t('MaterialList.Image'):$t('MaterialList.Video')}}</span>
                        <span :class="{'tag-play-hidden':item.type=='image','tag-play':true}"><PlayCircleOutlined /></span>
                        <div v-if="item.type=='video'" class="mask"></div> 
                        <video
                            :id="item.media_asset_id"
                            v-if="item.type=='video'"
                            :src="item.cdn_secure_url"
                            @mouseover="onPlay(item.media_asset_id,true)"
                            @mouseleave="onPlay(item.media_asset_id,false)">
                        >
                        </video>
                        <a-image
                            v-else
                            class="typeImage"
                            :src="item.cdn_secure_url"
                            fallback="data:image/png;base64,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"
                        />
                    </div>
                    <div class="content_body_center">
                        <div>
                            <a-tooltip>
                                <template #title>{{item.file_name}}</template>
                                <span class="file_name shisu_fontSize-small">{{item.file_name}}</span>
                            </a-tooltip>
                        </div>
                        <div>
                            <a-button type="link" @click="onShowDrawer(item.media_asset_id,index)">{{$t('MaterialList.Details')}}</a-button>
                            <a-dropdown>
                                <a class="ant-dropdown-link" @click.prevent>
                                    <MoreOutlined />
                                </a>
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item>
                                            <a-popconfirm
                                                :title="$t('appMaterial.deleteMaterialContent')"
                                                :ok-text="$t('appMaterial.enter')"
                                                :cancel-text="$t('appMaterial.cancel')"
                                                @confirm="onDelSources(item.media_asset_id)"
                                            >
                                                <a-button type="link" danger>{{$t('MaterialList.Delete')}}</a-button>
                                            </a-popconfirm>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </div>
                    </div>
                    <div v-if="item.app_id!='0'" class="content_body_bottom--app">
                        <a-image
                            class="typeImage"
                            :src="item.app_icon_url"
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                        />
                        <div>
                            <a-tooltip>
                                <template #title>{{item.app_official_name}}</template>
                                <h3 class="shisu_fontSize-small">{{item.app_official_name}}</h3>
                            </a-tooltip>
                            <span class="shisu_fontSize-small">{{item.platform=='0'?'Android':'Ios'}}</span>
                        </div>
                    </div>

                    <div v-else class="content_body_bottom--app">
                        <a-avatar
                            shape="square"
                            style="background-color:#000;vertical-align:middle;margin-left:8px"
                        >
                            直客
                        </a-avatar>
                        <div>
                            <a-tooltip>
                                <template #title>{{item.app_official_name}}</template>
                                <h3 class="shisu_fontSize-small">{{item.app_official_name}}</h3>
                            </a-tooltip>
                            <span class="shisu_fontSize-small">
                                <a-tooltip>
                                    <template #title>{{item.tag}}</template>
                                    <span class="shisu_fontSize-small">{{item.tag}}</span>
                                </a-tooltip>
                                <EditOutlined @click="onShowModify(item.tag,item.media_asset_id)" style="cur"/>
                            </span>
                        </div>
                    </div>
                </li>
            </a-checkbox-group>
            <a-empty v-else :image="simpleImage" />
        </ul>
        </a-spin>
        <a-pagination show-size-changer v-model:current="searchData.page" v-model:pageSize="searchData.num_elements" :total="total" />
        
        <a-modal
            class="uploadModal"
            :getContainer="()=>$refs.materialList"
            v-model:visible="isUploadMaterial" 
            width="800"
            :maskClosable='false'
            @cancel="onCancel"
            :title="$t('MaterialList.UploadMaterial')" 
        >
        <a-spin :spinning="uploadLoading">
            
                <div>
                    {{$t('MaterialList.AppOfAffiliation')}}<span style="color:#f00">*</span>
                    <a-select
                        :placeholder="$t('MaterialList.AppOfAffiliation')"
                        ref="select"
                        v-model:value="upload_appId"
                        style="width: 200px"
                    >
                        <a-select-option v-if="state.directInfo.direct_id!=null" value="-1">{{$t('MaterialList.DirCus')}}</a-select-option>
                        <a-select-option :value="index" v-for="(item,index) in state.appNameList" :key="item.id">{{item.appInfo.app_name}}</a-select-option>
                    </a-select>
                </div>
                <a-upload-dragger
                    v-model:fileList="state.fileList"
                    name="file"
                    :multiple="true"
                    :showUploadList="false"
                    :action="isUploadImg?action_img:action_video"
                    :accept='isUploadImg?accept_img:accept_video'
                    :data="isUploadImg?state.imageData:state.videodata"
                    @change="onUploadFile"
                >
                    <p class="ant-upload-drag-icon">
                        <CloudUploadOutlined />
                    </p>
                    <p class="ant-upload-text">{{$t('MaterialList.ClickUpload')}}</p>
                </a-upload-dragger>
                <el-table
                    :data="state.uploadFileList"
                    style="width: 100%"
                >
                    <el-table-column
                        prop="name"
                        :label="$t('MaterialList.FileName')"
                        style="width: 50%">
                        <template #default="scope">
                            <div style="display:flex;align-items:center;">
                            <a-image
                                class="table_images"
                                :src="state.data[scope.$index].cdn_img_url"
                                fallback="data:image/png;base64,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"
                            />
                            <el-tooltip  effect="dark" :content="scope.row.name" placement="top" :open-delay="200" :enterable="false">
                                <span class="min">{{scope.row.name}}</span>
                            </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('MaterialList.UploadStatus')"
                        style="width: 50%">
                        <template #default="scope">
                            <a-progress :percent="scope.row.percent" :status="scope.row.status=='done'?'success':scope.row.status=='uploading'?'active':'exception'" /> 
                            <DeleteOutlined class="deleteIcon" @click="delFile(scope.$index)"/>
                        </template>
                    </el-table-column>
                    <template v-slot:empty >
                        <div class="empty-div">{{$t('myApp.noData')}}</div>
                    </template>
                </el-table>
            
            
            </a-spin>
            <template #footer>
                <div class="uploadBtn">
                    <a-button key="submit" type="primary" @click="onSubmit">{{$t('MaterialList.Upload')}}</a-button>
                </div>
            </template>
            
        </a-modal>
        
        <a-drawer
            :title="state.sources.app_official_name"
            :getContainer="()=>$refs.materialList"
            placement="right"
            :destroyOnClose="false"
            :closable="false"
            v-model:visible="showDrawer"
            width="850"
        >
            <div class="drawer_header">
                <a-image
                    v-if="state.sources.type=='image'"
                    :width="450"
                    :height="254"
                    :src="state.sources.cdn_secure_url">
                </a-image>
                <video
                    v-else
                    controls
                    autoplay
                    :src="state.sources.cdn_secure_url">
                </video>
                <div class="drawer_header-info">
                    <h2>{{$t('MaterialList.BasicInformation')}}</h2>
                    <p>{{$t('MaterialList.Name')}}：{{state.sources.file_name}}</p>
                    <p>ID：{{state.sources.media_asset_id}}</p>
                    <p>{{$t('MaterialList.MaterialType')}}：{{state.sources.type=='image'?$t('MaterialList.Image'):$t('MaterialList.Video')}}</p>
                    <p>{{$t('MaterialList.AppOfAffiliation')}}：{{state.sources.app_official_name}}</p>
                    <p>{{$t('MaterialList.Tag')}}：{{state.sources.tag||$t('MaterialList.empty')}}</p>
                    <p>{{$t('MaterialList.UploadTime')}}：{{state.sources.created_on}}</p>
                    <p>{{$t('MaterialList.AssociatedActivities')}}：{{state.sources.campaign_num}}</p>
                </div>
            </div>
            <div class="drawer_body">
                <h2>{{$t('MaterialList.ActivityData')}}</h2>
                <div class="drawer_body-input">
                    <span></span>
                </div>
                <el-table
                    ref="multipleTable"
                    :data="state.sources.campaign_data"
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column prop="campaign_name" :label="$t('MaterialList.ActivityName')" style="width:20%">
                    </el-table-column>
                    <el-table-column prop="placement_name" :label="$t('myApp.AdvertisingUnit')" style="width:15%">
                    </el-table-column>
                    <el-table-column prop="creative_name" :label="$t('campaign.creatvieName')" show-overflow-tooltip style="width:20%">
                    </el-table-column>
                    <el-table-column prop="imps" :label="$t('campaign.imps')" show-overflow-tooltip style="width:15%">
                    </el-table-column>
                    <el-table-column prop="clicks" :label="$t('campaign.clicks')" show-overflow-tooltip style="width:15%">
                    </el-table-column>
                    <el-table-column prop="ctr" :label="$t('campaign.ctr')" show-overflow-tooltip style="width:15%">
                    </el-table-column>
                    <template v-slot:empty >
                        <div class="empty-div">{{$t('myApp.noData')}}</div>
                    </template>
                </el-table>
                
            </div>
        </a-drawer>
        <a-modal :getContainer="()=>$refs.materialList" v-model:visible="isModify" :title="modifyTitle" @ok="onModify">
            <a-input v-model:value="tag" :placeholder="modifyTitle" />
        </a-modal>
    </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>

    import request from "@/utils/request.js";
    import router from '@/router';
    import store from "@/store";
    import { message , Modal} from 'ant-design-vue';
    import { useI18n } from 'vue-i18n';
    import { Empty } from 'ant-design-vue';

    import {
        EditOutlined,
        CloudUploadOutlined,
        PlayCircleOutlined,
        CloseCircleOutlined,
        DownOutlined,
        ExclamationCircleOutlined,
        MoreOutlined,
        DeleteOutlined
    } from "@ant-design/icons-vue";

    import { defineComponent, ref , reactive , watch , onMounted } from 'vue';
    export default defineComponent({
        components: {
            EditOutlined,
            CloudUploadOutlined,
            PlayCircleOutlined,
            CloseCircleOutlined,
            DownOutlined,
            ExclamationCircleOutlined,
            MoreOutlined,
            DeleteOutlined
        },
        setup() {

            const { t } = useI18n()

            /* -------------------------------ref---------------------------- */

            const date = ref([]);
            const checked = ref([]);
            const showDrawer = ref(false);
            const isUploadMaterial = ref(false);
            const isPlay  = ref(true);
            const total = ref(0);
            const isModify = ref(false);
            const modifyTitle = ref(t('MaterialList.ModifyTag'));
            const tag = ref('');
            const id = ref('');
            const app_id = ref(null);
            const direct_id = ref('');
            const isUploadImg = ref(true);
            //const action_img = ref(`/creative/hosted-creative-upload`);
            const action_img = ref("/creative-ui/api/creative-upload");
            const action_video = ref("/creative-ui/api/creative-upload");
            const accept_img = ref('.jpg,.gif,.png,.swf,.jpeg');
            const accept_video = ref('.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb');
            const upload_appId = ref('-1');
            const upload_appId_old = ref('-1');
            const sourceInfoIndex = ref(0);
            const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE);
            const materialLoading=ref(false);
            const uploadLoading=ref(false);
            /* -----------------------------reactive------------------------- */

            const state = reactive({
                //uploadData:[],
                sourceList:[{
                    app_icon: "",
                    app_icon_url: "",
                    app_id: "0",
                    app_official_name: "",
                    cdn_img_url: "",
                    cdn_secure_url: "",
                    cdn_url: "",
                    duration_ms: null,
                    file_name: "",
                    height: "",
                    media_asset_id: "",
                    mime_type_id: "",
                    platform: "",
                    size_in_bytes: "",
                    tag: null,
                    type: "",
                    width: ""
                }],
                sourceTagList:[],
                appNameList:[],
                fileList:[],
                uploadFileList:[],
                videodata:{},
                imageData:{},
                sources:[],
                data:[],
                directInfo:{},
                delList:[],
                uploadSources:[]
            });

            const searchData = reactive({
                app_id:'0',
                module_type:'0',
                num_elements:10,
                page:1, 
                search:'',
                source_type:null,
                tag:null
            });

            /* -----------------------------function------------------------- */

            watch(() => searchData.page, (newValue, oldValue) => {
                getCreativeSourceList();
            });

            watch(() => searchData.num_elements, (newValue, oldValue) => {
                getCreativeSourceList();
            });

            watch(() => upload_appId.value, (newValue, oldValue) => {
                console.log(newValue,oldValue);
                console.log(upload_appId_old.value);

                if(upload_appId_old.value!=newValue){
                    Modal.confirm({
                        title: t('MaterialList.SwitchApplication'),
                        content: t('MaterialList.ASTATSFWBD'),
                        okText: t('aggregate.enter'),
                        cancelText: t('aggregate.cancel'),
                        icon: <ExclamationCircleOutlined  />,
                        onOk:()=>{

                            let dataId=[];
                            state.data.forEach(item => {
                                dataId.push(item.id);
                            });
                            if(dataId.length){
                                let data={
                                    app_id:0,
                                    media_asset_id:dataId.toString()
                                };
                                request.deleteCreativeSource(data).then(res=>{
                                    state.data.length=0;
                                    state.fileList.length=0;
                                    state.uploadFileList=[];
                                    upload_appId_old.value=newValue;
                                }).catch(err=>{
                                    message.error(t('MaterialList.FailedToDeleteMaterial'));
                                });
                            }

                        },
                        onCancel: () => {
                            upload_appId.value=oldValue;
                        }
                    });
                }
            });

            onMounted(() => {
                getSourceTag();
                getAppNameList();
                getDirectInfo();
                getCreativeSourceList("source");
                if(store.state.User.userInfo){
                    state.videodata={
                        type: 'video',
                        member_id:store.state.User.userInfo.entity_id
                    }
                    state.imageData={
                        type: 'image',
                        member_id:store.state.User.userInfo.entity_id
                    }
                }
            });

            const onSearch =()=>{
                searchData.page=1;
                getCreativeSourceList();
            };

            const getCreativeSourceList = (e) => {
                e=="source"?store.dispatch("Util/Loading", true):materialLoading.value=true;
                searchData.app_id=(app_id.value==''||app_id.value==null)?'0':app_id.value=='-1'?direct_id.value:app_id.value;
                searchData.module_type=app_id.value==''?'0':app_id.value=='-1'?'2':'1';
                request.CreativeSourceList(searchData).then(res=>{
                    state.sourceList=res.data.data.data;
                    total.value=res.data.data.total;
                    e=="source"?store.dispatch("Util/Loading", false):materialLoading.value=false;
                }).catch(err => {
                    message.error(t('MaterialList.FaiToQueMaterial'));
                    e=="source"?store.dispatch("Util/Loading", false):materialLoading.value=false;
                })
            };

            const getSourceTag = ()=>{
                request.getSourceTag().then(res=>{
                    state.sourceTagList=res.data.data;
                    console.log(state.sourceTagList);
                }).catch(err => {
                    message.error(t('MaterialList.FaiToQueLabel'));
                })
            };

            const getAppNameList = ()=>{
                request.appNameList().then(res=>{
                    state.appNameList=res.data.data;
                    console.log(state.appNameList);
                }).catch(err => {
                    message.error(t('MaterialList.FaiToGetAppName'));
                })
            };

            const getDirectInfo = ()=>{
                request.getDirectInfo().then(res=>{
                    state.directInfo=res.data.data;
                    direct_id.value=res.data.data.direct_id;
                }).catch(err => {
                    message.error(t('DirCusGroup.FaiToObtDirCusGroup'));
                })
            }

            /* const goCreateDirCusCampaign = () => {
                router.push({path:'/hl/CreateDirCusCampaign'});
            }; */

            const onShowDrawer = (id,index) => {
                showDrawer.value = true;
                sourceInfoIndex.value=index;
                getSingleSource(id);
            };

            const onShowUploadMaterial = ({ key }) =>{
                if(key=='1'){
                    isUploadImg.value=true;
                }else{
                    isUploadImg.value=false;
                }
                if(state.directInfo.direct_id!=null){
                    upload_appId.value='-1';
                    upload_appId_old.value='-1'
                }else{
                    upload_appId.value=0;
                    upload_appId_old.value=0;
                }
                isUploadMaterial.value = true;
                state.data.length=0;
                //state.uploadData.length=0;
                state.fileList.length=0;
            };

            const onUploadFile = (file) => {
                uploadLoading.value=true;
                //state.uploadData.push({name:file.file.name,percent:file.file.percent,status:file.file.status});
                console.log(file);
                //state.uploadData=file.fileList;

                for(let i=0;i<file.fileList.length;i++){
                    if(file.fileList[i].status=='uploading'){
                        return;
                    }
                }

                file.fileList.forEach(item => {
                    let i=0;
                    for(i;i<state.data.length;i++){
                        if(state.data[i].id==item.response.response['media-asset'][0].id){
                            break;
                        }
                    }
                    if(i>=state.data.length){
                        uploadFile(item);
                    }
                });
            };

            const uploadFile = (item)=>{
                let res=item.response;
                console.log(item);
                if (item.status === 'done') {
                    console.log(res);
                    if (res.response&&res.response.status === "OK") {
                        if(res.response['media-asset'][0]){
                            let mediAasset_id=res.response['media-asset'][0].id
                            let opt={
                                id:mediAasset_id
                            };
                            request.MediaAsset(opt).then(res=>{
                                console.log(res);
                                if(res.data&&res.data.response&&res.data.response.status==="OK"){
                                    AddSourceRelation(res.data.response['media-asset'][0])
                                }
                            }).catch(err=>{
                                uploadLoading.value=false;
                                message.error(t('newCampaign.uploadMaterialFailed'));
                            })
                        }
                    }else{
                        uploadLoading.value=false;
                        message.error(t('newCampaign.uploadMaterialFailed'));
                    }
                }else{
                    uploadLoading.value=false;
                    message.error(t('newCampaign.uploadMaterialFailed'));
                }
            };
            const getSingleSource = (id)=>{
                let data={
                    media_asset_id:id
                };
                request.getSingleSource(data).then(res=>{
                    console.log(res);
                    state.sources=res.data.data;
                }).catch(err=>{
                    message.error(t('MaterialList.FaiToQueMaterial'));
                });
            };

            const delBatch = ()=>{
                Modal.confirm({
                    title: t('appMaterial.deleteMaterial'),
                    content: t('appMaterial.deleteMaterialContent'),
                    okText: t('appMaterial.enter'),
                    cancelText: t('appMaterial.cancel'),
                    icon: <ExclamationCircleOutlined  />,
                    onOk:()=>{
                        let data={
                            app_id:0,
                            media_asset_id:state.delList.toString()
                        };
                        request.deleteCreativeSource(data).then(res=>{
                            if(res.data.code==200) {
                                state.delList=[];
                                message.success(t('MaterialList.MaterialDeletedSuccessfully'));
                                getCreativeSourceList();
                            }else{
                                message.error(t('MaterialList.FailedToDeleteMaterial'));
                            }
                        }).catch(err=>{
                            message.error(t('MaterialList.FailedToDeleteMaterial'));
                        });
                    }
                });
            };

            const onDelSources = (id)=>{
                let data={
                    app_id:0,
                    media_asset_id:id
                };
                request.deleteCreativeSource(data).then(res=>{
                    message.success(t('MaterialList.MaterialDeletedSuccessfully'));
                    getCreativeSourceList();
                }).catch(err=>{
                    message.error(t('MaterialList.FailedToDeleteMaterial'));
                });
            };

            const delFile = (index)=>{
                console.log(state.data);
                console.log(state.fileList);
                for(let i=0;i<state.fileList.length;i++){
                    if(state.data[index].id==state.fileList[i].response.response['media-asset'][0].id){
                        state.fileList.splice(i, 1);
                        break;
                    }
                }

                let data={
                    app_id:0,
                    media_asset_id:state.data[index].id
                };
                request.deleteCreativeSource(data).then().catch(err=>{
                    message.error(t('MaterialList.FailedToDeleteMaterial'));
                });
                state.uploadFileList.splice(index, 1);
                state.data.splice(index, 1);
                console.log(state.data);
                console.log(state.fileList);
            };

            const onSubmit = ()=>{
                isUploadMaterial.value=false;
                message.success(t('MaterialList.MaterialUploadedSuccessfully'));
                searchData.page=1;
                state.uploadFileList=[];
                getCreativeSourceList();
            };

            const AddSourceRelation = (data)=>{
                console.log(data,"data");
                let opts={
                    advertiser_id: upload_appId.value=='-1'?state.directInfo.advertiser_id:state.appNameList[upload_appId.value].advertiser_id,
                    publisher_id: upload_appId.value=='-1'?state.directInfo.publisher_id:state.appNameList[upload_appId.value].publisher_id,
                    member_id: upload_appId.value=='-1'?state.directInfo.member_id:state.appNameList[upload_appId.value].member_id,
                    media_asset_id:data.asset_type=="video"?data.media_asset_video.media_asset_id:data.media_asset_image.media_asset_id,
                    app_id: upload_appId.value=='-1'?state.directInfo.direct_id:state.appNameList[upload_appId.value].app_id,
                    type:data.asset_type,
                    width:data.asset_type=="video"?data.media_asset_video.width:data.media_asset_image.width,
                    height:data.asset_type=="video"?data.media_asset_video.height:data.media_asset_image.height,
                    module_type:upload_appId.value=='-1'?'2':'1'
                };
                request.AddSourceRelation(opts).then(res=>{
                    if(res.data.code==200){
                        request.CreativeSourceList({
                            app_id:0,
                            module_type: 1,
                            num_elements: 10,
                            page:1,
                            search: data.id
                        }).then(res=>{
                            console.log(res.data.data);
                            if(res.data.code==200){
                                state.data.push({
                                    cdn_img_url:res.data.data.data[0].cdn_img_url,
                                    id:res.data.data.data[0].media_asset_id
                                })
                                state.uploadFileList.push(state.fileList[state.data.length-1]);
                                uploadLoading.value=false;
                                console.log(state.data[0].cdn_img_url,uploadLoading.value,state.data);
                                
                            }else{
                                state.fileList.splice(state.fileList.length-1,1);
                                uploadLoading.value=false;
                                message.error(t('newCampaign.uploadMaterialFailed'))
                            }
                        })
                    }else if (res.data.code !== 200){
                        state.fileList.splice(state.fileList.length-1,1);
                        uploadLoading.value=false;
                        message.error(res.data.msg)
                    }
                }).catch(err=>{
                    state.fileList.splice(state.fileList.length-1,1);
                    uploadLoading.value=false;
                    message.error(t('newCampaign.uploadMaterialFailed'))
                });
            };

            const onPlay = (id,tag) => {
                let video=document.getElementById(id+'');
                if(tag){
                    video.play();
                }else{
                    video.pause();
                }
            };

            const onModify = ()=>{
                let data={
                    media_asset_id:id.value,
                    tag:tag.value,
                }
                request.updateSourceTag(data).then(res=>{
                    console.log(res);
                    message.success(modifyTitle.value+t('MaterialList.ModifiedSuccessfully'));
                    isModify.value=false;
                    getCreativeSourceList();
                    getSourceTag();
                }).catch(err => {
                    message.error(modifyTitle.value+t('MaterialList.ModificationFailed'));
                })
            };

            const onShowModify = (data_tag,data_id)=>{
                isModify.value=true;
                tag.value=data_tag;
                id.value=data_id;
            };

            const onGoAppDetail = ()=>{
                store.dispatch("Util/OpenMenuKey",['/hl/app']);
                store.dispatch("Util/OpenKeys",['/hl/app']);
                router.push({path:'/hl/AppDetail',query:{id:state.sourceList[sourceInfoIndex.value].app_id,close:1}});
            };

            const onCancel = (resolve,resject)=>{
                isUploadMaterial.value=true;
                    Modal.confirm({
                    title: t('MaterialList.CancelUpload'),
                    content: t('MaterialList.TUCWNBSAC'),
                    okText: t('appMaterial.enter'),
                    cancelText: t('appMaterial.cancel'),
                    icon: <ExclamationCircleOutlined  />,
                    onOk:()=>{
                        let dataId=[];
                        state.data.forEach(item => {
                            dataId.push(item.id);
                        });
                        console.log(dataId);
                        
                        if(dataId.length){
                            let data={
                                app_id:0,
                                media_asset_id:dataId.toString()
                            };
                            request.deleteCreativeSource(data).then(res=>{
                                
                                isUploadMaterial.value=false;
                                searchData.page=1;
                                state.uploadFileList=[];
                                getCreativeSourceList();
                            }).catch(err=>{
                                message.error(t('MaterialList.FailedToDeleteMaterial'));
                            });
                        }else{
                            isUploadMaterial.value=false;
                            searchData.page=1;
                            state.uploadFileList=[];
                            getCreativeSourceList();
                        }
                        
                    },
                    onCancel:()=> {
                    }
                
                })
            
            };

            return {
                /* -------ref------- */
                checked,showDrawer,isUploadMaterial,isPlay,total,isModify,modifyTitle,tag,id,app_id,
                isUploadImg,action_img,action_video,accept_img,accept_video,upload_appId,direct_id,
                sourceInfoIndex,simpleImage,materialLoading,uploadLoading,
                /* -----reactive---- */
                state,searchData,
                /* -----function---- */
                onShowDrawer,onShowUploadMaterial,onUploadFile,onPlay,onModify,onShowModify,getCreativeSourceList,
                uploadFile,onSubmit,delFile,delBatch,onDelSources,onGoAppDetail,onSearch,onCancel
            }
        },
        mounted(){
            store.dispatch("Util/OpenMenuKey",['/hl/MaterialLibrary']);
            store.dispatch("Util/OpenKeys",['/hl/MaterialLibrary']);
        },
    });
</script>

<style scoped>
    @import "../../assets/css/index.css";
</style>

<style lang="less">
    .materialList{
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;

        h1{
            font-size: 18px;
        }

        .ant-modal .ant-modal-body{
            padding-top: 20px;
        }

        .content_input{
            margin-bottom: 15px;
        }

        .content_btn{
            margin-bottom: 15px;
            .ant-btn:nth-child(1){
                min-width: 120px;
            }
        }
        .uploadBtn{
            display: flex;
            justify-content: right;

        }
        .table_images{
            
            height: 54px;
            width: 96px;
            object-fit: contain;
            margin-right: 8px;
        }
        .min{
            display: inline-block;
            overflow:hidden; //超出的隐藏
            text-overflow:ellipsis;//省略号
            white-space:nowrap;//强制一行显示
        }
        .deleteIcon{
            display: inline-block;
            width: 32px;
            height: 21px;
            line-height: 23px;
            cursor: pointer;
            margin-left: 8px;
            font-size: 14px;
            vertical-align: middle;
        }

        .content_body{
            padding: 0;
            margin: 0;
            padding-bottom: 8px;
            list-style: none;

            .ant-checkbox-group{
                display: flex !important;
                flex-wrap: wrap;

                li{
                    width: 300px;
                    border: 1px solid #f0f0f0;
                    margin: 0 8px 8px 0;
                    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),0 3px 6px 0px rgba(0,0,0,0.12),0 5px 12px 4px rgba(0,0,0,0.09);

                    .content_body_top{
                        position: relative;
                        width: 100%;
                        height: 168px;

                        .tag-time,.tag-check,.tag-type,.tag-play{
                            z-index: 9;
                            position: absolute;
                            background-color: rgba(0, 0, 0, 0);
                        }

                        .tag-time,.tag-type{
                            font-size: 12px;
                            text-align: center;
                            padding: 3px;
                            border-radius: 5px;
                            color: #fff;
                            border: 1px solid rgba(255, 255, 255, 0.5);
                            background-color: rgba(0,0,0,.3);
                        }

                        .tag-time{
                            top: 10px;
                            left: 10px;
                        }

                        .tag-type{
                            bottom: 10px;
                            right: 10px;
                        }

                        .tag-check{
                            top: 10px;
                            right: 10px;

                            .ant-checkbox-inner{
                                background-color: rgba(0,0,0,.2);
                                border: 1px solid #fff;
                            }

                            .ant-checkbox-checked .ant-checkbox-inner {
                                background-color: #6577c8 !important;
                            }
                        }

                        .tag-play{
                            font-size: 36px;
                            color: #fff;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }

                        .tag-play-hidden{
                            display: none;
                        }

                        video{
                            z-index: 1;
                            width: 100%;
                            height: 100%;
                            background-color: #000;
                        }

                        img{
                            z-index: 1;
                            width: 298px;
                            height: 168px;
                            object-fit: contain;
                            background-color: rgba(255,255,255,.8);
                        }

                        .mask{
                            z-index: 8;
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            width: 100%;
                            background-color: rgba(0,0,0,.5);
                            transition: all 0.3s;
                        }
                    }

                    .content_body_center{
                        display: flex;
                        width: 100%;
                        height: 64px;
                        border-bottom: 1px solid #eaf5ff;

                        div:nth-child(1){
                            display: flex;
                            align-items: center;
                            width: 62%;
                            span{
                                padding: 5px;
                            }
                        }

                        div:nth-child(2){
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                        }

                        .ant-dropdown-link{
                            font-size: 18px;
                        }

                        .file_name{
                            width: 100%;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            word-break: break-all;
                        }

                    }
                    
                    .content_body_bottom--app{
                        display: flex;
                        align-items: center;
                        width: 100%;
                        padding: 8px 0;

                        img{
                            width: 32px;
                            height: 32px;
                            border-radius: 6px;
                        }

                        h3{
                            width: 200px;
                            margin: 0;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            word-break: break-all;
                        }

                        & > div{
                            display: flex;
                            flex-direction: column;
                            margin-left: 8px;

                            span{
                                line-height: 15px;
                            }
                        }

                        .ant-avatar{
                            background-color: #000;
                            vertical-align: middle;
                            margin-left: 8px;
                        }

                        .anticon-edit{
                            padding: 0 8px;
                        }
                    }
                }

            }
        }

        .ant-drawer-content-wrapper{

            .ant-drawer-content{
                background-color: #f5f5f5;

                .ant-drawer-body{
                    padding: 10px;
                }

                .drawer_header{
                    display: flex;
                    background-color: #fff;
                    padding: 20px;
                    
                    video{
                        width: 450px;
                        height: 254px;
                    }
                    
                    .drawer_header-info{
                        margin-left: 20px;
                        width: calc(100% - 450px - 20px);
                    }

                    p{
                        margin-bottom: 5px;
                        color: #595959;
                    }
                    
                    .ant-image{
                        overflow: hidden;
                        box-sizing: border-box;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        .ant-image-img{
                            max-width: 100% !important;
                            max-height: 100% !important;
                            height: auto !important;
                            width: auto !important;
                        }

                    }

                }

                .drawer_body{
                    background-color: #fff;
                    margin: 10px 0;
                    padding: 20px;

                    .drawer_body-input{
                        display: flex;
                        justify-content: space-between;
                        background-color: #fff;
                        margin-bottom: 10px;
                    }
                }

                h2{
                    font-size: 16px;
                    color: rgba(0, 0, 0, 0.7);
                    font-weight: 600;
                }
            }

        }

        .ant-modal{
            width: 900px;
            .ant-select{
                margin-left: 10px;
            }
            .ant-upload{
                margin: 10px 0;
            }
            .el-table--fit{
                border: 1px dashed #d9d9d9;
            }
            .el-table td, .el-table th.is-leaf{
                border: none;
            }
            .ant-progress-line{
                width: 90%;
                font-size: 12px;
            }
        }

        .content_body_top:hover .tag-play{
            display: none !important;
        }

        .content_body_top:hover .mask{
            display: none !important;
        }

        .uploadModal .ant-modal-footer{
            display: flex;
            justify-content: end;
            & > div:first-child{
                display: flex;
                flex-wrap: wrap;
                width: 77%;

                .item{
                    z-index: 1;
                    position: relative;
                    width: 32px;
                    height: 32px;
                    margin-right: 8px;

                    .anticon {
                        z-index: 9;
                        position: absolute;
                        right: 0px;
                        top: -5px;
                    }

                    .ant-image{
                        overflow: hidden;
                        box-sizing: border-box;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .ant-image-img{
                            width: 100%;
                        }

                    }
                }

            }

        }

        .ant-modal-content{
            padding: 10px 0;
        }

    }

</style>