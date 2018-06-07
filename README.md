# 最重要的事情(Most impartant thing)
...


## 介绍(introduction)

A week time select plugin for vue. It's look like:
()

## 开始(start)

``` bash
 npm i vue-week-time --save
```
```html
<template>
    <week-time :weekTime='weekTime'
                @change='weekTimeChange'></week-time>
</template>

<script>
import WeekTime from 'vue-week-time'
export default {
    components: {
        'week-time': WeekTime,
    },
    data() {
        weekTime: {},
    },
    methods: {
        weekTimeChange(weekTime, weekTimeStr) {
            // ...do something what you want hey!
        }
    }
}
</script>
```
## 参数(parmas)
| props        | default       | 
| -------------|:-------------:|
|  weekTime    | \{}           |

`weekTime`是唯一的参数，它包含键为1-7的7个属性,依次代表周一到周日，当缺少键是会默认补充，并赋值为空数组。属性值为一个包含0-23的数组，分别代表选中的某个小时，如下：

```javascript
 {
     1: [0, 1, 2, 3], // 选中了周一的0-3时
     2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], // 周二全选
     3: [20, 21, 8, 9], // 周三选中8-9时，20-21时
     4: [], // 周四未选
     5: [], 
     6: [],
     7: [],
 }
```
## 回调事件(event callback)`change` 
weekTime组件初始化（mounted）和拖动选择时间时会触发change事件，回调参数有两个，分别是weekTime对象和经过语义化解析weekTime字符串。 

## License
MIT