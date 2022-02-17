<template>
    <div class="effectivePeriod" >
        <div class="selectall">
            <input type="checkbox" v-model="selectAll" id="selectAllid" @click="selectAllornot"><label for="selectAllid" style="cursor:pointer;padding-left:5px;">{{$t('newMediation.selectAll')}}</label>
            <div class="righttips">
                <div class="tiplist">
                    <span class="current"></span>{{$t('newMediation.willServe')}}
                </div>
                <div class="tiplist">
                    <span></span>{{$t('newMediation.wontServe')}}
                </div>
            </div>
        </div>
        <div class="timecontainer" id="timecontainer" @mousedown="mousedownfn">
            
            <div class="bottomtime">
                <div class="timeList" v-for="(item,index) in weekName" :key="index">{{item}}</div>
            </div>
            <div class="swrap">
                <div class="leftweek">
                    <div class="weekname" v-for="(item,index) in timeName" :key="index">{{item}}</div>
                </div>
                <div class="mainbox">
                    <div class="boxlist"><div class="list" :title="`${timeSetp} ${$t('newMediation.hours')}`" v-for="(item,index) in timeList" :class="{selected:item.isSelect}" @click="setcurrent(item.isSelect,index)" :key="item.id"></div></div>
                </div>
            </div>
        </div>
        <div class="timeZone">
                <span>{{$t('newMediation.timeZone')}}</span>
                <a-radio-group v-model:value="timeRadio" class="restrictions">
                    <a-radio value="1" >{{$t('newMediation.accountTimezone')}}</a-radio>
                    <a-radio value="2">
                        
                    </a-radio>
                    <a-select
                            v-model:value="selectTime"
                            style="width:250px;"
                            :placeholder="$t('newMediation.selectTimezone')"
                            showArrow
                            class="searchName"
                            :disabled="timeRadio==1"
                            >
                                <!-- <template #suffixIcon>
                                    <SearchOutlined style="color:#6577c8"/>
                                </template> -->
                                <a-select-option v-for="item in timeZoneList" :value="item" :key="item">
                                    <span>
                                        {{item}}
                                    </span>
                                </a-select-option>
                        </a-select>
                </a-radio-group>
            </div>
            <!-- <div class="footerBtn">
                <a-button type="primary" class="saves" @click="effectiveSave">{{$t('newMediation.save')}}</a-button>
            </div> -->
    </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>
import { useI18n } from 'vue-i18n';
export default {
    name:"effectivePeriod",
    
    props:["effectiveTime","timeZone","userInfo"],
    data(){
        return {
            weekName: [this.$t('newMediation.monday'), this.$t('newMediation.tuesday'), this.$t('newMediation.wednesday'), this.$t('newMediation.thursday'), this.$t('newMediation.friday'), this.$t('newMediation.saturday'), this.$t('newMediation.sunday')],
            timeName: ['12:00 am', '01:00 am','02:00 am','03:00 am','04:00 am','05:00 am','06:00 am','07:00 am','08:00 am','09:00 am','10:00 am','11:00 am','12:00 pm','01:00 pm','02:00 pm','03:00 pm','04:00 pm','05:00 pm','06:00 pm','07:00 pm','08:00 pm','09:00 pm','10:00 pm','11:00 pm'],
            timeList: "",
            isSelect: true,
            selectBoxDashed: null,
            startX: null,
            startY: null,
            initx: null,
            scrollX:null,
            scrollY:null,
            inity: null,
            timeString:"",
            timeSetp:1,
            dropPointX:"",
            dropPointY:"",
            selectTime:"US/Eastern",
            timeRadio:"1",
            selectAll:false,
            left:"",
            timeZoneList:[
                "US/Eastern",
                "US/Central",
                "US/Mountain",
                "US/Pacific",
                "CET",
                "UTC",
                "Pacific/Apia",
                "Pacific/Honolulu",
                "America/Juneau",
                "America/Los_Angeles",
                "America/Denver",
                "America/Chicago",
                "America/New_York",
                "America/Caracas",
                "America/Halifax",
                "America/St_Johns",
                "America/Argentina/Buenos_Aires",
                "Atlantic/South_Georgia",
                "Atlantic/Cape_Verde",
                "Europe/London",
                "Europe/Amsterdam",
                "Europe/Berlin",
                "Africa/Cairo",
                "Asia/Jerusalem",
                "Europe/Moscow",
                "Asia/Tehran",
                "Asia/Dubai",
                "Asia/Kabul",
                "Indian/Maldives",
                "Asia/Kolkata",
                "Asia/Katmandu",
                "Asia/Dhaka",
                "Indian/Cocos",
                "Asia/Bangkok",
                "Asia/Hong_Kong",
                "Asia/Tokyo",
                "Australia/Adelaide",
                "Australia/Sydney",
                "Asia/Magadan",
            ]
            
        }
    },
    mounted(){
        const { t } = useI18n();
        this.timeZoneList=this.timeZoneList.filter(val=>{
            return val!=this.userInfo.timezone;
        })
            let _timeArray = []
        for (let i = 0; i < 24; i++) {
            _timeArray.push({
                day: "monday",
                end_hour: i,
                start_hour: i,
                isSelect:false,
                },
                {
                    day: "tuesday",
                    end_hour: i,
                    start_hour: i,
                    isSelect:false,
                }
                ,
                {
                    day: "wednesday",
                    end_hour: i,
                    start_hour: i,
                    isSelect:false,
                }
                ,
                {
                    day: "thursday",
                    end_hour: i,
                    start_hour: i,
                    isSelect:false
                }
                ,
                {
                    day: "friday",
                    end_hour: i,
                    start_hour: i,
                    isSelect:false
                }
                ,
                {
                    day: "saturday",
                    end_hour: i,
                    start_hour: i,
                    isSelect:false
                },
                {
                    day: "sunday",
                    end_hour: i,
                    start_hour: i,
                    isSelect:false
                },)
        }
        _timeArray.map((val,i)=>{
            val.id=i;
        })
        
        this.timeList=_timeArray;
        if(this.effectiveTime.length){
            for(var i=0;i<this.effectiveTime.length;i++){
                for(var j=0;j<this.timeList.length;j++){
                    if(this.effectiveTime[i].day==this.timeList[j].day&&this.effectiveTime[i].start_hour<=this.timeList[j].start_hour&&this.effectiveTime[i].end_hour>=this.timeList[j].start_hour){
                        this.timeList[j].isSelect=true;
                    }
                }
            }
        }
        if(this.timeZone!=""){
            for(var i=0;i<this.timeZoneList.length;i++){
                if(this.timeZoneList[i]==this.timeZone){
                    this.timeRadio="2";
                    this.selectTime=this.timeZone;
                }
            }
        }
        let all= this.timeList.every(value=>{
                return value.isSelect
            })
            
        this.selectAll=all;
        document.body.removeEventListener("mouseup",this.mouseUpfn);
    },
    methods: {
        clearBubble(e) {
            if (e.stopPropagation) {
                e.stopPropagation()
            } else {
                e.cancelBubble = true
            }
            if (e.preventDefault) {
                e.preventDefault()
            } else {
                e.returnValue = false
            }
        },
        mousedownfn(e) {
            //  创建选框节点
            this.dropPointX=e.x||e.clientX;
            this.dropPointY=e.y||e.clientY;
            // console.log(this.dropPointX,this.dropPointY);
            
            this.selectBoxDashed = document.createElement('div')
            this.selectBoxDashed.className = 'select-box-dashed'

            document.body.appendChild(this.selectBoxDashed);
            this.scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            this.scrollY = document.documentElement.scrollTop ||document.body.scrollTop;
            //  设置选框的初始位置
            
            this.startX = e.x + this.scrollX || e.clientX + this.scrollX;
            this.startY = e.y + this.scrollY|| e.clientY + this.scrollY;
            this.selectBoxDashed.style.cssText = `left:${this.startX}px;top:${this.startY}px`;
            
            //  清除事件冒泡、捕获
            this.clearBubble(e);
            document.getElementById('timecontainer').addEventListener('mousemove', this.mousemovefn);
            document.body.addEventListener('mouseup', this.mouseUpfn);
        },
        mousemovefn(e) {
            //  设置选框可见
            // console.log(e);
            this.selectBoxDashed.style.display = 'block'
            //  根据鼠标移动，设置选框的位置、宽高
            this.initx = e.x + this.scrollX || e.clientX + this.scrollX;
            this.inity = e.y + this.scrollY || e.clientY + this.scrollY;
            //  暂存选框的位置及宽高，用于将 select-item 选中
            
            this.left = Math.min(this.initx, this.startX);
            this.top = Math.min(this.inity, this.startY);
            this.width = Math.abs(this.initx - this.startX);
            this.height = Math.abs(this.inity - this.startY);
            
            this.selectBoxDashed.style.left = `${this.left}px`;
            this.selectBoxDashed.style.top = `${this.top}px`;
            this.selectBoxDashed.style.width = `${this.width}px`;
            this.selectBoxDashed.style.height = `${this.height}px`;
            let fileDivs = document.getElementsByClassName('list');
            for (let i = 0; i < fileDivs.length; i++) {
                let itemX_pos = fileDivs[i].offsetWidth + fileDivs[i].getBoundingClientRect().left+this.scrollX;
                // console.log(fileDivs[0].getBoundingClientRect().left);
                let itemY_pos = fileDivs[i].offsetHeight + fileDivs[i].getBoundingClientRect().top+this.scrollY;
                let condition1 = itemX_pos > this.left;
                let condition2 = itemY_pos > this.top;
                let condition3 = fileDivs[i].getBoundingClientRect().left+this.scrollX < (this.left + this.width);
                let condition4 = fileDivs[i].getBoundingClientRect().top+this.scrollY < (this.top + this.height);
                
                if (condition1 && condition2 && condition3 && condition4) {
                    
                fileDivs[i].classList.add('temp-selected');
                } else {
                fileDivs[i].classList.remove('temp-selected');
                }
            }
            
            this.clearBubble(e);
        },
        mouseUpfn(e) {
            if(document.getElementById('timecontainer')){
                document.getElementById('timecontainer').removeEventListener('mousemove', this.mousemovefn)
            }
            // console.log(this.left,this.dropPointX);
            
            let selectDom = document.getElementsByClassName('temp-selected');
            [].slice.call(selectDom).forEach(item => {
                if(this.left<this.dropPointX){
                    item.classList.remove('selected')
                }else{
                    item.classList.add('selected')
                }
                item.classList.remove('temp-selected')
            })
            if (this.selectBoxDashed) {
                try {
                this.selectBoxDashed.parentNode.removeChild(this.selectBoxDashed)
                } catch (err) {
                // console.log(err)
                }
            }
            let fileDivs = document.getElementsByClassName('list')
            for (let i = 0; i < fileDivs.length; i++) {
                if (fileDivs[i].classList.contains('selected')) {
                this.timeList[i].isSelect=true;
                } else {
                this.timeList[i].isSelect=false;
                }
            }
            let arr= this.timeList.every(value=>{
                return value.isSelect
            })
            
            this.selectAll=arr;
            
            this.clearBubble(e);
            document.body.removeEventListener("mouseup",this.mouseUpfn);
        },
        setcurrent(item, index) {
            if (item == 0) {
                this.timeList[index].isSelect=true;
            } else {
                this.timeList[index].isSelect=false;
            }
            let arr= this.timeList.every(value=>{
                return value.isSelect
            })
            
                this.selectAll=arr;
            
        },
        selectAllornot(e) {
            this.timeList.map(val=>{
                if(e.target.checked){
                    val.isSelect=true;
                }else{
                    val.isSelect=false; 
                }
                
            })
        },
        effectiveSave(){
            this.$emit('triggertime', [this.timeList,this.timeRadio,this.selectTime])
        }
    }

}
</script>

<style lang="less" scoped>
    .effectivePeriod{
        .selectall{
            margin-left:80px;
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            position: relative;
        }
        .timecontainer {
            overflow: hidden;
            
        }
        .righttips{
                position: absolute;
                right: 30px;
                font-size:14px;
                float: right;
                display: flex;
                .tiplist{
                    display: flex;
                    align-items: center;
                    margin-right:10px;
                    span{
                        display: inline-block;
                        width:25px;
                        height:16px;
                        border:1px solid #999;
                        margin-right:3px;
                    }
                    span.current{
                        background: #43a9ed;
                        border-color: #43a9ed;
                    }
                }
                
            }
        .bottomtime{
            padding-left: 80px;
            margin-bottom: 5px;
            .timeList{
                display: inline-block;
                vertical-align: middle;
                font-size:14px;
                width:82px;
                height: 35px;
                margin-right: 3px;
                line-height: 35px;
                background-color: #eaf5ff;
                text-align: center;

            }
            .timeList:nth-child(7){
                width: 86px;
                margin: 0;
            }
        }
        .swrap{
            display: flex;
            justify-content: left;
            // width:780px;overflow: hidden;
            .leftweek{
                width:80px;
                vertical-align: middle;
                .weekname{
                    width:80px;
                    height:20px;
                    line-height:20px;
                    padding-right: 5px;
                    text-align: right;
                    font-size:14px;
                }
            }
            .mainbox{
                vertical-align: middle;
                // width: 316px;
                overflow: hidden; 
                width: fit-content;
                .boxlist{
                    overflow: hidden;
                    border-left: 1px solid #ccc;
                    & .list:nth-child(-n+7){
                        border-top: 1px solid #ccc;
                    }
                    .list{
                        float:left;
                        height: 20px;
                        width:85px;
                        border-right: 1px solid #ccc;
                        border-bottom: 1px solid #ccc;
                        // margin: 0 1px 0px;
                        cursor: pointer;
                        background-color: #fff;
                    }
                    // .list:nth-of-type(12n){
                    //     margin-right:10px;
                    // }
                    .list.selected{
                        background-color:#0099ff;
                        // border-color:#0099ff
                    }
                }

            }
        }
        // .footerBtn{
        //     display: flex;
        //     justify-content: center;
        //     padding-top: 20px;
        //     .saves{
        //         width: 160px;
        //         height: 35px;
        //         border: none;
        //         border-radius: 10px;
        //         background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
        //     }
        // }
        .timeZone{
            padding-left: 80px;
            margin-top: 8px;
            span{
                display: block;
                margin-right: 40px;
                font-size: 14px;
            }
        }
        
    }
    

</style>
<style >
    .select-box-dashed{
            position: absolute;
            display: none;
            width: 0px;
            height: 0px;
            padding: 0px;
            margin: 0px;
            border: 1px dashed #0099ff;
            background-color: #c3d5ed;
            opacity: 0.5;
            filter: alpha(opacity=50);
            font-size: 0px;
            z-index: 99999;
        }
</style>