<template>
  <div class="advanceSettings">
    <div class="title">
      <h1>{{$t('demographics.gender')}}</h1>
      <a-radio-group class="radioAge" v-model:value="gender" @change="genderModification">
        <a-radio value="null">{{$t('demographics.all')}}</a-radio>
        <a-radio value="male">{{$t('demographics.male')}}</a-radio>
        <a-radio value="female">{{$t('demographics.female')}}</a-radio>
      </a-radio-group>
      <a-checkbox v-model:checked="gender_targets.allow_unknown">{{$t('demographics.allowUnknown')}}</a-checkbox>
      <a-popover title placement="right">
        <template #content>
          <p>{{$t('demographics.allowUnknownNote')}}</p>
        </template>
        <QuestionCircleFilled class="iconNote" />
        <!-- <span class="doubt"></span> -->
      </a-popover>
    </div>
    <div class="contentAge">
      <h1>{{$t('demographics.age')}}</h1>
      <a-radio-group class="radioAge" v-model:value="age" @change="ageEnit">
        <a-radio value="1">{{$t('demographics.all')}}</a-radio>
        <a-radio value="2">{{$t('demographics.Customization')}}</a-radio>
      </a-radio-group>
      <a-checkbox v-model:checked="age_targets.allow_unknown">{{$t('demographics.allowUnknown')}}</a-checkbox>
      <a-popover title placement="right">
        <template #content>
          <p>{{$t('demographics.allowUnknownNote')}}</p>
        </template>
        <QuestionCircleFilled class="iconNote" />
        <!-- <span class="doubt"></span> -->
      </a-popover>
    </div>
    <div class="customization" v-if="age=='2'">
      <a-checkbox-group v-model:value="customization" @change="ageModification">
        <a-checkbox v-for="(item,index) in list" :value="item" :key="index">{{item}}</a-checkbox>
      </a-checkbox-group>
    </div>
    <!-- <div class="footer">
      <a-button type="primary" class="create_primary" @click="editFeatures">{{$t('demographics.save')}}</a-button>
    </div> -->
  </div>
</template>

<script>
import {
  QuestionCircleFilled
} from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import { useI18n } from 'vue-i18n';
export default {
  name: "advanceSettings",
  components:{
    QuestionCircleFilled
  },
  props: ["gender_targets_M", "age_targets_M", "selectAge", "campaignInfo"],
  data() {
    return {
      gender: "null",
      age: "1",
      ageData: [],
      customization: [],
      age_targets: { ages: null, allow_unknown: false },
      gender_targets: { gender: null, allow_unknown: false },
      list: ["<18", "18-24", "25-34", "35-44", "45-54", "55-64", "≥65"]
    };
  },
  methods: {
    editFeatures() {
      console.log(this.age_targets.ages);

      if (this.age == 1) {
        this.age_targets.ages = [];
        this.ageData = ["全部"];
        this.customization = [];
      }
      if (this.age_targets.ages.length == 0) {
        this.age_targets.ages == [];
        this.age == "1";
        this.ageData = ["全部"];
        console.log(this.age);
      }
      if (this.customization.length) {
        this.ageModification(this.customization);
      }
      this.$emit(
        "changeFeatures",
        this.age_targets,
        this.gender_targets,
        this.ageData
      );
    },
    genderModification(e) {
      this.gender_targets.gender = e.target.value;
    },
    ageEnit(e) {
      if (e == 1) {
        this.age_targets.ages = null;
      } else {
        this.age_targets.ages = [];
      }
    },
    ageModification(e) {
      this.ageData = [];
      this.age_targets.ages = [];
      if (e.length > 0) {
        for (var i = 0; i < e.length; i++) {
          this.switch__core(e[i]);
        }
      }
    },
    //公共年龄判断的方法
    switch__core(dt) {
      switch (dt) {
        case "<18":
        case "18":
          this.ageData.push("<18");
          this.age_targets.ages.push({
            low: 13,
            high: 18
          });
          break;
        case "18-24":
        case "24":
          this.ageData.push("18-24");
          this.age_targets.ages.push({
            low: 18,
            high: 24
          });
          break;
        case "25-34":
        case "34":
          this.ageData.push("25-34");
          this.age_targets.ages.push({
            low: 25,
            high: 34
          });
          break;
        case "35-44":
        case "44":
          this.ageData.push("35-44");
          this.age_targets.ages.push({
            low: 35,
            high: 44
          });
          break;
        case "45-54":
        case "54":
          this.ageData.push("45-54");
          this.age_targets.ages.push({
            low: 45,
            high: 54
          });
          break;
        case "55-64":
        case "64":
          this.ageData.push("55-64");
          this.age_targets.ages.push({
            low: 55,
            high: 64
          });
          break;
        case "≥65":
        case "100":
          this.ageData.push("≥65");
          this.age_targets.ages.push({
            low: 65,
            high: 100
          });
          break;
      }
    }
  },
  mounted() {
    const { t } = useI18n();
    console.log(this.selectAge);
    // if (this.campaignInfo) {
    this.gender_targets =JSON.parse(JSON.stringify(this.gender_targets_M));
    this.gender = this.gender_targets_M.gender
      ? this.gender_targets_M.gender
      : "null";
    console.log(this.gender_targets_M.gender);

    this.gender_targets.allow_unknown = this.gender_targets_M.allow_unknown;
    this.age_targets = JSON.parse(JSON.stringify(this.age_targets_M));
    if (this.selectAge[0] != "全部" && this.selectAge.length != 0) {
      this.age = "2";
      this.customization = this.selectAge;
    }
    this.age_targets.allow_unknown = this.age_targets_M.allow_unknown;
    console.log(111);
  }
  //   }
};
</script>

<style lang="less" >
.advanceSettings {
  .title {
    h1 {
      font-size: 18px;
      font-weight: 400;
    }
  }
  .contentAge {
    h1 {
      font-size: 18px;
      font-weight: 400;
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }
  .customization {
    margin-top: 10px;
    margin-left: 70px;
  }
  // .footer {
  //   display: flex;
  //   width: 100%;
  //   margin-top: 30px;
  //   justify-content: center;
  //   .create_primary {
  //     width: 200px;
  //     height: 35px;
  //     background-image: linear-gradient(90deg, #6577c8 0%, #79b8f1 100%);
  //     border: none;
  //     border-radius: 0.1rem;
  //   }
  // }
 
  .radioAge{
    display: inline-block!important;
  }
  .doubt {
    display: inline-block;
    width: 14px;
    height: 14px;
    line-height: 20px;
    vertical-align: middle;
    // background: url("//console-style.hl.com/images/dspcom/normal_u109.svg")
    //   no-repeat;
    // background-size: 14px 14px;
  }
  // .doubt:hover {
  //   background: url("//console-style.hl.com/images/dspcom/normal_u110.svg")
  //     no-repeat;
  //   background-size: 14px 14px;
  // }
}
</style>