<template>
  <div class="week-time">
    <table class="left">
      <thead>
        <tr>
          <th @click="selectAll">{{locale[7] || '全选'}}</th>
        </tr>
        <tr>
          <th @click="clear">{{locale[8] || '清空'}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in weekdays">
          <td @click="selectWeekday(index + 1)">{{ locale[index] || item}}</td>
        </tr>
      </tbody>
    </table>
    <table class="right">
      <thead>
        <tr>
          <th colspan="7" @click="selectDayPeriod(0, 6)">{{locale[9] || '凌晨'}}</th>
          <th colspan="4" @click="selectDayPeriod(7, 10)">{{locale[10] || '上午'}}</th>
          <th colspan="4" @click="selectDayPeriod(11, 14)">{{locale[11] || '中午'}}</th>
          <th colspan="4" @click="selectDayPeriod(15, 18)">{{locale[12] || '下午'}}</th>
          <th colspan="5" @click="selectDayPeriod(19, 23)">{{ locale || '夜晚'}}</th>
        </tr>
        <tr class="hour">
          <th v-for="n in 24" @click="selectDayPeriod(n - 1)">{{(n - 1)}}</th>
        </tr>
      </thead>
      <tbody  @mouseleave="mouseLeave">
        <tr v-for="m in 7" :key="m">
          <td v-for="n in 24"
              :class="{'selected': selected[m].indexOf(n - 1) > -1}"
              :key="n"
              @dragstart.stop.prevent
              @mousedown.stop="selectByMousedown(m, n - 1, $event)"
              @mouseover.stop="selectByMouseOver(m, n - 1)"
              @mouseout.stop="selectByMouseout(m, n - 1)"
              @mouseup.stop="selectByMouseup(m, n - 1)"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import Util from '../util'

  export default {
    name: 'weekTime',
    props: {
      weekTimes: {
        type: Object,
        default: () => {},
      },
      locale: {
        type: Object,
        default: () => {}
      },
    },
    data() {
      return {
        weekdays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        drawing: false,
        selecting: true,
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
        selectedText: '',
      }
    },
    watch: {
      weekTimes() {
        this.initData()
      }
    },
    created() {
      this.initData()
    },
    mounted() {
      this.emitWeekTimes()
    },
    methods: {
      initData() {
        if (!this.weekTimes || !(this.weekTimes instanceof Object)) return
        for (let i = 1; i <= 7; i++) {
          const isArray = Array.isArray(this.weekTimes[i])
          if (isArray) {
            this.selected[i] = [].concat(this.weekTimes[i])
          } else {
            this.selected[i] = []
          }
        }
      },
      // 全选某星期
      selectWeekday(i) {
        if (this.selected[i].length !== 24) {
          const hours = []
          for (let j = 0; j < 24; j++) {
            hours.push(j)
          }
          this.selected[i] = hours;
        } else {
          this.selected[i].splice(0, this.selected[i].length)
        }
        this.emitWeekTimes()
      },
      // 全选一星期的某个时段
      selectDayPeriod(start, end) {
        if (!end) {
          const isFull = this.isSelectedDayPeriod(start)
          if (isFull) {
            for (let i = 1; i <= 7; i++) {
              this.deleteHour(i, start)
            }
          } else {
            for (let i = 1; i <= 7; i++) {
              this.selectHour(i, start)
            }
          }
        } else {
          let isFull = true
          for (let i = start; i <= end; i++) {
            if (!this.isSelectedDayPeriod(i)) {
              isFull = false
              break
            }
          }
          if (isFull) {
            for (let i = 1; i <= 7; i++) {
              for (let j = start; j <= end; j++) {
                this.deleteHour(i, j)
              }
            }
          } else {
            for (let i = 1; i <= 7; i++) {
              for (let j = start; j <= end; j++) {
                this.selectHour(i, j)
              }
            }
          }
        }
        this.emitWeekTimes()
      },
      // 判断某个时段是否在一周都选上
      isSelectedDayPeriod(j) {
        const result = true;
        for(let i = 1; i <= 7; i++) {
          if (!this.isSelected(i, j)) {
            return !result
          }
        }
        return result
      },
      // 判断是否已经被选
      isSelected(m, n) {
        return this.selected[m].indexOf(n) > -1
      },
      // 拖动选择开始
      selectByMousedown(m, n, $event) {
        if ($event.button !== 0) return;
        this.selecting = !this.isSelected(m, n)
        this.drawing = true
        this.startX = m
        this.startY = n
        this.preX = m
        this.preY = n
      },
      // 拖动选择某小时
      selectByMouseOver(m, n) {
        if (!this.drawing) return
        const startX = m > this.startX ? this.startX : m
        const startY = n > this.startY ? this.startY : n
        const endX = m > this.startX ? m : this.startX
        const endY = n > this.startY ? n : this.startY
        for (let i = startX; i <= endX; i++) {
          for (let j = startY; j <= endY; j++) {
            if (this.selecting) {
              this.selectHour(i, j)
            } else {
              this.deleteHour(i, j)
            }
          }
        }
        this.checkSelectedValid(m, n)
      },
      // 检查拖动选择是否有效
      checkSelectedValid(m, n) {
        const currentList = [];
        const preList = [];
        // 起点到m,n的集合
        const startX = m > this.startX ? this.startX : m
        const startY = n > this.startY ? this.startY : n
        const endX = m > this.startX ? m : this.startX
        const endY = n > this.startY ? n : this.startY
        for (let i = startX; i <= endX; i++) {
          for (let j = startY; j <= endY; j++) {
            currentList.push(`${i},${j}`)
          }
        }
        // 起点到preX，preY的点集
        const preStartX = this.preX > this.startX ? this.startX : this.preX
        const preStartY = this.preY > this.startY ? this.startY : this.preY
        const preEndX = this.preX > this.startX ? this.preX : this.startX
        const preEndY = this.preY > this.startY ? this.preY : this.startY
        for (let i = preStartX; i <= preEndX; i++) {
          for (let j = preStartY; j <= preEndY; j++) {
            preList.push(`${i},${j}`)
          }
        }
        // 求交集
        preList.forEach((item) => {
          const flag = currentList.indexOf(item);
          if (flag === -1) {
            const point = item.split(',');
            if (this.selecting) {
              this.deleteHour(+point[0], +point[1]);
            } else {
              this.selectHour(+point[0], +point[1])
            }
          }
        })
      },
      // 更新
      selectByMouseout(m, n) {
        this.preX = m;
        this.preY = n;
      },
      // 拖动选择结束
      selectByMouseup(m, n) {
        if (!this.drawing) return
        if (this.selecting) {
          this.selectHour(m, n)
        } else {
          this.deleteHour(m, n)
        }
        this.drawing = false
        this.emitWeekTimes()
      },
      mouseLeave() {
        if (this.drawing) {
          this.emitWeekTimes()
        }
        this.drawing = false
      },
      selectHour(m, n) {
        if (!this.isSelected(m, n)) {
          this.selected[m].push(n)
        }
      },
      deleteHour(m, n) {
        const flag = this.selected[m].indexOf(n)
        if (flag > -1) {
          this.selected[m].splice(flag, 1)
        }
      },
      // 全选
      selectAll() {
        const hours = [];
        for (let j = 0; j <= 23; j++) {
          hours.push(j);
        }
        for(let i = 1; i <= 7; i++) {
          this.selected[i] = [].concat(hours)
        }
        this.emitWeekTimes()
      },
      // 清空选择
      clear() {
        for (let i = 1; i < 8; i ++) {
          this.selected[i] = []
        }
        this.emitWeekTimes()
      },
      emitWeekTimes() {
        for (let i = 1; i <= 7; i++) {
          this.selected[i].sort((a, b) => a - b)
        }
        this.selectedText = this.getWeekTimeString(this.selected)
        this.$emit('change', this.selected, this.selectedText)
      },
      // 时间段数据处理成人读形式
      getWeekTimeString(week) {
        const keys = Object.keys(week)
        const isAll = keys.every(key => week[key].length === 24) // 全天候
        const isNone = keys.every(key => week[key].length === 0) // 未选择
        if (isAll) return '全天'
        if (isNone) return '全不选'
        const hours = this.hoursPretreatment(week);
        return this.weekdayPretreatment(hours);
      },
      // 小时数据转化为人读形式
      hoursPretreatment(week) {
        const keys = Object.keys(week)
        const hours = []
        keys.forEach((key) => {
          const hourList = Util.numberArrayGroup(week[key])
          const hourListText = []
          hourList.forEach((hour) => {
            if (hour.length > 1) {
              // 将连续数用 '~' 连起来
              const text = `${hour[0]} ~ ${hour[hour.length - 1]}时`
              hourListText.push(text)
            } else {
              hourListText.push(`${hour.join('')}时`)
            }
          });
          hours.push(hourListText.join(',')) // 拼接1天的事件段
        });
        return hours
      },
      // 将小时数据和周数据拼接,并转化为人读形式
      weekdayPretreatment(hours) {
        const weekday = []
        const day = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
        const eqValIndex = Util.getEqualValueIndex(hours) // 相同时间的下标的二维数组
        eqValIndex.forEach((val) => {
          const valList = Util.numberArrayGroup(val) // 连续的周的index
          const valText = [];
          valList.forEach((item) => {
            if (item.length > 1) {
              const text = day[item[0]] + ' ~ ' + day[item[item.length - 1]]
              valText.push(text);
            } else {
              valText.push(day[item[0]])
            }
          });
          if (hours[val[0]].length > 0) {
            weekday.push(valText.join(',') + ': ' + hours[val[0]])
          }
        });
        return weekday.join('; ')
      },
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
        border: 1px solid #ccc;
        word-break: keep-all;
        text-align: center;
      }
      tbody tr {
        height: 36px;
      }
    };
    table th {
      font-weight: normal;
    }
    table.left {
      width: 56px;
      flex-grow: 0;
      flex-shrink: 0;
      cursor: pointer;
      thead tr {
        height: 28px;
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
        &.hour th {
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
