/*
Based on:
https://github.com/Vuepic/vue3-date-time-picker/blob/cfb1c8e06b8dffcca247af6f63f8ef0a6cb6df7e/index.d.ts
https://github.com/egoist/vue-dts-gen/blob/4fe43d024b0318a37a30a6b47a718cf91085958c/examples/normal.d.ts
*/

import { DefineComponent, ComponentOptionsMixin, VNodeProps, AllowedComponentProps, ComponentCustomProps } from 'vue';

interface InlineSvg {
    src: string;
    title?: string;
    transformSource?: (svg: SVGElement) => SVGElement;
    keepDuringLoading?: boolean;
}

declare const _default: DefineComponent<
    InlineSvg,
    unknown,
    unknown,
    {},
    {},
    ComponentOptionsMixin,
    ComponentOptionsMixin,
    Record<string, any>,
    string,
    VNodeProps & AllowedComponentProps & ComponentCustomProps,
    InlineSvg
>;
export default _default;
