# vue-grouped-reveal
 Scroll reveal with dynamic grouping feature


## Install

```bash
npm i vue vue-grouped-reveal --save
```

```js
import Vue from 'vue';
import groupedReveal from 'vue-grouped-reveal';

Vue.use(groupedReveal)
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