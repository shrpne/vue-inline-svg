import { h as createElement, ref, watch, nextTick, defineComponent } from 'vue';

/**
 * @import { Ref } from 'vue';
 */

/** @type {Record<string, PromiseWithState<Element>>} */
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

const InlineSvg = defineComponent({
    name: 'InlineSvg',
    inheritAttrs: false,
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
        keepDuringLoading: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['loaded', 'unloaded', 'error'],
    setup(props, { attrs, emit, expose }) {
        /** @type {Ref<SVGElement>} */
        const svgElSource = ref();
        /** @type {Ref<XMLHttpRequest>} */
        const requestStored = ref();

        expose({
            svgElSource,
            request: requestStored,
        });

        watch(() => props.src, (newValue) => {
            // re-generate cached svg (`svgElSource`)
            getSource(newValue);
        });

        // Initial load
        // generate `svgElSource`
        getSource(props.src);

        /**
         * @param {SVGElement} svgEl
         * @return {Record<string, string>|object}
         */
        function getSvgAttrs(svgEl) {
            // copy attrs
            let svgAttrs = {};
            const attrs = svgEl.attributes;
            if (!attrs) {
                return svgAttrs;
            }
            for (let i = attrs.length - 1; i >= 0; i--) {
                svgAttrs[attrs[i].name] = attrs[i].value;
            }
            return svgAttrs;
        }

        /**
         * @param {SVGElement} svgEl
         * @return {string}
         */
        function getSvgContent(svgEl) {
            svgEl = /** @type {SVGElement}} */ (svgEl.cloneNode(true));
            svgEl = props.transformSource(svgEl);
            if (props.title) {
                setTitle(svgEl, props.title);
            }

            // copy inner html
            return svgEl.innerHTML;
        }

        /**
         * Get svgElSource
         * @param {string} src
         */
        function getSource(src) {
            // fill cache by src with promise
            if (!cache[src]) {
                // download
                cache[src] = download(src);
            }

            // notify svg is unloaded
            if (svgElSource.value && cache[src].getIsPending() && !props.keepDuringLoading) {
                svgElSource.value = null;
                emit('unloaded');
            }

            // inline svg when cached promise resolves
            cache[src]
                .then((svg) => {
                    svgElSource.value = svg;
                    // wait to render
                    nextTick(() => {
                        // notify
                        emit('loaded', document.querySelector('svg'));
                    });
                })
                .catch((err) => {
                    // notify svg is unloaded
                    if (svgElSource.value) {
                        svgElSource.value = undefined;
                        emit('unloaded');
                    }
                    // remove cached rejected promise so next image can try load again
                    delete cache[src];
                    emit('error', err);
                });
        }

        /**
         * Get the contents of the SVG
         * @param {string} url
         * @returns {PromiseWithState<Element>}
         */
        function download(url) {
            return makePromiseState(new Promise((resolve, reject) => {
                const request = new XMLHttpRequest();
                request.open('GET', url, true);
                requestStored.value = request;

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
            }));
        }



        return () => {
            if (!svgElSource.value) {
                return null;
            }

            return createElement(
                'svg',
                Object.assign(
                    {},
                    // source attrs
                    getSvgAttrs(svgElSource.value),
                    // component attrs and listeners
                    filterAttrs(attrs),
                    // content
                    { innerHTML: getSvgContent(svgElSource.value) },
                ),
            );
        };
    },
});

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
        // svg.prepend(titleEl);
        svg.insertBefore(titleEl, svg.firstChild);
    }
}

/**
 * @typedef {Promise & object} PromiseWithState
 * @property {function: boolean} getIsPending
 * @template T
 */

/**
 * This function allow you to modify a JS Promise by adding some status properties.
 * @template {any} T
 * @param {Promise<T>|PromiseWithState<T>} promise
 * @return {PromiseWithState<T>}
 */
function makePromiseState(promise) {
    // Don't modify any promise that has been already modified.
    if (promise.getIsPending) return promise;

    // Set initial state
    let isPending = true;

    // Observe the promise, saving the fulfillment in a closure scope.
    let result = promise.then(
        (v) => {
            isPending = false;
            return v;
        },
        (e) => {
            isPending = false;
            throw e;
        },
    );

    result.getIsPending = function getIsPending() {
        return isPending;
    };
    return result;
}

export default InlineSvg;
