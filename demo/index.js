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
        };
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
            console.log(id)
            console.log(el)
            console.log(document.querySelector(`#${id}`));
        },
    },
});
