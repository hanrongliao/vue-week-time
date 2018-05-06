<template>
  <div class="week-time">
    <table class="left">
      <thead>
        <tr>
          <th @click="clear">清空</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in weekdays">
          <td @click="selectWeekday(index)">{{ '星期' + item}}</td>
        </tr>
      </tbody>
    </table>
    <table class="right">
      <thead>
        <tr>
          <th colspan="7" @click="selectDayPeriod('EM')">凌晨时段</th>
          <th colspan="4" @click="selectDayPeriod('AM')">上午时段</th>
          <th colspan="4" @click="selectDayPeriod('MM')">中午时段</th>
          <th colspan="4" @click="selectDayPeriod('PM')">下午时段</th>
          <th colspan="5" @click="selectDayPeriod('NM')">夜晚时段</th>
        </tr>
        <tr class="hour">
          <td v-for="n in 24" @click="selectDayHour(n)">{{(n - 1)}}</td>
        </tr>
      </thead>
      <tbody  @mouseleave="selecting = false">
        <tr v-for="m in 7" :key="m">
          <td v-for="n in 24"
              :class="{'selected': selected[m].indexOf(n - 1) > -1}"
              :key="n"
              @mousedown="selectByMousedown(m, n - 1)"
              @mouseover="selectByMouseOver(m, n - 1)"
              @mouseout="selectByMouseout(m, n - 1)"
              @mouseup="selectByMouseup(m, n - 1)"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  export default {
    name: 'weekTime',
    props: {
      initData: {
        type: Object,
      }
    },
    data() {
      return {
        weekdays: ['一', '二', '三', '四', '五', '六', '日'],
        selecting: false,
        startX: -1,
        startY: -1,
        preX: -1,
        preY: -1,
        currentX: -1,
        currentY: -1,
        selected: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
        },
      }
    },
    created() {
    },
    methods: {
      // 全选某星期
      selectWeekday(index) {},
      // 全选一星期的某个时段
      selectDayPeriod(period) {},
      // 全选一星期的有一小时
      selectDayHour(n) {},
      // 拖动选择开始
      selectByMousedown(m, n) {
        this.selecting = true
        this.startX = m
        this.startY = n
      },
      // 拖动选择结束
      selectByMouseup(m, n) {
        if (!this.selecting) return
        const flag = this.selected[m].indexOf(n)
        if (flag === -1) {
          this.selected[m].push(n)
        }
        if (flag > -1 && this.startY === n && this.startX === m) {
          this.selected[m].splice(flag, 1)
        }
        this.selecting = false
        console.log(this.selected)
      },
      // 拖动选择某小时
      selectByMouseOver(m, n) {
        if (!this.selecting) return
        const startX = m > this.startX ? this.startX : m
        const startY = n > this.startY ? this.startY : n
        const endX = m > this.startX ? m : this.startX
        const endY = n > this.startY ? n : this.startY
        for (let i = startX; i <= endX; i++) {
          for (let j = startY; j <= endY; j++) {
            this.selectHour(i, j)
          }
        }
        this.checkSelectedValid(m, n)
      },
      // 检查拖动选择是否有效
      checkSelectedValid(m, n) {

      },
      selectHour(m, n) {
        const flag = this.selected[m].indexOf(n)
        if (flag === -1) {
          this.selected[m].push(n)
        }
      },
      deleteHour(m, n) {
        const flag = this.selected[m].indexOf(n)
        if (flag > -1) {
          this.selected[m].splice(flag, 1)
        }
      },
      // 更新
      selectByMouseout(m, n) {
        this.preX = m;
        this.preY = n;
      },
      // 清空选择
      clear() {
        for (let i = 1; i < 8; i ++) {
          this.selected[i] = []
        }
      }
    }

  }
</script>
<style type="text/css" lang="scss">
  .week-time{
    display: flex;
    font-size: 13px;
    table {
      border-collapse: collapse;
      td, th {
        word-break: keep-all;
        text-align: center;
        border: 1px solid #ccc;
      }
      tbody tr {
        height: 40px;
      }
    };
    table th {
      font-weight: normal;
    }
    table.left {
      width: 56px;
      cursor: pointer;
      thead tr {
        height: 56px;
      }
      td, th{
        border-right: none;
        min-width: 45px;
        &:hover {
          background-color: #f2f2f2;
        }
      }
    }
    table.right {
      thead tr {
        height: 28px;
        cursor: pointer;
        &.hour td {
          width: 22px;
          min-width: 19px;
          white-space: nowrap;
        }
        td, th {
          &:hover {
            background-color: #f2f2f2;
          }
        }
      }
    }
    .selected {
      background-color: #3482cb;
    }
  }
</style>
