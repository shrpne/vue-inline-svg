// eslint-disable-next-line import/extensions
import InlineSvg from '../src/index.js';

new Vue({
    el: '#app',
    components: {
        InlineSvg,
    },
    data() {
        return {
            currentIcon: 'firefox',
            currentSize: '150',
            currentTransform: 'none',
        };
    },
    computed: {
        currentTitle() {
            return this.currentIcon[0].toUpperCase() + this.currentIcon.substr(1) + ' Logo';
        },
    },
    methods: {
        logClick() {
            console.log('click');
        },
        logError(e) {
            console.log('Error loading index.html');
            console.log(e);
        },
        logLoaded(el, id) {
            console.log('loaded', {id, el});
            console.log(document.querySelector(`#${id}`));
        },
        transform(el) {
            if (this.currentTransform === 'none') {
                return el;
            }

            for (let node of el.children) {
                node.setAttribute('fill', this.currentTransform === 'black' ? '#000' : 'green')
            }
            // const nodeList = el.querySelectorAll('path, stop')
            // let i = 0;
            // for (let node of nodeList) {
            //     i++;
            //     if (i % 2 === 1) {
            //         console.log(node)
            //         for (const attr of node.attributes) {
            //             if (/^#\d\d\d\d\d\d$/.test(attr.value)) {
            //                 console.log(attr)
            //                 node.setAttribute(attr.name, '#000')
            //             }
            //         }
            //     }
            // }
            console.log(el)
            return el;
        },
    },
});
