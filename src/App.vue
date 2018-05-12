<template>
  <div id="app">
    <week-time :weekTimes="weekTimes"
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
      weekTimes: {
        1: [1],
        2: [2],
        3: [3],
        4: [4],
        5: [5],
        6: [6],
        7: [7],
      },
      text: '',
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
