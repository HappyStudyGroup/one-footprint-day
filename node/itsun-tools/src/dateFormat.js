// 格式化日期函数
function dateFormat(dtStr) {
  const date = new Date(dtStr);

  const y = date.getFullYear();
  const m = addZero(date.getMonth() + 1);
  const d = addZero(date.getDate());

  const hh = addZero(date.getHours());
  const mm = addZero(date.getMinutes());
  const ss = addZero(date.getSeconds());

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

function addZero (n, precision = 2) {
  let result = n;
  if(String(n).padStart) {
    result = String(n).padStart(precision, '0');
  } else {
    result = n > 9 ? n : `0${n}`;
  }
  return result;
}

module.exports = {
  dateFormat
}