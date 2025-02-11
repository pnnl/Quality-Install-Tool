import { isObject, toPath } from 'lodash'

type NonEmptyArray<T> = [T, ...Array<T>]

function _immutableUpsert<T>(
    path: NonEmptyArray<string>,
    sender: T,
    value: any,
): T {
    const [propName, ...nextPath] = path

    const receiver: any = isObject(sender)
        ? Array.isArray(sender)
            ? [...sender]
            : { ...sender }
        : isNaN(parseInt(propName))
          ? {}
          : []

    receiver[propName] =
        nextPath.length === 0
            ? value
            : _immutableUpsert(
                  nextPath as NonEmptyArray<string>,
                  receiver[propName],
                  value,
              )

    return receiver
}

export function immutableUpsert<T>(path: string, sender: T, value: any): T {
    return _immutableUpsert(
        toPath(path) as NonEmptyArray<string>,
        sender,
        value,
    )
}

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
