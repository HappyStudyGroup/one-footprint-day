
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

function addZero (num, precision = 2) {
  return String(num).padStart(precision, '0');
}

module.exports = {
  dateFormat
}