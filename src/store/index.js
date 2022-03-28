import VueX from 'vuex'
import persistencemodule from './modules/persistencemodule'
import songmodule from './modules/songmodule'
import setlistmodule from './modules/setlistmodule'

const store = new VueX.Store({
  modules: {
    songmodule,
    setlistmodule,
    persistencemodule
  }
})

export default store
