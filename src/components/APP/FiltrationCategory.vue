<template>
    <div class="filtrationCategory">
        <a-checkbox-group v-model:value="checkList">
            <a-checkbox :value="value.id" v-for="(value,key) in language=='zh'?filtrationZh:filtrationEn" :key="key">{{value.name}}</a-checkbox>
        </a-checkbox-group>
        <!-- <div class="btnCategory">
            <a-button type="primary" class="saves" @click="filtrSetting">{{$t('myApp.save')}}</a-button>
        </div> -->
    </div>
</template>
<script>
import store from '@/store';
import { useI18n } from 'vue-i18n';
import { message} from 'ant-design-vue';
import { defineComponent, ref, reactive } from "vue"
export default {
    name:"filtrationCategory",
    props:["appInfo"],
    data(){
        return{
            checkList:[],
            list:[],
            filtrationZh:[],
            filtrationEn:[],
            language:"",
        }
    },
    methods:{
        filtrSetting(){
            this.$emit("filtrSetting",this.checkList);
        },
        getlist(){
            store.dispatch("Util/Loading",true);
            this.$req.appCategoryList({
                platform:this.appInfo.platform=="1"?1:0,
                app_id:this.appInfo.id
            }).then(res=>{
                console.log(res)
            if(res.data.code==200){
                this.checkList=[];
                this.filtrationZh=res.data.data.map((value,index)=>{
                    return {
                        name:value.cn_value,
                        id:value.id
                    }
                })
                this.filtrationEn=res.data.data.map((value,index)=>{
                    return {
                        name:value.en_value,
                        id:value.id
                    }
                })
                this.list=res.data.data;
                res.data.data.forEach((value,index)=>{
                    if(value.status!="trusted"){
                        this.checkList.push(value.id)
                    }
                })
                store.dispatch("Util/Loading",false);
            }else {
                store.dispatch("Util/Loading",false);
                message.success(this.$t('myApp.unknownError'))
            }
            }).catch(err=>{
                store.dispatch("Util/Loading",false);
                message.success(this.$t('myApp.unknownError'))
            })
        }
    },
    mounted(){
        this.language = store.state.Util.language;
        console.log(this.language);
        
        const { t } = useI18n();
        this.getlist();
        
    }
}

</script>

<style lang="less" >
.filtrationCategory{
    .btnCategory{
        display: flex;
        justify-content: center;
        .saves{
        width: 1.2rem;
        height: 0.35rem;
        border-radius: 10px;
        border: none;
        margin-top: 20px;
        background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
    }
    }
    .ant-checkbox-group{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .ant-checkbox-wrapper{
            width: 200px;
            margin-top: 5px;
            margin-left: 0;
        }
    }
}
    
</style>