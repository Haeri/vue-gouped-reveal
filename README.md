# vue-grouped-reveal
Scroll reveal plugin for Vue.js with a dynamic grouping feature.

All elements from the same group will be automatically revealed sequentially. The sequencing is dynamically generated and therefore allows for different breakpoint configurations.

## Example
[Demo Page](https://haeri.github.io/vue-grouped-reveal)


## Install

```bash
npm i vue vue-grouped-reveal --save
```

### vue-grouped-reveal.js
```js
import Vue from 'vue';
import groupedReveal from 'vue-grouped-reveal';

// optional
import 'vue-grouped-reveal/style.css';

Vue.use(groupedReveal);
```

### (nuxt.config.js)
```js
module.exports = {
  plugins: [
    '~/plugins/vue-grouped-reveal.js',
  ]
}
```

## Usage

### No grouping
```html
<div v-grouped-reveal></div>
```

### Group by name
```html
<div v-grouped-reveal="{group: 'GroupName'}"></div>
```

## Options
```js
import Vue from 'vue';
import groupedReveal from 'vue-grouped-reveal';

Vue.use(groupedReveal, {
  paddingTop: 100,      // Reveal trigger from the top down in pixels
  paddingBottom: 100,   // Reveal trigger from the bottom up in pixels
  interval: 200,        // Amount of milliseconds to delay the reveal of next element in group
  once: true,           // Reveal more than once
});
```

## Default CSS
```css
.grouped-reveal{
  transition: 0.4s;
}
.grouped-reveal.unrevealed{
  opacity: 0;
}
.grouped-reveal.unrevealed.above{
  transform: translateY(-40px);
}
.grouped-reveal.unrevealed.below{
  transform: translateY(40px);
}
.grouped-reveal.revealed{
  opacity: 1;
  transform: translateY(0px);
}
```