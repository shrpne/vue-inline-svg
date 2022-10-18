# Vue Inline SVG

[![NPM Package](https://img.shields.io/npm/v/vue-inline-svg.svg?style=flat-square)](https://www.npmjs.org/package/vue-inline-svg)
[![Minified Size](https://img.shields.io/bundlephobia/min/vue-inline-svg.svg?style=flat-square)](https://bundlephobia.com/result?p=vue-inline-svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/shrpne/vue-inline-svg/blob/master/LICENSE)

Vue component loads an SVG source dynamically and inline `<svg>` so you can manipulate the style of it with CSS or JS.
It looks like basic `<img>` so you markup will not be bloated with SVG content.
Loaded SVGs are cached so it will not make network request twice.

[ci-img]:  https://travis-ci.org/shrpne/vue-inline-svg.svg
[ci]:      https://travis-ci.org/shrpne/vue-inline-svg


- [Install](#install)
  - [NPM](#npm)
  - [CDN](#cdn)
  - [Vue 3](#vue-v3)
- [Usage](#usage)
  - [props](#props)
    - [src](#--src)
    - [title](#--title)
    - [keepDuringLoading](#--keepduringloading)
    - [transformSource](#--transformsource)
  - [SVG attributes](#svg-attributes)
  - [events](#events)
    - [loaded](#--loaded)
    - [unloaded](#--unloaded)
    - [error](#--error)
- [Comparison](#comparison)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)


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

Or register globally in the Vue app
```js
import { createApp } from 'vue'
import InlineSvg from 'vue-inline-svg';

const app = createApp({/*...*/});
app.component('inline-svg', InlineSvg);
```


### CDN

```html
<script src="https://unpkg.com/vue"></script>
<!-- Include the `vue-inline-svg` script on your page after Vue script -->
<script src="https://unpkg.com/vue-inline-svg"></script>

<script>
const app = Vue.createApp({/*...*/});
app.component('inline-svg', VueInlineSvg);
</script>
```

### Vue v3

Version of `vue-inline-svg` with support of Vue v3 is available under `next` tag
from NPM
```bash
npm install vue-inline-svg@next
```
or from CDN
```html
<script src="https://unpkg.com/vue-inline-svg@next"></script>
```


## Usage

```html
<inline-svg 
    src="image.svg" 
    transformSource="transformSvg"
    @loaded="svgLoaded($event)"
    @unloaded="svgUnloaded()"
    @error="svgLoadError($event)"
    width="150" 
    height="150"
    fill="black"
    aria-label="My image"
></inline-svg>
``` 
[Example](https://github.com/shrpne/vue-inline-svg/blob/master/demo/index.html)


### props
#### - `src`
Path to SVG file

```html
<inline-svg src="/my.svg"/>
```

Note: if you use vue-loader assets or vue-cli, then paths like '../assets/my.svg' will not be handled by file-loader automatically like vue-cli do for `<img>` tag, so you will need to use it with `require`:
```html
<inline-svg :src="require('../assets/my.svg')"/>
```
Learn more:
- https://vue-loader.vuejs.org/guide/asset-url.html#transform-rules
- https://cli.vuejs.org/guide/html-and-static-assets.html#static-assets-handling


#### - `title`
Sets/overwrites the `<title>` of the SVG

```html
<inline-svg :src="image.svg" title="My Image"/>
```


#### - `keepDuringLoading`
`true` by default. It makes vue-inline-svg to preserve old image visible, when new image is being loaded. Pass `false` to disable it and show nothing during loading.

```html
<inline-svg :src="image.svg" :keepDuringLoading="false"/>
```

#### - `transformSource`
Function to transform SVG source
 
This example create circle in svg:
```html
<inline-svg :src="image.svg" :transformSource="transform"/>

<script>
const transform = (svg) => {
    let point = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        point.setAttributeNS(null, 'cx', '20');
        point.setAttributeNS(null, 'cy', '20');
        point.setAttributeNS(null, 'r', '10');
        point.setAttributeNS(null, 'fill', 'red');
        svg.appendChild(point);
    return svg;
}
// For cleaner syntax you could use https://github.com/svgdotjs/svg.js
</script>
```


### SVG attributes
Other SVG and HTML attributes will be passed to inlined `<svg>`. Except attributes with `false` or `null` value.
```html
<!-- input -->
<inline-svg 
    fill-opacity="0.25" 
    :stroke-opacity="myStrokeOpacity"
    :color="false"        
></inline-svg>

<!-- output -->
<svg fill-opacity="0.25" stroke-opacity="0.5"></svg>
``` 


### events
#### - `loaded`
Called when SVG image is loaded and inlined.
Inlined SVG element passed as argument into the listener’s callback function.
```html
<inline-svg @loaded="myInlinedSvg = $event"/>
```

#### - `unloaded`
Called when `src` prop was changed and another SVG start loading.
```html
<inline-svg @unloaded="handleUnloaded()"/>
```

#### - `error`
Called when SVG failed to load.
Error object passed as argument into the listener’s callback function.
```html
<inline-svg @error="log($event)"/>
```

## Comparison

- This module: [![Minified Size](https://img.shields.io/bundlephobia/min/vue-inline-svg.svg?style=flat-square)](https://bundlephobia.com/result?p=vue-inline-svg)
- [vue-simple-svg](https://github.com/seiyable/vue-simple-svg): [![Minified Size](https://img.shields.io/bundlephobia/min/vue-simple-svg.svg?style=flat-square)](https://bundlephobia.com/result?p=vue-simple-svg), does not cache network requests, has wrapper around svg, attrs passed to `<svg>` are limited, converts `<style>` tag into `style=""` attr
- [svg-loader](https://github.com/visualfanatic/vue-svg-loader) uses different approach, it inlines SVG during compilation. It has pros that SVG is prerendered and no http request needed. But also it has cons that markup size grows, especially if you have same image repeated several times. (Discussed in [#11](https://github.com/shrpne/vue-inline-svg/issues/11))


## Changelog
[CHANGELOG.md](https://github.com/shrpne/vue-inline-svg/blob/master/CHANGELOG.md)


## Contributing
[CONTRIBUTING.md](https://github.com/shrpne/vue-inline-svg/blob/master/CONTRIBUTING.md)


## License

MIT License
