import { toPath } from 'lodash'

/**
 * Converts a JSON path to a DOM element ID.
 *
 * @param {string} path - A JSON path, e.g., "location[1].state".
 * @param {string} prefix - An optional prefix for the DOM element ID (default:
 *     "path").
 * @param {string} separator An optional separator for the prefix and the
 *     segments of the JSON path.
 * @returns {string} A DOM element ID.
 */
export function pathToId(
    path: string,
    prefix: string = 'path',
    separator: string = '-',
): string {
    return [prefix, ...toPath(path)].join(separator)
}
