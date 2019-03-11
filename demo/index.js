import InlineSvg from '../src/index.js';

new Vue({
    el: "#app",
    components: {
        InlineSvg,
    },
    data() {
        return {
            currentIcon: 'firefox',
            currentSize: '150',
        }
    },
});