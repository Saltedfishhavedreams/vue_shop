import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import TreeTable from 'vue-table-with-tree-grid'
// 引入富文本组件
import VueQuillEditor from 'vue-quill-editor'

// require styles 引入富文本样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入全局样式
import 'assets/css/global/global.css'

// 导入字体图标
import 'assets/font/iconfont.css'

Vue.component('tree-table', TreeTable)

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

Vue.use(ElementUI)
Vue.config.productionTip = false
// 事件总线
Vue.prototype.$bus = new Vue()

// 注册一个全局过滤器
Vue.filter('dateFormat', (originVal) => {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 +'').padStart(2, '0')
  const d = (dt.getDate() +'').padStart(2, '0')

  const hh = (dt.getHours() +'').padStart(2, '0')
  const mm = (dt.getMinutes() +'').padStart(2, '0')
  const ss = (dt.getSeconds() +'').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
