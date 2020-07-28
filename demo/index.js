const App = {
    components: {
        InlineSvg: window.VueInlineSvg,
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
        logClick(e) {
            console.log('click', e.currentTarget);
        },
        logError(e, id) {
            console.log(id, 'Error loading index.html', e);
        },
        logLoaded(el, id) {
            console.log('loaded', {id, el});
        },
        logUnloaded(id) {
            console.log('unloaded', id);
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
};

window.Vue.createApp(App).mount('#app');
