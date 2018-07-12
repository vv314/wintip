/*!
 * wintip v1.5.0
 * (c) Vincent
 * Released under the MIT License.
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = "._win_tip_box {\n  position: fixed;\n  top: 0;\n  left: 0;\n  max-height: 75%;\n  word-break: break-all;\n  max-width: 55%;\n  color: #fff;\n  font-size: 12px;\n  z-index: 100;\n  overflow: auto;\n  opacity: 1;\n  text-shadow: 1px 1px rgba(0, 0, 0, 0.3);\n  -webkit-overflow-scrolling: touch;\n  transition: opacity 0.3s;\n}\n\n._win_tip {\n  display: inline-block;\n  min-width: 80px;\n  padding: 8px;\n  margin-bottom: 1px;\n  color: inherit;\n  border: 0;\n  background-color: rgba(34, 34, 34, 0.75);\n}\n\n._win_tip_box--sleep {\n  opacity: 0.3;\n}\n";
styleInject(css);

function query(selector) {
    return isString(selector) ? document.querySelector(selector) : null;
}
function querys(selector) {
    return document.querySelectorAll(selector);
}
function createEl(tag) {
    return document.createElement(tag);
}
function likeNumber(value) {
    return !isNaN(Number(value));
}
function isElement(target) {
    // Element or Fragment
    return ((typeof target === 'object' && target.nodeType === 1) ||
        target.nodeType === 11);
}
function isFunc(target) {
    return typeof target === 'function';
}
function isString(target) {
    return typeof target === 'string';
}
function append(ele, dom) {
    var node = isElement(ele) ? ele : query(ele);
    node && node.appendChild(dom);
    return node;
}
function space2dash(str) {
    return str.replace(/\s+/g, '_');
}
function stringify(obj) {
    try {
        return JSON.stringify(obj);
    }
    catch (e) {
        console.error('[wintip]', "can't print object", obj);
        return '';
    }
}

var BOX_CLASS_NAME = '_win_tip_box';
var TIP_CLASS_NAME = '_win_tip';
var TIP_ID_PREFIX = '_tip_';
var BOX_SLEEP = '_win_tip_box--sleep';
var WARN_COLOR = '#fee381';
var ERROR_COLOR = '#ff4545';
var WEAK_TIME = 30 * 1000;
// start from 1
var tipNo = 1;
var sleepTimer = 0;
var log = console.log;
var settings = {
    // 'debug', 'info', 'warn', 'error'
    output: true,
    console: false,
    opacity: 0.75,
    color: '#fff'
};
function consoleProxy(isOpen) {
    var mlog = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        winTip.apply(winTip, args);
        log.apply(console, args);
    };
    console.log = isOpen ? mlog : log;
}
function checkDisplayLevel(baseLevel) {
    if (baseLevel === void 0) { baseLevel = 'debug'; }
    var ranking = ['debug', 'info', 'warn', 'error'];
    var outputLevel = ranking.indexOf("" + settings.output) < 0
        ? ranking.length
        : ranking.indexOf("" + settings.output);
    return ranking.indexOf(baseLevel) >= outputLevel || settings.output === true;
}
var winTip = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var idStr = getNewTipId();
    var tipNode = query("." + idStr);
    var isRender = checkDisplayLevel('debug') && args.length;
    // return a empty object({}) when output is false
    // normaly return a Element object
    return isRender ? renderTip(tipNode, [idStr], joinWithSpace(args)) : {};
};
function getNewTipId(name) {
    name = name === undefined ? tipNo++ : name;
    return space2dash(TIP_ID_PREFIX + name);
}
function joinWithSpace(args, prefix) {
    if (prefix === void 0) { prefix = ''; }
    var res = args
        .map(function (e) { return (typeof e === 'object' ? stringify(e) : "" + e); })
        .join(' ');
    return prefix ? "[" + prefix + "] " + res : res;
}
function createTipFragment(idArr, msg, opts) {
    var fragment = document.createDocumentFragment();
    var tip = createEl('span');
    tip.className = [TIP_CLASS_NAME].concat(idArr).join(' ');
    tip.textContent = msg;
    append(fragment, tipDecorator(tip, opts));
    append(fragment, createEl('br'));
    return fragment;
}
function createTipBox(fragment) {
    var box = createEl('div');
    box.className = BOX_CLASS_NAME;
    box.style.color = settings.color || null;
    box.onclick = function () { return weakUp(box); };
    return append(box, fragment);
}
function weakUp(tipBox) {
    clearTimeout(sleepTimer);
    tipBox.classList.remove(BOX_SLEEP);
    setTimeout(sleep, WEAK_TIME, tipBox);
}
function sleep(tipBox) {
    tipBox.classList.add(BOX_SLEEP);
}
function tipDecorator(tipNode, opts) {
    // handle global option firstly
    if (settings.opacity != 0.75) {
        tipNode.style.backgroundColor = "rgba(0, 0, 0, " + settings.opacity + ")";
    }
    if (!opts)
        return tipNode;
    var color = opts.color, level = opts.level;
    if (color)
        tipNode.style.color = color;
    if (level)
        tipNode.dataset.level = level;
    return tipNode;
}
function renderTip(tipNode, idArr, msg, opts) {
    var tipBox = query("." + BOX_CLASS_NAME);
    var tipFragment = createTipFragment(idArr, msg, opts);
    if (tipNode) {
        tipNode.textContent = msg;
        return tipDecorator(tipNode, opts);
    }
    if (tipBox) {
        append(tipBox, tipFragment);
        // scroll to bottom
        tipBox.scrollTop = tipBox.scrollHeight;
        weakUp(tipBox);
    }
    else {
        var box = createTipBox(tipFragment);
        append(document.body, box);
    }
    return query("." + idArr.join(' .'));
}
function wintipFactory(name, tipNode, opts) {
    var tipFn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var idArr = likeNumber(name)
            ? [getNewTipId()]
            : [getNewTipId(), getNewTipId(name)];
        var isRender = checkDisplayLevel(opts.level) && args.length;
        return isRender
            ? renderTip(tipNode || query("." + getNewTipId(name)), idArr, joinWithSpace(args, likeNumber(name) ? '' : name), opts)
            : null;
    };
    tipFn['__name'] = name;
    return tipFn;
}
winTip.remove = function (tip) {
    if (!tip)
        return;
    var node;
    if (isElement(tip)) {
        node = tip;
    }
    else if (isFunc(tip)) {
        node = query("." + getNewTipId(tip.__name));
    }
    else if (likeNumber(tip)) {
        node = querys("." + TIP_CLASS_NAME)[tip];
    }
    else {
        node = query("." + getNewTipId(tip));
    }
    if (!node)
        return;
    node.nextElementSibling && node.nextElementSibling.remove();
    node.remove();
};
winTip.config = function (opts) {
    settings = __assign({}, settings, opts);
    // consoleProxy is 'debug' level
    consoleProxy(checkDisplayLevel('debug') && !!settings.console);
};
winTip.$ = function (name, opts) {
    if (opts === void 0) { opts = {}; }
    if (name && typeof name === 'object')
        return wintipFactory('', null, name);
    var tipNode = query("." + getNewTipId(name));
    if (likeNumber(name) && !tipNode) {
        throw new Error("[wintip]: name " + name + " is not defined");
    }
    return wintipFactory(("" + name).trim(), tipNode, opts);
};
// sugas
winTip.info = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return winTip.$({ level: 'info' }).apply(winTip, args);
};
winTip.warn = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return winTip.$({ color: WARN_COLOR, level: 'warn' }).apply(winTip, args);
};
winTip.error = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return winTip.$({ color: ERROR_COLOR, level: 'error' }).apply(winTip, args);
};
winTip.version = '1.5.0';

export default winTip;
