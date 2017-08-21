# Wintip

Simple console tools for Webview debugging.

[![Travis](https://img.shields.io/travis/vv314/wintip.svg?style=flat-square)](https://travis-ci.org/vv314/wintip) [![npm](https://img.shields.io/npm/dw/wintip.svg?style=flat-square)](https://www.npmjs.com/package/wintip) [![npm](https://img.shields.io/npm/v/wintip.svg?style=flat-square)](https://www.npmjs.com/package/wintip) [![npm](https://img.shields.io/npm/l/wintip.svg?style=flat-square)](https://opensource.org/licenses/MIT)

![wintip](https://raw.githubusercontent.com/vv314/wintip/master/screenshots/wintip.png)

## Installation

```bash
yarn add wintip
```

or

```bash
npm install wintip
```

also

```html
<script src="https://unpkg.com/wintip/dist/wintip.min.js"></script>
```

## Usage

```javascript
import wintip from 'wintip'

wintip('Hello wintip')

// Pass multiple parameters
wintip('How', 'are', 'you')

// Customize the tip color
const colorTip = wintip.$({color: 'yellow'})

colorTip('I am yellow')
colorTip('I am yellow too!')
```

### Log level

You can specify different levels of wintips by the following methods, and use the   **`output`**  option of the `wintip.config` method to control the output level of the wintip.

- **wintip.info**: info-level logs
- **wintip.warn**: warn-level logs
- **wintip.error**: error-level logs

```javascript
wintip('default level messages')

wintip.info('info level messages')

wintip.warn('warn level messages')

wintip.error('error level messages')
```

## API

### wintip(msg1 [, msg2, ..., msgN)

Basic function, create a tip on the window.

```javascript
wintip('something')

wintip('hello', 'wintip')

// Object will be serialized
wintip('stringify', {a: 1})

// Return DOM node
const tip = wintip('message')

tip.textContent = 'new message'
```

### wintip.info(msg1 [, msg2, ..., msgN)

Show info-level wintips

### wintip.warn(msg1 [, msg2, ..., msgN)

Show warn-level wintips, text color is *#fee381*

### wintip.error(msg1 [, msg2, ..., msgN)

Show error-level wintips, text color is *#ff4545*

### wintip.config(opts)

- **output** { `String` } Control display level, default `'default'`.
- **console** { `Boolean` } Proxy console.log method, default `false`
- **opacity** { `Number` } Background opacity, range `0~1`, default `0.75`.
- **color** { `String` } base color of the tip, default `'#fff'`, expect `HEX` or `RGB` string.

Global config. Please put it in your entry file or in the main file.

```javascript
import wintip from 'wintip'

wintip.config({
  // 'default', 'info', 'warn', 'error'
  output: false,  // Hidding all tips
  color: '#fff'  // Expect `HEX` or `RGB` string.
})
```

### wintip.$(opts)
- **color** { `String` } specify the tip color, expect `HEX` or `RGB` value.

Create a tip with options.

```javascript
const yellowTip = wintip.$({color: 'yellow'})
const orangeTip = wintip.$({color: 'orange'})

orangeTip('I am orange')
yellowTip('I am yellow')
yellowTip('I am yellow too!')

// Quick usage
wintip.$({color: 'green'})('balabala')
```

### wintip.$(name [, opts])

- **name** { `String` | `Number` } name of the tip.
- **opts** { `Object` }  optional.
    - **color** { `String` } specify the tip color, expect `HEX` or `RGB` value.
    - **level** {`String`} log level: 'default', 'info', 'warn', 'error'


Create a tip with names and options(optional).
Note: the named tip can be reused.

```javascript
// Return a tip function
const fooTip = wintip.$('foo')

fooTip('origin message')

fooTip('Rewrite new message in the same place')

// Quick usage
wintip.$('bar')('balabala')
```

### wintip.remove(target)

Remove a tip

```javascript
wintip('first tip')
wintip.$('foo')('foo tip')
const tip = wintip('bar')

// Remove first tip in window
wintip.remove(1)

// Remove the tip named foo
wintip.remove('foo')

// Remove tip node
wintip.remove(tip)
```

## License

[MIT](https://opensource.org/licenses/MIT)
