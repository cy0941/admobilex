<template>
  <div class="report clearfix">
    <h1 style="font-size:18px;color:#555;">{{ChartType ? $t('report.report') : $t('report.chart')}} {{$t('report.settings')}}</h1>
    <a-radio-group v-model:value="ChartType" button-style="solid">
      <a-radio-button :value="true">{{$t('report.report')}}</a-radio-button>
      <a-radio-button :value="false">{{$t('report.chart')}}</a-radio-button>
    </a-radio-group>
    <ReportForm v-if="ChartType&&isStatusType"  />
    <CrossPromotionChart v-if="!ChartType&&isStatusType" :ChartType="ChartType" />
  </div>
  
</template>
<script >
import ReportForm from "./CrossPromotionForm.vue";
import CrossPromotionChart from "./CrossPromotionChart.vue";
import { useI18n } from 'vue-i18n';
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  name: "Report",
  components: {
    ReportForm,
    CrossPromotionChart,
    
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
});
</script>
<style lang="less" scoped>
.report {
  position: relative;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  border-top-left-radius: 0;
  h1 {
    line-height: 32px;
  }
  .ant-radio-group {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}

</style>