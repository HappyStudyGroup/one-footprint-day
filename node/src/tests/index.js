
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, Math.PI, true)
    ctx.fillStyle = '#f00'
    ctx.fill()
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, Math.PI, false)
    ctx.fillStyle = '#0f0'
    ctx.fill()
  