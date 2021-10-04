/*
Based on:
https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/chenfengyuan__vue-qrcode/index.d.ts
https://github.com/DefinitelyTyped/DefinitelyTyped/blob/aa5c66c087896ff55568b76ae49f77321ba0123a/types/vue-datetime/index.d.ts
*/


import { VueConstructor } from 'vue';

interface InlineSvgProps {
    src: string;
    title: string;
    transformSource: (svg: string) => string;
    keepDuringLoading: boolean;
}

interface InlineSvgConstructor extends VueConstructor {
    props: InlineSvgProps;
}

declare const InlineSvg: InlineSvgConstructor;
export = InlineSvg;
