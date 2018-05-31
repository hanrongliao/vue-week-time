/**
 * Vue-week-time
 * @author hanrongliao
 */

import WeekTime from './components/WeekTime.vue'

// 导出模块
export default WeekTime

//global 情况下 自动安装
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('vue-loading', WeekTime)
}
