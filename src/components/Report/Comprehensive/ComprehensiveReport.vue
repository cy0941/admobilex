<template>
  <div class="report clearfix">
    <h1 >{{ChartType ? $t('report.reportSettings') : $t('report.chartSettings')}}</h1>
    <a-radio-group v-model:value="ChartType" button-style="solid">
      <a-radio-button :value="true">{{$t('report.report')}}</a-radio-button>
      <a-radio-button :value="false">{{$t('report.chart')}}</a-radio-button>
    </a-radio-group>
    <ComprehensiveForm v-if="ChartType&&isStatusType" />
    <ComprehensiveChart v-if="!ChartType&&isStatusType" :ChartType="ChartType" />
  </div>
  
</template>
<script >
import ComprehensiveForm from "./ComprehensiveForm.vue";
import ComprehensiveChart from "./ComprehensiveChart.vue";
import { useI18n } from 'vue-i18n';
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  name: "ComprehensiveReport",
  components: {
    ComprehensiveForm,
    ComprehensiveChart,
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
.ant-radio-group-solid  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
  color: #fff;
  background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
}
</style>