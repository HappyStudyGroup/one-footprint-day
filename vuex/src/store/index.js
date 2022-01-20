import Vue from 'vue'
import Vuex from '@/vuex'
// import logger from 'vuex/dist/logger'
// import VuexPersistence from 'vuex-persist'

// 插件需要 plugins replaceState subscribe
class VuexPersistence {
  constructor({storage}) {
    this.storage = storage;
    this.localName = 'VUEX-MY';
  }
  plugin = (store) => {
    let localState = JSON.parse(this.storage.getItem(this.localName))
    if(localState) {
      store.replaceState(localState);
    }
    store.subscribe((mutation, state) => {
      this.storage.setItem(this.localName, JSON.stringify(state))
    })
  }
}

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const logger = () => (store) => {
  let prevState = JSON.stringify(store.state)
  store.subscribe((mutation, state) => { // 监听变化, 每次 mutation 更新数据都会执行此方法
    // mutation 的格式为 { type, payload }
    prevState = JSON.stringify(state)
  })
}

console.log('%cHello', 'color: #43bb88;font-size:24px;font-weight:bold;');
Vue.use(Vuex); // Vuex中有 install 方法

// 注意: 父模块中的属性不能和子模块名重名, 否则后者会覆盖前者
export default new Vuex.Store({
  strict: true, // 严格模式下,无法通过非mutation下修改state
  plugins: [ // 注意插件执行顺序
    vuexLocal.plugin,
    logger(),
  ],
  namespaced: true,
  state: {
    name: 'zf',
    age: 11
  },
  getters: {
    myAge (state) {
      return state.age + 20
    }
  },
  mutations: {
    changeAge (state, payload) {
      state.age += payload
    }
  },
  actions: {
    // 可以包含异步逻辑
    changeAge({ commit }, payload) {
      setTimeout(() => {
        commit('changeAge', payload)
      }, 1000)
    }
  },
  modules: {
    a: {
      namespaced: true,
      state: {
        name: 'aa',
        age: 10
      },
      mutations: {
        changeAge (state, payload) {
          state.age += payload
        }
      },
      modules: {
        c: {
          namespaced: true,
          state: {
            name: 'cc'
          },
          getters: {
            getName(state) {
              return state.name + 'c'
            }
          }
        }
      }
    },
    b: {
      namespaced: true,
      state: {
        name: 'bb',
        age: 10
      },
      mutations: {
        changeAge (state, payload) {
          state.age += payload
        }
      },
      actions: {
        changeAge({ commit }, payload) {
          setTimeout(() => {
            commit('changeAge', payload)
          }, 1000)
        }
      }
    },
  }
})
