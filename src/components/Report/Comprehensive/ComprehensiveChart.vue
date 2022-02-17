<template>
  <div>
    <div class="ReportHeader clearfix">
      <div style="float:left;line-height:32px;">
        <div >
          <span style="display:inline-block;width:100px;text-align:right;padding-right:16px;">{{$t('report.filters')}}</span>
          <a-select
              mode="multiple"
              v-model:value="PlatForm"
              style="width: 220px;"
              :placeholder="$t('fullReport.appPlatform')"
              :showSearch="false"
              showArrow
              @change="platFormChange"
          >
              <a-select-option :key="1">
                  <span><AppleFilled style="margin-right:5px;"/>iOS</span>
              </a-select-option>
              <a-select-option :key="2">
                  <span><AndroidFilled style="margin-right:5px;"/>Android</span>
              </a-select-option>
          </a-select>
          <a-select
              mode="multiple"
              v-model:value="searchAppName"
              style="width:220px;"
              :placeholder="$t('report.appName')"
              option-label-prop="label"
              showArrow
              :maxTagCount="1"
              @change="changeSearch"
          >
              <template #suffixIcon>
                  <SearchOutlined />
              </template>
              <a-select-option v-for="item in AppData" :value="item.id" :label="item.app_official_name" :key="item.id">
                  <span>
                      <AppleFilled style="margin-right:5px;" v-if="item.platform==1"/>
                      <AndroidFilled style="margin-right:5px;" v-else/>
                      {{item.app_official_name}}
                  </span>
              </a-select-option>
          </a-select>
          <a-select
                v-model:value="adFormat"
                style="width: 220px"
                :placeholder="$t('fullReport.AdFormat')"
                ref="select"
                allowClear
                @change="adFormatChange"
            >
                <a-select-option value="1">{{$t('fullReport.banner')}}</a-select-option>
                <a-select-option value="2">{{$t('fullReport.insertion')}}</a-select-option>
                <a-select-option value="3">{{$t('fullReport.motivationalVideos')}}</a-select-option>
                <a-select-option value="4">{{$t('fullReport.vastVideo')}}</a-select-option>
            </a-select>
            <a-select
            mode="multiple"
            v-model:value="adUnitName"
            style="width:220px;"
            :placeholder="$t('aggregate.adUnit')"
            showArrow
            :maxTagCount="1"
            :maxTagTextLength="320"
            @change="adUnitChange"
            
            >
                <template #suffixIcon>
                    <SearchOutlined />
                </template>
                <a-select-option v-for="item in placements" :value="item.placement_Name" :key="item.placement_id">
                    <span>{{item.placement_Name}}</span>
                </a-select-option>
            </a-select>
            <a-select
            mode="multiple"
            v-model:value="adPlatform"
            style="width:220px;margin-left:8px;"
            :placeholder="$t('fullReport.network')"
            showArrow
            show-search
            option-label-prop="label"
            @change="adPlatformChange"
            >
                <!-- <template #suffixIcon>
                    <DownOutlined style="color:#6577c8"/>
                </template> -->
                <a-select-option v-for="item in networkList" :value="item.name" :key="item.id">
                </a-select-option>
            </a-select>
            <a-select
            mode="multiple"
            option-label-prop="label"
            v-model:value="adSourceName"
            style="width:220px;"
            :placeholder="$t('fullReport.adSoureces')"
            showArrow
            show-search
            @change="adSourceChange"
            >
                <a-select-option v-for="item in adSourceList" :value="item.name" :key="item.id">
                    <!-- <span  >
                        {{item.media_Type=='banner'?`${$t('aggregate.banner')} ${item.placement_name}`:item.media_Type=='interstitial'?`${$t('aggregate.insertion')} ${item.placement_name}`:item.media_Type=='stimulate'?`${$t('aggregate.motivationalVideos')} ${item.placement_name}`:`${$t('aggregate.vastVideo')} ${item.placement_name}`}}
                    </span> -->
                    <span>
                        {{item.name}}
                    </span>
                </a-select-option>
            </a-select>
        </div>
        <div style="margin-top:16px;">
          <span style="display:inline-block;width:100px;text-align:right;padding-right:20px;">{{$t('report.interval')}}</span>
          <a-select
            v-model:value="dateSelect"
            style="width:220px"
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
          <a-select
                v-model:value="timeZone"
                style="width: 220px;"
                placeholder="选择时区"
                showArrow
            >
                <a-select-option v-for="item in timeZones" :key="item.value" :value="item.value">
                    <span>{{item.label}}</span>
                </a-select-option>
          </a-select>
          <a-button type="primary" @click="GetData" class="Confirm">{{$t('report.submit')}}</a-button>
        </div>
      </div>
    </div>
    <a-divider style="height: 1px; background-color:#f2f2f2" />
    <div class="ChartContent">
      <a-spin :spinning="compreHensiveChartLoading">
        <div id="charts" v-if="!ChartType"></div>
      </a-spin>
      <div class="indicators">
          <p class="indicatorsTitle">{{$t('fullReport.CustomizedMetrics')}}</p>
          <a-checkbox-group class="select_metrics" v-model:value="indicatorsList" @change="selectChange" name="checkboxgroup" >
            <a-checkbox v-for="item in indicators" :value="item.value" name="type" :disabled="item.value=='estimated'||item.value=='eCPM'" :key="item.value">{{item.label}}</a-checkbox>
          </a-checkbox-group>
      </div>
    </div>
  </div>
</template>
<style scoped>
    @import "../../../assets/css/index.css";
</style>
<script>
import {
  CalendarOutlined,
  DownOutlined,
  AppleOutlined,
  AndroidOutlined,
  AndroidFilled,
  AppleFilled
} from "@ant-design/icons-vue";
import { useI18n } from 'vue-i18n';
import timezone from "../../../utils/timeZine.json"
import { defineComponent, reactive, ref, toRefs,computed } from "vue";
import moment from "moment";
import { message} from 'ant-design-vue';
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
    // const indicators = [
    //   {
    //     value: "imps",
    //     label: t('report.Imps')
    //   },
    //   {
    //     value: "clicks",
    //     label: t('report.Clicks')
    //   },
    //   {
    //     value: "ctr",
    //     label: t('report.Ctr')
    //   }
    // ];
    const dateList = [
      {
        value: "month",
        label: t('report.month')
      },
      {
        value: "date",
        label: t('report.date')
      }
    ];
    const date1 = ref([moment().subtract(7, "days"), moment()]);
    const state = reactive({
      AppFilter: undefined,
      AppData: [],
      compare: {},
      noCompare: {},
      appName: "",
    });
    return {
      ...toRefs(state),
      // indicators,
      dateList,
      date1,
      date2: ref([]),
      first_indicator: ref("imps"),
      second_indicator: ref(""),
      indicator_checked: ref(false),
      dateSelect: ref("date"),
      date_checked: ref(false),
      firstSelectTime: ref(""),
      language
    };
  },
  data(){
    return {
      adUnitName:[],
      adFormat:undefined,
      searchAppName:[],
      network:undefined,
      networkList:[],
      PlatForm:[],
      adSource:undefined,
      appIds:[],
      placements:[],
      placementIds:[],
      adPlatform:[],
      adPlatformIds:[],
      adSourceName:[],
      adSourceIds:[],
      adSourceList:[],
      compreHensiveChartLoading:false,
      indicators:[
        {
          value:"estimated",
          label:this.$t('fullReport.EstimateRevenue')
        },
        {
          value:"eCPM",
          label:this.$t('fullReport.EstimateECPM')
        },
        {
          value:"traffic_request",
          label:this.$t('fullReport.Requests')
        },
        {
          value:"traffic_request_rate",
          label:this.$t('fullReport.RequestsFillRate')
        },
          {
          value:"mediation_requests",
          label:this.$t('fullReport.AdRequest')
        },
        {
          value:"ad_request_rate",
          label:this.$t('fullReport.AdRequestRate')
        },
        {
          value:"imps",
          label:this.$t('fullReport.Imps')
        },
        {
          value:"imps_rate",
          label:this.$t('fullReport.ImpsDate')
        },
        {
          value:"clicks",
          label:this.$t('fullReport.Click')
        },
        {
          value:"ctr",
          label:this.$t('fullReport.Ctr')
        }
      ],
      indicatorsList:["imps"],
      indicatorsData:[],
      timeZone:undefined,
      timeZones:[],
    }
  },
  mounted() {
    const { t } = useI18n();
    this.timeZones=timezone;
    this.timeZones=this.timeZones.filter(val=>{
        return val.value!=store.state["User"].userInfo.timezone
    });
    this.timeZones.unshift({
        value:store.state["User"].userInfo.timezone,
        label:t("fullReport.accountTimeZone")
    })
    this.timeZone=store.state["User"].userInfo.timezone;
        console.log(this.timeZone,'时区');
    this.GetData();
  },
  computed: {
    ranges() {
      switch (this.dateSelect) {
        case "date":
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
        case "date":
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
    selectChange(e){
      console.log(e);
      if(!e.length){
        this.indicatorsList=["imps"];
      }
      // let arr=[];
      // let indicators=[];
      // arr=JSON.parse(JSON.stringify(this.indicatorsList));

      // arr.map(item=>{
      //   item=item+':1';
      //   indicators.push(item);
      // })
      // this.indicatorsData=indicators;
      console.log(this.indicatorsData);
      
      this.GetData();

    },
    platFormChange(e){
        console.log(e);
        this.searchAppName=undefined;
        this.adUnitName=[];
        this.appIds=[];
        this.placementIds=[];
        this.adPlatform=[];
        this.adPlatformIds=[];
        this.adSourceName=[];
        this.$req.getPlatformApp({platform:e.length?e.toString():''}).then(res=>{
            console.log(res);
            if(res.data.code==200){
                this.AppData=res.data.data.apps;
            }else{
                this.AppData=[];
            }
        })
    },
    changeSearch(e,b){
        console.log(this.searchAppName);
        
        this.adUnitName=[];
        this.placementIds=[];
        this.adPlatform=[];
        this.adPlatformIds=[];
        this.adSourceName=[];
        this.appIds=[];
        b.forEach(v=>{
            this.appIds.push(v.key);
        })
        this.$req.getPlatformApp({app_id:this.appIds.toString(),platform:this.PlatForm.toString()}).then(res=>{
            console.log(res);
            if(res.data.code==200){
                this.placements=res.data.data.placements;
            }else {
                this.placements=[];
            }
        })
    },
    adFormatChange(e){
        this.adUnitName=[];
        this.placementIds=[];
        this.adPlatform=[];
        this.adPlatformIds=[];
        this.adSourceName=[];
        let opt={
            platform:this.PlatForm.toString(),
            app_id:this.appIds.toString(),
            media_type:this.adFormat,
        }
        this.$req.getPlatformApp(opt).then(res=>{
            console.log(res);
            if(res.data.code==200){
                this.placements=res.data.data.placements;
            }else{
                this.placements=[];
            }
        })
    },
    adUnitChange(e,b){
        this.placementIds=[];
        console.log(this.adUnitName);
        b.forEach(v=>{
            this.placementIds.push(v.key);
        })
        this.adPlatform=[];
        this.adSourceName=[];
        let opt={
            platform:this.PlatForm.toString(),
            app_id:this.appIds.toString(),
            media_type:this.adFormat,
            placement_id:this.placementIds.toString()
        }
        this.$req.getPlatformApp(opt).then(res=>{
            console.log(res);
            if(res.data.code==200){
                this.networkList=res.data.data.networks;
            }else{
                this.networkList=[];
            }
        })
    },
    adPlatformChange(e,b){
        this.adPlatformIds=[];
        b.forEach(v=>{
            this.adPlatformIds.push(v.key);
        })
        this.adSourceName=[];
        let opt={
            platform:this.PlatForm.toString(),
            app_id:this.appIds.toString(),
            media_type:this.adFormat,
            placement_id:this.placementIds.toString(),
            network_id:this.adPlatformIds.toString()
        }
        console.log(this.adPlatform,"广告平台");
        
        this.$req.getPlatformApp(opt).then(res=>{
            console.log(res);
            if(res.data.code==200){
                this.adSourceList=res.data.data.mediates;
            }else{
                this.adSourceList=[];
            }
        })
    },
    adSourceChange(e,b){
        this.adSourceIds=[];
        b.forEach(v=>{
            this.adSourceIds.push(v.key);
        })
    },
    disabledDate(e) {
      if (this.firstSelectTime != "") {
        if (this.dateSelect == "date") {
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
    GetData() {
      this.compreHensiveChartLoading=true;
      let opt = {
        app_platform:this.PlatForm.join(",") || null,
        app_id:this.appIds.join(",") || null,
        group_by:{},
        field:{},
        type:this.dateSelect,
        start_time: this.date1[0].format("YYYY-MM-DD"),
        end_time: this.date1[1].format("YYYY-MM-DD"),
        placement_type:this.adFormat|| null,
        placement_ids:this.placementIds.join(",")||null,
        network_ids:this.adPlatformIds.join(",")||null,
        mediation_ids:this.adSourceIds.join(",")||null,
        timezone:this.timeZone,
      };
      opt.group_by[this.dateSelect]=1;
      this.indicatorsList.forEach(item=>{
        opt.field[item]=1;
      })
      console.log(opt.field);
      
      this.$req
        .getSyntheticalReport(opt)
        .then(res => {

          console.log(res);
          let arr=JSON.parse(JSON.stringify(res.data.data.report));
          // arr.reverse();
          console.log(arr);
          
          let myChart = this.$echarts.init(document.getElementById("charts"));
          let option;
          setTimeout(() => {
            let data=[];
            let dataX = [];
            let name=[];
            let yAxis=[];
            let series=[];
            arr.forEach(item=>{
              if(this.dateSelect=='date'){
                  dataX.push(item.ym);
              }else if(this.dateSelect=='month'){
                dataX.push(item.ymd);
              }
            })
            console.log(this.dateSelect);
            
            console.log(dataX);
            
            this.indicatorsList.forEach((item,index)=>{
                  
                  this.indicators.forEach(val=>{
                    if(val.value==item){
                      name[index]=val.label;
                    }
                  })
                  data[index]=[];
            })
            
            console.log(data.length,arr.length);
            
            for(var i=0;i<data.length;i++){
              console.log(this.indicatorsList[i]);
              
              for(var j=0;j<arr.length;j++){
                console.log("imp",arr[j][this.indicatorsList[i]],arr[j]);
                
                data[i].push(arr[j][this.indicatorsList[i]])
              }
            }
            console.log(data);
            name.forEach((item,index)=>{
              yAxis.push({
                type: "value",
                // name: item,
                // min: item=='imps_rate'?0:this.getMinValue(data[index]),
                // max: item=='imps_rate'&&this.getMaxValue(data[index])>100?100:this.getMinValue(data[index]),
                // interval:item=='imps_rate'&&this.getMaxValue(data[index])>100?(100 - this.getMinValue(data[index])) / 5:(this.getMaxValue(data[index]) - this.getMinValue(data[index])) / 5,
                splitNumber: 5,
                axisLabel: {
                  formatter: '{value}'
                },
              });
              series.push(
                {
                  name: item,
                  type: "line",
                  yAxisIndex: 0,
                  data: data[index],
                  smooth: true
                }
              )
            })
            console.log(yAxis,series,"数据");
            
              // noCompare.map(item => {
                
              //   if(this.first_indicator=="ctr"){
              //     dataX.push(item.ym);
              //     dataY1.push(Number(item[this.first_indicator])*100);
              //   }else{
              //     dataX.push(item.ym);
              //     dataY1.push(item[this.first_indicator]);
              //   }
              
              // });
              // let max1 = this.getMaxValue(dataY1);
              // let max2 = this.getMaxValue(dataY2);
              // let min1 = this.getMinValue(dataY1);
              // let min2 = this.getMinValue(dataY2);
              if(name.length>0){
                option = {
                  legend: {
                    data: name,
                    right: "40px"
                  },
                  // title: {
                  //   left: "center",
                  //   text: this.AppFilter ? this.appName : null
                  // },
                  tooltip: {
                    trigger: "axis",
                    axisPointer: {
                      type: "line",
                      label: {
                        backgroundColor: "#283b56"
                      }
                    },
                    // formatter: function (params) {
                    //   console.log(params);
                      
                    //     let firstParams = params[0];
                    //     let sndParams = params[1];
                    //     if(firstParams.seriesName=="点击率"||firstParams.seriesName=="CTR"){
                    //       return firstParams.name + ' <br /> ' + firstParams.seriesName + '：' + (Number(firstParams.data)).toFixed(2) + ' %'+'<br />'+sndParams.seriesName + '：' + sndParams.data;
                    //     }else if(sndParams.seriesName=="点击率"||sndParams.seriesName=="CTR"){
                    //       return firstParams.name + ' <br /> ' + firstParams.seriesName + '：' + firstParams.data +'<br />'+sndParams.seriesName + '：' + (Number(sndParams.data)).toFixed(2) + ' %';
                    //     }
                    //     else {
                    //       return firstParams.name + '  <br /> ' + firstParams.seriesName + '：' + firstParams.data+'<br />'+sndParams.seriesName + '：' + sndParams.data ;
                    //     }                      
                    // }
                  },
                  xAxis: {
                    type: "category",
                    data: dataX,
                    axisLabel: {
                      rotate: 40
                    }
                  },
                  yAxis: yAxis
                  // [
                  //   {
                  //     type: "value",
                  //     name: name1,
                  //     min: this.first_indicator=='ctr'?0:min1,
                  //     max: this.first_indicator=='ctr'&&max1>100?100:max1,
                  //     interval:this.first_indicator=='ctr'&&max1>100?(100 - min1) / 5:(max1 - min1) / 5,
                  //     splitNumber: 5,
                  //     axisLabel: {
                  //       formatter: this.first_indicator=='ctr'?'{value} %':'{value}'
                  //     },
                  //   },
                  //   {
                  //     type: "value",
                  //     name: name2,
                  //     min: this.second_indicator=='ctr'?0:min2,
                  //     max: this.second_indicator=='ctr'&&max2>100?100:max2,
                  //     interval: this.second_indicator=='ctr'&&max2>100?(100 - min2) / 5:(max2 - min2) / 5,
                  //     splitNumber: 5,
                  //     axisLabel: {
                  //       formatter: this.second_indicator=='ctr'?'{value} %':'{value}'
                  //     },
                  //   }
                  // ]
                  ,
                  series: series
                  // [
                  //   {
                  //     name: name1,
                  //     type: "line",
                  //     yAxisIndex: 0,
                  //     data: dataY1,
                  //     smooth: true
                  //   },
                  //   {
                  //     name: name2,
                  //     type: "line",
                  //     yAxisIndex: 1,
                  //     data: dataY2,
                  //     smooth: true
                  //   }
                  // ]
                  ,
                  grid: {
                    top: "120px",
                    left: "60px",
                    right: "60px",
                    bottom: "60px"
                  }
                };
                // myChart.clear();
                option &&
                myChart.setOption(option, {
                  notMerge: true
                });
              }else {
                myChart.clear();
              }
              this.compreHensiveChartLoading=false;
          }, 500);
        })
        .catch(err => {
          this.compreHensiveChartLoading=false;
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
  .appPlatform{
    margin-left:116px!important;
    margin-top:16px;
  }
  /deep/.ant-select{
        vertical-align: middle;
        margin-left: 8px;
    }
    /deep/.Confirm{
        float: right;
    }
}
.ChartContent {
  padding: 0 18px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  #charts {
    width: 13rem;
    height: 5.4rem;
  }
  
  .indicators{
    flex: 1;
    .indicatorsTitle{
      background-color: #d9d9d9;
      width: 200px;
      height: 35px;
      line-height: 35px;
      margin-bottom: 0px;
      padding-left: 8px;
    }
    .select_metrics{
      display: flex;
      flex-wrap: wrap;
      border: 1px solid #d9d9d9;
      width: 200px;
      padding: 10px;
      .ant-checkbox-wrapper {
        width: 180px;
        margin-left: 0;
      }
    }
  }
}
</style>