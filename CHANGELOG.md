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
