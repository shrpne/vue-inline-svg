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
    },
    render(createElement) {
        let self = this;
        return createElement('div', [
            createElement('div', [
                createElement(InlineSvg, {
                    attrs: {
                        src: `./img/${self.currentIcon}.svg`,
                        width: 150,
                        height: 150,
                    },
                    on: {
                        click: this.logClick,
                    },
                }),
                createElement(InlineSvg, {
                    attrs: {
                        src: `./img/${self.currentIcon}.svg`,
                        width: self.currentSize,
                        height: self.currentSize,
                    },
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
                    attrs: {
                        type: 'radio',
                        name,
                        value,
                    },
                    on: {
                        input: (event) => {
                            self[dataName] = event.target.value;
                        },
                    },
                }),
                value.toString(),
            ]);
        }
    },
});
