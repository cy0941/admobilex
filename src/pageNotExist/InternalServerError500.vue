<template>
    <div class="notFound404">
        <img src="//console-style.hl.com/images/dspcom/InternalServerError500.jpg">
        <a>BACK TO LOGIN</a>
    </div>
</template>

<script>
    import { defineComponent, ref , onMounted } from 'vue';

    export default defineComponent({

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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #fff;

    a{
        font-size: 36px;
        color: #fff;
        font-weight: 600;
        margin-top: 50px;
        padding: 10px 20px;
        background-color: #ffb901;
        border-radius: 8px;
    }

}

</style>