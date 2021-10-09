function h (type, url, params) {
  let h = null;
  if (window.XMLHttpRequest) {// code for all new browsers
    h = new XMLHttpRequest();
  } else if (window.ActiveXObject) {// code for IE5 and IE6
    h = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (h != null) {
    h.onreadystatechange = state_Change;
    h.open(type, url, true);
    h.send(null);
  } else {
    alert("Your browser does not support XMLHTTP.");
  }

  function state_Change() {
    if (h.readyState === 4) {// 4 = "loaded"
      if (h.status === 200) {// 200 = OK
        // ...our code here...
      } else {
        alert("Problem retrieving XML data");
      }
    }
  }
}

window.http = h;
