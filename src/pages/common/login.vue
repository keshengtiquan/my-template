<script setup lang="ts">
import {  LockOutlined,  UserOutlined } from '@ant-design/icons-vue'
import {useAppStore} from "@/store";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import {reactive, shallowRef} from "vue";
import {loginApi} from "@/api/user";

const appStore = useAppStore()
const { layoutSetting } = storeToRefs(appStore)
const router = useRouter()
const loginModel = reactive({
  userName: 'lijianbo',
  password: '123456',
})
const formRef = shallowRef()
const submitLoading = shallowRef(false)

const submit = async () => {
  submitLoading.value = true
  try {
    await formRef.value?.validate()
    const {data} = await loginApi(loginModel)
    if(data.token){
      localStorage.setItem('token', data.token)
      await router.push('/')
    }
  }
  catch (e) {
    console.warn(e)
    submitLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <div class="ant-pro-form-login-cotainer">
        <div class="ant-pro-form-login-top">
          <div class="ant-pro-form-login-header">
            <span class="ant-pro-form-login-logo">
              <img src="/logo.svg">
            </span>
            <span class="ant-pro-form-login-title">
              Ant Design
            </span>
          </div>
          <div class="ant-pro-form-login-desc">
            Ant Design 是西湖区最具影响力的 Web 设计规范
          </div>
        </div>
        <div class="ant-pro-form-login-main" w-335px>
          <a-form ref="formRef" :model="loginModel">
              <a-form-item name="userName" :rules="[{ required: true, message: '用户名不能为空' }]">
                <a-input v-model:value="loginModel.userName" allow-clear placeholder="用户名：admin or user" size="large" @pressEnter="submit">
                  <template #prefix>
                    <UserOutlined />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item name="password" :rules="[{ required: true, message: '密码不能为空' }]">
                <a-input-password v-model:value="loginModel.password" allow-clear placeholder="密码：admin" size="large" @pressEnter="submit">
                  <template #prefix>
                    <LockOutlined />
                  </template>
                </a-input-password>
              </a-form-item>
            <a-button type="primary" block :loading="submitLoading" size="large" @click="submit">
              登录
            </a-button>
          </a-form>
        </div>
      </div>
    </div>
    <div py-24px px-50px :data-theme="layoutSetting.theme" text-14px>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container{
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: var(--bg-color-container);
}

.login-lang {
  width: 100%;
  height: 40px;
  line-height: 44px;
}

.login-content{
  flex: 1 1;
  padding: 32px 0
}
.ant-pro-form-login-cotainer{
  display: flex;
  flex: 1 1;
  flex-direction: column;
  height: 100%;
  padding: 32px 0;
  overflow: auto;
  background: inherit
}

.ant-pro-form-login-top {
  text-align: center
}

.ant-pro-form-login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  line-height: 44px
}

.ant-pro-form-login-header a {
  text-decoration: none
}

.ant-pro-form-login-title {
  position: relative;
  top: 2px;
  color: var(--text-color);
  font-weight: 600;
  font-size: 33px
}

.ant-pro-form-login-logo {
  width: 44px;
  height: 44px;
  margin-right: 16px;
  vertical-align: top
}

.ant-pro-form-login-logo img {
  width: 100%
}

.ant-pro-form-login-desc {
  margin-top: 12px;
  margin-bottom: 40px;
  color: var(--text-color-1);
  font-size: 14px
}

.ant-pro-form-login-main {
  min-width: 328px;
  max-width: 500px;
  margin: 0 auto
}

.ant-pro-form-login-main {
  .ant-tabs-nav-list {
    margin: 0 auto;
    font-size: 16px;
  }
  .ant-pro-form-login-other {
    margin-top: 24px;
    line-height: 22px;
    text-align: left
  }

  .icon{
    margin-left: 8px;
    color: var(--text-color-2);
    font-size: 24px;
    vertical-align: middle;
    cursor: pointer;
    transition: color .3s;


  }
}

@media(min-width: 768px){
  .login-container{
    background-image:url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;
  }

  .login-content{
    padding: 32px 0 24px;
  }

  .ant-pro-form-login-cotainer{
    padding:32px 0 24px;
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%
  }
}
</style>

