

/* Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        vastTemp:[]
    },
    mutations:{
        setVastTemp(state, data){
            state.vastTemp=data;
            console.log(state.vastTemp);
        }
    }
}) */

const state = {
    vastTemp:[],
    currentIndex:false,
    loading:false
}

const mutations = {
    setVastTemp(state:any, obj:any){
        state.vastTemp=obj;
        console.log(state.vastTemp);
    },
    setCurrentIndex(state:any,obj:any){
        state.currentIndex=obj;
    },
    setLoading(state:any,obj:any){
        state.loading=obj;
    }
}

const actions = {
    vastTemp(context:any,val:any) {
        console.log(val);
        context.commit("setVastTemp",val);
    }
}

const getters = {
    getVastTemp(state:any){
        return state.vastTemp;
    },
    getCurrentIndex(state:any){
        return state.currentIndex;
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}