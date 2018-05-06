<template>
  <div id="app">
    <week-time :initData="{}"></week-time>
  </div>
</template>

<script>
import  WeekTime from './components/WeekTime';

export default {
  name: 'app',
  components: {
    'week-time': WeekTime,
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">

</style>
