import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

console.log(window.location.host)

var str = window.location.host;


var reg  =  RegExp(/web.shijian.woa.com/);
var treg =  RegExp(/shijian.woa.com/);
var sreg =  RegExp(/localhost/);
var ureg =  RegExp(/test.shijian.woa.com/);
var dm = ""

if(str.match(ureg)){
    dm = "http://test.api.shijian.woa.com/"
} else  if(str.match(reg)){
    dm = 'https://api-shijian.woa.com/'
} else if(str.match(treg)){
   dm = 'https://api-shijian.woa.com/'
} else if(str.match(sreg)){
   dm = "http://test.api.shijian.woa.com/"
}  else {
   dm = "http://test.api.shijian.woa.com/"
}

console.log(dm)

const store = new Vuex.Store({
    state:{

        domain: dm,
        // domain: 'http://test.api.shijian.woa.com/'
        // domain: 'http://api.shijian.woa.com/'
        menuCollapse: false
    },
    mutations: {
        change(state, menuCollapse) {
          state.menuCollapse = menuCollapse
        }
      },
      getters: {
        menuCollapse: state => state.menuCollapse
      }
})

export default store