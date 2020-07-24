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
                attrs: Object.assign(this.getSvgAttrs(this.svgElSource), filterAttrs(this.$attrs)),
                domProps: {
                    innerHTML: this.getSvgContent(this.svgElSource),
                },
            },
        );
    },
    props: {
        src: {
            type: String,
            required: true,
        },
        title: {
            type: String,
        },
        transformSource: {
            type: Function,
            default: (svg) => svg,
        },
    },
    data() {
        return {
            isLoaded: false,
            /** @type SVGElement */
            svgElSource: null,
        };
    },
    watch: {
        src(newValue) {
            // re-generate cached svg (`svgElSource`)
            this.cacheSource(newValue);
        },
    },
    mounted() {
        // generate inline svg
        this.cacheSource(this.src);
    },
    methods: {
        getSvgAttrs(svgEl) {
            // copy attrs
            let svgAttrs = {};
            const attrs = svgEl?.attributes;
            if (!attrs) {
                return svgAttrs;
            }
            for (let i = attrs.length - 1; i >= 0; i--) {
                svgAttrs[attrs[i].name] = attrs[i].value;
            }
            return svgAttrs;
        },
        getSvgContent(svgEl) {
            if (!svgEl) {
                return '';
            }
            svgEl = svgEl.cloneNode(true);
            svgEl = this.transformSource(svgEl);
            if (this.title) {
                setTitle(svgEl, this.title);
            }

            // copy inner html
            return svgEl.innerHTML;
        },
        /**
         * Get svgElSource
         * @param {string} src
         */
        cacheSource(src) {
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
                    this.svgElSource = svg;
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
                                // svgEl = this.transformSource(svgEl);
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

/**
 * Create or edit the <title> element of a SVG
 * @param {SVGElement} svg
 * @param {string} title
 */
function setTitle(svg, title) {
    const titleTags = svg.getElementsByTagName('title');
    if (titleTags.length) { // overwrite existing title
        titleTags[0].textContent = title;
    } else { // create a title element if one doesn't already exist
        const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleEl.textContent = title;
        svg.appendChild(titleEl);
    }
}

const InlineSvgPlugin = {
    install(Vue) {
        Vue.component('inline-svg', InlineSvgComponent);
    },
};

export { InlineSvgComponent as default, InlineSvgComponent, InlineSvgPlugin };
