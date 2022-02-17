<template>
    <div class="addApp">
        <a-form
            ref="addAppFormRef"
            :model="formState"
            :rules="rules"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
        >
            <a-form-item :label="$t('AddApp.AppStore')" :colon="false">
                <a-radio-group v-model:value="formState.is_up" @change="onChangeIsUpAndPlatForm">
                    <a-radio :value="1">{{$t('AddApp.Yes')}}</a-radio>
                    <a-radio :value="0" :disabled="isEditApp&&oldAppIsUp==1">{{$t('AddApp.No')}}</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item :label="$t('myApp.appPlatform')" :colon="false">
                <a-radio-group v-model:value="formState.platform" @change="onChangeIsUpAndPlatForm">
                    <a-radio :value="0" :disabled="isEditApp&&formState.platform==1">Android - Google Play</a-radio>
                    <a-radio :value="1" :disabled="isEditApp&&formState.platform==0">iOS - App Store</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item v-if="formState.is_up==1" :label="$t('myApp.store')" name="app_store" >
                <a-input class="appUrl_input" v-model:value="formState.app_store" placeholder="https://" :disabled="isEditApp&&oldAppIsUp==1" />
                <a-button class="search_btn" type="primary" :disabled="formState.app_store==''" :loading='isSearchLoading' @click="onSearch">{{isSearchLoading?'':$t('AddApp.GetData')}}</a-button>
            </a-form-item>
            <div v-if="isShowAppInfo">
                <a-form-item :label="$t('AddApp.AppName')" name="app_official_name" >
                    <a-input v-model:value="formState.app_official_name" :placeholder="$t('AddApp.AppName')" />
                </a-form-item>
                <a-form-item :label="$t('AddApp.BundleID')" name="app_bundle_id" >
                    <a-input :disabled='formState.is_up==1' v-model:value="formState.app_bundle_id" :placeholder="$t('AddApp.Required')+'：com.admobilex.app'"/>
                </a-form-item>
                <a-form-item :label="$t('AddApp.AppIcon')" name="app_icon_url">
                    <div class="form_item-level">
                        <a-upload
                            ref="uploadClick"
                            v-model:file-list="state.fileList"
                            :data="state.imageData"
                            name="file"
                            accept='.jpg,.gif,.png,.swf,.jpeg'
                            list-type="picture-card"
                            :show-upload-list="false"
                            :action="upImageUrl"
                            @change="onChangeAppIcon"
                        >
                            <img v-if="formState.app_icon_url" :src="formState.app_icon_url" style="height:72px;width:72px;object-fit:cover;"/>
                            <div v-else>
                                <PlusOutlined></PlusOutlined>
                                <div class="ant-upload-text">{{$t('AddApp.UploadPicture')}}</div>
                                <div class="ant-upload-text">{{$t('Message.OptionalFilling')}}</div>
                            </div>
                        </a-upload>
                        <!-- <div class="form_item-text" ></div> -->
                        <a-upload
                            v-if="formState.app_icon_url!=''"
                            v-model:file-list="state.fileList"
                            :data="state.imageData"
                            name="file"
                            accept='.jpg,.gif,.png,.swf,.jpeg'
                            :show-upload-list="false"
                            :action="upImageUrl"
                            @change="onChangeAppIcon"
                        >
                            <a-button type="link">{{$t('AddApp.ChangeTheIcon')}}</a-button>
                        </a-upload>
                        <span v-else class="ant-upload-text" style="margin-bottom:6px;" >{{$t('AddApp.NoPicturesUploaded')}}<br>{{$t('AddApp.If')}}</span>
                    </div>
                </a-form-item>
            </div>
        </a-form>
        <div class="foot_content">
            <a-space :size="8">
                <a-button @click="onCancel">{{$t('AddApp.Cancel')}}</a-button>
                <a-button type="primary" :disabled="formState.app_bundle_id==''" @click="onCreateApp">{{$t('AddApp.Save')}}</a-button>
            </a-space>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive, toRaw , ref , onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import request from "@/utils/request.js";
import store from "@/store";
import { message , Modal} from 'ant-design-vue';
import {
    PlusOutlined,
    LoadingOutlined 
} from "@ant-design/icons-vue";
export default defineComponent({
    components: {
        LoadingOutlined,
        PlusOutlined,
    },

    props: ['appInfo'],

    setup(props,context) {

        const { t } = useI18n();

        let validatorUrl = async (rule, value) => {
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

        const rules = {
            app_store: [{ required: true, validator: validatorUrl , trigger: "blur" }],
            app_official_name: [{ required: true, message: t('Message.NotEmpty') ,  max: 70 , trigger: "blur" }],
            app_bundle_id: [{ required: true, message: t('Message.NotEmpty') ,  max: 70 , trigger: "blur" }]
        };

        /* -------------------------------ref---------------------------- */

        const addAppFormRef = ref();
        const loading = ref(false);
        const upImageUrl = ref("/creative-ui/api/creative-upload");
        const isGetAppList = ref(false);
        const isShowAppInfo = ref(false);
        const isSearchLoading = ref(false);
        const oldAppUrl = ref("");
        const isEditApp = ref(false);
        const appId = ref(0);
        const oldAppIsUp = ref(0);

        /* -----------------------------reactive------------------------- */

        const state = reactive({
            fileList:[],
            imageData:{},
        })

        const formState = reactive({
            is_up: 1,
            platform: 0,
            app_store: "",
            app_store_ID:"",
            app_official_name:'',
            app_category:'DEFAULT',
            app_person:'0',
            app_pay_type:'0',
            app_score:'0',
            app_bundle_id:'',
            app_icon_url:'',
            is_cdn_pic:0,
            timezone:store.state.User.userInfo.timezone
        });

        /* -----------------------------function------------------------- */

        onMounted(() => {
            console.log(props.appInfo);

            if(props.appInfo!=""){
                isEditApp.value=true;
                isShowAppInfo.value=true;
                oldAppUrl.value=props.appInfo.app_store;
                appId.value=Number(props.appInfo.id);
                oldAppIsUp.value=Number(props.appInfo.is_up);
                formState.platform=Number(props.appInfo.platform);
                formState.is_up=Number(props.appInfo.is_up);
                formState.app_store=props.appInfo.app_store;
                formState.app_store_ID=props.appInfo.app_store_ID;
                formState.app_official_name=props.appInfo.app_name;
                formState.app_category=props.appInfo.app_person;
                formState.app_person=props.appInfo.app_person;
                formState.app_pay_type=props.appInfo.app_pay_type;
                formState.app_score=props.appInfo.app_score;
                formState.app_bundle_id=props.appInfo.bundle_id;
                formState.app_icon_url=props.appInfo.app_icon_url;
                formState.is_cdn_pic=1;
            }

            state.imageData={
                type: 'image',
                member_id:store.state.User.userInfo.entity_id
            }
        }); 

        const onSearch = () =>{
            oldAppUrl.value=formState.app_store;
            isSearchLoading.value=true;
            let data={
                app_store:formState.app_store,
                platform:formState.platform
            };
            request.getAppStoreInfo(data).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    formState.app_icon_url=res.data.data.app_icon_url;
                    formState.app_store=res.data.data.app_store;
                    formState.app_store_ID=res.data.data.app_store_ID;
                    formState.app_bundle_id=res.data.data.app_bundle_id;
                    formState.app_official_name=res.data.data.app_official_name;
                    formState.app_category=res.data.data.app_category;
                    formState.app_person=res.data.data.app_person;
                    formState.app_pay_type=res.data.data.app_pay_type;
                    formState.app_score=res.data.data.app_score;
                    formState.is_cdn_pic=0;
                    isShowAppInfo.value=true;
                    isSearchLoading.value=false;
                }else{
                    onChangeIsUpAndPlatForm();
                    message.error(throwException(res.data.code));
                };
                isSearchLoading.value=false;
            }).catch(error => {
                isSearchLoading.value=false;
                message.error(t('myApp.unknownError'));
                console.log("error", error);
            });
        };

        const onChangeAppIcon = (file) => {
            console.log(file);
            let res=file.file;
            if (res.status === 'done') {
                console.log(file);
                if (res.response&&res.response.response.status === "OK") {
                    if(res.response.response['media-asset'][0]){
                        let mediAasset_id=res.response.response['media-asset'][0].id
                        let opt={
                            id:mediAasset_id
                        };
                        request.MediaAsset(opt).then(res=>{
                            console.log(res);
                            formState.is_cdn_pic=1;
                            setTimeout(()=>{
                                formState.app_icon_url=res.data.response['media-asset'][0].cdn_url;
                            },500)
                        }).catch(err=>{
                            message.error(t('AddApp.PictureUploadFailed'));
                        })
                    }
                }
            }
            console.log(formState.app_icon_url);
        };

        const onCreateApp = () => {
            addAppFormRef.value.validate().then(() => {

                if(formState.app_icon_url==''){
                    formState.app_icon_url='http://console-style.hl.com/images/dspcom/appImage.png';
                    formState.is_cdn_pic=1;
                }

                if(isEditApp.value){
                    updateApp();
                    return;
                }

                if(formState.is_up==1){
                    if(oldAppUrl.value==formState.app_store){
                        createApp();
                    }else{
                        message.error(t('AddApp.TheAppAddress'));
                    }
                }else{
                    createApp();
                }

            }).catch(error => {
                console.log("error", error);
            });
        };

        const createApp = () => {
            if(formState.is_up==0){
                formState.app_store_ID=formState.app_bundle_id;
            }
            store.dispatch("Util/Loading", true);
            request.CreateApp(formState).then(res => {
                if (res.data.code === 200) {
                    store.dispatch("Util/Loading", false);
                    message.success(t("myApp.addSuccessful"));
                    context.emit('addAppModalClose', true)
                }else{
                    store.dispatch("Util/Loading", false);
                    message.error(AddAppThrowException(res.data.code));
                    context.emit('addAppModalClose', false)
                }
            }).catch(err => {
                message.error(t("myApp.unknownError"));
                store.dispatch("Util/Loading", false);
                context.emit('addAppModalClose', false)
            });
        };

        const updateApp = () => {
            formState['app_id']=appId.value;
            store.dispatch("Util/Loading", true);
            request.updateApp(formState).then(res => {
                if (res.data.code === 200) {
                    store.dispatch("Util/Loading", false);
                    message.success(t("AddApp.AppEditedSuccessfully"));
                    context.emit('addAppModalClose', true)
                }else{
                    store.dispatch("Util/Loading", false);
                    message.error(throwException(res.data.code));
                    context.emit('addAppModalClose', false)
                }
            }).catch(err => {
                message.error(t("AddApp.AppEditFailed"));
                store.dispatch("Util/Loading", false);
                context.emit('addAppModalClose', false)
            });
        };


        const onCancel = () =>{
            isGetAppList.value=false;
            context.emit('addAppModalClose', false)
        };
        
        const onChangeIsUpAndPlatForm = () => {

            if(!isEditApp.value){
                formState.app_store_ID="";
                formState.app_official_name='';
                formState.app_category='DEFAULT';
                formState.app_person='0';
                formState.app_pay_type='0';
                formState.app_score='0';
                formState.app_bundle_id='';
                formState.app_icon_url='';
            }

            if(formState.is_up==0){
                isShowAppInfo.value=true;
                formState.app_store="";
            }else{
                isShowAppInfo.value=false;
            }
        };

        const throwException = (code)=>{
            console.log(code);
            let message;
            switch(code){
                case 2000:
                case 2001:
                case 2003:
                    message=t("Message.AppStoreLinkIsIncorrect");break;
                case 2002: 
                    message=t("Message.AppInfoNotBeSearch");break;
                case 2004:
                case 2005:
                case 2006:
                    message=t("Message.AppSearchFailed");break;
                case 2009:
                    message=t("Message.AppDoesNotExist");break;
                case 2012:
                    message=t("Message.AppDoesNotExist");break;
                default:
                    message=t("myApp.unknownError");
            }
            console.log(message);
            return message;
        };

        const AddAppThrowException = (code)=>{
            console.log(code);
            let message;
            switch(code){
                case 2001:
                    message=t("Message.AppAlreadyExists");break;
                case 2003: 
                    message=t("Message.PictureUploadFailed");break;
                case 2004:
                    message=t("Message.TimezoneIsIllegal");break;
                case 2006:
                case 2007:
                    message=t("Message.FailedToEnterAppInformation");break;
                case 500:
                    message=t("Message.ServerException");break;
                default:
                    message=t("myApp.unknownError");
            }
            console.log(message);
            return message;
        };

        return {
            rules,
            /* -------ref------- */
            addAppFormRef,loading,upImageUrl,isGetAppList,isShowAppInfo,isSearchLoading,isEditApp,oldAppIsUp,
            /* -----reactive---- */
            state,formState,
            /* -----function---- */
            onCreateApp,onChangeAppIcon,onSearch,onChangeIsUpAndPlatForm,onCancel
        };
    },
});
</script>

<style lang="less" scoped>

.addApp{
    .form_item-level{
        display: flex;
        align-items: flex-end;

        .ant-upload-picture-card-wrapper{
            width: auto;

            .ant-upload.ant-upload-select-picture-card{
                margin-bottom: 0;
            }
        }

        .form_item-text{
            display: flex;
            align-items: center;
        }

    }
    .appUrl_input{
        width: 80%;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .search_btn{
        width: 20%;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .foot_content{
        display: flex;
        justify-content: flex-end;
        margin-top: 32px;
    }
    .ant-upload-text{
        color: #ccc;
    }
}

</style>