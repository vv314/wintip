# wintip

Simple console tools for Webview debugging.

## Install

```html
<script src="https://unpkg.com/wintip/dist/wintip.min.js"></script>
```

or

```bash
yarn add wintip
```

or

```bash
npm install wintip --save
```

## Usage

```javascript
import wintip from 'wintip'

wintip('hello wintip')  /** 1 **/

// equals above
wintip('hello', 'wintip')

// object will be serialized by JSON.stringify
wintip('My name is', {name: 'wintip'})

// named tip
wintip.$('foo')('old message')

// modify named tip
wintip.$('foo')('new message')

// remove [1]
wintip.remove(1)

// remove by name
wintip.remove('foo')
```

## API

### wintip(msg)

Basic usage, create a tip
```javascript
wintip('something')

// return element node
const tip = wintip('message')

tip.textContent = 'new message'

// console.log like
wintip('My', 'name', 'is', 'wintip')

wintip(tip)
```

### wintip.config(options)

Global config

```javascript
wintip.config({
  output: true,  // if false, hidding all tips
  opacity: 0.8,  // background opacity
  color: '#fff'  // text color
})
```

### wintip.$(name)

Create a tip with  name

```javascript
// return a function
const fooTip = wintip.$('foo')

fooTip('My name is foo')

fooTip('rewrite something else')

// create new tip and set text
wintip.$('bar')('My name is bar')
```

### wintip.remove(tip)

Remove a tip

```javascript
wintip('first tip')
wintip.$('foo')('foo tip')
const tip = wintip('bar')

// remove first tip
wintip.remove(1)

// remove the tip named foo
wintip.remove('foo')

// remove tip node
wintip.remove(tip)
```

### Options

The param of `wintip.config`

#### options.output

`Boolean` If `false`, all tips will be hidden

#### options.color

`String` Text color, default `#fff`


#### options.opacity

`Number` Background color, default `0.75`


