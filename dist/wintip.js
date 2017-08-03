/*!
 * wintip v1.0.0
 * @author Vincent
 */
var wintip = (function () {
'use strict';

function query(selector) {
  return document.querySelectorAll(selector)
}

function likeNumber(value) {
  return !isNaN(Number(value))
}

function isElement(ele) {
  return typeof ele === 'object' && ele.nodeType === 1
}

function append(ele, html) {
  if (isElement(ele)) {
    ele.insertAdjacentHTML('beforeend', html);
  } else {
    query(ele)[0].insertAdjacentHTML('beforeend', html);
  }
}

var settings = {
  output: true,
  opacity: 0.75
};

function winTip(msg) {
  var idNo = query('._win_tip').length + 1;
  var idStr = "_tip_" + idNo;
  var tip = query(("." + idStr));
  var tipBox = query('._win_tip_box');

  if (!settings.output) { return }

  var tipHtml = "<span class=\"_win_tip " + idStr + "\" style=\"display: inline-block;min-width: 80px;padding: 8px;margin-bottom: 1px;background-color: rgba(0, 0, 0, " + (settings.opacity) + ");\">" + msg + "</span><br>";

  var tipBoxHtml = "<div class=\"_win_tip_box\" style=\"position: fixed;top: 0;left: 0;max-height: 75%;word-break: break-all;max-width: 55%;color: #fff;font-size: 12px;z-index: 100;overflow: auto;-webkit-overflow-scrolling: touch;\">" + tipHtml + "</div>";

  if (tip.length) {
    tip[0].textContent = msg;
  } else if (tipBox.length) {
    append(tipBox[0], tipHtml);
  } else {
    append('body', tipBoxHtml);
  }

  return tip
}

winTip.remove = function (tip) {
  var node = isElement(tip) ? tip : query(("._tip_" + tip))[0];
  if (node) {
    node.nextElementSibling.remove();
    node.remove();
  }
};

winTip.config = function (options) {
  Object.assign(settings, options);
};

winTip.$ = function (name) {
  var idNo = query('._win_tip').length + 1;
  var tip = query(("._tip_" + name));
  var tipBox = query('._win_tip_box');

  if (likeNumber(name) && !tip.length) {
    return alert(("wintip: " + name + " is not defined"))
  }

  return function(msg) {
    var idStr =
      likeNumber(name) || typeof name === 'undefined'
        ? ("_tip_" + idNo)
        : ("_tip_" + idNo + " _tip_" + name);

    var tipHtml = "<span class=\"_win_tip " + idStr + "\" style=\"display: inline-block;min-width: 80px;padding: 8px;margin-bottom: 1px;background-color: rgba(0, 0, 0, " + (settings.opacity) + ");\">" + msg + "</span><br>";

    var tipBoxHtml = "<div class=\"_win_tip_box\" style=\"position: fixed;top: 0;left: 0;max-height: 75%;word-break: break-all;max-width: 55%;color: #fff;font-size: 12px;z-index: 100;overflow: auto;-webkit-overflow-scrolling: touch;\">" + tipHtml + "</div>";

    if (tip.length) {
      tip[0].textContent = msg;
    } else if (tipBox.length) {
      append(tipBox[0], tipHtml);
    } else {
      append('body', tipBoxHtml);
    }

    return tip
  }
};

return winTip;

}());

//# sourceMappingURL=wintip.js.map