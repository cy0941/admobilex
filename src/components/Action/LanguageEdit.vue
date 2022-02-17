<template>
  <div class="Language clearfix">
    <div class="molde_left">
      <div class="leftSearch">
        <a-input class="search" :placeholder="$t('newCampaign.searchKeyWord')"  v-model:value="searchValue" @pressEnter="searchLangeuage"></a-input>
        <!-- <a-radio-group name="radioGroup" v-model:value="isContain" style="margin-bottom:5px;">
          <a-radio :value='true'>{{$t('newCampaign.contains')}}</a-radio>
          <a-radio :value='false'>{{$t('newCampaign.exclusion')}}</a-radio>
        </a-radio-group> -->
        <a-button type="link" @click="onReSelection" class="shisu_text_btn">{{$t('newCampaign.reSelection')}}</a-button>
      </div>
      <a-checkbox-group v-model:value="value1" @change="languageChange">
        <a-checkbox v-for="item in data" :key="item.id" :value="item.key" v-show="item.show">{{item.label}}</a-checkbox>
      </a-checkbox-group>
    </div>
    <div class="molde_right">
      <div class="molde_right_top">
        <span>{{$t('newCampaign.selected')}} {{value1.length}}</span>
        <a-button type="link" class="shisu_text_btn right_btn"   @click="resetChecked">{{$t('newCampaign.clearAll')}}</a-button>
      </div>
      <div class="molde_right_footer">
        <div class="molde_right_1" v-for="(item,i) in newData" :key="i">
          <div class="molde_right_p">
            <p
              class="characters"
              style=" overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-warp:none"
              :title="item"
            >{{item.label}}</p>
          </div>
          <div class="icon" @click="handleDelete(item.key)">
            <CloseCircleOutlined />
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="footer">
      <a-button type="primary" class="create_primary" @click="editLanguage">{{$t('newCampaign.save')}}</a-button>
    </div> -->
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import store from "@/store";
import { useI18n } from 'vue-i18n';
import { CloseCircleFilled, CloseCircleOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "language",
  props: ["language_targets"],
  components: {
    CloseCircleFilled,
    CloseCircleOutlined
  },
  data() {
    return {
      data: [],
      language_data: [],
      searchValue: "",
      newData: [],
      value1: [],
      //isContain:true,
      language:"",
      languages:[],
      language_action: "exclude",
    };
  },
  watch: {
    '$store.state.Util.language'(newVal,oldVal){
        console.log(newVal,oldVal);
        this.language=newVal;
        this.getLanguageList();
    }
  },
  methods: {
    search(val) {
      console.log(this.searchValue);
      
      // this.data = this.language_data;
      this.data = this.data.filter(item => {
        return item.label.indexOf(this.searchValue) > -1;
      });
      console.log(this.language_data,this.data);
      
    },
    searchLangeuage(){
        if(this.searchValue.trim()){
          // let arr =this.languages.filter(val=>{
          //   return val.label.indexOf(this.searchValue)!=-1
          // })
          // console.log(arr);
          // this.data=arr;
          this.data.map(val=>{
            if(val.label.indexOf(this.searchValue)==-1){
              val.show=false;
            }else{
              val.show=true;
            }
          })
        }else{
          this.data=[];
          this.getLanguageList();
        }
    },
    languageChange(val) {
      this.newData=[];
      this.data.map(item => {
        if (this.value1.indexOf(item.key) != -1) {
          this.newData.push(item);
        }
      });
      console.log(this.newData);
      // this.$emit("languageChange", this.newData);
    },
    resetChecked() {
      this.value1 = [];
      this.languageChange();
    },
    handleDelete(id) {
      this.value1 = this.value1.filter(item => {
        return item != id;
      });
      this.languageChange();
    },
    editLanguage() {
      console.log(this.newData);
      this.$emit("languageChange", this.newData);
    },
    onReSelection(){
      let data=this.newData;
      this.newData=[];
      this.value1=[];
      this.data.forEach(item => {
          if(data.indexOf(item)==-1){
            this.newData.push(item);
            this.value1.push(item.key);
          }
      });
      console.log(data);
      console.log(this.value1);
      console.log(this.newData);
      //this.newData=data;
    },
    getLanguageList() {
      store.dispatch("Util/Loading", true);
      this.$req
        .Language()
        .then(res => {
          if (res.data.code === 200) {

            res.data.data.map(value => {
              
                this.data.push({
                  key: value.id,
                  label: this.language=="zh"?value.zh_name:value.name,
                  show:true
                });
              
            });
            this.languages=JSON.parse(JSON.stringify(this.data));
            if (this.language_targets.length) {
              this.newData = [];
              this.value1 = [];
              this.newData = this.data.filter(item =>
                this.language_targets.some(ele => ele == item.key)
              );
              this.language_targets.forEach(v => {
                this.value1.push(v.id);
              });

              this.data.map(item => {
                if (this.value1.indexOf(item.key) != -1) {
                  this.newData.push(item);
                }
              });

              console.log(this.language_targets, this.newData, this.data,this.languages);
            }

            store.dispatch("Util/Loading", false);
          } else {
            store.dispatch("Util/Loading", false);
          }
        })
        .catch(err => {
          store.dispatch("Util/Loading", false);
        });
    }
  },
  mounted() {
    this.language=store.state.Util.language;
    const { t } = useI18n();
    this.getLanguageList();
  }
});
</script>
<style lang="less" scoped>
.Language {
  display: flex;
  flex-wrap: wrap;
  .molde_left {
    width: 50%;
    box-sizing: border-box;
    border-right: 0.01rem solid #d7d7d7;
    .leftSearch {
      border-bottom: 0.01rem solid #dcdfe6;
      .search {
        //padding-bottom: 0.1rem;
        // font-size: 0.14rem;
        // border-radius: 10px;
        // height: 35px;
        width: 95%;
        //margin-bottom: 5px;
        
        .ant-input {
          // height: 0.33rem;
          // line-height: 0.4rem;
          // padding: 0 0.15rem;
          width: 320px;
          margin-left: 4%;
          // border-radius: 0.05rem;
        }
      }
    }
    .ant-checkbox-group {
      width: 100%;
      max-height: 350px;
      min-height: 350px;
      overflow-y: scroll;
      padding-top: 8px;
      .ant-checkbox-wrapper {
        margin-left: 0;
        display: block;
        padding: 8px;
        &:hover {
          background: #f4f4f4;
        }
        // .el-checkbox__label{
        // padding-left:0.3rem
        // }
      }
    }
  }
  .molde_right {
    width: 49.87%;
    .molde_right_top {
      height: 40px;
      border-bottom: 1px solid #dcdfe6;
      border-right: none;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      // .right_btn {
      //   float: right;
      // }
    }

    .molde_right_footer {
      padding: 0.19rem 0.19rem 0;
      width: 100%;
      overflow: hidden auto;
      max-height: 360px;
      min-height: 360px;
      box-sizing: border-box;
      .molde_right_1 {
        height: 40px;
        display: flex;
        .molde_right_p {
          width: 260px;
          p {
            font-size: 14px;
            font-weight: normal;
            width: 50%;
          }
        }

        .icon {
          font-size: 14px;
          color: #d9d9d9;
          &:hover {
            color: #8c8c8c;
          }
        }
      }
    }
  }
}

</style>

<style>
  .Language .molde_left .leftSearch .search{
    padding: 2px 5px;
    font-size: 16px;
  }
</style>
