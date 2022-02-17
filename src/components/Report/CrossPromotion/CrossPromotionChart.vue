<template>
  <div>
    <div class="ReportHeader clearfix">
      <div style="float:left;line-height:35px;">
        <span style="display:inline-block;width:120px;text-align:right;padding-right:20px;">{{$t('report.filters')}}</span>
        <a-select
          class="appfilter"
          v-model:value="AppFilter"
          style="width: 2.4rem;"
          :placeholder="$t('report.promotedApp')"
          showArrow
          allowClear
        >
          <a-select-option v-for="item in AppData" :key="item.appInfo.id">
            <span>
              <AppleFilled style="margin-right:5px;" v-if="item.appInfo.platform==1" />
              <AndroidFilled style="margin-right:5px;" v-else />
              {{item.appInfo.app_official_name}}
            </span>
          </a-select-option>
        </a-select>
        <a-select
                v-model:value="timeZone"
                style="width: 220px;"
                placeholder="选择时区"
                showArrow
                @change="timeZoneChange"
            >
                <a-select-option v-for="item in timeZones" :key="item.value" :value="item.value">
                    <span>{{item.label}}</span>
                </a-select-option>
            </a-select>
        <div style="padding-top:.07rem;">
          <span style="display:inline-block;width:120px;text-align:right;padding-right:20px;">{{$t('report.metrics')}}</span>
          <a-select
            v-model:value="first_indicator"
            style="width:2.4rem"
            type="combobox"
            class="indicator_select"
          >
            <a-select-option
              v-for="item in indicators"
              :key="item.value"
              :disabled="item.value === second_indicator ? true : false"
            >{{item.label}}</a-select-option>
          </a-select>
          <a-checkbox
            v-model:checked="indicator_checked"
            style="margin-left:8px"
            @change="contrast($event,'indicator')"
          >{{$t('report.compare')}}</a-checkbox>
          <a-select
            v-model:value="second_indicator"
            style="width:2.4rem"
            type="combobox"
            class="indicator_select"
            v-if="indicator_checked"
          >
            <a-select-option
              v-for="item in indicators"
              :key="item.value"
              :disabled="item.value === first_indicator ? true : false"
            >{{item.label}}</a-select-option>
          </a-select>
        </div>
        <div style="padding: .07rem 0rem 0.15rem;">
          <span style="display:inline-block;width:120px;text-align:right;padding-right:20px;">{{$t('report.interval')}}</span>
          <a-select
            v-model:value="dateSelect"
            style="width:2.4rem"
            type="combobox"
            class="date_select"
          >
            <a-select-option v-for="item in dateList" :key="item.value">{{item.label}}</a-select-option>
          </a-select>
          <a-range-picker
            style="width:320px;margin-left:8px"
            separator="-"
            v-model:value="date1"
            :allowClear="false"
            :ranges="ranges"
            :disabledDate="disabledDate"
            @calendarChange="calendarChange1"
          >
            <template #suffixIcon>
              <CalendarOutlined />
            </template>
          </a-range-picker>
          <a-checkbox
            v-model:checked="date_checked"
            style="margin:0 8px"
            @change="contrast($event,'date')"
          >{{$t('report.compare')}}</a-checkbox>
          <a-range-picker
            v-if="date_checked"
            style="width:320px;margin-right:8px"
            separator="-"
            v-model:value="date2"
            inputReadOnly
            :allowClear="false"
            :disabledDate="disabledDate"
            @calendarChange="calendarChange2"
          >
            <template #suffixIcon>
              <CalendarOutlined />
            </template>
          </a-range-picker>
          <a-button type="primary" @click="GetData" class="Confirm">{{$t('report.submit')}}</a-button>
        </div>
      </div>
    </div>
    <a-divider style="height: 1px; background-color:#f2f2f2" />
    <a-spin :spinning="chartLoading">
      <div class="ChartContent">
        <div id="charts" v-if="!ChartType"></div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import {
  CalendarOutlined,
  DownOutlined,
  AppleOutlined,
  AndroidOutlined,
  AppleFilled,
  AndroidFilled
} from "@ant-design/icons-vue";
import { useI18n } from 'vue-i18n';
import { message} from 'ant-design-vue';
import { defineComponent, reactive, ref, toRefs,computed } from "vue";
import moment from "moment";
import timezone from "../../../utils/timeZine.json"
import store from "@/store";
export default defineComponent({
  name: "ReportChart",
  props: ["ChartType"],
  components: {
    CalendarOutlined,
    DownOutlined,
    AppleOutlined,
    AndroidOutlined,
    AndroidFilled,
    AppleFilled
  },
  setup() {
    const language = computed(() => {
      
      return store.state.Util.language;
    });
    const { t } = useI18n();
    const indicators = [
      {
        value: "imps",
        label: t('report.Imps')
      },
      {
        value: "clicks",
        label: t('report.Clicks')
      },
      {
        value: "ctr",
        label: t('report.Ctr')
      }
      ,
      {
        value: "ecpm",
        label: t('fullReport.eCPM')
      },
      {
        value: "revenue",
        label: t('fullReport.Revenue')
      },
      {
        value: "requests",
        label: t('fullReport.request')
      },
      {
        value: "filling_rate",
        label: t('fullReport.FillingRate')
      }
    ];
    const dateList = [
      {
        value: "month",
        label: t('report.month')
      },
      {
        value: "day",
        label: t('report.date')
      }
    ];
    const date1 = ref([moment().subtract(7, "days"), moment()]);
    const state = reactive({
      AppFilter: undefined,
      AppData: [],
      compare: {},
      noCompare: {},
      appName: ""
    });
    return {
      ...toRefs(state),
      indicators,
      dateList,
      date1,
      date2: ref([]),
      first_indicator: ref("imps"),
      second_indicator: ref(""),
      indicator_checked: ref(false),
      dateSelect: ref("day"),
      date_checked: ref(false),
      firstSelectTime: ref(""),
      language
    };
  },
  data(){
    return {
      chartLoading:false,
      timeZone:undefined,
      timeZones:[],
    }
  },
  mounted() {
    const { t } = useI18n();
    this.GetAppList();
    
    this.timeZones=timezone;
    this.timeZones=this.timeZones.filter(val=>{
        return val.value!=store.state["User"].userInfo.timezone
    });
    this.timeZones.unshift({
        value:store.state["User"].userInfo.timezone,
        label:t("fullReport.accountTimeZone")
    })
    this.timeZone=store.state["Util"].crossPromotionChartTimeZone?store.state["Util"].crossPromotionChartTimeZone:store.state["User"].userInfo.timezone;
    console.log(this.timeZone,'时区');
    this.GetData("chart");
  },
  computed: {
    ranges() {
      switch (this.dateSelect) {
        case "day":
          if(this.language=="zh"){
            return {
              过去一周: [moment(moment().subtract(7, "days")), moment()],
              过去一个月: [moment(moment().subtract(30, "days")), moment()]
            };
          }else {
            return {
              'Last 7 days': [moment(moment().subtract(7, "days")), moment()],
              "Month to date": [moment(moment().subtract(30, "days")), moment()]
            };
          }
        case "month":
          if(this.language=="zh"){
              return {
                过去一周: [moment(moment().subtract(7, "days")), moment()],
                过去一个月: [moment(moment().subtract(30, "days")), moment()],
                过去一年: [moment(moment().subtract(365, "days")), moment()]
              };
          }else {
              return {
                'Last 7 days': [moment(moment().subtract(7, "days")), moment()],
                "Month to date": [moment(moment().subtract(30, "days")), moment()],
                "Past Year": [moment(moment().subtract(365, "days")), moment()]
              };
          }
      }
    }
  },
  watch: {
    dateSelect(val) {
      switch (val) {
        case "day":
          this.date1 = [moment().subtract(7, "days"), moment()];
          break;
        case "month":
          this.date1 = [moment().subtract(365, "days"), moment()];
          break;
      }
      if (this.date_checked) {
        let current = new Date(this.date1[1]) - new Date(this.date1[0]);
        this.date2 = [moment(this.date1[0] - current), this.date1[0]];
      }
    }
  },
  methods: {
    timeZoneChange(e){
          store.dispatch("Util/SetCrossPromotionChartTimeZone",e);
    },
    GetAppList() {
      let opt = { name: "" };
      this.$req.appNameList(opt).then(res => {
        if (res.data.code === 200) {
          if (res.data.data) {
            this.AppData = res.data.data;
          } else {
            this.AppData = [];
          }
        }
      });
    },
    disabledDate(e) {
      if (this.firstSelectTime != "") {
        if (this.dateSelect == "day") {
          let minTime = moment(this.firstSelectTime)
            .subtract(30, "days")
            .format("YYYY-MM-DD");
          let maxTime = moment(this.firstSelectTime)
            .add(30, "days")
            .format("YYYY-MM-DD");
          return e < moment(minTime) || e > moment(maxTime);
        } else {
          let minTime = moment(this.firstSelectTime)
            .subtract(365, "days")
            .format("YYYY-MM-DD");
          let maxTime = moment(this.firstSelectTime)
            .add(365, "days")
            .format("YYYY-MM-DD");
          return e < moment(minTime) || e > moment(maxTime);
        }
      }
      return false;
    },
    calendarChange1(date) {
      if (date.length === 1) {
        this.firstSelectTime = date[0];
      } else {
        this.firstSelectTime = "";
        if (this.dateSelect) {
          let current = new Date(date[1]) - new Date(date[0]);
          this.date2 = [moment(this.date2[1] - current), this.date2[1]];
        }
      }
    },
    calendarChange2(date) {
      if (date.length === 1) {
        this.firstSelectTime = date[0];
      } else {
        this.firstSelectTime = "";
        if (this.dateSelect) {
          let current = new Date(date[1]) - new Date(date[0]);
          this.date1 = [moment(this.date1[1] - current), this.date1[1]];
        }
      }
    },
    contrast(e, val) {
      if (e.target.checked) {
        if (val === "date") {
          this.indicator_checked = !e.target.checked;
          let current = new Date(this.date1[1]) - new Date(this.date1[0]);
          this.date2 = [moment(this.date1[0] - current), this.date1[0]];
          this.second_indicator = "";
        } else {
          this.date_checked = !e.target.checked;
          this.second_start_time = "";
          this.second_end_time = "";
          this.date2 = [];
        }
      } else {
        this.second_start_time = "";
        this.second_end_time = "";
        this.date2 = [];
        this.second_indicator = "";
      }
    },
    GetData(e) {
      if (this.indicator_checked && !this.second_indicator) {
        message.error(this.$t('report.ContrastDimensionEmpty'));
        return;
      }
      e=="chart"?store.dispatch("Util/Loading", true):this.chartLoading=true;
      let opt = {
        app_id: null || this.AppFilter,
        index1: this.first_indicator,
        index_compare: this.indicator_checked ? 1 : 0,
        time_format: this.dateSelect,
        time_compare: this.date_checked ? 1 : 0,
        start_time: this.date1[0].format("YYYY-MM-DD"),
        end_time: this.date1[1].format("YYYY-MM-DD"),
        index2: this.indicator_checked ? this.second_indicator : null,
        compare_start_time: this.date_checked
          ? this.date2[0].format("YYYY-MM-DD")
          : null,
        compare_end_time: this.date_checked
          ? this.date2[1].format("YYYY-MM-DD")
          : null,
        timezone:this.timeZone,
      };
      this.$req
        .chartReport(opt)
        .then(res => {
          this.noCompare = res.data.data.noCompare;
          this.compare = res.data.data.compare;
          let myChart = this.$echarts.init(document.getElementById("charts"));
          let option;
          setTimeout(() => {
            let noCompare = this.noCompare;
            let compare = this.compare;
            if (!this.indicator_checked && !this.date_checked) {
              let dataX = [];
              let dataY = [];
              let name = "";
              this.indicators.map(item => {
                if (item.value === this.first_indicator) {
                  name = item.label;
                }
              });
              
              noCompare.map(item => {
                if(this.first_indicator=="ctr"){
                  dataX.push(item.ym);
                  dataY.push(Number(item[this.first_indicator])*100);
                }else{
                  dataX.push(item.ym);
                  dataY.push(item[this.first_indicator]);
                }
              });

              
              option = {
                legend: {
                  data: [name],
                  right: "40px"
                },
                title: {
                  left: "center",
                  text: this.AppFilter ? this.appName : null
                },
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "line",
                    label: {
                      backgroundColor: "#283b56",
                    }
                  },
                  formatter: function (params) {
                      // console.log(params); 
                      console.log(params);
                      let firstParams = params[0];
                      if(firstParams.seriesName=="点击率"||firstParams.seriesName=="CTR"){
                        return firstParams.name + ' <br /> ' + firstParams.seriesName + '：' + (Number(firstParams.data)).toFixed(2) + ' %';
                      }else {
                        return firstParams.name + '  <br /> ' + firstParams.seriesName + '：' + firstParams.data ;
                      }
                      
                      
                  }
                },
                xAxis: {
                  type: "category",
                  boundaryGap: false,
                  data: dataX,
                  axisLabel: {
                    rotate: 40
                  }
                },
                yAxis: {
                  type: "value",
                  name: name,
                  // max: function(value) {return value.max;},
                  axisLabel: {
                      formatter: this.first_indicator=='ctr'?'{value} %':'{value}'
                  },
                  // splitNumber :this.first_indicator=='ctr'?3:""

                },
                series: [
                  {
                    name: name,
                    type: "line",
                    data: dataY,
                    smooth: true
                  }
                ],
                grid: {
                  top: "120px",
                  left: "60px",
                  right: "60px",
                  bottom: "60px"
                }
              };
              myChart.setOption(option, true);
              e=="chart"?store.dispatch("Util/Loading", false):this.chartLoading=false;
            } else if (this.indicator_checked) {
              let dataX = [];
              let dataY1 = [];
              let dataY2 = [];
              let name1 = "";
              let name2 = "";
              this.indicators.map(item => {
                if (item.value === this.first_indicator) {
                  name1 = item.label;
                } else if (item.value === this.second_indicator) {
                  name2 = item.label;
                }
              });
              console.log(this.first_indicator,this.second_indicator);
              noCompare.map(item => {
                
                
                if(this.first_indicator=="ctr"){
                  dataX.push(item.ym);
                  dataY1.push(Number(item[this.first_indicator])*100);
                }else{
                  dataX.push(item.ym);
                  dataY1.push(item[this.first_indicator]);
                }
              
              });
              compare.map(item => {
                if(this.second_indicator=="ctr"){
                  dataY2.push(Number(item[this.second_indicator])*100);
                  
                }else{
                  dataY2.push(item[this.second_indicator]);
                }
                
              });
              let max1 = this.getMaxValue(dataY1);
              let max2 = this.getMaxValue(dataY2);
              let min1 = this.getMinValue(dataY1);
              let min2 = this.getMinValue(dataY2);
              option = {
                legend: {
                  data: [name1, name2],
                  right: "40px"
                },
                title: {
                  left: "center",
                  text: this.AppFilter ? this.appName : null
                },
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "line",
                    label: {
                      backgroundColor: "#283b56"
                    }
                  },
                  formatter: function (params) {
                      let firstParams = params[0];
                      let sndParams = params[1];
                      if(firstParams.seriesName=="点击率"||firstParams.seriesName=="CTR"){
                        return firstParams.name + ' <br /> ' + firstParams.seriesName + '：' + (Number(firstParams.data)).toFixed(2) + ' %'+'<br />'+sndParams.seriesName + '：' + sndParams.data;
                      }else if(sndParams.seriesName=="点击率"||sndParams.seriesName=="CTR"){
                        return firstParams.name + ' <br /> ' + firstParams.seriesName + '：' + firstParams.data +'<br />'+sndParams.seriesName + '：' + (Number(sndParams.data)).toFixed(2) + ' %';
                      }
                      else {
                        return firstParams.name + '  <br /> ' + firstParams.seriesName + '：' + firstParams.data+'<br />'+sndParams.seriesName + '：' + sndParams.data ;
                      }                      
                  }
                },
                xAxis: {
                  type: "category",
                  data: dataX,
                  axisLabel: {
                    rotate: 40
                  }
                },
                yAxis: [
                  {
                    type: "value",
                    name: name1,
                    min: this.first_indicator=='ctr'?0:min1,
                    max: this.first_indicator=='ctr'&&max1>100?100:max1,
                    interval:this.first_indicator=='ctr'&&max1>100?(100 - min1) / 5:(max1 - min1) / 5,
                    splitNumber: 5,
                    axisLabel: {
                      formatter: this.first_indicator=='ctr'?'{value} %':'{value}'
                    },
                  },
                  {
                    type: "value",
                    name: name2,
                    min: this.second_indicator=='ctr'?0:min2,
                    max: this.second_indicator=='ctr'&&max2>100?100:max2,
                    interval: this.second_indicator=='ctr'&&max2>100?(100 - min2) / 5:(max2 - min2) / 5,
                    splitNumber: 5,
                    axisLabel: {
                      formatter: this.second_indicator=='ctr'?'{value} %':'{value}'
                    },
                  }
                ],
                series: [
                  {
                    name: name1,
                    type: "line",
                    yAxisIndex: 0,
                    data: dataY1,
                    smooth: true
                  },
                  {
                    name: name2,
                    type: "line",
                    yAxisIndex: 1,
                    data: dataY2,
                    smooth: true
                  }
                ],
                grid: {
                  top: "120px",
                  left: "60px",
                  right: "60px",
                  bottom: "60px"
                }
              };
              option &&
                myChart.setOption(option, {
                  notMerge: true
                });
              e=="chart"?store.dispatch("Util/Loading", false):this.chartLoading=false;
            } else if (this.date_checked) {
              let dataX1 = [];
              let dataX2 = [];
              let dataY1 = [];
              let dataY2 = [];
              let name = "";
              this.indicators.map(item => {
                if (item.value === this.first_indicator) {
                  name = item.label;
                }
              });
              noCompare.map(item => {
                dataX1.push(item.ym);
                dataY1.push(item[this.first_indicator]);
              });
              compare.map(item => {
                dataX2.push(item.ym);
                dataY2.push(item[this.first_indicator]);
              });
              option = {
                title: {
                  left: "center",
                  text: this.AppFilter ? this.appName : null
                },
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "line",
                    label: {
                      backgroundColor: "#283b56"
                    }
                  }
                },
                xAxis: [
                  {
                    type: "category",
                    data: dataX1,
                    axisTick: {
                      alignWithLabel: true
                    },
                    axisLabel: {
                      rotate: 40
                    },
                    axisLine: {
                      lineStyle: {
                        color: "#5470C6"
                      },
                      onZero: false
                    },
                    boundaryGap: true
                  },
                  {
                    type: "category",
                    data: dataX2,
                    boundaryGap: true,
                    axisTick: {
                      alignWithLabel: true
                    },
                    axisLabel: {
                      rotate: -40
                    },
                    axisLine: {
                      lineStyle: {
                        color: "#EE6666"
                      },
                      onZero: false
                    }
                  }
                ],
                yAxis: {
                  type: "value",
                  name: name
                },
                series: [
                  {
                    name: name,
                    type: "line",
                    xAxisIndex: 0,
                    data: dataY1,
                    lineStyle: {
                      color: "#5470C6"
                    },
                    itemStyle: {
                      color: "#5470C6"
                    },
                    smooth: true
                  },
                  {
                    name: name,
                    type: "line",
                    xAxisIndex: 1,
                    data: dataY2,
                    lineStyle: {
                      color: "#EE6666"
                    },
                    itemStyle: {
                      color: "#EE6666"
                    },
                    smooth: true
                  }
                ],
                grid: {
                  top: "120px",
                  left: "60px",
                  right: "60px",
                  bottom: "60px"
                }
              };
              option &&
                myChart.setOption(option, {
                  notMerge: true
                });
              e=="chart"?store.dispatch("Util/Loading", false):this.chartLoading=false;
            }
          }, 500);
        })
        .catch(err => {
          e=="chart"?store.dispatch("Util/Loading", false):this.chartLoading=false;
        });

      if (this.AppFilter !== "") {
        this.AppData.map(item => {
          if (item.app_id === this.AppFilter) {
            this.appName = `${item.appInfo.app_official_name}\n\n${
              item.appInfo.platform === "0" ? "Android" : "iOS"
            }`;
          }
        });
      }
     
    },
    getMaxValue(arr) {
      const max = Math.max(...arr);
      // 这样处理是为了不让最大值刚好到坐标轴最顶部
      if (max < 1) {
        return (max / 8.5) * 10;
      }
      return Math.ceil(max / 8.5) * 10;
    },
    getMinValue(arr) {
      const min = Math.min(...arr);
      // 这样处理是为了不让最大值刚好到坐标轴最底部
      return Math.floor(min / 12) * 10;
    }
  }
});
</script>
<style lang="less" scoped>
.ReportHeader{
  /deep/.ant-select{
        vertical-align: middle;
        margin-left: 8px;
    }
    /deep/.Confirm{
        float: right;
    }
}

.ChartContent {
  padding: 0 0.18rem;
  width: 100%;
  box-sizing: border-box;
  #charts {
    width: 15rem;
    height: 5.4rem;
  }
}
</style>