import { isUndefined, toPath } from 'lodash'

const pathRegex = /^.{1,64}$/ //TODO: decide on what regex to use.
const prefixRegex = /^.{1,64}$/ //TODO: decide on what regex to use.
const separatorRegex = /^.{1,64}$/ //TODO: decide on what regex to use.

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
  if(!pathRegex.test(path)){
    throw new Error("path name " + path +" is not allowed"); //TODO: decide what to do when not pass
  } else if(!prefixRegex.test(prefix)){
    throw new Error("prefix name " + prefix +" is not allowed"); //TODO: decide what to do when not pass
  } else if(!separatorRegex.test(separator)){
    throw new Error("separator char " + separator + " is not allowed"); //TODO: decide what to do when not pass
  }
  else {
    return [prefix, ...toPath(path)].join(separator)
  }
}