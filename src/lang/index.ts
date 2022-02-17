import { createI18n } from 'vue-i18n/dist/vue-i18n.cjs.js'


const i18n = createI18n({
    // 定义的语言 
    locale: 'zh',
    // 引入各种不同的配置，可直接写在这里
    messages: {
        zh:require('./zh'),	//引入语言文件
        en:require('./en')
    }
});


export default i18n;