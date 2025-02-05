/** @type {Record<string, PromiseWithState<SVGSVGElement>>} */
export const cache: Record<string, PromiseWithState<SVGSVGElement>> = {};

export interface PromiseWithState<T> extends Promise<T> {
    getIsPending: () => boolean;
}

function isPromiseWithState<T>(promise: Promise<T> | PromiseWithState<T>): promise is PromiseWithState<T> {
    return promise['getIsPending'] !== undefined;
}

/**
 * This function allow you to modify a JS Promise by adding some status properties.
 * @template {any} T
 * @param {Promise<T>|PromiseWithState<T>} promise
 * @return {PromiseWithState<T>}
 */
export function makePromiseState<T>(promise: Promise<T> | PromiseWithState<T>): PromiseWithState<T> {
    // Don't modify any promise that has been already modified.
    if (isPromiseWithState(promise)) {
        return promise;
    }

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
    ) as PromiseWithState<T>;

    result.getIsPending = function getIsPending() {
        return isPending;
    };
    return result;
}
