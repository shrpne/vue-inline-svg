import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import InlineSvg from '../src/InlineSvg.vue';

describe('InlineSvg', () => {
    const svgContentMap = {
        'test.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="red"><circle cx="50" cy="50" r="40"/></svg>',
        'rect.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect x="50" y="50" width="100" height="100"/></svg>',
        'poly.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"><polygon points="75,20 150,130 0,130"/></svg>',
    };

    class MockXMLHttpRequest {
        static callCount: number = 0;
        static loadXhrWithDelay = false;

        constructor() {
            MockXMLHttpRequest.callCount += 1;
        }

        onload() {
        };

        onerror() {
        };

        status: number = 200;
        url: string = '';
        responseText: string = '';

        open(_method: string, url: string): void {
            this.url = url;
        }

        send(): void {
            if (MockXMLHttpRequest.loadXhrWithDelay) {
                setTimeout(() => this._loadResponse(), 500);
            } else {
                this._loadResponse();
            }
        }

        _loadResponse(): void {
            const [path, query] = this.url.split('?');
            if (svgContentMap[path]) {
                this.responseText = svgContentMap[path];
                this.status = 200;
            } else {
                // this.responseText = 'Not Found';
                this.status = 404;
            }
            if (this.status === 200) {
                this.onload?.();
            } else {
                this.onerror?.();
            }
        }
    }

    vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest);

    vi.stubGlobal('DOMParser', function() {
        return {
            parseFromString: function(text: string) {
                const mockSvgElementContainer = document.createElement('div');
                mockSvgElementContainer.innerHTML = text;
                return mockSvgElementContainer;
            },
        };
    });

    beforeEach((ctx) => {
        // reset
        MockXMLHttpRequest.loadXhrWithDelay = false;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    async function waitForSvgLoad(): Promise<void> {
        if (MockXMLHttpRequest.loadXhrWithDelay) {
            await wait(1000);
        }
        await nextTick();
        await nextTick();
        await nextTick(); // Extra tick for component updates
    }

    it('renders SVG when src is provided', async () => {
        const wrapper = mount(InlineSvg, {
            props: {
                src: 'test.svg',
            },
        });
        await waitForSvgLoad();
        expect(wrapper.html()).toContain('svg');
    });

    it('renders nothing when src is not provided', async () => {
        const wrapper = mount(InlineSvg, {
            props: {
                src: '',
            },
        });
        await waitForSvgLoad();
        expect(wrapper.find('svg').exists()).toBe(false);
    });

    it('exposes svgElSource and request values', async () => {
        const wrapper = mount(InlineSvg, {
            props: {
                // add query to bypass cache and always have request exposed
                src: 'test.svg?' + Math.random(),
            },
        });
        await waitForSvgLoad();
        expect(typeof wrapper.vm.svgElSource).toBe('object');
        expect(typeof wrapper.vm.request).toBe('object');
    });

    it('emits loaded event after successful SVG load', async () => {
        const wrapper = mount(InlineSvg, {
            props: {
                src: 'test.svg',
            },
        });
        await waitForSvgLoad();
        const emitted = wrapper.emitted();
        expect(emitted).toHaveProperty('loaded');
    });

    it('emits different DOM elements for multiple InlineSvg components', async () => {
        // Mount first component
        const wrapper1 = mount(InlineSvg, {
            props: {
                src: 'test.svg',
            },
        });
        await waitForSvgLoad();
        const emitted1 = wrapper1.emitted('loaded')[0][0] as SVGElement;

        // Mount second component
        const wrapper2 = mount(InlineSvg, {
            props: {
                src: 'test.svg',
            },
        });
        await waitForSvgLoad();
        const emitted2 = wrapper2.emitted('loaded')[0][0] as SVGElement;

        // Mount third component
        const wrapper3 = mount(InlineSvg, {
            props: {
                src: 'rect.svg',
            },
        });
        await waitForSvgLoad();
        const emitted3 = wrapper3.emitted('loaded')[0][0] as SVGElement;


        // 1st and 2nd emitted have same html
        expect(emitted1.innerHTML).toEqual(emitted2.innerHTML);
        // 1st and 2nd emitted are different references
        expect(emitted1).not.toBe(emitted2);
        // Both should be valid SVG elements
        expect(emitted1 instanceof SVGElement).toBe(true);
        expect(emitted2 instanceof SVGElement).toBe(true);
        // 2st and 3nd emitted have different html
        expect(emitted2.innerHTML).not.toEqual(emitted3.innerHTML);
    });


    it('emits error event on SVG load failure', async () => {
        const wrapper = mount(InlineSvg, {
            props: {
                src: 'nonexistent.svg',
            },
        });
        await waitForSvgLoad();
        const emitted = wrapper.emitted();
        expect(emitted).toHaveProperty('error');
    });

    it('applies transformSource function to SVG', async () => {
        const transformSource = vi.fn((svg: SVGElement) => {
            svg.appendChild(document.createElement('path'));
            return svg;
        });

        const wrapper = mount(InlineSvg, {
            props: {
                src: 'test.svg',
                transformSource,
            },
        });

        await waitForSvgLoad();

        expect(transformSource).toHaveBeenCalled();
        expect(wrapper.find('path').exists()).toBe(true);
    });

    it('updates SVG when src prop changes', async () => {
        const wrapper = mount(InlineSvg, {
            props: {
                src: 'rect.svg',
            },
        });

        await waitForSvgLoad();

        await wrapper.setProps({ src: 'poly.svg' });

        await waitForSvgLoad();

        const emitted = wrapper.emitted();
        expect(emitted['loaded']).toHaveLength(2);
        expect(wrapper.find('polygon').exists()).toBe(true);
    });

    it('sets title when provided', async () => {
        const wrapper = mount(InlineSvg, {
            props: {
                src: 'test.svg',
                title: 'Test Title',
            },
        });

        await waitForSvgLoad();

        const titleElement = wrapper.find('title');
        expect(titleElement.exists()).toBe(true);
        expect(titleElement.text()).toBe('Test Title');
    });

    it('correctly merges attributes with root SVG element', async () => {
        const wrapper = mount(InlineSvg, {
            props: {
                src: 'test.svg',
            },
            attrs: {
                class: 'custom-class',
                width: '200',
                height: '200',
                'data-test': 'test-value',
                viewBox: '0 0 200 200', // This should override the original viewBox
                // falsy
                color: false,
                fill: null,

            },
        });

        await waitForSvgLoad();

        const svg = wrapper.find('svg');
        expect(svg.exists()).toBe(true);
        expect(svg.classes()).toContain('custom-class');
        expect(svg.attributes('width')).toBe('200');
        expect(svg.attributes('height')).toBe('200');
        expect(svg.attributes('data-test')).toBe('test-value');
        expect(svg.attributes('viewBox')).toBe('0 0 200 200');
        expect(svg.attributes('color')).toBeUndefined(); // falsy not applies
        expect(svg.attributes('fill')).toBe('red'); // falsy not overrides
        expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg'); // original preserved
    });

    it('correctly merges style attributes with root SVG element', async () => {
        svgContentMap['style-test.svg'] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="stroke: green; stroke-opacity: 0.5"><circle cx="50" cy="50" r="40"/></svg>';

        const wrapper = mount(InlineSvg, {
            props: {
                src: 'style-test.svg',
            },
            attrs: {
                style: {
                    stroke: "red",
                },
            },
        });

        await waitForSvgLoad();

        const svg = wrapper.find('svg');
        expect(svg.exists()).toBe(true);
        expect(svg.attributes('style')).toContain('stroke-opacity: 0.5');
        expect(svg.attributes('style')).toContain('stroke: red');
    });

    it('handles keepDuringLoading prop correctly', async () => {
        const wrapper = mount(InlineSvg, {
            props: {
                src: 'test.svg',
                keepDuringLoading: false,
            },
        });

        await waitForSvgLoad();

        MockXMLHttpRequest.loadXhrWithDelay = true;
        // Change src to trigger a new load (with cache-bust query)
        await wrapper.setProps({ src: 'poly.svg?' + Math.random()  });
        await nextTick();

        // Verify SVG is removed and unloaded event is emitted
        expect(wrapper.find('svg').exists()).toBe(false);
        expect(wrapper.emitted()).toHaveProperty('unloaded');

        // Complete the new SVG load
        await waitForSvgLoad();

        // Verify new SVG is loaded
        expect(wrapper.find('svg').exists()).toBe(true);
    });
    it('caches SVG after loading and reuses it', async () => {
        const cacheBustHash = Math.random();
        const src = `test.svg?${cacheBustHash}`;

        // Create spy on XMLHttpRequest
        MockXMLHttpRequest.callCount = 0;
        const wrapper = mount(InlineSvg, {
            props: {
                src,
            },
        });
        await waitForSvgLoad();

        expect(MockXMLHttpRequest.callCount).toBe(1);
        expect(wrapper.html()).toContain('svg');

        // Mount another component with same src
        const wrapper2 = mount(InlineSvg, {
            props: {
                src,
            },
        });
        await waitForSvgLoad();

        // Should use cached version without new XHR request
        expect(MockXMLHttpRequest.callCount).toBe(1);
        expect(wrapper2.html()).toContain('svg');
    });

    it('clears cache on error and allows retry', async () => {
        // First attempt with non-existent SVG
        MockXMLHttpRequest.callCount = 0;
        const wrapper = mount(InlineSvg, {
            props: {
                src: 'nonexistent.svg',
            },
        });
        await waitForSvgLoad();

        // Try loading same non-existent SVG again
        const wrapper2 = mount(InlineSvg, {
            props: {
                src: 'nonexistent.svg',
            },
        });
        await waitForSvgLoad();

        // Should attempt to load again since previous attempt failed and was cleared from cache
        expect(MockXMLHttpRequest.callCount).toBe(2);
    });

    describe('uniqueIds', () => {
        svgContentMap['unique-ids.svg'] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="gradient"><stop offset="0%" stop-color="red"/></linearGradient></defs><circle id="circle" fill="url(#gradient)" cx="50" cy="50" r="40"/></svg>';

        it('makes IDs unique when uniqueIds is true', async () => {
            const wrapper = mount(InlineSvg, {
                props: {
                    src: 'unique-ids.svg',
                    uniqueIds: true,
                },
            });
            await waitForSvgLoad();

            const svg = wrapper.find('svg');
            const circle = svg.find('circle');
            const gradient = svg.find('linearGradient');

            // check correct hash set on <linearGradient>
            const id = gradient.attributes('id');
            const match = id.match(/gradient(_[a-z0-9]+)/);
            const idSuffix = match ? match[1] : null;
            expect(idSuffix).not.toBeNull();

            // Check that the reference has been updated
            expect(circle.attributes('fill')).toMatch(`url(#gradient${idSuffix})`);
        });

        it('uses custom hash for uniqueIds when string is provided', async () => {
            const wrapper = mount(InlineSvg, {
                props: {
                    src: 'unique-ids.svg',
                    uniqueIds: 'custom-hash',
                },
            });
            await waitForSvgLoad();

            const circle = wrapper.find('circle');
            expect(circle.attributes('id')).toBe('circle_custom-hash');
            expect(circle.attributes('fill')).toBe('url(#gradient_custom-hash)');
        });

        it('handles uniqueIds with baseURL', async () => {
            svgContentMap['base-url.svg'] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><use href="/assets/icons.svg#icon" xlink:href="/sprites.svg#sprite"/></svg>';

            const wrapper = mount(InlineSvg, {
                props: {
                    src: 'unique-ids.svg',
                    uniqueIds: 'test-hash',
                    uniqueIdsBase: 'https://example.com/',
                },
            });
            await waitForSvgLoad();

            const circle = wrapper.find('circle');
            expect(circle.attributes('fill')).toBe('url(https://example.com/#gradient_test-hash)');
        });
    });

});


function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
