export default {
  // 将连续的数字分组, 返回二维数组
  numberArrayGroup(arr) {
    const result = [];
    let item;
    let temp;
    arr.forEach((v) => {
      if (item === v) {
        temp.push(item);
        item++;
        return;
      }
      temp = [v];
      item = v + 1;
      result.push(temp);
    });
    return result;
  },
  // 获取相等元素的下标集合
  getEqualValueIndex(arr) {
    const result = [];
    const read = new Array(arr.length); // 用于标记归类元素
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      const item = [];
      for (let j = i; j < len; j++) {
        if (arr[i] === arr[j] && !read[j]) {
          item.push(j);
          read[j] = true;
        }
      }
      if (item.length > 0) result.push(item);
    }
    return result;
  },
}
