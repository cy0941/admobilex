<template>
<div class="userRetention">
    <div class="ReportHeader clearfix">
        <div style="float:left;line-height:35px;">
            <div>
                <a-select
                class="appfilter"
                v-model:value="AppFilter"
                style="width: 240px"
                :placeholder="$t('report.promotedApp')"
                showArrow
                allowClear
                :maxTagCount="1"
                @change="selectAppCahnge"
                >
                <a-select-option v-for="item in AppData" :key="item.appInfo.id">
                    <span>
                    <AppleFilled style="margin-right:5px;" v-if="item.appInfo.platform==1" />
                    <AndroidFilled style="margin-right:5px;" v-else />
                    {{item.appInfo.app_official_name}}
                    </span>
                </a-select-option>
                </a-select>
                <a-range-picker
                    style="width:320px;margin-left:8px"
                    separator="-"
                    v-model:value="date1"
                    :allowClear="false"
                    :ranges="ranges"
                    :disabledDate="disabledDate"
                    @calendarChange="calendarChange1"
                    @change="dateChange"
                >
                    <template #suffixIcon>
                        <CalendarOutlined />
                    </template>
                </a-range-picker>
                <a-select
                v-model:value="timeZone"
                style="width: 240px;"
                class="selectTimeZone"
                placeholder="选择时区"
                showArrow
                @change="timeZoneChange"
            >
                <a-select-option v-for="item in timeZones" :key="item.value" :value="item.value">
                    <span>{{item.label}}</span>
                </a-select-option>
            </a-select>
            </div>
        </div>
    </div>
    <a-divider style="height: 1px; background-color:#f2f2f2" />
    <h1>{{$t('fullReport.UserActivityChart')}}</h1>
    <a-spin :spinning="userActivityLoading">
        <a-radio-group v-model:value="reportType" @change="reportTypeChange" button-style="solid">
            <a-radio-button value="new_user_count">{{$t('fullReport.newUsers')}}</a-radio-button>
            <a-radio-button value="dau" >{{$t('fullReport.DAU')}}</a-radio-button>
            <a-radio-button value="imps" >{{$t('fullReport.Imps')}}</a-radio-button>
            <a-radio-button value="frequency" >{{$t('fullReport.UsageCounter')}}</a-radio-button>
            <a-radio-button value="avg_frequency" >{{$t('fullReport.UsageCounterDAU')}}</a-radio-button>
            <a-radio-button value="avg_imps" >{{$t('fullReport.ImpsDAU')}}</a-radio-button>
            <a-radio-button value="avg_duration" >{{$t('fullReport.TimeLengthDAU')}}</a-radio-button>
        </a-radio-group>
        <div class="ChartContent">
            <div id="charts" v-if="!ChartType"></div>
        </div>
        <div class="export_report">
            <span>{{$t('fullReport.UserActivityReport')}}</span>
            <a-button  style="z-index:999" @click="exportToExcel" >{{$t('report.export')}}</a-button>
        </div>
        <a-table :data-source="retention" id="table" >
            <a-table-column key="dd" :title="$t('fullReport.date')" data-index="dd" />
            <a-table-column key="mediate_app_name" :title="$t('fullReport.app')" data-index="mediate_app_name" />
            <a-table-column key="new_user_count" :title="$t('fullReport.newUsers')" data-index="new_user_count" />
            <a-table-column key="total_user" :title="$t('fullReport.CumulativeUsers')" data-index="total_user" />
            <a-table-column key="dau" :title="$t('fullReport.DAU')" data-index="dau" />
            <a-table-column key="imps" :title="$t('fullReport.Imps')" data-index="imps" />
            <a-table-column key="frequency" :title="$t('fullReport.UsageCounter')" data-index="frequency" />
            <a-table-column key="avg_frequency" :title="$t('fullReport.UsageCounterDAU')" data-index="avg_frequency" />
            <a-table-column key="avg_imps" :title="$t('fullReport.ImpsDAU')" data-index="avg_imps" />
            <a-table-column key="avg_duration" :title="$t('fullReport.TimeLengthDAU')" data-index="avg_duration" />
        </a-table>
    </a-spin>
</div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>
import {CalendarOutlined,DownOutlined,AppleOutlined,AndroidOutlined,AppleFilled,AndroidFilled} from "@ant-design/icons-vue";
import { useI18n } from 'vue-i18n';
import { defineComponent, reactive, ref, toRefs,computed } from "vue";
import timezone from "../../utils/timeZine.json"
import moment from "moment";
import XLSX from 'xlsx';
import FileSaver from 'file-saver'
import store from "@/store";
import { message} from 'ant-design-vue';

export default defineComponent({
    name: "ReportChart",
    props: ["ChartType"],
    components: {
        CalendarOutlined,
        DownOutlined,
        AppleOutlined,
        AndroidOutlined,
        AppleFilled,
        AndroidFilled
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
        return{
            reportType:"new_user_count",
            retention:[],
            userActivityLoading:false,
            timeZone:undefined,
            appIds:[],
            reportTypeList:[
                {
                    value:"new_user_count",
                    label:this.$t('fullReport.newUsers')
                },
                {
                    value:"dau",
                    label:this.$t('fullReport.DAU')
                },
                {
                    value:"imps",
                    label:this.$t('fullReport.Imps')
                },
                {
                    value:"frequency",
                    label:this.$t('fullReport.UsageCounter')
                },
                {
                    value:"avg_frequency",
                    label:this.$t('fullReport.UsageCounterDAU')
                },
                {
                    value:"avg_imps",
                    label:this.$t('fullReport.ImpsDAU')
                },
                {
                    value:"avg_duration",
                    label:this.$t('fullReport.TimeLengthDAU')
                }
            ],
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
        this.timeZone=store.state["Util"].userBehaviorReportTimeZone?store.state["Util"].userBehaviorReportTimeZone:store.state["User"].userInfo.timezone;
        // console.log(timezone,'时区');
        
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
        dateChange(){
            this.GetData();
        },
        timeZoneChange(e){
            store.dispatch("Util/SetUserBehaviorReportTimeZone",e);
            this.GetData();
        },
        reportTypeChange(){
            this.GetData();
        },
        GetAppList() {
            let opt = { name: "" };
            this.$req.appNameList(opt).then(res => {
                if (res.data.code === 200) {
                if (res.data.data) {
                    this.AppData = res.data.data;
                    if(this.AppData.length){
                        this.AppFilter=this.AppData[0].appInfo.id;
                    }
                    this.GetData();
                } else {
                    this.AppData = [];
                }
                }
            });
        },
        selectAppCahnge(e,b){
            console.log(b);
            
            console.log("应用");
            
            this.GetData();
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
        GetData() {
            this.userActivityLoading=true;
            let opt = {
                app_id: this.AppFilter||null,
                start_time: this.date1[0].format("YYYY-MM-DD"),
                end_time: this.date1[1].format("YYYY-MM-DD"),
                field:{},
                timezone:this.timeZone,
            };
            opt.field[this.reportType]=1;
            this.$req
                .getUserBehaviorReport(opt)
                .then(res => {
                    console.log(res);
                    if(res.data.code==200){
                        let arr=res.data.data.chartReport;
                        this.retention=res.data.data.reports;
                        console.log(arr);
                        
                        let myChart = this.$echarts.init(document.getElementById("charts"));
                        let option;
                        setTimeout(() => {
                            let dataX = [];
                            let dataY = [];
                            let name = "";
                            this.reportTypeList.forEach(item=>{
                                if(item.value==this.reportType){
                                    name=item.label;
                                }
                            })
                            
                            arr.forEach(item=>{
                                dataX.push(item.ymd);
                                dataY.puhs(item[this.reportType]);
                            })
                            option = {
                                legend: {
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
                                yAxis:[
                                    {
                                        type: "value",
                                        name: name,
                                        splitNumber: 5,
                                        axisLabel: {
                                            formatter: '{value}'
                                        },
                                    },
                                ],
                                series: [
                                    {
                                        name: name,
                                        type: "line",
                                        yAxisIndex: 0,
                                        data: dataY,
                                        smooth: true
                                    },
                                
                                ],
                                grid: {
                                    top: "120px",
                                    left: "60px",
                                    right: "60px",
                                    bottom: "60px"
                                }
                            };
                            option && myChart.setOption(option, {
                                notMerge: true
                            });
                            this.userActivityLoading=false;
                        }, 500);
                        
                    }else {
                        this.userActivityLoading=false;
                    }
            })
            .catch(err => {
                this.userActivityLoading=false;
            });
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
        },
        exportToExcel(){
            console.log("下载报表");
            let et = XLSX.utils.table_to_book(document.getElementById('table')); //此处传入table的DOM节点
            let etout = XLSX.write(et, {
                bookType: 'xlsx',
                bookSST: true,
                type: 'array'
            });
            try {
                FileSaver.saveAs(new Blob([etout], {
                    type: 'application/octet-stream'
                }), '报表.xlsx');   //trade-publish.xlsx 为导出的文件名
            } catch (e) {
            }
            return etout;
            
        },
  }
});
</script>
<style lang="less" scoped>
.userRetention{
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    border-top-left-radius: 0;
    /deep/.ant-select{
        // vertical-align: middle;
        margin-left: 8px;
    }
    /deep/.ant-radio-button-wrapper{
        min-width: 120px;
        border-bottom: none;
        text-align: center;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    /deep/.el-table{
        font-size: 12px;
        min-height: 400px;
        
        .adcreative{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p{
                margin-bottom: 0;
            }
        }

    }
    /deep/.el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #e6f7ff;
    }
    .export_report{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 8px 0;
        span{
            font-size: 16px;
        }
    }
    /deep/.ant-select {
        // margin-right: 16px;
        .ant-select-selector {
            .ant-select-selection-overflow-item {
            max-width: 125px;
            }
        
        }
    }
.ChartContent {
  padding:  18px;
  border: 1px solid #d9d9d9;
  width: 100%;
  box-sizing: border-box;
  #charts {
    width: 15rem;
    height: 5.4rem;
    margin: auto;
  }
}
}
</style>