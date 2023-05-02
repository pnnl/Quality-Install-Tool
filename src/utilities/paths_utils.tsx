import { isUndefined, toPath } from 'lodash'

/**
 * Utility function used to convert a string path into a string 
 * suitable as an html id value
 * 
 * @param prefix A string used as a first path component
 * @param path A string representing a path into a JSON-like object
 * (e.g. ""location[1].state"")
 * @param separator String used to separate the path components (default: "-")
 * @returns 
 */
export function pathToId(prefix: string = "path", path: string): string {
  return [prefix, ...toPath(path)].join("-")
}