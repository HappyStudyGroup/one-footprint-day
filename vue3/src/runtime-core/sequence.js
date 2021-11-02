export const getSequence = function (arr) {
  const p = arr.slice();
  const result = [0]; // [0] [1] [1, 2, 3] [1, 4, 5] [1,4,5,6] [1,4,5,7]
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {// 0 1 2 3 4 5 6 7
    const arrI = arr[i];
    if (arrI !== 0) {
      // 获取result数组中最后下标的值
      j = result[result.length - 1];// 0 0 1 2 3 3 5 6
      if (arr[j] < arrI) {// arr[6] < arr[7]
        p[i] = j; // p[i]=1,2,6
        result.push(i); // i=2,3,6
        continue;
      }
      // i=0,4,5,7
      // u=0,0-1,0-2,0-2-3
      // v=0,2-1,2,3-3
      // c= ,1-0,1,1-2-3
      u = 0; // 起始位置
      v = result.length - 1; // 最大位置
      // 求当前 i 在result的左侧还是右侧
      while (u < v) {
        c = (u + v) >> 1; // 二分法取中值
        if (arr[result[c]] < arrI) {
          u = c + 1;// 如果中值小于当前 i 对应的值, 那么范围就在右侧, 为[c+1, v]
        }
        else {
          v = c;// 如果中值大于当前 i 对应的值, 那么范围就在左侧侧, 为[u, c]
        }
      }
      // 如果当前i对应的值 小于 result中的值, 交换位置
      if (arrI < arr[result[u]]) { // arr[7] < arr[6]
        if (u > 0) {
          p[i] = result[u - 1];//p[7]=5
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}