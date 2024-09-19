## 3.1.4 - 2024-09-17
- Fix types

## 3.1.3 - 2024-06-11
- Save request object in component data

## 3.1.2 - 2023-02-07
- Fix Webpack and vue-cli import

## 3.1.1 - 2023-02-04
- Fix <title> position: prepend instead of append (#48)
- Fix `transformSource` .d.ts types (in #50)

## 3.1.0 - 2021-10-04
- Add .d.ts types

## 3.0.0 - 2020-07-28
- Add: Vue v3 support
- **BREAKING**: remove named exports. Only default export of the component is remained. UMD build now expose `VueInlineSvg` variable representing component.

## 2.1.4 - 2024-06-11
- Save request object in component data

## 2.1.3 - 2023-02-07
- Fix Webpack and vue-cli import

## 2.1.2 - 2023-02-04
- Fix <title> position: prepend instead of append (#48)
- Fix `transformSource` .d.ts types (in #50)

## 2.1.1 - 2022-10-18
- Fix .d.ts. types to support named exports

## 2.1.0 - 2021-10-04
- Add .d.ts types

## 2.0.0 - 2020-07-25
- Add: `title` prop
- Fix: `transform-source` to react on property change and not to only transform on initial load
- **BREAKING**: `transform-source` now doesn't affect resulting SVG's attributes, use attrs on the component instead
- **BREAKING** Add: `keep-during-loading` prop, `true` by default. It makes vue-inline-svg to preserve old image visible, when new image is being loaded. Pass `false` to disable it and switch to old behaviour.

## 1.3.1 - 2020-05-08
- Add: `browser` field to package.json. No more extra Webpack configuration is needed by default.

## 1.3.0 - 2020-03-23
- Fix: `@loaded` event fired to early (it was fired on SVG load, not on component render)
- Add: pass SVG element as argument to the `@loaded` callback

## 1.2.0 - 2019-11-26
- Add: `transformSource` prop [#9](https://github.com/shrpne/vue-inline-svg/pull/9)

## 1.1.3 - 2019-09-06
- Fixed: don't fail on invalid SVG file parse
- Fixed: update component attrs now correctly launch component rerender
- Refactor: don't patch innerHTML manually, but use render function's domProps
- Add: emit `Error` on error

## 1.1.2 - 2019-08-22
- Fixed: now listeners correctly passes [#4](https://github.com/shrpne/vue-inline-svg/pull/4)

## 1.1.1 - 2019-03-18
- Fixed: don't use Vue's merge attrs logic

## 1.1.0 - 2019-03-18
- Added: don't pass attrs with `false` value to `<svg>`


## 1.0.0 - 2019-03-17
- Initial release
