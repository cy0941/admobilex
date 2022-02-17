<template>
    <div class="vastExtension">
        <div class="vast-header">
            {{$t('vastExtensions.TemplateManager')}}：<span>{{$t('vastExtensions.VASTExtension')}}</span>
        </div>
        <a-button type="primary" @click="newExtBtn">
            <a-icon type="plus" />{{$t('vastExtensions.NewExtension')}}
        </a-button>
        <a-table :columns="columns" :data-source="dataInfo" :pagination="false" rowKey="id" :customRow="Rowclick" :loading="tableLoading"></a-table>
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
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>

    import { TempStore } from "vuex";
    import store from "@/store";
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        }
    ]

  export default{
    data(){
        return{
            total:0,
            current:1,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            pageSize: 10,
            dataInfo:[],
            columns,
            tableLoading:true,
            features:{},
        }
    },
    methods: {
        onShowSizeChange(current,pageSize){
            console.log(current+","+pageSize);
            this.current=current;
            this.pageSize=pageSize;
            this.vastExtension(current,pageSize);
            
        },
        onChangePag(current){
            this.current=current;
            this.vastExtension(current,this.pageSize);
        },
        vastExtension(current,pageSize){
            this.tableLoading=true;
            this.$req.vastExtension(current,pageSize).then(res=>{
                this.tableLoading=false;
                if(res.data.code==200){
                    this.total=res.data.data.count;
                    this.dataInfo=res.data.data.vast_extension_template;                    
                }
                console.log(this.dataInfo);
                
            }).catch(err => {
                this.tableLoading=false;
            });
        },
        newExtBtn(){
            store.commit('Temp/setVastTemp','');
            this.$router.push({path:'/hl/VastCreateNew'});
        },
        Rowclick(record, index){
            return {
                onclick: () => {
                    /* console.log(record, index)
                    console.log('点击行内容record' + record)
                    console.log('序号索引index' + index) */
                    /* console.log(index);
                    console.log(); */
                    store.dispatch("Temp/vastTemp", this.dataInfo[index]);
                    /* store.commit('Temp/setCurrentIndex', index); */
                    this.$router.push({path:'/hl/VastCreateNew'});
                }
            }
        },
    },
    created() {

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
                    this.vastExtension(1,10);
                
                } else {
                    store.dispatch("Util/Loading", false);
                    this.$router.push("/getlogin/login")
                
                }
            }else {
                store.dispatch("Util/Loading", false);
            }
        })
        
    },
    /* computed: {
        ...TempStore({
            data: "Temp/getVastTemp"
        })
    }, */
}

</script>

<style lang="less">

    .vastExtension{
        padding: 24px;
        background-color: #fff;
        border-radius: 10px;
    }

    .vastExtension 
    .vast-header{
        font-size: 1em;
        font-weight: 600;
    }

    .vast-header span{
        font-size: .6em;
    }

    .vastExtension{
        .vast-header,.ant-btn{
            margin-bottom: 16px;
        }
    }
   

</style>