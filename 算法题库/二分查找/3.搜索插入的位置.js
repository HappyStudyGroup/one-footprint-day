const question = `
  给定一个排序数组和一个目标值，
  在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
  请必须使用时间复杂度为 O(log n) 的算法。`

// O(), 时间复杂度, 即输入为 n 的时候，代码需要执行 2^x 次，称为：O(x)=O(log n);

/*
示例 1:
  输入: nums = [1,3,5,6], target = 5
  输出: 2

示例 2:
  输入: nums = [1,3,5,6], target = 2
  输出: 1

示例 3:
  输入: nums = [1,3,5,6], target = 7
  输出: 4

示例 4:
  输入: nums = [1,3,5,6], target = 0
  输出: 0
  
示例 5:
  输入: nums = [1], target = 0
  输出: 0

提示:
  1 <= nums.length <= 104
  -104 <= nums[i] <= 104
  nums 为无重复元素的升序排列数组
  -104 <= target <= 104
*/

let arr = [
  { n: [1,3,5,6], t: 5, i: 2 },
  { n: [1,3,5,6], t: 2, i: 1 },
  { n: [1,3,5,6], t: 7, i: 4 },
  { n: [1,3,5,6], t: 0, i: 0 },
  { n: [1],       t: 0, i: 0 },
]

const answer = function(nums, target) {
  const n = nums.length;
  let left = 0, right = n - 1, ans = n;
  while (left <= right) {
      let mid = ((right - left) >> 1) + left;
      if (target <= nums[mid]) {
          ans = mid;
          right = mid - 1;
      } else {
          left = mid + 1;
      }
  }
  return ans;
}


arr.forEach(e => {
  console.log(answer(e.n, e.t))
})
