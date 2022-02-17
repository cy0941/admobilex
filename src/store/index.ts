import { createStore } from 'vuex'
import User from "./modules/User"
import Util from "./modules/Util"
import Temp from "./modules/Temp"
export default createStore({
  modules: {
    User,
    Util,
    Temp
  }
})
