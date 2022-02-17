<template>
    <div class="notFound404">
        <a-space :size="16">
            <a-button type="primary" size="large" @click="goLogin">
                <ArrowLeftOutlined />BACK TO LOGIN
            </a-button>
            <a-button type="primary" size="large" @click="goHome">
                BACK TO HOME<ArrowRightOutlined />
            </a-button>
        </a-space>
    </div>
</template>

<script>
    import { defineComponent, ref , onMounted } from 'vue';
    import {
        ArrowLeftOutlined,
        ArrowRightOutlined
    } from "@ant-design/icons-vue";

    export default defineComponent({
        components: {
            ArrowLeftOutlined,ArrowRightOutlined
        },

        setup() {

            const goLogin = ()=>{
                window.location.href = '/getlogin/login';
            };

            const goHome = ()=>{
                window.location.href = '/hl/index';
            };

            return {
               goLogin,goHome
            };
        }
    });

</script>

<style lang="less" scoped>

.notFound404{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #172333;
    background-image: url(//console-style.hl.com/images/dspcom/404NotFound.jpg);
    background-position: center;
    background-repeat: no-repeat;

    .ant-btn-primary{
        height: 45px;
        width: 180px;
        font-size: 16px;
        margin-bottom: 200px;
    }

}

</style>