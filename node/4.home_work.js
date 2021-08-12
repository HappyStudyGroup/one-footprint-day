Promise.resolve().then(() => { // then1
  console.log(1)
  Promise.resolve().then(() => { // then11
    console.log(11)
  }).then(() => { // then22
    console.log(22)
  }).then(() => { // then33
    console.log(33)
  })
  console.log('1212')
}).then(() => { // then2
  console.log(2)
}).then(() => { // then3
  console.log(3)
})
// [then1 then11 then2 then22 then3 then33]
// 微任务的执行顺序, 由先入队列先执行
// promise成功之后才会放入then
// 1 11 2 22 3 33

async function async1() {
  console.log('async1 start')
  // node的其他版本可能会把await 解析出两个then
  await async2()  // Promise.resolve(async2()).then(() => console.log('ok'))
  console.log("ok")
}
async function async2() {
  console.log('async2')
}
console.log('script start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)
async1()
new Promise(function(resolve) {
  console.log('promise1')
  resolve()
}).then(function() {
  console.log('script end')
})
// 先清空微任务队列, 再清空宏任务队列, 所以微任务优先于宏任务
// 宏任务[setTimeout]
// 微任务[ok, script end]
// script start
// async1 start
// async2
// promise1,  new Promise立即执行
// ok
// script end
// setTimeout