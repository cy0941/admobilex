<template>
  <div id="user">
    <h1 class="UserTitle">{{$t('personalCenter.accountInformation')}}</h1>
    <a-form  :model="formStateEmail" :rules="rules"   ref="EmailForm" >
      <a-form-item :label="$t('personalCenter.userName')"  :colon="false" :labelCol="labelCol">
        <a-input v-model:value="formStateEmail.username"  style="width:3.6rem" disabled/>
      </a-form-item>
      <a-form-item :label="$t('personalCenter.accountEmail')"  :colon="false" :labelCol="labelCol" name="email">
        <a-input v-model:value="formStateEmail.email" style="width:3.6rem"/>
        <a-button type="primary" class="edit_primary" @click.prevent="Edit(1)">{{$t('personalCenter.changeEmail')}}</a-button>
      </a-form-item>
      <a-form-item :label="$t('personalCenter.accountTimezone')"  :colon="false" :labelCol="labelCol">
        <a-input v-model:value="formStateEmail.timezone"  style="width:3.6rem" disabled/>
      </a-form-item>
    </a-form>
    <a-divider style="height: 1px; background-color: #f2f2f2" />
    <h1 class="UserTitle">{{$t('personalCenter.changePassword')}}</h1>
    <a-form  :model="formStatePasswrod" :rules="rules"  ref="PassForm" >
      <a-form-item :label="$t('personalCenter.currentPassword')"  :colon="false" :labelCol="labelCol" name="oldPass">
        <a-input-password v-model:value="formStatePasswrod.oldPass"  style="width:3.6rem"/>
      </a-form-item>
      <a-form-item :label="$t('personalCenter.newPassword')"  :colon="false" :labelCol="labelCol" name="pass">
        <a-input-password v-model:value="formStatePasswrod.pass" style="width:3.6rem"/>
        <a-button type="primary" class="edit_primary" @click.prevent="Edit(2)">{{$t('personalCenter.changePassword')}}</a-button>
      </a-form-item>
      <a-form-item :label="$t('personalCenter.confirmPassword')"  :colon="false" :labelCol="labelCol" name="checkPass">
        <a-input-password v-model:value="formStatePasswrod.checkPass"  style="width:3.6rem"/>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import store from '@/store';
import { useI18n } from 'vue-i18n';
import { message} from 'ant-design-vue';
import { defineComponent, reactive } from 'vue';
export default defineComponent({
  name:"PersonalCenter",
  setup(){
    const { t } = useI18n();
    let validatePass = async (rule, value) => {
      if (value === '') {
        return Promise.reject(t('personalCenter.currentMessage'))
      }else{
        return Promise.resolve();
      }
    };
    let validatePass1 = async (rule, value) => {
      if (value.trim() === '') {
        return Promise.reject(t('personalCenter.newMessage'))
      }
      else if (value === formStatePasswrod.oldPass ){
        return Promise.reject(t('personalCenter.consistent'))
      }else {
        return Promise.resolve();
      }
    };
    let validatePass2 = async (rule, value) => {
      if (value.trim() === '') {
        return Promise.reject(t('personalCenter.enterMessage'))
      } else if (value !== formStatePasswrod.pass) {
        return Promise.reject(t('personalCenter.noConsistent'))
      } else {
        return Promise.resolve();
      }
    };
    let checkEmail = async (rule, value) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (!value) {
        return Promise.reject(t('personalCenter.emailNull'))
      }
      if (!mailReg.test(value)) {
        return Promise.reject(t('personalCenter.emailMessageFormat'))
      } else if(value == UserInfo.email){
        await Promise.reject(t('personalCenter.emailMessage'))
      } else {
        return Promise.resolve();
      }
    }
    const UserInfo = store.state["User"].userInfo
    const rules = {
      oldPass: [{ validator: validatePass, trigger: 'blur' }],
      pass: [{ validator: validatePass1, trigger: 'blur' }],
      checkPass: [{ validator: validatePass2, trigger: 'blur' }],
      email:[{ validator: checkEmail,  }]
    }
    const formStateEmail = reactive({
      username:UserInfo.username,
      email:UserInfo.email,
      timezone:UserInfo.timezone
    })
    const formStatePasswrod = reactive({
      oldPass:"",
      pass:"",
      checkPass:""
    })
    return {
      formStateEmail,
      formStatePasswrod,
      rules,
      UserInfo,
    }
  },
  data(){
    return{
      labelCol:{
        span: 2, offset: 0
      }
    }
  },
  mounted(){
    store.dispatch("Util/OpenMenuKey",['/hl/personalCenter']);
    store.dispatch("Util/OpenKeys",['/hl/personalCenter']);
  },
  methods:{
    Edit(val){
      switch(val){
        case  1:
          this.$refs.EmailForm.validate().then(_=>{
            let opt = {
              user:{
                email:this.formStateEmail.email,
                state:this.UserInfo.state
              },
              id:this.UserInfo.id
            }
            store.dispatch("Util/Loading",true)
            this.$req.UpdateUser(opt).then(res=>{
              if(res.data.code == 200){
                message.success(this.$t('personalCenter.editSuccessful'));
                this.$req.getUserInfo().then(res=>{
                    if(res.data.code==200){
                      this.formStateEmail.email=res.data.data.email;
                    }
                    store.dispatch("Util/Loading",false)
                })
                
                
              }else{
                message.error(this.$t('personalCenter.editFailed'))
                store.dispatch("Util/Loading",false)
              }
            }).catch(err=>{
              console.log(err);
              message.error(this.$t('personalCenter.unknownError'))
              store.dispatch("Util/Loading",false)
            })
          });
        break
        case  2:
          this.$refs.PassForm.validate().then(_=>{
            let opt = {
              user:{
                current_password:this.formStatePasswrod.oldPass,
                new_password_1:this.formStatePasswrod.pass,
                new_password_2:this.formStatePasswrod.checkPass,
                state:this.UserInfo.state
              },
              id:this.UserInfo.id
            }
            store.dispatch("Util/Loading",true)
            this.$req.UpdateUser(opt).then(res=>{
              if(res.data.code == 200){
                message.success(this.$t('personalCenter.editSuccessful'))
                // this.$router.go(0)
                store.dispatch('User/reqUserInfo');
                store.dispatch("Util/Loading",false)
              }else{
                message.error(this.$t('personalCenter.editFailed'))
                store.dispatch("Util/Loading",false)
              }
            }).catch(err=>{
              message.error(this.$t('personalCenter.unknownError'))
              store.dispatch("Util/Loading",false)
            })
          });
        break;
      }
    }
  }
})
</script>

<style lang="less" scoped>
#user{
  background:#fff;
  padding: 20px;
  border-radius:10px;

  /deep/.ant-form {
    margin-top:16px;
    margin-left: 16px;
  }

  /deep/.edit_primary{
    margin-left:24px;
  }
}
</style>