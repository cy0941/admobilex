<template>
    <div class="priorityTrafficGrouping">
        <a-spin :spinning="priorityGroupingLoading">
            <a-table
                :data-source="data"
                :rowKey="record => record.priority"
                >
                <a-table-column key="" title="" data-index=""  :width="100">
                    <template #default>
                        <span class="MenuOutlined"><MenuOutlined /></span>
                    </template>
                </a-table-column>
                <a-table-column key="priority" :title="$t('aggregate.priority')" data-index="priority" />
                <a-table-column key="name" :title="$t('trafficGrouping.trafficGrouping')" data-index="name" />
                <a-table-column key="" :title="$t('trafficGrouping.actions')" data-index="" >
                    <template #default="{record}">
                        <a-button type="link" size="small" danger class="shisu_text_btn"  @click="delGrouping(record.id)">{{$t('aggregate.delete')}}</a-button>
                    </template>
                </a-table-column>
            </a-table>
        </a-spin>
    </div>
</template>

<script>
import Sortable from "sortablejs"
import store from '@/store';
import { message} from 'ant-design-vue';
import {MenuOutlined,ExclamationCircleOutlined} from "@ant-design/icons-vue";
export default {
    components:{
        MenuOutlined,ExclamationCircleOutlined
    },
    props:["placement_id"],
    data(){
        return {
            data:[],
            priorityGroupingLoading:false,
            newIndex:"",
            oldIndex:"",
        }
    },
    mounted(){
        
        this.getGroupingList();
    },
    methods:{
        //删除流量分组
        delGrouping(e){
            console.log(e);
            this.$confirm({
                title: this.$t('aggregate.deleteTrafficGroups'),
                content: this.$t('aggregate.deleteAdUnitContent'),
                cancelText:this.$t('aggregate.cancel'),
                okText:this.$t('aggregate.enter'),
                icon: <ExclamationCircleOutlined  />,
                onOk:()=> {
                    this.$req.delGrouping({mediation_group_id:e}).then(res=>{
                        console.log(res);
                        if(res.data.code==200){
                            message.error(this.$t('aggregate.deleteSuccessful'));
                            this.getGroupingList();
                        }else{
                            message.error(this.$t('aggregate.deleteFailed'));
                        }
                    })
                },
                onCancel:()=> {
                    
                },
            });
        },
        //获取流量分组列表
        getGroupingList(){
            this.$req.getGroupingList({placement_id:this.placement_id,exclude_default:0}).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.data=res.data.data;
                    this.data=this.data.filter(item=>{
                        return item.priority!="0"
                    })
                    this.rowDrop();
                }else{
                    this.data=[];
                }
            })
        },
        //拖动排序
        rowDrop(){
            var tableTooby=document.querySelector(".priorityTrafficGrouping .ant-table-tbody");
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
                            this.sortGrouping();
                        }
                        
                    })
                    
                    
                },
            });
        },
        //请求接口改变顺序
        sortGrouping(){
            store.dispatch("Util/Loading", true);
            let arr=[];
            this.data.forEach((item,index)=>{
                arr.push({
                    mediation_group_id:item.id,
                    rank:index+1
                })
            })
            let opt={
                placement_id:this.placement_id,
                sort_data:arr
            }
            this.$req.sortGrouping(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    message.success(this.$t('trafficGrouping.modifyPrioritySuccessfully'));
                    store.dispatch("Util/Loading", false);
                    this.getGroupingList();
                }else{
                    message.error(this.$t('trafficGrouping.failureToModifyPriority'));
                    store.dispatch("Util/Loading", false);
                    this.getGroupingList();
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
    /deep/.ant-table{
        .ant-table-body{
            .ant-table-row{
                td:nth-child(1) {
                    cursor: move;
                }
            }
        }
    }
</style>