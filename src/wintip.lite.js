function winTip(msg, id) {
  var tid = id || 1,
      query = function(selector) {return document.querySelectorAll(selector)},
      append = function(ele, html) {query(ele)[0].insertAdjacentHTML('beforeend', html)};
  var tip = '<span id="tip_' + tid + '" class="_win_tip" style="display: inline-block;min-width: 80px;padding: 10px;margin-bottom: 1px;background-color: rgba(0, 0, 0, .75);">' + msg + '</span><br>',
      tipBox = '<div class="_win_tip_box" style="position: fixed;top: 0;left: 0;max-height: 75%;max-width: 55%;color: #fff;font-size: 12px;z-index: 100;overflow: hidden">' + tip + '</div>';
  var ele = query('#tip_' + tid);
  if (ele.length > 1) {
    ele.textContent = msg;
  } else if (query('._win_tip_box').length > 0) {
    append('._win_tip_box', tip);
  } else {
    append('body', tipBox);
  }
  return ele;
}