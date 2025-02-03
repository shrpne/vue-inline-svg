import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import InlineSvg from '../src/InlineSvg.vue';


const svgContentMap = {
    'test.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>',
    'rect.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect x="50" y="50" width="100" height="100"/></svg>',
    'poly.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"><polygon points="75,20 150,130 0,130"/></svg>',
};

class MockXMLHttpRequest {
    static loadXhrWithDelay = false;
    onload: () => void = () => {
    };
    onerror: () => void = () => {
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
        if (svgContentMap[this.url]) {
            this.responseText = svgContentMap[this.url];
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

describe('InlineSvg', () => {


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
        console.log('TITLE:', ctx.task.name);

        // reset
        console.log('loadXhrWithDelay = false');
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
                src: 'test.svg',
            },
        });
        await waitForSvgLoad();
        expect(typeof wrapper.vm.svgElSource).toBe('object');

        // request notexistent to bypass cache
        wrapper.setProps({
            src: 'notexistent.svg',
        });
        await waitForSvgLoad();
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
        const transformSource = vi.fn((svg: Element) => {
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

    // @TODO must clear svg load cache to test it properly
    it.skip('handles keepDuringLoading prop correctly', async () => {
        const wrapper = mount(InlineSvg, {
            props: {
                src: 'test.svg',
                keepDuringLoading: false,
            },
        });

        await waitForSvgLoad();

        console.log('loadXhrWithDelay = true');
        MockXMLHttpRequest.loadXhrWithDelay = true;
        // Change src to trigger a new load
        await wrapper.setProps({ src: 'poly.svg' });
        await nextTick();
        console.log('check', wrapper.html(), wrapper.find('svg').exists());

        // Verify SVG is removed and unloaded event is emitted
        expect(wrapper.find('svg').exists()).toBe(false);
        expect(wrapper.emitted()).toHaveProperty('unloaded');

        // Complete the new SVG load
        await waitForSvgLoad();

        // Verify new SVG is loaded
        expect(wrapper.find('svg').exists()).toBe(true);
    });
});

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
