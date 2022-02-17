<template>

    <div class="material" ref="material">
        <div class="materialTitle">
            <div class="materialContent">
                <a-input-search v-model:value="materialSearch" allowClear :placeholder="$t('appMaterial.searchMaterial')" /><a-button type="primary" class="search" @click="materialSearchs">{{$t('appMaterial.search')}}</a-button>
            </div>
            <div class="materialOption" v-if="iconIndex!=6">
                <!-- <a-upload
                    name="file"
                    :data="paramsdata"
                    accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'
                    :action="uploadUrl"
                    :beforeUpload="beforeUpload"
                    @change="handleChange"
                    class="uploads"
                    v-if="features.IS_ADD_CREATIVE"
                >
                    <a-button type="primary" class="uploadbtn" >上传素材</a-button>
                </a-upload> -->
                <!-- <a-select v-model:value="upload" placeholder="上传素材" class="upload" @change="typeChange">
                    <a-select-option value="1">
                        <a-upload
                            name="file"
                            :data="paramsdata"
                            accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'
                            :action="uploadUrl"
                            :beforeUpload="beforeUpload"
                            @change="handleChange"
                            class="uploads"
                            v-if="features.IS_ADD_CREATIVE"
                        >
                            <span class="uploadbtn" >图片素材</span>
                        </a-upload>
                    </a-select-option>
                    <a-select-option value="2">
                        <a-upload
                            name="file"
                            :data="paramsdata"
                            accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'
                            :action="uploadUrl"
                            :beforeUpload="beforeUpload"
                            @change="handleChange"
                            class="uploads"
                            v-if="features.IS_ADD_CREATIVE"
                        >
                            <span type="primary" class="uploadbtn" >视频素材</span>
                        </a-upload>
                    </a-select-option>
                </a-select> -->
                <!-- <div class="uploadButtons" @click="selectUpload"  v-if="features.IS_ADD_CREATIVE">
                    <span >{{selectText}}</span>
                    <span v-if="!popover"><DownOutlined /></span>
                    <span v-else><UpOutlined /></span>
                </div> -->
                <a-dropdown :trigger="['click']" :getPopupContainer="()=>$refs.material" >
                    <a-button  type="primary">
                        {{$t('appMaterial.uploadMaterial')}}
                        <DownOutlined />
                    </a-button>
                    <template #overlay>
                    <a-menu>
                        <a-menu-item key="0">
                            <a-upload
                                name="file"
                                :data="imageData"
                                accept='.jpg,.gif,.png,.swf,.jpeg'
                                :action="upimageUrl"
                                :beforeUpload="imageBeforeUpload"
                                @change="handleChange"
                                class="uploads"
                            >
                                <span  class="uploadbtn">{{$t('appMaterial.image')}}</span>
                            </a-upload>
                        </a-menu-item>
                        <a-menu-item key="1">
                            <a-upload
                                name="file"
                                :data="paramsdata"
                                accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'
                                :action="uploadUrl"
                                :beforeUpload="beforeUpload"
                                @change="handleChange"
                                class="uploads"
                            >
                                <span  class="uploadbtn">{{$t('appMaterial.video')}}</span>
                                </a-upload>
                        </a-menu-item>
                    </a-menu>
                    </template>
                </a-dropdown>
                <a-button type="primary" danger class="dangers" v-if="iconIndex!=6" @click="delSource" :disabled="source_id.length==0">{{$t('appMaterial.delete')}}</a-button>
                <!-- <div class="popovers" v-if="popover">
                    <a-upload
                            name="file"
                            :data="paramsdata"
                            accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'
                            :action="uploadUrl"
                            :beforeUpload="beforeUpload"
                            @change="handleChange"
                            class="uploads"
                        >
                            <span><span  class="uploadbtn" @click="selectItem">图片素材</span></span>
                    </a-upload>
                    <a-upload
                            name="file"
                            :data="paramsdata"
                            accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'
                            :action="uploadUrl"
                            :beforeUpload="beforeUpload"
                            @change="handleChange"
                            class="uploads"
                        >
                            <span><span class="uploadbtn" @click="selectItems">视频素材</span></span>
                    </a-upload>
                </div> -->
            </div>
        </div>
        <a-spin :spinning="loading1">
            <el-table :data="sourceList.data" ref="source" row-key="media_asset_id"  @expand-change="expandChange"  @selection-change='selecSource'  @sort-change="PlacementSort">
            <el-table-column prop="" label="" v-if="iconIndex!=6"  type="selection"></el-table-column>
            <el-table-column prop="media_asset_id" width="110" :label="$t('appMaterial.materialID')" :sort-orders="sortOrders"  sortable="custom"></el-table-column>
            <el-table-column  width="150" :label="$t('appMaterial.thumbnail')" >
                <template #default="scope">
                    <div class="thumbnails">
                        <a-image
                            class="thumbnail"
                            :src="scope.row.type=='video'?scope.row.cdn_img_url:scope.row.cdn_url"
                            fallback="data:image/png;base64,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"
                        />
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="file_name" :label="$t('appMaterial.materialName')" class="placement_names" >
                <template #default="scope">
                    <el-tooltip  effect="dark" :content="scope.row.file_name" placement="top" :open-delay="200" :enterable="false">
                        <span class="min">{{scope.row.file_name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="type" :label="$t('appMaterial.materialFormat')"  width="120" >
                <template #default="scope">
                    <span>{{scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="creative_name" :label="$t('appMaterial.duration')"  width="80" >
                <template #default="scope">
                    <span>{{scope.row.duration_ms/1000}}s</span>
                </template>
            </el-table-column>
            <el-table-column  width="60" prop="" label="" class="placement_names"  v-if="iconIndex==6">
                <template #default="scope">
                    <a-button type="link" size="small" class="shisu_text_btn" @click="selectSources(scope.row)">{{$t('appMaterial.select')}}</a-button>
                </template>
            </el-table-column>
            <el-table-column  label="" type="expand" ref="preview" prop="cdn_secure_url" width="0">
                <template #default="scope">
                    <video v-if="scope.row.type=='video'" id="video1" :src="scope.row.cdn_url" controls  autoplay style="width:4.8rem;height:2.7rem;"></video>
                    <div v-else class="typeImages">
                        <a-image
                            class="typeImage"
                            :src="scope.row.cdn_url"
                            fallback="data:image/png;base64,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"
                        />
                    </div>
                </template>
            </el-table-column>
            <el-table-column  width="150" prop="" label="" >
                <template #default="scope">
                    <a-button type="link" v-if="expandRow.length!=0&&expandRow[0].media_asset_id==scope.row.media_asset_id" size="small" class="shisu_text_btn" @click="expandLine(scope.row)">{{$t('appMaterial.collapsePreview')}}
                        <UpOutlined />
                    </a-button>
                    <a-button type="link" v-else  size="small" class="shisu_text_btn" @click="expandLine(scope.row)">{{$t('appMaterial.preview')}}
                        <DownOutlined />
                    </a-button>
                </template>
            </el-table-column>
            <el-table-column  width="60" prop="" label="" class="placement_names"  v-if="iconIndex==6">
                <template #default="scope">
                    <a-button type="link" size="small" class="shisu_text_btn" danger @click="delSources(scope.row.media_asset_id)">{{$t('appMaterial.delete')}}</a-button>
                </template>
            </el-table-column>
            <template v-slot:empty >
                <div class="icon-div"><i class="iconfont icon">&#xe635;</i></div>
                <div class="empty-div">{{$t('appMaterial.noData')}}</div>
            </template>
        </el-table>
        </a-spin>
        <a-pagination
            :total="sourceTotal"
            show-quick-jumper
            show-size-changer
            :show-total="sourceTotal => `${$t('myApp.total')} ${sourceTotal} ${$t('myApp.article')}`"
            :page-size="pageSize"
            :page-size-options="pageSizeOptions"
            v-model:current="current_page"
            @change="PageCurrent"
            @showSizeChange="pageSizes"
            >
        </a-pagination>
    </div>

</template>

<script>
import { mapGetters,useStore } from "vuex";
import store from '@/store';
import { message} from 'ant-design-vue';
import {UpOutlined,DownOutlined}from '@ant-design/icons-vue';
import { isArray } from '../../utils/globalMethods';
import { useI18n } from 'vue-i18n';
export default {
     components: {
        DownOutlined,
        UpOutlined
    },
     computed:{
      ...mapGetters({
        userInfo:"User/getUser"
      })
    },
    props:['app_id','isChoice','advertiser_id','publisher_id','member_id',"iconIndex","materialType","size","module_type"],
    data(){
        return{
            materialSearch:"",
            selectText:"上传素材",
            fileList:[],
            popover:false,
            upload:undefined,
            sourceList:"",//素材列表
            pageSize:10,
            current_page:1,//页码
            sourceTotal:0,
            loading1:false,
            paramsdata:{},
            imageName:"",
            imageData:{},
            source_id:[],
            features:'',
            iconIndexs:5,
            sortDirections:['descend', 'ascend'],
            sortOrders:['descending', 'ascending', null],
            videos:false,
            expandedRowKeys:"",
            uploadUrl:"/creative-ui/api/creative-upload",//你要上传视频到你后台的地址
            upimageUrl:`/creative/hosted-creative-upload`,
            pageSizeOptions:["10","20", "50"],
            rowSelection:{
                onChange: (selectedRowKeys, selectedRows) => {
                    this.rowSelection.selectedRowKeys = selectedRowKeys
                    this.source_id=selectedRows;
                },
                getCheckboxProps: (record) => ({
                    disabled: record.name === 'Disabled User', // Column configuration not to be checked
                    name: record.name,
                }),
                selectedRowKeys:[]
            },
            preview:this.$t('appMaterial.preview'),
            collapsePreview:this.$t('appMaterial.collapsePreview'),
            widths:this.$t('appMaterial.width'),
            materialWidth:"",
            materialHeight:"",
            expandRow:[],
        }
    },
    watch: {
    '$store.state.Util.language'(newVal,oldVal){
        console.log(newVal,oldVal);
        this.preview=this.$t('appMaterial.preview');
        this.collapsePreview=this.$t('appMaterial.collapsePreview');
        this.widths=this.$t('appMaterial.width');
    }
    },
    created(){
        this.features=useStore().state["User"].userAccessControl;
        const { t } = useI18n();
        console.log(this.module_type);
    },
    methods:{
        //预览素材
        expandLine(row){
            console.log(row);
            
            let $table = this.$refs.source;
                this.sourceList.data.map((item) => {
                if (row.media_asset_id != item.media_asset_id) {
                    console.log(item,'item');
                    
                    $table.toggleRowExpansion(item, false);
                }
                })
                $table.toggleRowExpansion(row);
            
            console.log(this.expandRow);
        
        },
        expandChange(e,i){
            console.log(e,i);
            this.expandRow=i;
        
        },
        selectItem(){
            this.popover=false;
            this.selectText="图片素材";
        },
        selectItems(){
            this.popover=false;
            this.selectText="视频素材";
        },
        selectUpload(){
            console.log(1);
            this.popover=!this.popover;
        },
        materialSearchs(){
            console.log(this.materialSearch);
            this.SourceList();
        },
        expandedRowsChange(e){
            console.log(e);
            if(e.length==2){
                this.expandedRowKeys=e[1];
            }else {
                this.expandedRowKeys=e;
            }
        },
         // 控制只展开一行
        // unfold(e,v){
        //     if(v.length>=2){
        //         this.$refs.source.toggleRowExpansion(v[0],false)
        //     }
        // },
         //表格选项发生变化
        selecSource(e){
            this.source_id=e;
            if(e.length>0) {
                this.disableds=false;
            }else {
                this.disableds=true;
            }
        },
        expand(e){
            setTimeout(()=>{
                var videos=document.querySelector(".videos");
                    videos.load();
                    if(!e){
                        videos.pause();
                    }
            },10)
        },
          //素材排序
        PlacementSort(e){
            if(e.order=='ascending'){
                this.SourceList(`desc`,'id');
            }else if(e.order=='descending'){
                this.SourceList(`asc`,'id');
            }else {
                this.SourceList();
            }
        },
        //上传完成后处理
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
                                    let opt={
                                        advertiser_id:this.advertiser_id||this.userInfo.advertiser_id,
                                        publisher_id:this.publisher_id,
                                        member_id: this.member_id,
                                        media_asset_id:data.asset_type=="video"?data.media_asset_video.media_asset_id:data.media_asset_image.media_asset_id,
                                        app_id:isArray(this.app_id)?this.app_id.toString():this.app_id,
                                        type:data.asset_type,
                                        width:this.materialWidth,
                                        height:this.materialHeight,
                                    }
                                    console.log("34");
                                    this.$req.AddSourceRelation(opt).then(res=>{
                                        if(res.data.code === 200){
                                            message.success(this.$t('newCampaign.uploadMaterialSuccessful'));
                                            this.SourceList();
                                            this.materialWidth="";
                                            this.materialHeight="";
                                            this.loading1=false;
                                        }else if (res.data.code !== 200){
                                            message.error(res.data.msg)
                                            this.loading1=false;
                                            this.materialWidth="";
                                            this.materialHeight="";
                                        }
                                    }).catch(err=>{
                                        message.error(this.$t('newCampaign.uploadMaterialFailed'))
                                        this.loading1=false;
                                        this.materialWidth="";
                                        this.materialHeight="";
                                    })
                                
                            }else{
                                console.log("2");
                                message.error(this.$t('newCampaign.uploadMaterialFailed'))
                                this.loading1=false;
                                this.materialWidth="";
                                this.materialHeight="";
                            }
                        }).catch(err=>{
                            message.error(this.$t('newCampaign.uploadMaterialFailed'))
                            this.loading1=false;
                            this.materialWidth="";
                            this.materialHeight="";
                        })
                    }
                } else {
                    message.error(this.$t('newCampaign.uploadMaterialFailed'))
                    this.loading1=false;
                    this.materialWidth="";
                    this.materialHeight="";
                }
            } else if (info.file.status === 'error') {
                message.error(this.$t('newCampaign.uploadMaterialFailed'))
                this.loading1=false;
                this.materialWidth="";
                this.materialHeight="";
            }
        },
         // 创意选择素材
        selectSources(e){
            console.log(e);
            console.log(this.size);
            if(this.size=="3"){
                if(e.width/e.height==1.5||e.height/e.width==1.5){
                    this.$emit("selectSources",e)
                }else {
                    message.error(this.$t('newCampaign.imageRatio'));
                }
            }else{
                this.$emit("selectSources",e)
            }
            
        },
         //当前页码改变
        PageCurrent(e){
            this.current_page=e;
            this.SourceList();
        },
         //当前页每页显示数据条数
        pageSizes(e,p) {
            this.pageSize=p;
            this.SourceList();
        },
        //排序
        sortID(a,b,c){
            if(c.order){
                if(c.order=="ascend"){
                    this.sortOrder="asc";
                    this.sortField="id";
                    this.SourceList()
                }else if(c.order=="descend"){
                    this.sortOrder="desc";
                    this.sortField="id";
                    this.SourceList()
                }
            }else {
                this.sortOrder="";
                this.sortField="";
                this.SourceList();
            } 
        },
        //获取素材列表
        SourceList(){
        
            this.loading1=true;
            console.log(this.loading1);
            
            let opt={
                app_id:this.app_id.toString(),
                num_elements:this.pageSize,
                page:this.current_page,
                sortOrder:this.sortOrder?this.sortOrder:'',
                sortField:this.sortField?this.sortField:'',
                search:this.materialSearch,
                source_type:this.materialType||"",
                module_type:this.module_type
            }
            this.$req.CreativeSourceList(opt).then(res=>{
                if(res.data.code==200) {
                    let data =res.data.data;
                    console.log(data);
                    
                    
                    this.sourceList=JSON.parse(JSON.stringify(data));
                    
                    // Vue.set(this.sourceList,data,JSON.parse(JSON.stringify(data)))
                    this.sourceTotal=res.data.data.total;
                    console.log(this.sourceList);
                    this.loading1=false;
                    
                }else {
                    message.error(res.data.msg);
                    this.loading1=false;
                }
            }).catch(err=>{
                message.error(this.$t('appMaterial.unknownError'));
                this.loading1=false;
            })
        },
        //视频上传前处理
        beforeUpload(file){
            console.log(file);
            let _that=this;
            this.loading1=true;
            return new Promise(function(resolve,resject){
                let name=file.name.slice(0,file.name.length-4);
                console.log(name);
                let str=/[^\u4e00-\u9fa5\u0000-\u00ff]/g;
                let s=/%/g;
                let xhr=file.name.match(str);
                let doc=file.name.match(s);
                if(xhr||doc){
                    message.error(_that.$t('newCampaign.videoName'));
                    _that.loading1=false;
                    return resject(false)
                }
                const isLt10M = file.size / 1024 / 1024 <= 10;
                console.log(file.type);
                
                let isType=['video/mp4','video/MPEG','video/flv','video/F4V','video/AVI','video/wmv','video/rmvb','video/mov','video/3gpp'].indexOf(file.type) == -1;
                if (isType) {
                    message.error(_that.$t('newCampaign.videoForamt'));
                    _that.loading1=false;
                    return resject(false)
                }
                if (!isLt10M) {
                    message.error(_that.$t('newCampaign.videoSize'));
                    _that.loading1=false;
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
                        _that.loading1=false;
                        return resject(false)
                    }else if(!valid){
                        message.error(_that.$t('newCampaign.videoRatio'));
                        _that.loading1=false;
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
        //图片上传前处理
        imageBeforeUpload(file){
            console.log(file);
            let _that=this;
            this.loading1=true;
            return new Promise(function(resolve,resject){
                let name=file.name.slice(0,file.name.length-4);
                console.log(name);
                
                _that.upimageUrl=_that.uploadUrl+"?qqfile="+file.name;
                // console.log(this.upimageUrl);
                
                // let str=/^[\da-zA-Z\u4E00-\u9FA5\uF900-\uFA2D]+$/;
                let str=/[^\u4e00-\u9fa5\u0000-\u00ff]/g;
                let s=/%/g;
                let xhr=file.name.match(str);
                let doc=file.name.match(s);
                console.log(xhr);
                
                if(xhr||doc){
                    message.error(_that.$t('newCampaign.imageName'));
                    _that.loading1=false;
                    
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
                    return resolve(true);
                    
                    }
                }
                const isType=['image/png','image/jpg','image/gif','image/swf','image/jpeg'].indexOf(file.type) == -1;
                    if (isType) { 
                        message.error(_that.$t('newCampaign.imageForamt'));
                        _that.loading1=false;
                        return resject(false);
                    }
                    const isLt10M = file.size / 1024 / 1024 <= 10;
                    if (!isLt10M) {
                        message.error(_that.$t('newCampaign.imageSize'));
                        _that.loading1=false;
                        return resject(false);
                    }
                return !xhr&&!isType&&isLt10M
            })
            
        },
        //应用详情批量删除素材
        delSource(){
            if(this.source_id.length>=1){
                this.$confirm({
                    title: this.$t('appMaterial.deleteMaterial'),
                    content: this.$t('appMaterial.deleteMaterialContent'),
                    cancelText:this.$t('appMaterial.cancel'),
                    okText:this.$t('appMaterial.enter'),
                    onOk:()=> {
                        this.loading1=true; 
                        let id=[];
                        this.source_id.forEach((item,index)=>{
                            id.push(item.media_asset_id)
                        })
                        let opt={
                            app_id:this.app_id,
                            media_asset_id:id.toString(),
                        }
                        this.$req.deleteCreativeSource(opt).then(res=>{
                            if(res.data.code==200) {
                                message.success(this.$t('appMaterial.deleteSuccessful'))
                                this.SourceList();
                                this.source_id=[];
                                // this.rowSelection.selectedRowKeys=[];
                                this.$refs.source.clearSelection();
                                this.loading1=false; 
                            }else {
                                message.error(this.$t('appMaterial.deleteFailed'))
                                this.loading1=false; 
                            }
                        }).catch(err=>{
                            message.error(this.$t('appMaterial.unknownError'));
                            this.loading1=false; 
                        })
                    },
                    onCancel() {},
                });
            }
        },
        //删除单个素材
        delSources(e){
            this.$confirm({
                    title: this.$t('appMaterial.deleteMaterial'),
                    content: this.$t('appMaterial.deleteMaterialContent'),
                    cancelText:this.$t('appMaterial.cancel'),
                    okText:this.$t('appMaterial.enter'),
                    onOk:()=> {
                        this.loading1=true;
                        let appId=this.app_id.toString();
                        if(this.module_type!=null&&this.module_type!=''){
                            appId=0;
                        } 
                        let opt={
                            app_id:appId,
                            media_asset_id:e,
                        }
                        this.$req.deleteCreativeSource(opt).then(res=>{
                            if(res.data.code==200) {
                                message.success(this.$t('appMaterial.deleteSuccessful'))
                                this.SourceList();
                                this.source_id=[];
                                this.rowSelection.selectedRowKeys=[];
                                this.loading1=false; 
                            }else {
                                message.error(this.$t('appMaterial.deleteFailed'))
                                this.loading1=false; 
                            }
                        }).catch(err=>{
                            message.error(this.$t('appMaterial.unknownError'));
                            this.loading1=false; 
                        })
                    },
                    onCancel() {},
                });
        },
    },
    mounted(){
        this.SourceList("source");
        if(this.userInfo){
            this.paramsdata={
                type: 'video',
                member_id:this.userInfo.entity_id
            }
            this.imageData={
                type: 'image',
                member_id:this.userInfo.entity_id
            }
        }
        console.log(this.publisher_id);
        
    }
}
</script>

<style>
    .app_detail .icon{
        font-size: 64px;
        color:#909399;
        margin: 0;
    }
    .app_detail .icon-div{
        margin-top: 20px;
        height: 64px;
    }
    .app_detail .empty-div{
        height: 30px;
        line-height: 30px;
        margin-bottom: 20px;
    }
    .app_detail .purple{
        margin-right: 0 !important;
    }
    .app_detail .div--margin{
        margin-bottom: 20px;
    }
</style>

<style lang="less" scoped>
    .material{
        /deep/.ant-dropdown-placement-bottomLeft{
            .ant-upload-list-item {
                display: none;
            }
            .ant-dropdown-menu{
                .ant-dropdown-menu-item {
                    padding: 0;
                    .ant-dropdown-menu-title-content{
                        display: inline-block;
                        width: 100%;
                        .uploads{
                            display: inline-block;
                            width: 100%;
                            .ant-upload-select{
                                .ant-upload{
                                    display: inline-block;
                                    width: 100%;
                                    padding: 10px;
                                }
                            }
                        }
                        .ant-upload{
                            display: inline-block;
                            width: 100%;
                        }
                    }
                }
            }
        }
        .min {
            overflow:hidden; //超出的隐藏
            text-overflow:ellipsis;//省略号
            white-space:nowrap;//强制一行显示
        }
        /deep/.materialTitle{
            .materialContent{
                display: flex;
                justify-content: left;
                margin-bottom: 20px;
                .ant-input-search {
                    width: 400px;
                    margin-right: 16px;
                }
                .search {
                    width: 120px;

                }
            }
            
            
        }
        /deep/.materialOption{
            margin-bottom: 16px;
            height: 35px;
            position: relative;
            display: flex;
            .ant-dropdown-trigger{
               /*  display: flex;
                justify-content: space-between; */
                align-items: center;
                padding-left: 10px;
                padding-right: 10px;
                // color: #fff;
                // line-height: 35px;
                // border-radius: 10px;
                min-width: 120px;
                margin-right: 16px;
                // background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
            }
            // .uploadButtons{
            //     width: 150px;
            //     height: 35px;
            //     padding: 10px;
            //     margin-right: 20px;
            //     border-radius: 10px;
            //     color: #fff;
            //     background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
            //     display: flex;
            //     justify-content: space-between;
            //     align-items: center;
            // }
            .popovers{
                position: absolute;
                bottom: -80px;
                left: 0;
                width: 150px;
                border-radius: 5px;
                background-color: #fff;
                box-shadow: #aaa 3px 3px 8px;
                z-index: 999;
                .uploadbtn{
                    display: inline-block;
                    width: 150px;
                    height: 35px;
                    border-radius: 5px;
                    padding: 10px;
                    vertical-align: middle;
                    &:hover{
                        background-color: #f5f5f5;
                    }
                }
            }
            // .upload{
            //         width: 200px;
            //         height: 35px;
            //         line-height: 35px;
            //         margin-right: 20px;
            //         border: none;
            //         color: #fff;
            //         .ant-select-selector{
            //             border-radius: 5px;
            //             background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
            //             color: #fff;
            //             &:hover{
            //             border-color: #827af3;
            //             }
            //             &:focus{
            //                 border-color: #827af3;
            //             }
            //             .ant-select-selection-placeholder{
            //                 color: #fff;
            //             }
            //             .ant-select-arrow{
            //                 .ant-select-suffix{
            //                     color: #fff;
            //                 }
                            
            //             }
            //             .ant-select-selection-item{
            //                 .uploads{
            //                     height: 0;
            //                 }
            //                 .uploadbtn{
            //                     color: #fff;
            //                     height: 0;
            //                 }
            //             }
            //             .ant-select-item{
            //                 padding: 0;
            //             }

                        
            //         }
                
            // }
            // .ant-upload-list-item {
            //     display: none;
            // }
            // .uploads{
            //     margin-right: 20px;
            // }
            // .ant-select-item-option-content{
            //     .uploadbtn{
            //         display: inline-block;
            //         width: 200px;
            //         color: #000;
            //         width: 150px;
            //         height: 35px;
            //         border-radius: 10px;
            //         background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
            //     }
            // }
            .dangers{
                width: 120px;
                // height: 35px;
                // border: none;
                // border-radius: 10px; 
            }
            .dangers.is-disabled{
                background-color: #fab6b6;
            }
        }
        
        /deep/table{
            .thumbnails {
                height: 54px;
                width: 96px;
                // line-height: 54px;
                text-align: center;
                background: #eee;
                .thumbnail {
                    height: 54px;
                    width: 96px;
                    object-fit: contain;
                }
            }
            .el-table__expand-column{
                pointer-events: none;
                .el-icon{
                visibility: hidden;
                }
            }
            .typeImages{
                height: 2.7rem;
                width: 4.8rem;
                margin: auto;
                .typeImage{
                    height: 2.7rem;
                    width: 4.8rem;
                    object-fit: contain;
                }
            }
        }
        /deep/.ant-table-wrapper{
            margin-top: 20px;
            .ant-table-tbody{
                .ant-table-row {
                td {
                    padding: 10px;
                }
                }

            }
            .ant-table-body{
                .ant-table-expanded-row{
                    .expandVideo{
                        width: 1005;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        video{
                            height: 2.7rem;
                            width: 4.8rem;
                        }
                        
                }
                }
            
            }
        }
        /deep/.el-table{
            
                font-size: 12px;
        
        }
        // /deep/.el-table  tbody .el-table__expand-column .cell::before{
        //     content: v-bind(preview);
        //     float: left;
        //     font-size: 12px;
        //     padding-top: 0.01rem;
        //     color: #6577c8;
        // }
        // /deep/.el-table  tbody .el-table__expand-column .cell:hover:before{
        //     color: #8b9ade;
        //     text-decoration: underline;
        //     &:-moz-any{
        //         color: #475ab8;
        //     }
        // }
        // /deep/.el-table__expand-icon>.el-icon{
        //     margin-left: -10px!important;
        //     margin-top: -4px!important;
        // }
        /deep/.el-table__expanded-cell{
            text-align: center;
        }
        // /deep/.el-table__expand-column .cell{
        //     padding-top: 8px;
        // }
        // /deep/.el-table  tbody .expanded .el-table__expand-column .cell::before{
        //     content: v-bind(collapsePreview);
        //     float: left;
        //     font-size: 12px;
        //     padding-bottom: .05rem;
        //     color: #6577c8;
        // }
        // /deep/.el-table  tbody .el-table__expand-column .cell {
        //     line-height: normal;
        //     i {
        //     font-weight: 700;
        //     font-size: 12px;
        //     }
        //     i:before {
        //     content: "\e6e1";
        //     color: #6577c8;
        //     &:hover{
        //         color: #8b9ade;
        //     }
        //     &:active{
        //         color: #475ab8;
        //     }
        //     }
        // }
        // /deep/.el-table  tbody .expanded  .el-table__expand-column .cell {
        //     line-height: normal;
        //     i{
        //         font-weight: 700;
        //         top: 7px;
        //         width: .2rem;
        //         height: 1rem;
        //     }

        // }
        // .el-table__expand-icon>.el-icon {
        //     margin-left: -20px;
        // }
        // /deep/.el-table__expand-icon {
        //     transform: rotate(-180deg);
        //     width: v-bind(widths);
        //     height: .25rem;
        // }

        // /deep/.el-table .cell{
        //     padding-right: 0px;
        // }

        // /deep/.el-table  tbody .expanded  .el-table__expand-icon {
        //     transform: rotate(0deg);
        //     width: v-bind(widths);
        //     height: .3rem;
        //     i{
        //         font-weight: 700;
        //         font-size: 12px;
        //         width: .2rem;
        //         height: .2rem;
        //     }
        // }
        /deep/.ant-pagination {
            display: flex;
            justify-content: flex-end;
            margin-top: 16px;
            // .ant-pagination-prev,.ant-pagination-next{
            //     width: 30px;
            //     height: 30px;
            //     line-height: 30px;
            //     .ant-pagination-item-link{
            //         border-radius: 8px;
            //         background-color: #eaf5FF;
            //         border: none;
            //         .anticon-left,.anticon-right{
            //             color: #6577c8;
            //         }
                    
            //     }
            
            // }
            // .ant-select-selector{
            //     border-radius: 10px;
            //     &:focus{
            //     border-color: #6577c8;
            //     }
            // }
            // .ant-pagination-options-size-changer{
            // margin-top: 0;
            // .ant-select-selector {
            //     height: 30px;
            //     background-color: #fff;
            // }
            // }
            // .ant-pagination-options-quick-jumper{
            // height: 30px;
            // line-height: 30px;
            // input{
            //     border-radius: 5px;
            //     height: 30px;
            //     &:hover{
            //     border-color: #6577c8;
            //     }
            //     &:focus{
            //     border-color: #6577c8;
            //     }
            // }
            // }
            // .ant-pagination-item{
            // width: 30px;
            // height: 30px;
            // line-height: 30px;
            // border-radius: 8px;
            // }
            // .ant-pagination-item-active{
            // width: 30px;
            // height: 30px;
            // line-height: 30px;
            // border-radius: 8px;
            // background-color: #6577c8;
            // border: none;
            // a{
            //     color: #fff;
            // }
            // }
        }
        // .expand{
        //     color: #6475c7;
        //     &:hover{
        //     color: #8b9ade;
        //     }
        //     &:active{
        //     color: #475ab8;
        //     }
        // }
    
    }
</style>

<style>
    .material .el-table tbody .expanded .el-table__expand-column .cell i{
        height: 10px !important;
    }
    /* .material .el-table__expand-icon>.el-icon{
        top: 65% !important;
    } */
</style>