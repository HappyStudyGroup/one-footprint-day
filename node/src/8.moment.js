const moment = require('moment')
const itsun = require('../itsun-tools')


// const dt = moment().format('YYYY-MM-DD HH:mm:ss')
const dt = itsun.dateFormat(new Date())
console.log(dt);

const str = '<h1 title="abc">这是h1标签<span>123&nbsp;</span></h1>'
let nstr = itsun.htmlEscape(str)
console.log(nstr)
console.log(itsun.htmlUnEscape(nstr))