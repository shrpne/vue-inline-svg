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

#### Register locally in your component
```js
import InlineSvg from 'vue-inline-svg';

// Your component
export default {
    components: {
        InlineSvg,
    }
}
```

#### Or register globally in the Vue app
```js
import { createApp } from 'vue'
import InlineSvg from 'vue-inline-svg';

const app = createApp({/*...*/});
app.component('inline-svg', InlineSvg);
```
Usually, registering components globally may be considered as bad practice, such it may pollute the main bundle, but since InlineSvg is a very small package and inlining icons may be needed throughout the whole app, registering globally may bring no to little
downsides but improve DX


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


### Using relative paths or aliased paths

If you are referencing assets with relative path (not from `public` directory), e.g. "./assets/my.svg", "@/assets/my.svg", then `@vitejs/plugin-vue` or `@vue/cli` will not handle them automatically like they do for `<img>` tag, so you will need to manually import them with your bundler or configure automatic handling.


#### Configuring automatic handling with `@vitejs/plugin-vue`

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


#### Manual importing

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



#### Learn more about static assets handling:

- vite: https://vite.dev/guide/assets.html
- vite plugin vue: https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/README.md
- webpack's vue-loader: https://vue-loader.vuejs.org/guide/asset-url.html#transform-rules


### props
#### - `src`
Type: `string` **Required**

Path to SVG file

```html
<!-- from /public folder -->
<InlineSvg src="/my.svg"/>

<!-- from relative path -->
<InlineSvg src="./assets/img/my.svg"/>

<!-- from aliased path -->
<InlineSvg src="@/assets/img/my.svg"/>
<InlineSvg src="~/assets/img/my.svg"/>
```

[Note on relative and aliased paths](#using-relative-paths-or-aliased-paths)


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

## Alternative approaches

- [vite-svg-loader](https://www.npmjs.com/package/vite-svg-loader), webpack's [vue-svg-loader](https://github.com/visualfanatic/vue-svg-loader). These tools embed SVG content directly into the JS bundle during compilation. **Pros**: SVG is bundled, eliminating the need for separate HTTP requests. **Cons**: Increased bundle size can delay the execution of more critical JS tasks. Additionally, each icon will be parsed multiple times: first as JS and then as HTML when inserted into the document (JS parsing is resource-intensive). Further reading on the [cons of SVG-in-JS](https://kurtextrem.de/posts/svg-in-js#performance-deep-dive-why-svg-in-js-is-an-anti-pattern)

- The `<svg><use href="my.svg#icon1"/></svg>` approach requires no JS, that is great, but it has several disadvantages:
  - may be not very convenient, it requires referencing IDs, updating SVG `fill`'s with `currentColor`. May be hard to manipulate other things except the main color. While DX can be improved with [@svg-use](https://fotis.xyz/posts/introducing-svg-use/)
  - doesn't support cross-origin resources
  - doesn't support embedded `<style>`, `<mask>`, `<clipPath>`, `<animate>`, `<animateMotion>`, `<animateTransform>` tags

- inlining with `vue-inline-svg`. As cons, it requires some JS, but very little, only for the component itself. Icons are loaded separately from the JS bundle, so they are not available instantly after JS is loaded, but it can also be seen as an advantage, as it leads to faster JS bundle load. Inlining offers maximum flexibility on par with SVG-in-JS. Overall, it has excellent DX: if the component will be [registered globally](#or-register-globally-in-the-vue-app) and automatic asset handling will be [configured](#configuring-automatic-handling-with-vitejsplugin-vue), then usage will be as easy as a simple
  `<img>`


## Changelog
[CHANGELOG.md](https://github.com/shrpne/vue-inline-svg/blob/master/CHANGELOG.md)


## Contributing
[CONTRIBUTING.md](https://github.com/shrpne/vue-inline-svg/blob/master/CONTRIBUTING.md)


## License

MIT License
