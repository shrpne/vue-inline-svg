# Vue Inline SVG

[![NPM Package](https://img.shields.io/npm/v/vue-inline-svg.svg?style=flat-square)](https://www.npmjs.org/package/vue-inline-svg)
[![Minified Size](https://img.shields.io/bundlephobia/min/vue-inline-svg.svg?style=flat-square)](https://bundlephobia.com/result?p=vue-inline-svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/shrpne/vue-inline-svg/blob/master/LICENSE)

Vue component loads an SVG source dynamically and inline `<svg>` so you can manipulate the style of it with CSS or JS.
It looks like basic `<img>` so you markup will not be bloated with SVG content.
Loaded SVGs are cached so it will not make network request twice.

[ci-img]:  https://travis-ci.org/shrpne/vue-inline-svg.svg
[ci]:      https://travis-ci.org/shrpne/vue-inline-svg


## Install

### NPM

```bash
npm install vue-inline-svg
```

Register locally in your component
```js
import InlineSvg from 'vue-inline-svg';

// Your component
export default {
    components: {
        InlineSvg,
    }
}
```

Or register globally in the root Vue instance
```js
import Vue from 'vue';

// as a plugin
import {InlineSvgPlugin} from 'vue-inline-svg';
Vue.use(InlineSvgPlugin);

// or as a component
import InlineSvg from 'vue-inline-svg';
Vue.component('inline-svg', InlineSvg);
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<!-- Include the `vue-inline-svg` script on your page after Vue script -->
<script src="https://unpkg.com/vue-inline-svg"></script>

<script>
// Register as a plugin
Vue.use(VueInlineSvg.InlineSvgPlugin);

// or as a component
Vue.component('inline-svg', VueInlineSvg.InlineSvgComponent);

new Vue({
// ...
});
</script>
```

## Usage

```html
<inline-svg 
    src="image.svg" 
    @loaded="svgLoaded()"
    @unloaded="svgUnloaded()"
    @error="svgLoadError()"
    width="150" 
    height="150"
    fill="black"
    aria-label="My image"
></inline-svg>
``` 
[Example](https://github.com/shrpne/vue-inlinse-svg/blob/master/demo/index.html)

### props
#### src
path to SVG file

Other attributes will be passed to inlined `<svg>`. Except attributes with `false` or `null` value.

### events
#### loaded
called when <svg> image is loaded and inlined

#### unloaded
called when `src` prop was changed and another svg start loading

#### error
called when svg failed to load

## Comparison

- This module: **1.5 kB minified**
- [`vue-simple-svg`](https://github.com/seiyable/vue-simple-svg): 21KB minified, does not cache network requests, has wrapper around svg, attrs passed to `<svg>` are limited, converts `<style>` tag into `style=""` attr


## License

MIT License
