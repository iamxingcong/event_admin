import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import Vuex from 'vuex'


import VueCodemirror from 'vue-codemirror'

// require styles
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodemirror)
// merge js
import 'codemirror/addon/merge/merge.js'
// merge css
import 'codemirror/addon/merge/merge.css'
// google DiffMatchPatch
import DiffMatchPatch from 'diff-match-patch'
// DiffMatchPatch config with global
window.diff_match_patch = DiffMatchPatch
window.DIFF_DELETE = -1
window.DIFF_INSERT = 1
window.DIFF_EQUAL = 0


Vue.use(Vuex)

Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.use(VueAxios, axios)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


router.beforeEach((to,from,next)=>{
	if(to.meta.title){
		document.title = to.meta.title;
		next();
	}
})