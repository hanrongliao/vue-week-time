<template>
  <div id="app">
    <week-time  :locale="locale"
                @change="getWeekTimes"></week-time>
    <div>{{text}}</div>
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
      weekTimes: {},
      text: '',
      locale: {
        0: 'Monday',
        1: 'Tus',
      }
    }
  },
  methods: {
    getWeekTimes(times, text) {
      this.weekTimes = times;
      this.text = text;
    }
  }
}
</script>

<style lang="scss">

</style>
