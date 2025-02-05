/**
 * @param {SVGElement} svgEl
 * @return {Record<string, string>|object}
 */
function getSvgAttrs(svgEl: SVGElement): Record<string, string> {
    // copy attrs
    let svgAttrs: Record<string, string> = {};
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
 * Remove false attrs
 * @param {Object} attrs
 */
function filterAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
    return Object.keys(attrs).reduce((result, key) => {
        if (attrs[key] !== false && attrs[key] !== null && attrs[key] !== undefined) {
            result[key] = attrs[key];
        }
        return result;
    }, {} as Record<string, unknown>);
}

export function mergeAttrs(svgEl: SVGElement, attrs: Record<string, unknown>): Record<string, unknown> {
    const { class: svgClass, style: svgStyle, ...otherSvgAttrs } = getSvgAttrs(svgEl);
    const { class: componentClass, style: componentStyle, ...otherComponentAttrs } = filterAttrs(attrs);

    return {
        class: [svgClass, componentClass],
        style: [svgStyle, componentStyle],
        ...otherSvgAttrs,
        ...otherComponentAttrs,
    };
}
