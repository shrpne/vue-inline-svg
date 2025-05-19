# Vue Inline SVG

[![NPM Package](https://img.shields.io/npm/v/vue-inline-svg.svg?style=flat-square)](https://www.npmjs.org/package/vue-inline-svg)
[![Minified Size](https://img.shields.io/bundlephobia/min/vue-inline-svg.svg?style=flat-square)](https://bundlephobia.com/result?p=vue-inline-svg)
[![Gzipped Size](https://img.shields.io/bundlephobia/minzip/vue-inline-svg.svg?style=flat-square)](https://bundlephobia.com/result?p=vue-inline-svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/shrpne/vue-inline-svg/blob/master/LICENSE)

Vue component loads an SVG source dynamically and inline `<svg>` so you can manipulate the style of it with CSS or JS.
It looks like basic `<img>` so you markup will not be bloated with SVG content.
Loaded SVGs are cached so it will not make network request twice.

### Using Vue v2?
Check old version [vue-inline-svg@2](https://github.com/shrpne/vue-inline-svg/tree/v2?tab=readme-ov-file#vue-inline-svg)

[ci-img]:  https://travis-ci.org/shrpne/vue-inline-svg.svg
[ci]:      https://travis-ci.org/shrpne/vue-inline-svg


- [Install](#install)
  - [NPM](#npm)
  - [CDN](#cdn)
- [Usage](#usage)
  - [props](#props)
    - [src](#--src)
    - [title](#--title)
    - [uniqueIds](#--uniqueids)
    - [uniqueIdsBase](#--uniqueidsbaase)
    - [keepDuringLoading](#--keepduringloading)
    - [transformSource](#--transformsource)
  - [SVG attributes](#svg-attributes)
  - [events](#events)
    - [loaded](#--loaded)
    - [unloaded](#--unloaded)
    - [error](#--error)
- [Security Considerations](#-security-considerations)
  - [SVGs from your project assets](#1-svgs-from-your-project-assets)
  - [SVGs from third-party sources](#2-svgs-from-third-party-sources-or-user-generated-content)
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


## Usage

```html
<InlineSvg
    src="image.svg"
    transformSource="transformSvg"
    @loaded="svgLoaded($event)"
    @unloaded="svgUnloaded()"
    @error="svgLoadError($event)"
    width="150"
    height="150"
    fill="black"
    aria-label="My image"
/>
```
[Example](https://github.com/shrpne/vue-inline-svg/blob/master/demo/index.html)


### props
#### - `src`
Type: `string` **Required**

Path to SVG file

```html
<InlineSvg src="/my.svg"/>
```

ℹ️ **Note**: if you are referencing assets with relative path (not from `public` directory), e.g. "./assets/my.svg", "@/assets/my.svg", then `@vitejs/plugin-vue` or `@vue/cli` will not handle them automatically like they do for `<img>` tag, so you will need to import them with your bundler or configure automatic handling.


##### Manual importing
```html
<!-- vite -->
<script>
    import imgUrl from '@/assets/img/my.svg';
</script>
<InlineSvg :src="imgUrl"/>

<!-- webpack -->
<InlineSvg :src="require('@/assets/img/my.svg')"/>
```

You might also like [vite-plugin-require](https://www.npmjs.com/package/vite-plugin-require) to enable `require()` in Vite.

##### Configuring automatic handling with `@vitejs/plugin-vue`
```js
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    // default options
                    video: ['src', 'poster'],
                    source: ['src'],
                    img: ['src'],
                    image: ['xlink:href', 'href'],
                    use: ['xlink:href', 'href'],
                    // adding InlineSvg component with camel and kebab casing
                    InlineSvg: ['src'],
                    ['inline-svg']: ['src'],
                },
            },
        }),
    ],
});
```

```html
<!-- So this will work-->
<InlineSvg src="@/assets/img/my.svg"/>
```

Learn more about static assets handling:
- vite: https://vite.dev/guide/assets.html
- vite plugin vue: https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/README.md
- webpack's vue-loader: https://vue-loader.vuejs.org/guide/asset-url.html#transform-rules


#### - `title`
Type: `string`

Sets/overwrites the `<title>` of the SVG

```html
<InlineSvg src="image.svg" title="My Image"/>
```


#### - `uniqueIds`
Type: `boolean | string`

Add suffix to all IDs in SVG to eliminate conflicts for multiple SVGs with the same source. If `true` - suffix is random string, if `string` - suffix is this string.

```html
<InlineSvg src="image.svg" :uniqueIds="true"/>
<InlineSvg src="image.svg" uniqueIds="my-unique-suffix"/>
```


#### - `uniqueIdsBase`
Type: `string`

An URL to prefix each ID in case you use the `<base>` tag and `uniqueIds`.

```html
<InlineSvg src="image.svg" :uniqueIds="true" uniqueIdsBase="http://example.com""/>
```


#### - `keepDuringLoading`
Type: `boolean`; Default: `true`

It makes vue-inline-svg to preserve old image visible, when new image is being loaded. Pass `false` to disable it and show nothing during loading.

```html
<InlineSvg src="image.svg" :keepDuringLoading="false"/>
```


#### - `transformSource`
Type: `(svg: SVGElement) => SVGElement`

Function to transform SVG content

This example create circle in svg:
```html
<InlineSvg src="image.svg" :transformSource="transform"/>

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
<InlineSvg
    fill-opacity="0.25"
    :stroke-opacity="myStrokeOpacity"
    :color="false"
/>

<!-- output -->
<svg fill-opacity="0.25" stroke-opacity="0.5"></svg>
```


### events
#### - `loaded`
Called when SVG image is loaded and inlined.
Inlined SVG element passed as argument into the listener’s callback function.
```html
<InlineSvg @loaded="myInlinedSvg = $event"/>
```

#### - `unloaded`
Called when `src` prop was changed and another SVG start loading.
```html
<InlineSvg @unloaded="handleUnloaded()"/>
```

#### - `error`
Called when SVG failed to load.
Error object passed as argument into the listener’s callback function.
```html
<InlineSvg @error="log($event)"/>
```

## 🛡️ Security Considerations

Inlining SVGs directly into the DOM provides flexibility for styling and interaction. However, it can pose risks of XSS (Cross-Site Scripting) attacks. SVGs can contain JavaScript (`<script>` tags), event handlers (`onload`, `onclick`, etc.), or external references (`<use xlink:href="..."`), which could be exploited.

To ensure security, follow these guidelines based on your SVG source:

### 1️⃣ SVGs from your project assets
Manually check they don't contain any harmful elements or attributes (scripts, event handlers, external references)

### 2️⃣ SVGs from third-party sources or user-generated content

Always sanitize before inlining. Use [DOMPurify](https://github.com/cure53/DOMPurify)

```html
<InlineSvg
    src="https://example.com/external.svg"
    :transformSource="sanitize"
/>

<script>
    import DOMPurify from 'dompurify';

    function sanitize(svg) {
        svg.innerHTML = DOMPurify.sanitize(svg.innerHTML, { USE_PROFILES: { svg: true } });
        return svg;
    }
</script>
```

## Comparison

- This module: [![Minified Size](https://img.shields.io/bundlephobia/min/vue-inline-svg.svg?style=flat-square)](https://bundlephobia.com/result?p=vue-inline-svg)
- [vue-simple-svg](https://github.com/seiyable/vue-simple-svg): [![Minified Size](https://img.shields.io/bundlephobia/min/vue-simple-svg.svg?style=flat-square)](https://bundlephobia.com/result?p=vue-simple-svg), does not cache network requests, has wrapper around svg, attrs passed to `<svg>` are limited, converts `<style>` tag into `style=""` attr
- [vite-svg-loader](https://www.npmjs.com/package/vite-svg-loader), webpack's [vue-svg-loader](https://github.com/visualfanatic/vue-svg-loader). They use different approach, they inline SVG during compilation. It has pros that SVG is bundled and no http request needed. But also it has cons that bundle size grows (or markup size if prerendered,
  especially if you have same image repeated several times). (Discussed in [#11](https://github.com/shrpne/vue-inline-svg/issues/11))


## Changelog
[CHANGELOG.md](https://github.com/shrpne/vue-inline-svg/blob/master/CHANGELOG.md)


## Contributing
[CONTRIBUTING.md](https://github.com/shrpne/vue-inline-svg/blob/master/CONTRIBUTING.md)


## License

MIT License
