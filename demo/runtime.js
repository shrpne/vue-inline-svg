const createElement = window.Vue.h;
const InlineSvg = window.VueInlineSvg;

const App = {
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
    },
    render() {
        let self = this;
        return createElement('div', [
            createElement('div', [
                createElement(InlineSvg, {
                    src: `./img/${self.currentIcon}.svg`,
                    width: 150,
                    height: 150,
                    onClick: this.logClick,
                }),
                createElement(InlineSvg, {
                    src: `./img/${self.currentIcon}.svg`,
                    width: self.currentSize,
                    height: self.currentSize,
                }),
            ]),
            createElement('div', [
                makeRadio('icon', 'firefox', 'currentIcon'),
                makeRadio('icon', 'safari', 'currentIcon'),
            ]),
            createElement('div', [
                makeRadio('size', '150', 'currentSize'),
                makeRadio('size', '100', 'currentSize'),
            ]),
        ]);

        /**
         * @param {string} name
         * @param {string|number} value
         * @param {string} dataName
         * @returns {*}
         */
        function makeRadio(name, value, dataName) {
            return createElement('label', [
                createElement('input', {
                    type: 'radio',
                    name,
                    value,
                    onInput: (event) => {
                        self[dataName] = event.target.value;
                    },
                }),
                value.toString(),
            ]);
        }
    },
};

window.Vue.createApp(App).mount('#app');
