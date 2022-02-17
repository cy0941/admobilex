import request from "../../utils/request.js"
let { getUserInfo } = request

const state = {
    userInfo: {},
    userAccessControl: {},
}

const mutations = {
    getUser(state:any, obj:any) {
        obj.feature_sets.map((_:any)=>{
            _.features.map((item:any)=>{
                state.userAccessControl[item.name] = item.value
            })
        });
        obj.features.map((item:any) => {
            state.userAccessControl[item.name] = item.value
        });
        state.userInfo = obj;
    }
}

const actions = {
    reqUserInfo(context:any) {
        getUserInfo().then((res:any) => {
            let data = res.data.data
            delete data.password
            context.commit('getUser', data)
        })
    }
}

const getters = {
    getUserAccessControl(state:any) {
        return state.userAccessControl
    },
    getUser(state:any){
        return state.userInfo
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}