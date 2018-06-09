/*!
 * wintip v1.5.0
 * (c) Vincent
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.wintip = factory());
}(this, (function () { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) { ref = {}; }
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
    return document.querySelector(selector)
  }

  function querys(selector) {
    return document.querySelectorAll(selector)
  }

  function createEl(tag) {
    return document.createElement(tag)
  }

  function likeNumber(value) {
    return !isNaN(Number(value))
  }

  function isElement(target) {
    // Element or Fragment
    return (
      (typeof target === 'object' && target.nodeType === 1) ||
      target.nodeType === 11
    )
  }

  function isFunc(target) {
    return typeof target === 'function'
  }

  function append(ele, dom) {
    ele = isElement(ele) ? ele : query(ele);
    ele.appendChild(dom);

    return ele
  }

  function space2dash(str) {
    return str.replace(/\s+/g, '_')
  }

  function stringify(obj) {
    try {
      return JSON.stringify(obj)
    } catch (e) {
      console.error('[wintip]', "can't print object", obj);
      return ''
    }
  }

  var BOX_CLASS_NAME = '_win_tip_box';
  var TIP_CLASS_NAME = '_win_tip';
  var TIP_ID_PREFIX = '_tip_';
  var BOX_SLEEP = '_win_tip_box--sleep';
  var TIP_FUNC_NAME = '__name';
  var WARN_COLOR = '#fee381';
  var ERROR_COLOR = '#ff4545';
  var WEAK_TIME = 30 * 1000;

  // start from 1
  var tipNo = 1;
  var sleepTimer = 0;
  var log = console.log;

  var settings = {
    // 'default', 'info', 'warn', 'error'
    output: 'default',
    console: false,
    opacity: 0.75,
    color: '#fff'
  };

  function consoleProxy(flag) {
    var mlog = function() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      winTip.apply(winTip, args);
      log.apply(console, args);
    };

    console.log = flag ? mlog : log;
  }

  function isShow(level) {
    if ( level === void 0 ) level = 'default';

    var ranking = ['default', 'info', 'warn', 'error'];
    var outputLevel =
      ranking.indexOf(settings.output) < 0
        ? ranking.length
        : ranking.indexOf(settings.output);

    return ranking.indexOf(level) >= outputLevel || settings.output === true
  }

  function winTip() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var idStr = getNewTipId();
    var tipNode = query(("." + idStr));
    var output = isShow('default') && args.length;

    // return a empty object({}) when output is false
    // normaly return a Element object
    return output ? renderTip(tipNode, [idStr], splitArgs(args)) : {}
  }

  function getNewTipId(name) {
    name = name === void 0 ? tipNo++ : name;

    return space2dash(TIP_ID_PREFIX + name)
  }

  function splitArgs(args, name) {
    var res = args
      .map(function (e) { return (typeof e === 'object' ? stringify(e) : ("" + e)); })
      .join(' ');

    return name ? ("[" + name + "] " + res) : res
  }

  function createTipFragment(idArr, msg, opts) {
    var fragment = document.createDocumentFragment();
    var tip = createEl('span');

    tip.className = [TIP_CLASS_NAME ].concat( idArr).join(' ');
    tip.textContent = msg;

    append(fragment, tipDecorator(tip, opts));
    append(fragment, createEl('br'));

    return fragment
  }

  function createTipBox(fragment) {
    var box = createEl('div');

    box.className = BOX_CLASS_NAME;
    box.style.color = settings.color;
    box.onclick = function () { return weakUp(box); };

    return append(box, fragment)
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
      tipNode.style.backgroundColor = "rgba(0, 0, 0, " + (settings.opacity) + ")";
    }

    if (!opts) { return tipNode }

    var color = opts.color;
    var level = opts.level;

    if (color) { tipNode.style.color = color; }

    if (level) { tipNode.dataset.level = level; }

    return tipNode
  }

  function renderTip(tipNode, idArr, msg, opts) {
    var tipBox = query(("." + BOX_CLASS_NAME));
    var tipFragment = createTipFragment(idArr, msg, opts);

    if (tipNode) {
      tipNode.textContent = msg;
      return tipDecorator(tipNode, opts)
    }

    if (tipBox) {
      append(tipBox, tipFragment);

      // scroll to bottom
      tipBox.scrollTop = tipBox.scrollHeight;
      weakUp(tipBox);
    } else {
      append(document.body, createTipBox(tipFragment));
    }

    return query(("." + (idArr.join(' .'))))
  }

  function wintipFactory(name, tipNode, opts) {
    function tipFn() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var idArr = likeNumber(name)
        ? [getNewTipId()]
        : [getNewTipId(), getNewTipId(name)];
      var output = isShow(opts.level) && args.length;

      return output
        ? renderTip(
            tipNode || query(("." + (getNewTipId(name)))),
            idArr,
            splitArgs(args, likeNumber(name) ? '' : name),
            opts
          )
        : null
    }

    tipFn[TIP_FUNC_NAME] = name;

    return tipFn
  }

  winTip.remove = function (tip) {
    if (!tip) { return }

    var node = isElement(tip)
      ? tip
      : isFunc(tip)
        ? query(("." + (getNewTipId(tip[TIP_FUNC_NAME]))))
        : likeNumber(tip)
          ? querys(("." + TIP_CLASS_NAME))[tip]
          : query(("." + (getNewTipId(tip))));

    if (!node) { return }

    node.nextElementSibling.remove();
    node.remove();
  };

  winTip.config = function (opts) {
    Object.assign(settings, opts);

    // consoleProxy is 'default' level
    consoleProxy(isShow('default') && settings.console);
  };

  winTip.$ = function (name, opts) {
    if ( opts === void 0 ) opts = {};

    if (name && typeof name === 'object') { return wintipFactory('', null, name) }

    var tipNode = query(("." + (getNewTipId(name))));

    if (likeNumber(name) && !tipNode) {
      throw new Error(("[wintip]: name " + name + " is not defined"))
    }

    return wintipFactory(("" + name).trim(), tipNode, opts)
  };

  // sugas
  winTip.info = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return winTip.$({ level: 'info' }).apply(winTip, args);
  };

  winTip.warn = function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return winTip.$({ color: WARN_COLOR, level: 'warn' }).apply(winTip, args);
  };

  winTip.error = function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return winTip.$({ color: ERROR_COLOR, level: 'error' }).apply(winTip, args);
  };

  winTip.version = '1.5.0';

  return winTip;

})));
