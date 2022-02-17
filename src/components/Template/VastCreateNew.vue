<template>
    <div class="vastCreateNew">
        <div class="vast-header">
            <div>
                {{$t('vastExtensions.VASTExtension')}}:{{message}}
                <!-- <span class="cursor-pointer" @click="cancel">{{$t('vastExtensions.Cancel')}}</span>
                <a-button type="primary" @click="save">
                    {{$t('vastExtensions.Save')}}
                </a-button> -->
            </div>
        </div>
        <table cellpadding="10">
            <tr>
                <td>{{$t('vastExtensions.Name')}} <span class="tag">*</span></td>
                <td><input type="text" class="vast-input" v-model="macorData['name']"></td>
            </tr>
            <tr class="tr-two">
                <td valign="top">{{$t('vastExtensions.Content')}} <span class="tag">*</span></td>
                <td>
                    <div>{{$t('vastExtensions.ContentMessage')}}</div>
                    <textarea :rows="4" v-model="macorData['content']"/>
                </td>
            </tr>
            <tr>
                <td valign="top">{{$t('vastExtensions.CustomMacro')}}</td>
                <td>
                    <div>{{$t('vastExtensions.CusMacMessage')}}</div>
                    <ul class="macros-ul" v-for="(value,index) in macorData['vastExtensionTemplateMacros']" :key="'item'+index">
                        <li>
                            <div class="macros-label">{{$t('vastExtensions.Name')}} <span class="tag">*</span>:</div>
                            <div class="macros-value">
                                <input type="text" class="vast-input" v-model="value['name']"/>
                                <div class="cursor-pointer" @click="delMacros(index)">X</div>
                            </div>
                        </li>
                        <li>
                            <div class="macros-label">{{$t('creativeTemplate.Code')}} <span class="tag">*</span>:</div>
                            <div class="macros-value"><input type="text" class="vast-input" v-model="value['code']"/></div>
                        </li>
                        <li>
                            <div class="macros-label"></div>
                            <div class="macros-value">
                                <input type="checkbox" :checked="value['is_required']=='1'?true:false" @change="reqChange(index)">
                                <span>{{$t('vastExtensions.Required')}}</span>
                            </div>
                        </li>
                        <li>
                            <div class="macros-label">{{$t('creativeTemplate.Default')}}:</div>
                            <div class="macros-value">
                                <a-radio-group v-if="value['type']=='true/false'" v-model="value['default_value']" size="small" :disabled="value['is_required']=='0'">
                                    <a-radio-button value=true>
                                        True
                                    </a-radio-button>
                                    <a-radio-button value=false>
                                        False
                                    </a-radio-button>
                                </a-radio-group>
                                <input type="text" class="vast-input" v-if="value['type']!='true/false'&&value['type']!='select from list'" v-model="value['default_value']" :disabled="value['is_required']=='0'" :placeholder="'Enter '+value['type']" />
                                <select v-if="value['type']=='select from list'" style="width: 180px" v-model="value['default_value']" :disabled="value['is_required']=='0'">
                                    <option :value="v" v-for="(v,i) in value['other_data']" :key="'type'+i">
                                        {{v}}
                                    </option>
                                </select>
                            </div>
                        </li>
                        <li>
                            <div class="macros-label">{{$t('creativeTemplate.Type')}} <span class="tag">*</span>:</div>
                            <div class="macros-value">
                                <select style="width: 180px" v-model="value['type']" @change="typeChange(index)">
                                    <option :value="v" v-for="(v,i) in type" :key="'type'+i">
                                        {{v}}
                                    </option>
                                </select>
                            </div>
                        </li>
                        <li class="option-li" v-if="value['type']=='select from list'">
                            <div v-for="(v,i) in value['other_data']" :key="'other_data'+i">
                                <div class="macros-label option-item">Option {{i+1}}</div>
                                <div class="macros-value">
                                    <input type="text" class="vast-input" v-model="value['other_data'][i]" placeholder="Enter a value"/>
                                    <span v-if="i!=0" class="cursor-pointer" @click="delOption(index,i)">X</span>
                                </div>
                            </div>
                            <a-button type="primary" @click="addOption(index)" :disabled="value['other_data'][value['other_data'].length-1]==''">{{$t('creativeTemplate.AddOptions')}}</a-button>
                        </li>
                        <hr>
                    </ul>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <a-button type="primary" @click="addMacor">{{$t('creativeTemplate.AddCustomMacro')}}</a-button>
                </td>
            </tr>
        </table>
        <div class="footer_btn">
            <a-button type="primary" class="save" @click="save">
                {{$t('vastExtensions.Save')}}
            </a-button>
            <a-button  @click="cancel">
                {{$t('vastExtensions.Cancel')}}
            </a-button>
        </div>
    </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>

    import store from "@/store";
import { message} from 'ant-design-vue';
    export default{
        data(){
            return{
                /* type:[
                    'true/false',
                    'string',
                    'url',
                    'integer',
                    'decimal',
                    'select from list'
                ], */
                type:[
                    'string',
                ],
                macorData:'',
                option:[''],
                message:'新建',
                loading:true
            }
        },
        methods: {
            cancel(){
                this.$router.push({path:'/hl/VastExtensions'});
            },
            typeChange(index){
                if(this.macorData.vastExtensionTemplateMacros[index]['type']=='true/false'){
                    this.macorData.vastExtensionTemplateMacros[index]['default_value']=true;
                }
                if(this.macorData.vastExtensionTemplateMacros[index]['type']=='select from list'){
                    this.macorData.vastExtensionTemplateMacros[index]['other_data']=[''];
                }
            },
            reqChange(index){
                this.macorData.vastExtensionTemplateMacros[index]['is_required']=this.macorData.vastExtensionTemplateMacros[index]['is_required']=='1'?'0':'1';
            },
            addMacor(){
                if(this.ifMacorNull()){
                    return;
                }
                this.macorData.vastExtensionTemplateMacros.push({
                    name:'',
                    code:'',
                    is_required:'1',
                    default_value:'',
                    other_data:[''],
                    type:'string',
                })
            },
            /* ifMacorNull(){
                let l=this.macorData.vastExtensionTemplateMacros.length;
                if(l>0){
                    if(this.macorData.vastExtensionTemplateMacros[l-1].name==''||
                        this.macorData.vastExtensionTemplateMacros[l-1].code==''||
                        this.macorData.vastExtensionTemplateMacros[l-1].is_required==''||
                        this.macorData.vastExtensionTemplateMacros[l-1].type==''){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }, */
            ifMacorNull(){
                let i;
                for(i=0;i<this.macorData.vastExtensionTemplateMacros.length;i++){
                    if(this.macorData.vastExtensionTemplateMacros[i].name==''||this.macorData.vastExtensionTemplateMacros[i].code==''){
                        message.warning('自定义宏带*的项为必填项!');
                        return true;
                    }
                    if(this.macorData.vastExtensionTemplateMacros[i].name!=this.macorData.vastExtensionTemplateMacros[i].code){
                        message.warning('自定义宏名称需和代码值一致!');
                        return true;
                    }
                }
                return false;
            },

            delMacros(index){
                this.macorData.vastExtensionTemplateMacros.splice(index,1);
            },
            addOption(index){
                this.macorData.vastExtensionTemplateMacros[index]['other_data'].push('');
            },
            delOption(index,i){
                this.macorData.vastExtensionTemplateMacros[index]['other_data'].splice(i,1);
            },
            save(){

                if(this.macorData.name==''||this.macorData.content==''){
                    message.warning('带*的项为必填项!');
                    return;
                }

                if(this.ifMacorNull()){
                    return;
                }

                if(this.validateXML(this.macorData.content)){
                    message.warning('请输入正确的XML格式内容!');
                    return;
                }

                if(this.ifCode()){
                    message.warning('自定义宏要和vast模板内容相对应!');
                    return;
                }

                let data={
                    content:this.macorData.content,
                    name:this.macorData.name
                }

                if(this.macorData.vastExtensionTemplateMacros.length>0){
                    data['macros']=this.macorData.vastExtensionTemplateMacros;
                    data.macros.forEach(item => {
                        if(item.other_data!=''&&item.other_data[0]==''){
                            item.other_data=item.other_data.join(",");
                        }else{
                            item.other_data='';
                        }
                    });
                    /* data['macros']=JSON.stringify(this.macorData.vastExtensionTemplateMacros); */
                    /* data['macros']=this.macorData.vastExtensionTemplateMacros */
                }

                if(this.macorData.id!=-1){
                    data.id=this.macorData.id;
                }

                /* console.log(data);
                console.log(this.macorData); */

                this.$req.operationVastExtension(data).then(res=>{
                    message.success(this.message+"vast模板成功！");
                    this.$router.push({path:'/hl/VastExtensions'});
                }).catch(err => {
                    message.error(this.message+"vast模板失败！");
                });

            },
            validateXML(xmlContent){
                //errorCode 0是xml正确，1是xml错误，2是无法验证
                var xmlDoc,errorMessage,errorCode = 0;
                // code for IE
                if (window.ActiveXObject){
                    xmlDoc  = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async="false";
                    xmlDoc.loadXML(xmlContent);

                    if(xmlDoc.parseError.errorCode!=0){
                        errorMessage="错误code: " + xmlDoc.parseError.errorCode + "\n";
                        errorMessage=errorMessage+"错误原因: " + xmlDoc.parseError.reason;
                        errorMessage=errorMessage+"错误位置: " + xmlDoc.parseError.line;
                        errorCode = 1;
                    }
                    else{
                        errorMessage = "格式正确";
                    }
                }
                // code for Mozilla, Firefox, Opera, chrome, safari,etc.
                else if (document.implementation.createDocument)
                {
                    var parser=new DOMParser();
                    xmlDoc = parser.parseFromString(xmlContent,"text/xml");
                    var error = xmlDoc.getElementsByTagName("parsererror");
                    if (error.length > 0)
                    {
                        if(xmlDoc.documentElement.nodeName=="parsererror"){
                            errorCode = 1;
                            errorMessage = xmlDoc.documentElement.childNodes[0].nodeValue;
                        }else{
                            errorCode = 1;
                            errorMessage = xmlDoc.getElementsByTagName("parsererror")[0].innerHTML;
                        }
                    }else{
                        errorMessage = "格式正确";
                    }
                }else{
                    errorCode = 2;
                    errorMessage = "浏览器不支持验证，无法验证xml正确性";
                }

                if(errorCode==0){
                    return false;
                }else{
                    /* console.log(errorMessage);
                    console.log(errorCode); */
                    return true;
                }
            },

            ifCode(){
                /*  code="#{"+this.customMacro.code+"}" */

                let i,j;

                let code = /\#\{(.+?)\}/g;
                let macro=this.macorData.content.match(code);

                for(i=0;i<this.macorData.vastExtensionTemplateMacros.length;i++){
                    if(this.macorData.content.indexOf('#{'+this.macorData.vastExtensionTemplateMacros[i].name+'}')==-1){
                        return true;
                    }
                }

                if(macro==null){
                    return false;
                }

                for(i=0;i<macro.length;i++){
                    for(j=0;j<this.macorData.vastExtensionTemplateMacros.length;j++){
                        if(macro[i]=='#{'+this.macorData.vastExtensionTemplateMacros[j].name+'}'){
                            break;
                        }
                    }
                    if(j>=this.macorData.vastExtensionTemplateMacros.length){
                        return true;
                    }
                } 
                return false;
            }
        },
        created() {
            // if (store.state.User.userAccessControl.ALLOW_ACCESS_TO_TOOLS) {
                let dataInfo=store.state.Temp.vastTemp;
                if(JSON.stringify(dataInfo)=='[]'||JSON.stringify(dataInfo)=='{}'||JSON.stringify(dataInfo)==''||dataInfo==""){
                    this.macorData={
                        id:-1,
                        content:'',
                        name:'',
                        member_id:'',
                        last_activity:'',
                        created_on:'',
                        deleted:'',
                        vastExtensionTemplateMacros:[]
                    }
                    this.message='新建';
                }else{
                    this.macorData=dataInfo;
                    dataInfo.vastExtensionTemplateMacros.forEach((item,index) => {
                        this.macorData.vastExtensionTemplateMacros[index]={
                            name: item.name,
                            code: item.code,
                            is_required: parseInt(item.is_required),
                            default_value: item.default_value,
                            other_data: item.other_data==null?item.other_data:item.other_data.split(","),
                            type: item.type_id,
                        }
                    });
                    /* this.macorData.vastExtensionTemplateMacros[is_required]=this.macorData.vastExtensionTemplateMacros[is_required]=="0"?false:true; */
                    this.message='编辑';
                }
            // } else {
            //     this.$router.push("/getlogin/login")
            // }
            
        }
    }

</script>

<style lang="less" scoped>

    .vastCreateNew{
        padding: 24px;
        background-color: #fff;
        border-radius: 10px;
    }

    .vast-header{
        margin-bottom: 10px;
    }

    .vast-header div{
        color: #6f6f6f;
        font-size: 16px;
        font-weight: 600;
    }

    /* .vast-header div>span{
        color: #1890ff;
        font-size: .4em;
        margin-left: 5px;
    } */

    /* .vastCreateNew .ant-btn-primary{
        background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
        border: none !important;
    } */

    /* .vast-header div>.ant-btn{
        height: 22px;
        padding: 0 10px;
        margin-left: 28px;
        font-size: .4em;
    } */

    .cursor-pointer{
        cursor: pointer;
    }

    .vastCreateNew table tr td:first-child{
        width: 300px;
    }

    .vastCreateNew table tr td{
        height: 32px;
        width: 740px;
    }

    .vastCreateNew table tr{
        display:inline-block;
        width: 100%;
        margin: 10px 0;
    }

    .tr-two textarea{
        width: 100%;
        font-size: .6em;
        padding: 8px;
        margin-top: 10px;
        border: 1px solid #d9d9d9;
    }

    .macros-ul{
        width: 480px;
        height: auto;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .macros-ul li{
        display: flex;
        width: 100%;
        height: 28px;
        margin: 5px 0;
        padding: 0;
        font-size: .8em;
        font-weight: 600;
    }

    .macros-ul hr{
        margin: 15px 0;
        border: 1px solid #d9d9d9;
    }

    .macros-label{
        width: 200px;
        height: 100%;
        line-height: 2;
    }

    .macros-value{
        display: flex;
        width: 280px;
        height: 100%;
        align-items: center;
    }

    .macros-value input[type='text']{
        height: 100%;
        width: 90%;
    }

    .macros-value>div{
        width: 10%;
        text-align: right;
    }

    .macros-value span{
        margin-left: 8px;
    }

    .vast-input{
        width: 100%;
        // font-size: 14px;
        // border: 1px solid #d9d9d9;
        // border-radius: 2px;
        // outline: none;
        // padding: 2px 5px;
    }

    .ant-radio-group{
        display: flex ;
        font-weight: 500;
    }

    // .macros-value select {
    //     border: 1px solid #d9d9d9;
    //     padding: 2px;
    // }

    .option-li{
        flex-direction: column;
        height: auto !important;
    }

    .option-li>div{
        display: flex;
        padding: 5px 0;
    }

    .option-li button{
        width: 140px;
        // height: 28px;
        // padding: 0 12px;
        // font-size: .6em;
        margin-left: 34px;
    }

    .option-item{
        padding-left: 16px;
    }

    .tag{
        color: #f00;
    }
    .footer_btn{
        text-align: center;
        .save{
            width: 150px;
            margin-right: 16px;
        }
    }

</style>