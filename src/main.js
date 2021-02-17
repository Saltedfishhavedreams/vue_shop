import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import TreeTable from 'vue-table-with-tree-grid'

// 导入全局样式
import 'assets/css/global/global.css'

// 导入字体图标
import 'assets/font/iconfont.css'

Vue.component('tree-table', TreeTable)

Vue.use(ElementUI)
Vue.config.productionTip = false
// 事件总线
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
