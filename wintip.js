function winTip(msg, name) {
  var id = query('._win_tip').length + 1,
      tip = query('._tip_' + (name?name:id)),
      tipBox = query('._win_tip_box'),
      idStr, tipHtml, tipBoxHtml;

  if(likeNumber(name) && !tip.length) {
    alert('wintip:' + name + ' is not defined');
    return;
  }

  function query(selector) {
    return document.querySelectorAll(selector);
  }

  function append(ele, html) {
    if(typeof(ele) === 'object' && ele.nodeType === 1) {
      ele.insertAdjacentHTML('beforeend', html);
    } else {
      query(ele)[0].insertAdjacentHTML('beforeend', html);
    }
  }
  
  function likeNumber(value) {
    return !isNaN(Number(value));
  }

  idStr = (likeNumber(name) || typeof(name) === 'undefined')?'_tip_'+id:'_tip_'+id+' _tip_'+name;
  tipHtml = '<span class="_win_tip ' + idStr + '" style="display: inline-block;min-width: 80px;padding: 10px;margin-bottom: 1px;background-color: rgba(0, 0, 0, .75);">' + msg + '</span><br>';
  tipBoxHtml = '<div class="_win_tip_box" style="position: fixed;top: 0;left: 0;max-height: 75%;max-width: 55%;color: #fff;font-size: 12px;z-index: 100;overflow: hidden">' + tipHtml + '</div>';

  if (tip.length) {
    tip[0].textContent = msg;
  } else if (tipBox.length) {
    append(tipBox[0], tipHtml);
  } else {
    append('body', tipBoxHtml);
  }
  return tip;
}