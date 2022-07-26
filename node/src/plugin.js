const path = require('path')
const fs = require('fs')
const http = require('http')
const ProgressBar = require('progress');

// const bar = new ProgressBar(':bar', { total: 10 });
// const timer = setInterval(() => {
//   bar.tick();
//   if(bar.complete) {
//     clearInterval(timer);
//   }
// }, 100)

const { dateFormat } = require('./utils/dateFormat')
const dt = new Date();
console.log(dateFormat(dt));