<template>
    <a-spin :spinning="loading">
        <div class="index-page">
            <div class="index_title">
                <span class="title_name">{{$t('index.Welcome')}} {{userName}}</span>
                <div class="title_data hover--color">
                    <span class="title_data_number">{{campaignTotal}}</span>
                    <a-button class="title_data_text shisu_fontSize-big" @click="goBuyer">{{$t('index.CrossPromotion')}}<RightOutlined /></a-button>
                </div>
                <div class="title_data hover--color">
                    <span class="title_data_number">{{appNameData.length}}</span>
                    <a-button class="title_data_text shisu_fontSize-big" @click="goApp">{{$t('index.Apps')}}<RightOutlined /></a-button>
                </div>
            </div>
            <div class="index_data">
                <div class="data_info" v-for="(item,index) in dataInfo" :key="'data'+index">
                    <div class="data_info_top shisu_fontSize-big">
                        {{item.title}}
                    </div>
                    <div class="data_info_center shisu_fontSize-bigPro">
                        {{item.today+(index==2?'%':'')}}
                    </div>
                    <div class="data_info_bottom shisu_fontSize-big">
                        <span>{{$t('index.Yesterday')}}&nbsp;{{item.yesterday+(index==2?'%':'')}}</span>
                        <span>{{(index==2?$t('index.HisAverage')+'&nbsp;':$t('index.Total')+'&nbsp;')+item.total+(index==2?'%':'')}}</span>
                    </div>
                </div>
            </div>
            <div class="index_content">
                <div class="content_top">
                    <a-space :size="8">
                        <div class="content_top_info--left content_top_info_text">
                            {{$t('index.Setting')}}：
                        </div>
                        <a-select class="content_top_info--left" v-model:value="searchData.app_platform" :placeholder="$t('index.Platform')" style="width: 120px" :allowClear="true">
                            <a-select-option value=1>IOS</a-select-option>
                            <a-select-option value=0>Android</a-select-option>
                        </a-select>

                        <a-select class="content_top_info--left" 
                            v-model:value="searchData.app_id"
                            show-search
                            :allowClear="true"
                            :placeholder="$t('index.App')"
                            style="width: 200px"
                            :options="appNameData"
                            :filterOption="filterOption"
                            >
                        </a-select>

                        <a-select  class="content_top_info--left content_top_select"
                            v-model:value="searchData.placement_ids"
                            show-search
                            :allowClear="true"
                            :placeholder="$t('index.Unit')"
                            style="width: 200px"
                            :options="appPlacementData"
                            :filterOption="filterOption"
                            >
                        </a-select>

                        <a-select class="content_top_info--left" v-model:value="searchData.index1" style="width: 120px">
                            <a-select-option v-for="(item,index) in appPlatform" :key="'index'+index" :value="item.english" :disabled="searchData.index2==item.english">{{item.chinese}}</a-select-option>
                        </a-select>
                        <div class="content_top_info--left content_top_checkbox">
                            <a-checkbox v-model:checked="isContrast" @change="onContrast">{{$t('index.Compare')}}</a-checkbox>
                        </div>
                        <a-select class="content_top_info--left" v-if="isContrast" v-model:value="searchData.index2" style="width: 120px">
                            <a-select-option v-for="(item,index) in appPlatform" :key="'index2'+index" :value="item.english" :disabled="searchData.index1==item.english">{{item.chinese}}</a-select-option>
                        </a-select>
                        <a-button class="content_top_info--left" type="primary" @click="onSubmit">{{$t('index.Confirm')}}</a-button>
                    </a-space>
                    <a-button class="content_top_info--right content_top_btn--hover" @click="goBuyerReport">{{$t('index.Details')}}</a-button>
                </div>
                <a-spin :spinning="chartLoading">
                    <div class="content_echart">
                        <div id="echart" v-if="isEchart"></div>
                    </div>
                </a-spin>
            </div>
        </div>
    </a-spin>
</template>

<script>

import echarts from '@/plugins/echarts.js';
import request from "@/utils/request.js";
import router from '@/router';
import store from "@/store";
import { useI18n } from 'vue-i18n';

import { reactive,onMounted,ref,watch,nextTick,getCurrentInstance  } from "vue";

import {
  RightOutlined
} from "@ant-design/icons-vue";

export default ({
    name:"Index",
    components: {
        RightOutlined
    },
    setup() {

        //const { locale, t } = i18n();
        const { t } = useI18n()

        console.log(t('index.Imps'));

        /* -------------------------------ref---------------------------- */
        const appName = ref('');
        const isContrast = ref(false);
        const num_elements = ref(100);
        const userName = ref('');
        const campaignTotal = ref(0);
        const loading = ref(false);
        const chartLoading=ref(false);
        const isEchart = ref(true);

        //let proxy = getCurrentInstance();

        //console.log(proxy.$t('index.Details'));

        /* -----------------------------reactive------------------------- */

        const state = reactive({
            appPlatform:[
                {
                    "english":"imps",
                    "chinese":t('index.Imps'),

                },
                {
                    "english":"clicks",
                    "chinese":t('index.Clicks')
                },
                {
                    "english":"ctr",
                    "chinese":t('index.Ctr')
                }
            ],
            dataInfo:[
                {today:"0",yesterday:"0",total:"0",title:t('index.TodayImps')},
                {today:"0",yesterday:"0",total:"0",title:t('index.TodayClicks')},
                {today:"0",yesterday:"0",total:"0",title:t('index.TodayCTR')}
            ],
            appNameData:[], 
            appPlacementData:[],
            lineData:[], 
            product:[],
            searchData:{
                app_id:null,
                index1:'imps', 
                index2:null,
                compare:0,
                app_platform:null,
                placement_ids:null,
            },
            yAxis:[]
        })

        /* -----------------------------function------------------------- */

        onMounted(() => {
            getAppNameList();
            getCampaign();
            getUserInfo();
            loading.value=true;
            getIndexReport("chart");
        });

        watch(() => state.searchData.app_platform, (newValue, oldValue) => {
            state.searchData.app_id = null;
            getAppNameList(newValue);
        })

        watch(() => state.searchData.app_id, (newValue, oldValue) => {
            state.searchData.placement_ids = null;
            if(newValue==null){
                state.appPlacementData.length=0;
                return;
            }
            getAppPlacement(newValue);
        })

        watch(() => t('index.Welcome'), (newValue, oldValue) => {

            state.appPlatform[0].chinese=t('index.Imps');
            state.appPlatform[1].chinese=t('index.Clicks');
            state.appPlatform[2].chinese=t('index.Ctr');
            
            state.dataInfo[0].title=t('index.TodayImps');
            state.dataInfo[1].title=t('index.TodayClicks');
            state.dataInfo[2].title=t('index.TodayCTR');

            onSubmit();

        })

        const echart = ((e)=>{

            let myChart = echarts.getInstanceByDom(document.getElementById("echart"))
            if (myChart == null) { // 如果不存在，就进行初始化
                myChart = echarts.init(document.getElementById("echart"));
            }

            //let myChart = echarts.init(document.getElementById("echart"));

            window.addEventListener("resize", () => {
                myChart.resize();
            })
            let option={
                xAxis: {
                    type: 'category',
                    data: state.product
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {

                        if(params.length==1){
                            let firstParams = params[0];
                            if(firstParams.seriesName==t('index.Ctr')){
                                return firstParams.name + ' <br /> ' + '<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:'+firstParams.color+'\"></span>'+firstParams.seriesName + '：' + (firstParams.data) + ' %';
                            }else {
                                return firstParams.name + '  <br /> ' + '<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:'+firstParams.color+'\"></span>'+firstParams.seriesName + '：' + firstParams.data ;
                            }
                        }else{
                            let firstParams = params[0];
                            let sndParams = params[1];
                            if(firstParams.seriesName==t('index.Ctr')){
                                return firstParams.name + ' <br /> ' + '<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:'+firstParams.color+'\"></span>'+firstParams.seriesName + '：' + (firstParams.data) + ' %'+'<br />'+
                                '<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:'+sndParams.color+'\"></span>'+sndParams.seriesName + '：' + sndParams.data;
                            }else 
                                if(sndParams.seriesName==t('index.Ctr')){
                                    return firstParams.name + ' <br /> ' + '<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:'+firstParams.color+'\"></span>'+firstParams.seriesName + '：' + firstParams.data +'<br />'+
                                    '<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:'+sndParams.color+'\"></span>'+sndParams.seriesName + '：' + sndParams.data + ' %';
                                }else {
                                    return firstParams.name + '  <br /> ' + '<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:'+firstParams.color+'\"></span>'+firstParams.seriesName + '：' + firstParams.data+'<br />'+
                                    '<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:'+sndParams.color+'\"></span>'+sndParams.seriesName + '：' + sndParams.data ;
                                }
                        }           
                    }
                },
                legend: {
                    orient: 'horizontal',
                    left:'left'
                },
                yAxis: state.yAxis,
                series: state.lineData,
                grid: {
                    top: "80px",
                    left: "60px",
                    right: "60px",
                    bottom: "40px"
                }
            };
            myChart.setOption(option,true);

            e=="chart"?loading.value=false:chartLoading.value=false;
    
        });

        const onContrast = (()=>{
            state.searchData.compare=isContrast.value?1:0;
            if(!isContrast.value){
                state.searchData.index2=null;
            }else{
                state.searchData.index2=state.appPlatform[0].english!=state.searchData.index1?state.appPlatform[0].english
                                            :(state.appPlatform[1].english!=state.searchData.index1?state.appPlatform[1].english
                                                :state.appPlatform[2].english);
            }
        });

        const onSubmit = (()=>{
            state.lineData.length=0;
            state.product.length=0;
            state.yAxis.length=0;
            chartLoading.value=true;
            getIndexReport();
        });

        const filterOption = (input, option) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };

        const getAppNameList = ((platform)=>{
            state.appNameData.length=0;
            let data={
                platform:platform
            }
            request.appNameList(data).then(res=>{
                if((JSON.stringify(res.data.data)!="{}")){
                    res.data.data.forEach(item => {
                        state.appNameData.push({
                            label: item.appInfo.app_name,
                            value: item.app_id
                        })
                    });   
                }
            })
        });

        const getCampaign = (()=>{
            let data={
                num_elements:1,
                page:1,
            }
            request.SellercampaignList(data).then(res=>{
                if((JSON.stringify(res.data.data)!="{}")){
                    campaignTotal.value=res.data.data.total;
                }
            })
        });

        const getAppPlacement = ((value)=>{
            state.appPlacementData.length = 0;
            let data = {
                app_id: value,
                page: 1,
                num_elements: num_elements.value
            };
            request.AppPlacement(data).then(res=>{
                res.data.data.placement_list.forEach(item => {
                    state.appPlacementData.push({
                        label: item.placement_name,
                        value: item.placement_id
                    })
                });
                if(res.data.data.total>state.appPlacementData.length){
                    num_elements.value=res.data.data.total;
                    getAppPlacement(value);
                }else{
                    num_elements.value=100;
                }
            })
        });

        const getIndexReport = ((e)=>{
            console.log(e,loading,chartLoading)
            let data={
                compare:state.searchData.compare,
                index1:state.searchData.index1,
            }
            if(state.searchData.app_id!=null){
                data['app_id']=parseInt(state.searchData.app_id);
                if(state.searchData.placement_ids!=null){
                    data['placement_ids']=parseInt(state.searchData.placement_ids);
                }
            }
            if(state.searchData.app_platform!=null){
                data['app_platform']=parseInt(state.searchData.app_platform);
            }
            if(state.searchData.index2!=null){
                data['index2']=state.searchData.index2;
            }

            isEchart.value=false;

            request.indexReport(data).then(res=>{

                state.dataInfo.forEach((item,index) => {
                    let str=index==0?'imps':(index==1?'clicks':'ctr');

                    let today=res.data.data.today_data[0][str];
                    let yesterday=res.data.data.yesterday_data[0][str];
                    let total=res.data.data.count_data[0][str];

                    item.today = today==null?0:(str=='ctr'?(today*100).toFixed(2):today);
                    item.yesterday = yesterday==null?0:(str=='ctr'?(yesterday*100).toFixed(2):yesterday);
                    item.total = total==null?0:(str=='ctr'?(total*100).toFixed(2):total);
                });

                setLineData(0,res.data.data.no_compare_data);

                if(res.data.data.compare_data.length>0){
                    setLineData(1,res.data.data.compare_data);
                }

                isEchart.value=true;
                nextTick(()=>{
                    echart(e);
                })

            });

        });

        const getUserInfo = (()=>{
            request.getUserInfo().then(res=>{
                userName.value=res.data.data.username;
            })
        });

        const setLineData = ((tag,item)=>{

            let index=tag==0?'index1':'index2';

            let name=state.searchData[index]=='imps'?t('index.Imps'):(state.searchData[index]=='clicks'?t('index.Clicks'):t('index.Ctr'))

            state.lineData.push({
                name: name,
                type: 'line',
                yAxisIndex: tag,
                smooth: true,
                data: []
            })

            item.forEach(item => {
                if(tag==0){
                    state.product.push(item.ymd);
                }
                state.lineData[tag].data.push(state.searchData[index]=='ctr'?item[state.searchData[index]]*100:item[state.searchData[index]]);
            });

            let max = getMaxValue(state.lineData[tag].data);
            let min = getMinValue(state.lineData[tag].data);

            /* console.log(max);
            console.log(min); */

            state.yAxis.push({
                type: "value",
                name: name,
                min: state.searchData[index]=='ctr'?0:min,
                max: state.searchData[index]=='ctr'&&max>100?100:max,
                interval:state.searchData[index]=='ctr'&&max>100?(100 - min) / 5:(max - min) / 5,
                splitNumber: 5,
                axisLabel: {
                    formatter: state.searchData[index]=='ctr'?'{value} %':'{value}'
                },
            });

        });

        const getMaxValue=((arr)=>{
            const max = Math.max(...arr);
            // 这样处理是为了不让最大值刚好到坐标轴最顶部
            console.log(max);
            if(max==0){
                return 1;
            }
            if (max < 1) {
                return (max / 8.5) * 10;
            }
            return Math.ceil(max / 8.5) * 10;
        });

        const getMinValue=((arr)=>{
            const min = Math.min(...arr);
            // 这样处理是为了不让最大值刚好到坐标轴最底部
            return Math.floor(min / 12) * 10;
        });

        const goBuyer = (()=>{
            router.push({path:'/hl/buyer'})
            store.dispatch("Util/OpenMenuKey",['/hl/buyer']);
            store.dispatch("Util/OpenKeys",['/hl/buyer']);
        });

        const goApp = (()=>{
            router.push({path:'/hl/app'})
            store.dispatch("Util/OpenMenuKey",['/hl/app']);
            store.dispatch("Util/OpenKeys",['/hl/app']);
        }) 

        const goBuyerReport= (()=>{
            router.push({path:'/hl/buyerReport'})
            store.dispatch("Util/OpenMenuKey",['/hl/buyerReport']);
            store.dispatch("Util/OpenKeys",['1']);
        })

        /* -----------------------------return------------------------- */

        return {
            /* -------ref------- */
            appName,isContrast,userName,campaignTotal,loading,isEchart,chartLoading,

            /* -----reactive---- */
            ...state,

            /* -----function---- */
            onContrast,onSubmit,filterOption,goApp,goBuyer,goBuyerReport
        }
    },
    mounted(){
        store.dispatch("Util/OpenMenuKey",['/hl/index']);
        store.dispatch("Util/OpenKeys",['/hl/index']);
    },
})
</script>

<style scoped>
    @import "../assets/css/index.css";
</style>

<style lang="less" scoped>

    @color:linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);

    .index-page{
        padding: 24px;
        background-color: #fff;
        border-radius: 10px;

        .index_title{
            height: 53px;
            width: 100%;

            .title_name{
                float: left;
                color: #000000b0;
                line-height: 53px;
                font-weight: 600;
                font-size: 16px;
            }

            .title_data{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                float: right;
                height: 100%;
                margin: 0 20px;

                .title_data_number{
                    color: #000000b0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .title_data_text{
                    border: 0;
                    padding: 0;
                }
            }

        }

        .index_data{
            display: flex;
            justify-content: space-around;
            width: 100% ;
            padding: 20px 0 20px 0;
            margin: 20px 0 30px 0;
            border-top: 1px solid #0000001c;
            border-bottom: 1px solid #0000001c;

            .data_info{
                box-sizing:border-box;
                width: 25%;
                height: 100%;
                padding: 20px;
                border: 1px solid #0000001c;
                border-radius: 8px;

                .data_info_top,.data_info_bottom{
                    display: flex;
                    justify-content: space-between;
                }

                .data_info_center{
                    //font-size: 2em;
                    font-weight: 800;
                    text-align: center;
                }

            }

        }

        .index_content{
            box-sizing:border-box;
            height: auto;
            width: 100%;

            .content_top{
                height: 32px;
                width: 100%;
                margin-bottom: 30px;

                .content_top_info--left{
                    float: left;
                }

                .content_top_info--right{
                    float: right;
                }

                /deep/ .ant-input{
                    width: 200px !important;
                }

                .content_top_checkbox{
                    display: flex;
                    align-items:center;
                    height: 100%;
                    margin-right:8px;
                }

                .content_top_info_text{
                    line-height: 32px;
                    font-size: 16px;
                }
                
            }

            .content_echart{
                height: 550px;
                width: 100%;
                margin: 0 auto;
                
                #echart{
                    height: 100%;
                    width: 100%;
                    margin: 0 auto;
                }
            }
        }

    }

</style>