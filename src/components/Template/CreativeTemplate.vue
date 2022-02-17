<template>
    <div class="tem-content">
        <div class="top-content">
            <!-- <button @click="create">创建模板</button> -->
            <a-button type="primary" @click="create">{{$t('creativeTemplate.CreateTemplate')}}</a-button>
            <a-dropdown placement="bottomCenter" class="headerOperation" :disabled="!hasSelected">
                <template #overlay>
                    <a-menu class="header_dropdown">
                        <a-menu-item @click="handleMenuClick(0)" key="1">{{$t('creativeTemplate.Activate')}}</a-menu-item>
                        <a-menu-item @click="handleMenuClick(1)" key="2">{{$t('creativeTemplate.Archive')}}</a-menu-item>
                        <a-menu-item @click="handleMenuClick(2)" key="3">{{$t('creativeTemplate.Delete')}}</a-menu-item>
                        <a-menu-item @click="handleMenuClick(3)" key="4">{{$t('creativeTemplate.Duplicate')}}</a-menu-item>
                    </a-menu>
                </template>
                <a-button type="primary">{{$t('creativeTemplate.MoreActions')}}<i class="el-icon-arrow-down"></i></a-button>
            </a-dropdown>
        </div>

        <!-- :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange , getCheckboxProps:getCheckboxProps }" -->

        <div class="center-content">
            <a-table ref="table" rowKey="id" 
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange , getCheckboxProps:getCheckboxProps }"
                :columns="columns" 
                :data-source="dataInfo" 
                :customRow="Rowclick" 
                :pagination="false"
                :loading="tableLoading">

                <template #template_owner="{record}">
                    <span>
                        {{ record.template_owner }}
                    </span>
                </template>

                <template #is_archived="{record}">
                    <span>
                        {{record.is_archived=='0'?$t('creativeTemplate.Activate'):$t('creativeTemplate.Archive')}}
                    </span>
                </template>

                <template #is_default="{record}">
                    <span>
                        {{record.is_default=='1'?$t('creativeTemplate.Yes'):$t('creativeTemplate.No')}}
                    </span>
                </template>

            </a-table>

            <a-pagination 
                :default-current="current" 
                :page-size-options="pageSizeOptions"
                :total="total" 
                show-size-changer
                :page-size="pageSize"
                @showSizeChange="onShowSizeChange"
                @change="onChangePag">
                <template #buildOptionText="props">
                    <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
                </template>
            </a-pagination>
        </div>
        <div class="model" v-if="floag">
            <div class="model-main">
                <div class="model-title">
                    <span>{{$t('creativeTemplate.CreateTemplate')}}</span>
                    <div class="close" @click="close"><i class="el-icon-close"></i></div>
                </div>
                <div class="model-content">
                    <div class="tab-title">
                        <div class="tab-title-tem" :class="{'liked':isLike==true}" @click="onSelect(true)">{{$t('creativeTemplate.TemplateDetails')}}</div>
                        <div class="tab-title-pre" :class="{'liked':isLike==false}" @click="onSelect(false)">{{$t('creativeTemplate.Preview')}}</div>
                    </div>
                    <div class="tab-tem" v-if="isLike">
                        <div class="tab-tem-left">
                            <form>
                                <ul class="tem-form">
                                    <li>
                                        <div class="item-th">{{$t('creativeTemplate.Name')}} <span class="tag">*</span>:</div>
                                        <div class="item-td"><input type="text" v-model="iniData.name" ></div>
                                    </li>
                                    <li>
                                        <div class="item-th">{{$t('creativeTemplate.MediaType')}} <span class="tag">*</span>:</div>
                                        <div class="item-td">
                                            <select v-model="iniData.mediaType">
                                                <option v-for="(value,index) in mediaTypeList" v-bind:value="index" :key="value.id">{{value.name}}</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="item-th">{{$t('creativeTemplate.Format')}} <span class="tag">*</span>:</div>
                                        <div class="item-td">
                                            <select v-model="iniData.format" @change="clickFormat($event)">
                                                <option v-for="(value,index) in formatList" v-bind:value="index" :key="index">{{value.name}}</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="item-th">{{$t('creativeTemplate.Default')}} <span class="tag">*</span>:</div>
                                        <div class="item-td"><input type="checkbox" v-model="iniData.default"></div>
                                    </li>
                                    <li>
                                        <div class="item-th">{{$t('creativeTemplate.CodeFormat')}} <span class="tag">*</span>:</div>
                                        <div class="item-td">{{iniData.codeFormat}}</div>
                                    </li>
                                    <li>
                                        <div class="item-th">{{$t('creativeTemplate.Code')}} <span class="tag">*</span>:</div>
                                        <div class="item-td"><textarea v-model="iniData.code"></textarea></div>
                                    </li>
                                    <li v-if="mediaTypeList[iniData.mediaType].media_type_id=='2'">
                                        <div class="item-th">Pop Callback HTML::</div>
                                        <div class="item-td"><textarea v-model="iniData.callback"></textarea></div>
                                    </li>
                                </ul>
                            </form>
                        </div>
                        <div class="tab-tem-right">
                            <ul>
                                <li>
                                    <div class="tab-tem-right-th">{{$t('creativeTemplate.Macros')}}:</div>
                                    <div class="tab-tem-right-td">
                                        <!-- <table>
                                            <tbody>
                                                <tr><td colspan="2">You can use the following appnexus macros in your code (hover over macros for descriptions):</td></tr>
                                                <tr v-for="(value,index) in this.macrosTable" :key="index">
                                                    <td>${AUCTION_ID}</td><td>${CACHEBUSTER}</td>
                                                </tr>
                                            </tbody>
                                        </table> -->
                                        <div class="item-table">
                                            <div class="item-table-th">{{$t('creativeTemplate.MacrosMessage')}}:</div>
                                            <div class="item-table-td" v-for="(value,index) in macrosTable[macrosNub]" :key="index">{{value}}</div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="tab-tem-right-th">{{$t('creativeTemplate.Custom')}}</div>
                                    <div class="tab-tem-right-td">{{$t('creativeTemplate.CustomMessage')}}</div>
                                </li>
                                <li>
                                    <div class="tab-tem-right-th">{{$t('creativeTemplate.Macros')}}:</div>
                                    <div class="tab-tem-right-td">
                                        <span class="linkBtn" @click="addMacro">+{{$t('creativeTemplate.AddCustomMacro')}}</span>
                                        <div class="add-macro-table" v-for="(item,index) in customMacro" :key="index">
                                            <table>
                                                <tr>
                                                    <td>{{$t('creativeTemplate.Macros')}} <span class="tag">*</span>:</td>
                                                    <td>#{<input type="text" v-model="item.code">}</td>
                                                </tr>
                                                <tr>
                                                    <td>{{$t('creativeTemplate.Name')}} <span class="tag">*</span>:</td>
                                                    <td><input type="text" v-model="item.name"></td>
                                                </tr>
                                                <tr>
                                                    <td>{{$t('creativeTemplate.Type')}} <span class="tag">*</span>:</td>
                                                    <td>
                                                        <select v-model="item.type">
                                                            <option v-for="(value,index) in typeList" :key="'type'+index" :value="value">{{value}}</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr v-if="item.type==typeList[5]">
                                                    <td>列表中选择(逗号隔开):</td>
                                                    <td>
                                                        <input type="text" v-model="item.other_data">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>必选 <span class="tag">*</span>:</td>
                                                    <td>
                                                        <input type="checkbox" v-model="item.is_required"/>
                                                    </td>
                                                </tr>
                                                <tr v-if="!item.is_required">
                                                    <td>默认值:</td>
                                                    <td>
                                                        <input type="text" v-if="item.type!=typeList[2]" v-model="item.default_value">
                                                        <input type="checkbox" v-else v-model="item.default_value"/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td class="btn-right">
                                                        <!-- <button>添加</button> -->
                                                        <button @click="removeMacro(index)">取消</button>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="tab-pre" v-else>
                        <div class="tab-pre-left">
                            <div class="tab-pre-title">
                                <!-- Select Creative to Preview -->  
                                选择要预览的广告素材                             
                            </div>
                            <table>
                                <tr>
                                    <td><a-radio checked>新建</a-radio></td>
                                </tr>
                                <tr>
                                    <td>类型</td>
                                    <td>
                                        <a-radio-group name="radioGroupType" :default-value="1" @change="isUpload=!isUpload">
                                            <a-radio :value="1">Upload</a-radio>
                                            <a-radio :value="2">Third-Party</a-radio>
                                        </a-radio-group>
                                    </td>
                                </tr>
                                <tr v-if="isUpload">
                                    <td></td>
                                    <td>
                                        <button @click="clickFile">浏览...</button>
                                        <input id="fileBrowse" type="file" style="display:none"/>
                                    </td>
                                </tr>
                                <tr v-if="isUpload">
                                    <td></td>
                                    <td>支持的文件类型为jpg、gif、png和swf。</td>
                                </tr>
                                <tr v-if="!isUpload">
                                    <td>登录页面网址</td>
                                    <td><input type="text"/></td>
                                </tr>
                                <tr>
                                    <td>Flash变量</td>
                                    <td><input type="text"/></td>
                                </tr>
                                <tr>
                                    <td>尺寸</td>
                                    <td>
                                        宽：<input class="text-width" type="text">
                                        高：<input class="text-width" type="text">
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3"><a-radio>现有广告素材</a-radio></td>
                                </tr>
                            </table>
                            <div class="table-pre-leftBtm">
                                <div class="tab-pre-title">选择预览类型</div>
                                <a-radio-group name="radioGroupPreType" :default-value="1">
                                    <div><a-radio :value='1'>IFrame</a-radio></div>
                                    <div><a-radio :value='2'>JavaScript</a-radio></div>
                                </a-radio-group>
                                <div><button>在新窗口中预览</button></div>
                            </div>
                        </div>
                        <div class="tab-pre-right">
                            <div class="tab-pre-title">
                                设置宏值
                            </div>
                            <div>
                                此模板没有其他选项 
                            </div>
                        </div>
                    </div>
                    <div class="bottom-btn">
                        <button class="save" @click="save">保存</button>
                        <button class="cancel" @click="close">取消</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- {{dataInfo[dataIndex]}} -->

        <a-modal
            title="复制模板"
            :visible="copyVisible"
            @ok="copyHandleOk"
            @cancel="copyHandleCancel"
            >

            <ul class="copy-model">
                <li>
                    <div>id</div>
                    <div>name</div>
                </li>
                <li v-for="(item,key) in copyData" :key="key">
                    <div>{{item.id}}</div>
                    <div><input type="text" v-model="item.name"></div>
                </li>
            </ul>

        </a-modal>

        <a-drawer
            title="创意模板详情"
            placement="bottom"
            height="380"
            :closable="false"
            :visible="visible"
            @close="onClose">
            <div v-if="!(data['template_owner'] === 'admobilex' && userInfo!== 'admobilex')" class="model-edit">
                <a-button type="primary" @click="editBtn">编辑</a-button>
            </div>
            <table class="model-table">
                <tr>
                    <td>ID:</td>
                    <td>{{data['id']}}</td>
                </tr>
                <tr>
                    <td>名称:</td>
                    <td>{{data['name']}}</td>
                </tr>
                <tr>
                    <td>媒体类型:</td>
                    <td>{{data['media_subtype.name']}}</td>
                </tr>
                <tr>
                    <td>格式:</td>
                    <td>{{data['format.name']}}</td>
                </tr>
                <tr>
                    <td>默认?:</td>
                    <td>{{data['is_default']=='1'?'是':'否'}}</td>
                </tr>
                <tr>
                    <td>代码:</td>
                    <td>
                        <textarea :value="data['content_js']" disabled></textarea>
                    </td>
                </tr>
            </table>
        </a-drawer> 

    </div>
</template>

<style scoped>
    @import "../../assets/css/templateTable.css";
</style>
<style scoped>
    @import "../../assets/css/index.css";
</style>

<script>

/* import {getTemplate,creativeFormat,mediaSubtype} from '@/utils/request.js' */
import store from '@/store';
import { message} from 'ant-design-vue';
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: '名称',
        dataIndex: 'name',
    },
    {
        title: '媒体类型',
        dataIndex: 'media_subtype.name',
    },
    {
        title: '格式',
        dataIndex: 'format.name',
    },
    {
        title: '模板所有者',
        dataIndex: 'template_owner',
        slots: { customRender: 'template_owner' },
    },
    {
        title: '状态',
        dataIndex: 'is_archived',
        slots: { customRender: 'is_archived' },
    },
    {
        title:'默认?',
        dataIndex:'is_default',
        slots: { customRender: 'is_default' },
    },
];

export default {
    data() {
        return {
            /* pagination:{
                pageSize:1,
                current:20,
                total:100
            }, */
            /* loading:false, */
            /* columns, */
            floag:false,
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form: {
                name: '',
                region: undefined,
                date1: undefined,
                delivery: false,
                type: [],
                resource: '',
                desc: '',
            },
            isLike:true,
            dataIndex:0,
            dataInfo:[
                /* {
                    name:'undefined',
                    id:'undefined',
                    format:{
                        name:'undefined'
                    },
                    content_js:'undefined'
                } */
            ],
            customMacro:[],
            macrosNub:0,
            macrosTable:[
                [
                    '${AUCTION_ID}',
                    '${CACHEBUSTER}',
                    '${CLICK_URL}',
                    '${CLICK_URL_ENC}',
                    '${CREATIVE_ID}',
                    '${CREATIVE_HEIGHT}',
                    '${CREATIVE_WIDTH}',
                    '${FLASHVARS}',
                    '${FLASH_BACKUP_URL}',
                    '${MEDIA_URL}',
                    '${MEDIA_URL_AND_FLASHVARS}',
                    '${MEDIA_URL_ENC}',
                    '${MEDIA_TYPE}',
                    '${MEDIA_SUBTYPE}'
                ],
                [
                    
                    '${AUCTION_ID}',
                    '${CACHEBUSTER}',
                    '${CLICK_URL}',
                    '${CLICK_URL_ENC}',
                    '${CONTENT}',	
                    '${CREATIVE_ID}',
                    '${CREATIVE_HEIGHT}',	
                    '${CREATIVE_WIDTH}',
                    '${MEDIA_TYPE}',	
                    '${MEDIA_SUBTYPE}'
                ],
                [
                    
                    '${AUCTION_ID}',	
                    '${CACHEBUSTER}',
                    '${CLICK_URL}',	
                    '${CLICK_URL_ENC}',
                    '${CREATIVE_ID}',	
                    '${CREATIVE_HEIGHT}',
                    '${CREATIVE_WIDTH}',	
                    '${MEDIA_URL}',
                    '${MEDIA_URL_ENC}',	
                    '${MEDIA_TYPE}',
                    '${MEDIA_SUBTYPE}'
                ],
                [
                    '${AUCTION_ID}',	
                    '${CACHEBUSTER}',
                    '${CLICK_URL}',	
                    '${CLICK_URL_ENC}',
                    '${CREATIVE_ID}',	
                    '${CREATIVE_HEIGHT}',
                    '${CREATIVE_WIDTH}',	
                    '${MEDIA_TYPE}',
                    '${MEDIA_SUBTYPE}'
                ],
                /* html和javascript共用一个 */
                [
                    '${AUCTION_ID}',	
                    '${CACHEBUSTER}',
                    '${CLICK_URL}',	
                    '${CLICK_URL_ENC}',
                    '${CONTENT}',	
                    '${CREATIVE_ID}',
                    '${CREATIVE_HEIGHT}',	
                    '${CREATIVE_WIDTH}',
                    '${MEDIA_TYPE}',	
                    '${MEDIA_SUBTYPE}'
                ],
                [
                    '${AUCTION_ID}',	
                    '${CACHEBUSTER}',
                    '${CLICK_URL}',	
                    '${CLICK_URL_ENC}',
                    '${CREATIVE_ID}',	
                    '${CREATIVE_HEIGHT}',
                    '${CREATIVE_WIDTH}',	
                    '${MEDIA_TYPE}',
                    '${MEDIA_SUBTYPE}'
                ],
                [
                    '${AUCTION_ID}',	
                    '${CACHEBUSTER}',
                    '${CLICK_URL}',	
                    '${CLICK_URL_ENC}',
                    '${CREATIVE_ID}',	
                    '${CREATIVE_HEIGHT}',
                    '${CREATIVE_WIDTH}',	
                    '${FLASH_BACKUP_URL}',
                    '${MEDIA_URL}',	
                    '${MEDIA_URL_ENC}',
                    '${MEDIA_TYPE}',	
                    '${MEDIA_SUBTYPE}'
                ],
                /* External HTML、External javascript、External XML共用一个 */
                [
                    '${AUCTION_ID}',	
                    '${CACHEBUSTER}',
                    '${CLICK_URL}',	
                    '${CLICK_URL_ENC}',
                    '${CREATIVE_ID}',	
                    '${CREATIVE_HEIGHT}',
                    '${CREATIVE_WIDTH}',	
                    '${MEDIA_URL}',
                    '${MEDIA_URL_ENC}',	
                    '${MEDIA_TYPE}',
                    '${MEDIA_SUBTYPE}'
                ],
            ],
            columns,
            iniData:{
                name:'',
                mediaType:0,
                format:0,
                default:false,
                code:''
            },
            mediaTypeList:[],
            /* mediaTypeList:[
                'Banner:Standard Banner',
                'POP:popup',
                'Banner:In-Banner Video',
                'Pop: Popunder',
                'Interstitial: Interstitial',
                'Pop: Popup,Popunder',
                'Video: DEPRECATED 15-Second VAST',
                'Video: DEPRECATED 30-Second VAST',
                'Text: Text',
                'Expandable: Other Expandable',
                'Expandable: MediaMind',
                'Expandable: Pointroll',
                'Expandable: EyeWonder',
                'Expandable: EyeReturn',
                'Expandable: Pictela',
                'Expandable: Flashtalking',
                'Expandable: Doubleclick',
                'Expandable: Unicast',
                'Expandable: Spongecell',
                'Expandable: Adrime',
                'Interstitial: Layer',
                'Interstitial: Slide-in',
                'Video: DEPRECATED Other VAST',
                'Expandable: Oggifinogi',
                'test: test2',
                'test: test3',
                'Expandable: test4',
                'Expandable: test4',
                'Skin: Custom',
                'Skin: Hi-Media Skin',
                'Image and Text: Outlook.com',
                'High Impact: ReactX Left/Right',
                'High Impact: ReactX Top',
                'High Impact: ReactX Bottom',
                'High Impact: ReactX Custom',
                'Video: 20-Second VAST',
                'High Impact: ReactX Over',
                'High Impact: ReactX Native',
                'High Impact: Lightbox',
                'High Impact: Footer',
                'High Impact: Slide-in',
                'High Impact: Peel',
                'High Impact: Custom',
                'Native: In-Feed Standard',
                'Text: Billboard',
                'Native: In-Feed Mediated',
                'Native: Content Marketing',
                'test: test4.1',
                'Audio: test for audio switch',
                'Audio: 15-second',
                'Audio: 30-second',
                'Audio: Other',
                'Native: Native - All',
                'Video: Standard VAST1'
            ], */
            formatList:[],
            /* formatList:[
                'JavaScript',
                'Iframe',
                'Image',
                'native',
                'HTML',
                'Text',
                'External File',
                'External HTML',
                'External JavaScript',
                'External XML'
            ], */
            /* typeList:['String','URL','True/False','Integer','Decimal','Select from list'], */
            typeList:['String'],
            btnText:'down',
            isText:false,
            isUpload:true,
            total:0,
            current:1,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            pageSize: 10,
            visible:false,
            data:{
                'id':'',
                'name':'',
                'format.name':'',
                'template_owner':'',
                'macros':{
                    'code':''
                }
            },
            code:'',
            selectedRowKeys:[],
            copyData:[{
                'id':'name',
            }],
            copyVisible:false,
            tableLoading:true,
            userInfo:'',
            features:{},
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
            
                if (this.features.ALLOW_ACCESS_TO_TOOLS) {
                
                    store.dispatch("Util/Loading", false);

                    this.userInfo=res.data.data.username;
                    this.$req.creativeFormat().then(res=>{
                        this.formatList=res.data.data;
                    }),
                    this.$req.mediaSubtype().then(res=>{
                        this.mediaTypeList=res.data.data;
                    }),
                    this.getTemplate(1,10);
                
                } else {
                    store.dispatch("Util/Loading", false);
                    this.$router.push("/getlogin/login")
                
                }
            }else {
                store.dispatch("Util/Loading", false);
            }
        })
        
    },
    computed: {
        hasSelected() {
            return this.selectedRowKeys.length > 0;
        },
        /* rowSelection() {
            console.log("dddddddddddddd")
            return {
                onChange: (selectedRowKeys) => {
                    this.selectedRowKeys = selectedRowKeys;
                },
                getCheckboxProps: record => ({
                    props: {
                        disabled: record.template_owner === 'admobilex' && this.userInfo!== 'admobilex',
                        template_owner: record.template_owner,
                    },
                }),
            }
        } */
    },
    methods: {
        close(){
            this.floag=false;
        },
        create(){
            this.iniData={
                id:-1,
                name:'',
                mediaType:0,
                format:0,
                default:true,
                codeFormat:'js',
                code:'',
                callback:''
            };
            this.customMacro=[];
            this.floag=true;
        },
        onSelect(value){
            this.isLike=value;
        },
        save(){

            if(this.iniData.name==''||this.iniData.code==''||this.ifMacorNull()){
                message.warning('*为必填项！');
                return;
            }

            if(this.ifCode()){
                message.warning('自定义宏和代码里的宏要相对应！');
                return;
            }

            let messages='新建';

            let data={
                /* id:parseInt(this.data[this.data.length-1].id)+1, */
                name: this.iniData.name,
                media_subtype: parseInt(this.mediaTypeList[this.iniData.mediaType].id),
                format: parseInt(this.formatList[this.iniData.format].id),
                code_format: this.iniData.codeFormat,
                content: this.iniData.code,
                callback_content_html: this.iniData.callback,
                is_default: this.iniData.default==true?1:0
            }

            this.customMacro.forEach(value => {
                value.is_required=value.is_required==true?1:0;
            });

            if(this.customMacro.length>0){
                data.macros= JSON.stringify(this.customMacro);
                /* data['macros']= this.customMacro; */
            }

            if(this.iniData.id!=-1){
                messages='编辑';
                data.id=this.iniData.id;
            }

            this.$req.saveTemplate(data).then(res=>{
                
                if(res.data.code==-1){
                    let str = res.data.msg.replace('flash397/usr/local/adnxs/hbapi/app/service/TemplateService.php','');
                    message.warning(str);
                    return;
                }
                message.success(messages+"创意模板成功！");
                this.getTemplate(this.current,this.pageSize);
                this.floag=false;
            }).catch(err => {
                message.error(messages+"创意模板失败！");
            });

        },
        addMacro(){

            if(this.ifMacorNull()){
                message.warning('*为必填项！');
                return;
            }

            this.customMacro.push({
                name:'',
                code:'',
                type:'String',
                is_required	:false,
                default_value:'',
                other_data:''
            })  
        },
        ifMacorNull(){
            let l=this.customMacro.length;
            if(l>0){
                if(this.customMacro[l-1].name==''||this.customMacro[l-1].code==''){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        },
        removeMacro(index){
            this.customMacro.splice(index,1);
        },
        botBtn(){
            if(this.isText){
                document.getElementById('modelTable').style.display='block';
                this.btnText='down';
            }
            else{
                document.getElementById('modelTable').style.display='none';
                this.btnText='up';
            }
            this.isText=!this.isText;
        },
        clickFile(){
            document.getElementById('fileBrowse').click();
        },
        clickFormat(event){
            let index = parseInt(event.target.value); //获取option对应的value值
            if(index==5){
                this.macrosNub=4;
            }else if(index>5&&index<8){
                this.macrosNub=index-1;
            }else if(index>=8&&index<=10){
                this.macrosNub=7;
            }else{
                this.macrosNub=index;
            }
        },
        Rowclick(row,index){
            return {
                onclick: () => {
                    this.dataIndex=index;
                    this.data=row;
                    this.visible=true;
                }
            }
            /* this.data=row;
            this.visible=true; */
        },

        editBtn(){
            var mediaType,format;
            for(let i=0;i<this.mediaTypeList.length;i++){
                if(this.mediaTypeList[i].id==this.data.media_subtype_id){
                    mediaType=i;
                }
            }
            for(let i=0;i<this.formatList.length;i++){
                if(this.formatList[i].id==this.data.format_id){
                    format=i;
                }
            }
            this.iniData={
                id:parseInt(this.data.id),
                name: this.data.name,
                mediaType: mediaType,
                format: format,
                default: this.data.is_default=="1"?true:false,
                codeFormat:'js',
                code: this.data.content_js,
                callback: this.data.callback_content_html
            };

            this.customMacro=[];
            if(JSON.stringify(this.data.macros)!="[]"){
                this.customMacro=this.data.macros;
                this.customMacro.forEach(item => {
                    item.type=this.typeList[parseInt(item.type_id)-1];
                    item.is_required=item.is_required=='1'?true:false;
                });
            }
            this.visible=false;
            this.floag=true;
        },
        onClose(){
            this.visible = false;
        },
        onChangePag(current){
            this.current=current;
            this.getTemplate(current,this.pageSize);
        },
        onShowSizeChange(current, pageSize) {
            this.pageSize = pageSize;
            this.getTemplate(current,pageSize);
        },
        getTemplate(current,pageSize){
            this.tableLoading=true;
            this.$req.getTemplate(current,pageSize).then(res=>{
                this.tableLoading=false;
                this.dataInfo=res.data.data.templates;
                this.total=res.data.data.count;
            }).catch(err => {
                this.tableLoading=false;
            });
        },
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },
        getCheckboxProps(record){
            return {disabled:record.template_owner === 'admobilex' && this.userInfo!== 'admobilex'}
        },
        handleMenuClick(e){
            let messages;
            let data={
                template_ids:this.selectedRowKeys.join(",")
            };
            switch(e){
                case 0:  data.bulk_action='activate'; messages='激活'; break;
                case 1:  data.bulk_action='archive'; messages='失活'; ;break;
                case 2:  data.bulk_action='delete'; messages='删除'; break;
                case 3:  this.copyTemp();return;
            }
            this.$req.bulkTemplate(data).then(res=>{

                if(res.data.code==200){
                    message.success(messages+"创意模板成功！");
                    this.selectedRowKeys=[];
                    this.getTemplate(this.current,this.pageSize);
                    return;
                }
                message.error(messages+"创意模板失败！");
            }).catch(err => {
                message.error(messages+"创意模板失败！");
            });
        },
        copyTemp(){

            this.copyData=[];

            this.selectedRowKeys.forEach(item => {
                let d=this.dataInfo.find(value=>value.id==item);

                this.copyData.push({
                    id:d.id,
                    name:'copy'+d.name
                });
            });

            this.copyVisible=true;

        },
        copyHandleOk(){
            /* let key=d.id;
                let json={};
                json[key]=d.name; */
            let data={
                template_ids:this.selectedRowKeys.join(","),
                bulk_action:'duplicate',
            };
            let d={};
            this.copyData.forEach(item => {
                let key=item.id;
                d[key]=item.name;
            });

            data.rename=JSON.stringify(d);

            this.$req.bulkTemplate(data).then(res=>{
                message.success("复制创意模板成功！");
                this.getTemplate(this.current,this.pageSize);
            }).catch(err => {
                message.error("复制创意模板失败！");
            });

            this.copyVisible=false;
        },
        copyHandleCancel(){
            this.copyVisible=false;
        },
        ifCode(){
            /*  code="#{"+this.customMacro.code+"}" */

            let i,j;

            let code = /\#\{(.+?)\}/g;
            let macro=this.iniData.code.match(code);

            for(i=0;i<this.customMacro.length;i++){
                if(this.iniData.code.indexOf('#{'+this.customMacro[i].code+'}')==-1){
                    return true;
                }
            }

            if(macro==null){
                return false;
            }

            for(i=0;i<macro.length;i++){
                for(j=0;j<this.customMacro.length;j++){
                    if(macro[i]=='#{'+this.customMacro[j].code+'}'){
                        break;
                    }
                }
                if(j>=this.customMacro.length){
                    return true;
                }
            } 
            return false;
        }
    }
};
</script>