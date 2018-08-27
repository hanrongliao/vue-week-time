/**
 * Vue-week-time
 * @author hanrongliao
 */

import WeekTime from './components/WeekTime.vue'

//global 情况下 自动安装
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('vue-week-time', WeekTime)
}

// 导出模块
export default WeekTime
