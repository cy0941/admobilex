window.VideoPreview = {
    baseUrl: '//creative-preview.hl.com/?id=',
    debug: true
}
window.BannerPreview = {
    baseUrl: '/creative-preview/get-preview?id=',
    debug: true
}
window.IMG = {
    baseUrl: '//console-style.hl.com/images/dspcom/Logo.png',
    debug: true
}
window.BASE_URL = {
    baseUrl:"//console-style.hl.com/images/dspcom/",
    debug:true
}
window.OnlineBnnerPreview = {
    baseUrl: '/ex/api/ex/creativeOnlinePreview?',
    debug: true
}
const VIDEOBASE_URL = window.VideoPreview.baseUrl;
const BANNERBASE_URL = window.BannerPreview.baseUrl;
const IMG_URL=window.IMG.baseUrl;
const OnlineBnner_URL = window.OnlineBnnerPreview.baseUrl;
const BASE_URL = window.BASE_URL.baseUrl;

export default {
    VIDEOBASE_URL,
    BANNERBASE_URL,
    IMG_URL,
    OnlineBnner_URL,
    BASE_URL
}