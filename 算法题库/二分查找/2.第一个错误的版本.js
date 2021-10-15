const question = `你是产品经理，目前正在带领一个团队开发新的产品。不幸的是，你的产品的最新版本没有通过质量检测。由于每个版本都是基于之前的版本开发的，所以错误的版本之后的所有版本都是错的。
假设你有 n 个版本 [1, 2, ..., n]，你想找出导致之后所有版本出错的第一个错误的版本。
你可以通过调用 bool isBadVersion(version) 接口来判断版本号 version 是否在单元测试中出错。实现一个函数来查找第一个错误的版本。你应该尽量减少对调用 API 的次数。`

/*  
  示例 1：

  输入：n = 5, bad = 4
  输出：4
  解释：
  调用 isBadVersion(3) -> false 
  调用 isBadVersion(5) -> true 
  调用 isBadVersion(4) -> true
  所以，4 是第一个错误的版本。

  示例 2：

  输入：n = 1, bad = 1
  输出：1
   
  提示：
    1 <= bad <= n <= 231 - 1
 */

let arr = [
  { n: 5, t: 4, i: 4 },
  { n: 1, t: 1, i: 1 },
]
    
function isBadVersion(i, bad){
  return i === bad
}
let answer = function (n, bad) {
  let left = 1, right = n;
  while (left < right) { // 循环直至区间左右端点相同
      const mid = Math.floor(left + (right - left) / 2); // 防止计算时溢出
      if (isBadVersion(mid, bad)) {
          right = mid; // 答案在区间 [left, mid] 中
      } else {
          left = mid + 1; // 答案在区间 [mid+1, right] 中
      }
  }
  // 此时有 left == right，区间缩为一个点，即为答案
  return left;
}

arr.forEach(e => {
  console.log(`输入：${e.n}`, `错误版本：${e.t}`, `预测结果：${e.i}`, `输出：${answer(e.n, e.t)}`)
})
