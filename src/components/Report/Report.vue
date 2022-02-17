<template>
  <!-- <div class="report clearfix">
    <h1 style="font-size:18px;color:#555;">{{ChartType ? $t('report.report') : $t('report.chart')}} {{$t('report.settings')}}</h1>
    <a-radio-group v-model:value="ChartType" button-style="solid" v-if="type === 1">
      <a-radio-button :value="true">{{$t('report.report')}}</a-radio-button>
      <a-radio-button :value="false">{{$t('report.chart')}}</a-radio-button>
    </a-radio-group>
    <ReportForm v-if="ChartType&&isStatusType" :type="type" />
    <ReportChart v-if="!ChartType&&isStatusType" :ChartType="ChartType" />
  </div> -->
  <div class="report">
        <a-tabs type="card" v-model:activeKey="activeKey">
        <a-tab-pane key="1" :tab="$t('fullReport.fullReport')" class="">
          <comprehensive-report v-if="activeKey=='1'">
          </comprehensive-report>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('fullReport.RetentionValueReport')" class="">
          <UserRetentionReport v-if="activeKey=='2'">
          </UserRetentionReport>
        </a-tab-pane>
        <a-tab-pane key="3" :tab="$t('fullReport.UserActivityReport')" class="">
          <UserBehaviorReport v-if="activeKey=='3'">
          </UserBehaviorReport>
        </a-tab-pane>
        <a-tab-pane key="4" :tab="$t('fullReport.crossPromotionReport')" class="">
          <CrossPromotionReport v-if="activeKey=='4'">
          </CrossPromotionReport>
        </a-tab-pane>
        <a-tab-pane key="5" :tab="$t('fullReport.DirectCustomerReport')" class="">
          <DirectCustomerReport v-if="activeKey=='5'">
          </DirectCustomerReport>
        </a-tab-pane>
        <a-tab-pane key="6" :tab="$t('fullReport.creativeReport')" class="">
          <material-report v-if="activeKey=='6'">
          </material-report>
        </a-tab-pane>
      </a-tabs>
  </div>
</template>

<script >
import MaterialReport from "./MaterialReport.vue";
import CrossPromotionReport from "./CrossPromotion/CrossPromotionReport.vue"
import ComprehensiveReport from "./Comprehensive/ComprehensiveReport.vue"
import UserRetentionReport from "./UserRetentionReport.vue"
import UserBehaviorReport from "./UserBehaviorReport.vue"
import DirectCustomerReport from "./DirectCustomerReport.vue"
import store from '@/store';
import { useI18n } from 'vue-i18n';
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  name: "Report",
  props: { type: Number },
  components: {
    MaterialReport,
    CrossPromotionReport,
    ComprehensiveReport,
    UserRetentionReport,
    UserBehaviorReport,
    DirectCustomerReport
  },
  setup() {
    const { t } = useI18n();
    const ChartType = ref(true);
    return {
      ChartType
    };
  },
  data(){
    return {
      isStatusType:true,
      activeKey:"1",
    }
  },
  watch: {
    '$store.state.Util.language'(newVal,oldVal){
        console.log(newVal,oldVal);
        this.isStatusType=false;
        this.$nextTick(()=>{
          this.isStatusType=true;
        })
    }
  },
  created(){
    store.dispatch("Util/OpenMenuKey",['/hl/report']);
    store.dispatch("Util/OpenKeys",['/hl/report']);
  }
});
</script>
<style lang="less" scoped>
.report {
  .ant-tabs{
    overflow: inherit;
  }
  /* /deep/.ant-tabs-card {
      .ant-tabs-bar {
        margin-bottom: 0;
      }
      .ant-tabs-nav-animated {
        border-top-left-radius: 5px;
        .ant-tabs-tab {
          margin-right: 0;
          color: #757575;
        }
        .ant-tabs-tab:nth-child(1) {
          border-top-left-radius: 5px;
        }
        .ant-tabs-tab:nth-child(6) {
          border-top-right-radius: 5px;
        }
        .ant-tabs-tab-active {
          color: #fff;
          margin-right: 0;
          background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
        }
      }
      .ant-tabs-content::before {
        overflow: auto;
      }
  } */
  // position: relative;
  // background: #fff;
  // border-radius: 10px;
  // padding: 20px;
  // h1 {
  //   line-height: 32px;
  // }
  // .ant-radio-group {
  //   position: absolute;
  //   top: 20px;
  //   right: 20px;
  //   label {
  //     color: #7f7f7f;
  //     border: 1px solid #d7d7d7;
  //     :hover {
  //       color: #6577c8;
  //     }
  //   }
  //   .ant-radio-button-wrapper-checked {
  //     border: 1px solid transparent;
  //     background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
  //     color: #fff;
  //     :hover {
  //       color: #fff;
  //     }
  //   }
  //   :first-child {
  //     border-radius: 13px 0 0 13px;
  //     border-right: 0;
  //   }
  //   :last-child {
  //     border-radius: 0 13px 13px 0;
  //     border-left: 0;
  //   }
  // }
}
// .ant-radio-group-solid
//   .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
//   color: #fff;
//   background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
// }
</style>