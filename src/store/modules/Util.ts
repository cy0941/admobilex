const state = {
    loading:false,
    showMasking:false,
    openMenuKey:[],
    openKeys:[],
    appInfo:[],
    language:"zh",
    activeKey:'1',
    crossPromotionFormTimeZone:"",
    crossPromotionChartTimeZone:"",
    directCustomerReportTimeZone:"",
    materialReportTimeZone:"",
    userBehaviorReportTimeZone:"",
    userRetentionReportTimeZone:"",
    comprehensiveFormTimeZone:"",
}

const mutations = {
    ChangeLoading(state:any,val:any){
        state.loading = val;
    },
    editSinning(state:any,val:any){
        state.showMasking=val;
    },
    setOpenMenuKey(state:any,val:any){
        state.openMenuKey = val;
    },
    setopenKeys(state:any,val:any){
        state.openKeys = val;
    },
    setAppInfo(state:any,val:any){
        state.appInfo = val;
    },
    setLanguage(state:any,val:any){
        state.language=val;
        console.log(state.language);
    },
    setActiveKey(state:any,val:any){
        state.activeKey=val;
    },
    setCrossPromotionFormTimeZone(state:any,val:any){
        state.crossPromotionFormTimeZone=val;
    },
    setCrossPromotionChartTimeZone(state:any,val:any){
        state.crossPromotionChartTimeZone=val;
    },
    setDirectCustomerReportTimeZone(state:any,val:any){
        state.directCustomerReportTimeZone=val;
    },
    setMaterialReportTimeZone(state:any,val:any){
        state.materialReportTimeZone=val;
    },
    setUserBehaviorReportTimeZone(state:any,val:any){
        state.userBehaviorReportTimeZone=val;
    },
    setUserRetentionReportTimeZone(state:any,val:any){
        state.userRetentionReportTimeZone=val;
    },
    setComprehensiveFormTimeZone(state:any,val:any){
        state.comprehensiveFormTimeZone=val;
    },
}

const actions = {
    Loading(context:any,val:any) {
        context.commit("ChangeLoading",val)
    },
    ShowMasking(context:any,val:any) {
        context.commit("editSinning",val)
    },
    OpenMenuKey(context:any,val:any){
        context.commit("setOpenMenuKey",val)
    },
    OpenKeys(context:any,val:any){
        context.commit("setopenKeys",val);
    },
    AppInfo(context:any,val:any){
        context.commit("setAppInfo",val);
    },
    Language(context:any,val:any){
        context.commit("setLanguage",val);
    },
    ActiveKey(context:any,val:any){
        context.commit("setActiveKey",val);
    },
    SetCrossPromotionFormTimeZone(context:any,val:any){
        context.commit("setCrossPromotionFormTimeZone",val);
    },
    SetCrossPromotionChartTimeZone(context:any,val:any){
        context.commit("setCrossPromotionChartTimeZone",val);
    },
    SetDirectCustomerReportTimeZone(context:any,val:any){
        context.commit("setDirectCustomerReportTimeZone",val);
    },
    SetMaterialReportTimeZone(context:any,val:any){
        context.commit("setMaterialReportTimeZone",val);
    },
    SetUserBehaviorReportTimeZone(context:any,val:any){
        context.commit("setUserBehaviorReportTimeZone",val);
    },
    SetUserRetentionReportTimeZone(context:any,val:any){
        context.commit("setUserRetentionReportTimeZone",val);
    },
    SetComprehensiveFormTimeZone(context:any,val:any){
        context.commit("setComprehensiveFormTimeZone",val);
    }
}

const getters = {
    getLoading(state:any) {
        return state.loading;
    },
    getSpinning(state:any) {
        return state.showMasking;
    },
    getOpenMenuKey(state:any){
        return state.openMenuKey;
    },
    getOpenKeys(state:any){
        return state.openKeys;
    },
    getAppInfo(state:any){
        return state.appInfo;
    },
    getLanguage(state:any){
        return state.language;
    },
    getActiveKey(state:any){
        return state.activeKey;
    },
    getCrossPromotionFormTimeZone(state:any){
        return state.crossPromotionFormTimeZone;
    },
    getCrossPromotionChartTimeZone(state:any){
        return state.crossPromotionChartTimeZone;
    },
    getDirectCustomerReportTimeZone(state:any){
        return state.directCustomerReportTimeZone;
    },
    getMaterialReportTimeZone(state:any){
        return state.materialReportTimeZone;
    },
    getUserBehaviorReportTimeZone(state:any){
        return state.userBehaviorReportTimeZone;
    },
    getUserRetentionReportTimeZone(state:any){
        return state.userRetentionReportTimeZone;
    },
    getComprehensiveFormTimeZone(state:any){
        return state.comprehensiveFormTimeZone;
    },

}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}