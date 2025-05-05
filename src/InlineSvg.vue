<script setup lang="ts">
import { h as createElement, ref, watch, nextTick, useAttrs } from "vue";
import {cache, makePromiseState, type PromiseWithState} from "./cache.ts";
import { mergeAttrs } from './utils.ts';

/**
 * @import { Ref } from 'vue';
 */

defineOptions({
    inheritAttrs: false,
});

interface Props {
    src: string;
    title?: string;
    transformSource?: (svg: SVGElement) => SVGElement;
    keepDuringLoading?: boolean;
    uniqueIds?: boolean|string;
    uniqueIdsBase?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: undefined,
    transformSource: (svg: SVGElement) => svg,
    keepDuringLoading: true,
    uniqueIds: false,
    uniqueIdsBase: '',
});

const emit = defineEmits<{
    loaded: [svg: SVGElement | null];
    unloaded: [];
    error: [error: Error];
}>();

const attrs = useAttrs();

/** @type {Ref<SVGElement>} */
const svgElSource = ref<SVGElement>();
const svgRendered = ref<SVGElement>();
/** @type {Ref<XMLHttpRequest>} */
const requestStored = ref<XMLHttpRequest>();
const uniqueIdHash = Math.random().toString(36).substring(2);

defineExpose({
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
 * @return {string}
 */
function getSvgContent(svgEl: SVGElement): string {
    svgEl = /** @type {SVGElement}} */ (svgEl.cloneNode(true) as SVGElement);
    if (props.uniqueIds) {
        const hash = typeof props.uniqueIds === 'string' ? props.uniqueIds : uniqueIdHash;
        svgEl = setUniqueIds(svgEl, hash, props.uniqueIdsBase);
    }
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
function getSource(src: string): void {
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
                emit('loaded', svgRendered.value);
            });
        })
        .catch((err: Error) => {
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
function download(url: string): PromiseWithState<SVGSVGElement> {
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


const render = () => {
    if (!svgElSource.value) {
        return null;
    }

    return createElement(
        'svg',
        {
            ...mergeAttrs(svgElSource.value, attrs),
            innerHTML: getSvgContent(svgElSource.value),
            ref: svgRendered,
        },
    );
};

/**
 * Create or edit the <title> element of an SVG
 * @param {SVGElement} svg
 * @param {string} title
 */
function setTitle(svg: SVGElement, title: string): void {
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

function setUniqueIds(
    node: SVGElement,
    hash: string,
    baseURL = '',
): SVGElement {
    const replaceableAttributes = ['id', 'href', 'xlink:href', 'xlink:role', 'xlink:arcrole'];
    const linkAttributes = ['href', 'xlink:href'];
    const isDataValue = (name: string, value: string) => {
        return linkAttributes.includes(name) && (value ? !value.includes('#') : false);
    };

    [...node.children].forEach((el) => {
        if (el.attributes?.length) {
            const attributes = Object.values(el.attributes).map((attr) => {
                const match = /url\((.*?)\)/.exec(attr.value);

                if (match?.[1]) {
                    attr.value = attr.value.replace(match[0], `url(${baseURL}${match[1]}_${hash})`);
                }

                return attr;
            });

            replaceableAttributes.forEach((replaceableAttrName) => {
                const attribute = attributes.find((attr) => attr.name === replaceableAttrName);

                if (attribute && !isDataValue(replaceableAttrName, attribute.value)) {
                    attribute.value = `${attribute.value}_${hash}`;
                }
            });
        }

        if (el.children.length) {
            return setUniqueIds(el as SVGElement, hash, baseURL);
        }

        return el;
    });

    return node;
}

</script>

<template>
    <render/>
</template>

<!-- saving some few by using render function instead
<svg
    v-if="svgElSource"
    v-bind="getFinalAttrs()"
    v-html="getSvgContent(svgElSource)"
/>
-->
