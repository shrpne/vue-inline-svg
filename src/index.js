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
                attrs: Object.assign(this.svgAttrs, filterAttrs(this.$attrs)),
                domProps: {
                    innerHTML: this.svgContent,
                },
            },
        );
    },
    props: {
        src: {
            type: String,
            required: true,
        },
        transformSource: {
            type: Function,
            default: (svg) => svg,
        },
    },
    data() {
        return {
            isLoaded: false,
            svgAttrs: {},
            svgContent: '',
        };
    },
    watch: {
        src(newValue) {
            // re-generate inline svg
            this.inline(newValue);
        },
    },
    mounted() {
        // generate inline svg
        this.inline(this.src);
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
                cache[src] = this.download(src);
            }

            // inline svg when cached promise resolves
            cache[src]
                .then((svg) => {
                    // copy attrs
                    this.svgAttrs = {};
                    const attrs = svg.attributes;
                    for (let i = attrs.length - 1; i >= 0; i--) {
                        this.svgAttrs[attrs[i].name] = attrs[i].value;
                    }
                    // copy inner html
                    this.svgContent = svg.innerHTML;
                    // render svg element
                    this.isLoaded = true;
                    // wait to render
                    this.$nextTick(() => {
                        // notify
                        this.$emit('loaded', this.$el);
                    });
                })
                .catch((err) => {
                    // remove cached rejected promise so next image can try load again
                    delete cache[src];
                    this.$emit('error', err);
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

                request.onload = () => {
                    if (request.status >= 200 && request.status < 400) {
                        try {
                            // Setup a parser to convert the response to text/xml in order for it to be manipulated and changed
                            const parser = new DOMParser();
                            const result = parser.parseFromString(request.responseText, 'text/xml');
                            let svgEl = result.getElementsByTagName('svg')[0];
                            if (svgEl) {
                                svgEl = this.transformSource(svgEl);
                                resolve(svgEl);
                            } else {
                                reject(new Error('Loaded file is not valid SVG"'));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error('Error loading SVG'));
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
