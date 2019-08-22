/** @type Object{string: Promise<Element>} */
const cache = {};

/**
 * Remove false attrs
 * @param {Object} attrs
 */
function filterAttrs(attrs) {
    return Object.keys(attrs).reduce((result, key) => {
        if (attrs[key] !== false && attrs[key] !== null && attrs[key] !== undefined) {
            result[key] = attrs[key];
        }
        return result;
    }, {});
}


const InlineSvgComponent = {
    // name: 'inline-svg',
    inheritAttrs: false,
    render(createElement) {
        if (!this.isLoaded) {
            return null;
        }
        return createElement(
            'svg',
            {
            	on: this.$listeners,
                attrs: Object.assign(this.svgAttrs, filterAttrs(this.$vnode.data.attrs)),
            },
        );
    },
    props: {
        src: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            isLoaded: false,
            svgAttrs: {},
        };
    },
    mounted() {
        // generate inline svg
        this.inline(this.src);
    },
    watch: {
        src(newValue) {
            // re-generate inline svg
            this.inline(newValue);
        },
    },
    methods: {
        /**
         * Replace image with loaded svg
         * @param {string} src
         */
        inline(src) {
            // fill cache by src with promise
            if (!cache[src]) {
                // notify svg is unloaded
                if (this.isLoaded) {
                    this.isLoaded = false;
                    this.$emit('unloaded');
                }
                // download
                cache[src] = this.download(src)
                    .catch(() => {
                        // remove cached rejected promise so next image can try load again
                        delete cache[src];
                        this.$emit('error');
                    });
            }

            // inline svg when cached promise resolves
            cache[src].then((svg) => {
                // copy attrs
                this.svgAttrs = {};
                const attrs = svg.attributes;
                for (let i = attrs.length - 1; i >= 0; i--) {
                    this.svgAttrs[attrs[i].name] = attrs[i].value;
                }
                // render svg element
                this.isLoaded = true;
                // wait for render complete
                this.$nextTick(() => {
                    // copy inner html
                    this.$el.innerHTML = svg.innerHTML;
                    // notify
                    this.$emit('loaded');
                });
            });
        },

        /**
         * Get the contents of the SVG
         * @param {string} url
         * @returns {Promise<Element>}
         */
        download(url) {
            return new Promise((resolve, reject) => {
                const request = new XMLHttpRequest();
                request.open('GET', url, true);

                request.onload = function requestOnload() {
                    if (request.status >= 200 && request.status < 400) {
                        // Setup a parser to convert the response to text/xml in order for it to be manipulated and changed
                        const parser = new DOMParser();
                        const result = parser.parseFromString(request.responseText, 'text/xml');
                        const svgEl = result.getElementsByTagName('svg')[0];
                        resolve(svgEl);
                    } else {
                        reject();
                    }
                };

                request.onerror = reject;

                request.send();
            });
        },


    },
};

const InlineSvgPlugin = {
    install(Vue) {
        Vue.component('inline-svg', InlineSvgComponent);
    },
};

export { InlineSvgComponent as default, InlineSvgComponent, InlineSvgPlugin };
