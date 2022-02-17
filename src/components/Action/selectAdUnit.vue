<template>
  <div class="adUnit">
    <div class="adLeft">
      <a-input-search
        v-model:value="searchValue"
        :placeholder="$t('newCampaign.searchKeyWord')"
        style="width: 100%"
        @search="onSearch"
      />
      <!-- <a-radio-group name="radioGroup" v-model:value="isContain" style="margin-top:5px;">
        <a-radio :value='true'>{{$t('newCampaign.contains')}}</a-radio>
        <a-radio :value='false'>{{$t('newCampaign.exclusion')}}</a-radio>
      </a-radio-group> -->
      <a-button type="link" style="margin-top:5px;" @click="onReSelection">{{$t('newCampaign.reSelection')}}</a-button>
      <div class="trees">
        <a-tree
          checkable
          :autoExpandParent="false"
          :tree-data="data"
          v-model:expandedKeys="expandedKeys"
          v-model:selectedKeys="selectedKeys"
          v-model:checkedKeys="checkedKeys"
          :replace-fields="replaceFields"
          @check="checkChange"
          :selectable='false'
          ref="tree">
          <template  #title="item">
            <a-tooltip :mouseLeaveDelay="0">
              <template #title>{{item.app_name}}</template>
              <span v-html="item.label"></span>
            </a-tooltip>
          </template>
          <template  #childrenTitle="item">
            <a-tooltip :mouseLeaveDelay="0">
              <template #title>{{item.placement_Name}}</template>
              <span v-html="item.label"></span>
            </a-tooltip>
          </template>
        </a-tree>
        <a-empty v-if="data.length==0" :image="simpleImage">
          <template #description>
            <span>{{$t('Message.NoAppStoreAppData')}}</span>
          </template>
        </a-empty>
      </div>
      <!-- <a-pagination
        :total="total"
        show-quick-jumper
        size="small"
        :show-total="total => `${$t('myApp.total')} ${total} ${$t('myApp.article')}`"
        :page-size="pageSize"
        :page-size-options="pageSizeOptions"
        v-model:current="currentPage"
        @change="PageCurrent"
        @showSizeChange="handleSizeChange"
      ></a-pagination> -->
      <a-pagination
        :total="total"
        @change="PageCurrent"
        size="small"
        :show-total="total => `${$t('myApp.total')} ${total} ${$t('myApp.article')}`"
        :page-size="pageSize"
        :page-size-options="pageSizeOptions"
        v-model:current="currentPage"
      ></a-pagination>
    </div>
    <a-divider type="vertical" class="vertical" />
    <div class="adRight">
      <div class="title">
        <p>{{$t('newCampaign.selected')}}{{rgihtchildren.length}}</p>
        <a-button type="link"  @click="delAll">{{$t('newCampaign.clearAll')}}</a-button>
      </div>
      <div class="right">
        <div class="contents" v-for="item in rgihtchildren" :key="item.id">
          <div class="item">
            <p class="placement_name">{{item.placement_Name}}</p>
            <div class="details">
              <p class="videoType">{{item.media_Type=="banner"?$t('newCampaign.banner'):item.media_Type=="other"?$t('newCampaign.vastVideo'):item.media_Type=="interstitial"?$t('newCampaign.insertion'):$t('newCampaign.motivationalVideos')}}</p>
              <a-divider type="vertical" />
              <a-tooltip :mouseLeaveDelay="0">
                <template #title>{{item.name}}</template>
                <p class="p">{{item.name}}</p>
              </a-tooltip>
            </div>
          </div>
          <div class="icon" @click="delSingle(item.id)">
            <CloseCircleOutlined />
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="footer">
      <a-button type="primary" class="create_primary" @click="editLanguages">{{$t('newCampaign.save')}}</a-button>
    </div> -->
  </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>
import store from "@/store";
import { useI18n } from 'vue-i18n';
import { message} from 'ant-design-vue';
import { CloseCircleFilled, CloseCircleOutlined } from "@ant-design/icons-vue";
export default {
  props: ["searchappID", "platform", "adunit", "showAdUnit"],
  name: "selectAdUnit",
  components: {
    CloseCircleFilled,
    CloseCircleOutlined
  },
  data() {
    return {
      searchValue: "",
      total: 0,
      data: [],
      pageSize: 10,
      currentPage: 1,
      pageSizeOptions: ['10', '20' , '50'],
      replaceFields: {
        children: "children",
        title: "label",
        key: "id"
      },
      expandedKeys: [],
      selectedKeys: [],
      checkedKeys: [],
      childrens: [],
      rgihtchildren: [],
    };
  },
  watch: {
    adunit(val) {
      this.checkedKeys = [];
      this.rgihtchildren = JSON.parse(JSON.stringify(val));
      this.rgihtchildren.forEach(v => {
        this.checkedKeys.push(v.id);
      });
      console.log(this.checkedKeys);
    },
    searchappID(val) {
      let opt = {
        num_elements: this.pageSize,
        page: this.currentPage,
        platform: this.platform,
        app_id: this.searchappID.toString()
      };
      this.fetchData(opt);
    },
    showAdUnit(val) {
      if (!val) {
        this.$emit("unitClosure", this.rgihtchildren);
      }
    }
  },
  methods: {
    onSearch(e) {
      console.log(e);
      /* if(this.searchappID.toString()==-1){
        this.getAppList();
      } */
      let opt = {
        num_elements: this.pageSize,
        page: this.currentPage,
        platform: this.platform,
        app_id: this.searchappID.toString(),
        app_name: this.searchValue
      };
      this.fetchData(opt,"search");
    },
    PageCurrent(page){
      this.currentPage=page;
      let opt = {
        num_elements: this.pageSize,
        page: this.currentPage,
        platform: this.platform,
        app_id: this.searchappID.toString(),
        app_name: this.searchValue
      };
      this.fetchData(opt);
    },
    //广告单元获取数据
    fetchData(opt,b) {
      store.dispatch("Util/Loading", true);
      this.$req.CampaignBindPlacement(opt).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data;
          this.total = data.total; //总条数
          this.data = data.placement_list;
          this.data.map(val => {
            val.label = val.app_official_name;
            val.appPlacements.map(item => {
              item.label = item.placement_Name;
              item.id = item.placement_ID;
              item.name = val.app_official_name;
            });
            val.children = val.appPlacements;
          });
          this.childrens = [];
          this.data.map(v => {
            this.childrens.push(...v.children);
          });

          console.log(this.searchValue);
          console.log(this.data);
          console.log(this.expandedKeys);

          this.expandedKeys=[];

          this.data.forEach(item => {
            item['slots']={
              title:'title'
            }
            if(this.searchValue.trim()!=''){
              let flag=false;
              item.label=item.label.replaceAll(this.searchValue,'<span style="color:#f00;">'+this.searchValue+'</span>');
              item.children.forEach(element => {
                if(element.label.indexOf(this.searchValue)!=-1){
                  element['slots']={
                    title:'childrenTitle'
                  }
                  element.label=element.label.replaceAll(this.searchValue,'<span style="color:#f00;">'+this.searchValue+'</span>');
                  flag=true;
                }
              });
              if(flag){
                this.expandedKeys.push(item.id);
              }
            }
            else if(this.searchValue.trim()==''&&b){
              if (this.adunit.length) {
                this.checkedKeys = [];
                // this.adunit.forEach(v => {
                //   this.rgihtchildren.push(v);
                // });
                this.rgihtchildren.forEach(v => {
                  this.checkedKeys.push(v.id);
                });
                console.log(this.checkedKeys);
              }
            }
          });

          store.dispatch("Util/Loading", false);
          console.log(this.data, this.childrens,this.expandedKeys,this.selectedKeys,this.adunit,this.checkedKeys);
        } else if (res.data.code !== 200) {
          store.dispatch("Util/Loading", false);
          message.error(this.$t('newCampaign.unknownError'));
        }
      });
    },
    delSingle(id) {
      this.rgihtchildren = this.rgihtchildren.filter(v => {
        return v.id != id;
      });
      this.checkedKeys = [];
      this.rgihtchildren.forEach(v => {
        this.checkedKeys.push(v.id);
      });
    },
    checkChange(e, b) {
      console.log(e, b);
      if (b.checked) {
        let arrs = b.node.pos.split("-");
        console.log(arrs.length, "1");

        if (b.halfCheckedKeys.length != 0) {
          console.log(this.adunit,b.node.eventKey,b,arrs.length,"全选");
          if (arrs.length == 2) {
            console.log(2);
            this.childrens.forEach(v => {
              b.node.children.forEach(i => {
                if (v.id == i.key) {
                  this.rgihtchildren.push(v);
                }
              });
            });
            console.log(this.rgihtchildren);
            let obj = {};
            this.rgihtchildren = this.rgihtchildren.reduce((item, next) => {
              obj[next.id] ? "" : (obj[next.id] = true && item.push(next));
              return item;
            }, []);
          }else{
            this.childrens.forEach(v => {
              if (v.id == b.node.eventKey) {
                this.rgihtchildren.push(v);
              }
            });
            console.log(1, this.adunit);
          }
          
        } else {
          if (arrs.length == 2) {
            console.log(2);
            this.childrens.forEach(v => {
              b.node.children.forEach(i => {
                console.log(v.id,i.key);
                
                if (v.id == i.key) {
                  this.rgihtchildren.push(v);
                }
              });
            });
            console.log(this.rgihtchildren);
            let obj = {};
            this.rgihtchildren = this.rgihtchildren.reduce((item, next) => {
              obj[next.id] ? "" : (obj[next.id] = true && item.push(next));
              return item;
            }, []);
          } else {
            console.log(3);
            this.childrens.forEach(v => {
              if (v.id == b.node.eventKey) {
                this.rgihtchildren.push(v);
              }
            });
          }
        }
      } else {
        let arrs = b.node.pos.split("-");
        if (b.halfCheckedKeys.length != 0) {
          if (arrs.length == 2) {
            
            let arr = [];
            arr = this.rgihtchildren.filter(
              item => !b.node.children.some(ele => ele.key == item.id)
            );
            this.rgihtchildren = arr;
          }else {
              this.rgihtchildren = this.rgihtchildren.filter(v => {
              return v.id != b.node.eventKey;
            });
            
          }
          
        } else {
          
          if (arrs.length == 2) {
            
            let arr = [];
            arr = this.rgihtchildren.filter(
              item => !b.node.children.some(ele => ele.key == item.id)
            );
            this.rgihtchildren = arr;
          } else {
            
            
            this.rgihtchildren = this.rgihtchildren.filter(v => {
              return v.id != b.node.eventKey;
            });
          }
        }
      }
      console.log(this.adunit);
    },
    delAll() {
      this.checkedKeys = [];
      this.rgihtchildren = [];
      console.log(this.checkedKeys);
    },
    onReSelection(){
      //console.log(this.checkedKeys);
      //console.log(this.selectedKeys);
      //console.log(this.rgihtchildren);

      let data=this.rgihtchildren;
      this.checkedKeys=[];
      this.rgihtchildren=[];
      let tag=true;
      this.data.forEach(element => {
        element.children.forEach(item => {
          tag=true;
          for(let i=0;i<data.length;i++){
            if(item.id==data[i].id){
              tag=false;
              break;
            }
          }
          if(tag){
            this.checkedKeys.push(item.id);
            this.rgihtchildren.push(item);
          }
        })
      });
      //console.log(data);
      //console.log(this.checkedKeys);
      //console.log(this.rgihtchildren);
    },
    editLanguages() {
      this.$emit("editLanguages", this.rgihtchildren);
    },
    getAppList(app_ids){
      let opt = {
        num_elements: this.pageSize,
        page: this.currentPage,
        app_ids:app_ids,
        platform:null
      };
      this.$req.getAppInfo(opt).then(res => {
        if (res.data.code == 200) {
          console.log(res);
          let data = res.data.data;
          this.total = data.total; //总条数
          this.data = data.app_list;
          this.data.map(val => {
            val.label = val.app_official_name;
            val.appPlacements.map(item => {
              item.label = item.placement_Name;
              item.id = item.placement_ID;
              item.name = val.app_official_name;
            });
            val.children = val.appPlacements;
          });
          this.childrens = [];
          this.data.map(v => {
            this.childrens.push(...v.children);
          });

          console.log(this.searchValue);
          console.log(this.data);
          console.log(this.expandedKeys);

          this.expandedKeys=[];

          this.data.forEach(item => {
            item['slots']={
              title:'title'
            }
            if(this.searchValue!=''){
              let flag=false;
              item.label=item.label.replaceAll(this.searchValue,'<span style="color:#f00;">'+this.searchValue+'</span>');
              item.children.forEach(element => {
                if(element.label.indexOf(this.searchValue)!=-1){
                  element['slots']={
                    title:'childrenTitle'
                  }
                  element.label=element.label.replaceAll(this.searchValue,'<span style="color:#f00;">'+this.searchValue+'</span>');
                  flag=true;
                }
              });
              if(flag){
                this.expandedKeys.push(item.id);
              }
            }
          });
          store.dispatch("Util/Loading", false);
          console.log(this.data, this.childrens);
        }else if (res.data.code !== 200) {
          store.dispatch("Util/Loading", false);
          message.error(this.$t('newCampaign.unknownError'));
        }
      })
    }
  },
  mounted() {
    const { t } = useI18n();
    
    console.log(this.searchappID.toString());
    console.log(this.platform, this.searchappID);

    /* if(this.searchappID.toString()==-1){
      this.getAppList(null);
    } */
    
    let opt = {
      num_elements: this.pageSize,
      page: this.currentPage,
      platform: this.platform,
      app_id: this.searchappID.toString()
    };
    this.fetchData(opt);

    if (this.adunit.length) {
      this.checkedKeys = [];
      this.adunit.forEach(v => {
        this.rgihtchildren.push(v);
      });
      this.rgihtchildren.forEach(v => {
        this.checkedKeys.push(v.id);
      });
      console.log(this.checkedKeys);
    }
  }
};
</script>

<style lang="less" scoped>
p {
  margin-bottom: 0;
}
.adUnit {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .vertical {
    height: 460px;
  }
  .adLeft {
    width: 48%;
    height: 460px;
    .trees {
      min-height: 260px;
      height: 360px;
      overflow: auto;
      margin-top: 5px;
      /deep/.ant-tree-switcher {
        .anticon-caret-down {
          font-size: 14px;
        }
      }
      /deep/.ant-tree-node-content-wrapper{
        width: 85%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    /* /deep/.ant-pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
      .ant-pagination-prev,
      .ant-pagination-next {
        width: 22px;
        height: 22px;
        line-height: 22px;
        margin-left: 5px;
        .ant-pagination-item-link {
          border-radius: 5px;
          background-color: #eaf5ff;
          border: none;
          .anticon-left,
          .anticon-right {
            color: #6577c8;
          }
        }
      }
      .ant-pagination-options-size-changer {
        margin-top: 0;
        .ant-select-selector {
          height: 22px !important;
          background-color: #fff;
        }
      }
      .ant-pagination-options-quick-jumper {
        height: 22px !important;
        line-height: 22px !important;
        input {
          border-radius: 5px;
          height: 22px !important;
          &:hover {
            border-color: #6577c8;
          }
          &:focus {
            border-color: #6577c8;
          }
        }
      }
      .ant-pagination-item {
        width: 22px !important;
        height: 22px !important;
        line-height: 2px;
        border-radius: 5px;
      }
      .ant-pagination-item-link {
        width: 22px !important;
        height: 22px !important;
        line-height: 22px !important;
      }
      .ant-pagination-item-active {
        width: 22px !important;
        height: 22px !important;
        line-height: 22px !important;
        border-radius: 5px;
        background-color: #6577c8;
        border: none;
        a {
          color: #fff;
        }
      }
    } */
  }
  .adRight {
    width: 48%;
    height: 460px;
    overflow: auto;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
    }
    .right {
      max-height: 300px;
      height: 400px;
      .contents {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .item {
          width: 220px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-bottom: 5px;
          overflow: hidden;
          .placement_name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .details {
            display: flex;
            align-items: center;
            .videoType {
              white-space: nowrap;
            }
            .p {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
        .icon {
          width: 40px;
          font-size: 18px;
          line-height: 40px;
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