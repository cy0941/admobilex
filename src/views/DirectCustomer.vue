<template>
    <div class="directCustomer">
        <a-tabs type="card" v-model:activeKey="activeKey" @change="onActiveKey">
            <a-tab-pane key="1" :tab="$t('DirCusGroup.DirectCustomerGroup')">
                <DirCusGroup :type="1" @onChageActiveKey="onChageActiveKey"/>
            </a-tab-pane>
            <a-tab-pane key="2" :tab="$t('DirCusGroup.DirectCustomerCampaigns')">
                <DirCusCampaign :type="1" :directId='dirId'/>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import DirCusCampaign from "@/components/DirectCustomer/DirCusCampaign"
    import DirCusGroup from "@/components/DirectCustomer/DirCusGroup"
    import request from "@/utils/request.js";
    import router from '@/router';
    import store from "@/store";
    import { defineComponent, ref , onMounted } from 'vue';

    export default defineComponent({

        setup() {

            const activeKey = ref('1');
            const dirId = ref(null);

            onMounted(() => {
                activeKey.value=store.state.Util.activeKey;
            });

            const onActiveKey = ()=>{
                dirId.value=null;
                store.dispatch("Util/ActiveKey", activeKey.value);
            };

            const onChageActiveKey = (id)=>{
                dirId.value=id;
                activeKey.value='2';
                store.dispatch("Util/ActiveKey", activeKey.value);
            };

            return {
                activeKey,dirId,
                onActiveKey,onChageActiveKey
            };
        },
        components: {
            DirCusCampaign,
            DirCusGroup
        }
    });

</script>

<style scoped>
    @import "../assets/css/index.css";
</style>

<style>
  .directCustomer .icon{
      font-size: 64px;
      color:#909399;
      margin: 0;
  }
  .directCustomer .icon-div{
      margin-top: 20px;
      height: 64px;
  }
  .directCustomer .empty-div{
      height: 30px;
      line-height: 30px;
  }
  .directCustomer .purples{
      margin-right: 0 !important;
      color: #6475c7;
  }
  .directCustomer .div--margin{
      margin-bottom: 20px;
  }
</style>

<style lang="less">

    .directCustomer{

        .padding--none{
            padding: 0;
        }

        .inputData{
            display: flex;
            align-content: center;
        }

        .margin--bottom{
            margin-bottom: 20px;
        }

        .mins{
            overflow:hidden; //超出的隐藏
            text-overflow:ellipsis;//省略号
            white-space:nowrap;//强制一行显示
        }
        .operation{
            display: flex;
            align-content: center;
        }

        .table{
            .table_targetProgress{
                display: flex;
                justify-content: space-between;
            }
            .el-table{
                font-size: 12px;
            }
            .el-table__expand-icon > .el-icon {
                font-weight: 700;
                transform: rotate(90deg);
            }
            .el-table__expand-icon--expanded > .el-icon {
                font-weight: 700;
                transform: rotate(180deg);
            }
        }

        .doubt,.pause,.finish,.activity,.red{
            cursor: pointer;
        }

        .doubt {
            display: inline-block;
            width: 14px;
            height: 14px;
            margin-left: 10px;
            line-height: 22px;
            vertical-align: middle;
            background: url("//console-style.hl.com/images/dspcom/normal_u109.svg") no-repeat ;
            background-size: 14px 14px;
        }

        .doubt:hover {
            background: url("//console-style.hl.com/images/dspcom/normal_u110.svg") no-repeat ;
            background-size: 14px 14px;
        }

        .pause {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url("//console-style.hl.com/images/dspcom/stop.svg") no-repeat ;
            background-size: 20px 20px;
        }
        .finish {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url("//console-style.hl.com/images/dspcom/done.svg") no-repeat ;
            background-size: 20px 20px;
        }
        .activity {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url("//console-style.hl.com/images/dspcom/running.svg") no-repeat ;
            background-size: 20px 20px;

        }
        .red {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url("//console-style.hl.com/images/dspcom/warning.svg") no-repeat ;
            background-size: 20px 20px;
        }

        /* .ant-tabs-bar{
            margin: 0;

            .ant-tabs-nav{

                .ant-tabs-tab{
                    min-width: 90px;
                    color: #757575;
                    margin: 0 !important;
                    text-align: center;
                }

                .ant-tabs-tab:nth-child(1){
                    border-top-left-radius: 5px;  
                }

                .ant-tabs-tab:nth-child(2){
                    border-top-right-radius: 5px;   
                }

                .ant-tabs-tab-active{
                    color: #fff !important;
                    background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%) !important;
                }
            }
        } */
    }

</style>