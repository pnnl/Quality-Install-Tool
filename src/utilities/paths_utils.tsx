import { isUndefined, toPath } from 'lodash'

/**
 * Utility function used to convert a string path into a string 
 * suitable as an html id value
 * 
 * @param path A string representing a path into a JSON-like object
 * (e.g. ""location[1].state"")
 * @param prefix (OPTIONAL) A string used as a first path component (default: "path")
 * @param separator (OPTIONAL) String used to separate the path components (default: "-")
 * @returns 
 */
export function pathToId(path: string, prefix?: string, separator?:string): string {
  if (!prefix){
    prefix = "path";
  }
  if(!separator){
    separator = "-"
  }
  return [prefix, ...toPath(path)].join(separator)
}