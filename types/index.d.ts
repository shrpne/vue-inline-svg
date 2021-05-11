import { VueConstructor } from 'vue';

interface InlineSvgProps {
    src: string;
    title: string;
    transformSource: (string) => string;
    keepDuringLoading: boolean;

}

interface InlineSvgConstructor extends VueConstructor {
    props: InlineSvgProps;
}

export const InlineSvg: InlineSvgConstructor;
export default InlineSvg;
